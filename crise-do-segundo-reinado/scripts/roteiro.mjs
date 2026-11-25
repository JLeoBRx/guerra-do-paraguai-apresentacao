#!/usr/bin/env node
// Gera ROTEIRO.md a partir de js/notes.js (mesmo texto do modo apresentador).
// Uso (dentro de crise-do-segundo-reinado/): node scripts/roteiro.mjs
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
  ["Davi Matheus", ["capa", "estabilidade", "religiosa"]],
  ["Juan Bento", ["militar", "abolicao", "lei-aurea"]],
  ["Lucas Godoy", ["republicanismo", "isolamento", "articulacao"]],
  ["Kaique", ["proclamacao", "conclusao", "referencias"]],
];

let out = `# Roteiro do apresentador — A Crise do Segundo Reinado (1840–1889), versão em 12 slides

Texto de apoio para quem apresenta o site (\`index.html\`). **Não aparece na projeção.** O mesmo conteúdo está no modo apresentador: botão de tela no canto superior direito ou tecla **P**, que abre uma janela separada com o roteiro, a lista de tópicos (com o atual destacado), o próximo slide e o cronômetro.

## Como usar

- **Viagem no tempo:** cada slide começa num momento da história (“Onde estamos no tempo”). Comece pela frase de **Para começar**, que leva a turma até aquele ano.
- **Um tópico por clique:** os textos aparecem na tela um de cada vez. A cada clique (seta **→**), diga o texto de **Agora** daquele tópico. Se alguém se perder, olhe a lista de tópicos: o atual está destacado na tela e no modo apresentador.
- **Com os olhos de hoje:** antes de passar ao próximo slide, faça a conexão com o presente.
- **Tempo total estimado:** ${mmss(total)} (${slides.length} slides).
- **Narração gravada:** o texto de **Para começar** e de cada tópico é o que deve ser gravado. Veja \`assets/audio/narracao/LEIA-ME.md\`.

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
  if (n.ano) out += `**Onde estamos no tempo:** ${n.ano}\n\n`;
  if (n.topicos?.length && !n.etapas?.length) out += `**Na tela:** ${n.topicos.join(" · ")}\n\n`;
  out += `**Para começar.** ${n.fala || ""}\n\n`;
  if (n.etapas?.length) {
    out += `**Tópico por tópico** (avance com →):\n\n`;
    n.etapas.forEach((e, k) => {
      const label = n.topicos?.[k] ? `**${n.topicos[k]}** — ` : "";
      out += `${k + 1}. ${label}${e}\n`;
    });
    out += "\n";
  }
  if (n.hoje) out += `**Com os olhos de hoje.** ${n.hoje}\n\n`;
  if (n.complemento) out += `**Se perguntarem.** ${n.complemento}\n\n`;
  if (n.transicao) out += `**Para passar ao próximo.** _${n.transicao}_\n`;
});

out += `
---

## Referências

As referências completas estão no botão **Referências** (tecla **R**) da apresentação e no README.

_Arquivo gerado por \`node scripts/roteiro.mjs\` a partir de \`js/notes.js\`._
`;

fs.writeFileSync("ROTEIRO.md", out);
const missing = slides.filter((s) => !NOTES[s.id]);
const stepGaps = slides.filter((s) => s.steps && (NOTES[s.id]?.etapas || []).length !== s.steps + 1);
const topicGaps = slides.filter((s) => s.steps && (NOTES[s.id]?.topicos || []).length !== s.steps + 1);
console.log(`ROTEIRO.md gerado: ${slides.length} slides, ${mmss(total)} no total.`);
if (missing.length) console.log("Sem notas:", missing.map((s) => s.id).join(", "));
if (stepGaps.length) console.log("Etapas sem texto correspondente:", stepGaps.map((s) => s.id).join(", "));
if (topicGaps.length) console.log("Tópicos sem lembrete correspondente:", topicGaps.map((s) => s.id).join(", "));
if (missing.length || stepGaps.length || topicGaps.length) process.exit(1);
