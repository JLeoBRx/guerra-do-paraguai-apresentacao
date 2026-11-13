#!/usr/bin/env node
// Carimba as referências de CSS e JS com ?v=<data-hora> para que, a cada publicação,
// o navegador e a CDN busquem os arquivos novos junto com o HTML novo.
// Uso (antes do commit de uma publicação): node scripts/stamp-version.mjs
import fs from "node:fs";

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const version = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;

for (const file of ["index.html", "presenter.html"]) {
  const src = fs.readFileSync(file, "utf8");
  const out = src.replace(/((?:href|src)="(?:css|js)\/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g, `$1?v=${version}"`);
  fs.writeFileSync(file, out);
  const count = (out.match(/\?v=\d+/g) || []).length;
  console.log(`${file}: ${count} referência(s) com ?v=${version}`);
}
