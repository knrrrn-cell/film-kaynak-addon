
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
  id: "community.film-kaynak-addon",
  version: "1.2.0",
  name: "Film Kaynak Tarayıcı",
  description: "Film ve dizi arama altyapısı",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  try {
    const imdbId = id.split(":")[0];

    const response = await fetch(
      `https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`
    );

    if (!response.ok) {
      throw new Error(`Cinemeta HTTP ${response.status}`);
    }

    const data = await response.json();
    const meta = data.meta || {};

    const titles = [
      meta.name,
      meta.originalName,
      ...(Array.isArray(meta.aliases) ? meta.aliases : [])
    ].filter(title => typeof title === "string" && title.trim());

    const uniqueTitles = [...new Set(titles)];

    console.log("Tür:", type);
    console.log("IMDb:", imdbId);
    console.log("Aranacak isimler:", uniqueTitles);
    console.log("Tam kimlik:", id);

    // Sonraki aşamada izin verilen kaynak aramaları eklenecek.
    return { streams: [] };

  } catch (error) {
    console.error("İstek hatası:", error.message);
    return { streams: [] };
  }
});

serveHTTP(builder.getInterface(), {
  port: process.env.PORT || 7000
});
