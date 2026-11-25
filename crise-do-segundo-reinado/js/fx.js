/* Efeitos visuais: tipografia cinética, contadores, poeira, parallax e atlas. */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  GP.reduced = function () { return reduceMotion.matches; };

  /* ---------- Projeção (mesma do gerador de mapas) ---------- */
  GP.project = function (lon, lat) {
    var p = window.GP_GEO.proj;
    return [(lon - p.lon0) * p.k * p.cos, (p.lat0 - lat) * p.k];
  };
  GP.bbox = function (w, n, e, s) {
    var a = GP.project(w, n), b = GP.project(e, s);
    return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] };
  };
  GP.fitBox = function (box, aspect, pad) {
    pad = pad || 0;
    var w = box.w * (1 + pad), h = box.h * (1 + pad);
    if (w / h < aspect) w = h * aspect; else h = w / aspect;
    return { x: box.x + box.w / 2 - w / 2, y: box.y + box.h / 2 - h / 2, w: w, h: h };
  };
  GP.svg = function (tag, attrs, parent) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };

  /* ---------- Divisão de texto em palavras e letras ---------- */
  function splitNode(node, mode, counter) {
    var children = Array.prototype.slice.call(node.childNodes);
    children.forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var w = document.createElement("span");
          w.className = "w";
          if (mode === "chars") {
            Array.from(part).forEach(function (ch) {
              var c = document.createElement("span");
              c.className = "c";
              c.style.setProperty("--i", counter.n++);
              c.textContent = ch;
              w.appendChild(c);
            });
          } else {
            var inner = document.createElement("span");
            inner.className = "wi";
            inner.style.setProperty("--i", counter.n++);
            inner.textContent = part;
            w.appendChild(inner);
          }
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !child.classList.contains("cite")) {
        splitNode(child, mode, counter);
      }
    });
  }
  GP.splitText = function (root) {
    root.querySelectorAll(".sheen").forEach(function (el) { el.dataset.text = el.textContent.replace(/\s+/g, " ").trim(); });
    root.querySelectorAll('[data-anim="words"], [data-anim="chars"]').forEach(function (el) {
      if (el.dataset.split) return;
      var mode = el.dataset.anim;
      if (!el.getAttribute("aria-label") && !el.closest("[aria-label]")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      splitNode(el, mode, { n: 0 });
      el.style.setProperty("--step", mode === "chars" ? "48ms" : "70ms");
      el.dataset.split = "1";
      el.querySelectorAll(".w").forEach(function (w) { w.setAttribute("aria-hidden", "true"); });
    });
  };

  /* ---------- Contadores ---------- */
  var counters = new Map();
  GP.runCounters = function (slide) {
    slide.querySelectorAll('[data-anim="count"]').forEach(function (el) {
      var from = Number(el.dataset.from), to = Number(el.dataset.to);
      var d = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
      var delay = 180 + d * 85;
      if (counters.has(el)) cancelAnimationFrame(counters.get(el));
      if (GP.reduced()) { el.textContent = to; return; }
      el.textContent = from;
      var start = performance.now() + delay, dur = 1400;
      var tick = function (now) {
        var t = Math.min(1, Math.max(0, (now - start) / dur));
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(from + (to - from) * e);
        if (t < 1) counters.set(el, requestAnimationFrame(tick));
      };
      counters.set(el, requestAnimationFrame(tick));
    });
  };

  /* ---------- Profundidade (parallax) ---------- */
  GP.initParallax = function (deck) {
    deck.querySelectorAll("[data-depth]").forEach(function (el) {
      el.style.setProperty("--depth", el.dataset.depth);
    });
    if (!window.matchMedia("(pointer: fine)").matches) return;
    var raf = 0, nx = 0, ny = 0;
    window.addEventListener("pointermove", function (e) {
      if (GP.reduced()) return;
      var r = deck.getBoundingClientRect();
      nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2));
      ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2));
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        deck.style.setProperty("--px", nx.toFixed(3));
        deck.style.setProperty("--py", ny.toFixed(3));
      });
    }, { passive: true });
  };

  /* ---------- Poeira em canvas (pausa quando não usada) ---------- */
  function Dust(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.parts = [];
    this.running = false;
    this.last = 0;
    var self = this;
    this.loop = function (t) { self.frame(t); };
    window.addEventListener("resize", function () { self.resize(); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self.pause(); else if (self.wanted) self.start();
    });
  }
  Dust.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = r.width; this.h = r.height;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(90, (r.width * r.height) / 16000));
    this.parts = [];
    for (var i = 0; i < count; i++) this.parts.push(this.spawn(true));
  };
  Dust.prototype.spawn = function (anywhere) {
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : this.h + 10,
      r: .4 + Math.pow(Math.random(), 3) * 2.2,
      vx: (Math.random() - .5) * .12,
      vy: -(.05 + Math.random() * .22),
      a: .15 + Math.random() * .5,
      ph: Math.random() * Math.PI * 2,
      warm: Math.random() < .7
    };
  };
  Dust.prototype.frame = function (t) {
    if (!this.running) return;
    var dt = this.last ? Math.min(3, (t - this.last) / 16.7) : 1;
    this.last = t;
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.parts.length; i++) {
      var p = this.parts[i];
      p.ph += .012 * dt;
      p.x += (p.vx + Math.sin(p.ph) * .08) * dt;
      p.y += p.vy * dt;
      if (p.y < -10 || p.x < -10 || p.x > this.w + 10) this.parts[i] = p = this.spawn(false);
      var alpha = p.a * (.55 + .45 * Math.sin(p.ph * 1.7));
      ctx.fillStyle = p.warm ? "rgba(230,205,148," + alpha.toFixed(3) + ")" : "rgba(239,230,209," + (alpha * .7).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }
    requestAnimationFrame(this.loop);
  };
  Dust.prototype.start = function () {
    this.wanted = true;
    if (GP.reduced()) return this.pause();
    this.canvas.classList.add("is-on");
    if (this.running || document.hidden) return;
    if (!this.w) this.resize();
    this.running = true;
    this.last = 0;
    requestAnimationFrame(this.loop);
  };
  Dust.prototype.pause = function () { this.running = false; };
  Dust.prototype.stop = function () {
    this.wanted = false;
    this.canvas.classList.remove("is-on");
    var self = this;
    setTimeout(function () { if (!self.wanted) self.pause(); }, 1300);
  };
  GP.Dust = Dust;

  /* ---------- Atlas persistente: o Império do Brasil ---------- */
  var CAMERAS = {
    continent: [-86, 13, -30, -57],
    brasil: [-118, 9, -30, -38],
    sudeste: [-52, -18, -38, -27],
    finale: [-112, 10, -24, -40]
  };
  // capitais de província e lugares citados; "corte" é a capital do Império
  var PLACES = [
    ["Rio de Janeiro", -43.17, -22.91, 1, 0, "corte"],
    ["Salvador", -38.5, -12.97, 1, 0, ""],
    ["Recife e Olinda", -34.9, -8.05, -1, 0, ""],
    ["Belém", -48.5, -1.45, 1, -6, ""],
    ["São Paulo", -46.63, -23.55, -1, 4, ""],
    ["Porto Alegre", -51.22, -30.03, -1, 0, ""],
    ["Ouro Preto", -43.5, -20.39, -1, -6, ""],
    ["São Luís", -44.3, -2.53, -1, -4, ""],
    ["Cuiabá", -56.1, -15.6, -1, 0, ""],
    ["Manaus", -60.02, -3.1, -1, 0, ""]
  ];
  function Atlas(mount, deck) {
    this.mount = mount;
    this.deck = deck;
    var G = window.GP_GEO;
    var svg = (this.svg = GP.svg("svg", { preserveAspectRatio: "xMidYMid slice" }, mount));
    var grat = GP.svg("g", { "class": "a-grat" }, svg);
    var lon, lat, a, b;
    for (lon = -85; lon <= -30; lon += 5) {
      a = GP.project(lon, 15); b = GP.project(lon, -60);
      GP.svg("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], pathLength: 1 }, grat);
    }
    for (lat = 10; lat >= -55; lat -= 5) {
      a = GP.project(-90, lat); b = GP.project(-25, lat);
      GP.svg("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], pathLength: 1 }, grat);
    }
    var land = GP.svg("g", null, svg);
    ["ARG", "URY", "PRY", "BOL", "CHL", "PER", "COL", "VEN", "ECU", "GUY", "SUR", "GUF", "PAN", "BRA"].forEach(function (code) {
      if (!G.countries[code]) return;
      GP.svg("path", { d: G.countries[code], pathLength: 1, "class": "a-land" + (code === "BRA" ? " is-key is-br" : "") }, land);
    });
    var rivers = GP.svg("g", null, svg);
    Object.keys(G.rivers).forEach(function (k) {
      var main = ["paraguai", "parana", "uruguai"].indexOf(k) > -1;
      GP.svg("path", { d: G.rivers[k], pathLength: 1, "class": "a-river" + (main ? " is-main" : "") }, rivers);
    });
    var cities = GP.svg("g", null, svg);
    PLACES.forEach(function (c) {
      var p = GP.project(c[1], c[2]);
      var g = GP.svg("g", { "class": "a-place" + (c[5] ? " is-" + c[5] : "") }, cities);
      GP.svg("circle", { cx: p[0], cy: p[1], r: c[5] ? 11 : 6, "class": "a-city" }, g);
      if (c[5]) GP.svg("circle", { cx: p[0], cy: p[1], r: 22, "class": "a-city-ring" }, g);
      var t = GP.svg("text", { x: p[0] + c[3] * (c[5] ? 26 : 14), y: p[1] + 7 + c[4], "text-anchor": c[3] > 0 ? "start" : "end", "class": "a-city-label" }, g);
      t.textContent = c[0];
      if (c[5]) {
        var s = GP.svg("text", { x: p[0] + 26, y: p[1] + 34, "class": "a-city-sub" }, g);
        s.textContent = "capital do Império (Corte)";
      }
    });
    var brc = GP.project(-53, -10.5);
    var brl = GP.svg("text", { x: brc[0], y: brc[1], "text-anchor": "middle", "class": "a-br-label" }, cities);
    brl.textContent = "Império do Brasil";
    this.labels = cities;
    this.vb = null;
    this.anim = 0;
    var self = this;
    window.addEventListener("resize", function () { if (self.camera) self.go(self.camera, true); });
  }
  Atlas.prototype.target = function (name) {
    var c = CAMERAS[name] || CAMERAS.brasil;
    var r = { width: this.deck.clientWidth || 1, height: this.deck.clientHeight || 1 };
    var fit = GP.fitBox(GP.bbox(c[0], c[1], c[2], c[3]), r.width / Math.max(1, r.height), 0);
    var scale = fit.w / r.width;
    this.labels.style.fontSize = (11 * scale).toFixed(1) + "px";
    return fit;
  };
  Atlas.prototype.go = function (name, instant) {
    if (!CAMERAS[name]) return;
    this.camera = name;
    var to = this.target(name);
    var from = this.vb;
    var self = this;
    cancelAnimationFrame(this.anim);
    if (!from || instant || GP.reduced()) {
      this.set(to);
      return;
    }
    var t0 = performance.now(), dur = 1900;
    var step = function (now) {
      var t = Math.min(1, (now - t0) / dur);
      var e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      self.set({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e });
      if (t < 1) self.anim = requestAnimationFrame(step);
    };
    this.anim = requestAnimationFrame(step);
  };
  Atlas.prototype.set = function (vb) {
    this.vb = vb;
    this.svg.style.setProperty("--sw", (vb.w / (this.deck.clientWidth || 1)).toFixed(4));
    this.svg.setAttribute("viewBox", [vb.x, vb.y, vb.w, vb.h].map(function (n) { return n.toFixed(1); }).join(" "));
  };
  // Reapresenta o desenho dos rios e contornos (abertura e conclusão)
  Atlas.prototype.redraw = function () {
    if (GP.reduced()) return;
    var m = this.mount;
    m.classList.remove("is-drawn");
    void m.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { m.classList.add("is-drawn"); }); });
  };
  Atlas.prototype.draw = function () {
    var m = this.mount;
    requestAnimationFrame(function () { requestAnimationFrame(function () { m.classList.add("is-drawn"); }); });
  };
  GP.Atlas = Atlas;
})();
