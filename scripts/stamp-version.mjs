#!/usr/bin/env node
// Carimba as referências de CSS e JS com ?v=<data-hora> para que, a cada publicação,
// o navegador e a CDN busquem os arquivos novos junto com o HTML novo.
// Uso (antes do commit de uma publicação): node scripts/stamp-version.mjs
// Sem argumentos, carimba todos os sites; com argumentos, só os arquivos indicados.
import fs from "node:fs";

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const version = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;

const all = ["index.html", "presenter.html", "segundo-reinado/index.html", "segundo-reinado/presenter.html", "o-segundo-reinado/index.html", "o-segundo-reinado/presenter.html", "crise-do-segundo-reinado/index.html", "crise-do-segundo-reinado/presenter.html"];
for (const file of process.argv.length > 2 ? process.argv.slice(2) : all) {
  const src = fs.readFileSync(file, "utf8");
  const out = src.replace(/((?:href|src)="(?:css|js)\/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g, `$1?v=${version}"`);
  fs.writeFileSync(file, out);
  const count = (out.match(/\?v=\d+/g) || []).length;
  console.log(`${file}: ${count} referência(s) com ?v=${version}`);
}
