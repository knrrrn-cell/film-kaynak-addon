const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const manifest = {
id: "community.film-kaynak-addon",
version: "1.2.1",
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

```
const url = `https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`;
const response = await fetch(url);

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

console.log("Tür:", type);
console.log("IMDb:", imdbId);
console.log("Aranacak isimler:", [...new Set(titles)]);
console.log("Tam kimlik:", id);

return { streams: [] };
```

} catch (error) {
console.error("İstek hatası:", error.message);
return { streams: [] };
}
});

serveHTTP(builder.getInterface(), {
port: process.env.PORT || 7000
});
