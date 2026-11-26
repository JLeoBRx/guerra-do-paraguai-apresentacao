// A Crise do Segundo Reinado (1840–1889) — 18 slides, 16:9.
// node build.js <prepared-images-dir> <assets-dir> <out.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const { icon } = require("./icons");
const SPEC = require("./images.json");
const NOTES = require("./notes");

const [IMG_DIR, ASSET_DIR, OUT] = process.argv.slice(2);
const { applyTheme } = require("./apply_theme");

const THEME = {
  name: "Segundo Reinado",
  headFontFace: "Georgia",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1E1610", lt1: "F6F0E2", dk2: "123024", lt2: "E4D6B8",
    accent1: "7D5C22", accent2: "8E2A22", accent3: "3B2416", accent4: "2C5545",
    accent5: "D4B26A", accent6: "6E6252", hlink: "8E2A22", folHlink: "3B2416",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "A Crise do Segundo Reinado";
pres.subject = "História do Brasil — Segundo Reinado (1840–1889)";
pres.author = "Davi Matheus, Juan Bento, Lucas Godoy, Kaique e Pedro Lucas";
const C = pres.SchemeColor;
const W = 13.333, H = 7.5, MX = 0.6;
const TOTAL = 18;

const A = (f) => path.join(ASSET_DIR, f);
const P = (slot) => {
  const f = path.join(IMG_DIR, slot + (slot.endsWith("flag") ? ".png" : ".jpg"));
  return f;
};

// ---------- layouts (one per slide frame) ----------
const titleOpts = (x, w, color) => ({
  name: "title", type: "title", x, y: 0.8, w, h: 1.3,
  fontFace: "Georgia", fontSize: 36, color, align: "left", valign: "top", margin: 0,
});
pres.defineSlideMaster({ title: "CAPA", background: { path: A("green.jpg") }, objects: [] });
pres.defineSlideMaster({ title: "FOTO", background: { path: A("ink.jpg") }, objects: [] });
pres.defineSlideMaster({
  title: "PAPEL", background: { path: A("paper.jpg") },
  objects: [{ placeholder: { options: titleOpts(MX, W - 2 * MX, C.text1), text: "" } }],
});
pres.defineSlideMaster({
  title: "PAPEL_ESQ", background: { path: A("paper.jpg") },
  objects: [{ placeholder: { options: titleOpts(MX, 5.7, C.text1), text: "" } }],
});
pres.defineSlideMaster({
  title: "PAPEL_DIR", background: { path: A("paper.jpg") },
  objects: [{ placeholder: { options: titleOpts(5.85, W - 5.85 - MX, C.text1), text: "" } }],
});
pres.defineSlideMaster({
  title: "VERDE", background: { path: A("green.jpg") },
  objects: [{ placeholder: { options: titleOpts(MX, W - 2 * MX, C.background1), text: "" } }],
});

// ---------- helpers ----------
let N = 0;
let currentSection = null;
function slide(master, section) {
  if (section && section !== currentSection) {
    pres.addSection({ title: section });
    currentSection = section;
  }
  const s = pres.addSlide({ masterName: master, sectionTitle: currentSection });
  N += 1;
  s._n = N;
  return s;
}
const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: "Calibri", valign: "top" }, o));
const kicker = (s, text, x, y, w, color) =>
  T(s, text.toUpperCase(), { x, y, w, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 3 });
const title = (s, text) => s.addText(text, { placeholder: "title" });
const lead = (s, text, x, y, w, color, h = 0.5, size = 19) =>
  T(s, text, { x, y, w, h, fontFace: "Georgia", italic: true, fontSize: size, color });
function footer(s, dark) {
  const nn = String(s._n).padStart(2, "0");
  T(s, [
    { text: "A CRISE DO SEGUNDO REINADO", options: { charSpacing: 2 } },
    { text: "   " + nn + " / " + TOTAL, options: { bold: true } },
  ], { x: W - MX - 4.6, y: 7.06, w: 4.6, h: 0.26, fontSize: 10, align: "right", color: dark ? C.background2 : C.accent6 });
}
function img(s, slot, x, y, extra = {}) {
  const sp = SPEC[slot];
  if (!sp) throw new Error("no spec " + slot);
  s.addImage(Object.assign({ path: P(slot), x, y, w: sp.w, h: sp.h, altText: extra.alt || slot }, extra.opts || {}));
  return sp;
}
function keyline(s, x, y, w, h, color = C.accent5, width = 0.75) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { type: "none" }, line: { color, width } });
}
function shadowRect(s, x, y, w, h, fill = C.background1, rotate = 0) {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill }, line: { type: "none" }, rotate,
    shadow: { type: "outer", color: "000000", opacity: 0.32, blur: 10, offset: 4, angle: 90 },
  });
}
// framed document: paper mat + image + hairline
function documentFrame(s, slot, x, y, rotate = 0, mat = 0.16, alt) {
  const sp = SPEC[slot];
  shadowRect(s, x - mat, y - mat, sp.w + 2 * mat, sp.h + 2 * mat, C.background1, rotate);
  s.addImage({ path: P(slot), x, y, w: sp.w, h: sp.h, rotate, altText: alt || slot });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: sp.w, h: sp.h, rotate, fill: { type: "none" }, line: { color: C.accent1, width: 0.5 } });
}
// cameo portrait: oval image + gold ring
function cameo(s, slot, x, y, ring = C.accent1, alt) {
  const sp = SPEC[slot];
  s.addImage({ path: P(slot), x, y, w: sp.w, h: sp.h, rounding: true, altText: alt || slot });
  s.addShape(pres.shapes.OVAL, { x: x - 0.05, y: y - 0.05, w: sp.w + 0.1, h: sp.h + 0.1, fill: { type: "none" }, line: { color: ring, width: 2 } });
  return sp;
}
async function seal(s, x, y, d, iconName, opts = {}) {
  const fill = opts.fill || C.text2;
  const ring = opts.ring || C.accent5;
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: opts.noFill ? { type: "none" } : { color: fill }, line: { color: ring, width: 1.25 } });
  const pad = d * 0.22;
  s.addImage({ data: await icon(iconName, opts.iconHex || HEX.accent5), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, altText: "Ícone decorativo" });
}
const caption = (s, text, x, y, w, color, align = "left", h = 0.3) =>
  T(s, text, { x, y, w, h, fontSize: 10, italic: true, color, align });
const bullets = (items, o = {}) => items.map((t, i) => ({
  text: t,
  options: Object.assign({ bullet: { indent: 16 }, breakLine: i < items.length - 1, paraSpaceAfter: o.space ?? 6 }, o.run || {}),
}));

// ======================================================================
async function build() {
  // ---------------- 01 CAPA ----------------
  {
    const s = slide("CAPA", "Abertura");
    img(s, "s01_pedro", W - 6.9, 0, { alt: "Fotografia de D. Pedro II em 1876, idoso, de barba branca e paletó escuro" });
    s.addImage({ path: A("fade_green_band.png"), x: W - 6.9 - 1.0, y: 0, w: 4.8, h: H, altText: "Elemento decorativo" });
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "História do Brasil  ·  Brasil Imperial", 0.85, 1.0, 6, C.accent5);
    T(s, "A Crise do", { x: 0.85, y: 1.45, w: 6, h: 0.7, fontFace: "Georgia", italic: true, fontSize: 34, color: C.accent5 });
    T(s, "Segundo Reinado", { x: 0.85, y: 2.08, w: 5.9, h: 2.3, fontFace: "Georgia", fontSize: 68, color: C.background1, lineSpacingMultiple: 0.9 });
    T(s, "Os conflitos e as rupturas que levaram ao fim da monarquia brasileira", { x: 0.85, y: 4.45, w: 5.5, h: 0.85, fontSize: 20, color: C.background2 });
    T(s, "1840 – 1889", { x: 0.85, y: 5.38, w: 5, h: 0.6, fontFace: "Georgia", fontSize: 30, color: C.accent5 });
    T(s, [
      { text: "História  ·  Professora Rita", options: { breakLine: true, bold: true } },
      { text: "Davi Matheus · Juan Bento · Lucas Godoy · Kaique · Pedro Lucas" },
    ], { x: 0.85, y: 6.3, w: 5.9, h: 0.6, fontSize: 13, color: C.background2, paraSpaceAfter: 2 });
    caption(s, "D. Pedro II em 1876 · estúdio de Mathew Brady · Library of Congress", W - 6.4, 6.62, 5.9, C.background2, "right");
    s.addNotes(NOTES[1]);
  }

  // ---------------- 02 O BRASIL IMPERIAL ----------------
  {
    const s = slide("PAPEL_DIR", "I. O Império");
    const op = SPEC.s02_pedro1840, ox = 0.95, oy = 0.85;
    s.addShape(pres.shapes.OVAL, { x: ox - 0.14, y: oy - 0.14, w: op.w + 0.28, h: op.h + 0.28, fill: { color: C.background1 }, line: { color: C.accent1, width: 0.75 },
      shadow: { type: "outer", color: "000000", opacity: 0.3, blur: 10, offset: 4, angle: 90 } });
    cameo(s, "s02_pedro1840", ox, oy, C.accent1, "Pintura oval de D. Pedro II adolescente, em 1840, de uniforme de gala, em pé num terraço");
    T(s, [
      { text: "D. Pedro II aos 14 anos, 1840", options: { bold: true, italic: false, breakLine: true } },
      { text: "Claude Joseph Barandier · óleo sobre tela" },
    ], { x: 0.6, y: 6.42, w: 4.6, h: 0.5, fontSize: 10.5, italic: true, color: C.accent6, align: "center" });
    kicker(s, "Parte I  ·  O Império", 5.85, 0.45, 6.5, C.accent1);
    title(s, "O Brasil Imperial");
    lead(s, "O contexto do Segundo Reinado (1840–1889)", 5.85, 1.55, 6.88, C.accent3);
    const stats = [
      ["1840", "D. Pedro II, aos 14 anos, é declarado maior de idade e assume o trono"],
      ["9,9 mi", "habitantes no primeiro censo do país (1872)"],
      ["1,5 mi", "pessoas escravizadas — cerca de 15% da população (1872)"],
    ];
    stats.forEach(([n, l], i) => {
      const x = 5.85 + i * 2.33;
      T(s, n, { x, y: 2.3, w: 2.15, h: 0.7, fontFace: "Georgia", fontSize: 38, color: i === 2 ? C.accent2 : C.text2 });
      T(s, l, { x, y: 3.02, w: 2.1, h: 0.75, fontSize: 12, color: C.accent3 });
    });
    const items = [
      ["GiImperialCrown", "Golpe da Maioridade", "Encerrou a Regência (1831–1840), marcada por revoltas em várias províncias."],
      ["GiGreekTemple", "Centralização política", "Decisões concentradas no Rio de Janeiro; presidentes de província nomeados pelo governo."],
      ["GiScrollUnfurled", "Constituição de 1824", "Quatro poderes, Senado vitalício e voto censitário, restrito pela renda."],
      ["GiCoffeeBeans", "Sociedade agrária", "País rural, economia exportadora e trabalho escravizado."],
    ];
    for (let i = 0; i < items.length; i++) {
      const [ic, h, t] = items[i];
      const x = 5.85 + (i % 2) * 3.55, y = 4.1 + Math.floor(i / 2) * 1.42;
      await seal(s, x, y, 0.52, ic);
      T(s, [
        { text: h, options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } },
        { text: t, options: { fontSize: 14, color: C.accent3 } },
      ], { x: x + 0.68, y: y - 0.02, w: 2.7, h: 1.3, paraSpaceAfter: 3 });
    }
    footer(s);
    s.addNotes(NOTES[2]);
  }

  // ---------------- 03 ESTABILIDADE E CONTRADIÇÕES ----------------
  {
    const s = slide("PAPEL", "I. O Império");
    kicker(s, "Parte I  ·  O Império", MX, 0.45, 8, C.accent1);
    title(s, "Estabilidade e contradições");
    lead(s, "Um Império aparentemente estável", MX, 1.55, 8, C.accent3);
    // mirrored comparison: [image | text]  [text | image]
    const iw = SPEC.s03_fala.w, ih = SPEC.s03_fala.h, py = 2.3;
    const panels = [
      { slot: "s03_fala", ix: MX, tx: MX + iw + 0.3, label: "A FACHADA", sub: "a política", col: C.text2,
        cap: "Pedro Américo · Fala do Trono, 1872 · Museu Imperial",
        alt: "Pintura de D. Pedro II de coroa e manto imperial na abertura da Assembleia Geral",
        items: ["Liberais e conservadores se revezavam no governo", "“Parlamentarismo às avessas”: o imperador escolhia o chefe do gabinete", "Poder Moderador: o imperador podia dissolver a Câmara e nomear senadores"], stat: ["1847", "criação do cargo de presidente do Conselho de Ministros"] },
      { slot: "s03_cafe", ix: W - MX - iw, tx: 6.86, label: "OS BASTIDORES", sub: "a sociedade", col: C.accent2,
        cap: "Marc Ferrez · Colheita de café no Vale do Paraíba, 1883",
        alt: "Fotografia de pessoas escravizadas colhendo café em um morro coberto de cafezais",
        items: ["A escravidão seguia como base do trabalho", "Riqueza concentrada nos grandes proprietários de terra", "Voto restrito: menos de 1% da população votava (1886)"], stat: ["61,5%", "das exportações eram de café (1881–1890)"] },
    ];
    const tw = 5.87 - iw - 0.3;
    for (const p of panels) {
      img(s, p.slot, p.ix, py, { alt: p.alt });
      s.addImage({ path: A("fade_ink_bottom.png"), x: p.ix, y: py + ih - 1.3, w: iw, h: 1.3, altText: "Elemento decorativo" });
      keyline(s, p.ix + 0.07, py + 0.07, iw - 0.14, ih - 0.14, C.accent5, 0.5);
      caption(s, p.cap, p.ix + 0.15, py + ih - 0.62, iw - 0.3, C.background1, "left", 0.5);
      T(s, p.label, { x: p.tx, y: py + 0.05, w: tw, h: 0.32, bold: true, charSpacing: 3, color: p.col, fontSize: 14 });
      T(s, p.sub, { x: p.tx, y: py + 0.4, w: tw, h: 0.42, italic: true, fontFace: "Georgia", color: C.accent3, fontSize: 20 });
      T(s, bullets(p.items, { space: 9 }), { x: p.tx, y: py + 1.0, w: tw, h: 2.45, fontSize: 15, color: C.text1 });
      s.addShape(pres.shapes.LINE, { x: p.tx, y: py + 3.5, w: tw, h: 0, line: { color: C.accent1, width: 0.5 } });
      T(s, p.stat[0], { x: p.tx, y: py + 3.6, w: tw, h: 0.55, fontFace: "Georgia", fontSize: 30, color: p.col });
      T(s, p.stat[1], { x: p.tx, y: py + 4.13, w: tw, h: 0.38, fontSize: 12, color: C.accent3 });
    }
    s.addShape(pres.shapes.LINE, { x: W / 2, y: py, w: 0, h: ih, line: { color: C.accent1, width: 0.75 } });
    footer(s);
    s.addNotes(NOTES[3]);
  }

  // ---------------- 04 AS TRANSFORMAÇÕES DO BRASIL ----------------
  {
    const s = slide("PAPEL_ESQ", "I. O Império");
    kicker(s, "Parte I  ·  O Império", MX, 0.45, 5.7, C.accent1);
    title(s, "As transformações do Brasil");
    lead(s, "Um país em transformação", MX, 2.05, 5.7, C.accent3);
    const rows = [
      ["GiCoffeeBeans", "Café em expansão", "Do Vale do Paraíba para o Oeste Paulista"],
      ["GiSteamLocomotive", "Ferrovias", "De 14,5 km (1854) a cerca de 9.500 km (1889)"],
      ["GiDeskLamp", "Cidades modernizadas", "Iluminação a gás, bondes, telégrafo e cabo submarino (1874)"],
      ["GiCargoShip", "Comércio", "Portos de Santos e do Rio, bancos e casas comerciais"],
      ["GiNewspaper", "Novos grupos sociais", "Imigrantes, jornalistas, profissionais liberais, militares"],
      ["GiVote", "Pressões por mudança", "Abolição, autonomia das províncias e reformas políticas"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const [ic, h, t] = rows[i];
      const y = 2.72 + i * 0.7;
      await seal(s, MX, y, 0.5, ic);
      T(s, [
        { text: h, options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } },
        { text: t, options: { fontSize: 14, color: C.accent3 } },
      ], { x: MX + 0.68, y: y - 0.04, w: 5.1, h: 0.62 });
    }
    const mx = 6.6, my = 0.55, gap = 0.18;
    const wide = SPEC.s04_ferrovia, sq = SPEC.s04_santos;
    img(s, "s04_ferrovia", mx, my, { alt: "Fotografia da estrada de ferro Santos–São Paulo na serra, com trilhos, estação e mata" });
    img(s, "s04_santos", mx, my + wide.h + gap, { alt: "Fotografia de navios a vela e carregadores de sacas de café no porto de Santos, c. 1880" });
    img(s, "s04_ouvidor", mx + sq.w + gap, my + wide.h + gap, { alt: "Fotografia da Rua do Ouvidor, no Rio de Janeiro, com sobrados, lampiões e pedestres" });
    const caps = [
      [mx, my, wide.w, wide.h, "Marc Ferrez · Estrada de Ferro Santos–São Paulo, 1870 · Biblioteca Mário de Andrade"],
      [mx, my + wide.h + gap, sq.w, sq.h, "Marc Ferrez · Café no porto de Santos, c. 1880"],
      [mx + sq.w + gap, my + wide.h + gap, sq.w, sq.h, "Marc Ferrez · Rua do Ouvidor, Rio de Janeiro, s. d. · IMS"],
    ];
    for (const [x, y, w, h, c] of caps) {
      s.addImage({ path: A("fade_ink_bottom.png"), x, y: y + h - 0.95, w, h: 0.95, altText: "Elemento decorativo" });
      keyline(s, x + 0.07, y + 0.07, w - 0.14, h - 0.14, C.accent5, 0.5);
      caption(s, c, x + 0.18, y + h - 0.5, w - 0.36, C.background1, "left", 0.4);
    }
    footer(s);
    s.addNotes(NOTES[4]);
  }

  // ---------------- 05 A GUERRA DO PARAGUAI ----------------
  {
    const s = slide("FOTO", "II. As fissuras");
    img(s, "s05_avai", 0, 0, { alt: "Pintura de Pedro Américo: combate corpo a corpo sob chuva e fumaça na Batalha do Avaí" });
    s.addImage({ path: A("fade_ink_left_strong.png"), x: 0, y: 0, w: 10.6, h: H, transparency: 8, altText: "Elemento decorativo" });
    s.addImage({ path: A("fade_ink_bottom.png"), x: 0, y: 5.9, w: W, h: 1.6, altText: "Elemento decorativo" });
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "Parte II  ·  As fissuras  ·  1864–1870", 0.8, 0.7, 7, C.accent5);
    T(s, "A Guerra do Paraguai", { x: 0.8, y: 1.0, w: 7, h: 0.85, fontFace: "Georgia", fontSize: 40, color: C.background1 });
    lead(s, "O conflito que fortaleceu o Exército", 0.8, 1.85, 7, C.accent5, 0.5, 20);
    T(s, bullets([
      "Brasil, Argentina e Uruguai — a Tríplice Aliança — venceram o Paraguai de Solano López",
      "O Exército cresceu com Voluntários da Pátria, recrutamento forçado e escravizados libertos para lutar",
      "Os militares voltaram com prestígio e identidade própria",
      "No pós-guerra: soldos baixos, promoções lentas e desprezo pelos políticos civis, os “casacas”",
    ], { space: 9 }), { x: 0.8, y: 2.55, w: 6.1, h: 3.0, fontSize: 16, color: C.background1 });
    const st = [["≈ 139 mil", "brasileiros mobilizados"], ["≈ 50 mil", "brasileiros mortos"]];
    st.forEach(([n, l], i) => {
      const x = 0.8 + i * 2.6;
      T(s, n, { x, y: 5.55, w: 2.5, h: 0.62, fontFace: "Georgia", fontSize: 32, color: C.accent5 });
      T(s, l, { x, y: 6.15, w: 2.5, h: 0.3, fontSize: 13, color: C.background2 });
    });
    caption(s, "Estimativas mais citadas pela historiografia — os números variam", 0.8, 6.5, 5.5, C.background2);
    const ins = SPEC.s05_inset, ix = 10.05, iy = 0.95;
    shadowRect(s, ix - 0.15, iy - 0.15, ins.w + 0.3, ins.h + 0.95, C.background1);
    img(s, "s05_inset", ix, iy, { alt: "Fotografia colorida à mão de um soldado do 1º Batalhão de Voluntários da Pátria, de farda e chapéu, em 1865" });
    T(s, [
      { text: "Voluntário da Pátria, 1865", options: { bold: true, breakLine: true } },
      { text: "Furriel Luiz Antonio de Vargas, do 1º Batalhão de Voluntários da Pátria." },
    ], { x: ix, y: iy + ins.h + 0.08, w: ins.w, h: 0.72, fontSize: 10, color: C.text1 });
    caption(s, "Pedro Américo · Batalha do Avaí, 1872–1877 · Museu Nacional de Belas Artes (detalhe)", 5.3, 6.62, 7.4, C.background2, "right");
    s.addNotes(NOTES[5]);
  }

  // ---------------- 06 AS TRÊS GRANDES QUESTÕES ----------------
  {
    const s = slide("VERDE", "II. As fissuras");
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "Parte II  ·  As fissuras", MX, 0.45, 8, C.accent5);
    title(s, "As três grandes questões");
    lead(s, "O início do enfraquecimento imperial", MX, 1.55, 8, C.accent5);
    const panels = [
      ["s06_rel", "I", "Questão Religiosa", "1872–1875  ·  Igreja × Estado", "Bispos desafiam o controle do Estado sobre a Igreja e acabam presos.", "D. Macedo Costa, bispo do Pará · óleo, déc. 1870"],
      ["s06_mil", "II", "Questão Militar", "1883–1887  ·  Exército × governo", "Oficiais punidos por se manifestarem na imprensa enfrentam o governo civil.", "Ten.-cel. Sena Madureira"],
      ["s06_abo", "III", "Questão Abolicionista", "Anos 1880  ·  Abolição × escravistas", "A luta contra a escravidão divide o país e afasta os senhores de escravizados.", "Marc Ferrez · Escravizados em fazenda de café, c. 1885"],
    ];
    panels.forEach(([slot, num, h, meta, t, cap], i) => {
      const x = MX + i * (3.85 + 0.29), y = 2.3;
      img(s, slot, x, y, { alt: cap });
      s.addImage({ path: A("fade_ink_bottom_strong.png"), x, y: y + 0.9, w: 3.85, h: 3.5, altText: "Elemento decorativo" });
      keyline(s, x + 0.08, y + 0.08, 3.85 - 0.16, 4.4 - 0.16, C.accent5, 0.5);
      T(s, num, { x: x + 0.3, y: y + 1.6, w: 1.2, h: 0.7, fontFace: "Georgia", fontSize: 40, color: C.accent5 });
      T(s, h, { x: x + 0.3, y: y + 2.3, w: 3.35, h: 0.45, fontFace: "Georgia", fontSize: 22, color: C.background1 });
      T(s, meta.toUpperCase(), { x: x + 0.3, y: y + 2.77, w: 3.35, h: 0.28, fontSize: 10.5, bold: true, charSpacing: 1.5, color: C.accent5 });
      T(s, t, { x: x + 0.3, y: y + 3.1, w: 3.3, h: 0.8, fontSize: 14, color: C.background1 });
      T(s, cap, { x: x + 0.3, y: y + 4.02, w: 3.3, h: 0.26, fontSize: 10, italic: true, color: C.background2 });
    });
    footer(s, true);
    s.addNotes(NOTES[6]);
  }

  // ---------------- 07 A QUESTÃO RELIGIOSA ----------------
  {
    const s = slide("PAPEL_DIR", "III. A Igreja");
    documentFrame(s, "s07_const", 0.95, 0.85, -1.5, 0.16, "Capa verde com brasão imperial dourado da Constituição Política do Império do Brasil, de 1824");
    caption(s, "Constituição Política do Império do Brasil, 1824 · Arquivo Nacional", 0.75, 6.92, 4.6, C.accent6);
    kicker(s, "Parte III  ·  A Igreja  ·  1872–1875", 5.85, 0.45, 6.5, C.accent1);
    title(s, "A Questão Religiosa");
    lead(s, "A Igreja e o Estado entraram em conflito", 5.85, 1.55, 6.88, C.accent3);
    const ny = 2.2, nh = 1.85, nw = 1.95;
    const nodes = [
      [5.85, "PAPA PIO IX", "Roma · ultramontanismo", C.text2, "s07_pio"],
      [8.32, "BISPOS", "entre duas autoridades", C.accent2, null],
      [10.78, "D. PEDRO II", "padroado e beneplácito", C.text2, "s07_pedro"],
    ];
    for (const [x, h, t, fill, slot] of nodes) {
      s.addShape(pres.shapes.RECTANGLE, { x, y: ny, w: nw, h: nh, fill: { color: fill }, line: { color: C.accent5, width: 0.75 } });
      if (slot) cameo(s, slot, x + (nw - 0.82) / 2, ny + 0.14, C.accent5, slot === "s07_pio" ? "Fotografia do papa Pio IX, 1875" : "Fotografia de D. Pedro II, 1876");
      else await seal(s, x + (nw - 0.9) / 2, ny + 0.18, 0.9, "GiChurch", { fill: C.accent2 });
      T(s, [
        { text: h, options: { bold: true, fontSize: 13, charSpacing: 2, color: C.accent5, breakLine: true } },
        { text: t, options: { fontSize: 12.5, color: C.background1 } },
      ], { x: x + 0.08, y: ny + 1.2, w: nw - 0.16, h: 0.6, align: "center" });
    }
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 7.86, y: ny + 0.68, w: 0.4, h: 0.36, fill: { color: C.accent1 }, line: { type: "none" } });
    s.addShape(pres.shapes.LEFT_ARROW, { x: 10.32, y: ny + 0.68, w: 0.4, h: 0.36, fill: { color: C.accent1 }, line: { type: "none" } });
    const cards = [
      ["Religião oficial", "O catolicismo era a religião do Império (art. 5º)."],
      ["Padroado", "O imperador indicava os bispos e o Estado pagava o clero."],
      ["Beneplácito", "Ordens do papa só valiam no Brasil com aprovação do imperador."],
      ["Ultramontanismo", "Pio IX reforçou a autoridade de Roma sobre as igrejas nacionais (Syllabus, 1864)."],
    ];
    cards.forEach(([h, t], i) => {
      const x = 5.85 + (i % 2) * 3.56, y = 4.3 + Math.floor(i / 2) * 1.33;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 3.32, h: 1.2, fill: { color: C.background2, transparency: 25 }, line: { color: C.accent1, width: 0.5 } });
      T(s, [
        { text: h, options: { fontFace: "Georgia", bold: true, fontSize: 16, color: C.accent2, breakLine: true } },
        { text: t, options: { fontSize: 14, color: C.text1 } },
      ], { x: x + 0.18, y: y + 0.12, w: 3.0, h: 1.0, paraSpaceAfter: 3 });
    });
    footer(s);
    s.addNotes(NOTES[7]);
  }

  // ---------------- 08 O CONFLITO COM OS BISPOS ----------------
  {
    const s = slide("PAPEL", "III. A Igreja");
    kicker(s, "Parte III  ·  A Igreja  ·  1872–1875", MX, 0.45, 8, C.accent1);
    title(s, "O conflito com os bispos");
    lead(s, "A ruptura entre a Igreja e a monarquia", MX, 1.55, 8, C.accent3);
    const people = [
      ["s08_vital", 0.95, "D. Vital", "bispo de Olinda", "Frei Vital, bispo de Olinda, em foto de 1879"],
      ["s08_macedo", 2.85, "D. Macedo Costa", "bispo do Pará", "D. Antônio de Macedo Costa, bispo do Pará"],
      ["s08_riobranco", 6.0, "Visconde do Rio Branco", "chefe do governo e grão-mestre maçom", "Visconde do Rio Branco em 1879"],
    ];
    for (const [slot, x, n, r, alt] of people) {
      const sp = cameo(s, slot, x, 2.3, C.accent1, alt);
      T(s, [
        { text: n, options: { bold: true, fontSize: 14, color: C.text1, breakLine: true } },
        { text: r, options: { fontSize: 12, color: C.accent3 } },
      ], { x: x + sp.w / 2 - 1.6, y: 4.3, w: 3.2, h: 0.55, align: "center" });
    }
    T(s, "×", { x: 4.55, y: 2.75, w: 1.25, h: 1.0, fontFace: "Georgia", fontSize: 60, color: C.accent2, align: "center" });
    // period caricature
    const cr = SPEC.s08_caricatura, cx = 9.85, cy = 2.32;
    documentFrame(s, "s08_caricatura", cx, cy, 1.5, 0.13, "Caricatura de Angelo Agostini: o bispo de Olinda, no altar, expulsa um padre que cai diante de noivos");
    T(s, [
      { text: "Angelo Agostini, Revista Illustrada, 1876", options: { bold: true, breakLine: true } },
      { text: "O bispo de Olinda suspende um padre que celebrou o casamento de um maçom." },
    ], { x: cx - 0.1, y: cy + cr.h + 0.2, w: cr.w + 0.2, h: 0.55, fontSize: 10, italic: true, color: C.accent6 });
    // consequences strip
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 5.0, w: 8.95, h: 0.68, fill: { color: C.text2 }, line: { type: "none" } });
    T(s, [
      { text: "CONSEQUÊNCIAS   ", options: { bold: true, fontSize: 11, charSpacing: 2.5, color: C.accent5 } },
      { text: "Parte do clero e dos católicos se afastou do trono. A Igreja não aderiu à República, mas deixou de defender a monarquia.", options: { fontSize: 13.5, color: C.background1 } },
    ], { x: MX + 0.2, y: 5.06, w: 8.6, h: 0.58, valign: "middle" });
    // timeline
    const ev = [
      ["1872", "No Rio, o bispo suspende um padre que discursou em loja maçônica"],
      ["1872–73", "D. Vital e D. Macedo Costa interditam irmandades que não expulsam maçons"],
      ["1873", "O governo manda suspender as punições; os bispos se recusam"],
      ["1874", "Presos e condenados a 4 anos de prisão com trabalhos forçados"],
      ["1875", "Anistia concedida pelo gabinete do Duque de Caxias"],
    ];
    const ly = 6.12, colW = (W - 2 * MX) / ev.length;
    s.addShape(pres.shapes.LINE, { x: MX, y: ly, w: W - 2 * MX, h: 0, line: { color: C.accent1, width: 1.5 } });
    ev.forEach(([yr, t], i) => {
      const x = MX + i * colW;
      s.addShape(pres.shapes.OVAL, { x: x, y: ly - 0.08, w: 0.16, h: 0.16, fill: { color: i === 3 ? C.accent2 : C.text2 }, line: { color: C.accent5, width: 1 } });
      T(s, yr, { x, y: 5.78, w: 1.4, h: 0.3, fontFace: "Georgia", bold: true, fontSize: 15, color: i === 3 ? C.accent2 : C.text2 });
      T(s, t, { x, y: 6.22, w: colW - 0.18, h: 0.8, fontSize: 12, color: C.text1 });
    });
    footer(s);
    s.addNotes(NOTES[8]);
  }

  // ---------------- 09 A QUESTÃO MILITAR ----------------
  {
    const s = slide("PAPEL_ESQ", "IV. O Exército");
    const dx = W - SPEC.s09_deodoro.w;
    img(s, "s09_deodoro", dx, 0, { alt: "Fotografia do marechal Deodoro da Fonseca, de farda e barba" });
    s.addImage({ path: A("fade_ink_bottom.png"), x: dx, y: 5.6, w: SPEC.s09_deodoro.w, h: 1.9, altText: "Elemento decorativo" });
    keyline(s, dx + 0.2, 0.2, SPEC.s09_deodoro.w - 0.4, H - 0.4, C.accent5, 0.75);
    caption(s, "Marechal Deodoro da Fonseca, 1889", dx + 0.42, 6.62, 4, C.background1);
    kicker(s, "Parte IV  ·  O Exército  ·  1883–1887", MX, 0.45, 7, C.accent1);
    title(s, "A Questão Militar");
    lead(s, "O Exército começou a desafiar o Império", MX, 1.55, 7.4, C.accent3);
    const chips = [["GiLaurels", "Prestígio após a guerra"], ["GiMedal", "Soldos baixos e promoções lentas"], ["GiQuillInk", "Proibidos de debater na imprensa"]];
    for (let i = 0; i < chips.length; i++) {
      const x = MX + i * 2.47;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 2.25, w: 2.32, h: 0.78, fill: { color: C.text2 }, line: { type: "none" } });
      s.addImage({ data: await icon(chips[i][0], HEX.accent5), x: x + 0.14, y: 2.44, w: 0.4, h: 0.4, altText: "Ícone decorativo" });
      T(s, chips[i][1], { x: x + 0.65, y: 2.3, w: 1.6, h: 0.68, fontSize: 13, bold: true, color: C.background1, valign: "middle" });
    }
    const ev = [
      ["1883–84", "Sena Madureira contesta a reforma do montepio militar e homenageia o jangadeiro abolicionista Francisco do Nascimento; é punido. Aviso de 1884 restringe debates na imprensa."],
      ["1886", "Caso Cunha Matos: coronel é preso por responder a um deputado pela imprensa. Sena Madureira escreve no jornal republicano A Federação e é punido de novo."],
      ["1886–87", "Deodoro, comandante das armas no Rio Grande do Sul, defende os oficiais e é afastado. O governo recua e cancela as punições."],
      ["1887", "Nasce o Clube Militar, presidido por Deodoro. Em outubro, pede que o Exército não capture escravizados fugidos."],
    ];
    const lx = MX + 0.12;
    s.addShape(pres.shapes.LINE, { x: lx, y: 3.5, w: 0, h: 2.85, line: { color: C.accent1, width: 1.5 } });
    ev.forEach(([yr, t], i) => {
      const y = 3.38 + i * 0.9;
      s.addShape(pres.shapes.OVAL, { x: lx - 0.09, y: y + 0.12, w: 0.18, h: 0.18, fill: { color: i === 3 ? C.accent2 : C.text2 }, line: { color: C.accent5, width: 1 } });
      T(s, yr, { x: lx + 0.25, y: y + 0.02, w: 1.25, h: 0.36, fontFace: "Georgia", bold: true, fontSize: 17, color: i === 3 ? C.accent2 : C.text2 });
      T(s, t, { x: lx + 1.55, y, w: 6.05, h: 0.84, fontSize: 14, color: C.text1 });
    });
    footer(s, true);
    s.addNotes(NOTES[9]);
  }

  // ---------------- 10 O POSITIVISMO E OS MILITARES ----------------
  {
    const s = slide("VERDE", "IV. O Exército");
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "Parte IV  ·  O Exército", MX, 0.45, 8, C.accent5);
    title(s, "O positivismo e os militares");
    lead(s, "Novas ideias para o futuro do Brasil", MX, 1.55, 8, C.accent5);
    const stW = 2.83, gap = 0.27, y0 = 2.3, imgH = 1.75;
    const st = [
      ["s10_comte", "oval", "Auguste Comte", "1798–1857", "Filósofo francês: a sociedade deve ser guiada pela ciência."],
      ["s10_escola", "rect", "Escola Militar", "Praia Vermelha, Rio", "Jovens oficiais estudam ciências, matemática e filosofia."],
      ["s10_bc", "oval", "Benjamin Constant", "1836–1891", "Professor da Escola, aproxima os alunos da causa republicana."],
      ["s10_flag", "rect", "“Ordem e Progresso”", "19 nov. 1889", "Lema de inspiração positivista na nova bandeira."],
    ];
    st.forEach(([slot, kind, h, d, t], i) => {
      const x = MX + i * (stW + gap);
      const sp = SPEC[slot];
      const ix = x + (stW - sp.w) / 2;
      const alts = { s10_comte: "Daguerreótipo de Auguste Comte, 1849", s10_escola: "Fotografia da Escola Militar da Praia Vermelha, com o Pão de Açúcar ao fundo", s10_bc: "Fotografia de Benjamin Constant de farda e pincenê, 1889", s10_flag: "Bandeira republicana de 1889, com o lema Ordem e Progresso" };
      if (kind === "oval") cameo(s, slot, ix, y0, C.accent5, alts[slot]);
      else {
        img(s, slot, ix, y0, { alt: alts[slot] });
        if (!slot.endsWith("flag")) keyline(s, ix + 0.06, y0 + 0.06, sp.w - 0.12, sp.h - 0.12, C.accent5, 0.5);
      }
      T(s, [
        { text: h, options: { fontFace: "Georgia", fontSize: 18, color: C.background1, breakLine: true } },
        { text: d.toUpperCase(), options: { fontSize: 10.5, bold: true, charSpacing: 1.5, color: C.accent5, breakLine: true } },
        { text: t, options: { fontSize: 13.5, color: C.background2 } },
      ], { x, y: y0 + imgH + 0.15, w: stW, h: 1.3, align: "center", paraSpaceAfter: 2 });
      if (i < st.length - 1) {
        s.addShape(pres.shapes.CHEVRON, { x: x + stW + 0.05, y: y0 + imgH / 2 - 0.12, w: 0.17, h: 0.24, fill: { color: C.accent5 }, line: { type: "none" } });
      }
    });
    const boxes = [
      ["Uma república da ciência", "Para muitos positivistas, a monarquia representava o atraso; uma república guiada pela ciência e por um governo forte traria o progresso."],
      ["Atenção: o Exército não era homogêneo", "Havia oficiais monarquistas e republicanos, “científicos” formados na Escola e “tarimbeiros” formados na tropa. Deodoro, monarquista, só aderiu à República na crise de 1889."],
    ];
    boxes.forEach(([h, t], i) => {
      const x = MX + i * 6.17;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 5.45, w: 5.96, h: 1.45, fill: { color: C.text1, transparency: 45 }, line: { color: C.accent5, width: 0.5 } });
      T(s, [
        { text: h, options: { bold: true, fontSize: 14, color: C.accent5, breakLine: true } },
        { text: t, options: { fontSize: 13.5, color: C.background1 } },
      ], { x: x + 0.2, y: 5.55, w: 5.56, h: 1.3, paraSpaceAfter: 3 });
    });
    footer(s, true);
    s.addNotes(NOTES[10]);
  }

  // ---------------- 11 O PROCESSO ABOLICIONISTA ----------------
  {
    const s = slide("PAPEL", "V. A abolição");
    kicker(s, "Parte V  ·  A abolição  ·  1850–1888", MX, 0.45, 8, C.accent1);
    title(s, "O processo abolicionista");
    lead(s, "O caminho até o fim da escravidão", MX, 1.55, 8, C.accent3);
    const laws = [
      ["1850", "Lei Eusébio de Queirós", "Lei nº 581", "Proibiu o tráfico de africanos escravizados para o Brasil, sob pressão britânica.", "Limite: a escravidão continuou e cresceu o tráfico interno."],
      ["1871", "Lei do Ventre Livre", "Lei nº 2.040", "Filhos de mulheres escravizadas nascidos a partir da lei seriam livres.", "Limite: podiam servir ao senhor até os 21 anos."],
      ["1885", "Lei dos Sexagenários", "Lei nº 3.270", "Libertou escravizados com 60 anos ou mais.", "Limite: deviam trabalhar até mais 3 anos; poucos chegavam a essa idade."],
      ["1888", "Lei Áurea", "Lei nº 3.353", "Extinguiu a escravidão, sem indenização aos proprietários.", "Limite: nada foi previsto para integrar os libertos."],
    ];
    const colW = 2.85, gp = (W - 2 * MX - 4 * colW) / 3, ly = 2.98;
    s.addShape(pres.shapes.LINE, { x: MX, y: ly, w: W - 2 * MX, h: 0, line: { color: C.accent1, width: 2 } });
    laws.forEach(([yr, n, num, t, lim], i) => {
      const x = MX + i * (colW + gp);
      const red = i === 3;
      T(s, yr, { x, y: 2.08, w: colW, h: 0.8, fontFace: "Georgia", fontSize: 44, color: red ? C.accent2 : C.text2 });
      s.addShape(pres.shapes.DIAMOND, { x: x, y: ly - 0.12, w: 0.24, h: 0.24, fill: { color: red ? C.accent2 : C.text2 }, line: { color: C.accent5, width: 1 } });
      T(s, [
        { text: n, options: { bold: true, fontSize: 15.5, color: C.text1, breakLine: true } },
        { text: num.toUpperCase(), options: { fontSize: 10, bold: true, charSpacing: 2, color: C.accent1, breakLine: true } },
        { text: t, options: { fontSize: 14, color: C.text1, breakLine: true } },
        { text: lim, options: { fontSize: 13, italic: true, color: C.accent2 } },
      ], { x, y: 3.15, w: colW, h: 2.05, paraSpaceAfter: 5 });
    });
    // resistance band
    const by = 5.32, bh = 1.6;
    s.addShape(pres.shapes.RECTANGLE, { x: MX, y: by, w: W - 2 * MX, h: bh, fill: { color: C.text2 }, line: { type: "none" } });
    T(s, [
      { text: "A ABOLIÇÃO TAMBÉM FOI CONQUISTADA", options: { bold: true, fontSize: 12, charSpacing: 2, color: C.accent5, breakLine: true } },
      { text: "Fugas em massa, quilombos (como o Jabaquara, em Santos), ações na Justiça e a recusa dos jangadeiros do Ceará em transportar escravizados (1881). Ceará e Amazonas aboliram a escravidão em 1884.", options: { fontSize: 13.5, color: C.background1 } },
    ], { x: MX + 0.25, y: by + 0.17, w: 5.7, h: bh - 0.3, paraSpaceAfter: 4 });
    const ppl = [
      ["s11_gama", "Luiz Gama", "advogado"], ["s11_patrocinio", "José do Patrocínio", "jornalista"], ["s11_reboucas", "André Rebouças", "engenheiro"],
      ["s11_nabuco", "Joaquim Nabuco", "deputado"], ["s11_dragao", "Dragão do Mar", "jangadeiro"],
    ];
    const pw = 1.17, px0 = W - MX - 0.12 - 5 * pw;
    ppl.forEach(([slot, n, r], i) => {
      const cx = px0 + i * pw;
      cameo(s, slot, cx + (pw - 0.8) / 2, by + 0.14, C.accent5, "Retrato de " + n);
      T(s, n, { x: cx, y: by + 1.15, w: pw, h: 0.4, fontSize: 10, bold: true, color: C.background1, align: "center" });
    });
    footer(s);
    s.addNotes(NOTES[11]);
  }

  // ---------------- 12 A LEI ÁUREA ----------------
  {
    const s = slide("FOTO", "V. A abolição");
    img(s, "s12_missa", 0, 0, { alt: "Fotografia de grande multidão diante de sobrados no centro do Rio de Janeiro em 13 de maio de 1888" });
    s.addImage({ path: A("fade_ink_top_strong.png"), x: 0, y: 0, w: W, h: 2.4, transparency: 5, altText: "Elemento decorativo" });
    s.addImage({ path: A("fade_ink_bottom.png"), x: 0, y: 3.45, w: W, h: 0.95, altText: "Elemento decorativo" });
    kicker(s, "Parte V  ·  A abolição", 0.8, 0.5, 6, C.accent5);
    T(s, "13 de maio de 1888", { x: 0.8, y: 0.78, w: 8, h: 0.8, fontFace: "Georgia", fontSize: 42, color: C.background1 });
    lead(s, "O fim legal da escravidão", 0.8, 1.55, 7, C.accent5, 0.45, 20);
    caption(s, "Marc Ferrez · Multidão no Rio de Janeiro no dia da Lei Áurea, 13 maio 1888 · Getty Research Institute", 6.2, 4.02, 6.85, C.background2, "right");
    // bottom band
    T(s, [
      { text: "“É declarada extincta desde a data desta lei a escravidão no Brazil.”", options: { fontFace: "Georgia", italic: true, fontSize: 18, color: C.background1, breakLine: true } },
      { text: "LEI Nº 3.353, ART. 1º — GRAFIA ORIGINAL", options: { fontSize: 10, bold: true, charSpacing: 2, color: C.accent5 } },
    ], { x: 0.8, y: 4.75, w: 3.6, h: 1.9, paraSpaceAfter: 8 });
    const cols = [
      [4.85, "GiBreakingChain", "O QUE A LEI FEZ", ["Extinguiu a escravidão: cerca de 700 mil pessoas libertadas", "Assinada pela princesa Isabel, regente do Império", "Veio após anos de campanha abolicionista e fugas em massa"]],
      [8.95, "GiScales", "O QUE FICOU DE FORA", ["Nenhuma garantia de terra, escola ou trabalho aos libertos", "Fazendeiros e governo preferiram imigrantes europeus", "Racismo e exclusão continuaram depois de 1888"]],
    ];
    for (const [x, ic, h, items] of cols) {
      s.addImage({ data: await icon(ic, HEX.accent5), x, y: 4.72, w: 0.38, h: 0.38, altText: "Ícone decorativo" });
      T(s, h, { x: x + 0.5, y: 4.78, w: 3.4, h: 0.3, fontSize: 12, bold: true, charSpacing: 2.5, color: C.accent5 });
      T(s, bullets(items, { space: 7 }), { x, y: 5.22, w: 3.85, h: 1.75, fontSize: 14.5, color: C.background1 });
    }
    s.addShape(pres.shapes.LINE, { x: 4.6, y: 4.75, w: 0, h: 2.05, line: { color: C.accent5, width: 0.5 } });
    s.addShape(pres.shapes.LINE, { x: 8.7, y: 4.75, w: 0, h: 2.05, line: { color: C.accent5, width: 0.5 } });
    footer(s, true);
    s.addNotes(NOTES[12]);
  }

  // ---------------- 13 A RUPTURA COM OS CAFEICULTORES ----------------
  {
    const s = slide("PAPEL_DIR", "V. A abolição");
    img(s, "s13_fazenda", 0, 0, { alt: "Fotografia de pessoas escravizadas trabalhando num terreiro de secagem de café, com morros ao fundo" });
    s.addImage({ path: A("fade_ink_bottom.png"), x: 0, y: 5.5, w: 5.2, h: 2.0, altText: "Elemento decorativo" });
    keyline(s, 0.22, 0.22, 5.2 - 0.44, H - 0.44, C.accent5, 0.75);
    caption(s, "Marc Ferrez · Escravizados em terreiro de café no Vale do Paraíba, c. 1882", 0.45, 6.62, 4.4, C.background1, "left", 0.45);
    kicker(s, "Parte V  ·  A abolição  ·  1888–1889", 5.85, 0.45, 6.88, C.accent1);
    title(s, "A ruptura com os cafeicultores");
    lead(s, "A monarquia perdeu parte de sua base econômica e política", 5.85, 1.55, 6.88, C.accent3, 0.45, 18);
    const cards = [
      [5.85, "Vale do Paraíba", "base tradicional do trono", ["Fazendas antigas e endividadas", "Dependiam do trabalho escravizado", "Exigiam indenização pela abolição"], C.accent2],
      [9.41, "Oeste Paulista", "café em expansão", ["Ferrovias e imigrantes europeus", "Queriam autonomia para a província", "Muitos já eram republicanos desde 1873"], C.text2],
    ];
    for (const [x, h, sub, items, col] of cards) {
      s.addShape(pres.shapes.RECTANGLE, { x, y: 2.3, w: 3.32, h: 2.45, fill: { color: C.background2, transparency: 25 }, line: { color: C.accent1, width: 0.5 } });
      T(s, [
        { text: h, options: { fontFace: "Georgia", bold: true, fontSize: 17, color: col, breakLine: true } },
        { text: sub.toUpperCase(), options: { fontSize: 10, bold: true, charSpacing: 2, color: C.accent1 } },
      ], { x: x + 0.18, y: 2.44, w: 3.0, h: 0.62 });
      T(s, bullets(items, { space: 6 }), { x: x + 0.18, y: 3.15, w: 3.05, h: 1.5, fontSize: 15, color: C.text1 });
    }
    s.addShape(pres.shapes.RECTANGLE, { x: 5.85, y: 5.05, w: 6.88, h: 1.62, fill: { color: C.text2 }, line: { type: "none" } });
    T(s, [
      { text: "“Republicanos de última hora”", options: { fontFace: "Georgia", italic: true, fontSize: 18, color: C.accent5, breakLine: true } },
      { text: "Ex-senhores de escravizados que, revoltados com a abolição sem indenização, passaram a apoiar a República depois de 13 de maio de 1888 — mais por ressentimento contra a Coroa do que por convicção.", options: { fontSize: 15, color: C.background1 } },
    ], { x: 6.1, y: 5.18, w: 6.4, h: 1.42, paraSpaceAfter: 4 });
    footer(s);
    s.addNotes(NOTES[13]);
  }

  // ---------------- 14 O CRESCIMENTO DO REPUBLICANISMO ----------------
  {
    const s = slide("PAPEL_DIR", "VI. A República");
    documentFrame(s, "s14_jornal", 0.95, 0.8, 1.2, 0.16, "Primeira página do jornal A República, de 3 de dezembro de 1870, com o Manifesto Republicano");
    caption(s, "A República, n. 1, Rio de Janeiro, 3 dez. 1870 — jornal que publicou o Manifesto Republicano", 0.75, 6.82, 4.6, C.accent6, "left", 0.45);
    kicker(s, "Parte VI  ·  A República  ·  1870–1889", 5.85, 0.45, 6.88, C.accent1);
    title(s, "O crescimento do republicanismo");
    lead(s, "A República começou a ganhar força", 5.85, 2.15, 6.88, C.accent3, 0.45, 18);
    T(s, [
      { text: "“Somos da América e queremos ser americanos.”", options: { fontFace: "Georgia", italic: true, fontSize: 20, color: C.accent2, breakLine: true } },
      { text: "MANIFESTO REPUBLICANO, 1870", options: { fontSize: 10, bold: true, charSpacing: 2, color: C.accent1 } },
    ], { x: 5.85, y: 2.72, w: 6.88, h: 0.85, paraSpaceAfter: 4 });
    const tl = [["1870", "Manifesto Republicano, no Rio de Janeiro"], ["1873", "Convenção de Itu funda o Partido Republicano Paulista"], ["Anos 1880", "Clubes, jornais e comícios republicanos se multiplicam"]];
    const tw = 6.88 / 3, tly = 4.05;
    s.addShape(pres.shapes.LINE, { x: 5.85, y: tly, w: 6.88, h: 0, line: { color: C.accent1, width: 1.25 } });
    tl.forEach(([y, t], i) => {
      const x = 5.85 + i * tw;
      T(s, y, { x, y: tly - 0.42, w: tw - 0.2, h: 0.36, fontFace: "Georgia", bold: true, fontSize: 16, color: C.text2 });
      s.addShape(pres.shapes.OVAL, { x, y: tly - 0.08, w: 0.16, h: 0.16, fill: { color: C.text2 }, line: { color: C.accent5, width: 1 } });
      T(s, t, { x, y: tly + 0.15, w: tw - 0.2, h: 0.65, fontSize: 13, color: C.text1 });
    });
    const cols = [
      [5.85, "O QUE DEFENDIAM", ["Federalismo: autonomia das províncias", "Fim do Poder Moderador e do Senado vitalício", "Chefe de Estado eleito"]],
      [9.41, "QUEM APOIAVA", ["Cafeicultores do Oeste Paulista", "Jornalistas, advogados, professores", "Militares positivistas", "Ex-escravistas, depois de 1888"]],
    ];
    for (const [x, h, items] of cols) {
      T(s, h, { x, y: 5.05, w: 3.3, h: 0.3, fontSize: 12, bold: true, charSpacing: 2.5, color: C.accent2 });
      T(s, bullets(items, { space: 3 }), { x, y: 5.38, w: 3.32, h: 1.55, fontSize: 14, color: C.text1 });
    }
    footer(s);
    s.addNotes(NOTES[14]);
  }

  // ---------------- 15 O IMPÉRIO FICOU ISOLADO ----------------
  {
    const s = slide("VERDE", "VI. A República");
    img(s, "s15_baile", 0, 0, { alt: "Pintura do último baile da Ilha Fiscal, em 1889, com salão iluminado e convidados" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.text2, transparency: 9 }, line: { type: "none" } });
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "Parte VI  ·  A República", MX, 0.45, 8, C.accent5);
    title(s, "O Império ficou isolado");
    lead(s, "As principais bases de sustentação começaram a desaparecer", MX, 1.55, 9, C.accent5);
    // temple
    const tx = 2.75, tw = 7.83;
    s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: tx, y: 2.2, w: tw, h: 0.95, fill: { color: C.text1, transparency: 35 }, line: { color: C.accent5, width: 1.25 } });
    T(s, "MONARQUIA", { x: tx + 2.4, y: 2.68, w: tw - 4.8, h: 0.4, fontFace: "Georgia", fontSize: 18, charSpacing: 6, color: C.accent5, align: "center" });
    s.addShape(pres.shapes.RECTANGLE, { x: tx, y: 3.15, w: tw, h: 0.22, fill: { color: C.accent5, transparency: 20 }, line: { color: C.accent5, width: 0.75 } });
    const cols = [
      ["GiChurch", "IGREJA", "Afastada pela Questão Religiosa e pela prisão dos bispos", "RUPTURA · 1874"],
      ["GiCrossedSabres", "EXÉRCITO", "Insatisfeito e atraído pelas ideias republicanas", "RUPTURA · 1887"],
      ["GiCoffeeBeans", "ELITES AGRÁRIAS", "Escravistas rompem com a Coroa após a abolição", "RUPTURA · 1888"],
    ];
    const cw = 2.15, cgap = (tw - 0.5 - 3 * cw) / 2;
    for (let i = 0; i < cols.length; i++) {
      const [ic, h, t, stamp] = cols[i];
      const x = tx + 0.25 + i * (cw + cgap);
      s.addShape(pres.shapes.RECTANGLE, { x: x - 0.12, y: 3.47, w: cw + 0.24, h: 0.16, fill: { color: C.accent5, transparency: 20 }, line: { type: "none" } });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 3.63, w: cw, h: 2.55, fill: { color: C.text1, transparency: 30 }, line: { color: C.accent5, width: 0.75 } });
      s.addShape(pres.shapes.RECTANGLE, { x: x - 0.12, y: 6.18, w: cw + 0.24, h: 0.14, fill: { color: C.accent5, transparency: 20 }, line: { type: "none" } });
      await seal(s, x + cw / 2 - 0.27, 3.8, 0.54, ic, { fill: C.text2 });
      T(s, h, { x: x + 0.05, y: 4.42, w: cw - 0.1, h: 0.32, fontSize: 13, bold: true, charSpacing: 2, color: C.accent5, align: "center" });
      T(s, t, { x: x + 0.15, y: 4.76, w: cw - 0.3, h: 0.85, fontSize: 13, color: C.background1, align: "center" });
      T(s, stamp, { shape: pres.shapes.RECTANGLE, x: x + 0.12, y: 5.62, w: cw - 0.24, h: 0.36, rotate: -5, fill: { color: C.background1 }, line: { color: C.accent2, width: 1.5 },
        fontSize: 11, bold: true, charSpacing: 2, color: C.accent2, align: "center", valign: "middle" });
    }
    s.addShape(pres.shapes.RECTANGLE, { x: tx - 0.2, y: 6.32, w: tw + 0.4, h: 0.2, fill: { color: C.accent5, transparency: 20 }, line: { color: C.accent5, width: 0.75 } });
    T(s, "SUSTENTAÇÃO POLÍTICA DO IMPÉRIO", { x: tx, y: 6.58, w: tw, h: 0.28, fontSize: 10.5, bold: true, charSpacing: 3, color: C.background2, align: "center" });
    T(s, "D. Pedro II, aos 63 anos e doente, governava cada vez menos.", { x: MX, y: 3.75, w: 1.95, h: 1.4, fontSize: 12.5, italic: true, color: C.background2 });
    T(s, "A herdeira, Isabel, e o marido francês, o conde d'Eu, despertavam desconfiança: o “Terceiro Reinado” era incerto.", { x: W - MX - 1.95, y: 3.75, w: 1.95, h: 2.0, fontSize: 12.5, italic: true, color: C.background2 });
    caption(s, "Ao fundo: Aurélio de Figueiredo, A ilusão do Terceiro Reinado (O último baile da Ilha Fiscal), 1905 · Museu Histórico Nacional", MX, 6.98, 7.4, C.background2, "left", 0.36);
    footer(s, true);
    s.addNotes(NOTES[15]);
  }

  // ---------------- 16 15 DE NOVEMBRO DE 1889 ----------------
  {
    const s = slide("FOTO", "VI. A República");
    img(s, "s16_calixto", 0, 0, { alt: "Pintura de Benedito Calixto: tropas e oficiais a cavalo em praça do Rio de Janeiro na Proclamação da República" });
    s.addImage({ path: A("fade_ink_top_strong.png"), x: 0, y: 0, w: W, h: 3.2, transparency: 10, altText: "Elemento decorativo" });
    s.addImage({ path: A("fade_ink_bottom_strong.png"), x: 0, y: 3.55, w: W, h: 3.95, transparency: 6, altText: "Elemento decorativo" });
    keyline(s, 0.25, 0.25, W - 0.5, H - 0.5, C.accent5, 0.75);
    kicker(s, "Parte VI  ·  A República  ·  15 nov. 1889", 0.8, 0.6, 8, C.accent5);
    T(s, "A Proclamação da República", { x: 0.8, y: 0.9, w: 10, h: 0.85, fontFace: "Georgia", fontSize: 40, color: C.background1 });
    lead(s, "Véspera: boatos de que o governo prenderia Deodoro e Benjamin Constant aceleram o levante.", 0.8, 1.72, 10, C.background2, 0.45, 16);
    const steps = [
      ["Madrugada", "Tropas de São Cristóvão, articuladas por oficiais republicanos e Benjamin Constant, marcham ao Campo de Santana."],
      ["Manhã", "Deodoro assume o comando e entra no Quartel-General: o gabinete do Visconde de Ouro Preto é deposto."],
      ["Tarde", "Na Câmara Municipal do Rio, José do Patrocínio e outros vereadores declaram a República."],
      ["Noite", "Forma-se o Governo Provisório, chefiado por Deodoro; o Decreto nº 1 adota a República Federativa."],
    ];
    const sw = (W - 1.6 - 3 * 0.25) / 4;
    steps.forEach(([h, t], i) => {
      const x = 0.8 + i * (sw + 0.25);
      s.addShape(pres.shapes.LINE, { x, y: 4.92, w: sw, h: 0, line: { color: C.accent5, width: 1.25 } });
      T(s, String(i + 1).padStart(2, "0") + "  " + h.toUpperCase(), { x, y: 5.0, w: sw, h: 0.3, fontSize: 12, bold: true, charSpacing: 2.5, color: C.accent5 });
      T(s, t, { x, y: 5.35, w: sw - 0.1, h: 1.2, fontSize: 14, color: C.background1 });
    });
    caption(s, "Benedito Calixto · Proclamação da República, 1893 · Pinacoteca do Estado de São Paulo — representação pintada quatro anos depois", 0.8, 6.68, 8.2, C.background2, "left", 0.3);
    footer(s, true);
    s.addNotes(NOTES[16]);
  }

  // ---------------- 17 O FIM DA MONARQUIA ----------------
  {
    const s = slide("PAPEL_DIR", "VI. A República");
    documentFrame(s, "s17_familia", 0.95, 0.9, 0, 0.18, "Fotografia da família imperial reunida na escada de uma casa, com D. Pedro II ao centro, em 1889");
    caption(s, "Otto Hees · D. Pedro II e a família imperial, 1889", 0.77, 6.62, 4.5, C.accent6);
    kicker(s, "Parte VI  ·  A República  ·  1889–1891", 5.85, 0.45, 6.88, C.accent1);
    title(s, "O fim da monarquia");
    lead(s, "O exílio da família imperial", 5.85, 1.55, 6.88, C.accent3);
    const st = [["67 anos", "de Império (1822–1889)"], ["49 anos", "de Segundo Reinado (1840–1889)"]];
    st.forEach(([n, l], i) => {
      const x = 5.85 + i * 3.44;
      T(s, n, { x, y: 2.15, w: 3.3, h: 0.75, fontFace: "Georgia", fontSize: 40, color: i === 0 ? C.accent2 : C.text2 });
      T(s, l, { x, y: 2.88, w: 3.3, h: 0.3, fontSize: 13, color: C.accent3 });
    });
    const ev = [
      ["16 nov. 1889", "O Governo Provisório ordena que a família imperial deixe o país."],
      ["17 nov. 1889", "De madrugada, D. Pedro II e a família embarcam rumo à Europa."],
      ["5 dez. 1891", "D. Pedro II morre em Paris, no exílio."],
    ];
    ev.forEach(([d, t], i) => {
      const y = 3.4 + i * 0.5;
      T(s, [
        { text: d, options: { bold: true, color: C.accent2 } },
        { text: "   " + t, options: { color: C.text1 } },
      ], { x: 5.85, y, w: 6.88, h: 0.42, fontSize: 14 });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.85, y: 4.95, w: 6.88, h: 1.95, fill: { color: C.text2 }, line: { type: "none" } });
    cameo(s, "s17_lobo", 6.07, 5.17, C.accent5, "Gravura de Aristides Lobo, de óculos e barba");
    T(s, "Aristides Lobo", { x: 5.9, y: 6.42, w: 1.3, h: 0.25, fontSize: 9.5, bold: true, color: C.accent5, align: "center" });
    T(s, [
      { text: "“O povo assistiu àquilo bestializado, atônito, surpreso, sem conhecer o que significava.”", options: { fontFace: "Georgia", italic: true, fontSize: 16.5, color: C.background1, breakLine: true } },
      { text: "ARISTIDES LOBO · DIÁRIO POPULAR (SP), 18 NOV. 1889", options: { fontSize: 10, bold: true, charSpacing: 1.5, color: C.accent5, breakLine: true } },
      { text: "Republicano e ministro do Governo Provisório, Lobo registrou uma mudança feita quase sem participação popular — imagem que historiadores como José Murilo de Carvalho discutem e matizam.", options: { fontSize: 12.5, color: C.background2 } },
    ], { x: 7.3, y: 5.07, w: 5.25, h: 1.75, paraSpaceAfter: 5 });
    footer(s);
    s.addNotes(NOTES[17]);
  }

  // ---------------- 18 CONCLUSÃO ----------------
  {
    const s = slide("VERDE", "Conclusão");
    kicker(s, "Conclusão", MX, 0.45, 8, C.accent5);
    title(s, "Por que a monarquia caiu?");
    const f = [
      ["GiChurch", "Crise religiosa", "1872–1875"],
      ["GiCrossedSabres", "Questão Militar", "1883–1887"],
      ["GiBreakingChain", "Abolição", "1888"],
      ["GiCoffeeBeans", "Perda dos cafeicultores escravistas", "1888–1889"],
      ["GiNewspaper", "Avanço republicano", "1870–1889"],
      ["GiBrokenShield", "Isolamento político", "1889"],
    ];
    const fw = 1.86, fg = (W - 2 * MX - 6 * fw) / 5;
    for (let i = 0; i < f.length; i++) {
      const [ic, h, d] = f[i];
      const x = MX + i * (fw + fg);
      s.addShape(pres.shapes.RECTANGLE, { x, y: 1.62, w: fw, h: 1.75, fill: { color: C.text1, transparency: 55 }, line: { color: C.accent5, width: 0.75 } });
      await seal(s, x + fw / 2 - 0.25, 1.74, 0.5, ic, { fill: C.text2 });
      T(s, h, { x: x + 0.08, y: 2.3, w: fw - 0.16, h: 0.68, fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
      T(s, d, { x: x + 0.08, y: 3.03, w: fw - 0.16, h: 0.25, fontSize: 11, color: C.accent5, align: "center" });
    }
    s.addShape(pres.shapes.RIGHT_BRACE, { x: W / 2 - 0.2, y: 3.58 - 12.13 / 2, w: 0.36, h: 12.13, rotate: 90, fill: { type: "none" }, line: { color: C.accent5, width: 1 } });
    T(s, "A monarquia não caiu por uma única crise. Caiu quando perdeu o apoio dos principais grupos que sustentavam seu poder.", {
      x: 1.3, y: 3.82, w: W - 2.6, h: 1.05, fontFace: "Georgia", italic: true, fontSize: 25, color: C.background1, align: "center", valign: "middle" });
    // references band
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.0, w: W, h: 2.5, fill: { color: C.background1 }, line: { type: "none" } });
    T(s, "REFERÊNCIAS", { x: MX, y: 5.14, w: 4, h: 0.26, fontSize: 10.5, bold: true, charSpacing: 3, color: C.accent1 });
    const refs = [
      ["ALONSO, Angela. ", "Flores, votos e balas", ": o movimento abolicionista brasileiro (1868-88). São Paulo: Companhia das Letras, 2015."],
      ["BRASIL. ", "Constituição Política do Império do Brasil", ", 1824; Lei nº 3.353, de 13 de maio de 1888 (Lei Áurea)."],
      ["CARVALHO, José Murilo de. ", "Os bestializados", ": o Rio de Janeiro e a República que não foi. São Paulo: Companhia das Letras, 1987."],
      ["CARVALHO, José Murilo de. ", "A formação das almas", ": o imaginário da República no Brasil. São Paulo: Companhia das Letras, 1990."],
      ["CARVALHO, José Murilo de. ", "Cidadania no Brasil", ": o longo caminho. Rio de Janeiro: Civilização Brasileira, 2001."],
      ["CARVALHO, José Murilo de. ", "D. Pedro II", ": ser ou não ser. São Paulo: Companhia das Letras, 2007."],
      ["CASTRO, Celso. ", "Os militares e a República", ": um estudo sobre cultura e ação política. Rio de Janeiro: Jorge Zahar, 1995."],
      ["COSTA, Emília Viotti da. ", "Da Monarquia à República", ": momentos decisivos. 7. ed. São Paulo: Editora Unesp, 1999."],
      ["DORATIOTO, Francisco. ", "Maldita guerra", ": nova história da Guerra do Paraguai. São Paulo: Companhia das Letras, 2002."],
      ["FAUSTO, Boris. ", "História do Brasil", ". São Paulo: Edusp, 1994."],
      ["SCHWARCZ, Lilia M. ", "As barbas do imperador", ": D. Pedro II, um monarca nos trópicos. São Paulo: Companhia das Letras, 1998."],
      ["SCHWARCZ, Lilia M.; STARLING, Heloisa M. ", "Brasil: uma biografia", ". São Paulo: Companhia das Letras, 2015."],
    ];
    const per = 4, cwid = (W - 2 * MX - 2 * 0.3) / 3;
    for (let c = 0; c < 3; c++) {
      const runs = [];
      refs.slice(c * per, c * per + per).forEach(([a, b, d], i, arr) => {
        runs.push({ text: a, options: {} });
        runs.push({ text: b, options: { bold: true } });
        runs.push({ text: d, options: { breakLine: i < arr.length - 1 } });
      });
      T(s, runs, { x: MX + c * (cwid + 0.3), y: 5.45, w: cwid, h: 1.58, fontSize: 9.5, color: C.text1, paraSpaceAfter: 3.5 });
    }
    footer(s);
    s.addNotes(NOTES[18]);
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT, "slides:", N);
}

build().catch((e) => { console.error(e); process.exit(1); });
