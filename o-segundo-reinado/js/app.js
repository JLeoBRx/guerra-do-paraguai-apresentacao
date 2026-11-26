/* Motor da apresentação: navegação, etapas, transições, controles e visualizador. */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Registro das imagens: legenda, autoria, data e ficha de origem */
  var C = "https://commons.wikimedia.org/wiki/File:";
  var IMAGES = GP.IMAGES || {};


  var deck, slides, state = { index: 0, step: 0 }, atlas, dust, busy = null;
  var stepsOf = function (s) { return Number(s.dataset.steps || 0); };
  // Modo prévia (usado nas miniaturas do modo apresentador): sem controles, sem áudio, sem animação
  var PREVIEW = /[?&]preview\b/.test(location.search);
  if (PREVIEW) {
    document.documentElement.classList.add("is-preview");
    GP.reduced = function () { return true; };
  }
  // Duração de cada transição e atraso para as animações internas começarem (ms)
  var TR = {
    dissolve: [1150, 140], page: [1150, 140], iris: [1350, 160], zoom: [1150, 140], slide: [1150, 140],
    reveal: [1500, 320], dive: [1500, 260], stack: [1200, 220], carto: [1300, 260], timepass: [1150, 140],
    dramatic: [1500, 680], sober: [2300, 1150], finale: [2700, 1300], canopy: [1450, 300]
  };
  var bc = !PREVIEW && "BroadcastChannel" in window ? new BroadcastChannel("sr2-apresentacao") : null;

  /* ---------- Navegação ---------- */
  function setChrome() {
    var s = slides[state.index];
    var n = slides.length;
    $("#navNum").textContent = String(state.index + 1).padStart(2, "0");
    $("#navTotal").textContent = String(n).padStart(2, "0");
    $("#navTitle").textContent = s.dataset.title;
    var total = stepsOf(s);
    var stepsEl = $("#navSteps");
    stepsEl.innerHTML = "";
    if (total) for (var i = 0; i <= total; i++) { var b = document.createElement("i"); if (i <= state.step) b.className = "on"; stepsEl.appendChild(b); }
    var frac = total ? state.step / (total + 1) : 0;
    $("#progressFill").style.transform = "scaleX(" + ((state.index + frac) / (n - 1)).toFixed(4) + ")";
    $("#btnPrev").disabled = state.index === 0 && state.step === 0;
    $("#btnNext").disabled = state.index === n - 1;
    $$("#progressTicks button").forEach(function (b, i) { b.setAttribute("aria-current", i === state.index ? "true" : "false"); });
    deck.dataset.theme = s.classList.contains("theme-paper") ? "paper" : "dark";
    deck.dataset.atlasLevel = s.dataset.atlasLevel || "dim";
    var nb = $("#btnNext");
    var moreSteps = total && state.step < total;
    nb.classList.toggle("is-step", !!moreSteps);
    nb.setAttribute("aria-label", moreSteps ? "Próximo tópico" : "Próximo slide");
    nb.title = moreSteps ? "Próximo tópico (" + (state.step + 2) + " de " + (total + 1) + ")" : "Próximo slide";
    broadcast();
    document.dispatchEvent(new CustomEvent("gp:change", { detail: { index: state.index, step: state.step, slide: s } }));
    document.title = (state.index === 0 ? "" : s.dataset.title + " · ") + "O Segundo Reinado — 1840–1889";
  }

  function applyStep(slide, step, animate, prevStep) {
    slide.dataset.step = step;
    // tópicos revelados um por clique: data-at = etapa em que o item aparece
    $$("[data-at]", slide).forEach(function (el) {
      var at = Number(el.dataset.at);
      el.classList.toggle("is-shown", at <= step);
      el.classList.toggle("is-now", at === step);
    });
    $$("[data-goto-step]", slide).forEach(function (b) {
      var on = Number(b.dataset.gotoStep) === step;
      b.setAttribute("aria-current", on ? "true" : "false");
    });
    // galeria de batalhas
    var items = $$(".reel-item", slide);
    var yearEl = slide.querySelector(".reel-year span");
    if (yearEl) {
      var t = $$(".reel-text time", slide)[step];
      var to = t ? Number((t.textContent.match(/1\d{3}/) || [])[0]) : 0;
      if (to) countTo(yearEl, to, animate);
    }
    if (items.length) {
      items.forEach(function (it, i) {
        it.classList.toggle("is-now", i === step);
        it.classList.toggle("is-past", i < step);
        if (prevStep !== undefined && i === prevStep && prevStep > step && animate) {
          it.classList.add("is-leaving-back");
          setTimeout(function () { it.classList.remove("is-leaving-back"); }, 1350);
        }
      });
      $$(".reel-text", slide).forEach(function (t, i) { t.classList.toggle("is-now", i === step); });
    }
    slide.dispatchEvent(new CustomEvent("gp:step", { detail: { step: step, animate: animate } }));
  }

  function countTo(el, to, animate) {
    var from = Number(el.textContent) || to;
    cancelAnimationFrame(el._raf);
    if (!animate || GP.reduced() || from === to) { el.textContent = to; return; }
    var t0 = performance.now();
    var tick = function (now) {
      var t = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (t < 1) el._raf = requestAnimationFrame(tick);
    };
    el._raf = requestAnimationFrame(tick);
  }
  GP.countTo = countTo;

  /* Atlas: o Império do Brasil aparece no contexto e volta na conclusão */
  var atlasTimer, atlasTimer2;
  function atlasFor(slide, instant) {
    if (!atlas) return;
    clearTimeout(atlasTimer);
    clearTimeout(atlasTimer2);
    var id = slide.id;
    var br = slide.hasAttribute("data-atlas-br");
    deck.classList.toggle("atlas-br", br);
    deck.classList.toggle("atlas-label", br);
    if (id === "conclusao" && !GP.reduced()) {
      atlas.go("continent", instant);
      atlas.redraw();
      atlasTimer = setTimeout(function () { if (slides[state.index] === slide) atlas.go("finale"); }, 1200);
      return;
    }
    atlas.go(slide.dataset.atlas || "brasil", instant);
  }

  /* Sincronização com o modo apresentador (outra janela ou aba) */
  function broadcast() {
    if (!bc || !slides) return;
    var s = slides[state.index];
    bc.postMessage({
      type: "state", index: state.index, step: state.step, steps: stepsOf(s), total: slides.length,
      id: s.id, title: s.dataset.title,
      list: slides.map(function (x) { return { id: x.id, title: x.dataset.title, steps: stepsOf(x) }; })
    });
  }

  function finish() {
    if (!busy) return;
    clearTimeout(busy.timer);
    busy.prev.classList.remove("is-leaving", "is-entering", "in");
    busy.next.classList.remove("is-entering");
    deck.classList.remove("is-transitioning");
    busy = null;
  }

  function go(n, opts) {
    opts = opts || {};
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (n === state.index && !opts.force) return;
    finish();
    var prev = slides[state.index], next = slides[n];
    var fwd = n > state.index;
    var instant = opts.instant || GP.reduced();
    var tr = n === 0 ? "reveal" : (fwd ? next.dataset.transition : prev.dataset.transition) || "dissolve";
    var spec = TR[tr] || TR.dissolve;
    deck.dataset.tr = tr;
    deck.dataset.dir = fwd ? "fwd" : "back";
    deck.style.setProperty("--tr-dur", spec[0] + "ms");
    if (opts.origin) {
      var r = deck.getBoundingClientRect();
      next.style.setProperty("--ox", ((opts.origin[0] - r.left) / r.width * 100).toFixed(1) + "%");
      next.style.setProperty("--oy", ((opts.origin[1] - r.top) / r.height * 100).toFixed(1) + "%");
    } else {
      next.style.removeProperty("--ox");
      next.style.removeProperty("--oy");
    }

    prev.dispatchEvent(new CustomEvent("gp:leave"));
    prev.classList.remove("is-current");
    prev.setAttribute("aria-hidden", "true");
    prev.inert = true;
    next.classList.add("is-current");
    next.removeAttribute("aria-hidden");
    next.inert = false;
    next.scrollTop = 0;

    state.index = n;
    state.step = !fwd && opts.fromPrev ? stepsOf(next) : 0;

    if (prev !== next && !instant) {
      prev.classList.add("is-leaving");
      next.classList.add("is-entering");
      deck.classList.add("is-transitioning");
      busy = { prev: prev, next: next };
      busy.timer = setTimeout(finish, spec[0] + 150);
    } else if (prev !== next) {
      prev.classList.remove("in");
    }
    next.classList.remove("in");
    void next.offsetWidth;
    setTimeout(function () {
      if (slides[state.index] !== next) return;
      next.classList.add("in");
      GP.runCounters(next);
      next.dispatchEvent(new CustomEvent("gp:enter"));
    }, instant ? 30 : spec[1]);

    if (stepsOf(next)) applyStep(next, state.step, false);
    atlasFor(next, instant);
    if (dust) { if ((next.dataset.fx || "").indexOf("dust") > -1) dust.start(); else dust.stop(); }
    setChrome();
    if (!opts.noHash) history.replaceState(null, "", "#" + next.id);
    $("#announcer").textContent = "Slide " + (n + 1) + " de " + slides.length + ": " + next.dataset.title;
    hideHint();
  }

  function next(e) {
    var s = slides[state.index];
    if (stepsOf(s) && state.step < stepsOf(s)) return setStep(state.step + 1);
    if (state.index < slides.length - 1) go(state.index + 1, { origin: e && e.clientX ? [e.clientX, e.clientY] : null });
  }
  function prev() {
    var s = slides[state.index];
    if (stepsOf(s) && state.step > 0) return setStep(state.step - 1);
    if (state.index > 0) go(state.index - 1, { fromPrev: true });
  }
  function setStep(k) {
    var s = slides[state.index];
    var before = state.step;
    state.step = Math.max(0, Math.min(stepsOf(s), k));
    applyStep(s, state.step, true, before);
    setChrome();
  }
  GP.go = go;
  GP.next = next;
  GP.prev = prev;
  GP.setStep = setStep;
  GP.state = state;
  GP.stepsOf = stepsOf;
  GP.slides = function () { return slides; };

  /* Modo apresentador */
  function openPresenter() {
    var w = window.open("presenter.html", "sr2-presenter", "width=1360,height=860");
    if (!w) toast('O navegador bloqueou a janela. <a href="presenter.html" target="_blank">Abrir o modo apresentador em outra aba</a>.', 9000);
    else toast("Modo apresentador aberto em outra janela. Arraste-a para a tela do notebook.", 5000);
  }
  var toastTimer;
  function toast(html, ms) {
    var t = $("#toast");
    t.innerHTML = html;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, ms || 4000);
  }
  GP.toast = toast;

  /* ---------- Sobreposições ---------- */
  var overlayStack = [];
  function openOverlay(el, trigger) {
    el.hidden = false;
    overlayStack.push({ el: el, trigger: trigger });
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    var f = el.querySelector("[data-close]") || el.querySelector("button");
    if (f) f.focus({ preventScroll: true });
  }
  function closeOverlay() {
    var top = overlayStack.pop();
    if (!top) return false;
    top.el.hidden = true;
    if (top.trigger) { top.trigger.setAttribute("aria-expanded", "false"); top.trigger.focus({ preventScroll: true }); }
    if (top.el.id === "lightbox") $("#lightboxImg").removeAttribute("src");
    return true;
  }
  function toggleOverlay(el, trigger) {
    if (!el.hidden) { while (overlayStack.length) { var t = overlayStack[overlayStack.length - 1]; closeOverlay(); if (t.el === el) break; } return; }
    openOverlay(el, trigger);
  }

  function buildOverview() {
    var grid = $("#overviewGrid");
    slides.forEach(function (s, i) {
      var li = document.createElement("li");
      li.style.setProperty("--i", i);
      var thumb = s.dataset.thumb || (s.querySelector("img[src]") && s.querySelector("img[src]").getAttribute("src"));
      var paper = s.classList.contains("theme-paper");
      li.innerHTML =
        '<button class="ov-card" type="button"><span class="ov-thumb ' + (paper ? "is-paper" : "is-dark") + '">' +
        (thumb && !paper ? '<img src="' + thumb + '" alt="" loading="lazy">' : "") +
        '<span class="ov-num">' + String(i + 1).padStart(2, "0") + "</span></span>" +
        '<span class="ov-text"><strong>' + s.dataset.title + "</strong><small>" + (s.dataset.kicker || "") + "</small></span></button>";
      li.querySelector("button").addEventListener("click", function () {
        closeOverlay();
        go(i);
      });
      grid.appendChild(li);
    });
  }
  function refreshOverview() {
    $$("#overviewGrid .ov-card").forEach(function (b, i) { b.setAttribute("aria-current", i === state.index ? "true" : "false"); });
  }

  function openLightbox(key, trigger) {
    var info = IMAGES[key];
    if (!info) return;
    var img = $("#lightboxImg");
    img.src = "assets/img/" + key + "." + (info[4] || "jpg");
    img.alt = info[0];
    $("#lightboxCaption").textContent = info[0];
    $("#lightboxSource").href = C + encodeURI(info[1]).replace(/,/g, "%2C");
    openOverlay($("#lightbox"), trigger);
  }

  function openRefs(trigger, ref) {
    var box = $("#refs");
    if (box.hidden) openOverlay(box, trigger);
    if (!ref) return;
    var li = document.getElementById("ref" + ref);
    if (li) setTimeout(function () {
      li.scrollIntoView({ block: "center", behavior: GP.reduced() ? "auto" : "smooth" });
      li.classList.remove("is-flash"); void li.offsetWidth; li.classList.add("is-flash");
    }, 120);
  }
  GP.openRefs = openRefs;

  function buildCredits() {
    var ul = $("#credits");
    if (!ul) return;
    Object.keys(IMAGES).forEach(function (k) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = C + encodeURI(IMAGES[k][1]).replace(/,/g, "%2C");
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = IMAGES[k][2] || IMAGES[k][0];
      li.appendChild(a);
      li.appendChild(document.createTextNode(" · " + (IMAGES[k][3] || "domínio público")));
      ul.appendChild(li);
    });
    var tail = document.createElement("li");
    tail.textContent = "Reproduções digitais: Wikimedia Commons (consultas em 19 e 20 nov. 2026). Mapas: Natural Earth (domínio público); ferrovias e áreas do café em traçado esquemático.";
    ul.appendChild(tail);
  }

  /* ---------- Tela cheia ---------- */
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function toggleFullscreen() {
    var root = document.documentElement;
    if (!fsElement()) {
      var req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) { var p = req.call(root); if (p && p.catch) p.catch(function () {}); }
    } else {
      var exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }
  function syncFullscreen() {
    var on = !!fsElement();
    var btn = $("#btnFull");
    btn.querySelector("use").setAttribute("href", on ? "#i-full-exit" : "#i-full");
    btn.setAttribute("aria-label", on ? "Sair da tela cheia" : "Tela cheia");
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  /* ---------- Dica de teclado e ociosidade ---------- */
  var hintTimer;
  function showHint() {
    var h = $("#keyHint");
    if (!window.matchMedia("(pointer: fine)").matches) h.innerHTML = "Deslize para os lados ou use as setas abaixo";
    h.classList.add("is-shown");
    hintTimer = setTimeout(hideHint, 6500);
  }
  function hideHint() { clearTimeout(hintTimer); $("#keyHint").classList.remove("is-shown"); }

  function idle() {
    var app = $("#app"), t;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    var wake = function () {
      app.classList.remove("is-idle");
      clearTimeout(t);
      t = setTimeout(function () { app.classList.add("is-idle"); }, 3200);
    };
    ["pointermove", "keydown", "pointerdown"].forEach(function (ev) { window.addEventListener(ev, wake, { passive: true }); });
    wake();
  }

  /* ---------- Inicialização ---------- */
  function init() {
    deck = $("#deck");
    slides = $$(".slide", deck);
    if (!window.GP_GEO) return;

    GP.splitText(deck);
    $$(".compass-ticks").forEach(function (g) {
      for (var i = 0; i < 72; i++) {
        var a = i * 5 * Math.PI / 180, r1 = i % 18 === 0 ? 70 : 74, r2 = 78;
        GP.svg("line", { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * r2, y2: -Math.cos(a) * r2 }, g);
      }
    });
    GP.initParallax(deck);
    atlas = new GP.Atlas($("#atlas"), deck);
    dust = new GP.Dust($("#dust"));
    try { GP.initMaps(deck); } catch (err) { console.error(err); }
    buildOverview();
    buildCredits();

    // marcas da barra de progresso
    var ticks = $("#progressTicks");
    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.tabIndex = -1;
      b.setAttribute("aria-label", "Ir para o slide " + (i + 1) + ": " + s.dataset.title);
      b.title = (i + 1) + " · " + s.dataset.title;
      b.addEventListener("click", function () { go(i); });
      ticks.appendChild(b);
    });

    slides.forEach(function (s, i) {
      s.setAttribute("role", "group");
      s.setAttribute("aria-roledescription", "slide");
      s.setAttribute("aria-label", (i + 1) + " de " + slides.length + ": " + s.dataset.title);
      s.setAttribute("aria-hidden", "true");
      s.inert = true;
    });

    // ponto de partida pela URL
    var start = 0, hash = location.hash.replace("#", "");
    if (hash) {
      var byId = slides.findIndex(function (s) { return s.id === hash; });
      if (byId > -1) start = byId;
      else if (/^\d+$/.test(hash)) start = Number(hash) - 1;
    }
    state.index = start;
    var first = slides[start];
    first.classList.add("is-current");
    first.removeAttribute("aria-hidden");
    first.inert = false;
    if (stepsOf(first)) applyStep(first, 0, false);
    setChrome();
    deck.classList.toggle("atlas-br", first.hasAttribute("data-atlas-br"));
    deck.classList.toggle("atlas-label", first.hasAttribute("data-atlas-br"));
    atlas.go(first.dataset.atlas || "brasil", true);

    var hero = first.querySelector(".opening-art img");
    var ready = Promise.all([
      document.fonts ? Promise.race([document.fonts.ready, wait(1500)]) : wait(0),
      hero && !hero.complete ? Promise.race([new Promise(function (r) { hero.onload = hero.onerror = r; }), wait(1800)]) : wait(0)
    ]);
    ready.then(function () {
      document.documentElement.classList.add("is-ready");
      atlas.draw();
      first.classList.add("in");
      GP.runCounters(first);
      first.dispatchEvent(new CustomEvent("gp:enter"));
      if ((first.dataset.fx || "").indexOf("dust") > -1) dust.start();
      if (!PREVIEW) setTimeout(showHint, start === 0 ? 4200 : 800);
      // pré-carrega as demais imagens depois da abertura
      setTimeout(function () { $$("img[loading=lazy]").forEach(function (img) { img.loading = "eager"; }); }, 2500);
    });

    if (PREVIEW) { bindPreview(); return; }
    bind();
    idle();
    if (GP.initAudio) GP.initAudio();
    if (bc) bc.onmessage = function (e) {
      var d = e.data || {};
      if (d.type === "hello") broadcast();
      else if (d.type === "cmd") {
        if (d.action === "next") next();
        else if (d.action === "prev") prev();
        else if (d.action === "goto") go(d.index);
        else if (d.action === "step") setStep(d.step);
      }
    };
    syncFullscreen();
    if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) $("#btnFull").hidden = true;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // Prévia: recebe da janela do apresentador qual slide e etapa mostrar
  function bindPreview() {
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type !== "gp-show" || typeof d.index !== "number") return;
      if (d.index !== state.index) go(d.index, { instant: true, noHash: true });
      var s = slides[state.index];
      if (stepsOf(s)) {
        var k = Math.max(0, Math.min(stepsOf(s), d.step === "last" ? stepsOf(s) : d.step || 0));
        if (k !== state.step) { state.step = k; applyStep(s, k, false); }
      }
    });
  }

  function bind() {
    $("#btnNext").addEventListener("click", function (e) { next(e); });
    $("#btnPrev").addEventListener("click", prev);
    $("#btnFull").addEventListener("click", toggleFullscreen);
    $("#btnIndex").addEventListener("click", function () { refreshOverview(); toggleOverlay($("#overview"), this); });
    $("#btnHelp").addEventListener("click", function () { toggleOverlay($("#help"), this); });
    $("#btnPresenter").addEventListener("click", openPresenter);
    $("#btnRefs").addEventListener("click", function () { toggleOverlay($("#refs"), this); });
    document.addEventListener("fullscreenchange", syncFullscreen);
    document.addEventListener("webkitfullscreenchange", syncFullscreen);

    document.addEventListener("click", function (e) {
      var t = e.target;
      var close = t.closest("[data-close]");
      if (close) { closeOverlay(); return; }
      if (t.classList && (t.id === "lightbox" || t.classList.contains("lightbox-inner") || t.id === "help" || t.id === "refs")) { closeOverlay(); return; }
      var lb = t.closest("[data-lightbox]");
      if (lb) { e.preventDefault(); openLightbox(lb.dataset.lightbox, lb); return; }
      var act = t.closest('[data-action="next"]');
      if (act) { next(e); return; }
      var stepBtn = t.closest("[data-goto-step]");
      if (stepBtn) { setStep(Number(stepBtn.dataset.gotoStep)); return; }
      var gotoBtn = t.closest("[data-goto]");
      if (gotoBtn) { e.preventDefault(); go(Number(gotoBtn.dataset.goto)); return; }
      var cite = t.closest("a.cite");
      if (cite) { e.preventDefault(); openRefs(cite, cite.dataset.ref); return; }
      var refsBtn = t.closest("[data-open-refs]");
      if (refsBtn) { e.preventDefault(); openRefs(refsBtn); return; }
    });

    document.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var k = e.key;
      if (k === "Escape") {
        if (closeOverlay()) e.preventDefault();
        else if (GP.audio && GP.audio.closePanel()) e.preventDefault();
        return;
      }
      if (overlayStack.length) {
        if (k === "Tab") trapFocus(e);
        return;
      }
      var tag = (e.target.tagName || "").toLowerCase();
      var onControl = tag === "button" || tag === "a" || tag === "input" || e.target.getAttribute("role") === "button";
      if (k === "ArrowRight" || k === "PageDown" || (k === " " && !onControl)) { e.preventDefault(); next(); }
      else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
      else if (k === "Home") { e.preventDefault(); go(0); }
      else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
      else if (k === "f" || k === "F") { toggleFullscreen(); }
      else if (k === "i" || k === "I" || k === "g" || k === "G") { refreshOverview(); toggleOverlay($("#overview"), $("#btnIndex")); }
      else if (k === "?" || k === "h" || k === "H") { toggleOverlay($("#help"), $("#btnHelp")); }
      else if (k === "p" || k === "P") { openPresenter(); }
      else if (k === "r" || k === "R") { toggleOverlay($("#refs"), $("#btnRefs")); }
      else if (GP.audio && (k === "a" || k === "A")) { GP.audio.togglePanel(); }
      else if (GP.audio && (k === "n" || k === "N")) { GP.audio.toggleNarration(); }
      else if (GP.audio && (k === "m" || k === "M")) { GP.audio.toggleMute(); }
    });

    // gestos de toque
    var sx = 0, sy = 0, st = 0, tracking = false;
    deck.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
    }, { passive: true });
    deck.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st < 900 && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) next(); else prev();
      }
    }, { passive: true });

    window.addEventListener("hashchange", function () {
      var id = location.hash.replace("#", "");
      var i = slides.findIndex(function (s) { return s.id === id; });
      if (i > -1 && i !== state.index) go(i, { noHash: true });
    });
  }

  function trapFocus(e) {
    var top = overlayStack[overlayStack.length - 1].el;
    var f = $$("button, a[href], [tabindex]:not([tabindex='-1'])", top).filter(function (x) { return !x.hidden && x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
