/* Áudio opcional: narração por slide (gravações reais listadas no manifesto) e trilha instrumental.
   Nada toca sozinho: a narração e a trilha só começam por ação de quem apresenta. */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});
  var BASE = "assets/audio/narracao/";

  GP.initAudio = function () {
    var $ = function (s) { return document.querySelector(s); };
    var panel = $("#audioPanel"), btn = $("#btnAudio");
    if (!panel || !btn) return;
    var ui = {
      status: $("#narrStatus"), play: $("#narrPlay"), replay: $("#narrReplay"), nextBtn: $("#narrNext"),
      bar: $("#narrBar"), auto: $("#narrAuto"), sync: $("#narrSync"),
      score: $("#scoreToggle"), volMaster: $("#volMaster"), volScore: $("#volScore"), mute: $("#muteAll")
    };
    var manifest = { slides: {} };
    var player = new Audio();
    player.preload = "none";
    var score = GP.Score ? new GP.Score() : null;
    var st = { wanted: false, muted: false, slideId: null, cuesDone: 0, loaded: false };

    // preferências (não iniciam áudio sozinhas)
    try {
      var saved = JSON.parse(localStorage.getItem("gp-audio") || "{}");
      if (typeof saved.master === "number") ui.volMaster.value = saved.master;
      if (typeof saved.score === "number") ui.volScore.value = saved.score;
      if (typeof saved.auto === "boolean") ui.auto.checked = saved.auto;
      if (typeof saved.sync === "boolean") ui.sync.checked = saved.sync;
    } catch (e) { /* armazenamento indisponível */ }
    function savePrefs() {
      try { localStorage.setItem("gp-audio", JSON.stringify({ master: +ui.volMaster.value, score: +ui.volScore.value, auto: ui.auto.checked, sync: ui.sync.checked })); } catch (e) { /* ignora */ }
    }

    function currentSlide() { return GP.slides()[GP.state.index]; }
    function entry(id) {
      var e = manifest.slides && manifest.slides[id];
      if (!e) return null;
      if (typeof e === "string") e = { arquivo: e };
      return e.arquivo ? e : null;
    }
    function fmt(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
    function count() { return Object.keys(manifest.slides || {}).filter(function (k) { return entry(k); }).length; }

    function render() {
      var s = currentSlide(), e = entry(s.id), playing = !player.paused && !player.ended;
      ui.play.disabled = !e;
      ui.replay.disabled = !e;
      ui.play.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
      ui.play.querySelector("span").textContent = playing ? "Pausar" : "Iniciar";
      ui.status.classList.toggle("is-warn", !e);
      if (!st.loaded) ui.status.textContent = "Verificando gravações…";
      else if (!count()) ui.status.textContent = "Ainda não há narração gravada. A estrutura está pronta: veja em assets/audio/narracao/LEIA-ME.md como adicionar as gravações. O texto para gravar está no modo apresentador (tecla P) e em ROTEIRO.md.";
      else if (!e) ui.status.textContent = "Este slide (" + s.dataset.title + ") ainda não tem gravação. " + count() + " de " + GP.slides().length + " slides gravados.";
      else ui.status.textContent = (playing ? "Narrando: " : "Pronta: ") + s.dataset.title + (player.duration ? " · " + fmt(player.currentTime) + " / " + fmt(player.duration) : "");
      btn.classList.toggle("is-playing", playing || !!(score && score.on));
    }

    function load(id) {
      var e = entry(id);
      st.slideId = id;
      st.cuesDone = 0;
      player.pause();
      ui.bar.style.width = "0%";
      if (!e) { player.removeAttribute("src"); player.load(); return false; }
      player.src = BASE + e.arquivo;
      player.load();
      return true;
    }
    function applyVolume() {
      var m = +ui.volMaster.value / 100;
      player.volume = Math.max(0, Math.min(1, m));
      player.muted = st.muted;
      if (score) score.set({ master: m, volume: +ui.volScore.value / 100, muted: st.muted });
    }
    function play() {
      var s = currentSlide();
      if (st.slideId !== s.id) load(s.id);
      if (!entry(s.id)) { render(); return; }
      st.wanted = true;
      applyVolume();
      var p = player.play();
      if (p && p.catch) p.catch(function () { st.wanted = false; render(); });
      if (score) score.set({ ducked: true });
    }
    function pause() {
      st.wanted = false;
      player.pause();
      if (score) score.set({ ducked: false });
      render();
    }

    player.addEventListener("timeupdate", function () {
      if (player.duration) ui.bar.style.width = (player.currentTime / player.duration * 100).toFixed(1) + "%";
      // sincroniza as etapas da cena com os tempos listados no manifesto
      var e = entry(st.slideId);
      if (e && ui.sync.checked && Array.isArray(e.etapas)) {
        while (st.cuesDone < e.etapas.length && player.currentTime >= e.etapas[st.cuesDone]) {
          st.cuesDone++;
          if (GP.stepsOf(currentSlide()) && GP.state.step < st.cuesDone) GP.setStep(st.cuesDone);
        }
      }
      render();
    });
    player.addEventListener("play", render);
    player.addEventListener("pause", render);
    player.addEventListener("ended", function () {
      if (score) score.set({ ducked: false });
      render();
      if (st.wanted && ui.auto.checked && GP.state.index < GP.slides().length - 1) GP.go(GP.state.index + 1);
    });
    player.addEventListener("error", function () {
      if (!player.getAttribute("src")) return;
      st.wanted = false;
      ui.status.textContent = "Não foi possível carregar a gravação deste slide (" + player.getAttribute("src") + ").";
      ui.status.classList.add("is-warn");
    });

    // troca de slide: se a narração estiver ativa, a do novo slide começa após a transição
    var changeTimer;
    document.addEventListener("gp:change", function (ev) {
      var s = ev.detail.slide;
      if (s.id === st.slideId) { render(); return; }
      clearTimeout(changeTimer);
      var keep = st.wanted;
      load(s.id);
      st.wanted = keep;
      render();
      if (keep && entry(s.id)) changeTimer = setTimeout(function () { if (currentSlide() === s) play(); }, 1300);
    });

    ui.play.addEventListener("click", function () { if (!player.paused) pause(); else play(); });
    ui.replay.addEventListener("click", function () {
      var s = currentSlide();
      load(s.id);
      if (GP.stepsOf(s) && ui.sync.checked) GP.setStep(0);
      play();
    });
    ui.nextBtn.addEventListener("click", function () { if (GP.state.index < GP.slides().length - 1) GP.go(GP.state.index + 1); });
    ui.auto.addEventListener("change", savePrefs);
    ui.sync.addEventListener("change", savePrefs);
    [ui.volMaster, ui.volScore].forEach(function (r) { r.addEventListener("input", function () { applyVolume(); savePrefs(); }); });
    ui.mute.addEventListener("click", function () { toggleMute(); });
    if (!score || !score.supported()) {
      ui.score.disabled = true;
      ui.score.querySelector("span").textContent = "Trilha indisponível neste navegador";
    }
    ui.score.addEventListener("click", function () {
      if (!score) return;
      if (score.on) score.stop(); else { applyVolume(); score.start(); }
      ui.score.setAttribute("aria-pressed", score.on ? "true" : "false");
      ui.score.querySelector("span").textContent = score.on ? "Desligar trilha" : "Ligar trilha";
      ui.score.querySelector("use").setAttribute("href", score.on ? "#i-pause" : "#i-play");
      render();
    });

    function toggleMute() {
      st.muted = !st.muted;
      ui.mute.setAttribute("aria-pressed", st.muted ? "true" : "false");
      ui.mute.querySelector("span").textContent = st.muted ? "Reativar o som" : "Silenciar tudo";
      applyVolume();
      if (GP.toast) GP.toast(st.muted ? "Áudio silenciado." : "Áudio reativado.", 1800);
    }
    function openPanel() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); render(); }
    function closePanel() {
      if (panel.hidden) return false;
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      return true;
    }
    btn.addEventListener("click", function () { if (panel.hidden) openPanel(); else closePanel(); });
    panel.querySelector("[data-close]").addEventListener("click", function (e) { e.stopPropagation(); closePanel(); btn.focus(); });

    GP.audio = {
      togglePanel: function () { if (panel.hidden) openPanel(); else closePanel(); },
      closePanel: closePanel,
      toggleNarration: function () {
        if (!entry(currentSlide().id)) { openPanel(); return; }
        if (!player.paused) pause(); else play();
      },
      toggleMute: toggleMute,
      manifest: function () { return manifest; },
      score: score,
      player: player
    };

    fetch(BASE + "manifest.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : { slides: {} }; })
      .catch(function () { return { slides: {} }; })
      .then(function (m) {
        manifest = m && m.slides ? m : { slides: {} };
        st.loaded = true;
        applyVolume();
        render();
      });
  };
})();
