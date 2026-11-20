/* Mapas da apresentação: regências (02), pacificação (08), café (09) e Rio da Prata (14).
   Traçados esquemáticos sobre a base Natural Earth; fronteiras atuais só como referência.
   Cada mapa tem camadas (data-k) que aparecem conforme as etapas do slide. */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});
  var P = function (lon, lat) { return GP.project(lon, lat); };
  var line = function (pts) { return "M" + pts.map(function (c) { var p = P(c[0], c[1]); return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L"); };

  // Rio Paraíba do Sul: da nascente (Paraibuna) à foz (São João da Barra)
  var PARAIBA = [[-45.66, -23.39], [-46.03, -23.41], [-45.97, -23.30], [-45.89, -23.18], [-45.56, -23.03], [-45.23, -22.85], [-45.01, -22.67],
    [-44.45, -22.47], [-44.17, -22.54], [-44.10, -22.52], [-43.83, -22.47], [-43.29, -22.16], [-43.21, -22.12], [-42.91, -21.99],
    [-42.08, -21.67], [-41.75, -21.65], [-41.32, -21.75], [-41.05, -21.64]];
  // Ferrovias (traçado esquemático e ano em que chegaram aos pontos indicados)
  var RAILS = [
    { name: "D. Pedro II", pts: [[-43.19, -22.90], [-43.65, -22.64], [-43.83, -22.47], [-44.17, -22.54], [-44.45, -22.47], [-45.01, -22.67]] },
    { name: "São Paulo–Rio", pts: [[-45.01, -22.67], [-45.12, -22.73], [-45.56, -23.03], [-45.89, -23.18], [-46.19, -23.52], [-46.63, -23.55]] },
    { name: "São Paulo Railway", pts: [[-46.33, -23.96], [-46.42, -23.89], [-46.30, -23.78], [-46.63, -23.55], [-46.88, -23.19]] },
    { name: "Paulista", pts: [[-46.88, -23.19], [-47.06, -22.91], [-47.40, -22.56], [-47.56, -22.41]] },
    { name: "Mogiana", pts: [[-47.06, -22.91], [-46.96, -22.43], [-47.09, -21.77], [-47.81, -21.18]] },
    { name: "Mauá (1854)", pts: [[-43.17, -22.71], [-43.12, -22.62]], first: true }
  ];
  var CITIES = [
    ["Rio de Janeiro", -43.17, -22.91, 1, 0, "corte"],
    ["São Paulo", -46.63, -23.55, -1, -14],
    ["Santos", -46.33, -23.96, 1, 0, "port"],
    ["Campinas", -47.06, -22.91, -1, 4],
    ["Ribeirão Preto", -47.81, -21.18, 1, -12],
    ["Vassouras", -43.66, -22.40, -1, -12],
  ];

  function buildCafe(mount) {
    var G = window.GP_GEO;
    var svg = GP.svg("svg", { "class": "m-base", preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true" }, mount);
    GP.svg("rect", { "class": "m-sea", x: -2000, y: -2000, width: 9000, height: 11000 }, svg);
    var grat = GP.svg("g", { "class": "m-graticule" }, svg);
    var lon, lat, a, b;
    for (lon = -52; lon <= -38; lon += 2) { a = P(lon, -16); b = P(lon, -30); GP.svg("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grat); }
    for (lat = -16; lat >= -30; lat -= 2) { a = P(-54, lat); b = P(-36, lat); GP.svg("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grat); }
    ["BRA", "PRY", "ARG"].forEach(function (code) { if (G.countries[code]) GP.svg("path", { d: G.countries[code], "class": "m-land" + (code === "BRA" ? " is-key" : "") }, svg); });
    Object.keys(G.rivers).forEach(function (k) { GP.svg("path", { d: G.rivers[k], "class": "m-river" }, svg); });
    var sea = P(-42.3, -24.6);
    var sl = GP.svg("text", { x: sea[0], y: sea[1], "class": "m-sea-name", "text-anchor": "middle" }, svg);
    sl.textContent = "Oceano Atlântico";

    // camada 0: o Vale do Paraíba
    var l0 = GP.svg("g", { "class": "cm-layer", "data-k": "0" }, svg);
    GP.svg("path", { d: line(PARAIBA), "class": "cm-vale-band" }, l0);
    GP.svg("path", { d: line(PARAIBA), "class": "m-river is-main cm-draw", pathLength: 1 }, l0);
    var vl = P(-44.35, -22.95);
    var t = GP.svg("text", { x: vl[0], y: vl[1], "class": "cm-region-name is-vale", "text-anchor": "middle" }, l0);
    t.textContent = "Vale do Paraíba";
    var rv = P(-42.05, -21.42);
    t = GP.svg("text", { x: rv[0], y: rv[1], "class": "m-river-name", "text-anchor": "middle", transform: "rotate(-8 " + rv[0] + " " + rv[1] + ")" }, l0);
    t.textContent = "rio Paraíba do Sul";

    // camada 1: a marcha do café para o Oeste Paulista
    var l1 = GP.svg("g", { "class": "cm-layer", "data-k": "1" }, svg);
    var oeste = [[-48.25, -21.0], [-47.4, -20.7], [-46.75, -21.4], [-46.7, -22.6], [-47.1, -23.05], [-47.75, -22.75], [-48.3, -22.0]];
    GP.svg("path", { d: line(oeste) + "Z", "class": "cm-oeste" }, l1);
    var ol = P(-47.55, -21.75);
    t = GP.svg("text", { x: ol[0], y: ol[1], "class": "cm-region-name is-oeste", "text-anchor": "middle" }, l1);
    t.textContent = "Oeste Paulista";
    var ar0 = P(-45.4, -22.95), ar1 = P(-46.85, -22.35);
    var mid = [(ar0[0] + ar1[0]) / 2, (ar0[1] + ar1[1]) / 2 - 95];
    GP.svg("path", { d: "M" + ar0.join(" ") + "Q" + mid.join(" ") + " " + ar1.join(" "), "class": "cm-arrow cm-draw", pathLength: 1, "marker-end": "url(#cmHead)" }, l1);
    var defs = GP.svg("defs", null, svg);
    var mk = GP.svg("marker", { id: "cmHead", viewBox: "0 0 10 10", refX: 6, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto-start-reverse" }, defs);
    GP.svg("path", { d: "M0 0L10 5L0 10z", "class": "cm-arrow-head" }, mk);
    t = GP.svg("text", { x: mid[0], y: mid[1] + 38, "class": "cm-arrow-label", "text-anchor": "middle" }, l1);
    t.textContent = "a marcha do café";

    // camada 2: ferrovias e portos
    var l2 = GP.svg("g", { "class": "cm-layer", "data-k": "2" }, svg);
    RAILS.forEach(function (r, i) {
      GP.svg("path", { d: line(r.pts), "class": "cm-rail-bed" }, l2);
      var p = GP.svg("path", { d: line(r.pts), "class": "cm-rail cm-draw" + (r.first ? " is-first" : ""), pathLength: 1 }, l2);
      p.style.setProperty("--delay", (.3 + i * .25) + "s");
    });
    var m1 = P(-42.95, -22.66);
    t = GP.svg("text", { x: m1[0], y: m1[1], "class": "cm-note" }, l2);
    t.textContent = "1ª ferrovia, 1854";

    // camada 3: cidades e portos
    var l3 = GP.svg("g", { "class": "cm-layer", "data-k": "3" }, svg);
    CITIES.forEach(function (c) {
      var p = P(c[1], c[2]);
      var g = GP.svg("g", { "class": "cm-city" + (c[5] ? " is-" + c[5] : "") }, c[5] ? l3 : l2);
      if (c[5]) GP.svg("circle", { cx: p[0], cy: p[1], r: 16, "class": "cm-pulse" }, g);
      GP.svg("circle", { cx: p[0], cy: p[1], r: c[5] ? 7.5 : 5.5, "class": "m-city-ring" }, g);
      GP.svg("circle", { cx: p[0], cy: p[1], r: c[5] ? 3.6 : 2.6, "class": "m-city" }, g);
      var tx = GP.svg("text", { x: p[0] + c[3] * 12, y: p[1] + 5 + (c[4] || 0), "text-anchor": c[3] > 0 ? "start" : "end", "class": "m-city-name" }, g);
      tx.textContent = c[0];
      if (c[5] === "corte") {
        var s = GP.svg("text", { x: p[0] + 12, y: p[1] + 24, "class": "cm-note" }, g);
        s.textContent = "capital e porto do café";
      }
      if (c[5] === "port") {
        var s2 = GP.svg("text", { x: p[0] + 12, y: p[1] + 24, "class": "cm-note" }, g);
        s2.textContent = "porto do café paulista";
      }
    });

    function fit() {
      var w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight);
      var box = GP.fitBox(GP.bbox(-48.6, -20.6, -40.7, -24.5), w / h, .04);
      svg.setAttribute("viewBox", [box.x, box.y, box.w, box.h].map(function (n) { return n.toFixed(1); }).join(" "));
      svg.style.setProperty("--sw", (box.w / w).toFixed(4));
    }
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(mount);
    return svg;
  }


  /* ---------- Mapas com marcadores (um conjunto por etapa) ---------- */
  // tipo: corte (capital), revolta, paz, batalha, cidade
  var MAPS = {
    regencias: {
      box: [-75, 6, -33, -41], key: "BRA", pad: .02,
      names: [["Império do Brasil", -53, -11, "m-country-name is-key"], ["Oceano Atlântico", -36.5, -27.5, "m-sea-name"]],
      layers: [
        [{ t: "corte", lon: -43.17, lat: -22.91, name: "Rio de Janeiro", sub: "a Corte e a Regência", side: 1 }],
        [{ t: "revolta", lon: -48.49, lat: -1.45, name: "Cabanagem", sub: "Pará · 1835–1840", side: -1 }],
        [{ t: "revolta", lon: -51.23, lat: -30.03, name: "Farroupilha", sub: "Rio Grande do Sul · 1835–1845", side: 1 }],
        [{ t: "revolta", lon: -38.50, lat: -12.97, name: "Sabinada", sub: "Bahia · 1837–1838", side: -1 }],
        [{ t: "revolta", lon: -43.36, lat: -4.86, name: "Balaiada", sub: "Maranhão · 1838–1841", side: 1 }]
      ]
    },
    pacificacao: {
      box: [-60, -2, -33, -41], key: "BRA", pad: .02,
      names: [["Oceano Atlântico", -37, -28.5, "m-sea-name"]],
      layers: [
        [{ t: "revolta", lon: -47.46, lat: -23.50, name: "Sorocaba", sub: "revolta liberal · 1842", side: -1 },
         { t: "revolta", lon: -43.77, lat: -21.22, name: "Barbacena", sub: "revolta liberal · 1842", side: -1, dy: 6 },
         { t: "batalha", lon: -43.85, lat: -19.77, name: "Santa Luzia", sub: "derrota liberal · 1842", side: 1, dy: -4 }],
        [{ t: "paz", lon: -54.67, lat: -30.98, name: "Ponche Verde", sub: "paz com os farrapos · 1845", side: 1 }],
        [{ t: "revolta", lon: -34.88, lat: -8.05, name: "Recife", sub: "Revolução Praieira · 1848–1850", side: -1 }],
        [{ t: "corte", lon: -43.17, lat: -22.91, name: "Rio de Janeiro", sub: "a ordem imperial se impõe", side: 1, dy: 10 }]
      ]
    },
    prata: {
      box: [-62.5, -21.5, -47.5, -38.6], key: "BRA", detail: true, rivers: true, pad: .02,
      names: [["Império do Brasil", -51.6, -26.2, "m-country-name is-key"], ["Argentina", -61, -30.5, "m-country-name"],
              ["Uruguai", -55.6, -31.3, "m-country-name"], ["Paraguai", -58.6, -23.3, "m-country-name"],
              ["Rio da Prata", -57.3, -35.2, "m-river-name"], ["Oceano Atlântico", -50.5, -33.6, "m-sea-name"]],
      layers: [
        [{ t: "cidade", lon: -58.38, lat: -34.60, name: "Buenos Aires", side: -1, dy: -14 },
         { t: "cidade", lon: -56.16, lat: -34.90, name: "Montevidéu", side: 1, dy: 8 }],
        [{ t: "batalha", lon: -58.56, lat: -34.62, name: "Monte Caseros", sub: "3 fev. 1852 · queda de Rosas", side: -1, dy: 14 }],
        [],
        [{ t: "batalha", lon: -58.08, lat: -32.32, name: "Paysandú", sub: "cerco · dez. 1864–jan. 1865", side: 1 },
         { t: "revolta", lon: -57.58, lat: -25.28, name: "Assunção", sub: "o Paraguai reage: guerra", side: 1 }]
      ]
    }
  };

  function marker(m, parent) {
    var g = GP.svg("g", { "class": "mk mk-" + m.t }, parent);
    var big = m.t !== "cidade";
    if (m.t === "revolta" || m.t === "batalha") GP.svg("circle", { r: 15, "class": "mk-halo" }, g);
    if (m.t === "corte") GP.svg("circle", { r: 16, "class": "cm-pulse" }, g);
    if (m.t === "batalha") {
      GP.svg("path", { d: "M-7 -7L7 7M7 -7L-7 7", "class": "mk-cross" }, g);
    } else if (m.t === "paz") {
      GP.svg("rect", { x: -6, y: -6, width: 12, height: 12, transform: "rotate(45)", "class": "mk-dot" }, g);
    } else {
      GP.svg("circle", { r: big ? 7.5 : 5.5, "class": "m-city-ring" }, g);
      GP.svg("circle", { r: big ? 4 : 2.8, "class": "mk-dot" }, g);
    }
    var x = (m.side || 1) * 14, y = (m.dy || 0);
    var anchor = (m.side || 1) > 0 ? "start" : "end";
    var t = GP.svg("text", { x: x, y: y + (m.sub ? 0 : 5), "text-anchor": anchor, "class": "mk-name" }, g);
    t.textContent = m.name;
    if (m.sub) {
      var s = GP.svg("text", { x: x, y: y + 19, "text-anchor": anchor, "class": "mk-sub" }, g);
      s.textContent = m.sub;
    }
    return g;
  }

  function buildMarkers(mount, cfg) {
    var G = window.GP_GEO;
    var svg = GP.svg("svg", { "class": "m-base", preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true" }, mount);
    GP.svg("rect", { "class": "m-sea", x: -9000, y: -9000, width: 30000, height: 30000 }, svg);
    var b = cfg.box, grat = GP.svg("g", { "class": "m-graticule" }, svg), lon, lat, a, c;
    var step = cfg.detail ? 2 : 5;
    for (lon = Math.ceil(b[0] / step) * step; lon <= b[2]; lon += step) { a = P(lon, b[1] + 2); c = P(lon, b[3] - 2); GP.svg("line", { x1: a[0], y1: a[1], x2: c[0], y2: c[1] }, grat); }
    for (lat = Math.floor(b[1] / step) * step; lat >= b[3]; lat -= step) { a = P(b[0] - 2, lat); c = P(b[2] + 2, lat); GP.svg("line", { x1: a[0], y1: a[1], x2: c[0], y2: c[1] }, grat); }
    var src = cfg.detail && G.detail ? G.detail : G.countries;
    Object.keys(G.countries).forEach(function (code) {
      var d = src[code] || G.countries[code];
      GP.svg("path", { d: d, "class": "m-land" + (code === cfg.key ? " is-key" : "") }, svg);
    });
    if (cfg.rivers) Object.keys(G.rivers).forEach(function (k) { GP.svg("path", { d: G.rivers[k], "class": "m-river" + (k === "parana" || k === "uruguai" || k === "paraguai" ? " is-main" : "") }, svg); });
    var pins = [];
    var labels = GP.svg("g", { "class": "mk-names" }, svg);
    (cfg.names || []).forEach(function (n) {
      var g = GP.svg("g", null, labels), t = GP.svg("text", { x: 0, y: 0, "text-anchor": "middle", "class": n[3] }, g);
      t.textContent = n[0];
      pins.push([g, n[1], n[2]]);
    });
    cfg.layers.forEach(function (items, k) {
      var layer = GP.svg("g", { "class": "cm-layer", "data-k": k }, svg);
      items.forEach(function (m) { pins.push([marker(m, layer), m.lon, m.lat]); });
    });
    function fit() {
      var w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight);
      var box = GP.fitBox(GP.bbox(b[0], b[1], b[2], b[3]), w / h, cfg.pad || 0);
      var sw = box.w / w;
      svg.setAttribute("viewBox", [box.x, box.y, box.w, box.h].map(function (n) { return n.toFixed(1); }).join(" "));
      svg.style.setProperty("--sw", sw.toFixed(4));
      pins.forEach(function (p) { var q = P(p[1], p[2]); p[0].setAttribute("transform", "translate(" + q[0].toFixed(1) + " " + q[1].toFixed(1) + ") scale(" + sw.toFixed(4) + ")"); });
    }
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(mount);
    return svg;
  }

  GP.initMaps = function (deck) {
    Array.prototype.forEach.call(deck.querySelectorAll("[data-map]"), function (mount) {
      var name = mount.getAttribute("data-map");
      var svg = name === "cafe" ? buildCafe(mount) : MAPS[name] ? buildMarkers(mount, MAPS[name]) : null;
      if (!svg) return;
      var slide = mount.closest(".slide");
      var layers = Array.prototype.slice.call(svg.querySelectorAll(".cm-layer"));
      function set(step) {
        layers.forEach(function (l) {
          var k = Number(l.getAttribute("data-k"));
          l.classList.toggle("is-on", k <= step);
          l.classList.toggle("is-now", k === step);
        });
      }
      slide.addEventListener("gp:step", function (e) { set(e.detail.step); });
      set(Number(slide.dataset.step || 0));
    });
  };
})();
