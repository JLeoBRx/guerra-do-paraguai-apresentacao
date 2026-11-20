// Grava as cores do tema (clrScheme) no ppt/theme/theme1.xml que o pptxgenjs gera.
const fs = require("fs");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const SLOTS = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];

async function applyTheme(deckPath, theme) {
  const zip = await JSZip.loadAsync(fs.readFileSync(deckPath));
  const part = "ppt/theme/theme1.xml";
  const xml = await zip.file(part).async("string");
  const name = theme.name.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const scheme = `<a:clrScheme name="${name}">` +
    SLOTS.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  const out = xml
    .replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme)
    .replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, head) => `${head}${name}"`);
  zip.file(part, out);
  // remove entradas de pasta: serviços de nuvem recusam ZIPs com elas
  for (const [k, f] of Object.entries(zip.files)) if (f.dir) delete zip.files[k];
  fs.writeFileSync(deckPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}
module.exports = { applyTheme };
