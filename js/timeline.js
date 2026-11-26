/* Linha do tempo animada e clicável (slide 6). */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});

  var PHASES = [
    { from: "1864-10-01", to: "1865-11-15", label: "Ofensiva paraguaia" },
    { from: "1866-04-01", to: "1868-08-01", label: "Invasão e Humaitá" },
    { from: "1868-12-01", to: "1870-03-10", label: "Avanço final" }
  ];
  var T0 = Date.parse("1864-10-01"), T1 = Date.parse("1870-03-10");
  var PAD = 0.035;

  function Timeline(root) {
    this.root = root;
    this.slide = root.closest(".slide");
    this.stage = root.querySelector(".tl-stage");
    this.items = Array.prototype.slice.call(root.querySelectorAll(".tl-events > li"));
    this.detail = root.querySelector(".tl-detail");
    this.timers = [];
    var self = this;
    this.events = this.items.map(function (li, i) {
      var p = li.querySelector("p");
      var data = {
        li: li,
        t: Date.parse(li.dataset.date),
        time: li.querySelector("time").textContent,
        title: li.querySelector("strong").innerHTML,
        text: p ? p.innerHTML : "",
        img: li.dataset.img || "",
        credit: li.dataset.credit || "",
        mark: li.dataset.mark || ""
      };
      li.className = "tl-event";
      if (data.mark) li.classList.add("is-" + data.mark);
      li.innerHTML = "";
      GP.el("span", "tl-stem", li);
      GP.el("span", "tl-dot", li);
      var btn = GP.el("button", "tl-label", li);
      btn.type = "button";
      if (data.mark === "start") btn.dataset.flag = "Início";
      if (data.mark === "end") btn.dataset.flag = "Fim";
      // rótulo curto opcional (data-short) para caber na linha; o título completo vai para o detalhe
      btn.innerHTML = "<time>" + data.time + "</time><strong>" + (li.dataset.short || data.title) + "</strong>";
      btn.setAttribute("aria-label", data.time + ": " + btn.textContent.replace(data.time, "").trim());
      btn.addEventListener("click", function () { self.select(i, true); });
      return data;
    });
    this.layout();
    this.select(0, false);
    this.slide.addEventListener("gp:enter", function () { self.reveal(); });
    this.slide.addEventListener("gp:leave", function () { self.reset(); });
    new ResizeObserver(function () { self.layout(); }).observe(this.stage);
    // refaz a distribuição quando as fontes terminam de carregar (alturas dos rótulos mudam)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.layout(); });
  }

  Timeline.prototype.pos = function (t) {
    var ev = this.events, n = ev.length;
    var prop = (t - T0) / (T1 - T0);
    var ord;
    if (t <= ev[0].t) ord = 0;
    else if (t >= ev[n - 1].t) ord = 1;
    else {
      for (var i = 0; i < n - 1; i++) {
        if (t >= ev[i].t && t <= ev[i + 1].t) {
          var f = (t - ev[i].t) / Math.max(1, ev[i + 1].t - ev[i].t);
          ord = (i + f) / (n - 1);
          break;
        }
      }
    }
    var x = .22 * prop + .78 * ord;
    return PAD + x * (1 - PAD * 2);
  };

  Timeline.prototype.layout = function () {
    var self = this;
    // medidas de layout (sem efeito das transformações das transições)
    var W = this.stage.clientWidth, H = this.stage.clientHeight;
    if (!W) return;
    var cq = this.slide.clientWidth / 100;
    var labelW = 10.2 * cq, gap = .45 * cq;
    var labelH = 0;
    this.events.forEach(function (ev) { labelH = Math.max(labelH, ev.li.querySelector(".tl-label").offsetHeight); });
    if (!labelH) labelH = 4.2 * cq;
    var half = H / 2;
    // reserva no alto para os nomes das fases; a haste mais curta sai da faixa dos anos
    var top = 1.9 * cq;
    var near = Math.max(1.15 * cq, Math.min(1.8 * cq, half - top - 2 * labelH - .9 * cq));
    var far = near + labelH + .5 * cq;
    var lanes = [
      { side: "up", stem: near, right: -1e9 }, { side: "down", stem: near, right: -1e9 },
      { side: "up", stem: far, right: -1e9, inner: 0 }, { side: "down", stem: far, right: -1e9, inner: 1 }
    ];
    var mobile = W < 520;
    this.events.forEach(function (ev, i) {
      var x = self.pos(ev.t) * W;
      var w = labelW;
      var flip = x + w > W - 4;
      var left = flip ? x - w : x;
      var lane = null;
      if (!mobile) {
        var pref = i % 2 === 0 ? [0, 1, 2, 3] : [1, 0, 3, 2];
        for (var k = 0; k < pref.length; k++) {
          var L = lanes[pref[k]];
          var free = L.right + gap < left;
          // a haste de um rótulo distante não pode atravessar o rótulo próximo do mesmo lado
          if (free && L.inner !== undefined) free = lanes[L.inner].right + gap < x;
          if (free) { lane = L; break; }
        }
        if (!lane) lane = lanes.reduce(function (a, b) { return a.right < b.right ? a : b; });
        lane.right = Math.max(lane.right, flip ? x : left + w);
      }
      var li = ev.li;
      li.style.left = (x / W * 100).toFixed(3) + "%";
      li.classList.toggle("is-up", !!lane && lane.side === "up");
      li.classList.toggle("is-down", !lane || lane.side === "down");
      li.classList.toggle("is-flip", flip && !mobile);
      li.style.setProperty("--stem", (lane ? lane.stem : near) + "px");
      ev.x = x / W;
    });
    // anos
    var years = this.root.querySelector(".tl-years");
    years.innerHTML = "";
    for (var y = 1865; y <= 1870; y++) {
      var yx = this.pos(Date.parse(y + "-01-01"));
      var yr = GP.el("span", "tl-year", years);
      yr.style.left = (yx * 100).toFixed(2) + "%";
      GP.el("span", "", yr).textContent = y;
      // o ano fica do lado do traço com espaço livre; sem espaço dos dois lados, fica só o traço
      var room = 3.7 * cq / W, dl = 1, dr = 1;
      this.events.forEach(function (e) {
        var d = e.x - yx;
        if (d >= 0) dr = Math.min(dr, d); else dl = Math.min(dl, -d);
      });
      yr.classList.toggle("is-left", dr < room && dl >= room);
      yr.classList.toggle("is-hidden", dr < room && dl < room);
    }
    // fases
    var phases = this.root.querySelector(".tl-phases");
    phases.innerHTML = "";
    PHASES.forEach(function (ph) {
      var a = self.pos(Date.parse(ph.from)), b = self.pos(Date.parse(ph.to));
      var el = GP.el("span", "tl-phase", phases);
      el.style.left = (a * 100).toFixed(2) + "%";
      el.style.width = ((b - a) * 100).toFixed(2) + "%";
      GP.el("span", "", el).textContent = ph.label;
    });
    this.placePhaseNames();
  };
  // Nomes das fases (Ofensiva paraguaia, Invasão e Humaitá, Avanço final) nunca embaixo de um rótulo
  Timeline.prototype.placePhaseNames = function () {
    var labs = this.events.map(function (e) { return e.li.querySelector(".tl-label"); });
    Array.prototype.forEach.call(this.root.querySelectorAll(".tl-phase"), function (band) {
      var sp = band.querySelector("span");
      if (!sp || !band.offsetWidth) return;
      sp.style.left = "";
      var hits = function () {
        var r = sp.getBoundingClientRect();
        return labs.filter(function (l) { var q = l.getBoundingClientRect(); return q.width && q.left < r.right + 4 && q.right > r.left - 4 && q.top < r.bottom + 2 && q.bottom > r.top - 2; });
      };
      sp.style.top = ""; sp.style.bottom = ""; sp.style.visibility = "";
      var h = hits();
      if (!h.length) return;
      var b = band.getBoundingClientRect(), sc = b.width / band.offsetWidth || 1, w = sp.getBoundingClientRect().width / sc;
      var right = (Math.max.apply(null, h.map(function (l) { return l.getBoundingClientRect().right; })) - b.left) / sc + 8;
      var left = (Math.min.apply(null, h.map(function (l) { return l.getBoundingClientRect().left; })) - b.left) / sc - w - 8;
      var bw = band.offsetWidth;
      // posições de reserva: à direita ou à esquerda de quem atrapalha, ou embaixo da faixa
      var tries = [[right, ""], [left, ""], ["", "low"], [bw - w - 6, "low"]];
      for (var i = 0; i < tries.length; i++) {
        var x = tries[i][0];
        if (x !== "" && (x < 4 || x + w > bw - 4)) continue;
        sp.style.left = x === "" ? "" : x + "px";
        sp.style.top = tries[i][1] ? "auto" : "";
        sp.style.bottom = tries[i][1] ? "2px" : "";
        if (!hits().length) return;
      }
      // sem lugar livre: o nome some em vez de ficar por baixo de um rótulo
      sp.style.left = ""; sp.style.top = ""; sp.style.bottom = "";
      sp.style.visibility = "hidden";
    });
  };

  Timeline.prototype.reveal = function () {
    this.reset();
    var self = this;
    var reduced = GP.reduced();
    var start = 180 + 5 * 85, dur = 2600;
    this.events.forEach(function (ev, i) {
      var p = Math.max(0, Math.min(1, (ev.x - PAD) / (1 - PAD * 2)));
      // aproxima a curva de easing da linha (ease-in-out)
      var tt = p < .5 ? Math.cbrt(p / 4) : 1 - Math.cbrt((1 - p) / 4);
      var delay = reduced ? 0 : start + tt * dur;
      self.timers.push(setTimeout(function () { ev.li.classList.add("is-on"); }, delay));
    });
    // ano de fundo avança de 1864 a 1870 enquanto a linha é desenhada
    var big = this.root.querySelector(".tl-bigyear span");
    if (big && !reduced) {
      big.textContent = "1864";
      this.timers.push(setTimeout(function () {
        var t0 = performance.now();
        var tick = function (now) {
          var t = Math.min(1, (now - t0) / dur);
          var e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          big.textContent = Math.round(1864 + 6 * e);
          if (t < 1 && self.slide.classList.contains("is-current")) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, start));
    }
    var startIdx = this.events.findIndex(function (e) { return e.mark === "start"; });
    this.timers.push(setTimeout(function () { self.select(Math.max(0, startIdx), true); }, reduced ? 0 : start + dur + 200));
  };
  Timeline.prototype.reset = function () {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.events.forEach(function (ev) { ev.li.classList.remove("is-on"); });
  };
  // usado pelo modo apresentador: destaca o acontecimento pelo nome ("Tuiuti", "Cerro Corá"…)
  Timeline.prototype.selectLabel = function (label) {
    var norm = function (x) { return String(x || "").replace(/<[^>]+>/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
    var q = norm(label);
    var i = this.events.findIndex(function (e) { return norm(e.title).indexOf(q) > -1 || norm(e.li.dataset.short).indexOf(q) > -1; });
    if (i > -1) this.select(i, true);
    return i;
  };
  Timeline.prototype.select = function (i, animate) {
    var ev = this.events[i];
    this.current = i;
    this.events.forEach(function (e, k) {
      e.li.classList.toggle("is-active", k === i);
      e.li.querySelector(".tl-label").setAttribute("aria-pressed", k === i ? "true" : "false");
    });
    var fig = this.detail.querySelector(".tl-detail-img");
    var img = fig.querySelector("img");
    var cap = fig.querySelector("figcaption");
    var copy = this.detail.querySelector(".tl-detail-copy");
    if (ev.img) {
      fig.classList.remove("is-empty");
      img.src = "assets/img/" + ev.img + ".jpg";
      img.alt = ev.credit ? "Imagem: " + ev.credit.split("·")[1] : "";
      cap.textContent = ev.credit;
      fig.dataset.lightbox = ev.img;
    } else {
      fig.classList.add("is-empty");
      fig.dataset.year = new Date(ev.t).getUTCFullYear();
      img.removeAttribute("src");
      cap.textContent = "";
      delete fig.dataset.lightbox;
    }
    copy.querySelector("time").textContent = ev.time;
    var big = this.root.querySelector(".tl-bigyear span");
    if (big && GP.countTo) GP.countTo(big, new Date(ev.t).getUTCFullYear(), animate);
    copy.querySelector("h3").innerHTML = ev.title;
    // lista vertical (palco estreito): o acontecimento escolhido fica à vista
    if (getComputedStyle(this.stage).overflowY === "auto") {
      var st = this.stage, d = ev.li.getBoundingClientRect().top - st.getBoundingClientRect().top + st.scrollTop;
      st.scrollTo({ top: Math.max(0, d - st.clientHeight / 2 + ev.li.offsetHeight / 2), behavior: animate && !GP.reduced() ? "smooth" : "auto" });
    }
    copy.querySelector("p").innerHTML = ev.text;
    if (animate && !GP.reduced()) {
      [fig, copy].forEach(function (el) {
        el.classList.remove("is-swapping");
        void el.offsetWidth;
        el.classList.add("is-swapping");
      });
    }
  };

  GP.el = GP.el || function (tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  };
  GP.initTimeline = function (deck) {
    var root = deck.querySelector("#timeline");
    if (root) GP.timeline = new Timeline(root);
  };
})();
