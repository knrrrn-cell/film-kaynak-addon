
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "community.film-kaynak-addon",
  version: "1.0.0",
  name: "Film Kaynak Tarayici",
  description: "Kisisel film ve dizi kaynak eklentim",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("Istek:", type, id);

  // Simdilik kaynak tarama sistemi eklenmedi.
  // Gercek kaynaklari sonraki adimda ekleyecegiz.
  return { streams: [] };
});

const port = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port });
