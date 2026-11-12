/* Mapas vivos: Bacia do Prata (slide 2), teatro das campanhas (slide 7) e contornos (slide 4). */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});
  var P = function (lon, lat) { return GP.project(lon, lat); };

  /* ---------- utilidades ---------- */
  function parsePath(d) {
    var subs = [];
    d.split("M").forEach(function (chunk) {
      if (!chunk.trim()) return;
      var pts = chunk.replace(/Z/g, "").split("L").map(function (pair) {
        var n = pair.trim().split(/\s+/).map(Number);
        return [n[0], n[1]];
      });
      subs.push(pts);
    });
    return subs;
  }
  function near(a, b, tol) { return Math.abs(a[0] - b[0]) < tol && Math.abs(a[1] - b[1]) < tol; }
  function toD(points) { return "M" + points.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("L"); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // Trecho do rio Paraguai entre duas latitudes (na direção pedida)
  function paraguaiBetween(latA, latB) {
    var pts = parsePath(window.GP_GEO.rivers.paraguai)[0];
    var ya = P(0, latA)[1], yb = P(0, latB)[1];
    var lo = Math.min(ya, yb), hi = Math.max(ya, yb);
    var seg = pts.filter(function (p) { return p[1] >= lo && p[1] <= hi; });
    return ya > yb ? seg.reverse() : seg; // de A para B
  }
  function uruguaiBetween(latA, latB) {
    var pts = parsePath(window.GP_GEO.rivers.uruguai)[0];
    var ya = P(0, latA)[1], yb = P(0, latB)[1];
    var lo = Math.min(ya, yb), hi = Math.max(ya, yb);
    var seg = pts.filter(function (p) { return p[1] >= lo && p[1] <= hi && p[0] < P(-55.3, 0)[0]; });
    return ya > yb ? seg.reverse() : seg;
  }
  // Rota fluvial de Assunção ao Atlântico, seguindo a geometria dos rios
  function riverRouteToSea() {
    var G = window.GP_GEO;
    var route = paraguaiBetween(-25.28, -27.32);
    var parana = parsePath(G.rivers.parana);
    var find = function (lon, lat) {
      var target = P(lon, lat);
      for (var i = 0; i < parana.length; i++) if (near(parana[i][0], target, 6)) return parana[i];
      return [];
    };
    route = route.concat(find(-58.60, -27.31), find(-60.41, -33.17), find(-59.19, -33.81));
    [[-57.6, -34.95], [-56.2, -35.25], [-54.6, -35.25], [-53.2, -35.0]].forEach(function (c) { route.push(P(c[0], c[1])); });
    return route;
  }

  /* ---------- Componente de mapa ---------- */
  function MapView(mount, cfg) {
    this.mount = mount;
    this.cfg = cfg;
    this.anchors = [];
    var G = window.GP_GEO;
    var base = (this.base = GP.svg("svg", { "class": "m-base", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" }, mount));
    this.over = GP.svg("svg", { "class": "m-over" }, mount);
    var defs = GP.svg("defs", null, base);
    this.defs = defs;
    GP.svg("rect", { "class": "m-sea", x: -2000, y: -2000, width: 9000, height: 11000 }, base);
    var grat = GP.svg("g", { "class": "m-graticule" }, base);
    for (var lon = -85; lon <= -30; lon += cfg.grid || 5) {
      var a = P(lon, 15), b = P(lon, -60);
      GP.svg("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grat);
    }
    for (var lat = 15; lat >= -60; lat -= cfg.grid || 5) {
      var c = P(-90, lat), d = P(-25, lat);
      GP.svg("line", { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, grat);
    }
    var land = GP.svg("g", null, base);
    var useDetail = cfg.detail && G.detail;
    Object.keys(G.countries).forEach(function (code) {
      var dPath = useDetail && G.detail[code] ? G.detail[code] : G.countries[code];
      var cls = "m-land" + (["BRA", "ARG", "URY", "PRY"].indexOf(code) > -1 ? " is-key" : "") + (code === "PRY" ? " is-py" : "");
      GP.svg("path", { d: dPath, "class": cls, "data-code": code }, land);
    });
    var rivers = (this.riversLayer = GP.svg("g", null, base));
    var self = this;
    Object.keys(G.rivers).forEach(function (k, i) {
      var main = ["paraguai", "parana", "uruguai"].indexOf(k) > -1;
      var order = { paraguai: 0, parana: 1, uruguai: 2 };
      var el = GP.svg("path", { d: G.rivers[k], "class": "m-river" + (main ? " is-main" : "") + (cfg.drawRivers ? " m-draw" : ""), "data-river": k, pathLength: 1 }, rivers);
      if (cfg.drawRivers) {
        el.style.setProperty("--delay", (main ? .35 + order[k] * .55 : 1.6 + i * .05) + "s");
        el.style.setProperty("--dur", main ? "2.4s" : "1.8s");
      }
      self[k + "El"] = el;
    });
    this.extra = GP.svg("g", null, base);
    this.frame = GP.svg("rect", { "class": "m-frame", x: 0, y: 0, width: 0, height: 0 }, base);
    this.vb = null;
    this.ro = new ResizeObserver(function () { self.resize(); });
    this.ro.observe(mount);
  }
  MapView.prototype.anchor = function (lon, lat, cls, phase) {
    var g = GP.svg("g", { "class": cls || "" }, this.over);
    var a = { p: P(lon, lat), g: g, phase: phase };
    this.anchors.push(a);
    return a;
  };
  MapView.prototype.anchorXY = function (xy, cls) {
    var g = GP.svg("g", { "class": cls || "" }, this.over);
    var a = { p: xy, g: g };
    this.anchors.push(a);
    return a;
  };
  // Medidas de layout (não afetadas pelas transformações das transições)
  MapView.prototype.size = function () {
    return { w: Math.max(1, this.mount.clientWidth), h: Math.max(1, this.mount.clientHeight) };
  };
  MapView.prototype.fit = function (bb) {
    var s = this.size();
    return GP.fitBox(GP.bbox(bb[0], bb[1], bb[2], bb[3]), s.w / s.h, this.cfg.pad || 0);
  };
  MapView.prototype.resize = function () {
    if (!this.cam) return;
    this.set(this.fit(this.cam));
  };
  MapView.prototype.camera = function (bb, animate) {
    this.cam = bb;
    var to = this.fit(bb), from = this.vb, self = this;
    cancelAnimationFrame(this.raf);
    if (!animate || !from || GP.reduced()) return this.set(to);
    var t0 = performance.now(), dur = 1500;
    var step = function (now) {
      var t = Math.min(1, (now - t0) / dur), e = ease(t);
      self.set({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e });
      if (t < 1) self.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  };
  MapView.prototype.set = function (vb) {
    this.vb = vb;
    this.base.setAttribute("viewBox", [vb.x, vb.y, vb.w, vb.h].map(function (n) { return n.toFixed(2); }).join(" "));
    var s = this.size();
    var sx = s.w / vb.w, sy = s.h / vb.h;
    var scale = Math.max(sx, sy);
    var ox = (s.w - vb.w * scale) / 2, oy = (s.h - vb.h * scale) / 2;
    this.toScreen = function (p) { return [(p[0] - vb.x) * scale + ox, (p[1] - vb.y) * scale + oy]; };
    this.base.style.setProperty("--sw", (1 / scale).toFixed(4));
    this.anchors.forEach(function (a) {
      var q = this.toScreen(a.p);
      a.g.setAttribute("transform", "translate(" + q[0].toFixed(1) + " " + q[1].toFixed(1) + ")");
    }, this);
    if (this.onSet) this.onSet();
  };

  /* Texto e marcadores na camada em pixels */
  function text(parent, str, attrs) {
    var t = GP.svg("text", attrs, parent);
    t.textContent = str;
    return t;
  }

  /* ---------- Slide 2: Bacia do Prata (papel) ---------- */
  function buildPrata(mount) {
    var mv = new MapView(mount, { drawRivers: true, pad: .02 });
    mount.parentNode.classList.add("map-paper");
    // Rota fluvial (tracejada, revelada por máscara)
    var route = riverRouteToSea();
    var id = "routeMask" + Math.random().toString(36).slice(2, 7);
    var mask = GP.svg("mask", { id: id, maskUnits: "userSpaceOnUse", x: -2000, y: -2000, width: 9000, height: 11000 }, mv.defs);
    var mp = GP.svg("path", { d: toD(route), "class": "m-draw", pathLength: 1, fill: "none", stroke: "#fff", "stroke-width": 40 }, mask);
    mp.style.setProperty("--delay", "2.4s");
    mp.style.setProperty("--dur", "3.2s");
    GP.svg("path", { d: toD(route), "class": "m-route", mask: "url(#" + id + ")" }, mv.extra);
    // Nomes de países e mares
    [["Brasil", -50.5, -19.5], ["Argentina", -63.2, -30.2], ["Paraguai", -60.5, -22.7], ["Uruguai", -55.4, -33.2], ["Bolívia", -63.5, -17.4]].forEach(function (c, i) {
      var a = mv.anchor(c[1], c[2], "m-fade");
      a.g.style.setProperty("--delay", (.8 + i * .12) + "s");
      text(a.g, c[0], { "class": "m-country-name", "text-anchor": "middle" });
    });
    var sea = mv.anchor(-48.5, -32.2, "m-fade");
    sea.g.style.setProperty("--delay", "1.2s");
    text(sea.g, "Oceano Atlântico", { "class": "m-sea-name", "text-anchor": "middle" });
    // Rios
    [["Rio Paraguai", -57.05, -20.3, -84], ["Rio Paraná", -59.85, -30.9, -66], ["Rio Uruguai", -56.15, -30.15, -52], ["Rio da Prata", -57.6, -35.75, -14]].forEach(function (r, i) {
      var a = mv.anchor(r[1], r[2], "m-fade");
      a.g.style.setProperty("--delay", (1.4 + i * .45) + "s");
      text(a.g, r[0], { "class": "m-river-name", "text-anchor": "middle", transform: "rotate(" + r[3] + ")" });
    });
    // Cidades
    [["Assunção", -57.64, -25.28, 1], ["Corrientes", -58.83, -27.47, -1], ["Buenos Aires", -58.38, -34.6, -1], ["Montevidéu", -56.19, -34.9, 1]].forEach(function (c, i) {
      var a = mv.anchor(c[1], c[2], "m-fade");
      a.g.style.setProperty("--delay", (2 + i * .2) + "s");
      GP.svg("circle", { r: 7, "class": "m-city-ring" }, a.g);
      GP.svg("circle", { r: 3.2, "class": "m-city" }, a.g);
      text(a.g, c[0], { "class": "m-city-name", x: c[3] * 12, y: 4, "text-anchor": c[3] > 0 ? "start" : "end" });
    });
    var rl = mv.anchor(-54.2, -34.35, "m-fade");
    rl.g.style.setProperty("--delay", "4.6s");
    text(rl.g, "Rota fluvial até o Atlântico", { "class": "m-route-label", "text-anchor": "middle" });
    mv.camera([-66.5, -14.4, -45.5, -38.8]);
    return mv;
  }

  /* ---------- Slide 7: campanhas por fase ---------- */
  var PHASE_CAMS = [
    [-63, -17.6, -52.6, -31],
    [-61.2, -25.6, -54.6, -30.9],
    [-59.25, -26.75, -57.75, -27.8],
    [-59.0, -24.95, -57.0, -27.3],
    [-58.6, -22.0, -54.8, -26.0]
  ];
  // Rotas esquemáticas: lado, pontos (lon/lat) ou função, rótulo
  function routes() {
    return [
      { phase: 0, side: "py", pts: paraguaiBetween(-25.28, -19.0), label: "Ofensiva ao Mato Grosso", off: [16, 0, "start"] },
      { phase: 0, side: "py", ll: [[-58.52, -27.06], [-58.57, -27.24], [-58.7, -27.36], [-58.83, -27.47]] },
      { phase: 0, side: "py", ll: [[-55.87, -27.33], [-55.95, -28.0], [-56.0, -28.62]], then: uruguaiBetween(-28.66, -29.72), label: "Coluna ao Rio Grande do Sul", off: [-12, 22, "end"], labelAt: 0 },
      { phase: 1, side: "py", ll: [[-58.83, -27.47], [-58.72, -27.36], [-58.6, -27.28]], label: "Retirada (fim de 1865)", off: [-14, -12, "end"] },
      { phase: 2, side: "al", ll: [[-58.83, -27.47], [-58.66, -27.35], [-58.53, -27.30], [-58.47, -27.26], [-58.42, -27.24]], label: "Invasão aliada", off: [10, 26, "start"] },
      { phase: 2, side: "al", ll: [[-58.42, -27.24], [-58.36, -27.16], [-58.40, -27.08], [-58.52, -27.06]] },
      { phase: 3, side: "al", pts: paraguaiBetween(-27.06, -25.55), then: [P(-57.53, -25.50), P(-57.64, -25.28)], label: "Avanço para o norte", off: [16, 0, "start"] },
      { phase: 4, side: "al", ll: [[-57.64, -25.28], [-57.35, -25.42], [-57.04, -25.47], [-56.7, -25.0], [-56.3, -24.0], [-56.1, -23.3], [-56.02, -22.65]], label: "Perseguição final", off: [16, 0, "start"] }
    ];
  }
  function buildTheater(mount, places) {
    var mv = new MapView(mount, { detail: true, grid: 1, pad: .04 });
    mount.parentNode.classList.add("map-dark");
    var phases = [];
    for (var i = 0; i < 5; i++) {
      phases.push({ base: GP.svg("g", { "class": "m-phase", "data-phase": i }, mv.extra), over: [] });
    }
    // Zona fortificada de Humaitá
    var zc = P(-58.5, -27.12);
    var z = GP.svg("ellipse", { cx: zc[0], cy: zc[1], rx: 16, ry: 13, "class": "m-zone" }, phases[2].base);
    z.setAttribute("transform", "rotate(-20 " + zc[0] + " " + zc[1] + ")");
    // Nomes fixos
    var labels = [["Paraguai", -57.2, -23.7], ["Argentina", -61.2, -29.2], ["Brasil", -53.6, -21.5], ["Bolívia", -61.4, -18.6], ["Uruguai", -56.0, -31.4]];
    labels.forEach(function (c) { text(mv.anchor(c[1], c[2], "m-static").g, c[0], { "class": "m-country-name", "text-anchor": "middle" }); });
    [["Rio Paraguai", -58.45, -21.6, -80], ["Rio Paraná", -55.6, -26.9, -40], ["Rio Uruguai", -55.0, -28.15, 32], ["Pilcomayo", -60.0, -23.9, 27]].forEach(function (r) {
      text(mv.anchor(r[1], r[2], "m-static").g, r[0], { "class": "m-river-name", "text-anchor": "middle", transform: "rotate(" + r[3] + ")" });
    });
    // Rotas
    routes().forEach(function (r) {
      var pts = r.pts ? r.pts.slice() : r.ll.map(function (c) { return P(c[0], c[1]); });
      if (r.then) pts = pts.concat(r.then);
      if (pts.length < 2) return;
      var g = phases[r.phase].base;
      GP.svg("path", { d: toD(pts), "class": "m-arrow-glow m-draw " + r.side, pathLength: 1 }, g);
      GP.svg("path", { d: toD(pts), "class": "m-arrow m-draw " + r.side, pathLength: 1 }, g);
      // ponta da seta na camada em pixels
      var tip = mv.anchorXY(pts[pts.length - 1], "m-phase m-tip");
      tip.prev = pts[Math.max(0, pts.length - 4)];
      GP.svg("path", { d: "M0 0L-13 -6L-10 0L-13 6Z", "class": "m-arrow-head " + r.side }, tip.g);
      tip.g.setAttribute("data-phase", r.phase);
      phases[r.phase].over.push(tip);
      if (r.label) {
        var la = mv.anchorXY(pts[r.labelAt !== undefined ? r.labelAt : Math.floor(pts.length / 2)], "m-phase m-route-tag");
        la.g.setAttribute("data-phase", r.phase);
        text(la.g, r.label, { "class": "m-route-text " + r.side, x: r.off[0], y: r.off[1], "text-anchor": r.off[2] });
        phases[r.phase].over.push(la);
      }
    });
    // Marcadores
    var offsets = {
      "Forte de Coimbra": [16, 4, "start"], "Corrientes": [-16, -6, "end"], "São Borja": [-16, 4, "end"],
      "Riachuelo": [-16, 14, "end"], "Yataí": [-16, 4, "end"], "Uruguaiana": [16, 10, "start"],
      "Passo da Pátria": [-22, 30, "end"], "Tuiuti": [22, 18, "start"], "Curupaiti": [-22, -2, "end"], "Humaitá": [22, -14, "start"],
      "Itororó · Avaí · Lomas Valentinas": [-18, 18, "end"], "Assunção": [-16, -10, "end"],
      "Piribebuy · Acosta Ñu": [16, 16, "start"], "Cerro Corá": [16, 4, "start"]
    };
    var markers = [];
    places.forEach(function (li) {
      var d = li.dataset, ph = Number(d.phase);
      var a = mv.anchor(Number(d.lon), Number(d.lat), "m-phase m-marker " + d.kind);
      a.g.setAttribute("data-phase", ph);
      a.g.setAttribute("tabindex", "0");
      a.g.setAttribute("role", "button");
      a.g.setAttribute("aria-label", d.name + ", " + d.date);
      var off = offsets[d.name] || [16, 4, "start"];
      if (Math.abs(off[1]) > 8 || Math.abs(off[0]) > 18) GP.svg("line", { x1: 0, y1: 0, x2: off[0] * .8, y2: off[1] - 4, "class": "m-leader" }, a.g);
      GP.svg("circle", { r: 16, "class": "mk-hit" }, a.g);
      GP.svg("circle", { r: 7, "class": "mk-pulse" }, a.g);
      if (d.kind === "capital") GP.svg("rect", { x: -6, y: -6, width: 12, height: 12, "class": "mk-core", transform: "rotate(45)" }, a.g);
      else GP.svg("circle", { r: d.kind === "city" ? 5 : 6, "class": "mk-core" }, a.g);
      text(a.g, d.name, { "class": "m-marker-label", x: off[0], y: off[1], "text-anchor": off[2] });
      text(a.g, d.date, { "class": "m-marker-date", x: off[0], y: off[1] + 14, "text-anchor": off[2] });
      a.data = { name: d.name, date: d.date, text: li.textContent.trim(), phase: ph };
      phases[ph].over.push(a);
      markers.push(a);
    });
    mv.onSet = function () {
      // orienta as pontas das setas
      mv.anchors.forEach(function (a) {
        if (!a.prev) return;
        var q = mv.toScreen(a.p), r = mv.toScreen(a.prev);
        var ang = Math.atan2(q[1] - r[1], q[0] - r[0]) * 180 / Math.PI;
        a.g.firstChild && a.g.firstChild.setAttribute("transform", "rotate(" + ang.toFixed(1) + ")");
      });
    };
    mv.phases = phases;
    mv.markers = markers;
    mv.camera(PHASE_CAMS[0]);
    return mv;
  }

  /* Controle do slide do mapa */
  function Campaign(slide) {
    this.slide = slide;
    var mount = slide.querySelector(".map-mount");
    var places = Array.prototype.slice.call(slide.querySelectorAll(".campaign-places li"));
    this.mv = buildTheater(mount, places);
    this.pop = slide.querySelector("#mapPop");
    this.tabs = Array.prototype.slice.call(slide.querySelectorAll(".phase-tabs button"));
    this.cards = Array.prototype.slice.call(slide.querySelectorAll(".phase"));
    this.phase = -1;
    var self = this;
    this.mv.markers.forEach(function (m) {
      var open = function (e) { e.stopPropagation(); self.open(m); };
      m.g.addEventListener("click", open);
      m.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
    });
    this.pop.querySelector(".map-pop-close").addEventListener("click", function () { self.close(); });
    mount.addEventListener("click", function () { self.close(); });
    slide.addEventListener("gp:step", function (e) { self.setPhase(e.detail.step, e.detail.animate); });
    slide.addEventListener("gp:leave", function () { self.close(); });
  }
  Campaign.prototype.setPhase = function (n, animate) {
    var mv = this.mv;
    this.close();
    mv.phases.forEach(function (ph, i) {
      var state = i < n ? "is-past" : i === n ? "is-now" : "";
      ph.base.setAttribute("class", "m-phase " + state);
      ph.over.forEach(function (a) {
        a.g.classList.remove("is-past", "is-now");
        if (state) a.g.classList.add(state);
      });
    });
    this.tabs.forEach(function (t, i) {
      t.setAttribute("aria-selected", i === n ? "true" : "false");
      t.classList.toggle("is-past", i < n);
    });
    this.cards.forEach(function (c, i) { c.classList.toggle("is-now", i === n); });
    mv.camera(PHASE_CAMS[n], animate !== false && this.phase !== -1);
    this.phase = n;
  };
  Campaign.prototype.open = function (m) {
    var host = this.slide.querySelector(".campaign-map");
    var pop = this.pop, box = { width: host.clientWidth, height: host.clientHeight };
    pop.querySelector(".map-pop-date").textContent = m.data.date;
    pop.querySelector("h4").textContent = m.data.name;
    pop.querySelector(".map-pop-text").textContent = m.data.text;
    pop.hidden = false;
    var q = this.mv.toScreen(m.p);
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var x = q[0] + 20, y = q[1] - ph / 2;
    if (x + pw > box.width - 10) x = q[0] - pw - 20;
    y = Math.max(10, Math.min(box.height - ph - 10, y));
    pop.style.left = x + "px";
    pop.style.top = y + "px";
    this.mv.markers.forEach(function (o) { o.g.classList.toggle("is-open", o === m); });
  };
  Campaign.prototype.close = function () {
    this.pop.hidden = true;
    this.mv.markers.forEach(function (o) { o.g.classList.remove("is-open"); });
  };

  /* ---------- Slide 4: contornos dos países ---------- */
  function shape(el) {
    var d = window.GP_GEO.countries[el.dataset.shape];
    if (!d) return;
    var nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var i = 0; i < nums.length; i += 2) {
      minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
      minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
    }
    var pad = (maxX - minX) * .06;
    var svg = GP.svg("svg", { viewBox: [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].join(" "), preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true" }, el);
    GP.svg("path", { d: d }, svg);
  }

  GP.initMaps = function (deck) {
    var prata = deck.querySelector('[data-map="prata"]');
    if (prata) GP.prataMap = buildPrata(prata);
    var mapSlide = deck.querySelector(".slide-map");
    if (mapSlide) GP.campaign = new Campaign(mapSlide);
    deck.querySelectorAll("[data-shape]").forEach(shape);
  };
})();
