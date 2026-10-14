const fs = require("node:fs");
function RegistroReporter() {
  let catalogo = {},
    resultados = [];
  this.onRunStart = () => {
    resultados = [];
  };
  this.onBrowserInfo = (_, informacion) => {
    for (const caso of informacion.catalogoCasos || [])
      catalogo[caso.id] = caso;
  };
  this.onSpecComplete = (navegador, resultado) => {
    const id = resultado.description.match(/^PU-\d+/)?.[0];
    if (!id) return;
    resultados.push({
      ...(catalogo[id] || { id, nombre: resultado.description }),
      estado: resultado.skipped
        ? "Omitida"
        : resultado.success
          ? "Aprobada"
          : "Fallida",
      duracionMs: resultado.time,
      errores: resultado.log,
      navegador: navegador.name,
    });
  };
  this.onRunComplete = (_, resultado) => {
    fs.mkdirSync("docs", { recursive: true });
    fs.writeFileSync(
      "docs/resultados-pruebas.json",
      JSON.stringify(
        {
          fecha: new Date().toISOString(),
          zonaHoraria: "America/Santiago",
          herramienta: "Jasmine y Karma",
          total: resultados.length,
          aprobadas: resultados.filter((caso) => caso.estado === "Aprobada")
            .length,
          fallidas: resultados.filter((caso) => caso.estado === "Fallida")
            .length,
          errorEjecucion: Boolean(resultado.error),
          casos: resultados,
        },
        null,
        2,
      ) + "\n",
    );
  };
}
RegistroReporter.$inject = [];
module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      { "reporter:registro": ["type", RegistroReporter] },
    ],
    files: [
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      ".tests/pruebas.css",
      ".tests/pruebas.js",
      { pattern: "public/**/*", included: false, served: true, watched: false },
    ],
    proxies: Object.fromEntries(
      [
        "Inicio",
        "Pasteleria",
        "Panaderia",
        "Salados",
        "SinAzucar",
        "PerfilUsuario",
        "SobreNosotros",
      ].map((carpeta) => [
        "/" + carpeta + "/",
        "/base/public/" + carpeta + "/",
      ]),
    ),
    reporters: ["progress", "coverage", "registro"],
    browsers: ["ChromeHeadless"],
    singleRun: true,
    autoWatch: false,
    client: { jasmine: { random: false } },
    browserNoActivityTimeout: 60000,
    coverageReporter: {
      dir: "test-results/coverage",
      subdir: ".",
      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "json-summary" },
      ],
    },
  });
};
