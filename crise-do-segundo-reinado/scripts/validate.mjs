#!/usr/bin/env node
// Validação estática do site "A Crise do Segundo Reinado" em 12 slides.
// Rode de qualquer pasta:  node crise-do-segundo-reinado/scripts/validate.mjs
// Não substitui a inspeção visual no navegador.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

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
const presenter = read("presenter.html");
const cssFiles = ["css/base.css", "css/deck.css", "css/motion.css", "css/slides.css", "css/reinado.css", "css/crise.css", "css/responsive.css", "css/scenes.css", "css/presenter.css"];
const jsFiles = ["js/map-data.js", "js/images.js", "js/fx.js", "js/score.js", "js/audio.js", "js/app.js", "js/notes.js", "js/presenter.js"];
const css = cssFiles.map(read).join("\n");
const js = jsFiles.map(read).join("\n");

check(html.includes('<html lang="pt-BR">'), "HTML declara português brasileiro.", 'O HTML precisa declarar lang="pt-BR".');

// Exatamente 18 slides, na ordem do roteiro
const expected = [
  "capa", "estabilidade", "religiosa", "militar", "abolicao", "lei-aurea",
  "republicanismo", "isolamento", "articulacao", "proclamacao", "conclusao", "referencias",
];
const starts = [...html.matchAll(/<section class="slide [^"]*" id="([^"]+)"([^>]*)>/g)];
const slides = starts.map((m) => ({ id: m[1], attrs: m[2] }));
check(slides.length === 12, "A apresentação tem exatamente 12 slides (capa, 10 de conteúdo e referências).", `Esperados 12 slides; encontrados ${slides.length}.`);
const content = slides.filter((s) => /data-stage="\d"/.test(s.attrs));
check(content.length === 10, "10 slides de conteúdo marcados no arco narrativo.", `Esperados 10 slides de conteúdo com data-stage; encontrados ${content.length}.`);
const stages = content.map((s) => Number(s.attrs.match(/data-stage="(\d)"/)[1]));
check(stages.every((v, i) => i === 0 || v >= stages[i - 1]) && new Set(stages).size === 6, "Arco narrativo completo e em ordem: estabilidade → tensões → crises → rupturas → isolamento → República.", "O arco narrativo está fora de ordem ou incompleto: " + stages.join(", "));
check(html.includes('id="arc"'), "Barra do arco narrativo presente.", "Falta a barra do arco narrativo.");
check(/k === "F11"/.test(read("js/app.js")) && /k === " "/.test(read("js/app.js")), "Teclas F11 e Espaço tratadas.", "Faltam as teclas F11 ou Espaço.");
check(expected.every((id, i) => slides[i]?.id === id), "Slides na ordem narrativa prevista.", "Ordem dos slides diferente da prevista: " + slides.map((s) => s.id).join(", "));
check(slides.every((s) => /data-title="[^"]+"/.test(s.attrs)), "Todos os slides têm título para o índice.", "Há slide sem data-title.");

// Transições: cada slide declara a sua e há variedade
const transitions = slides.map((s) => (s.attrs.match(/data-transition="([^"]+)"/) || [])[1]);
check(transitions.every(Boolean), "Todos os slides declaram uma transição.", "Há slide sem data-transition.");
check(new Set(transitions).size >= 7, `Transições personalizadas: ${new Set(transitions).size} tipos diferentes.`, "Poucas transições diferentes.");

// Roteiro do apresentador
const notesSrc = read("js/notes.js");
const sandbox = { window: {} };
try { vm.runInNewContext(notesSrc, sandbox); } catch (e) { fail.push("js/notes.js não pôde ser lido: " + e.message); }
const NOTES = sandbox.window.GP_NOTES || {};
const missingNotes = slides.filter((s) => !NOTES[s.id] || !NOTES[s.id].fala);
check(missingNotes.length === 0, "Roteiro com fala para todos os slides.", "Slides sem notas no roteiro: " + missingNotes.map((s) => s.id).join(", "));
const extraNotes = Object.keys(NOTES).filter((k) => !expected.includes(k));
check(extraNotes.length === 0, "Nenhuma nota sobrando no roteiro.", "Notas para slides inexistentes: " + extraNotes.join(", "));
check(!html.includes("js/notes.js") && !html.includes("GP_NOTES"), "As notas não são carregadas na projeção.", "As notas do apresentador estão na página da projeção.");
check(presenter.includes("js/notes.js") && presenter.includes('id="pvNext"') && presenter.includes('id="pvElapsed"'), "Modo apresentador com notas, próximo slide e cronômetro.", "Modo apresentador incompleto.");
check(fs.existsSync("ROTEIRO.md"), "ROTEIRO.md presente.", "ROTEIRO.md ausente (rode node scripts/roteiro.mjs).");
const total = Object.values(NOTES).reduce((s, n) => s + (Number(n.tempo) || 0), 0);
check(total >= 15 * 60 && total <= 30 * 60, `Tempo total estimado: ${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}.`, `Tempo total fora do esperado: ${total} s.`);

// Tópicos revelados por clique coerentes com o roteiro
const stepIssues = [];
starts.forEach((m, i) => {
  const id = m[1];
  const steps = Number((m[2].match(/data-steps="(\d+)"/) || [])[1] || 0);
  const body = html.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : html.length);
  const ats = [...body.matchAll(/data-at="(\d+)"/g)].map((a) => Number(a[1]));
  if (ats.some((a) => a > steps)) stepIssues.push(`${id}: item em etapa maior que data-steps`);
  if (steps && (NOTES[id]?.etapas || []).length !== steps + 1) stepIssues.push(`${id}: ${steps + 1} etapas, ${(NOTES[id]?.etapas || []).length} textos no roteiro`);
  if (steps && (NOTES[id]?.topicos || []).length !== steps + 1) stepIssues.push(`${id}: faltam lembretes de tópicos no roteiro`);
  if (steps && !ats.length && !/data-map=/.test(body)) stepIssues.push(`${id}: tem etapas, mas nada é revelado por clique`);
});
check(stepIssues.length === 0, "Tópicos por clique coerentes com o roteiro.", "Tópicos incoerentes: " + stepIssues.join("; "));

// Áudio: nada automático e nenhuma gravação inexistente anunciada
const manifest = JSON.parse(read("assets/audio/narracao/manifest.json") || "{}");
const listed = Object.values(manifest.slides || {}).map((e) => "assets/audio/narracao/" + (typeof e === "string" ? e : e.arquivo));
const absent = listed.filter((f) => !fs.existsSync(f));
check(absent.length === 0, `Manifesto de narração coerente (${listed.length} gravação(ões) listada(s)).`, "Gravações listadas mas ausentes: " + absent.join(", "));
check(!/autoplay/i.test(html), "Nenhum áudio com reprodução automática.", "Há autoplay na página.");

// Créditos originais
for (const name of ["Professora Rita", "Davi Matheus", "Juan Bento", "Lucas Godoy", "Kaique", "Pedro Lucas"]) {
  check(html.includes(name), "Crédito presente: " + name + ".", "Crédito ausente: " + name + ".");
}

// IDs, âncoras e referências
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
const uncited = refs.filter((n) => !cites.includes(n));
check(refs.length >= 15, `Lista com ${refs.length} referências.`, "A lista de referências está incompleta.");
check(missingRefs.length === 0, `Todas as ${cites.length} citações têm referência correspondente.`, "Citações sem referência: " + missingRefs.join(", "));
check(uncited.length === 0, "Todas as referências são citadas em algum slide.", "Referências nunca citadas: " + uncited.join(", "));

// Imagens: registro, arquivos e créditos
const reg = { window: {} };
try { vm.runInNewContext(read("js/images.js"), reg); } catch (e) { fail.push("js/images.js não pôde ser lido: " + e.message); }
const IMAGES = reg.window.GP?.IMAGES || {};
const imgPath = (k) => `assets/img/${k}.${IMAGES[k]?.[4] || "jpg"}`;
const used = [...new Set([...html.matchAll(/data-(?:lightbox|img)="([a-z0-9-]+)"/g)].map((m) => m[1]))];
const unregistered = used.filter((k) => !IMAGES[k]);
check(unregistered.length === 0, `Todas as ${used.length} imagens ampliáveis estão no registro de créditos.`, "Imagens sem registro de crédito: " + unregistered.join(", "));
const noCredit = Object.keys(IMAGES).filter((k) => !IMAGES[k][1] || !IMAGES[k][3]);
check(noCredit.length === 0, "Todas as imagens têm ficha no Commons e licença.", "Imagens sem ficha ou licença: " + noCredit.join(", "));
const unused = Object.keys(IMAGES).filter((k) => !used.includes(k) && !html.includes(imgPath(k)));
check(unused.length === 0, "Nenhuma imagem registrada sem uso.", "Imagens registradas e não usadas: " + unused.join(", "));

// Arquivos locais referenciados
const localRefs = [...(html + presenter).matchAll(/\b(?:src|href|data-thumb)="((?:assets|css|js)\/[^"#?]+)(?:\?[^"]*)?"/g)].map((m) => m[1]);
const all = [...new Set([...localRefs, ...Object.keys(IMAGES).map(imgPath), "assets/img/papel.jpg"])];
const missingFiles = all.filter((f) => !fs.existsSync(f));
check(missingFiles.length === 0, `Todos os ${all.length} arquivos locais existem.`, "Arquivos referenciados e ausentes: " + missingFiles.join(", "));
check(!/\bsrc="https?:\/\//.test(html + presenter), "Imagens e scripts servidos pelo próprio projeto.", "Há imagem ou script carregado de domínio externo.");

// Acessibilidade das imagens
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const noAlt = imgs.filter((tag) => !/\balt="/.test(tag));
check(noAlt.length === 0, `Todas as ${imgs.length} imagens têm texto alternativo (alt).`, `${noAlt.length} imagem(ns) sem alt.`);

// Recursos de apresentação
for (const [sel, label] of [
  ['id="btnPrev"', "botão anterior"], ['id="btnNext"', "botão próximo"], ['id="btnFull"', "tela cheia"],
  ['id="btnIndex"', "índice/miniaturas"], ['id="progressFill"', "barra de progresso"], ['id="navNum"', "numeração"],
  ['id="lightbox"', "visualizador de imagens"], ['id="referencias"', "slide de referências"], ['id="credits"', "créditos das imagens"],
  ['id="btnRefs"', "botão de referências"], ['data-atlas="finale"', "mapa animado na conclusão"], ['id="btnAudio"', "botão de áudio"], ['id="btnPresenter"', "botão do modo apresentador"],
]) check(html.includes(sel), "Presente: " + label + ".", "Ausente: " + label + ".");
check(css.includes("prefers-reduced-motion"), "CSS respeita prefers-reduced-motion.", "Falta suporte a prefers-reduced-motion.");
check(/ArrowRight/.test(js) && /ArrowLeft/.test(js) && /touchend/.test(js), "Navegação por teclado e toque implementada.", "Falta navegação por teclado ou toque.");
check(/requestFullscreen/.test(js), "Tela cheia implementada.", "Tela cheia ausente.");
check(/crise12-apresentacao/.test(read("js/app.js")) && /crise12-apresentacao/.test(read("js/presenter.js")), "Canal próprio entre projeção e apresentador.", "O canal do apresentador não é o deste site.");

// Sintaxe JavaScript
for (const file of [...jsFiles, "scripts/roteiro.mjs", "scripts/validate.mjs", "scripts/imagens.mjs"]) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    pass.push("Sintaxe válida: " + file + ".");
  } catch (error) {
    fail.push("Erro de sintaxe em " + file + ": " + String(error.stderr || error.message).split("\n")[0]);
  }
}

// Tamanho do site publicado
const size = (p) => (fs.statSync(p).isDirectory() ? fs.readdirSync(p).reduce((s, e) => s + size(path.join(p, e)), 0) : fs.statSync(p).size);
const bytes = ["index.html", "presenter.html", "css", "js", "assets"].reduce((s, p) => s + size(p), 0);
check(bytes < 15 * 1024 * 1024, `Tamanho do site: ${(bytes / 1048576).toFixed(1)} MB.`, `Site grande demais: ${(bytes / 1048576).toFixed(1)} MB.`);

for (const msg of pass) console.log("✓ " + msg);
for (const msg of fail) console.error("✗ " + msg);
console.log(`\n${pass.length} verificações aprovadas, ${fail.length} falha(s).`);
process.exit(fail.length ? 1 : 0);
