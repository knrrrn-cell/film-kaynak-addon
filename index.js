
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "community.film-kaynak-addon",
  version: "1.0.2",
  name: "Film Kaynak Tarayici",
  description: "Otomatik film ve dizi kaynak tarayici",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  console.log("Film/dizi turu:", type);
  console.log("Stremio kimligi:", id);

  // Gercek site tarayicilari sonraki asamada eklenecek.
  return {
    streams: []
  };
});

serveHTTP(builder.getInterface(), {
  port: process.env.PORT || 7000
});
