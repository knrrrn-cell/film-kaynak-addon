const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const BASE_URL = "https://www.dizigom.news";

const manifest = {
id: "community.film-kaynak-addon",
version: "1.3.0",
name: "Film Kaynak Tarayıcı",
description: "Film, dizi ve anime katalogları",
resources: ["catalog", "meta", "stream"],
types: ["movie", "series"],
catalogs: [
{
type: "movie",
id: "dizigom-filmler",
name: "Dizigom Filmler"
},
{
type: "series",
id: "dizigom-diziler",
name: "Dizigom Diziler"
},
{
type: "series",
id: "dizigom-animeler",
name: "Dizigom Animeler"
}
],
idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ type, id }) => {
const pages = {
"dizigom-filmler": "/filmler",
"dizigom-diziler": "/dizi-izle/",
"dizigom-animeler": "/animes"
};

const path = pages[id];

if (!path) {
return { metas: [] };
}

console.log("Katalog isteği:", id, type);
console.log("Katalog sayfası:", BASE_URL + path);

// İçeriklerin IMDb kimlikleri henüz doğrulanmadığı için
// yanlış eşleşme veya sahte katalog kaydı üretmiyoruz.
return { metas: [] };
});

builder.defineStreamHandler(async ({ type, id }) => {
try {
const imdbId = id.split(":")[0];

```
if (!/^tt\d+$/.test(imdbId)) {
  return { streams: [] };
}

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
].filter(
  title => typeof title === "string" && title.trim()
);

console.log("IMDb:", imdbId);
console.log("Tür:", type);
console.log("Aranacak isimler:", [...new Set(titles)]);

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
