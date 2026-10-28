import { spawn } from "node:child_process";
import { once } from "node:events";
for (const argumentos of [
  ["scripts/pruebas-unitarias.mjs"],
  [
    "--test",
    "--test-concurrency=1",
    "tests/router.test.mjs",
    "tests/styles.test.mjs",
    "tests/tienda.test.mjs",
  ],
]) {
  const proceso = spawn(process.execPath, argumentos, { stdio: "inherit" });
  const [codigo] = await once(proceso, "exit");
  if (codigo !== 0) {
    process.exitCode = codigo || 1;
    break;
  }
}
