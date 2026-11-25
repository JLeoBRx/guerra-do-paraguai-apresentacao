#!/usr/bin/env node
// Gera js/images.js (legenda, ficha no Wikimedia Commons, crédito e licença) com as imagens usadas em index.html.
// As imagens e suas fichas vêm do site irmão ../segundo-reinado/ (preparadas por segundo-reinado/scripts/imagens.py).
// Uso (dentro de crise-do-segundo-reinado/): node scripts/imagens.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const load = (file) => {
  const box = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), box);
  return box.window.GP.IMAGES;
};
const source = load("../segundo-reinado/js/images.js");
const html = fs.readFileSync("index.html", "utf8");
const used = [...new Set([
  ...[...html.matchAll(/data-lightbox="([a-z0-9-]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/assets\/img\/([a-z0-9-]+)\.(?:jpg|png)/g)].map((m) => m[1]),
])].sort();
const reg = {};
for (const key of used) {
  if (!source[key]) throw new Error("Imagem sem ficha no registro de origem: " + key);
  reg[key] = source[key];
  const file = `assets/img/${key}.${source[key][4]}`;
  if (!fs.existsSync(file)) fs.copyFileSync(`../segundo-reinado/${file}`, file);
}
const js = "/* Registro das imagens: legenda, ficha no Wikimedia Commons, crédito curto, licença, formato e tamanho.\n" +
  "   Gerado por scripts/imagens.mjs — não edite à mão. */\n" +
  "window.GP = window.GP || {};\nwindow.GP.IMAGES = " + JSON.stringify(reg, null, 1) + ";\n";
fs.writeFileSync("js/images.js", js);
console.log(`js/images.js: ${used.length} imagens`);
