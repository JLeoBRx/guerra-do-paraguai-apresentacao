// Funções compartilhadas pelo gerador do roteiro (build-roteiro.mjs) e pelo validador (validate-site.mjs).
// A fonte das falas é js/notes.js; os slides (ordem, títulos e etapas) vêm de index.html.
import fs from "node:fs";
import vm from "node:vm";

export const CUES = [
  "AGUARDAR A ANIMAÇÃO", "APONTAR PARA O MAPA", "APONTAR PARA A TELA", "DESTACAR A IMAGEM",
  "FAZER UMA PAUSA", "OLHAR PARA A TURMA", "CLICAR NA TELA",
];

// Ritmo usado nas estimativas: fala de apresentação (cerca de 144 palavras por minuto) mais o tempo
// dos cliques, das animações, dos apontamentos, das pausas e das trocas de integrante.
export const RITMO = {
  palavrasPorSegundo: 2.4,
  entrada: 3, // transição e animação do título
  clique: 1.5, // cada tópico revelado
  troca: 1.5, // troca de quem fala dentro do slide
  chegada: 4, // integrante que assume a fala no começo do slide
  orientacao: { "AGUARDAR A ANIMAÇÃO": 2, "FAZER UMA PAUSA": 2, "CLICAR NA TELA": 2, "APONTAR PARA O MAPA": 1, "APONTAR PARA A TELA": 1, "DESTACAR A IMAGEM": 1, "OLHAR PARA A TURMA": 1 },
};

export function loadNotes(file = "js/notes.js") {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox);
  return { NOTES: sandbox.window.GP_NOTES || {}, EQUIPE: sandbox.window.GP_EQUIPE || [] };
}

export function slidesFromHtml(file = "index.html") {
  const html = fs.readFileSync(file, "utf8");
  const starts = [...html.matchAll(/<section class="slide [^"]*" id="([^"]+)"([^>]*)>/g)];
  return starts.map((m) => ({
    id: m[1],
    title: (m[2].match(/data-title="([^"]+)"/) || [])[1] || m[1],
    steps: Number((m[2].match(/data-steps="(\d+)"/) || [])[1] || 0),
  }));
}

// Trechos de fala de um slide, na ordem em que são ditos, com a etapa (clique) em que acontecem
export function segments(n) {
  const last = Math.max(0, (n.etapas || []).length - 1);
  const out = [];
  (n.intro || []).forEach((s, i) => out.push({ ...s, tipo: "intro", rotulo: i ? "Abertura (continuação)" : "Abertura do slide", etapa: 0 }));
  (n.etapas || []).forEach((s, k) => out.push({ ...s, tipo: "topico", rotulo: `Tópico ${k + 1} · ${(n.topicos || [])[k] || ""}`.replace(/ · $/, ""), etapa: k }));
  if (n.hoje) out.push({ ...n.hoje, tipo: "hoje", rotulo: "Com os olhos de hoje", etapa: last });
  if (n.encerramento) out.push({ ...n.encerramento, tipo: "fim", rotulo: "Encerramento e transição", etapa: last });
  return out;
}

export const cueList = (text) => [...String(text || "").matchAll(/\[([^\]]+)\]/g)].map((m) => m[1].trim());
export const cueKey = (c) => c.split(":")[0].trim();
export const spoken = (text) => String(text || "").replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
export const words = (text) => (spoken(text).match(/[\p{L}\p{N}][\p{L}\p{N}'’\-–]*/gu) || []).length;

export function segSeconds(seg) {
  const cues = cueList(seg.texto).reduce((s, c) => s + (RITMO.orientacao[cueKey(c)] || 0), 0);
  return words(seg.texto) / RITMO.palavrasPorSegundo + cues;
}

// Quem fala num trecho: o "quem" do trecho; se o slide tiver uma só pessoa responsável, ela; se estiver pendente, "Responsável a definir"
export const speakerOf = (seg, n) =>
  seg.quem || (n.pendente || !(n.responsaveis || []).length ? "Responsável a definir" : n.responsaveis.length === 1 ? n.responsaveis[0] : "");

// Estimativa do slide: falas + entrada + cliques + trocas de quem fala + chegada de novo integrante
export function estimate(n, prev) {
  const segs = segments(n);
  let t = RITMO.entrada + Math.max(0, (n.etapas || []).length - 1) * RITMO.clique;
  let last = null;
  segs.forEach((s) => {
    t += segSeconds(s);
    const who = speakerOf(s, n);
    if (last && who !== last) t += RITMO.troca;
    last = who;
  });
  const first = segs[0] ? speakerOf(segs[0], n) : "";
  const prevSegs = prev ? segments(prev) : [];
  const prevLast = prevSegs.length ? speakerOf(prevSegs[prevSegs.length - 1], prev) : "";
  if (prev && first !== prevLast) t += RITMO.chegada;
  return t;
}

// Tempo de fala de cada pessoa num slide (a parte fixa do slide é dividida pela proporção das falas)
export function shares(n, prev) {
  const segs = segments(n);
  const total = estimate(n, prev);
  const bySpeaker = {};
  let spokenTotal = 0;
  segs.forEach((s) => {
    const who = speakerOf(s, n);
    const sec = segSeconds(s);
    bySpeaker[who] = (bySpeaker[who] || 0) + sec;
    spokenTotal += sec;
  });
  Object.keys(bySpeaker).forEach((k) => { bySpeaker[k] = spokenTotal ? (bySpeaker[k] / spokenTotal) * total : 0; });
  return bySpeaker;
}

export const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, "0")}`;

export const slug = (name) =>
  name.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
