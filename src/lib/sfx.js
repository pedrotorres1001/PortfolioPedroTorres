/**
 * Efeitos de som gerados com Web Audio API — nenhum ficheiro descarregado.
 * Desligado por defeito; o AudioContext só é criado quando o visitante liga o som.
 */
let ctx = null;
let master = null;
let ambient = null;
let enabled = false;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return true;
}

function tone({ freq = 880, type = "square", dur = 0.05, vol = 0.05, slide = 0, delay = 0 }) {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function startAmbient() {
  if (ambient || !ctx) return;
  const out = ctx.createGain();
  out.gain.value = 0;
  out.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 6;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain).connect(filter.frequency);
  const oscs = [55, 82.4, 110.2].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i === 1 ? "triangle" : "sawtooth";
    o.frequency.value = f;
    o.detune.value = (i - 1) * 7;
    o.connect(filter);
    o.start();
    return o;
  });
  filter.connect(out).connect(master);
  lfo.start();
  ambient = { out, oscs, lfo };
}

function stopAmbient() {
  if (!ambient || !ctx) return;
  const { out, oscs, lfo } = ambient;
  out.gain.cancelScheduledValues(ctx.currentTime);
  out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  setTimeout(() => {
    oscs.forEach((o) => o.stop());
    lfo.stop();
    out.disconnect();
  }, 500);
  ambient = null;
}

const sfx = {
  enable() {
    if (!ensure()) return;
    enabled = true;
    startAmbient();
    tone({ freq: 660, dur: 0.06 });
    tone({ freq: 990, dur: 0.08, delay: 0.07 });
  },
  disable() {
    tone({ freq: 440, dur: 0.06 });
    stopAmbient();
    enabled = false;
  },
  click: () => tone({ freq: 1400, type: "square", dur: 0.025, vol: 0.03 }),
  hover: () => tone({ freq: 2200, type: "sine", dur: 0.02, vol: 0.012 }),
  open: () => tone({ freq: 300, type: "triangle", dur: 0.12, vol: 0.05, slide: 500 }),
  close: () => tone({ freq: 700, type: "triangle", dur: 0.1, vol: 0.04, slide: -400 }),
  rebuild() {
    tone({ freq: 120, type: "sawtooth", dur: 0.4, vol: 0.05, slide: 600 });
    tone({ freq: 880, type: "square", dur: 0.05, vol: 0.03, delay: 0.55 });
    tone({ freq: 1320, type: "square", dur: 0.06, vol: 0.03, delay: 0.62 });
  },
  chime() {
    [784, 988, 1318].forEach((f, i) => tone({ freq: f, type: "triangle", dur: 0.18, vol: 0.04, delay: i * 0.08 }));
  },
  jump: () => tone({ freq: 420, type: "square", dur: 0.08, vol: 0.03, slide: 380 }),
  hit: () => tone({ freq: 160, type: "sawtooth", dur: 0.3, vol: 0.06, slide: -120 }),
  key: () => tone({ freq: 1800 + Math.random() * 400, type: "square", dur: 0.012, vol: 0.015 }),
  get enabled() {
    return enabled;
  },
};

export default sfx;
