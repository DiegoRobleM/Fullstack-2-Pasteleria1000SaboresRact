import { build, transform } from "esbuild";
import karma from "karma";
import { createInstrumenter } from "istanbul-lib-instrument";
import { existsSync } from "node:fs";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(raiz);
if (!process.env.CHROME_BIN) {
  const opciones =
    process.platform === "win32"
      ? [
          process.env.PROGRAMFILES + "/Google/Chrome/Application/chrome.exe",
          process.env["PROGRAMFILES(X86)"] +
            "/Microsoft/Edge/Application/msedge.exe",
          process.env.LOCALAPPDATA + "/Google/Chrome/Application/chrome.exe",
        ]
      : [
          "/usr/bin/google-chrome",
          "/usr/bin/chromium",
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        ];
  process.env.CHROME_BIN = opciones.find(existsSync) || "";
}
if (!process.env.CHROME_BIN)
  throw new Error("Instala Chrome/Edge o define CHROME_BIN.");
await mkdir(".tests", { recursive: true });
await build({
  absWorkingDir: raiz,
  entryPoints: [path.join(raiz, "tests/unitarias/index.jsx")],
  bundle: true,
  outfile: path.join(raiz, ".tests/pruebas.js"),
  format: "iife",
  jsx: "automatic",
  sourcemap: "inline",
  loader: { ".css": "local-css" },
  tsconfigRaw: { compilerOptions: { jsx: "react-jsx" } },
  define: { "process.env.NODE_ENV": '"test"' },
  plugins: [
    {
      name: "cobertura",
      setup(constructor) {
        constructor.onLoad(
          { filter: /\.(js|jsx)$/ },
          async ({ path: archivo }) => {
            if (!archivo.startsWith(path.join(raiz, "src") + path.sep)) return;
            const texto = await readFile(archivo, "utf8");
            const transformado = await transform(texto, {
              loader: archivo.endsWith(".jsx") ? "jsx" : "js",
              jsx: "automatic",
            });
            const instrumentador = createInstrumenter({
              esModules: true,
              compact: false,
            });
            return {
              contents: instrumentador.instrumentSync(
                transformado.code,
                archivo,
              ),
              loader: "js",
            };
          },
        );
      },
    },
  ],
});
const configuracion = await karma.config.parseConfig(
  path.join(raiz, "karma.conf.cjs"),
  {},
  { promiseConfig: true, throwErrors: true },
);
const codigo = await new Promise((resolver, rechazar) => {
  const servidor = new karma.Server(configuracion, resolver);
  servidor.start().catch(rechazar);
});
if (codigo === 0) await import("./informe-pruebas.mjs");
process.exitCode = codigo;
