import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";

export async function iniciarSitio() {
  assert.ok(
    existsSync("dist/index.html"),
    "Ejecuta npm run build antes de las pruebas.",
  );
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const base = "http://127.0.0.1:" + port;
  const server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let log = "",
    fallo;
  server.on("error", (error) => {
    fallo = error;
  });
  server.stdout.on("data", (data) => {
    log += data;
  });
  server.stderr.on("data", (data) => {
    log += data;
  });
  let browser;
  async function cerrar() {
    await browser?.close();
    if (server.exitCode === null && server.pid) {
      server.kill();
      await once(server, "exit");
    }
  }
  try {
    let listo = false;
    for (let intento = 0; intento < 100; intento++) {
      if (fallo) throw fallo;
      if (server.exitCode !== null)
        throw new Error("El servidor terminó: " + log);
      try {
        listo = (await fetch(base)).ok;
      } catch {}
      if (listo) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(listo, "El servidor no arrancó: " + log);
    const executablePath = process.env.CHROME_BIN;
    const channel =
      !executablePath &&
      !existsSync(chromium.executablePath()) &&
      process.platform === "win32"
        ? "chrome"
        : undefined;
    browser = await chromium.launch({
      headless: true,
      executablePath,
      channel,
    });
    return { browser, base, cerrar };
  } catch (error) {
    await cerrar();
    throw error;
  }
}
