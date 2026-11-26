/* Modo apresentador: roteiro de falas por integrante, prévias, cronômetros e controle da projeção.
   Dois modos, escolhidos sozinhos:
   - conectado: a apresentação (index.html) está aberta em outra janela ou aba deste navegador;
     esta tela acompanha o slide e o tópico projetados e controla a projeção;
   - consulta: não há projeção conectada (por exemplo, no celular); o roteiro avança só nesta tela.
     Se o mesmo aparelho estiver projetando, a turma vê esta tela: ela não é uma tela privada. */
(function () {
  "use strict";
  var NOTES = window.GP_NOTES || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PEND = "Responsável a definir";
  var COLORS = { "Pedro Henrique": "#ffc94d", "Anthony Marcos": "#7dbcff", "Lohan David": "#7ddc8a", "Gabriel Willian": "#ffa36b", "Leandro Farias": "#ff8fc4", "Clara Maria": "#cdb6ff" };
  var CUE_SECONDS = { "AGUARDAR A ANIMAÇÃO": 2, "FAZER UMA PAUSA": 2, "CLICAR NA TELA": 2, "APONTAR PARA O MAPA": 1, "APONTAR PARA A TELA": 1, "DESTACAR A IMAGEM": 1, "OLHAR PARA A TURMA": 1 };
  var LIST = Object.keys(NOTES).map(function (id) {
    var n = NOTES[id];
    return { id: id, title: n.titulo || id, steps: Math.max(0, (n.etapas || []).length - 1) };
  });
  var N = LIST.length;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var wide = window.matchMedia("(min-width: 1000px) and (min-height: 560px)");
  var bc = "BroadcastChannel" in window ? new BroadcastChannel("gp-apresentacao") : null;
  var isPopup = false;
  try { isPopup = !!(window.opener && !window.opener.closed && window.name === "gp-presenter"); } catch (e) { isPopup = false; }

  var S = { index: 0, step: 0, cursor: 0 };
  var link = { on: false, lastSeen: 0 };
  var pending = null;
  var built = -1;
  var t = { running: false, acc: 0, since: 0, slideAcc: 0, slideSince: 0, started: false };

  /* ---------- utilidades ---------- */
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* armazenamento indisponível */ } }
  function recall(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key) || "null"); return v === null ? fallback : v; } catch (e) { return fallback; } }
  var done = recall("gp-pv-done", {});
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // cor de cada integrante (e a mesma cor em rgb, para transparências)
  function paint(el, name) {
    var hex = COLORS[name] || "#c7cfe2", v = parseInt(hex.slice(1), 16);
    el.style.setProperty("--who", hex);
    el.style.setProperty("--who-rgb", (v >> 16 & 255) + ", " + (v >> 8 & 255) + ", " + (v & 255));
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function mmss(ms) { var s = Math.max(0, Math.round(ms / 1000)); return pad(Math.floor(s / 60)) + ":" + pad(s % 60); }
  function now() { return Date.now(); }
  function joinNames(a) { return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]; }
  function spoken(text) { return String(text || "").replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim(); }
  function words(text) { var m = spoken(text).match(/[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9'’\-–]*/g); return m ? m.length : 0; }
  function cues(text) { var out = [], re = /\[([^\]]+)\]/g, m; while ((m = re.exec(text))) out.push(m[1].trim()); return out; }
  function segSeconds(txt) { return words(txt) / 2.4 + cues(txt).reduce(function (s, c) { return s + (CUE_SECONDS[c.split(":")[0].trim()] || 0); }, 0); }
  var toastTimer;
  function toast(msg, ms) {
    var el = $("#pvToast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, ms || 3200);
  }

  /* ---------- roteiro ---------- */
  function noteOf(i) { return NOTES[LIST[i].id] || {}; }
  function respOf(n) { return n.pendente || !(n.responsaveis || []).length ? [] : n.responsaveis; }
  function speakerOf(s, n) { return s.quem || (respOf(n).length === 1 ? respOf(n)[0] : PEND); }
  var segCache = {};
  function segsOf(i) {
    if (segCache[i]) return segCache[i];
    var n = noteOf(i), out = [], last = Math.max(0, (n.etapas || []).length - 1);
    (n.intro || []).forEach(function (s, k) { out.push({ tipo: "intro", rotulo: k ? "Abertura (continuação)" : "Abertura do slide", etapa: 0, quem: speakerOf(s, n), texto: s.texto }); });
    (n.etapas || []).forEach(function (s, k) { out.push({ tipo: "topico", rotulo: "Tópico " + (k + 1) + ((n.topicos || [])[k] ? " · " + n.topicos[k] : ""), etapa: k, quem: speakerOf(s, n), texto: s.texto }); });
    if (n.hoje) out.push({ tipo: "hoje", rotulo: "Com os olhos de hoje", etapa: last, quem: speakerOf(n.hoje, n), texto: n.hoje.texto });
    if (n.encerramento) out.push({ tipo: "fim", rotulo: "Encerramento e transição", etapa: last, quem: speakerOf(n.encerramento, n), texto: n.encerramento.texto });
    return (segCache[i] = out);
  }
  function firstOfStep(i, step) {
    var segs = segsOf(i);
    for (var k = 0; k < segs.length; k++) if (segs[k].etapa === step) return k;
    return 0;
  }
  var pendSlides = LIST.map(function (x, i) { return noteOf(i).pendente ? i + 1 : 0; }).filter(Boolean);
  function handoff(i) {
    if (i >= N - 1) return { kind: "end", title: "Fim da apresentação", text: "Abram para as perguntas da turma." };
    var n = noteOf(i), nx = noteOf(i + 1), next = segsOf(i + 1)[0], resp = respOf(n);
    var where = "Slide " + pad(i + 2) + " · " + LIST[i + 1].title;
    if (n.pendente && nx.pendente) return { kind: "slide", title: "Avançar para o próximo slide", text: where + ". Se os slides " + joinNames(pendSlides.map(String)) + " ficarem com pessoas diferentes, passe a palavra aqui." };
    if (nx.pendente) return { kind: "pass", who: PEND, title: "Passar a palavra: responsável a definir", text: where + " (slides " + joinNames(pendSlides.map(String)) + " pendentes de distribuição)." };
    var same = resp.indexOf(next.quem) > -1 && respOf(nx).every(function (p) { return resp.indexOf(p) > -1; });
    if (same) return { kind: "slide", title: "Avançar para o próximo slide", text: where + ". Começa: " + next.quem + "." };
    return { kind: "pass", who: next.quem, title: "Passar a palavra: " + next.quem, text: where + "." };
  }
  function shortLabel(g) { return g.tipo === "topico" ? "Tópico " + (g.etapa + 1) : g.rotulo; }
  function isDone(i, k) { return (done[LIST[i].id] || []).indexOf(k) > -1; }
  function setDone(i, k, on) {
    var id = LIST[i].id, arr = (done[id] || []).filter(function (x) { return x !== k; });
    if (on) arr.push(k);
    done[id] = arr;
    store("gp-pv-done", done);
  }

  /* ---------- texto com orientações ---------- */
  function cueLabel(c) {
    var key = c.split(":")[0].trim(), target = c.indexOf(":") > -1 ? c.slice(c.indexOf(":") + 1).trim() : "";
    return { key: key, target: target, label: key.charAt(0) + key.slice(1).toLowerCase() + (target ? ": " + target : "") };
  }
  function fillText(el, text) {
    el.textContent = "";
    var re = /\[([^\]]+)\]/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var c = cueLabel(m[1].trim());
      var click = c.key === "CLICAR NA TELA" && c.target;
      var chip = document.createElement(click ? "button" : "span");
      chip.className = "cue" + (click ? " cue-click" : "");
      if (click) { chip.type = "button"; chip.dataset.event = c.target; chip.title = "Destacar este acontecimento na projeção"; }
      chip.textContent = c.label;
      el.appendChild(chip);
      last = re.lastIndex;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }

  /* ---------- montagem do slide ---------- */
  function buildScript(i) {
    var box = $("#pvScript"), segs = segsOf(i), n = noteOf(i);
    box.textContent = "";
    segs.forEach(function (g, k) {
      var art = document.createElement("article");
      art.className = "seg seg-" + g.tipo;
      art.dataset.k = k;
      paint(art, g.quem);
      var head = document.createElement("header");
      head.className = "seg-head";
      var go = document.createElement("button");
      go.type = "button";
      go.className = "seg-go";
      go.innerHTML = '<span class="seg-label"></span><span class="seg-meta"><b class="seg-who"></b><span class="seg-time"></span></span>';
      go.querySelector(".seg-label").textContent = g.rotulo;
      go.querySelector(".seg-who").textContent = g.quem;
      go.querySelector(".seg-time").textContent = "≈ " + Math.max(1, Math.round(segSeconds(g.texto))) + " s";
      go.setAttribute("aria-label", "Ir para esta fala: " + g.rotulo + ", " + g.quem);
      var chk = document.createElement("button");
      chk.type = "button";
      chk.className = "seg-done";
      chk.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg><span class="sr-only">Marcar como apresentada</span>';
      head.appendChild(go);
      head.appendChild(chk);
      art.appendChild(head);
      var p = document.createElement("p");
      p.className = "seg-text";
      fillText(p, g.texto);
      art.appendChild(p);
      var nx = segs[k + 1];
      if (g.tipo === "topico" && nx && nx.tipo === "topico") {
        var adv = document.createElement("p");
        adv.className = "seg-after";
        adv.textContent = "Avançar o tópico → mostra o tópico " + (nx.etapa + 1);
        art.appendChild(adv);
      }
      if (g.tipo === "fim") {
        var h = handoff(i), pass = document.createElement("p");
        pass.className = "seg-after seg-pass";
        pass.textContent = h.title;
        art.appendChild(pass);
      }
      box.appendChild(art);
    });
    // lista de tópicos
    var tl = $("#pvTopics"), topicos = n.topicos || [];
    tl.textContent = "";
    tl.hidden = !topicos.length;
    topicos.forEach(function (txt, k) {
      var li = document.createElement("li");
      li.textContent = txt;
      li.dataset.k = k;
      tl.appendChild(li);
    });
    // se perguntarem
    var qa = $("#pvPerguntas"), list = n.perguntas || [];
    qa.textContent = "";
    $("#pvQA").hidden = !list.length;
    list.forEach(function (q) {
      var li = document.createElement("li"), m = q.match(/^([^?]+\?)\s*([\s\S]*)$/);
      if (m) { var b = document.createElement("strong"); b.textContent = m[1] + " "; li.appendChild(b); li.appendChild(document.createTextNode(m[2])); }
      else li.textContent = q;
      qa.appendChild(li);
    });
    built = i;
  }

  /* ---------- desenho do estado atual ---------- */
  function render(scroll) {
    if (!N) return;
    S.index = clamp(S.index, 0, N - 1);
    var i = S.index, item = LIST[i], n = noteOf(i);
    S.step = clamp(S.step, 0, item.steps);
    var segs = segsOf(i);
    S.cursor = clamp(S.cursor, 0, segs.length - 1);
    var changed = built !== i;
    if (changed) buildScript(i);
    var cur = segs[S.cursor];

    $("#pvNum").textContent = pad(i + 1);
    $("#pvTotal").textContent = pad(N);
    $("#pvTitle").textContent = item.title;
    var resp = respOf(n);
    $("#pvEst").textContent = "≈ " + mmss((n.tempo || 0) * 1000).replace(/^0/, "") + (n.ano ? " · " + n.ano : "");

    // quem fala agora
    var sp = $("#pvSpeaker");
    paint(sp, cur.quem);
    sp.classList.toggle("is-pending", cur.quem === PEND);
    $("#pvSpeakerName").textContent = cur.quem;
    $("#pvSpeakerWhat").textContent = shortLabel(cur) + " · ≈ " + Math.max(1, Math.round(segSeconds(cur.texto))) + " s" + (n.pendente ? " · pendente de distribuição" : "");
    var nextSeg = segs[S.cursor + 1], nextTxt;
    if (nextSeg) nextTxt = "Depois: " + nextSeg.quem + " · " + shortLabel(nextSeg);
    else if (i < N - 1) nextTxt = "Depois: " + segsOf(i + 1)[0].quem + " · slide " + (i + 2);
    else nextTxt = "Depois: perguntas da turma";
    $("#pvSpeakerNext").textContent = nextTxt;

    // progresso geral e tópicos
    var bar = $("#pvSlides");
    if (bar.children.length !== N) { bar.textContent = ""; LIST.forEach(function () { bar.appendChild(document.createElement("i")); }); }
    Array.prototype.forEach.call(bar.children, function (el, k) {
      el.className = k < i ? "is-past" : k === i ? "is-now" : "";
      if (k === i) el.style.setProperty("--fill", item.steps ? ((S.step + 1) / (item.steps + 1)).toFixed(3) : "1");
    });
    var topicos = n.topicos || [];
    $("#pvStep").textContent = item.steps ? "Tópico " + (S.step + 1) + " de " + (item.steps + 1) + (topicos[S.step] ? " · " + topicos[S.step] : "") : "Sem tópicos por clique";
    var nxt = S.step < item.steps ? "Próximo: " + (topicos[S.step + 1] || "tópico " + (S.step + 2)) : i < N - 1 ? "Próximo slide: " + LIST[i + 1].title : "Último slide";
    $("#pvStepNext").textContent = nxt;
    $$("#pvTopics li").forEach(function (li, k) {
      li.className = k < S.step ? "is-done" : k === S.step ? "is-now" : "";
    });

    // cartões de fala
    $$("#pvScript .seg").forEach(function (art, k) {
      var g = segs[k];
      art.classList.toggle("is-now", k === S.cursor);
      art.classList.toggle("is-past", k < S.cursor);
      art.classList.toggle("is-next", k === S.cursor + 1);
      art.classList.toggle("is-step", g.etapa === S.step);
      art.classList.toggle("is-ahead", g.etapa > S.step);
      var d = isDone(i, k);
      art.classList.toggle("is-done", d);
      var b = art.querySelector(".seg-done");
      b.setAttribute("aria-pressed", d ? "true" : "false");
      b.querySelector(".sr-only").textContent = d ? "Desmarcar: ainda não apresentada" : "Marcar como apresentada";
      art.querySelectorAll(".cue-click").forEach(function (c) { c.disabled = !(link.on && item.id === "cronologia"); });
    });

    // transição para o próximo slide
    var h = handoff(i), hb = $("#pvHandoff");
    hb.className = "pv-handoff is-" + h.kind + (S.cursor === segs.length - 1 ? " is-now" : "");
    paint(hb, h.who);
    hb.innerHTML = '<p class="pv-handoff-label">Para passar ao próximo slide</p><p class="pv-handoff-title"></p><p class="pv-handoff-text"></p>';
    hb.querySelector(".pv-handoff-title").textContent = h.title;
    hb.querySelector(".pv-handoff-text").textContent = h.text;

    // botões
    var atEnd = i === N - 1 && S.cursor === segs.length - 1;
    $("#pvSlidePrev").disabled = i === 0;
    $("#pvTopicPrev").disabled = i === 0 && S.step === 0;
    $("#pvSlideNext").disabled = i === N - 1;
    $("#pvSpeechNext").disabled = atEnd;
    var lab = $("#pvSpeechNextLabel"), sub = $("#pvSpeechNextSub");
    lab.textContent = atEnd ? "Fim do roteiro" : "Avançar fala";
    if (atEnd) sub.textContent = "perguntas da turma";
    else if (!nextSeg) sub.textContent = "vai para o slide " + (i + 2);
    else if (nextSeg.etapa !== S.step) sub.textContent = "mostra o tópico " + (nextSeg.etapa + 1);
    else sub.textContent = "próxima fala, mesmo tópico";
    var sel = $("#pvGoto");
    if (sel.options.length !== N) {
      sel.textContent = "";
      LIST.forEach(function (x, k) {
        var o = document.createElement("option");
        o.value = k;
        o.textContent = pad(k + 1) + " · " + x.title;
        sel.appendChild(o);
      });
    }
    sel.value = String(i);
    renderAll();

    // prévias e tempo
    $("#pvEstimate").textContent = "Estimado: " + mmss((n.tempo || 0) * 1000);
    $("#pvPlan").textContent = "Plano: " + mmss(planTotal());
    updatePreviews();
    document.title = (i + 1) + "/" + N + " · " + cur.quem + " · " + item.title + " — Modo apresentador";
    store("gp-pv-pos", { index: S.index, step: S.step, cursor: S.cursor });
    if (scroll !== false) scrollToCurrent(changed || scroll === "instant");
  }

  function renderAll() {
    var ol = $("#pvAll");
    if (ol.children.length !== N) {
      ol.textContent = "";
      LIST.forEach(function (x, k) {
        var li = document.createElement("li"), b = document.createElement("button");
        b.type = "button";
        b.dataset.index = k;
        b.innerHTML = '<span class="pa-num"></span><span class="pa-body"><strong></strong><small></small></span><span class="pa-done"></span>';
        b.querySelector(".pa-num").textContent = pad(k + 1);
        b.querySelector("strong").textContent = x.title;
        var n = noteOf(k);
        b.querySelector("small").textContent = (respOf(n).length ? joinNames(respOf(n)) : "Pendente de distribuição") + " · " + mmss((n.tempo || 0) * 1000);
        li.appendChild(b);
        ol.appendChild(li);
      });
    }
    $$("#pvAll button").forEach(function (b, k) {
      b.setAttribute("aria-current", k === S.index ? "true" : "false");
      var total = segsOf(k).length, d = (done[LIST[k].id] || []).length;
      b.querySelector(".pa-done").textContent = d ? d + "/" + total : "";
      b.classList.toggle("is-complete", d >= total);
    });
  }

  // rolagem automática até a fala atual (sem perder a posição ao girar a tela)
  function scroller() { return getComputedStyle($("#pvMain")).overflowY === "auto" ? $("#pvMain") : null; }
  function scrollToCurrent(instant) {
    var art = $("#pvScript .seg.is-now");
    if (!art) return;
    var box = scroller();
    var behavior = instant || reduced ? "auto" : "smooth";
    if (box) {
      var top = art.offsetTop - box.offsetTop - 10;
      box.scrollTo({ top: Math.max(0, top), behavior: behavior });
    } else {
      var head = $(".pv-top").getBoundingClientRect().height;
      var y = art.getBoundingClientRect().top + window.pageYOffset - head - 10;
      window.scrollTo({ top: Math.max(0, y), behavior: behavior });
    }
  }

  /* ---------- comandos ---------- */
  function cmd(action, extra) {
    extra = extra || {};
    if (link.on && bc) {
      var msg = { type: "cmd", action: action };
      Object.keys(extra).forEach(function (k) { msg[k] = extra[k]; });
      bc.postMessage(msg);
      return;
    }
    var before = S.index;
    if (action === "next") {
      if (S.step < LIST[S.index].steps) S.step++;
      else if (S.index < N - 1) { S.index++; S.step = 0; }
    } else if (action === "prev") {
      if (S.step > 0) S.step--;
      else if (S.index > 0) { S.index--; S.step = LIST[S.index].steps; }
    } else if (action === "goto") {
      S.index = clamp(extra.index, 0, N - 1);
      S.step = clamp(extra.step || 0, 0, LIST[S.index].steps);
    } else if (action === "step") {
      S.step = clamp(extra.step, 0, LIST[S.index].steps);
    } else return;
    arrive(before);
  }
  // depois de qualquer mudança de slide ou tópico (local ou vinda da projeção)
  function arrive(before) {
    if (pending && pending.index === S.index && pending.step === S.step) S.cursor = pending.cursor;
    else S.cursor = firstOfStep(S.index, S.step);
    pending = null;
    if (before !== S.index) {
      t.slideAcc = 0;
      t.slideSince = now();
      if (!t.started) setRunning(true);
    }
    render();
    tick();
  }
  function expect(index, step, cursor) { pending = { index: index, step: step, cursor: cursor }; setTimeout(function () { if (pending && pending.index === index && pending.cursor === cursor) pending = null; }, 2500); }

  function advanceSpeech() {
    var segs = segsOf(S.index);
    setDone(S.index, S.cursor, true);
    if (S.cursor < segs.length - 1) {
      var nx = segs[S.cursor + 1];
      if (nx.etapa !== S.step) { expect(S.index, nx.etapa, S.cursor + 1); cmd("step", { step: nx.etapa }); }
      else { S.cursor++; render(); }
    } else if (S.index < N - 1) {
      expect(S.index + 1, 0, 0);
      cmd("goto", { index: S.index + 1, step: 0 });
    } else render();
  }
  function backSpeech() {
    var segs = segsOf(S.index);
    if (S.cursor > 0) {
      var pv = segs[S.cursor - 1];
      if (pv.etapa !== S.step) { expect(S.index, pv.etapa, S.cursor - 1); cmd("step", { step: pv.etapa }); }
      else { S.cursor--; render(); }
    } else if (S.index > 0) {
      var pi = S.index - 1;
      expect(pi, LIST[pi].steps, segsOf(pi).length - 1);
      cmd("goto", { index: pi, step: LIST[pi].steps });
    }
  }
  function jumpTo(k) {
    var g = segsOf(S.index)[k];
    if (!g) return;
    if (g.etapa !== S.step) { expect(S.index, g.etapa, k); cmd("step", { step: g.etapa }); }
    else { S.cursor = k; render(); }
  }
  function toggleCurrentDone() {
    var d = !isDone(S.index, S.cursor);
    setDone(S.index, S.cursor, d);
    render(false);
    toast(d ? "Fala marcada como apresentada." : "Marca removida.", 1600);
  }

  /* ---------- prévias da projeção ---------- */
  var frames = { cur: $("#pvCur"), next: $("#pvNext") };
  var shows = { cur: null, next: null };
  function previewsOpen() { return $("#pvPreviewBox").open; }
  function fit() {
    ["Cur", "Next"].forEach(function (k) {
      var wrap = $("#pv" + k + "Wrap"), f = $("#pv" + k);
      if (wrap.clientWidth) f.style.transform = "scale(" + (wrap.clientWidth / 1600).toFixed(4) + ")";
    });
  }
  function show(which, msg) {
    shows[which] = msg;
    var f = frames[which];
    if (!f.getAttribute("src")) return;
    try { f.contentWindow.postMessage(msg, location.origin === "null" ? "*" : location.origin); } catch (e) { /* prévia indisponível */ }
  }
  function loadFrames() {
    var list = wide.matches ? ["cur", "next"] : ["cur"];
    list.forEach(function (k) { if (!frames[k].getAttribute("src")) frames[k].src = "index.html?preview=1"; });
    fit();
  }
  Object.keys(frames).forEach(function (k) {
    frames[k].addEventListener("load", function () { setTimeout(function () { if (shows[k]) show(k, shows[k]); }, 600); });
  });
  function updatePreviews() {
    var i = S.index, item = LIST[i];
    show("cur", { type: "gp-show", index: i, step: S.step });
    var label = $("#pvNextLabel");
    if (S.step < item.steps) { label.textContent = "A seguir: tópico " + (S.step + 2) + " de " + (item.steps + 1); show("next", { type: "gp-show", index: i, step: S.step + 1 }); }
    else if (i < N - 1) { label.textContent = "A seguir: " + LIST[i + 1].title; show("next", { type: "gp-show", index: i + 1, step: 0 }); }
    else { label.textContent = "Fim da apresentação"; show("next", { type: "gp-show", index: i, step: "last" }); }
  }

  /* ---------- cronômetros ---------- */
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
    var was = t.running;
    t.running = false; t.acc = 0; t.slideAcc = 0; t.started = false;
    setRunning(was);
    if (!was) $("#pvStart").textContent = "Iniciar cronômetro";
    tick();
  }
  function plannedBefore(index) { var s = 0; for (var k = 0; k < index; k++) s += (noteOf(k).tempo || 0) * 1000; return s; }
  function planTotal() { var s = 0; for (var k = 0; k < N; k++) s += (noteOf(k).tempo || 0) * 1000; return s; }

  function setLink(on) {
    if (on === link.on) return;
    link.on = on;
    var el = $("#pvLink");
    el.dataset.state = on ? "on" : "local";
    el.querySelector("span").textContent = on ? "Conectado à projeção" : "Modo consulta";
    el.title = on ? "Esta tela acompanha e controla a apresentação aberta em outra janela." : "Nenhuma projeção conectada neste navegador: o roteiro avança só aqui.";
    var note = $("#pvModeNote");
    note.hidden = on;
    note.textContent = touch
      ? "Modo consulta: este aparelho mostra só o roteiro e avança só aqui. Se o celular também estiver projetando, a turma verá esta tela; volte à apresentação antes de projetar."
      : "Modo consulta: nenhuma projeção aberta neste navegador. Abra a apresentação em outra janela para controlá-la daqui; enquanto isso, o roteiro avança só nesta tela.";
    document.body.dataset.mode = on ? "sync" : "local";
    render(false);
  }
  function tick() {
    var d = new Date();
    $("#pvClock").textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
    $("#pvElapsed").textContent = mmss(total());
    $("#pvElapsedMini").textContent = mmss(total());
    $("#pvSlideTime").textContent = mmss(slideTotal());
    var est = (noteOf(S.index).tempo || 0) * 1000;
    var ratio = est ? slideTotal() / est : 0;
    var m = $("#pvMeter");
    m.style.width = Math.min(100, ratio * 100).toFixed(1) + "%";
    m.classList.toggle("is-late", ratio > 1);
    var diff = (total() - slideTotal()) - plannedBefore(S.index);
    var pace = $("#pvPace");
    if (!t.started) pace.textContent = "O cronômetro começa sozinho na primeira troca de slide, ou no botão acima.";
    else if (Math.abs(diff) < 10000) pace.textContent = "Ritmo: no tempo planejado.";
    else pace.textContent = "Ritmo: " + mmss(Math.abs(diff)) + (diff > 0 ? " atrasado em relação ao plano." : " adiantado em relação ao plano.");
    if (link.on && now() - link.lastSeen > 7000) setLink(false);
  }

  /* ---------- sincronização com a projeção ---------- */
  if (bc) {
    bc.onmessage = function (e) {
      var d = e.data || {};
      if (d.type !== "state" || typeof d.index !== "number") return;
      link.lastSeen = now();
      var wasOn = link.on;
      var before = S.index, changed = d.index !== S.index || d.step !== S.step;
      S.index = clamp(d.index, 0, N - 1);
      S.step = d.step || 0;
      if (!wasOn) {
        pending = null;
        S.cursor = firstOfStep(S.index, S.step);
        setLink(true);
        toast("Conectado: o roteiro acompanha a projeção.", 2600);
        render();
      } else if (changed) arrive(before);
    };
    var hello = function () { bc.postMessage({ type: "hello" }); };
    hello();
    setInterval(hello, 3000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) hello(); });
  }

  /* ---------- botões e teclado ---------- */
  $("#pvSpeechNext").addEventListener("click", advanceSpeech);
  $("#pvTopicPrev").addEventListener("click", function () { cmd("prev"); });
  $("#pvSlideNext").addEventListener("click", function () { cmd("goto", { index: S.index + 1, step: 0 }); });
  $("#pvSlidePrev").addEventListener("click", function () { cmd("goto", { index: S.index - 1, step: 0 }); });
  $("#pvGoto").addEventListener("change", function () { cmd("goto", { index: Number(this.value), step: 0 }); });
  $("#pvStart").addEventListener("click", function () { setRunning(!t.running); tick(); });
  $("#pvReset").addEventListener("click", reset);
  $("#pvClear").addEventListener("click", function () { done = {}; store("gp-pv-done", done); render(false); toast("Todas as marcas foram removidas.", 1800); });
  $("#pvAll").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-index]");
    if (b) cmd("goto", { index: Number(b.dataset.index), step: 0 });
  });
  $("#pvScript").addEventListener("click", function (e) {
    var art = e.target.closest(".seg");
    if (!art) return;
    var k = Number(art.dataset.k);
    if (e.target.closest(".seg-done")) { setDone(S.index, k, !isDone(S.index, k)); render(false); return; }
    var ev = e.target.closest(".cue-click");
    if (ev) {
      if (link.on && bc) { bc.postMessage({ type: "cmd", action: "event", label: ev.dataset.event }); toast("Na projeção: " + ev.dataset.event, 1600); }
      return;
    }
    if (e.target.closest(".seg-go")) jumpTo(k);
  });
  $("#pvBackLabel").textContent = isPopup ? "Fechar o apresentador" : "Voltar à apresentação";
  $("#pvBack").addEventListener("click", function () {
    if (isPopup) {
      try { window.opener.focus(); } catch (e) { /* ignora */ }
      window.close();
      return;
    }
    location.href = "index.html#" + LIST[S.index].id + (S.step ? "/" + S.step : "");
  });
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "select" || tag === "input" || tag === "textarea") return;
    var k = e.key, onBtn = tag === "button" || tag === "summary" || tag === "a";
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !onBtn)) { e.preventDefault(); cmd("next"); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); cmd("prev"); }
    else if (k === "ArrowDown" || (k === "Enter" && !onBtn)) { e.preventDefault(); advanceSpeech(); }
    else if (k === "ArrowUp") { e.preventDefault(); backSpeech(); }
    else if (k === "Home") { e.preventDefault(); cmd("goto", { index: 0, step: 0 }); }
    else if (k === "End") { e.preventDefault(); cmd("goto", { index: N - 1, step: 0 }); }
    else if (k === "t" || k === "T") { setRunning(!t.running); tick(); }
    else if (k === "r" || k === "R") { reset(); }
    else if (k === "m" || k === "M") { toggleCurrentDone(); }
  });

  /* ---------- layout: computador (painéis abertos) ou celular (seções recolhíveis) ---------- */
  function layout() {
    var desk = wide.matches;
    document.body.classList.toggle("is-wide", desk);
    ["#pvPreviewBox", "#pvTimersBox"].forEach(function (s) { $(s).open = desk; });
    if (desk) { $("#pvQA").open = true; loadFrames(); }
    fit();
  }
  $("#pvPreviewBox").addEventListener("toggle", function () { if (this.open) { loadFrames(); updatePreviews(); } });
  if (wide.addEventListener) wide.addEventListener("change", function () { layout(); render("instant"); });
  var resizeTimer;
  window.addEventListener("resize", function () {
    fit();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { scrollToCurrent(true); }, 180);
  });

  /* ---------- ponto de partida ---------- */
  // 1) posição enviada pela apresentação (index.html → presenter.html#slide/tópico); 2) última posição salva
  var h = decodeURIComponent(location.hash.replace("#", "")).split("/");
  var fromHash = LIST.findIndex(function (x) { return x.id === h[0]; });
  var saved = recall("gp-pv-pos", null);
  if (fromHash > -1) { S.index = fromHash; S.step = clamp(Number(h[1]) || 0, 0, LIST[fromHash].steps); S.cursor = firstOfStep(S.index, S.step); }
  else if (saved && typeof saved.index === "number") { S.index = clamp(saved.index, 0, N - 1); S.step = saved.step || 0; S.cursor = saved.cursor || 0; }
  if (fromHash > -1) history.replaceState(null, "", location.pathname + location.search);
  document.body.dataset.mode = "local";
  $("#pvModeNote").hidden = false;
  link.on = true; setLink(false);
  layout();
  render("instant");
  setInterval(tick, 500);
  tick();
  if (!bc) toast("Este navegador não permite conectar janelas: use o modo consulta.", 5000);
})();
