// Web Audio API sound effects - retro synth style

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Ensure audio context is resumed (browsers require user gesture)
export function initAudio() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

// ── Swoosh (skiing ambient, wind-like) ──
let swooshOsc = null;
let swooshGain = null;

export function startSwoosh() {
  const ctx = getCtx();
  if (swooshOsc) return;

  swooshOsc = ctx.createOscillator();
  swooshGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  swooshOsc.type = 'sawtooth';
  swooshOsc.frequency.value = 80;

  filter.type = 'lowpass';
  filter.frequency.value = 200;
  filter.Q.value = 1;

  swooshGain.gain.value = 0;

  swooshOsc.connect(filter);
  filter.connect(swooshGain);
  swooshGain.connect(ctx.destination);
  swooshOsc.start();
}

export function updateSwoosh(speed, maxSpeed) {
  if (!swooshGain || !swooshOsc) return;
  const ratio = speed / maxSpeed;
  swooshGain.gain.value = ratio * 0.06;
  swooshOsc.frequency.value = 60 + ratio * 120;
}

export function stopSwoosh() {
  if (swooshOsc) {
    swooshOsc.stop();
    swooshOsc = null;
    swooshGain = null;
  }
}

// ── Crash (impact thud + yelp) ──
export function playCrash() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Thud
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(150, now);
  thudOsc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
  thudGain.gain.setValueAtTime(0.3, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudOsc.start(now);
  thudOsc.stop(now + 0.2);

  // Dog yelp (short high pitch)
  const yelp = ctx.createOscillator();
  const yelpGain = ctx.createGain();
  yelp.type = 'sine';
  yelp.frequency.setValueAtTime(600, now + 0.05);
  yelp.frequency.exponentialRampToValueAtTime(900, now + 0.1);
  yelp.frequency.exponentialRampToValueAtTime(400, now + 0.25);
  yelpGain.gain.setValueAtTime(0.15, now + 0.05);
  yelpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  yelp.connect(yelpGain);
  yelpGain.connect(ctx.destination);
  yelp.start(now + 0.05);
  yelp.stop(now + 0.3);
}

// ── Jump (whoosh upward) ──
export function playJump() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.4);

  // Happy bark
  const bark = ctx.createOscillator();
  const barkGain = ctx.createGain();
  bark.type = 'square';
  bark.frequency.setValueAtTime(500, now + 0.05);
  bark.frequency.exponentialRampToValueAtTime(700, now + 0.1);
  bark.frequency.exponentialRampToValueAtTime(500, now + 0.15);
  barkGain.gain.setValueAtTime(0.06, now + 0.05);
  barkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  bark.connect(barkGain);
  barkGain.connect(ctx.destination);
  bark.start(now + 0.05);
  bark.stop(now + 0.18);
}

// ── Boost (turbo whoosh + power-up) ──
export function playBoost() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.setValueAtTime(0.1, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);

  // Sparkle
  for (let i = 0; i < 3; i++) {
    const sp = ctx.createOscillator();
    const spGain = ctx.createGain();
    sp.type = 'sine';
    const t = now + 0.1 + i * 0.08;
    sp.frequency.setValueAtTime(1200 + i * 200, t);
    sp.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    spGain.gain.setValueAtTime(0.06, t);
    spGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    sp.connect(spGain);
    spGain.connect(ctx.destination);
    sp.start(t);
    sp.stop(t + 0.12);
  }
}

// ── Snowman appears (ominous drone) ──
export function playSnowmanAppear() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.value = 55;
  osc2.type = 'sawtooth';
  osc2.frequency.value = 57; // slight detune for menace

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
  gain.gain.setValueAtTime(0.08, now + 1.5);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 2.5);
  osc2.stop(now + 2.5);
}

// ── Game Over (MP3) ──
const gameOverAudio = new Audio('/gameover.mp3');

export function playGameOver() {
  gameOverAudio.currentTime = 0;
  gameOverAudio.play().catch(() => {});
}
