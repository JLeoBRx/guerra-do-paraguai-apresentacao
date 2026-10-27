#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const fail = [];
const pass = [];
const read = (path) => {
  if (!fs.existsSync(path)) {
    fail.push("Arquivo obrigatório ausente: " + path);
    return "";
  }
  return fs.readFileSync(path, "utf8");
};

const html = read("index.html");
const css = read("styles.css");
const presCss = read("presentation.css");
const experienceCss = read("experience.css");
const js = read("script.js");
const requiredNames = [
  "Pedro Henrique", "Clara Maria", "Anthony Claudio",
  "Gabriel Willian", "Leandro Farias", "Lohan David"
];

function check(condition, ok, error) {
  if (condition) pass.push(ok);
  else fail.push(error);
}

check(html.includes('<html lang="pt-BR">'), "HTML declara português brasileiro.", 'O HTML precisa declarar lang="pt-BR".');
check(
  html.includes('id="resumo"') && html.includes('id="introducao"') &&
  html.includes('id="metodologia"') && html.includes('id="contexto"') &&
  html.includes('id="causas"') && html.includes('id="campanhas"') &&
  html.includes('id="sociedade"') && html.includes('id="consequencias"') &&
  html.includes('id="historiografia"') && html.includes('id="conclusao"') &&
  html.includes('id="referencias"'),
  "Todas as seções acadêmicas principais estão presentes.",
  "Falta uma ou mais seções acadêmicas obrigatórias."
);

for (const name of requiredNames) {
  check(html.includes(name), "Integrante presente: " + name + ".", "Integrante ausente: " + name + ".");
}

const idMatches = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = idMatches.filter((id, index) => idMatches.indexOf(id) !== index);
check(duplicateIds.length === 0, "Não há IDs HTML duplicados.",
  "IDs duplicados: " + [...new Set(duplicateIds)].join(", ") + ".");

const ids = new Set(idMatches);
const internalLinks = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
const brokenLinks = [...new Set(internalLinks.filter((id) => !ids.has(id)))];
check(brokenLinks.length === 0, "Todos os links internos têm destino.",
  "Links internos sem destino: " + brokenLinks.join(", ") + ".");

const citationTargets = [...html.matchAll(/\bhref="#ref(\d+)"/g)].map((match) => Number(match[1]));
const availableReferences = new Set([...html.matchAll(/<li\b[^>]*\bid="ref(\d+)"/g)].map((match) => Number(match[1])));
const missingReferences = [...new Set(citationTargets.filter((number) => !availableReferences.has(number)))];
check(missingReferences.length === 0, "As citações numéricas possuem referência correspondente.",
  "Citações sem referência: " + missingReferences.map((n) => "[" + n + "]").join(", ") + ".");

const slides = [...html.matchAll(/<section class="(pres-slide[^"]*)" data-pres-title="([^"]+)"([^>]*)>/g)]
  .map((match) => ({ className: match[1], title: match[2], attrs: match[3] }));
check(slides.length === 10, "A apresentação contém 10 slides (" + slides.length + ").",
  "A apresentação deveria ter 10 slides; encontrados: " + slides.length + ".");
if (slides.length) {
  check(!/\bhidden\b/.test(slides[0].attrs) && slides.slice(1).every((slide) => /\bhidden\b/.test(slide.attrs)),
    "Somente o primeiro slide está visível por padrão.",
    "Verifique o atributo hidden inicial dos slides.");
}

const expectedSlides = [
  "A Guerra do Paraguai", "Objetivo e método", "A região do Prata",
  "Causas do conflito", "Cronologia essencial", "Batalhas e estratégia",
  "O custo humano", "Consequências", "Debate historiográfico", "Conclusão"
];
check(expectedSlides.every((title, index) => slides[index]?.title === title),
  "Ordem e títulos dos slides estão corretos.",
  "A ordem ou os títulos dos slides não correspondem à sequência prevista.");

const images = [...html.matchAll(/<img\b([^>]*?)>/g)].map((match) => match[1]);
const imagesMissingAlt = images.filter((attrs) => {
  const src = (attrs.match(/\bsrc="([^"]*)"/) || [])[1] || "";
  const alt = (attrs.match(/\balt="([^"]*)"/) || [])[1] || "";
  return src.trim() !== "" && alt.trim() === "";
});
check(imagesMissingAlt.length === 0, "Todas as imagens com fonte têm texto alternativo.",
  "Imagens sem texto alternativo: " + imagesMissingAlt.length + ".");

check(html.includes('id="presentButton"') && html.includes('id="presentationExit"') &&
  html.includes('id="presPrev"') && html.includes('id="presNext"') && html.includes('id="presDots"'),
  "Controles do modo apresentação estão presentes.",
  "Um ou mais controles de apresentação estão ausentes.");
check(js.includes("browserWindowIsFullscreen") && js.includes("ArrowRight") && js.includes("ArrowLeft") &&
  js.includes("PageDown") && js.includes("PageUp") && js.includes("presNext") &&
  !js.includes("document.documentElement.requestFullscreen"),
  "F11 do navegador e navegação por teclado estão sincronizados sem conflito de tela cheia.",
  "Falta a lógica F11 ou há uma solicitação de tela cheia que pode conflitar com o F11 do navegador.");
check(js.indexOf("function initRevealMotion()") < js.indexOf("function setMenu") &&
  js.includes("initRevealMotion();") &&
  js.includes("fullscreenResyncQueued") && js.includes("window.setTimeout(() => {") &&
  js.includes("window.addEventListener('resize', () => {\n    updateScrollUI();\n    syncFullscreenMode();"),
  "A animação de leitura inicializa no carregamento e o redimensionamento só sincroniza F11.",
  "A animação de leitura parece aninhada no evento resize ou a sincronização F11 está incompleta.");

check(presCss.includes(".pres-title-slide") && presCss.includes(".pres-map-layout") &&
  presCss.includes("@media print") && presCss.includes("prefers-reduced-motion"),
  "A folha de apresentação, impressão e redução de movimento está presente.",
  "Estão ausentes estilos de apresentação, impressão ou acessibilidade.");
check(html.includes('href="experience.css"') &&
  experienceCss.includes("--accent-lime") && experienceCss.includes(".pres-title-slide") &&
  experienceCss.includes("@keyframes experienceSlideIn"),
  "A nova identidade visual está vinculada ao site e à apresentação.",
  "A folha do novo design ou suas animações não estão corretamente conectadas.");
check(experienceCss.includes("calc((100dvh - 164px)*1.7777778)") &&
  experienceCss.includes("calc((100dvh - 126px)*1.7777778)") &&
  experienceCss.includes("max-height:calc(100dvh - 146px)") &&
  experienceCss.includes("@media (min-width:651px) and (max-height:800px)"),
  "O dimensionamento F11 tem margens de segurança para telas altas, laptops e dispositivos móveis.",
  "Faltam regras de dimensionamento para a altura real da área de apresentação.");
check(js.includes("initRevealMotion") && js.includes("IntersectionObserver") && js.includes("is-revealed"),
  "Animações de entrada do conteúdo principal estão implementadas.",
  "A lógica de animação progressiva do conteúdo está ausente.");

check([css, presCss, experienceCss].every((sheet) =>
  (sheet.match(/{/g) || []).length === (sheet.match(/}/g) || []).length),
  "As chaves das três folhas CSS estão balanceadas.", "As chaves de uma das folhas CSS parecem estar desbalanceadas.");

try {
  execFileSync(process.execPath, ["--check", "script.js"], { stdio: "pipe" });
  pass.push("Sintaxe do JavaScript validada pelo Node.js.");
} catch (error) {
  fail.push("Erro de sintaxe em script.js: " + (error.stderr?.toString() || error.message).trim());
}

console.log("VALIDAÇÃO DO SITE — GUERRA DO PARAGUAI");
for (const message of pass) console.log("PASS  " + message);
for (const message of fail) console.error("FAIL  " + message);
console.log("\nResultado: " + pass.length + " verificações aprovadas; " + fail.length + " falhas.");
if (fail.length) process.exit(1);
