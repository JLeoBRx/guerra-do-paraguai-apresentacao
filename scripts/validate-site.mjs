#!/usr/bin/env node
// Validação estática da apresentação (executada no GitHub Actions a cada push).
// Não substitui a inspeção visual no navegador.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const fail = [];
const pass = [];
const check = (ok, okMsg, errMsg) => (ok ? pass.push(okMsg) : fail.push(errMsg));
const read = (file) => {
  if (!fs.existsSync(file)) {
    fail.push("Arquivo obrigatório ausente: " + file);
    return "";
  }
  return fs.readFileSync(file, "utf8");
};

const html = read("index.html");
const cssFiles = ["css/base.css", "css/deck.css", "css/motion.css", "css/slides.css", "css/responsive.css", "css/scenes.css", "css/presenter.css"];
const jsFiles = ["js/map-data.js", "js/fx.js", "js/map.js", "js/timeline.js", "js/score.js", "js/audio.js", "js/app.js", "js/notes.js", "js/presenter.js"];
const css = cssFiles.map(read).join("\n");
const js = jsFiles.map(read).join("\n");

check(html.includes('<html lang="pt-BR">'), "HTML declara português brasileiro.", 'O HTML precisa declarar lang="pt-BR".');

// Slides na ordem prevista
const expected = [
  "abertura", "contexto", "pindorama", "causas", "paises", "inicio", "alianca", "cronologia", "mapa",
  "batalhas", "humanas", "politicas", "interpretacoes", "conclusao", "referencias",
];
const slides = [...html.matchAll(/<section class="slide [^"]*" id="([^"]+)"([^>]*)>/g)].map((m) => ({ id: m[1], attrs: m[2] }));
check(slides.length === expected.length, `A apresentação tem ${slides.length} slides.`, `Esperados ${expected.length} slides; encontrados ${slides.length}.`);
check(expected.every((id, i) => slides[i]?.id === id), "Slides na ordem narrativa prevista.", "Ordem dos slides diferente da prevista: " + slides.map((s) => s.id).join(", "));
check(slides.every((s) => /data-title="[^"]+"/.test(s.attrs)), "Todos os slides têm título para o índice.", "Há slide sem data-title.");
check(!/class="(research|site-header|presentation)"/.test(html) && !html.includes('id="presentButton"'), "Não restou a antiga interface de artigo.", "Ainda há marcação da antiga interface de artigo/relatório.");

// Transições personalizadas: cada slide declara a sua e há variedade
const transitions = slides.map((s) => (s.attrs.match(/data-transition="([^"]+)"/) || [])[1]);
check(transitions.every(Boolean), "Todos os slides declaram uma transição.", "Há slide sem data-transition.");
check(new Set(transitions).size >= 8, `Transições personalizadas: ${new Set(transitions).size} tipos diferentes.`, "Poucas transições diferentes.");

// Roteiro do apresentador: notas para todos os slides, com etapas nas cenas
const presenter = read("presenter.html");
const notesSrc = read("js/notes.js");
const missingNotes = slides.filter((s) => !new RegExp("\\n  " + s.id + ": \\{").test(notesSrc));
check(missingNotes.length === 0, "Roteiro com notas para todos os slides.", "Slides sem notas no roteiro: " + missingNotes.map((s) => s.id).join(", "));
check(!html.includes("js/notes.js") && !html.includes("GP_NOTES"), "As notas não são carregadas na projeção.", "As notas do apresentador estão na página da projeção.");
check(presenter.includes("js/notes.js") && presenter.includes('id="pvNext"') && presenter.includes('id="pvElapsed"'), "Modo apresentador com notas, próximo slide e cronômetro.", "Modo apresentador incompleto.");
check(fs.existsSync("ROTEIRO.md"), "ROTEIRO.md presente.", "ROTEIRO.md ausente (rode node scripts/build-roteiro.mjs).");

// Tópicos revelados por clique: cada etapa tem texto no roteiro e nenhum item aparece depois da última etapa
const sandbox = { window: {} };
try { vm.runInNewContext(notesSrc, sandbox); } catch (e) { fail.push("js/notes.js não pôde ser lido: " + e.message); }
const NOTES = sandbox.window.GP_NOTES || {};
const stepIssues = [];
const starts = [...html.matchAll(/<section class="slide [^"]*" id="([^"]+)"([^>]*)>/g)];
starts.forEach((m, i) => {
  const id = m[1];
  const steps = Number((m[2].match(/data-steps="(\d+)"/) || [])[1] || 0);
  const body = html.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : html.length);
  const ats = [...body.matchAll(/data-at="(\d+)"/g)].map((a) => Number(a[1]));
  if (ats.some((a) => a > steps)) stepIssues.push(`${id}: item em etapa maior que data-steps`);
  if (steps && (NOTES[id]?.etapas || []).length !== steps + 1) stepIssues.push(`${id}: ${steps + 1} etapas, ${(NOTES[id]?.etapas || []).length} textos no roteiro`);
  if (steps && (NOTES[id]?.topicos || []).length !== steps + 1) stepIssues.push(`${id}: faltam lembretes de tópicos no roteiro`);
  if (steps && !ats.length && !/class="(beat|ally|phase|reel-item)/.test(body)) stepIssues.push(`${id}: tem etapas, mas nada é revelado por clique`);
});
check(stepIssues.length === 0, "Tópicos por clique coerentes com o roteiro.", "Tópicos incoerentes: " + stepIssues.join("; "));

// Roteiro de falas por integrante (js/notes.js é a fonte; ROTEIRO.md e FALA_*.md são gerados dele)
{
  const lib = await import("./roteiro-lib.mjs");
  const EQUIPE = sandbox.window.GP_EQUIPE || [];
  const roster = (html.match(/<div class="opening-roster"[\s\S]*?<p>([\s\S]*?)<\/p>/) || [])[1] || "";
  const rosterNames = roster.split(/&nbsp;·|·/).map((s) => s.replace(/&nbsp;/g, " ").trim()).filter(Boolean);
  check(EQUIPE.length === 6 && EQUIPE.join("|") === rosterNames.join("|"), "Integrantes do roteiro iguais aos da abertura.", "Integrantes do roteiro diferentes da abertura: " + EQUIPE.join(", "));
  const order = Object.keys(NOTES);
  check(order.join("|") === slides.map((s) => s.id).join("|"), "Roteiro na mesma ordem dos slides.", "Ordem do roteiro diferente da dos slides.");
  const issues = [];
  const info = lib.slidesFromHtml();
  info.forEach((s, i) => {
    const n = NOTES[s.id] || {};
    const resp = n.responsaveis || [];
    if (n.titulo !== s.title) issues.push(`${s.id}: título diferente do slide`);
    if (!s.steps && (n.etapas || []).length) issues.push(`${s.id}: falas por tópico num slide sem tópicos`);
    if (n.pendente ? resp.length : !resp.length) issues.push(`${s.id}: responsáveis incoerentes`);
    resp.forEach((p) => { if (!EQUIPE.includes(p)) issues.push(`${s.id}: integrante desconhecido ${p}`); });
    const segs = lib.segments(n);
    if (!segs.length || !n.hoje || !n.encerramento || !(n.intro || []).length) issues.push(`${s.id}: falta abertura, conexão com o presente ou encerramento`);
    segs.forEach((g) => {
      if (n.pendente && g.quem) issues.push(`${s.id}: slide pendente com fala atribuída a ${g.quem}`);
      if (!n.pendente && resp.length > 1 && !g.quem) issues.push(`${s.id}: trecho sem integrante (${g.rotulo})`);
      if (g.quem && !resp.includes(g.quem)) issues.push(`${s.id}: ${g.quem} fala, mas não é responsável pelo slide`);
      if (!lib.words(g.texto)) issues.push(`${s.id}: trecho vazio (${g.rotulo})`);
      lib.cueList(g.texto).forEach((c) => { if (!lib.CUES.includes(lib.cueKey(c))) issues.push(`${s.id}: orientação desconhecida [${c}]`); });
      if (/vou falar sobre|agora eu vou/i.test(g.texto)) issues.push(`${s.id}: transição mecânica ("vou falar sobre")`);
    });
    resp.forEach((p) => { if (!segs.some((g) => lib.speakerOf(g, n) === p)) issues.push(`${s.id}: ${p} é responsável mas não tem fala`); });
    // a frase de transição cita quem fala depois quando há troca de integrante
    const nx = info[i + 1] && NOTES[info[i + 1].id];
    if (nx) {
      const next = lib.speakerOf(lib.segments(nx)[0] || {}, nx);
      const close = n.encerramento ? n.encerramento.texto : "";
      if (nx.pendente) { if (EQUIPE.some((p) => close.includes(p))) issues.push(`${s.id}: a transição cita um nome, mas o próximo slide está pendente`); }
      else if (!resp.includes(next) && !close.includes(next)) issues.push(`${s.id}: a transição não cita ${next}, que fala em seguida`);
    }
  });
  check(issues.length === 0, "Falas com responsáveis, orientações e transições coerentes.", "Roteiro incoerente: " + issues.join("; "));
  EQUIPE.forEach((p) => check(info.some((s) => (NOTES[s.id].responsaveis || []).includes(p)), `${p} tem slides no roteiro.`, `${p} não tem nenhum slide no roteiro.`));
  const pend = info.filter((s) => NOTES[s.id].pendente).map((s, k) => s.id);
  check(true, `Slides pendentes de distribuição: ${pend.length ? pend.join(", ") : "nenhum"}.`, "");
  // tempos: cada slide perto da estimativa pelo tamanho das falas; total perto de 20 minutos
  const timeIssues = [];
  let totalTempo = 0;
  info.forEach((s, i) => {
    const n = NOTES[s.id];
    const est = lib.estimate(n, i ? NOTES[info[i - 1].id] : null);
    totalTempo += n.tempo || 0;
    if (Math.abs((n.tempo || 0) - est) > Math.max(8, est * 0.1)) timeIssues.push(`${s.id}: ${n.tempo} s previstos, ${Math.round(est)} s pelas falas`);
  });
  check(timeIssues.length === 0, "Tempo de cada slide coerente com o tamanho das falas.", "Tempos incoerentes: " + timeIssues.join("; "));
  check(totalTempo >= 19 * 60 && totalTempo <= 21 * 60, `Tempo total do roteiro: ${lib.mmss(totalTempo)}.`, `Tempo total fora de 19–21 minutos: ${lib.mmss(totalTempo)}.`);
  // documentos gerados em dia com js/notes.js
  try {
    execFileSync(process.execPath, ["scripts/build-roteiro.mjs", "--check"], { stdio: "pipe" });
    pass.push("ROTEIRO.md e FALA_*.md em dia com js/notes.js.");
  } catch (e) {
    fail.push("Documentos do roteiro desatualizados: " + String(e.stderr || e.stdout || e.message).trim());
  }
  for (const p of EQUIPE) check(fs.existsSync(`FALA_${lib.slug(p)}.md`), `Roteiro individual de ${p}.`, `Falta FALA_${lib.slug(p)}.md.`);
}

// Áudio: nada automático e nenhuma gravação inexistente anunciada
const manifest = JSON.parse(read("assets/audio/narracao/manifest.json") || "{}");
const listed = Object.values(manifest.slides || {}).map((e) => "assets/audio/narracao/" + (typeof e === "string" ? e : e.arquivo));
const absent = listed.filter((f) => !fs.existsSync(f));
check(absent.length === 0, `Manifesto de narração coerente (${listed.length} gravação(ões) listada(s)).`, "Gravações listadas mas ausentes: " + absent.join(", "));
check(!/autoplay/i.test(html), "Nenhum áudio com reprodução automática.", "Há autoplay na página.");

// Integrantes
for (const name of ["Pedro Henrique", "Clara Maria", "Anthony Marcos", "Gabriel Willian", "Leandro Farias", "Lohan David"]) {
  check(html.includes(name), "Integrante presente: " + name + ".", "Integrante ausente: " + name + ".");
}

// IDs e âncoras
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
check(dup.length === 0, "Não há IDs duplicados.", "IDs duplicados: " + [...new Set(dup)].join(", "));
const idSet = new Set(ids);
const anchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((m) => m[1]);
const broken = [...new Set(anchors.filter((a) => !idSet.has(a)))];
check(broken.length === 0, "Todos os links internos têm destino.", "Links internos sem destino: " + broken.join(", "));
const refs = [...html.matchAll(/<li id="ref(\d+)"/g)].map((m) => Number(m[1]));
const cites = [...html.matchAll(/data-ref="(\d+)"/g)].map((m) => Number(m[1]));
const missingRefs = [...new Set(cites.filter((n) => !refs.includes(n)))];
check(refs.length >= 20, `Lista com ${refs.length} referências.`, "A lista de referências está incompleta.");
check(missingRefs.length === 0, "Todas as citações têm referência correspondente.", "Citações sem referência: " + missingRefs.join(", "));

// Arquivos locais referenciados
const localRefs = [...(html + read("presenter.html")).matchAll(/\b(?:src|href)="((?:assets|css|js)\/[^"#?]+)(?:\?[^"]*)?"/g)].map((m) => m[1]);
const imgKeys = [...html.matchAll(/data-(?:lightbox|img)="([a-z0-9-]+)"/g)].map((m) => `assets/img/${m[1]}.jpg`);
const registry = [...read("js/app.js").matchAll(/^\s+"([a-z0-9-]+)": \["/gm)].map((m) => `assets/img/${m[1]}.jpg`);
const missingFiles = [...new Set([...localRefs, ...imgKeys, ...registry])].filter((f) => !fs.existsSync(f));
check(missingFiles.length === 0, `Todos os ${new Set([...localRefs, ...imgKeys, ...registry]).size} arquivos locais existem.`, "Arquivos referenciados e ausentes: " + missingFiles.join(", "));
check(!/src="https?:\/\//.test(html), "Imagens e scripts servidos pelo próprio projeto.", "Há imagem ou script carregado de domínio externo.");

// Acessibilidade das imagens
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const noAlt = imgs.filter((tag) => !/\balt="/.test(tag));
check(noAlt.length === 0, `Todas as ${imgs.length} imagens têm texto alternativo (alt).`, `${noAlt.length} imagem(ns) sem alt.`);

// Recursos de apresentação
for (const [sel, label] of [
  ['id="btnPrev"', "botão anterior"], ['id="btnNext"', "botão próximo"], ['id="btnFull"', "tela cheia"],
  ['id="btnIndex"', "índice/miniaturas"], ['id="progressFill"', "barra de progresso"], ['id="navNum"', "numeração"],
  ['id="keyHint"', "indicador de teclado"], ['id="lightbox"', "visualizador de imagens"], ['id="timeline"', "linha do tempo"],
  ['data-map="theater"', "mapa das campanhas"], ['data-map="prata"', "mapa da Bacia do Prata"],
  ['id="btnAudio"', "botão de áudio"], ['id="btnPresenter"', "botão do modo apresentador"], ['class="locator"', "localizador das batalhas"],
  ['class="phase-stamp"', "carimbo de datas do mapa"],
]) check(html.includes(sel), "Presente: " + label + ".", "Ausente: " + label + ".");
check(css.includes("prefers-reduced-motion"), "CSS respeita prefers-reduced-motion.", "Falta suporte a prefers-reduced-motion.");
check(/ArrowRight/.test(js) && /ArrowLeft/.test(js) && /touchend/.test(js), "Navegação por teclado e toque implementada.", "Falta navegação por teclado ou toque.");
check(/requestFullscreen/.test(js), "Tela cheia implementada.", "Tela cheia ausente.");

// Sintaxe JavaScript
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    pass.push("Sintaxe válida: " + file + ".");
  } catch (error) {
    fail.push("Erro de sintaxe em " + file + ": " + String(error.stderr || error.message).split("\n")[0]);
  }
}

// Tamanho total publicado
const size = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((sum, e) => sum + (e.isDirectory() ? size(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size), 0);
const total = ["index.html", "css", "js", "assets"].reduce((s, p) => s + (fs.statSync(p).isDirectory() ? size(p) : fs.statSync(p).size), 0);
check(total < 15 * 1024 * 1024, `Tamanho total do site: ${(total / 1048576).toFixed(1)} MB.`, `Site grande demais: ${(total / 1048576).toFixed(1)} MB.`);

for (const msg of pass) console.log("✓ " + msg);
for (const msg of fail) console.error("✗ " + msg);
console.log(`\n${pass.length} verificações aprovadas, ${fail.length} falha(s).`);
process.exit(fail.length ? 1 : 0);
