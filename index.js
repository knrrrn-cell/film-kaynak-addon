
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

const builder = new addonBuilder({
  id: "community.film-kaynak-addon",
  version: "1.0.1",
  name: "Film Kaynak Tarayici",
  description: "Kisisel kaynak tarayicim",
  resources: ["stream"],
  types: ["movie"],
  catalogs: [],
  idPrefixes: ["tt"]
});

builder.defineStreamHandler(({ type, id }) => {
  console.log("Stream istegi:", type, id);

  if (type === "movie" && id === "tt1254207") {
    return {
      streams: [{
        name: "Test Kaynagi",
        title: "Ornek video",
        url: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
      }]
    };
  }

  return { streams: [] };
});

serveHTTP(builder.getInterface(), {
  port: process.env.PORT || 7000
});
