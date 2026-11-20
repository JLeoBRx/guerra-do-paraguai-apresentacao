/* Modo apresentador: notas, prévias, cronômetros e controle remoto da apresentação. */
(function () {
  "use strict";
  var NOTES = window.GP_NOTES || {};
  var $ = function (s) { return document.querySelector(s); };
  var bc = "BroadcastChannel" in window ? new BroadcastChannel("sr2-apresentacao") : null;
  var state = null, lastSeen = 0, list = [];
  var t = { running: false, acc: 0, since: 0, slideAcc: 0, slideSince: 0, started: false };

  function now() { return Date.now(); }
  function mmss(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function total() { return t.acc + (t.running ? now() - t.since : 0); }
  function slideTotal() { return t.slideAcc + (t.running ? now() - t.slideSince : 0); }
  function setRunning(on) {
    if (on === t.running) return;
    if (on) { t.since = now(); t.slideSince = now(); t.started = true; }
    else { t.acc = total(); t.slideAcc = slideTotal(); }
    t.running = on;
    var b = $("#pvStart");
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.textContent = on ? "Pausar cronômetro" : (t.acc ? "Retomar cronômetro" : "Iniciar cronômetro");
  }
  function reset() {
    var wasRunning = t.running;
    t.running = false; t.acc = 0; t.slideAcc = 0; t.started = false;
    setRunning(wasRunning);
    if (!wasRunning) $("#pvStart").textContent = "Iniciar cronômetro";
    tick();
  }
  function plannedBefore(index) {
    var sum = 0;
    for (var i = 0; i < index && i < list.length; i++) sum += ((NOTES[list[i].id] || {}).tempo || 0) * 1000;
    return sum;
  }
  function planTotal() { return list.reduce(function (s, x) { return s + ((NOTES[x.id] || {}).tempo || 0) * 1000; }, 0); }

  function tick() {
    var d = new Date();
    $("#pvClock").textContent = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    $("#pvElapsed").textContent = mmss(total());
    $("#pvSlideTime").textContent = mmss(slideTotal());
    if (state) {
      var est = ((NOTES[state.id] || {}).tempo || 0) * 1000;
      var ratio = est ? slideTotal() / est : 0;
      var m = $("#pvMeter");
      m.style.width = Math.min(100, ratio * 100).toFixed(1) + "%";
      m.classList.toggle("is-late", ratio > 1);
      var diff = (total() - slideTotal()) - plannedBefore(state.index);
      var pace = $("#pvPace");
      if (!t.started) pace.textContent = "O cronômetro começa sozinho quando você avançar do primeiro slide, ou no botão acima.";
      else if (Math.abs(diff) < 10000) pace.textContent = "Ritmo: no tempo planejado.";
      else pace.textContent = "Ritmo: " + mmss(Math.abs(diff)) + (diff > 0 ? " atrasado em relação ao plano." : " adiantado em relação ao plano.");
    }
    var link = $("#pvLink"), on = now() - lastSeen < 7000;
    link.dataset.state = on ? "on" : "wait";
    link.querySelector("span").textContent = on ? "Conectado à apresentação" : "Apresentação não encontrada";
    $("#pvOpen").hidden = on;
  }

  // Prévias: iframes em escala, controlados por mensagem
  var frames = { cur: $("#pvCur"), next: $("#pvNext") };
  var shows = { cur: null, next: null };
  function fit() {
    ["Cur", "Next"].forEach(function (k) {
      var wrap = $("#pv" + k + "Wrap"), f = $("#pv" + k);
      f.style.transform = "scale(" + (wrap.clientWidth / 1600).toFixed(4) + ")";
    });
  }
  function show(which, msg) {
    shows[which] = msg;
    try { frames[which].contentWindow.postMessage(msg, location.origin === "null" ? "*" : location.origin); } catch (e) { /* prévia indisponível */ }
  }
  Object.keys(frames).forEach(function (k) {
    frames[k].addEventListener("load", function () { setTimeout(function () { if (shows[k]) show(k, shows[k]); }, 600); });
  });

  function render() {
    if (!state) return;
    var n = NOTES[state.id] || {};
    $("#pvNum").textContent = String(state.index + 1).padStart(2, "0");
    $("#pvTotal").textContent = String(state.total).padStart(2, "0");
    $("#pvTitle").textContent = state.title;
    var stepEl = $("#pvStep");
    stepEl.hidden = !state.steps;
    stepEl.textContent = "Tópico " + (state.step + 1) + " de " + (state.steps + 1) + " · → mostra o próximo";
    var ano = $("#pvAno");
    ano.hidden = !n.ano;
    ano.textContent = n.ano ? "Onde estamos no tempo: " + n.ano : "";
    // lista de tópicos: mostra onde o grupo está ("você está aqui")
    var tl = $("#pvTopics");
    var topicos = n.topicos || [];
    tl.hidden = !topicos.length;
    tl.innerHTML = "";
    topicos.forEach(function (txt, i) {
      var li = document.createElement("li");
      li.textContent = txt;
      if (state.steps) {
        if (i < state.step) li.className = "is-done";
        else if (i === state.step) li.className = "is-now";
      }
      tl.appendChild(li);
    });
    var etapa = n.etapas && n.etapas[state.step];
    $("#pvEtapaBox").hidden = !etapa;
    $("#pvEtapaLabel").textContent = "Agora · " + (topicos[state.step] || ("tópico " + (state.step + 1)));
    $("#pvEtapa").textContent = etapa || "";
    $("#pvFala").textContent = n.fala || "Sem roteiro para este slide.";
    // depois do primeiro tópico, a abertura já foi dita: fica em segundo plano
    $("#pvFalaBox").classList.toggle("is-said", !!state.steps && state.step > 0);
    $("#pvHoje").textContent = n.hoje || "";
    $("#pvHojeBox").hidden = !n.hoje;
    $("#pvComp").textContent = n.complemento || "";
    $("#pvComp").parentNode.hidden = !n.complemento;
    $("#pvTrans").textContent = n.transicao || "";
    $("#pvEstimate").textContent = "Estimado: " + mmss((n.tempo || 0) * 1000);
    $("#pvPlan").textContent = "Plano: " + mmss(planTotal());
    show("cur", { type: "gp-show", index: state.index, step: state.step });
    var label = $("#pvNextLabel");
    if (state.step < state.steps) {
      label.textContent = "A seguir: tópico " + (state.step + 2) + " de " + (state.steps + 1);
      show("next", { type: "gp-show", index: state.index, step: state.step + 1 });
    } else if (state.index < state.total - 1) {
      var nx = list[state.index + 1];
      label.textContent = "A seguir: " + (nx ? nx.title : "próximo slide");
      show("next", { type: "gp-show", index: state.index + 1, step: 0 });
    } else {
      label.textContent = "Fim da apresentação";
      show("next", { type: "gp-show", index: state.index, step: "last" });
    }
    var sel = $("#pvGoto");
    if (sel.options.length !== list.length) {
      sel.innerHTML = "";
      list.forEach(function (x, i) {
        var o = document.createElement("option");
        o.value = i;
        o.textContent = String(i + 1).padStart(2, "0") + " · " + x.title;
        sel.appendChild(o);
      });
    }
    sel.value = state.index;
    document.title = (state.index + 1) + "/" + state.total + " · " + state.title + " — Modo apresentador";
  }

  function cmd(action, extra) {
    if (!bc) return;
    var msg = { type: "cmd", action: action };
    for (var k in extra || {}) msg[k] = extra[k];
    bc.postMessage(msg);
  }

  if (bc) {
    bc.onmessage = function (e) {
      var d = e.data || {};
      if (d.type !== "state") return;
      lastSeen = now();
      var changed = !state || state.index !== d.index;
      if (changed && state && !t.started) setRunning(true);
      if (changed) { t.slideAcc = 0; t.slideSince = now(); }
      state = d;
      list = d.list || list;
      render();
      tick();
    };
    bc.postMessage({ type: "hello" });
    setInterval(function () { bc.postMessage({ type: "hello" }); }, 3000);
  } else {
    $("#pvFala").textContent = "Este navegador não permite a comunicação entre janelas (BroadcastChannel). Use um navegador atualizado.";
  }

  $("#pvPrev").addEventListener("click", function () { cmd("prev"); });
  $("#pvNextBtn").addEventListener("click", function () { cmd("next"); });
  $("#pvGoto").addEventListener("change", function () { cmd("goto", { index: Number(this.value) }); });
  $("#pvStart").addEventListener("click", function () { setRunning(!t.running); tick(); });
  $("#pvReset").addEventListener("click", reset);
  $("#pvOpen").addEventListener("click", function () { window.open("index.html", "sr2-main"); });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || (e.target.tagName || "").toLowerCase() === "select") return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); cmd("next"); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); cmd("prev"); }
    else if (k === "Home") { e.preventDefault(); cmd("goto", { index: 0 }); }
    else if (k === "End" && list.length) { e.preventDefault(); cmd("goto", { index: list.length - 1 }); }
    else if (k === "t" || k === "T") { setRunning(!t.running); tick(); }
    else if (k === "r" || k === "R") { reset(); }
  });
  new ResizeObserver(fit).observe(document.body);
  fit();
  setInterval(tick, 500);
  tick();
})();
