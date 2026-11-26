/* Mapas vivos: Bacia do Prata, cenas do início do conflito e da Tríplice Aliança,
   teatro das campanhas, localizador das batalhas e contornos dos países. */
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
    VIEWS.push(this);
  }
  // Depois de cada troca de slide (o título nos botões muda de largura), os nomes do mapa visível se reajustam.
  var VIEWS = [];
  document.addEventListener("gp:change", function () {
    requestAnimationFrame(function () {
      VIEWS.forEach(function (v) { if (!v.moving && v.mount.closest(".slide.is-current")) v.fitLabels(); });
    });
  });
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
    this.set(this.fit(this.cam), true);
  };
  MapView.prototype.camera = function (bb, animate, duration) {
    this.cam = bb;
    var to = this.fit(bb), from = this.vb, self = this;
    cancelAnimationFrame(this.raf);
    this.moving = false;
    if (!animate || !from || GP.reduced()) return this.set(to, true);
    var t0 = performance.now(), dur = duration || 1500;
    this.moving = true;
    var step = function (now) {
      var t = Math.min(1, (now - t0) / dur), e = ease(t);
      if (t >= 1) self.moving = false;
      self.set({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e }, t >= 1);
      if (t < 1) self.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  };
  MapView.prototype.set = function (vb, final) {
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
    if (final) this.fitLabels();
  };
  // Rótulos sempre inteiros e sem encostar uns nos outros.
  // 1) Pontos (cidades, batalhas, povos): cada nome procura a primeira posição inteira e livre —
  //    lado original, lado oposto, acima, abaixo, nas diagonais e, por fim, com pequenos deslocamentos;
  //    se nenhuma couber, entra para dentro da borda.
  // 2) Contexto, por prioridade (países, rios, regiões, mares, rotas): some se ficaria cortado na borda,
  //    sob a máscara lateral ou a legenda (--safe-l, --safe-r, --safe-b), ou em cima de outro nome.
  // Nenhum nome fica embaixo das caixas sobre o mapa (nota, carimbo de datas, legenda) nem dos botões
  // fixos da apresentação; se o próprio ponto estiver coberto, o nome dele também sai.
  // Textos inclinados (rios) são tratados pela forma real, não pela caixa retangular.
  function polyOf(t, q) {
    var bb;
    try { bb = t.getBBox(); } catch (e) { return null; }
    if (!bb || (!bb.width && !bb.height)) return null;
    var m = /rotate\(\s*(-?[\d.]+)/.exec(t.getAttribute("transform") || ""), a = m ? Number(m[1]) * Math.PI / 180 : 0;
    var c = Math.cos(a), s = Math.sin(a);
    return [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x + bb.width, bb.y + bb.height], [bb.x, bb.y + bb.height]].map(function (p) {
      return [q[0] + p[0] * c - p[1] * s, q[1] + p[0] * s + p[1] * c];
    });
  }
  function polysHit(A, B, gap) {
    var axes = [A, B];
    for (var i = 0; i < 2; i++) {
      var P = axes[i];
      for (var j = 0; j < P.length; j++) {
        var p1 = P[j], p2 = P[(j + 1) % P.length], nx = p2[1] - p1[1], ny = p1[0] - p2[0], len = Math.sqrt(nx * nx + ny * ny) || 1;
        nx /= len; ny /= len;
        var a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
        A.forEach(function (p) { var d = p[0] * nx + p[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); });
        B.forEach(function (p) { var d = p[0] * nx + p[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); });
        if (a1 + gap < b0 || b1 + gap < a0) return false;
      }
    }
    return true;
  }
  var LABEL_RANK = ["m-country-name", "m-river-name", "m-region-name", "m-sea-name", "m-route-label", "m-route-text"];
  // Caixas de HTML por cima do mapa (nota, carimbo de datas, legenda): nenhum nome fica embaixo delas.
  // Medidas pela posição de layout, sem as transformações das animações de entrada.
  var COVER_SEL = ".map-note, .phase-stamp, figcaption, [data-map-cover]";
  MapView.prototype.covers = function (s) {
    var mount = this.mount, host = mount.parentNode, out = [], mr = null;
    if (!host) return out;
    Array.prototype.forEach.call(host.children, function (el) {
      if (el === mount || el.hidden || !el.matches(COVER_SEL)) return;
      var st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") return;
      var l, t, w, h;
      if (el.offsetParent && el.offsetParent === mount.offsetParent) {
        l = el.offsetLeft - mount.offsetLeft; t = el.offsetTop - mount.offsetTop; w = el.offsetWidth; h = el.offsetHeight;
      } else {
        mr = mr || mount.getBoundingClientRect();
        var r = el.getBoundingClientRect(), kx = mr.width / s.w || 1, ky = mr.height / s.h || 1;
        l = (r.left - mr.left) / kx; t = (r.top - mr.top) / ky; w = r.width / kx; h = r.height / ky;
      }
      if (w < 1 || h < 1 || l + w <= 0 || t + h <= 0 || l >= s.w || t >= s.h) return;
      out.push([[l - 3, t - 3], [l + w + 3, t - 3], [l + w + 3, t + h + 3], [l - 3, t + h + 3]]);
    });
    return out;
  };
  // Botões fixos sobre o palco 16:9 (controles no canto, barra do topo): os nomes também desviam deles.
  // A posição do mapa no palco vem do layout, sem as transformações das transições de slide.
  var UI_SEL = "#controls, .topbar-actions, .topbar .brand";
  MapView.prototype.uiCovers = function (s) {
    var deck = document.getElementById("deck"), out = [], x = 0, y = 0, e = this.mount;
    if (!deck) return out;
    while (e && e !== deck) {
      // conteúdo que rola entre as barras (celular em pé): os botões não ficam parados sobre o mapa
      if (/(auto|scroll)/.test(getComputedStyle(e).overflowY)) return out;
      x += e.offsetLeft; y += e.offsetTop;
      e = e.offsetParent;
    }
    if (e !== deck) return out;
    var dr = deck.getBoundingClientRect();
    x += dr.left + deck.clientLeft; y += dr.top + deck.clientTop;
    Array.prototype.forEach.call(document.querySelectorAll(UI_SEL), function (el) {
      var st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden" || el.offsetWidth < 1) return;
      var r = el.getBoundingClientRect(), l = r.left - x, t = r.top - y, R = r.right - x, B = r.bottom - y;
      if (R <= 0 || B <= 0 || l >= s.w || t >= s.h) return;
      out.push([[l - 6, t - 6], [R + 6, t - 6], [R + 6, B + 6], [l - 6, B + 6]]);
    });
    return out;
  };
  MapView.prototype.fitLabels = function () {
    var s = this.size();
    if (!this.toScreen || s.w < 2 || s.h < 2) return;
    var cs = getComputedStyle(this.mount);
    var num = function (k) { return parseFloat(cs.getPropertyValue(k)) || 0; };
    var box = { l: s.w * num("--safe-l"), r: s.w * (1 - num("--safe-r")), t: 0, b: s.h * (1 - num("--safe-b")) };
    var self = this, placed = [], covers = this.covers(s).concat(this.uiCovers(s));
    var polys = function (a, texts) {
      var q = self.toScreen(a.p), out = [];
      texts.forEach(function (t) { var P = polyOf(t, q); if (P) out.push(P); });
      return out;
    };
    var inBox = function (ps) { return ps.every(function (P) { return P.every(function (p) { return p[0] >= box.l && p[0] <= box.r && p[1] >= box.t && p[1] <= box.b; }); }); };
    var uncovered = function (ps) { return ps.every(function (P) { return !covers.some(function (Q) { return polysHit(P, Q, 0); }); }); };
    var inside = function (ps) { return inBox(ps) && uncovered(ps); };
    // ponto escondido sob uma caixa: o nome também sai, para não apontar para o nada
    var pointCovered = function (a) {
      var q = self.toScreen(a.p);
      return covers.some(function (Q) { return q[0] > Q[0][0] + 3 && q[0] < Q[1][0] - 3 && q[1] > Q[0][1] + 3 && q[1] < Q[2][1] - 3; });
    };
    var free = function (ps) { return ps.every(function (P) { return !placed.some(function (Q) { return polysHit(P, Q, 2); }); }); };
    // visível agora ou no fim da transição (pelas classes, sem interromper animações)
    var shown = function (g) {
      var c = g.classList;
      if (c.contains("m-modern")) return false;
      if (c.contains("sc-item") || c.contains("m-phase")) return c.contains("is-now") || (c.contains("is-past") && !c.contains("m-route-tag"));
      return true;
    };
    var points = [], context = [];
    this.anchors.forEach(function (a) {
      var texts = Array.prototype.slice.call(a.g.querySelectorAll("text"));
      if (!texts.length) return;
      a.texts = texts;
      if (a.g.classList.contains("m-marker") || a.g.classList.contains("m-povo") || a.g.querySelector("circle, rect")) points.push(a);
      else context.push(a);
    });
    // 1) pontos: encaixe em rodadas — na primeira, cada nome pega a primeira posição inteira e livre;
    //    nas seguintes, quem ainda encosta em alguém tenta de novo, agora vendo todos os outros
    //    posições: os 8 lados do ponto e, se nenhum servir, os mesmos lados com pequenos deslocamentos
    var MODES = ["orig", "mirror", "above", "below", "upRight", "upLeft", "downRight", "downLeft"];
    var CANDS = MODES.map(function (m) { return [m, 0, 0]; });
    [-10, 10, -20, 20].forEach(function (d) { ["orig", "mirror"].forEach(function (m) { CANDS.push([m, 0, d]); }); });
    [-16, 16, -32, 32].forEach(function (d) { ["above", "below"].forEach(function (m) { CANDS.push([m, d, 0]); }); });
    var entries = points.map(function (a) {
      a.texts.forEach(function (t) {
        if (!t.dataset.ax) { t.dataset.ax = t.getAttribute("x") || "0"; t.dataset.ay = t.getAttribute("y") || "0"; t.dataset.an = t.getAttribute("text-anchor") || "start"; }
        t.classList.remove("m-clipped");
      });
      return { a: a, vis: shown(a.g), mode: null, dx: 0, dy: 0, ps: [], hidden: false };
    });
    var apply = function (e, mode, dx, dy) {
      var texts = e.a.texts;
      texts.forEach(function (t, i) {
        var x = Number(t.dataset.ax), y = Number(t.dataset.ay), an = t.dataset.an;
        if (mode === "mirror" && an !== "middle") { x = -x; an = an === "start" ? "end" : "start"; }
        else if (mode === "above") { an = "middle"; x = 0; y = -14 - (texts.length - 1 - i) * 14; }
        else if (mode === "below") { an = "middle"; x = 0; y = 24 + i * 14; }
        else if (mode === "upRight" || mode === "upLeft") { an = mode === "upRight" ? "start" : "end"; x = mode === "upRight" ? 12 : -12; y = -8 - (texts.length - 1 - i) * 14; }
        else if (mode === "downRight" || mode === "downLeft") { an = mode === "downRight" ? "start" : "end"; x = mode === "downRight" ? 12 : -12; y = 18 + i * 14; }
        t.setAttribute("x", String(x + (dx || 0)));
        t.setAttribute("y", String(y + (dy || 0)));
        t.setAttribute("text-anchor", an);
      });
      return polys(e.a, texts);
    };
    var clear = function (ps, obstacles) { return ps.every(function (P) { return !obstacles.some(function (Q) { return polysHit(P, Q, 2); }); }); };
    for (var round = 0; round < 4; round++) {
      var changed = false;
      entries.forEach(function (e) {
        var obstacles = [];
        entries.forEach(function (o) { if (o !== e && o.vis && !o.hidden) Array.prototype.push.apply(obstacles, o.ps); });
        if (round > 0 && e.mode && clear(e.ps, obstacles)) return;
        var chosen = null, firstInside = null;
        for (var i = 0; i < CANDS.length; i++) {
          var c = CANDS[i], ps = apply(e, c[0], c[1], c[2]);
          if (!ps.length) return;
          if (inside(ps)) {
            if (!firstInside) firstInside = c;
            if (clear(ps, obstacles)) { chosen = c; break; }
          }
        }
        var pick = chosen || (round === 0 || !e.mode ? firstInside : [e.mode, e.dx, e.dy]);
        var mode = pick ? pick[0] : null, dx = pick ? pick[1] : 0, dy = pick ? pick[2] : 0;
        if (!mode) {
          var b0 = apply(e, "orig"), xs = [], ys = [];
          b0.forEach(function (P) { P.forEach(function (q) { xs.push(q[0]); ys.push(q[1]); }); });
          dx = Math.max(box.l - Math.min.apply(null, xs), 0) - Math.max(Math.max.apply(null, xs) - box.r, 0);
          dy = Math.max(box.t - Math.min.apply(null, ys), 0) - Math.max(Math.max.apply(null, ys) - box.b, 0);
          mode = "orig";
        }
        if (mode !== e.mode || dx !== e.dx || dy !== e.dy) changed = true;
        e.mode = mode; e.dx = dx; e.dy = dy;
        e.ps = apply(e, mode, dx, dy);
        e.hidden = !inside(e.ps) || pointCovered(e.a);
      });
      if (!changed) break;
    }
    entries.forEach(function (e) {
      e.a.texts.forEach(function (t) { t.classList.toggle("m-clipped", e.hidden); });
      if (!e.hidden && e.vis) Array.prototype.push.apply(placed, e.ps);
    });
    // 2) contexto, por prioridade
    var rank = function (a) {
      for (var i = 0; i < LABEL_RANK.length; i++) if (a.g.querySelector("." + LABEL_RANK[i])) return i;
      return LABEL_RANK.length;
    };
    context.map(function (a, i) { return { a: a, k: rank(a) * 1000 + i }; }).sort(function (x, y) { return x.k - y.k; }).forEach(function (o) {
      var a = o.a;
      a.g.classList.remove("m-clipped");
      var ps = polys(a, a.texts);
      if (!ps.length) return;
      if (!inside(ps) || (shown(a.g) && !free(ps))) { a.g.classList.add("m-clipped"); return; }
      if (shown(a.g)) Array.prototype.push.apply(placed, ps);
    });
  };

  /* Texto e marcadores na camada em pixels */
  function text(parent, str, attrs) {
    var t = GP.svg("text", attrs, parent);
    t.textContent = str;
    return t;
  }

  /* ---------- Contexto: Bacia do Prata (papel) ---------- */
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
    [["Brasil", -50.5, -19.5], ["Argentina", -62.6, -30.4], ["Paraguai", -60.5, -22.7], ["Uruguai", -55.4, -33.2], ["Bolívia", -63.5, -17.4]].forEach(function (c, i) {
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
    var PRATA = [-66.5, -14.4, -45.5, -38.8];
    mv.camera(PRATA);
    // aproximação: do continente para a Bacia do Prata a cada entrada no slide
    var slide = mount.closest(".slide");
    if (slide) slide.addEventListener("gp:enter", function () {
      if (GP.reduced()) return mv.camera(PRATA);
      mv.camera([-84, 8, -32, -56]);
      setTimeout(function () { mv.camera(PRATA, true, 2200); }, 60);
    });
    return mv;
  }

  /* ---------- Mapa das campanhas: fases ---------- */
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
      { phase: 0, side: "py", ll: [[-55.87, -27.33], [-55.95, -28.0], [-56.0, -28.62]], then: uruguaiBetween(-28.66, -29.72), label: "Coluna ao Rio Grande do Sul", off: [14, 18, "start"], labelAt: -1 },
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
    // Regiões atingidas pela ofensiva paraguaia (limites atuais, só como referência)
    ["matoGrossoDoSul", "corrientes", "rioGrandeDoSul"].forEach(function (k) {
      GP.svg("path", { d: window.GP_GEO.regions[k], "class": "m-region rg-war" }, phases[0].base);
    });
    [["Sul de Mato Grosso", -54.6, -20.6, 0], ["Corrientes", -58.7, -29.3, 0], ["Rio Grande do Sul", -53.4, -30.7, 0], ["Sistema fortificado de Humaitá", -58.15, -26.95, 2], ["Região da Cordilheira", -56.75, -25.75, 4], ["Chaco", -60.2, -24.8, 3]].forEach(function (r) {
      var a = mv.anchor(r[1], r[2], "m-phase m-region-tag");
      a.g.setAttribute("data-phase", r[3]);
      text(a.g, r[0], { "class": "m-region-name", "text-anchor": "middle" });
      phases[r[3]].over.push(a);
    });
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
        var la = mv.anchorXY(pts[r.labelAt === -1 ? pts.length - 1 : r.labelAt !== undefined ? r.labelAt : Math.floor(pts.length / 2)], "m-phase m-route-tag");
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
    this.slide.querySelectorAll(".map-legend [data-from]").forEach(function (li) {
      li.classList.toggle("is-on", Number(li.dataset.from) <= n);
    });
    this.stamp(n, animate !== false && this.phase !== -1);
    mv.camera(PHASE_CAMS[n], animate !== false && this.phase !== -1);
    this.phase = n;
  };
  // Carimbo de datas da fase, com contagem dos anos
  Campaign.prototype.stamp = function (n, animate) {
    var el = this.slide.querySelector(".phase-stamp");
    if (!el) return;
    var card = this.cards[n];
    var years = (card.dataset.years || "").split("-").map(Number);
    var a = el.querySelector(".ps-a"), b = el.querySelector(".ps-b"), lab = el.querySelector(".ps-label");
    lab.textContent = card.querySelector("h3").textContent;
    el.classList.toggle("single", years[0] === years[1]);
    var fromA = Number(a.textContent) || years[0], fromB = Number(b.textContent) || years[1];
    cancelAnimationFrame(this.stampRaf);
    el.classList.remove("is-swap"); void el.offsetWidth; el.classList.add("is-swap");
    if (!animate || GP.reduced()) { a.textContent = years[0]; b.textContent = years[1]; return; }
    var t0 = performance.now(), self = this;
    var tick = function (now) {
      var t = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - t, 3);
      a.textContent = Math.round(fromA + (years[0] - fromA) * e);
      b.textContent = Math.round(fromB + (years[1] - fromB) * e);
      if (t < 1) self.stampRaf = requestAnimationFrame(tick);
    };
    this.stampRaf = requestAnimationFrame(tick);
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

  /* ---------- Cenas em etapas (início do conflito, Tríplice Aliança) ---------- */
  function regionPath(key, useDetail) {
    var G = window.GP_GEO;
    return (G.regions && G.regions[key]) || (useDetail && G.detail && G.detail[key]) || G.countries[key];
  }
  function Scene(mount, opts) {
    this.opts = opts;
    this.mv = new MapView(mount, { detail: !!opts.detail, grid: opts.grid || 5, pad: opts.pad || .03, drawRivers: false });
    mount.parentNode.classList.add(opts.style === "paper" ? "map-paper" : "map-dark", "scene-map");
    this.items = [];
    this.markers = [];
    this.layer = GP.svg("g", { "class": "sc-layer" }, this.mv.extra);
    this.step = -1;
  }
  Scene.prototype.track = function (el, from, persist) {
    el.classList.add("sc-item");
    this.items.push({ el: el, from: from, persist: !!persist });
    return el;
  };
  Scene.prototype.region = function (key, from, cls, persist) {
    return this.track(GP.svg("path", { d: regionPath(key, this.opts.detail), "class": "m-region " + cls }, this.layer), from, persist);
  };
  Scene.prototype.arrow = function (pts, from, side, label) {
    var g = this.track(GP.svg("g", null, this.layer), from);
    GP.svg("path", { d: toD(pts), "class": "m-arrow-glow sc-draw " + side, pathLength: 1 }, g);
    GP.svg("path", { d: toD(pts), "class": "m-arrow sc-draw " + side, pathLength: 1 }, g);
    var tip = this.mv.anchorXY(pts[pts.length - 1], "sc-tip");
    tip.prev = pts[Math.max(0, pts.length - 4)];
    GP.svg("path", { d: "M0 0L-13 -6L-10 0L-13 6Z", "class": "m-arrow-head " + side }, tip.g);
    this.track(tip.g, from);
    if (label) {
      var la = this.mv.anchorXY(pts[label.at !== undefined ? label.at : Math.floor(pts.length / 2)], "sc-tag");
      text(la.g, label.text, { "class": "m-route-text " + side, x: label.off[0], y: label.off[1], "text-anchor": label.off[2] });
      this.track(la.g, from);
    }
    var mv = this.mv;
    mv.onSet = function () {
      mv.anchors.forEach(function (a) {
        if (!a.prev) return;
        var q = mv.toScreen(a.p), r = mv.toScreen(a.prev);
        a.g.firstChild && a.g.firstChild.setAttribute("transform", "rotate(" + (Math.atan2(q[1] - r[1], q[0] - r[0]) * 180 / Math.PI).toFixed(1) + ")");
      });
    };
  };
  Scene.prototype.riverGlow = function (pts, from) {
    var g = this.track(GP.svg("g", null, this.layer), from, true);
    GP.svg("path", { d: toD(pts), "class": "m-river-glow sc-draw", pathLength: 1 }, g);
  };
  Scene.prototype.label = function (lon, lat, str, from, cls, persist, rotate) {
    var a = this.mv.anchor(lon, lat, "sc-label");
    var attrs = { "class": cls || "m-region-name", "text-anchor": "middle" };
    if (rotate) attrs.transform = "rotate(" + rotate + ")";
    text(a.g, str, attrs);
    this.track(a.g, from, persist);
    return a;
  };
  Scene.prototype.fixed = function (lon, lat, str, cls, rotate) {
    var a = this.mv.anchor(lon, lat, "m-static");
    var attrs = { "class": cls, "text-anchor": "middle" };
    if (rotate) attrs.transform = "rotate(" + rotate + ")";
    text(a.g, str, attrs);
  };
  Scene.prototype.marker = function (m, from, persist) {
    var a = addMarker(this.mv, m);
    a.g.classList.add("sc-marker");
    this.track(a.g, from, persist);
    this.markers.push(a);
    return a;
  };
  Scene.prototype.set = function (step, animate) {
    this.items.forEach(function (it) {
      var c = it.el.classList;
      c.toggle("is-now", step === it.from || (it.persist && step > it.from));
      c.toggle("is-past", step > it.from && !it.persist);
    });
    var cams = this.opts.cams;
    var cam = cams[Math.min(step, cams.length - 1)];
    this.mv.camera(cam, animate !== false && this.step !== -1);
    this.step = step;
  };

  // marcador reutilizável (camada em pixels)
  function addMarker(mv, m) {
    var a = mv.anchor(m.lon, m.lat, "m-marker " + (m.kind || "battle"));
    a.g.setAttribute("tabindex", "0");
    a.g.setAttribute("role", "button");
    a.g.setAttribute("aria-label", m.name + ", " + m.date);
    var off = m.off || [16, 4, "start"];
    if (Math.abs(off[1]) > 8 || Math.abs(off[0]) > 18) GP.svg("line", { x1: 0, y1: 0, x2: off[0] * .8, y2: off[1] - 4, "class": "m-leader" }, a.g);
    GP.svg("circle", { r: 16, "class": "mk-hit" }, a.g);
    GP.svg("circle", { r: 7, "class": "mk-pulse" }, a.g);
    if (m.kind === "capital") GP.svg("rect", { x: -6, y: -6, width: 12, height: 12, "class": "mk-core", transform: "rotate(45)" }, a.g);
    else GP.svg("circle", { r: m.kind === "city" ? 5 : 6, "class": "mk-core" }, a.g);
    text(a.g, m.name, { "class": "m-marker-label", x: off[0], y: off[1], "text-anchor": off[2] });
    if (m.date) text(a.g, m.date, { "class": "m-marker-date", x: off[0], y: off[1] + 14, "text-anchor": off[2] });
    a.data = { name: m.name, date: m.date || "", text: m.info || "" };
    return a;
  }

  // ficha de marcador (popover) genérica
  function Pop(slide, host, mv, markers) {
    this.slide = slide; this.host = host; this.mv = mv;
    this.el = slide.querySelector(".map-pop");
    var self = this;
    markers.forEach(function (m) {
      var open = function (e) { e.stopPropagation(); self.open(m, markers); };
      m.g.addEventListener("click", open);
      m.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
    });
    this.el.querySelector(".map-pop-close").addEventListener("click", function () { self.close(markers); });
    host.addEventListener("click", function () { self.close(markers); });
    slide.addEventListener("gp:leave", function () { self.close(markers); });
    slide.addEventListener("gp:step", function () { self.close(markers); });
  }
  Pop.prototype.open = function (m, markers) {
    var pop = this.el, box = { width: this.host.clientWidth, height: this.host.clientHeight };
    pop.querySelector(".map-pop-date").textContent = m.data.date;
    pop.querySelector("h4").textContent = m.data.name;
    pop.querySelector(".map-pop-text").textContent = m.data.text;
    pop.hidden = false;
    var q = this.mv.toScreen(m.p);
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var x = q[0] + 20, y = q[1] - ph / 2;
    if (x + pw > box.width - 10) x = q[0] - pw - 20;
    x = Math.max(10, x);
    y = Math.max(10, Math.min(box.height - ph - 10, y));
    pop.style.left = x + "px";
    pop.style.top = y + "px";
    markers.forEach(function (o) { o.g.classList.toggle("is-open", o === m); });
  };
  Pop.prototype.close = function (markers) {
    this.el.hidden = true;
    markers.forEach(function (o) { o.g.classList.remove("is-open"); });
  };

  /* Cena: início do conflito (1864–1865) */
  function buildInicio(slide) {
    var mount = slide.querySelector(".map-mount");
    var sc = new Scene(mount, {
      style: "dark", detail: true, grid: 2, pad: .05,
      cams: [[-62.5, -19, -51.5, -35.5], [-59.6, -29.8, -52.8, -35.3], [-60.4, -21.6, -54.6, -27.6], [-61.2, -17.4, -53.6, -26.2], [-61.9, -25.4, -55.9, -30.4]]
    });
    ["Paraguai|-57.2|-23.4", "Argentina|-61.2|-29.6", "Brasil|-52.8|-21.0", "Uruguai|-55.9|-32.9", "Bolívia|-61.2|-18.6"].forEach(function (c) {
      var p = c.split("|");
      sc.fixed(Number(p[1]), Number(p[2]), p[0], "m-country-name");
    });
    sc.fixed(-58.45, -21.6, "Rio Paraguai", "m-river-name", -80);
    // 0 · protesto paraguaio
    sc.region("URY", 0, "rg-crisis", true);
    sc.region("PRY", 0, "rg-py", true);
    sc.marker({ lon: -56.19, lat: -34.9, kind: "capital", name: "Montevidéu", date: "1864", off: [16, 4, "start"], info: "Sede do governo blanco de Atanasio Aguirre, pressionado por um ultimato do Império do Brasil em agosto de 1864." }, 0);
    sc.marker({ lon: -57.64, lat: -25.28, kind: "capital", name: "Assunção", date: "30 ago. 1864", off: [-16, -8, "end"], info: "O governo paraguaio protesta: a ocupação do território uruguaio seria vista como atentado ao equilíbrio do Prata." }, 0);
    // 1 · intervenção no Uruguai
    sc.marker({ lon: -58.08, lat: -32.32, kind: "battle", name: "Paysandu", date: "dez. 1864 – jan. 1865", off: [-16, 4, "end"], info: "Cercada por tropas brasileiras e colorados de Venancio Flores, a cidade cai em janeiro de 1865." }, 1);
    sc.label(-55.6, -33.6, "Intervenção brasileira", 1, "m-region-name");
    // 2 · Marquês de Olinda
    sc.riverGlow(paraguaiBetween(-25.28, -22.4), 2);
    sc.label(-56.4, -23.9, "Apreensão do Marquês de Olinda", 2, "m-region-name");
    // 3 · Mato Grosso
    sc.region("matoGrossoDoSul", 3, "rg-war");
    sc.arrow(paraguaiBetween(-25.28, -19.0), 3, "py", { text: "Ofensiva paraguaia", off: [16, 0, "start"] });
    sc.marker({ lon: -57.79, lat: -19.92, kind: "battle", name: "Forte de Coimbra", date: "dez. 1864", off: [16, 4, "start"], info: "Atacado no fim de dezembro de 1864: início da invasão do sul da província de Mato Grosso." }, 3);
    sc.label(-54.6, -20.6, "Sul de Mato Grosso", 3, "m-region-name");
    // 4 · Corrientes
    sc.region("corrientes", 4, "rg-war");
    sc.arrow([P(-58.52, -27.06), P(-58.57, -27.24), P(-58.7, -27.36), P(-58.83, -27.47)], 4, "py", null);
    sc.marker({ lon: -58.83, lat: -27.47, kind: "city", name: "Corrientes", date: "abr. 1865", off: [-16, -6, "end"], info: "Depois que a Argentina negou passagem às tropas paraguaias, o Paraguai ataca Corrientes. A agressão leva à Tríplice Aliança." }, 4);
    sc.label(-57.9, -28.9, "Província de Corrientes", 4, "m-region-name");
    var pop = new Pop(slide, slide.querySelector(".scene-map"), sc.mv, sc.markers);
    var list = Array.prototype.slice.call(slide.querySelectorAll(".beat"));
    slide.addEventListener("gp:step", function (e) {
      sc.set(e.detail.step, e.detail.animate);
      list.forEach(function (li, i) {
        li.classList.toggle("is-now", i === e.detail.step);
        li.classList.toggle("is-past", i < e.detail.step);
      });
    });
    return sc;
  }

  /* Cena: Tríplice Aliança */
  function buildAlianca(slide) {
    var mount = slide.querySelector(".map-mount");
    var sc = new Scene(mount, { style: "paper", detail: false, grid: 5, pad: .02, cams: [[-68, -12.5, -40, -37.5]] });
    ["Paraguai|-58.3|-23.3", "Argentina|-64.2|-31.5", "Brasil|-49.5|-15.5", "Uruguai|-55.9|-32.9", "Bolívia|-64.5|-16.8"].forEach(function (c) {
      var p = c.split("|");
      sc.fixed(Number(p[1]), Number(p[2]), p[0], "m-country-name");
    });
    sc.region("PRY", 0, "rg-py", true);
    sc.region("BRA", 1, "rg-al", true);
    sc.region("ARG", 2, "rg-al", true);
    sc.region("URY", 3, "rg-al", true);
    // triângulo entre as capitais aliadas
    var rio = P(-43.17, -22.91), ba = P(-58.38, -34.6), mvd = P(-56.19, -34.9);
    var tri = GP.svg("path", { d: toD([rio, ba, mvd, rio]), "class": "m-triangle sc-draw", pathLength: 1 }, sc.layer);
    sc.track(tri, 4, true);
    sc.marker({ lon: -43.17, lat: -22.91, kind: "capital", name: "Rio de Janeiro", date: "Império do Brasil", off: [-16, -10, "end"], info: "Capital do Império. O Brasil forneceu a maior parte das tropas aliadas e a esquadra." }, 1, true);
    sc.marker({ lon: -58.38, lat: -34.6, kind: "capital", name: "Buenos Aires", date: "1º maio 1865", off: [-16, 4, "end"], info: "Local da assinatura do Tratado da Tríplice Aliança, em 1º de maio de 1865." }, 2, true);
    sc.marker({ lon: -56.19, lat: -34.9, kind: "capital", name: "Montevidéu", date: "governo Flores", off: [16, 14, "start"], info: "Com apoio brasileiro, o colorado Venancio Flores assumiu o governo uruguaio em fevereiro de 1865." }, 3, true);
    sc.marker({ lon: -57.64, lat: -25.28, kind: "capital", name: "Assunção", date: "Solano López", off: [16, 4, "start"], info: "Capital do Paraguai, governado por Francisco Solano López desde 1862." }, 0, true);
    var pop = new Pop(slide, slide.querySelector(".scene-map"), sc.mv, sc.markers);
    var cards = Array.prototype.slice.call(slide.querySelectorAll(".ally"));
    slide.addEventListener("gp:step", function (e) {
      sc.set(e.detail.step, e.detail.animate);
      cards.forEach(function (c) {
        var from = Number(c.dataset.from);
        c.classList.toggle("is-now", from === e.detail.step);
        c.classList.toggle("is-past", from < e.detail.step);
      });
      slide.classList.toggle("treaty-on", e.detail.step >= 4);
    });
    return sc;
  }

  /* Localizador das batalhas (mini-mapa) */
  var BATTLES = [
    { lon: -58.78, lat: -27.62, name: "Riachuelo", where: "Rio Paraná, perto de Corrientes", kind: "naval" },
    { lon: -58.42, lat: -27.24, name: "Tuiuti", where: "Sul do Paraguai", kind: "battle" },
    { lon: -58.60, lat: -27.15, name: "Curupaiti", where: "Margem do rio Paraguai", kind: "battle" },
    { lon: -58.52, lat: -27.06, name: "Humaitá", where: "Rio Paraguai", kind: "naval" },
    { lon: -57.53, lat: -25.50, name: "Avaí", where: "Região de Villeta", kind: "battle" }
  ];
  function buildLocator(slide) {
    var mount = slide.querySelector(".locator-mount");
    if (!mount) return;
    var mv = new MapView(mount, { detail: true, grid: 1, pad: 0 });
    mount.parentNode.classList.add("map-dark");
    text(mv.anchor(-57.6, -26.3, "m-static").g, "Paraguai", { "class": "m-country-name small", "text-anchor": "middle" });
    text(mv.anchor(-59.4, -28.0, "m-static").g, "Argentina", { "class": "m-country-name small", "text-anchor": "middle" });
    var marks = BATTLES.map(function (b) {
      var a = mv.anchor(b.lon, b.lat, "m-marker loc-mark " + b.kind);
      GP.svg("circle", { r: 9, "class": "mk-pulse" }, a.g);
      GP.svg("circle", { r: 5, "class": "mk-core" }, a.g);
      text(a.g, b.name, { "class": "m-marker-label", x: 10, y: -8, "text-anchor": "start" });
      return a;
    });
    var cap = slide.querySelector(".locator figcaption");
    var show = function (i, animate) {
      var b = BATTLES[i];
      marks.forEach(function (m, k) { m.g.classList.toggle("is-now", k === i); });
      // legenda antes da câmera: os nomes do mapa se ajustam ao tamanho dela
      if (cap) cap.textContent = b.where;
      mv.camera([b.lon - 1.35, b.lat + .95, b.lon + 1.35, b.lat - .95], animate);
    };
    show(0, false);
    slide.addEventListener("gp:step", function (e) { show(e.detail.step, e.detail.animate); });
  }

  /* ---------- Países envolvidos: contornos dos países ---------- */
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

  /* ---------- Pindorama: povos antes das fronteiras ---------- */
  // Áreas aproximadas (séculos XVI–XIX), sem limites fixos: [nome, lon, lat, família, raio lon, raio lat, lado do rótulo]
  var POVOS = [
    ["Guarani", -55.2, -25.9, "tg", 4.2, 4.4, 1],
    ["Tupinambá", -42.4, -21.4, "tg", 1.6, 3.2, -1],
    ["Guaicuru", -57.9, -20.6, "gk", 1.5, 1.9, 0],
    ["Terena", -55.6, -20.3, "ak", 1.2, 1.3, 1],
    ["Qom", -60.7, -24.9, "gk", 2.4, 2.3, 1],
    ["Kaingang", -51.4, -27.4, "je", 2.3, 2.1, 1],
    ["Charrua", -56.6, -32.3, "ch", 2.2, 1.7, 1]
  ];
  function buildPovos(mount) {
    var mv = new MapView(mount, { drawRivers: true, pad: 0 });
    // Fronteiras atuais: aparecem como referência e se apagam
    var borders = GP.svg("g", { "class": "m-modern m-borders" }, mv.extra);
    ["BRA", "ARG", "URY", "PRY", "BOL", "CHL"].forEach(function (code) {
      GP.svg("path", { d: window.GP_GEO.countries[code], "class": "m-border" }, borders);
    });
    [["Brasil", -49, -18.6], ["Paraguai", -58.4, -23.2], ["Argentina", -62.2, -29.6], ["Uruguai", -55.9, -32.9], ["Bolívia", -62.4, -17.2]].forEach(function (c) {
      var a = mv.anchor(c[1], c[2], "m-modern");
      text(a.g, c[0], { "class": "m-country-name", "text-anchor": "middle" });
    });
    // Áreas difusas por povo (gradiente radial) e rótulos
    var blobs = GP.svg("g", { "class": "m-povos" }, mv.extra);
    ["tg", "gk", "ak", "je", "ch"].forEach(function (f) {
      var g = GP.svg("radialGradient", { id: "povo-" + f }, mv.defs);
      GP.svg("stop", { offset: "0", "class": "pv-stop pv-" + f, "stop-opacity": ".42" }, g);
      GP.svg("stop", { offset: ".6", "class": "pv-stop pv-" + f, "stop-opacity": ".16" }, g);
      GP.svg("stop", { offset: "1", "class": "pv-stop pv-" + f, "stop-opacity": "0" }, g);
    });
    POVOS.forEach(function (p, i) {
      var c = P(p[1], p[2]);
      var rx = P(p[1] + p[4], p[2])[0] - c[0], ry = P(p[1], p[2] - p[5])[1] - c[1];
      var e = GP.svg("ellipse", { cx: c[0], cy: c[1], rx: rx, ry: ry, fill: "url(#povo-" + p[3] + ")", "class": "m-fade" }, blobs);
      e.style.setProperty("--delay", (2.5 + i * .22) + "s");
      var a = mv.anchor(p[1], p[2], "m-fade m-povo fam-" + p[3] + (i === 0 ? " is-major" : ""));
      a.g.style.setProperty("--delay", (2.8 + i * .22) + "s");
      GP.svg("circle", { r: 4, "class": "m-povo-dot" }, a.g);
      text(a.g, p[0], { "class": "m-povo-name", x: p[6] * 10, y: p[6] ? 6 : -12, "text-anchor": p[6] > 0 ? "start" : p[6] < 0 ? "end" : "middle" });
    });
    var CAM = [-64.5, -19, -39.5, -39.5];
    mv.camera(CAM);
    // aproximação lenta a cada entrada no slide
    var slide = mount.closest(".slide");
    if (slide) slide.addEventListener("gp:enter", function () {
      if (GP.reduced()) return mv.camera(CAM);
      mv.camera([-67, -15.5, -37, -42.5]);
      setTimeout(function () { mv.camera(CAM, true, 5200); }, 60);
    });
    return mv;
  }

  GP.initMaps = function (deck) {
    var prata = deck.querySelector('[data-map="prata"]');
    if (prata) GP.prataMap = buildPrata(prata);
    var povos = deck.querySelector('[data-map="povos"]');
    if (povos) GP.povosMap = buildPovos(povos);
    var mapSlide = deck.querySelector(".slide-map");
    if (mapSlide) GP.campaign = new Campaign(mapSlide);
    var inicio = deck.querySelector(".slide-inicio");
    if (inicio) GP.inicioScene = buildInicio(inicio);
    var alianca = deck.querySelector(".slide-alianca");
    if (alianca) GP.aliancaScene = buildAlianca(alianca);
    var battles = deck.querySelector(".slide-battles");
    if (battles) buildLocator(battles);
    deck.querySelectorAll("[data-shape]").forEach(shape);
  };
})();
