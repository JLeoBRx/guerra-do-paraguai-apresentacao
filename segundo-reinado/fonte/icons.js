// Renders react-icons (Game Icons set) to PNG data URIs for pptxgenjs.
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const gi = require("react-icons/gi");

const cache = new Map();
async function icon(name, hex, px = 256) {
  const key = `${name}-${hex}-${px}`;
  if (cache.has(key)) return cache.get(key);
  const Comp = gi[name];
  if (!Comp) throw new Error(`icon ${name} not found`);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: px }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  cache.set(key, data);
  return data;
}
module.exports = { icon };
