/* Trilha instrumental opcional: ambiente sóbrio sintetizado com a Web Audio API.
   Não é uma gravação. Só começa quando a pessoa clica em "Ligar trilha". */
(function () {
  "use strict";
  var GP = (window.GP = window.GP || {});

  // Ré menor: Dm – B♭ – Gm – A (acordes de 9 s), com bordão grave e notas dedilhadas esparsas
  var CHORDS = [
    [146.83, 174.61, 220.0, 293.66],
    [116.54, 146.83, 174.61, 233.08],
    [98.0, 146.83, 196.0, 233.08],
    [110.0, 164.81, 220.0, 277.18]
  ];
  var PLUCK = [
    [293.66, 349.23, 440.0, 587.33],
    [233.08, 293.66, 349.23, 466.16],
    [196.0, 293.66, 392.0, 466.16],
    [220.0, 277.18, 329.63, 440.0]
  ];
  var CHORD_LEN = 9;

  function Score() {
    this.ctx = null;
    this.on = false;
    this.volume = .45;
    this.master = 1;
    this.muted = false;
    this.ducked = false;
  }
  Score.prototype.supported = function () { return !!(window.AudioContext || window.webkitAudioContext); };
  Score.prototype.build = function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = (this.ctx = new AC());
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;
    this.out.connect(comp).connect(ctx.destination);
    // reverberação com resposta ao impulso gerada (cauda de ~3 s)
    var len = Math.floor(ctx.sampleRate * 3.2);
    var ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var data = ir.getChannelData(ch);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    this.verb = ctx.createConvolver();
    this.verb.buffer = ir;
    this.verbGain = ctx.createGain();
    this.verbGain.gain.value = .7;
    this.verb.connect(this.verbGain).connect(this.out);
    this.dry = ctx.createGain();
    this.dry.gain.value = .45;
    this.dry.connect(this.out);
    this.lp = ctx.createBiquadFilter();
    this.lp.type = "lowpass";
    this.lp.frequency.value = 820;
    this.lp.Q.value = .5;
    this.lp.connect(this.dry);
    this.lp.connect(this.verb);
    // bordão grave (ré)
    var drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 73.42;
    var dg = ctx.createGain();
    dg.gain.value = .05;
    var lfo = ctx.createOscillator();
    lfo.frequency.value = .07;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = .025;
    lfo.connect(lfoGain).connect(dg.gain);
    drone.connect(dg).connect(this.lp);
    drone.start();
    lfo.start();
  };
  Score.prototype.voice = function (freq, t, dur, gain) {
    var ctx = this.ctx;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 2.8);
    g.gain.setValueAtTime(gain, t + dur - 1);
    g.gain.linearRampToValueAtTime(0, t + dur + 3);
    g.connect(this.lp);
    [-6, 6].forEach(function (cents) {
      var o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = cents;
      o.connect(g);
      o.start(t);
      o.stop(t + dur + 3.2);
    });
  };
  Score.prototype.pluck = function (freq, t) {
    var ctx = this.ctx;
    var o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.05, t + .015);
    g.gain.exponentialRampToValueAtTime(.0008, t + 2.4);
    o.connect(g);
    g.connect(this.verb);
    g.connect(this.dry);
    o.start(t);
    o.stop(t + 2.5);
  };
  Score.prototype.schedule = function () {
    if (!this.on) return;
    var ctx = this.ctx, self = this;
    var t = Math.max(ctx.currentTime + .05, this.nextAt || 0);
    var idx = this.bar % CHORDS.length;
    CHORDS[idx].forEach(function (f) { self.voice(f, t, CHORD_LEN, .022); });
    // notas dedilhadas esparsas
    var notes = PLUCK[idx];
    [1.5, 3.8, 6.2].forEach(function (off, k) {
      if (Math.random() < .7) self.pluck(notes[(k + self.bar) % notes.length], t + off + Math.random() * .3);
    });
    this.bar++;
    this.nextAt = t + CHORD_LEN;
    this.timer = setTimeout(function () { self.schedule(); }, (this.nextAt - ctx.currentTime - 1) * 1000);
  };
  Score.prototype.level = function () {
    return this.muted ? 0 : this.volume * this.master * (this.ducked ? .35 : 1) * .9;
  };
  Score.prototype.apply = function (time) {
    if (!this.ctx) return;
    var g = this.out.gain, now = this.ctx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.on ? this.level() : 0, now + (time || .6));
  };
  Score.prototype.start = function () {
    if (!this.supported()) return false;
    if (!this.ctx) this.build();
    if (this.ctx.state === "suspended") this.ctx.resume();
    if (this.on) return true;
    this.on = true;
    this.bar = 0;
    this.nextAt = 0;
    this.schedule();
    this.apply(3);
    return true;
  };
  Score.prototype.stop = function () {
    if (!this.on) return;
    this.on = false;
    clearTimeout(this.timer);
    this.apply(2);
    var ctx = this.ctx;
    setTimeout(function () { if (ctx && ctx.state === "running") ctx.suspend(); }, 2600);
  };
  Score.prototype.set = function (opts) {
    for (var k in opts) this[k] = opts[k];
    if (this.on) this.apply(.4);
  };
  GP.Score = Score;
})();
