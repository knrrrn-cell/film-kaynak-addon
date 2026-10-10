
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "community.film-kaynak-addon",
  version: "1.0.3",
  name: "Film Kaynak Tarayici",
  description: "Film ve dizi kaynak tarayici",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    // Dizi bolumlerinde kimlik tt...:sezon:bolum olabilir.
    const imdbId = id.split(":")[0];

    console.log("Tur:", type);
    console.log("IMDb:", imdbId);

    const response = await fetch(
      `https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`
    );

    if (!response.ok) {
      throw new Error(`Cinemeta HTTP ${response.status}`);
    }

    const data = await response.json();
    const title = data.meta?.name || "Film adi bulunamadi";

    console.log("Film/dizi adi:", title);
    console.log("Tam kimlik:", id);

    // Henuz gercek kaynak taramasi eklenmedi.
    return { streams: [] };
  } catch (error) {
    console.error("Kaynak istegi hatasi:", error.message);
    return { streams: [] };
  }
});

serveHTTP(builder.getInterface(), {
  port: process.env.PORT || 7000
});
