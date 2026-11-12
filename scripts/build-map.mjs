#!/usr/bin/env node
// Gera js/map-data.js a partir dos arquivos GeoJSON do Natural Earth (domínio público).
// Uso: node scripts/build-map.mjs <pasta-com-geojson>
// Arquivos esperados na pasta:
//   ne_50m_admin_0_countries.geojson
//   ne_10m_admin_0_countries.geojson
//   ne_10m_rivers_lake_centerlines.geojson
// Fonte: https://github.com/nvkelso/natural-earth-vector (Natural Earth, domínio público).
// As fronteiras do Natural Earth são ATUAIS; a apresentação as usa apenas como referência.
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Informe a pasta com os arquivos GeoJSON do Natural Earth.");
  process.exit(1);
}
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));

// Projeção equirretangular ajustada à latitude média da Bacia do Prata (25° S).
const PROJ = { lon0: -82, lat0: 13, k: 100, cos: Math.cos((25 * Math.PI) / 180) };
const project = ([lon, lat]) => [(lon - PROJ.lon0) * PROJ.k * PROJ.cos, (PROJ.lat0 - lat) * PROJ.k];

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const sqTol = tolerance * tolerance;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxSq = 0;
    let index = 0;
    const [ax, ay] = points[first];
    const [bx, by] = points[last];
    const dx = bx - ax;
    const dy = by - ay;
    const len = dx * dx + dy * dy || 1;
    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i];
      let t = ((px - ax) * dx + (py - ay) * dy) / len;
      t = Math.max(0, Math.min(1, t));
      const ex = ax + t * dx - px;
      const ey = ay + t * dy - py;
      const sq = ex * ex + ey * ey;
      if (sq > maxSq) {
        maxSq = sq;
        index = i;
      }
    }
    if (maxSq > sqTol) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const fmt = (n) => (Math.round(n * 10) / 10).toString();
function toPath(lines, { closed = false, tolerance = 0.6, minExtent = 0 } = {}) {
  let d = "";
  for (const line of lines) {
    const pts = line.map(project);
    if (minExtent) {
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      if (Math.max(...xs) - Math.min(...xs) < minExtent && Math.max(...ys) - Math.min(...ys) < minExtent) continue;
    }
    const simple = simplify(pts, tolerance);
    if (simple.length < 2) continue;
    d += "M" + simple.map(([x, y]) => fmt(x) + " " + fmt(y)).join("L") + (closed ? "Z" : "");
  }
  return d;
}

// Países
const countries = read("ne_50m_admin_0_countries.geojson");
const wanted = ["BRA", "ARG", "URY", "PRY", "BOL", "CHL", "PER", "ECU", "COL", "VEN", "GUY", "SUR", "PAN", "CRI", "FLK"];
const countryPaths = {};
for (const feature of countries.features) {
  const code = feature.properties.ADM0_A3;
  if (!wanted.includes(code)) continue;
  const geom = feature.geometry;
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  const rings = polys.flatMap((poly) => poly);
  countryPaths[code] = toPath(rings, { closed: true, tolerance: 0.7, minExtent: 18 });
}
// A Guiana Francesa integra o polígono da França no Natural Earth; recorte para a América do Sul.
const fra = countries.features.find((f) => f.properties.ADM0_A3 === "FRA");
if (fra) {
  const rings = fra.geometry.coordinates
    .flatMap((poly) => poly)
    .filter((ring) => ring.every(([lon, lat]) => lon > -60 && lon < -50 && lat > 0 && lat < 8));
  countryPaths.GUF = toPath(rings, { closed: true, tolerance: 0.7 });
}

// Detalhe 1:10m recortado no teatro da guerra (usado no mapa com zoom por fases)
const DETAIL_BOX = [-66, -36, -48, -14]; // oeste, sul, leste, norte
function clipRing(ring, [w, s, e, n]) {
  // Sutherland–Hodgman contra um retângulo em longitude/latitude
  const edges = [
    (p) => p[0] >= w, (p) => p[0] <= e, (p) => p[1] >= s, (p) => p[1] <= n,
  ];
  const cut = [
    (a, b) => [w, a[1] + ((b[1] - a[1]) * (w - a[0])) / (b[0] - a[0])],
    (a, b) => [e, a[1] + ((b[1] - a[1]) * (e - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (s - a[1])) / (b[1] - a[1]), s],
    (a, b) => [a[0] + ((b[0] - a[0]) * (n - a[1])) / (b[1] - a[1]), n],
  ];
  let out = ring;
  for (let k = 0; k < 4; k++) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      const inCur = edges[k](cur);
      const inPrev = edges[k](prev);
      if (inCur) {
        if (!inPrev) out.push(cut[k](prev, cur));
        out.push(cur);
      } else if (inPrev) {
        out.push(cut[k](prev, cur));
      }
    }
    if (!out.length) break;
  }
  return out;
}
const countries10 = read("ne_10m_admin_0_countries.geojson");
const detailPaths = {};
for (const feature of countries10.features) {
  const code = feature.properties.ADM0_A3;
  if (!["BRA", "ARG", "URY", "PRY", "BOL", "CHL"].includes(code)) continue;
  const geom = feature.geometry;
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  const rings = polys.flatMap((poly) => poly).map((ring) => clipRing(ring, DETAIL_BOX)).filter((r) => r.length > 3);
  const d = toPath(rings, { closed: true, tolerance: 0.35, minExtent: 6 });
  if (d) detailPaths[code] = d;
}

// Rios
const rivers = read("ne_10m_rivers_lake_centerlines.geojson");
const parts = (feature) => (feature.geometry.type === "LineString" ? [feature.geometry.coordinates] : feature.geometry.coordinates);
const byName = (name, rank) =>
  rivers.features.filter((f) => f.geometry && f.properties.name === name && (rank === undefined || f.properties.scalerank === rank));
const inBox = (line, [w, s, e, n]) => line.some(([lon, lat]) => lon > w && lon < e && lat > s && lat < n);

// No Natural Earth, o rio Paraguai integra a feição "Paraná" de escala 2 (primeira parte).
const paranaMain = byName("Paraná", 2).flatMap(parts);
const paraguai = paranaMain.filter((line) => line[0][1] > -15 && line[line.length - 1][1] < -27);
const paranaBaixo = paranaMain.filter((line) => !paraguai.includes(line));
const paranaUpper = byName("Paraná", 4).flatMap(parts);
const paranaFronteira = paranaUpper.filter((line) => line[0][0] > -54.7 && line[line.length - 1][0] < -58);
const paranaAlto = paranaUpper.filter((line) => !paranaFronteira.includes(line));

const riverPaths = {
  paraguai: toPath(paraguai, { tolerance: 0.5 }),
  parana: toPath([...paranaFronteira, ...paranaBaixo], { tolerance: 0.5 }),
  paranaAlto: toPath(paranaAlto, { tolerance: 0.8 }),
  uruguai: toPath(byName("Uruguay").flatMap(parts), { tolerance: 0.5 }),
  pilcomayo: toPath(byName("Pilcomayo").flatMap(parts), { tolerance: 0.8 }),
  bermejo: toPath(byName("Bermejo").flatMap(parts), { tolerance: 0.8 }),
  negro: toPath(byName("Negro").flatMap(parts).filter((l) => inBox(l, [-59, -34, -53, -31])), { tolerance: 0.8 }),
  ibicui: toPath(byName("Ibicuí").flatMap(parts), { tolerance: 0.8 }),
  miranda: toPath(byName("Miranda").flatMap(parts), { tolerance: 0.8 }),
  taquari: toPath(byName("Taquari").flatMap(parts), { tolerance: 0.8 }),
  jejui: toPath(byName("Jejui Guazu").flatMap(parts), { tolerance: 0.8 }),
  salado: toPath(byName("Salado", 6).flatMap(parts), { tolerance: 0.8 }),
};

const data = { proj: PROJ, countries: countryPaths, detail: detailPaths, detailBox: DETAIL_BOX, rivers: riverPaths };
const banner =
  "/* Gerado por scripts/build-map.mjs a partir do Natural Earth (domínio público).\n" +
  "   Fronteiras atuais, usadas apenas como referência geográfica. */\n";
const out = banner + "window.GP_GEO = " + JSON.stringify(data) + ";\n";
fs.writeFileSync(new URL("../js/map-data.js", import.meta.url), out);
console.log("js/map-data.js gerado:", (out.length / 1024).toFixed(1), "KB");
for (const [k, v] of Object.entries(riverPaths)) console.log("  rio", k, v.length);
for (const [k, v] of Object.entries(countryPaths)) console.log("  país", k, v.length);
for (const [k, v] of Object.entries(detailPaths)) console.log("  detalhe", k, v.length);
