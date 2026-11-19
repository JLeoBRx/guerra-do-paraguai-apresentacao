#!/usr/bin/env node
// Gera ROTEIRO.md a partir de js/notes.js (mesmo texto do modo apresentador).
// Uso: node scripts/build-roteiro.mjs
import fs from "node:fs";
import vm from "node:vm";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("js/notes.js", "utf8"), sandbox);
const NOTES = sandbox.window.GP_NOTES;
const html = fs.readFileSync("index.html", "utf8");
const slides = [...html.matchAll(/<section class="slide [^"]*" id="([^"]+)" data-title="([^"]+)"(?:[^>]*data-steps="(\d+)")?/g)].map((m) => ({
  id: m[1], title: m[2], steps: m[3] ? Number(m[3]) : 0,
}));

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const total = slides.reduce((sum, s) => sum + (NOTES[s.id]?.tempo || 0), 0);

const groups = [
  ["Pedro Henrique", ["abertura", "contexto", "pindorama", "causas"]],
  ["Clara Maria", ["paises", "inicio"]],
  ["Anthony Marcos", ["alianca", "cronologia"]],
  ["Gabriel Willian", ["mapa", "batalhas"]],
  ["Leandro Farias", ["humanas", "politicas"]],
  ["Lohan David", ["interpretacoes", "conclusao", "referencias"]],
];

let out = `# Roteiro do apresentador — Guerra do Paraguai (1864–1870)

Texto de apoio para quem apresenta. **Não aparece na projeção.** O mesmo conteúdo está no modo apresentador: botão de tela no canto superior direito ou tecla **P**, que abre uma janela separada com as notas, o próximo slide e o cronômetro.

- **Tempo total estimado:** ${mmss(total)} (${slides.length} slides). Para uma versão de cerca de 12 minutos, leiam só a **Fala** e pulem a explicação complementar.
- **Cenas com etapas** (início do conflito, Tríplice Aliança, mapa das campanhas e batalhas): a seta **→** avança uma etapa de cada vez antes de trocar de slide. O texto de cada etapa está em “Etapas”.
- **Narração gravada:** a **Fala** de cada slide é o texto a ser gravado. Veja \`assets/audio/narracao/LEIA-ME.md\`.

## Sugestão de divisão entre os integrantes

Apenas uma sugestão; ajustem como preferirem.

| Integrante | Slides | Tempo |
|---|---|---|
`;
for (const [name, ids] of groups) {
  const nums = ids.map((id) => slides.findIndex((s) => s.id === id) + 1).join(", ");
  const t = ids.reduce((sum, id) => sum + (NOTES[id]?.tempo || 0), 0);
  out += `| ${name} | ${nums} | ${mmss(t)} |\n`;
}
out += "\n---\n";

slides.forEach((s, i) => {
  const n = NOTES[s.id] || {};
  out += `\n## ${String(i + 1).padStart(2, "0")} · ${s.title} — ${mmss(n.tempo || 0)}\n\n`;
  out += `**Fala.** ${n.fala || ""}\n\n`;
  if (n.etapas?.length) {
    out += `**Etapas** (avance com →):\n\n`;
    n.etapas.forEach((e, k) => { out += `${k + 1}. ${e}\n`; });
    out += "\n";
  }
  if (n.complemento) out += `**Explicação complementar.** ${n.complemento}\n\n`;
  if (n.contexto) out += `**Contexto.** ${n.contexto}\n\n`;
  if (n.transicao) out += `**Transição.** _${n.transicao}_\n`;
});

out += `
---

## Obras mencionadas no roteiro (além das referências da apresentação)

- CHIAVENATTO, Júlio José. *Genocídio americano: a Guerra do Paraguai*. São Paulo: Brasiliense, 1979.
- DORATIOTO, Francisco. *Maldita guerra: nova história da Guerra do Paraguai*. São Paulo: Companhia das Letras, 2002.
- POMER, León. *La guerra del Paraguay: ¡gran negocio!* Buenos Aires, 1968.
- REBER, Vera Blinn. The demographics of Paraguay: a reinterpretation of the Great War, 1864–70. *Hispanic American Historical Review*, v. 68, n. 2, p. 289–319, 1988. DOI: 10.1215/00182168-68.2.289.

_Arquivo gerado por \`node scripts/build-roteiro.mjs\` a partir de \`js/notes.js\`._
`;

fs.writeFileSync("ROTEIRO.md", out);
const missing = slides.filter((s) => !NOTES[s.id]);
const stepGaps = slides.filter((s) => s.steps && (NOTES[s.id]?.etapas || []).length !== s.steps + 1);
console.log(`ROTEIRO.md gerado: ${slides.length} slides, ${mmss(total)} no total.`);
if (missing.length) console.log("Sem notas:", missing.map((s) => s.id).join(", "));
if (stepGaps.length) console.log("Etapas incompletas:", stepGaps.map((s) => s.id).join(", "));
process.exit(missing.length || stepGaps.length ? 1 : 0);
