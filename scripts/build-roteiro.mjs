#!/usr/bin/env node
// Gera ROTEIRO.md e os roteiros individuais FALA_*.md a partir de js/notes.js
// (o mesmo texto usado pelo modo apresentador).
// Uso: node scripts/build-roteiro.mjs          → grava os arquivos
//      node scripts/build-roteiro.mjs --check  → só confere se os arquivos estão atualizados
import fs from "node:fs";
import { loadNotes, slidesFromHtml, segments, segSeconds, speakerOf, mmss, slug, cueList, cueKey, words, spoken, CUES } from "./roteiro-lib.mjs";

const { NOTES, EQUIPE } = loadNotes();
const slides = slidesFromHtml();
const PENDENTE = "Responsável a definir";
const errors = [];

const num = (i) => String(i + 1).padStart(2, "0");
const joinNames = (a) => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]);
const respOf = (n) => (n.pendente || !(n.responsaveis || []).length ? [] : n.responsaveis);
const respLabel = (n) => (respOf(n).length ? joinNames(respOf(n)) : "pendente de distribuição");
const who = (seg, n) => speakerOf(seg, n) || PENDENTE;
const secs = (s) => `≈ ${Math.max(1, Math.round(s))} s`;

slides.forEach((s) => { if (!NOTES[s.id]) errors.push(`Sem roteiro para o slide ${s.id}.`); });
if (errors.length) { errors.forEach((e) => console.error("✗ " + e)); process.exit(1); }

const list = slides.map((s, i) => ({ ...s, i, n: NOTES[s.id] }));
const firstSpeaker = (x) => { const g = segments(x.n); return g.length ? who(g[0], x.n) : PENDENTE; };
const lastSpeaker = (x) => { const g = segments(x.n); return g.length ? who(g[g.length - 1], x.n) : PENDENTE; };
const total = list.reduce((sum, x) => sum + (x.n.tempo || 0), 0);
const allSegs = list.flatMap((x) => segments(x.n).map((g) => ({ g, x })));

// Tempo de cada pessoa: o tempo do slide dividido pela proporção das falas
function sharesOf(x) {
  const out = {};
  let all = 0;
  segments(x.n).forEach((g) => { const k = who(g, x.n); const t = segSeconds(g); out[k] = (out[k] || 0) + t; all += t; });
  Object.keys(out).forEach((k) => { out[k] = all ? (out[k] / all) * (x.n.tempo || 0) : 0; });
  return out;
}
const personTime = {};
const personSlides = {};
list.forEach((x) => {
  Object.entries(sharesOf(x)).forEach(([k, v]) => { personTime[k] = (personTime[k] || 0) + v; });
  (respOf(x.n).length ? respOf(x.n) : [PENDENTE]).forEach((k) => { (personSlides[k] = personSlides[k] || []).push(x.i + 1); });
});
const slideNums = (arr) => joinNames(arr.map(String));

// Blocos de slides seguidos com os mesmos responsáveis (para a sequência de falas)
const blocks = [];
list.forEach((x) => {
  const key = respLabel(x.n);
  const b = blocks[blocks.length - 1];
  if (b && b.key === key) b.items.push(x);
  else blocks.push({ key, items: [x] });
});

function handoff(x) {
  const nx = list[x.i + 1];
  if (!nx) return "**[FIM DA APRESENTAÇÃO]**";
  const next = firstSpeaker(nx);
  const resp = respOf(x.n);
  if (x.n.pendente && nx.n.pendente) return "**[AVANÇAR PARA O PRÓXIMO SLIDE]** (se os slides " + slideNums(personSlides[PENDENTE]) + " ficarem com pessoas diferentes, passe a palavra aqui)";
  if (nx.n.pendente) return "**[PASSAR A PALAVRA: responsável pelos slides " + slideNums(personSlides[PENDENTE]) + ", a definir]**";
  if (resp.includes(next) && respOf(nx.n).every((p) => resp.includes(p))) return "**[AVANÇAR PARA O PRÓXIMO SLIDE]**";
  return `**[PASSAR A PALAVRA: ${next}]**`;
}

const fmtText = (t) => String(t).replace(/\[([^\]]+)\]/g, "**[$1]**");

function slideBlock(x, me) {
  const n = x.n;
  const steps = (n.etapas || []).length;
  let out = `## ${num(x.i)} · ${x.title} — ${mmss(n.tempo || 0)}\n\n`;
  out += `- **${respOf(n).length > 1 ? "Responsáveis" : "Responsável"}:** ${respLabel(n)}${n.pendente ? " (ainda não definido)" : ""}\n`;
  out += `- **Onde estamos no tempo:** ${n.ano || "—"}\n`;
  out += `- **Na tela:** ${steps ? `${steps} tópicos, um por clique (${(n.topicos || []).join(" · ")})` : x.id === "cronologia" ? "linha do tempo; clique nos acontecimentos indicados" : "sem tópicos por clique"}\n\n`;
  const segs = segments(n);
  segs.forEach((g, k) => {
    const speaker = who(g, n);
    const mine = me && speaker === me;
    const label = mine ? "**Você**" : speaker;
    out += `**${g.rotulo}** · ${label} · ${secs(segSeconds(g))}\n\n`;
    out += `> ${fmtText(g.texto)}\n`;
    const nextSeg = segs[k + 1];
    if (g.tipo === "topico" && nextSeg && nextSeg.tipo === "topico") out += `>\n> **[AVANÇAR O TÓPICO]**\n`;
    if (g.tipo === "fim") out += `>\n> ${handoff(x)}\n`;
    out += "\n";
  });
  if ((n.perguntas || []).length) {
    out += "**Se perguntarem:**\n\n";
    n.perguntas.forEach((p) => {
      const m = p.match(/^([^?]+\?)\s*(.*)$/);
      out += m ? `- *${m[1]}* ${m[2]}\n` : `- ${p}\n`;
    });
    out += "\n";
  }
  return out;
}

const legend = `As orientações entre colchetes **não são faladas**: **[AGUARDAR A ANIMAÇÃO]**, **[APONTAR PARA O MAPA]**, **[APONTAR PARA A TELA]**, **[DESTACAR A IMAGEM]**, **[FAZER UMA PAUSA]**, **[OLHAR PARA A TURMA]**, **[CLICAR NA TELA: …]**, **[AVANÇAR O TÓPICO]** (um clique ou seta **→**) e **[PASSAR A PALAVRA: …]**.`;
const method = `Tempos estimados com fala de cerca de 144 palavras por minuto, mais o tempo das animações, dos cliques, dos apontamentos, das pausas e das trocas de integrante.`;

/* ---------- ROTEIRO.md ---------- */
let R = `# Roteiro de falas — Guerra do Paraguai (1864–1870)

Roteiro completo da apresentação, com quem fala em cada trecho. **Não aparece na projeção.** O mesmo texto está no modo apresentador (botão de tela no canto superior direito, ou tecla **P**) e nos roteiros individuais \`FALA_*.md\`.

## Como usar

- **Viagem no tempo:** cada slide começa num momento da história (“Onde estamos no tempo”). A fala de abertura leva a turma até aquele ano.
- **Um tópico por clique:** os textos aparecem na tela um de cada vez. Diga a fala do tópico que acabou de aparecer e avance com um clique ou com a seta **→**. O tópico atual fica destacado na tela e no modo apresentador.
- **Com os olhos de hoje:** antes de passar ao próximo slide, faça a ligação com o presente.
- **Troca de integrante:** a última frase de cada parte já cita quem fala em seguida. Quem recebe a palavra começa sem pausa longa.
- ${legend}
- **Saudação:** se a apresentação for de manhã, troque “Boa tarde” por “Bom dia”.
- **Tempo total estimado:** ${mmss(total)} (${slides.length} slides). ${method}

## Divisão entre os integrantes

| Integrante | Slides | Tempo estimado |
|---|---|---|
`;
const people = [];
list.forEach((x) => (respOf(x.n).length ? respOf(x.n) : [PENDENTE]).forEach((p) => { if (!people.includes(p)) people.push(p); }));
people.forEach((p) => {
  const partners = [...new Set(list.filter((x) => respOf(x.n).includes(p)).flatMap((x) => respOf(x.n)).filter((q) => q !== p))];
  const label = p === PENDENTE ? "*Pendente de distribuição*" : p;
  const extra = partners.length ? ` (com ${joinNames(partners)})` : p === PENDENTE ? " (responsáveis a definir)" : "";
  R += `| ${label} | ${slideNums(personSlides[p])}${extra} | ${mmss(personTime[p] || 0)} |\n`;
});
R += `| **Total** | ${slides.length} slides | **${mmss(total)}** |\n\n`;
R += `Os slides ${slideNums(personSlides[PENDENTE] || [])} ainda não têm responsável. Para definir, preencha \`responsaveis\` desses slides em \`js/notes.js\`, apague \`pendente: true\`, ajuste a frase de transição do slide anterior com o nome de quem vai falar e rode \`node scripts/build-roteiro.mjs\`.\n\n`;

R += `## Sequência de falas\n\n`;
blocks.forEach((b, k) => {
  const a = b.items[0].i + 1, z = b.items[b.items.length - 1].i + 1;
  const range = a === z ? `Slide ${a}` : `Slides ${a} ${z - a === 1 ? "e" : "a"} ${z}`;
  const t = b.items.reduce((s, x) => s + (x.n.tempo || 0), 0);
  const nb = blocks[k + 1];
  const to = nb ? ` → passa a palavra para **${nb.items[0].n.pendente ? "responsável a definir" : firstSpeaker(nb.items[0])}**` : " → encerramento e perguntas";
  R += `${k + 1}. **${range}** · ${b.items[0].n.pendente ? "*pendente de distribuição*" : b.key} · ${mmss(t)}${to}\n`;
});

R += `\n## Tempo por slide\n\n| # | Slide | Quem fala | Tempo | Cliques |\n|---|---|---|---|---|\n`;
list.forEach((x) => {
  const steps = (x.n.etapas || []).length;
  R += `| ${num(x.i)} | ${x.title} | ${x.n.pendente ? "*pendente*" : respLabel(x.n)} | ${mmss(x.n.tempo || 0)} | ${steps ? steps - 1 + " (" + steps + " tópicos)" : "—"} |\n`;
});
R += "\n---\n\n";
list.forEach((x) => { R += slideBlock(x, null); });
R += `---

## Obras mencionadas no roteiro (além das referências da apresentação)

- CHIAVENATTO, Júlio José. *Genocídio americano: a Guerra do Paraguai*. São Paulo: Brasiliense, 1979.
- DORATIOTO, Francisco. *Maldita guerra: nova história da Guerra do Paraguai*. São Paulo: Companhia das Letras, 2002.
- POMER, León. *La guerra del Paraguay: ¡gran negocio!* Buenos Aires, 1968.
- REBER, Vera Blinn. The demographics of Paraguay: a reinterpretation of the Great War, 1864–70. *Hispanic American Historical Review*, v. 68, n. 2, p. 289–319, 1988. DOI: 10.1215/00182168-68.2.289.

_Arquivo gerado por \`node scripts/build-roteiro.mjs\` a partir de \`js/notes.js\`. Não edite à mão: mude \`js/notes.js\` e gere de novo._
`;

/* ---------- FALA_<INTEGRANTE>.md ---------- */
const files = { "ROTEIRO.md": R };
EQUIPE.forEach((me) => {
  const mine = list.filter((x) => respOf(x.n).includes(me));
  if (!mine.length) { errors.push(`${me} não tem nenhum slide.`); return; }
  const partners = [...new Set(mine.flatMap((x) => respOf(x.n)).filter((q) => q !== me))];
  let F = `# Roteiro de fala — ${me}\n\n`;
  F += `**Seus slides:** ${slideNums(mine.map((x) => x.i + 1))}${partners.length ? `, em dupla com ${joinNames(partners)}` : ""}.  \n`;
  F += `**Tempo estimado da sua parte:** ${mmss(personTime[me] || 0)} (a apresentação toda leva cerca de ${mmss(total)}).\n\n`;
  F += `Este arquivo traz só os seus slides, com as falas completas, as orientações e os tempos. ${partners.length ? `Os trechos marcados com **Você** são seus; os outros são de ${joinNames(partners)}. ` : ""}${legend}\n\n`;
  F += `## Quando você entra e para quem passa a palavra\n\n`;
  const myBlocks = blocks.filter((b) => b.items.some((x) => respOf(x.n).includes(me)));
  myBlocks.forEach((b) => {
    const a = b.items[0], z = b.items[b.items.length - 1];
    const prev = list[a.i - 1], nx = list[z.i + 1];
    const range = a === z ? `Slide ${a.i + 1}` : `Slides ${a.i + 1} ${z.i - a.i === 1 ? "e" : "a"} ${z.i + 1}`;
    F += `### ${range}\n\n`;
    // deixa: o trecho dito logo antes da sua primeira fala neste bloco
    const k = allSegs.findIndex((o) => b.items.includes(o.x) && who(o.g, o.x.n) === me);
    const firstMine = allSegs[k];
    const before = allSegs[k - 1];
    if (!before) F += `- **Você abre a apresentação.** Quando o slide de abertura aparecer, espere a animação do título e comece.\n`;
    else {
      const t = spoken(before.g.texto);
      const cue = before.g.tipo === "fim" ? t : "…" + (t.match(/[^.!?]+[.!?]+\s*$/) || [t])[0].trim();
      const where = before.x === firstMine.x ? `diz no slide ${before.x.i + 1}` : `termina o slide ${before.x.i + 1} dizendo`;
      F += `- **Sua deixa:** ${before.x.n.pendente ? "quem apresentar o slide " + (before.x.i + 1) : who(before.g, before.x.n)} ${before.x.n.pendente ? "termina dizendo" : where}: “${cue}”\n`;
    }
    if (who(segments(a.n)[0], a.n) !== me) F += `- **Quem começa este bloco:** ${who(segments(a.n)[0], a.n)}. Sua primeira fala é **${firstMine.g.rotulo}** (slide ${firstMine.x.i + 1}).\n`;
    if (nx) {
      const g = segments(z.n);
      const closer = who(g[g.length - 1], z.n);
      F += `- **No fim:** ${closer === me ? "você diz" : `${closer} diz`} “${spoken(g[g.length - 1].texto)}” e passa a palavra para **${nx.n.pendente ? "quem apresentar o slide " + (nx.i + 1) + " (responsável a definir)" : firstSpeaker(nx)}**.\n\n`;
    } else F += `- **No fim:** a apresentação termina com as perguntas da turma.\n\n`;
  });
  F += `## Seus trechos\n\n| Slide | Trecho | Tempo |\n|---|---|---|\n`;
  mine.forEach((x) => segments(x.n).forEach((g) => { if (who(g, x.n) === me) F += `| ${num(x.i)} · ${x.title} | ${g.rotulo} | ${secs(segSeconds(g))} |\n`; }));
  F += "\n---\n\n";
  mine.forEach((x) => { F += slideBlock(x, me); });
  F += `---

## Para ensaiar

- Leia em voz alta com um cronômetro: a sua parte deve levar cerca de ${mmss(personTime[me] || 0)}.
- Não decore palavra por palavra: guarde a ideia de cada tópico. Se esquecer, olhe a tela, porque o tópico atual fica destacado.
- Ensaie a troca: a frase de transição já cita quem fala depois de você.
- No modo apresentador (tecla **P** ou botão de tela), o seu nome aparece em destaque quando for a sua vez.

_Arquivo gerado por \`node scripts/build-roteiro.mjs\` a partir de \`js/notes.js\`. Não edite à mão: mude \`js/notes.js\` e gere de novo._
`;
  files[`FALA_${slug(me)}.md`] = F;
});

// Orientações desconhecidas e falas proibidas também interrompem a geração
list.forEach((x) => segments(x.n).forEach((g) => {
  cueList(g.texto).forEach((c) => { if (!CUES.includes(cueKey(c))) errors.push(`Orientação desconhecida em ${x.id}: [${c}]`); });
  if (!words(g.texto)) errors.push(`Trecho sem fala em ${x.id}: ${g.rotulo}`);
}));
if (errors.length) { errors.forEach((e) => console.error("✗ " + e)); process.exit(1); }

const check = process.argv.includes("--check");
const stale = Object.entries(files).filter(([f, txt]) => !fs.existsSync(f) || fs.readFileSync(f, "utf8") !== txt).map(([f]) => f);
if (check) {
  if (stale.length) { console.error("✗ Desatualizado em relação a js/notes.js: " + stale.join(", ") + " (rode node scripts/build-roteiro.mjs)"); process.exit(1); }
  console.log("✓ ROTEIRO.md e roteiros individuais em dia com js/notes.js.");
  process.exit(0);
}
Object.entries(files).forEach(([f, txt]) => fs.writeFileSync(f, txt));
console.log(`Gerados ${Object.keys(files).length} arquivos (${Object.keys(files).join(", ")}). ${slides.length} slides, ${mmss(total)} no total.`);
