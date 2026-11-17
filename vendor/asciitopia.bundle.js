// node_modules/simplex-noise/dist/esm/simplex-noise.js
var SQRT3 = /* @__PURE__ */ Math.sqrt(3);
var SQRT5 = /* @__PURE__ */ Math.sqrt(5);
var F2 = 0.5 * (SQRT3 - 1);
var G2 = (3 - SQRT3) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6;
var F4 = (SQRT5 - 1) / 4;
var G4 = (5 - SQRT5) / 20;
var fastFloor = (x) => Math.floor(x) | 0;
var grad2 = /* @__PURE__ */ new Float64Array([
  1,
  1,
  -1,
  1,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1,
  0,
  0,
  1,
  0,
  -1,
  0,
  1,
  0,
  -1
]);
var grad3 = /* @__PURE__ */ new Float64Array([
  1,
  1,
  0,
  -1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1,
  0,
  1,
  0,
  1,
  -1,
  0,
  1,
  1,
  0,
  -1,
  -1,
  0,
  -1,
  0,
  1,
  1,
  0,
  -1,
  1,
  0,
  1,
  -1,
  0,
  -1,
  -1
]);
function createNoise2D(random = Math.random) {
  const perm = buildPermutationTable(random);
  const permGrad2x = new Float64Array(perm).map((v) => grad2[v % 12 * 2]);
  const permGrad2y = new Float64Array(perm).map((v) => grad2[v % 12 * 2 + 1]);
  return function noise2D(x, y) {
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;
    const s = (x + y) * F2;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      const gi0 = ii + perm[jj];
      const g0x = permGrad2x[gi0];
      const g0y = permGrad2y[gi0];
      t0 *= t0;
      n0 = t0 * t0 * (g0x * x0 + g0y * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      const gi1 = ii + i1 + perm[jj + j1];
      const g1x = permGrad2x[gi1];
      const g1y = permGrad2y[gi1];
      t1 *= t1;
      n1 = t1 * t1 * (g1x * x1 + g1y * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      const gi2 = ii + 1 + perm[jj + 1];
      const g2x = permGrad2x[gi2];
      const g2y = permGrad2y[gi2];
      t2 *= t2;
      n2 = t2 * t2 * (g2x * x2 + g2y * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}
function createNoise3D(random = Math.random) {
  const perm = buildPermutationTable(random);
  const permGrad3x = new Float64Array(perm).map((v) => grad3[v % 12 * 3]);
  const permGrad3y = new Float64Array(perm).map((v) => grad3[v % 12 * 3 + 1]);
  const permGrad3z = new Float64Array(perm).map((v) => grad3[v % 12 * 3 + 2]);
  return function noise3D(x, y, z) {
    let n0, n1, n2, n3;
    const s = (x + y + z) * F3;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const k = fastFloor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;
    let i1, j1, k1;
    let i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }
    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;
    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0)
      n0 = 0;
    else {
      const gi0 = ii + perm[jj + perm[kk]];
      t0 *= t0;
      n0 = t0 * t0 * (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0)
      n1 = 0;
    else {
      const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];
      t1 *= t1;
      n1 = t1 * t1 * (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0)
      n2 = 0;
    else {
      const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];
      t2 *= t2;
      n2 = t2 * t2 * (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0)
      n3 = 0;
    else {
      const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];
      t3 *= t3;
      n3 = t3 * t3 * (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  };
}
function buildPermutationTable(random) {
  const tableSize = 512;
  const p = new Uint8Array(tableSize);
  for (let i = 0; i < tableSize / 2; i++) {
    p[i] = i;
  }
  for (let i = 0; i < tableSize / 2 - 1; i++) {
    const r = i + ~~(random() * (256 - i));
    const aux = p[i];
    p[i] = p[r];
    p[r] = aux;
  }
  for (let i = 256; i < tableSize; i++) {
    p[i] = p[i - 256];
  }
  return p;
}

// node_modules/@asciitopia/core/dist/index.js
var DEFAULT_ENGINE_OPTIONS = {
  font: '"Fira Mono", "Consolas", monospace',
  fontSize: 16,
  maxDt: 100
};
var CanvasEngine = class {
  /** Throws if a 2D context cannot be acquired. Measures charW via
   *  measureText('M').width and charH via fontBoundingBoxAscent + fontBoundingBoxDescent. */
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context");
    this.ctx = ctx;
    const font = options.font ?? DEFAULT_ENGINE_OPTIONS.font;
    const fontSize = options.fontSize ?? DEFAULT_ENGINE_OPTIONS.fontSize;
    this.font = `${fontSize}px ${font}`;
    this.maxDt = options.maxDt ?? DEFAULT_ENGINE_OPTIONS.maxDt;
    this.frameInterval = options.fps !== void 0 ? 1e3 / options.fps : null;
    this.applyFont();
    const m = this.ctx.measureText("M");
    this.charW = m.width;
    this.charH = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
  }
  canvas;
  ctx;
  animFrameId = null;
  lastTime = 0;
  pattern = null;
  charW = 0;
  charH = 0;
  font;
  maxDt;
  /** ms per rendered frame when fps throttling is on; null = pure rAF cadence. */
  frameInterval;
  /** Dispose the previous pattern (if any), init the new one at the current grid,
   *  and adopt it. Safe to call before start(). */
  setPattern(pattern) {
    this.pattern?.dispose?.();
    const cols = Math.floor(this.canvas.width / this.charW);
    const rows = Math.floor(this.canvas.height / this.charH);
    pattern.init(cols, rows);
    this.pattern = pattern;
  }
  /** Set canvas pixel dimensions, reapply the font, re-init the current pattern
   *  at the new grid (floor(width/charW) × floor(height/charH)). */
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.applyFont();
    if (this.pattern) {
      const cols = Math.floor(width / this.charW);
      const rows = Math.floor(height / this.charH);
      this.pattern.init(cols, rows);
    }
  }
  /** Begin the rAF loop and register the document visibilitychange handler
   *  (returning to a visible tab resets the dt clock so the next frame gets dt = 0). */
  start() {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.animFrameId = requestAnimationFrame(this.tick);
  }
  /** Stop the rAF loop and unregister the visibility handler. Does NOT dispose the
   *  pattern — start() resumes where it left off. */
  stop() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
  }
  /** stop() + dispose the current pattern + drop the reference. The engine must
   *  not be reused afterwards. */
  destroy() {
    this.stop();
    this.pattern?.dispose?.();
    this.pattern = null;
  }
  applyFont() {
    this.ctx.font = this.font;
  }
  onVisibilityChange = () => {
    if (!document.hidden) this.lastTime = 0;
  };
  tick = (timestamp) => {
    if (this.frameInterval !== null && this.lastTime !== 0 && timestamp - this.lastTime < this.frameInterval) {
      this.animFrameId = requestAnimationFrame(this.tick);
      return;
    }
    const dt = this.lastTime === 0 ? 0 : Math.min(timestamp - this.lastTime, this.maxDt);
    this.lastTime = timestamp;
    this.pattern?.update(dt);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.applyFont();
    const cols = Math.floor(this.canvas.width / this.charW);
    const rows = Math.floor(this.canvas.height / this.charH);
    this.pattern?.render(this.ctx, cols, rows, this.charW, this.charH);
    this.animFrameId = requestAnimationFrame(this.tick);
  };
};
var CHARS = " .:-=+*#%@";
var CHAR_MAX_INDEX = CHARS.length - 1;
var OCTAVES = 3;
var PERSISTENCE = 0.5;
var LACUNARITY = 2;
var FALLOFF_EXPONENT = 4;
var AURORA_STOPS = [
  [20, 0, 40],
  [60, 20, 120],
  [0, 180, 160],
  [80, 255, 80],
  [220, 50, 180]
];
var MONO_BASE = 40;
var MONO_RANGE = 180;
var DEFAULT_AURORA_CONFIG = {
  palette: "aurora",
  scaleX: 0.03,
  scaleY: 0.08,
  speed: 0.15,
  threshold: 0.3
};
var lerp = (a, b, t) => a + (b - a) * t;
var lerpColor = (normalized) => {
  const segment = normalized * 4;
  const i = Math.min(Math.floor(segment), 3);
  const f = segment - i;
  const from = AURORA_STOPS[i];
  const to = AURORA_STOPS[i + 1];
  const r = Math.round(lerp(from[0], to[0], f));
  const g = Math.round(lerp(from[1], to[1], f));
  const b = Math.round(lerp(from[2], to[2], f));
  return `rgb(${r},${g},${b})`;
};
var monoColor = (normalized) => {
  const v = Math.floor(normalized * MONO_RANGE + MONO_BASE);
  return `rgb(${v},${v},${v})`;
};
var AuroraPattern = class {
  config;
  noise3D = createNoise3D();
  time = 0;
  constructor(config = {}) {
    this.config = { ...DEFAULT_AURORA_CONFIG, ...config };
  }
  init(_cols, _rows) {
    this.time = 0;
    this.noise3D = createNoise3D();
  }
  update(dt) {
    this.time += dt / 1e3;
  }
  render(ctx, cols, rows, charW, charH) {
    const { scaleX, scaleY, speed, threshold, palette } = this.config;
    const t = this.time * speed;
    const thresholdInv = 1 / (1 - threshold);
    const colorFn = palette === "aurora" ? lerpColor : monoColor;
    for (let row = 0; row < rows; row++) {
      const falloff = 1 - (row / rows) ** FALLOFF_EXPONENT;
      const ny = row * scaleY;
      for (let col = 0; col < cols; col++) {
        const raw = this.fractalNoise(col * scaleX, ny, t);
        const value = raw * falloff;
        if (value <= threshold) continue;
        const normalized = Math.min((value - threshold) * thresholdInv, 1);
        const charIndex = Math.floor(normalized * CHAR_MAX_INDEX);
        const char = CHARS[charIndex];
        if (char === " ") continue;
        ctx.fillStyle = colorFn(normalized);
        ctx.fillText(char, col * charW, (row + 1) * charH);
      }
    }
  }
  fractalNoise = (x, y, z) => {
    let value = 0;
    let amp = 1;
    let freq = 1;
    for (let i = 0; i < OCTAVES; i++) {
      value += this.noise3D(x * freq, y * freq, z * freq) * amp;
      amp *= PERSISTENCE;
      freq *= LACUNARITY;
    }
    return (value + 1) / 2;
  };
};
var DEFAULT_BONSAI_CONFIG = {
  brightLeaf: "#4abb4a",
  brightWood: "#d4a017",
  darkLeaf: "#2d8a2d",
  darkWood: "#8b6914",
  growthSpeed: 0.6,
  holdDuration: 45,
  lean: 0.15,
  palette: "classic",
  pot: "plinth",
  seasons: true,
  sprawl: 0.8,
  treeCount: 0,
  vitality: 30
};
var PALETTES = {
  classic: {
    autumn: ["#d2691e", "#b3452c", "#daa520", "#c9702a", "#8f3b1f"],
    leafBody: "#4abb4a",
    leafCore: "#2d8a2d",
    leafFringe: "#5cd35c",
    moss: "#3d7a35",
    petal: "#d8a8c0",
    potAccent: "#b5825a",
    potBody: "#7a5236",
    sand: "#262c33",
    sandBright: "#3d4650",
    soil: "#584232",
    stone: "#4a525c",
    woodDark: "#8b6914",
    woodLight: "#d4a017"
  },
  mono: {
    autumn: ["#9a9a9a", "#7e7e7e", "#b0b0b0", "#6a6a6a"],
    leafBody: "#c0c0c0",
    leafCore: "#a0a0a0",
    leafFringe: "#e8e8e8",
    moss: "#6a6a6a",
    petal: "#d0d0d0",
    potAccent: "#909090",
    potBody: "#606060",
    sand: "#23272b",
    sandBright: "#3a4046",
    soil: "#505050",
    stone: "#565b61",
    woodDark: "#787878",
    woodLight: "#a8a8a8"
  },
  sakura: {
    autumn: ["#c46a8e", "#a34e74", "#d98aa8", "#8e3f60"],
    leafBody: "#e895bd",
    leafCore: "#d977a8",
    leafFringe: "#f7c6dc",
    moss: "#707a5c",
    petal: "#ffd7e8",
    potAccent: "#8d8478",
    potBody: "#5c564d",
    sand: "#262a2c",
    sandBright: "#3e4448",
    soil: "#4a443c",
    stone: "#4e5459",
    woodDark: "#5e4a3a",
    woodLight: "#8a6f56"
  }
};
var MAX_GEN = 2;
var CURVE_AMP = [0.13, 0.24, 0.34];
var BIAS_PULL = [0.06, 0.16, 0.17];
var PHASE_SPEED_MIN = 0.24;
var PHASE_SPEED_VAR = 0.18;
var DROOP_LIMIT = 0.25;
var FORK_THRESHOLD = 2.6;
var FORK_CHARGE_MIN = 0.35;
var FORK_CHARGE_VAR = 0.5;
var MIN_FORK_ENERGY = 6;
var TWIG_ENERGY_RATIO = 0.5;
var CHILD_MAX_ENERGY = 16;
var CHILD_MIN_ENERGY = 3;
var FORK_SPREAD_MIN = 0.55;
var FORK_SPREAD_VAR = 0.55;
var GIRTH_FRACTION = 0.24;
var TAPER_FRACTION = 0.52;
var KNOT_CHANCE = 0.05;
var UP = -Math.PI / 2;
var SPROUT_RATE_FACTOR = 10;
var EDGE_DELAY_MIN_MS = 5e3;
var EDGE_DELAY_VAR_MS = 13e3;
var EDGE_SPACING_FRAC = 0.15;
var EDGE_LIFE_MIN = 0.5;
var EDGE_LIFE_VAR = 0.25;
var EDGE_LEAN_VAR = 0.5;
var AUTUMN_DURATION = 25;
var SHED_DURATION = 30;
var WINTER_DURATION = 20;
var SPRING_DURATION = 25;
var DRY_LEAF_CHAR = "*";
var DRY_LEAF_CHANCE = 0.35;
var LEAF_FALL_CHANCE = 0.3;
var MAX_FALLING = 12;
var SEED_INTERVAL_MS = 7e3;
var SEED_INTERVAL_VAR_MS = 6e3;
var MAX_SEED_SITES = 3;
var SEED_CHAR = ".";
var SPROUT_VITALITY_MIN = 0.4;
var SPROUT_VITALITY_VAR = 0.15;
var SPROUT_SPACING_FRAC = 0.12;
var RETIRE_RATE = 6;
var MOSS_INTERVAL_MS = 12e3;
var MOSS_PER_TREE = 4;
var MOSS_CHARS = ',."';
var SAND_GLYPHS = " -~.()";
var RAKE_INTERVAL_MIN_MS = 6e4;
var RAKE_INTERVAL_VAR_MS = 3e4;
var RAKE_SPEED = 6;
var RAKE_GLOW_DECAY = 0.25;
var RING_SPACING = 2.6;
var RING_REACH = 8;
var MAX_PETALS = 4;
var PETAL_CHAR = "\xB7";
var PETAL_INTERVAL_MS = 26e3;
var PETAL_INTERVAL_VAR_MS = 14e3;
var PETAL_SPRING_INTERVAL_MS = 9e3;
var WIND_SPEED = 0.12;
var WIND_THRESHOLD = 0.62;
var shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
var compact = (arr, keep) => {
  let write = 0;
  for (let i = 0; i < arr.length; i++) {
    if (keep(arr[i])) arr[write++] = arr[i];
  }
  arr.length = write;
};
var brighten = (hex) => {
  const n = Number.parseInt(hex.slice(1), 16);
  const lift = (v) => Math.min(255, Math.round(v * 1.3 + 24));
  return `rgb(${lift(n >> 16 & 255)},${lift(n >> 8 & 255)},${lift(n & 255)})`;
};
var buildPot = (style, inner) => {
  switch (style) {
    case "saucer":
      return [
        { text: `.-~${"=".repeat(inner)}~-.`, tone: "accent" },
        { text: ` '-.${"_".repeat(inner - 2)}.-'`, tone: "body" },
        {
          text: `${" ".repeat(Math.floor(inner / 4) + 2)}(${"_".repeat(inner - 2 * Math.floor(inner / 4))})`,
          tone: "body"
        }
      ];
    case "plinth":
      return [
        { text: `+${"-".repeat(inner + 2)}+`, tone: "accent" },
        { text: `|${":".repeat(inner + 2)}|`, tone: "body" },
        { text: `+${"-".repeat(inner + 2)}+`, tone: "accent" },
        { text: ` ${"~,".repeat(Math.floor(inner / 2) + 1)}`, tone: "soil" }
      ];
    default:
      return [
        { text: `,-${"=".repeat(inner)}-,`, tone: "accent" },
        { text: `|${":".repeat(inner + 2)}|`, tone: "body" },
        { text: `'${"=".repeat(inner + 2)}'`, tone: "accent" },
        { text: `   [__]${" ".repeat(Math.max(0, inner - 10))}[__]`, tone: "body" }
      ];
  }
};
var BonsaiPattern = class {
  config;
  classicPal;
  cols = 0;
  rows = 0;
  grid = [];
  limbs = [];
  trees = [];
  treeSeq = 0;
  pending = [];
  accumulator = 0;
  sproutQueue = [];
  sproutCarry = 0;
  season = "growing";
  seasonTimer = 0;
  leafCells = [];
  leafOrder = [];
  leafProgress = 0;
  falling = [];
  seeds = [];
  seedSites = [];
  seedTimer = 0;
  retiring = [];
  retireCarry = 0;
  tufts = [];
  mossTimer = 0;
  potLines = [];
  potLeft = 0;
  potTop = 0;
  potWidth = 0;
  // karesansui
  sandRows = 0;
  sandTop = 0;
  sandChar = new Uint8Array(0);
  sandFixed = new Uint8Array(0);
  sandGlow = new Float32Array(0);
  sandParams = [];
  rakeFront = 0;
  rakeEnd = 0;
  rakeTimer = 0;
  stones = [];
  petals = [];
  petalTimer = 0;
  windT = 0;
  noise2D = createNoise2D();
  brightCache = /* @__PURE__ */ new Map();
  constructor(config = {}) {
    this.config = { ...DEFAULT_BONSAI_CONFIG, ...config };
    this.classicPal = {
      ...PALETTES.classic,
      leafBody: this.config.brightLeaf,
      leafCore: this.config.darkLeaf,
      woodDark: this.config.darkWood,
      woodLight: this.config.brightWood
    };
  }
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.accumulator = 0;
    this.sproutQueue = [];
    this.sproutCarry = 0;
    this.season = "growing";
    this.seasonTimer = 0;
    this.leafCells = [];
    this.leafOrder = [];
    this.leafProgress = 0;
    this.falling = [];
    this.seeds = [];
    this.seedSites = [];
    this.seedTimer = SEED_INTERVAL_MS;
    this.retiring = [];
    this.retireCarry = 0;
    this.tufts = [];
    this.mossTimer = 0;
    this.petals = [];
    this.petalTimer = PETAL_INTERVAL_MS * Math.random();
    this.windT = 0;
    this.grid = Array.from(
      { length: rows },
      () => Array.from({ length: cols }).fill(null)
    );
    this.limbs = [];
    this.trees = [];
    this.treeSeq = 0;
    this.pending = [];
    this.buildPotArt();
    this.seedInitialTrees();
    this.buildGarden();
  }
  update(dt) {
    const dtSec = dt / 1e3;
    this.windT += dtSec * WIND_SPEED;
    this.promotePending(dt);
    this.accumulator += dt;
    const interval = 1e3 / Math.max(0.05, this.config.growthSpeed);
    while (this.accumulator >= interval) {
      this.accumulator -= interval;
      this.growTick();
    }
    this.fillSprouts(dtSec);
    this.updateDrifts(dtSec);
    this.updatePetals(dt, dtSec);
    this.updateRake(dt, dtSec);
    this.processRetirement(dtSec);
    this.updateMoss(dt);
    switch (this.season) {
      case "growing": {
        if (this.limbs.length === 0 && this.sproutQueue.length === 0 && this.pending.length === 0)
          this.enterSeason("summer");
        break;
      }
      case "summer": {
        if (!this.config.seasons) break;
        this.seasonTimer += dtSec;
        if (this.seasonTimer >= this.config.holdDuration) this.enterSeason("autumn");
        break;
      }
      case "autumn": {
        this.seasonTimer += dtSec;
        this.dropSeeds(dt);
        this.sweepLeaves(AUTUMN_DURATION, (leaf) => {
          const cell = this.grid[leaf.row][leaf.col];
          if (!cell?.leaf) return;
          cell.color = this.pal().autumn[Math.floor(Math.random() * this.pal().autumn.length)];
          if (Math.random() < DRY_LEAF_CHANCE) cell.char = DRY_LEAF_CHAR;
        });
        if (this.seasonTimer >= AUTUMN_DURATION) this.enterSeason("shedding");
        break;
      }
      case "shedding": {
        this.seasonTimer += dtSec;
        this.dropSeeds(dt);
        this.sweepLeaves(SHED_DURATION, (leaf) => {
          const cell = this.grid[leaf.row][leaf.col];
          if (!cell?.leaf) return;
          this.grid[leaf.row][leaf.col] = null;
          if (this.falling.length < MAX_FALLING && Math.random() < LEAF_FALL_CHANCE) {
            this.falling.push(this.makeDrift(leaf.col, leaf.row, cell.char, cell.color, false));
          }
        });
        if (this.seasonTimer >= SHED_DURATION) this.enterSeason("winter");
        break;
      }
      case "winter": {
        this.seasonTimer += dtSec;
        if (this.seasonTimer >= WINTER_DURATION) this.enterSeason("spring");
        break;
      }
      case "spring": {
        this.seasonTimer += dtSec;
        this.sweepLeaves(SPRING_DURATION, (leaf) => {
          if (!this.grid[leaf.row][leaf.col] && this.isAlive(leaf.tree)) {
            this.grid[leaf.row][leaf.col] = {
              char: leaf.char,
              color: leaf.color,
              leaf: true,
              tree: leaf.tree
            };
          }
        });
        if (this.seasonTimer >= SPRING_DURATION) this.enterSeason("summer");
        break;
      }
    }
  }
  render(ctx, cols, rows, charW, charH) {
    const pal = this.pal();
    this.renderSand(ctx, cols, rows, charW, charH);
    ctx.fillStyle = pal.stone;
    for (const s of this.stones) {
      if (s.col >= 0 && s.col < cols && s.row >= 0 && s.row < rows)
        ctx.fillText(s.char, s.col * charW, (s.row + 1) * charH);
    }
    this.renderPot(ctx, cols, rows, charW, charH);
    this.renderGroundLife(ctx, cols, rows, charW, charH);
    for (let row = 0; row < rows && row < this.grid.length; row++) {
      const line = this.grid[row];
      for (let col = 0; col < cols && col < line.length; col++) {
        const cell = line[col];
        if (!cell) continue;
        if (cell.leaf) {
          const gust = this.noise2D(col * 0.06 - this.windT * 10, row * 0.12 + this.windT * 3);
          ctx.fillStyle = gust > WIND_THRESHOLD ? this.bright(cell.color) : cell.color;
        } else {
          ctx.fillStyle = cell.color;
        }
        ctx.fillText(cell.char, col * charW, (row + 1) * charH);
      }
    }
    for (const d of this.falling) this.renderDrift(ctx, d, cols, rows, charW, charH);
    for (const d of this.seeds) this.renderDrift(ctx, d, cols, rows, charW, charH);
    ctx.fillStyle = pal.petal;
    for (const d of this.petals) {
      const col = Math.round(d.x);
      const row = Math.round(d.y);
      if (col >= 0 && col < cols && row >= 0 && row < rows)
        ctx.fillText(PETAL_CHAR, col * charW, (row + 1) * charH);
    }
  }
  // --- palette ---
  pal() {
    return this.config.palette === "classic" ? this.classicPal : PALETTES[this.config.palette];
  }
  bright(color) {
    let b = this.brightCache.get(color);
    if (!b) {
      b = color.startsWith("#") ? brighten(color) : color;
      this.brightCache.set(color, b);
    }
    return b;
  }
  // --- pot ---
  buildPotArt() {
    const inner = Math.max(12, Math.min(30, Math.round(this.cols * 0.24)));
    const lines = buildPot(this.config.pot, inner);
    const wide = Math.max(...lines.map((l) => l.text.length));
    if (this.rows < lines.length + 8 || this.cols < wide + 2) {
      this.potLines = [];
      this.potWidth = 0;
      return;
    }
    this.potLines = lines;
    this.potWidth = wide;
    this.potTop = this.rows - lines.length;
    this.potLeft = Math.floor(this.cols / 2) - Math.floor(wide / 2);
  }
  renderPot(ctx, cols, rows, charW, charH) {
    const pal = this.pal();
    const tones = { accent: pal.potAccent, body: pal.potBody, soil: pal.soil };
    for (let i = 0; i < this.potLines.length; i++) {
      const row = this.potTop + i;
      if (row < 0 || row >= rows) continue;
      const { text, tone } = this.potLines[i];
      ctx.fillStyle = tones[tone];
      for (let j = 0; j < text.length; j++) {
        const char = text[j];
        if (char === " ") continue;
        const col = this.potLeft + j;
        if (col < 0 || col >= cols) continue;
        ctx.fillText(char, col * charW, (row + 1) * charH);
      }
    }
  }
  renderGroundLife(ctx, cols, rows, charW, charH) {
    const pal = this.pal();
    const groundY = rows * charH;
    ctx.fillStyle = pal.moss;
    for (const tuft of this.tufts) {
      if (tuft.col >= 0 && tuft.col < cols) ctx.fillText(tuft.char, tuft.col * charW, groundY);
    }
    ctx.fillStyle = pal.woodLight;
    for (const col of this.seedSites) {
      if (col >= 0 && col < cols) ctx.fillText(SEED_CHAR, col * charW, groundY);
    }
  }
  renderDrift(ctx, d, cols, rows, charW, charH) {
    const col = Math.round(d.x);
    const row = Math.round(d.y);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return;
    ctx.fillStyle = d.color;
    ctx.fillText(d.char, col * charW, (row + 1) * charH);
  }
  // --- karesansui: sand, rake, stones ---
  buildGarden() {
    this.sandRows = this.rows >= 14 ? 3 : this.rows >= 8 ? 2 : 0;
    this.sandTop = this.rows - this.sandRows;
    const n = this.sandRows * this.cols;
    this.sandChar = new Uint8Array(n);
    this.sandFixed = new Uint8Array(n);
    this.sandGlow = new Float32Array(n);
    this.rakeFront = 0;
    this.rakeEnd = 0;
    this.rakeTimer = RAKE_INTERVAL_MIN_MS * (0.7 + Math.random() * 0.5);
    this.stones = [];
    if (this.sandRows === 0) return;
    this.sandParams = Array.from({ length: this.sandRows }, () => this.makeSandRow());
    for (let r = 0; r < this.sandRows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.sandChar[r * this.cols + c] = this.sandGlyph(c, this.sandParams[r]);
      }
    }
    this.placeStones();
  }
  makeSandRow() {
    return {
      fill: 4 + Math.floor(Math.random() * 3),
      glyph: Math.random() < 0.6 ? 1 : 2,
      // '-' or '~'
      period: 7 + Math.floor(Math.random() * 4),
      phase: Math.floor(Math.random() * 16)
    };
  }
  sandGlyph(col, p) {
    const pos = (col + p.phase) % p.period;
    if (pos < p.fill) return p.glyph;
    return pos === p.fill + 1 && col % 5 === 0 ? 3 : 0;
  }
  placeStones() {
    if (this.cols < 40 || this.sandRows < 2) return;
    const count = this.cols >= 90 ? 2 : 1;
    const shapes = [
      [" oOo", "oOOOo"],
      ["oO", "OOo"]
    ];
    const centers = [];
    for (let s = 0; s < count; s++) {
      let x = -1;
      for (let attempt = 0; attempt < 24; attempt++) {
        const candidate = Math.floor(this.cols * (0.06 + Math.random() * 0.88));
        const clearPot = this.potWidth === 0 || candidate < this.potLeft - 7 || candidate > this.potLeft + this.potWidth + 7;
        const clearTrees = !this.trees.some((t) => Math.abs(t.x - candidate) < 9) && !this.pending.some((t) => Math.abs(t.x - candidate) < 9);
        const clearStones = !centers.some((cx) => Math.abs(cx - candidate) < 18);
        if (clearPot && clearTrees && clearStones) {
          x = candidate;
          break;
        }
      }
      if (x < 0) continue;
      centers.push(x);
      const shape = shapes[s % shapes.length];
      const topRow = this.sandTop - (shape.length - 1);
      for (let r = 0; r < shape.length; r++) {
        const line = shape[r];
        const left = x - Math.floor(line.length / 2);
        for (let c = 0; c < line.length; c++) {
          if (line[c] !== " ") this.stones.push({ char: line[c], col: left + c, row: topRow + r });
        }
      }
      this.rakeRings(x);
    }
  }
  /** Concentric rake hints curving around a stone. */
  rakeRings(stoneX) {
    for (let r = 0; r < this.sandRows; r++) {
      for (let dc = -RING_REACH; dc <= RING_REACH; dc++) {
        const col = stoneX + dc;
        if (col < 0 || col >= this.cols) continue;
        const dy = r * 2.1;
        const d = Math.sqrt(dc * dc + dy * dy);
        if (d > RING_REACH) continue;
        const idx = r * this.cols + col;
        this.sandFixed[idx] = 1;
        if (d < 2) {
          this.sandChar[idx] = 0;
        } else if (d % RING_SPACING < 0.7) {
          this.sandChar[idx] = dc < 0 ? 4 : 5;
        } else {
          this.sandChar[idx] = 0;
        }
      }
    }
  }
  updateRake(dt, dtSec) {
    if (this.sandRows === 0) return;
    for (let i = 0; i < this.sandGlow.length; i++) {
      if (this.sandGlow[i] > 0)
        this.sandGlow[i] = Math.max(0, this.sandGlow[i] - RAKE_GLOW_DECAY * dtSec);
    }
    if (this.rakeFront < this.rakeEnd) {
      const next = Math.min(this.rakeEnd, this.rakeFront + RAKE_SPEED * dtSec);
      for (let col = Math.ceil(this.rakeFront); col < next; col++) {
        if (col < 0 || col >= this.cols) continue;
        for (let r = 0; r < this.sandRows; r++) {
          const idx = r * this.cols + col;
          if (this.sandFixed[idx]) continue;
          this.sandChar[idx] = this.sandGlyph(col, this.sandParams[r]);
          this.sandGlow[idx] = 1;
        }
      }
      this.rakeFront = next;
      return;
    }
    this.rakeTimer -= dt;
    if (this.rakeTimer > 0) return;
    this.rakeTimer = RAKE_INTERVAL_MIN_MS + Math.random() * RAKE_INTERVAL_VAR_MS;
    const width = Math.min(this.cols, 30 + Math.floor(Math.random() * 30));
    this.rakeFront = Math.floor(Math.random() * Math.max(1, this.cols - width));
    this.rakeEnd = this.rakeFront + width;
    this.sandParams = Array.from({ length: this.sandRows }, () => this.makeSandRow());
  }
  renderSand(ctx, cols, rows, charW, charH) {
    if (this.sandRows === 0) return;
    const pal = this.pal();
    for (let r = 0; r < this.sandRows; r++) {
      const row = this.sandTop + r;
      if (row < 0 || row >= rows) continue;
      const y = (row + 1) * charH;
      for (let c = 0; c < cols && c < this.cols; c++) {
        const idx = r * this.cols + c;
        const glyph = this.sandChar[idx];
        if (glyph === 0) continue;
        ctx.fillStyle = this.sandGlow[idx] > 0.05 ? pal.sandBright : pal.sand;
        ctx.fillText(SAND_GLYPHS[glyph], c * charW, y);
      }
    }
  }
  // --- petals on the wind ---
  updatePetals(dt, dtSec) {
    for (const d of this.petals) {
      d.phase += d.phaseSpeed * dtSec;
      d.x += d.vx * dtSec;
      d.y += (Math.sin(d.phase) * 0.5 + d.vy) * dtSec;
    }
    compact(this.petals, (d) => d.x < this.cols && d.y < this.sandTop + 1);
    if (this.rows < 10 || this.cols < 30) return;
    this.petalTimer -= dt;
    if (this.petalTimer > 0 || this.petals.length >= MAX_PETALS) return;
    const base = this.season === "spring" ? PETAL_SPRING_INTERVAL_MS : PETAL_INTERVAL_MS;
    this.petalTimer = base + Math.random() * PETAL_INTERVAL_VAR_MS;
    this.petals.push({
      char: PETAL_CHAR,
      color: "",
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 1 + Math.random(),
      vx: 2 + Math.random() * 1.5 + this.config.lean * 2,
      vy: 0.15 + Math.random() * 0.25,
      x: -1,
      y: 2 + Math.random() * this.rows * 0.45
    });
  }
  // --- trees & growth ---
  effectiveVitality(vitality) {
    return Math.max(4, Math.min(vitality, Math.floor(this.rows * 0.75)));
  }
  maxTrees() {
    if (this.config.treeCount > 0) return this.config.treeCount;
    return this.cols < 80 ? 3 : this.cols < 140 ? 5 : this.cols < 200 ? 6 : 7;
  }
  isAlive(tree) {
    return this.trees.some((t) => t.id === tree);
  }
  /** Potted centerpiece plus permanent edge residents, staggered so nothing grows in sync. */
  seedInitialTrees() {
    const { cols } = this;
    const cap = this.maxTrees();
    const centerX = Math.floor(cols / 2);
    const rootY = this.potLines.length > 0 ? this.potTop - 1 : this.rows - 1;
    this.spawnTrunk(
      centerX,
      rootY,
      this.effectiveVitality(this.config.vitality),
      this.config.lean,
      true
    );
    if (cap < 3 || cols < 40) return;
    const placed = [centerX];
    const addResident = (x, spacing) => {
      if (placed.length >= cap - 1) return;
      if (placed.some((p) => Math.abs(p - x) < spacing)) return;
      placed.push(x);
      this.pending.push({
        delayMs: EDGE_DELAY_MIN_MS + Math.random() * EDGE_DELAY_VAR_MS,
        lean: this.config.lean + (Math.random() - 0.5) * EDGE_LEAN_VAR,
        vitality: this.effectiveVitality(
          Math.round(this.config.vitality * (EDGE_LIFE_MIN + Math.random() * EDGE_LIFE_VAR))
        ),
        x
      });
    };
    addResident(Math.floor(cols * (0.1 + Math.random() * 0.15)), cols * EDGE_SPACING_FRAC);
    addResident(Math.floor(cols * (0.75 + Math.random() * 0.15)), cols * EDGE_SPACING_FRAC);
    let extras = 0;
    if (cols > 160) extras = 2 + Math.floor(Math.random() * 2);
    else if (cols > 100) extras = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < extras * 4; i++) {
      const before = placed.length;
      addResident(Math.floor(cols * (0.05 + Math.random() * 0.9)), cols * 0.1);
      if (placed.length > before && --extras === 0) break;
    }
  }
  spawnTrunk(x, y, vitality, lean, permanent) {
    const id = this.treeSeq++;
    this.trees.push({ id, permanent, x });
    this.limbs.push({
      bias: UP + lean * 0.5,
      charge: 0,
      energy: vitality,
      gen: 0,
      girth: Math.floor(vitality * GIRTH_FRACTION),
      heading: UP + lean * 0.3 + (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: (PHASE_SPEED_MIN + Math.random() * PHASE_SPEED_VAR) * 0.7,
      side: Math.random() < 0.5 ? 1 : -1,
      total: vitality,
      tree: id,
      x,
      y: y + 1
      // limbs stamp after moving, so the first cell lands on the root row
    });
  }
  promotePending(dt) {
    if (this.pending.length === 0) return;
    for (const tree of this.pending) tree.delayMs -= dt;
    for (const tree of this.pending) {
      if (tree.delayMs <= 0) this.spawnTrunk(tree.x, this.rows - 1, tree.vitality, tree.lean, true);
    }
    compact(this.pending, (t) => t.delayMs > 0);
  }
  growTick() {
    const count = this.limbs.length;
    for (let i = 0; i < count; i++) this.stepLimb(this.limbs[i]);
    compact(this.limbs, (limb) => limb.energy > 0);
  }
  stepLimb(limb) {
    limb.phase += limb.phaseSpeed;
    const drift = Math.sin(limb.phase) * CURVE_AMP[limb.gen];
    limb.heading += drift + (limb.bias - limb.heading) * BIAS_PULL[limb.gen];
    limb.heading = Math.max(-Math.PI - DROOP_LIMIT, Math.min(DROOP_LIMIT, limb.heading));
    limb.x += Math.cos(limb.heading);
    limb.y += Math.sin(limb.heading);
    const col = Math.round(limb.x);
    const row = Math.round(limb.y);
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      limb.x = Math.max(0, Math.min(this.cols - 1, limb.x));
      limb.y = Math.max(0, Math.min(this.rows - 1, limb.y));
      this.depositPad(limb);
      limb.energy = 0;
      return;
    }
    this.stampWood(col, row, limb, drift);
    if (limb.girth <= 0) limb.charge += FORK_CHARGE_MIN + Math.random() * FORK_CHARGE_VAR;
    if (limb.charge >= FORK_THRESHOLD && limb.energy > MIN_FORK_ENERGY && limb.gen < MAX_GEN) {
      limb.charge = 0;
      this.fork(limb);
    }
    limb.energy--;
    if (limb.energy <= 0) this.depositPad(limb);
  }
  fork(parent) {
    const dir = parent.side;
    parent.side = dir * -1;
    const gen = parent.gen + 1;
    const ratio = gen === 1 ? 0.45 + this.config.sprawl * 0.35 : TWIG_ENERGY_RATIO;
    const energy = Math.max(
      CHILD_MIN_ENERGY,
      Math.min(CHILD_MAX_ENERGY, Math.round(parent.energy * ratio))
    );
    const rise = 0.18 + (1 - this.config.sprawl) * 0.5;
    let bias;
    let heading;
    if (gen === 1) {
      bias = (dir < 0 ? -Math.PI + rise : -rise) + this.config.lean * 0.3;
      heading = bias - dir * (0.2 + Math.random() * 0.3);
    } else {
      const outward = parent.heading + dir * 0.5;
      bias = outward + (UP - outward) * 0.25;
      heading = parent.heading + dir * (FORK_SPREAD_MIN + Math.random() * FORK_SPREAD_VAR);
    }
    this.limbs.push({
      bias,
      charge: 0,
      energy,
      gen,
      girth: 0,
      heading,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: PHASE_SPEED_MIN + Math.random() * PHASE_SPEED_VAR,
      side: Math.random() < 0.5 ? 1 : -1,
      total: energy,
      tree: parent.tree,
      x: parent.x,
      y: parent.y
    });
  }
  woodChar(heading, drift) {
    if (Math.random() < KNOT_CHANCE) return "%";
    const dx = Math.cos(heading);
    const dy = Math.sin(heading);
    if (Math.abs(dx) < 0.35) return drift < -0.03 ? "(" : drift > 0.03 ? ")" : "|";
    if (Math.abs(dy) < 0.35) return Math.abs(dx) > 0.9 ? "=" : "-";
    return dx * dy > 0 ? "\\" : "/";
  }
  woodColor(limb) {
    const pal = this.pal();
    const age = 1 - limb.energy / limb.total;
    return age > 0.6 || Math.random() < 0.15 ? pal.woodLight : pal.woodDark;
  }
  stampWood(col, row, limb, drift) {
    const color = this.woodColor(limb);
    this.setCell(col, row, this.woodChar(limb.heading, drift), color, false, limb.tree);
    const age = 1 - limb.energy / limb.total;
    if (limb.girth > 0) {
      limb.girth--;
      this.enqueueCell(col - 1, row, "(", color, false, limb.tree);
      this.enqueueCell(col + 1, row, ")", color, false, limb.tree);
    } else if (limb.gen === 0 && age < TAPER_FRACTION) {
      if (drift < 0) this.enqueueCell(col - 1, row, "(", color, false, limb.tree);
      else this.enqueueCell(col + 1, row, ")", color, false, limb.tree);
    }
  }
  setCell(col, row, char, color, leaf, tree) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    if (leaf && this.grid[row][col]) return;
    this.grid[row][col] = { char, color, leaf, tree };
  }
  enqueueCell(col, row, char, color, leaf, tree) {
    this.sproutQueue.push({ char, col, color, leaf, row, tree });
  }
  fillSprouts(dtSec) {
    if (this.sproutQueue.length === 0) return;
    this.sproutCarry += SPROUT_RATE_FACTOR * Math.max(0.05, this.config.growthSpeed) * dtSec;
    let n = Math.floor(this.sproutCarry);
    this.sproutCarry -= n;
    while (n-- > 0) {
      const cell = this.sproutQueue.shift();
      if (!cell) break;
      if (!this.isAlive(cell.tree)) continue;
      this.setCell(cell.col, cell.row, cell.char, cell.color, cell.leaf, cell.tree);
    }
  }
  depositPad(limb) {
    if (limb.gen === 0 && limb.total < 10) return;
    const pal = this.pal();
    const spread = this.config.sprawl;
    const rx = (limb.gen === 0 ? 5 : limb.gen === 1 ? 3.4 + spread * 1.8 : 2.8) + Math.random() * 0.6;
    const ry = (limb.gen <= 1 ? 1.8 + spread * 0.5 : 1.5) + Math.random() * 0.3;
    const cells = [];
    for (let iy = -Math.ceil(ry); iy <= Math.ceil(ry); iy++) {
      for (let ix = -Math.ceil(rx); ix <= Math.ceil(rx); ix++) {
        const d2 = (ix / rx) ** 2 + (iy / ry) ** 2;
        if (d2 > 1) continue;
        if (Math.random() > 1.05 - 0.4 * d2) continue;
        const roll = Math.random();
        let char;
        let color;
        if (d2 < 0.22) {
          char = "@";
          color = roll < 0.85 ? pal.leafCore : pal.leafBody;
        } else if (d2 < 0.6) {
          char = "o";
          color = roll < 0.8 ? pal.leafBody : pal.leafFringe;
        } else {
          char = '"';
          color = roll < 0.8 ? pal.leafFringe : pal.leafBody;
        }
        cells.push({
          char,
          col: Math.round(limb.x) + ix,
          color,
          d2: d2 + Math.random() * 0.3,
          // jittered so the bloom edge stays organic
          leaf: true,
          row: Math.round(limb.y) + iy,
          tree: limb.tree
        });
      }
    }
    cells.sort((a, b) => a.d2 - b.d2);
    for (const cell of cells) this.sproutQueue.push(cell);
  }
  // --- seasons ---
  enterSeason(season) {
    this.season = season;
    this.seasonTimer = 0;
    this.leafProgress = 0;
    if (season === "autumn") this.collectLeafCells();
    if (season === "spring") this.sproutSeeds();
    this.leafOrder = shuffle(Array.from({ length: this.leafCells.length }, (_, i) => i));
  }
  collectLeafCells() {
    this.leafCells = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];
        if (cell?.leaf) {
          this.leafCells.push({ char: cell.char, col, color: cell.color, row, tree: cell.tree });
        }
      }
    }
  }
  /** Applies fn to leaves one by one in shuffled order, paced over the phase. */
  sweepLeaves(duration, fn) {
    if (this.leafCells.length === 0) return;
    const progress = Math.min(1, this.seasonTimer / duration);
    const target = Math.floor(progress * this.leafCells.length);
    while (this.leafProgress < target) {
      fn(this.leafCells[this.leafOrder[this.leafProgress]]);
      this.leafProgress++;
    }
  }
  // --- drifting leaves & seeds ---
  makeDrift(x, y, char, color, isSeed) {
    const vx = isSeed ? (Math.random() - 0.5) * 1.8 + this.config.lean * 0.8 : (Math.random() - 0.5) * 0.6 + this.config.lean * 1.5;
    return {
      char,
      color,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 1.2 + Math.random(),
      vx,
      vy: isSeed ? 0.9 + Math.random() * 0.4 : 2 + Math.random() * 1.5,
      x,
      y
    };
  }
  dropSeeds(dt) {
    this.seedTimer -= dt;
    if (this.seedTimer > 0) return;
    this.seedTimer = SEED_INTERVAL_MS + Math.random() * SEED_INTERVAL_VAR_MS;
    for (let attempt = 0; attempt < 6; attempt++) {
      const leaf = this.leafCells[Math.floor(Math.random() * this.leafCells.length)];
      if (!leaf || !this.grid[leaf.row][leaf.col]?.leaf) continue;
      this.seeds.push(this.makeDrift(leaf.col, leaf.row, SEED_CHAR, this.pal().woodLight, true));
      return;
    }
  }
  updateDrifts(dtSec) {
    const sway = 1.5;
    const ground = this.rows - 1;
    for (const d of this.falling) {
      d.phase += d.phaseSpeed * dtSec;
      d.x += (Math.sin(d.phase) * sway + d.vx) * dtSec;
      d.y += d.vy * dtSec;
    }
    compact(this.falling, (d) => d.y < ground);
    for (const d of this.seeds) {
      d.phase += d.phaseSpeed * dtSec;
      d.x += (Math.sin(d.phase) * sway * 0.5 + d.vx) * dtSec;
      d.y += d.vy * dtSec;
      if (d.y >= ground) this.landSeed(Math.round(d.x));
    }
    compact(this.seeds, (d) => d.y < ground);
  }
  landSeed(col) {
    if (col < 0 || col >= this.cols) return;
    if (this.seedSites.length >= MAX_SEED_SITES) return;
    if (this.potWidth > 0 && col >= this.potLeft - 2 && col <= this.potLeft + this.potWidth + 1)
      return;
    const spacing = this.cols * 0.08;
    if (this.seedSites.some((c) => Math.abs(c - col) < spacing)) return;
    this.seedSites.push(col);
  }
  sproutSeeds() {
    const spacing = this.cols * SPROUT_SPACING_FRAC;
    for (const col of this.seedSites) {
      if (this.trees.some((t) => Math.abs(t.x - col) < spacing)) continue;
      if (this.trees.length >= this.maxTrees() && !this.retireOldest()) continue;
      const vitality = this.effectiveVitality(
        Math.round(
          this.config.vitality * (SPROUT_VITALITY_MIN + Math.random() * SPROUT_VITALITY_VAR)
        )
      );
      this.spawnTrunk(
        col,
        this.rows - 1,
        vitality,
        this.config.lean + (Math.random() - 0.5) * 0.4,
        false
      );
    }
    this.seedSites = [];
  }
  // --- population ---
  /** Permanent residents (potted tree + edge trees) never retire. */
  retireOldest() {
    const victim = this.trees.find((t) => !t.permanent);
    if (!victim) return false;
    this.trees = this.trees.filter((t) => t.id !== victim.id);
    compact(this.limbs, (l) => l.tree !== victim.id);
    compact(this.sproutQueue, (c) => c.tree !== victim.id);
    const cells = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col]?.tree === victim.id) cells.push({ col, row });
      }
    }
    this.retiring.push({ cells: shuffle(cells), tree: victim.id });
    return true;
  }
  processRetirement(dtSec) {
    if (this.retiring.length === 0) return;
    this.retireCarry += RETIRE_RATE * dtSec;
    let n = Math.floor(this.retireCarry);
    this.retireCarry -= n;
    while (n-- > 0 && this.retiring.length > 0) {
      const entry2 = this.retiring[0];
      const pos = entry2.cells.pop();
      if (pos && this.grid[pos.row][pos.col]?.tree === entry2.tree) {
        this.grid[pos.row][pos.col] = null;
      }
      if (entry2.cells.length === 0) this.retiring.shift();
    }
  }
  // --- moss ---
  updateMoss(dt) {
    this.mossTimer += dt;
    if (this.mossTimer < MOSS_INTERVAL_MS) return;
    this.mossTimer = 0;
    if (this.tufts.length >= 4 + this.trees.length * MOSS_PER_TREE) return;
    const tree = this.trees[Math.floor(Math.random() * this.trees.length)];
    if (!tree) return;
    const col = tree.x + Math.round((Math.random() - 0.5) * 18);
    if (col < 0 || col >= this.cols) return;
    if (this.potWidth > 0 && col >= this.potLeft - 1 && col <= this.potLeft + this.potWidth) return;
    if (this.tufts.some((t) => t.col === col)) return;
    this.tufts.push({ char: MOSS_CHARS[Math.floor(Math.random() * MOSS_CHARS.length)], col });
  }
};
var DEFAULT_FIRE_CONFIG = {
  charset: "classic",
  decay: 1,
  embers: true,
  fps: 25,
  intensity: 7,
  mode: "wall",
  palette: "classic",
  pulse: false,
  sparks: true,
  thickness: 1,
  turbulence: 5,
  wind: 0
};
var PALETTES2 = {
  blue: [
    "#000000",
    "#020a1a",
    "#061a3d",
    "#0a2a5e",
    "#104080",
    "#1860a8",
    "#2088d0",
    "#40b0f0",
    "#80d8ff",
    "#e0f8ff"
  ],
  classic: [
    "#000000",
    "#1a0a02",
    "#3d1206",
    "#5e1a08",
    "#8c2a08",
    "#b84510",
    "#d86a18",
    "#f49922",
    "#ffc844",
    "#fff8dc"
  ],
  lava: [
    "#000000",
    "#1a0000",
    "#3d0404",
    "#600808",
    "#8a1010",
    "#b82020",
    "#e04040",
    "#f08060",
    "#ffc0a0",
    "#ffffff"
  ],
  matrix: [
    "#000000",
    "#001a02",
    "#003d08",
    "#006010",
    "#008820",
    "#10b030",
    "#30d850",
    "#60f080",
    "#a0ffb0",
    "#e0ffe8"
  ]
};
var CHARSETS = {
  blocks: " \u2591\u2592\u2593\u2588",
  classic: " .:-=+*#%@",
  sparks: " .,*+xX#%"
};
var MAX_EMBER_COUNT = 128;
var MAX_SPARK_COUNT = 32;
var PULSE_SPEED = 1.2;
var clamp = (v, min, max) => Math.max(min, Math.min(max, v));
var makePool = (max) => ({
  count: 0,
  life: new Float32Array(max),
  vx: new Float32Array(max),
  vy: new Float32Array(max),
  x: new Float32Array(max),
  y: new Float32Array(max)
});
var FirePattern = class {
  config;
  heat = new Float32Array(0);
  noise = new Float32Array(0);
  cols = 0;
  rows = 0;
  accumulator = 0;
  pulsePhase = 0;
  noiseScroll = 0;
  embers = makePool(MAX_EMBER_COUNT);
  sparks = makePool(MAX_SPARK_COUNT);
  constructor(config = {}) {
    this.config = { ...DEFAULT_FIRE_CONFIG, ...config };
  }
  setConfig(patch) {
    this.config = { ...this.config, ...patch };
  }
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.accumulator = 0;
    this.pulsePhase = 0;
    this.noiseScroll = 0;
    this.embers = makePool(MAX_EMBER_COUNT);
    this.sparks = makePool(MAX_SPARK_COUNT);
    this.heat = new Float32Array(cols * rows);
    this.initNoise();
    this.igniteFuelRows();
  }
  update(dt) {
    const intervalMs = 1e3 / this.config.fps;
    this.accumulator += dt;
    while (this.accumulator >= intervalMs) {
      if (this.config.pulse) this.pulsePhase += PULSE_SPEED * (intervalMs / 1e3);
      this.tick();
      this.accumulator -= intervalMs;
    }
    const dtSec = dt / 1e3;
    if (this.config.embers) {
      this.spawnEmber();
      this.updateEmbers(dtSec);
    }
    if (this.config.sparks) {
      this.spawnSparks();
      this.updateSparks(dtSec);
    }
  }
  render(ctx, cols, rows, charW, charH) {
    const charset = CHARSETS[this.config.charset];
    const charLen = charset.length - 1;
    const isMono = this.config.palette === "mono";
    const palette = isMono ? null : PALETTES2[this.config.palette];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const heat = this.heat[row * this.cols + col];
        if (heat < 0.5) continue;
        const charIdx = Math.min(charLen, Math.floor(heat * charLen / 9 + 0.5));
        const char = charset[charIdx];
        if (char === " ") continue;
        if (isMono) {
          const v = Math.floor(clamp(heat / 10, 0, 1) * 255);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
        } else {
          ctx.fillStyle = palette[Math.min(9, Math.floor(heat))];
        }
        ctx.fillText(char, col * charW, (row + 1) * charH);
      }
    }
    if (this.config.embers) this.renderEmbers(ctx, cols, rows, charW, charH);
    if (this.config.sparks) this.renderSparks(ctx, cols, rows, charW, charH);
  }
  // --- noise ---
  initNoise() {
    const n = this.cols * this.rows;
    this.noise = new Float32Array(n);
    for (let i = 0; i < n; i++) this.noise[i] = 0.3 * Math.random();
    const tmp = new Float32Array(n);
    for (let pass = 0; pass < 2; pass++) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          let sum = 0;
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const r = row + dr;
              const c = col + dc;
              if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                sum += this.noise[r * this.cols + c];
                count++;
              }
            }
          }
          tmp[row * this.cols + col] = sum / count;
        }
      }
      for (let i = 0; i < n; i++) this.noise[i] = tmp[i];
    }
  }
  // --- fuel regions ---
  getFuelRegions() {
    const { cols } = this;
    switch (this.config.mode) {
      case "campfire": {
        const w = 0.3 * cols;
        return [{ w, x: cols / 2 - w / 2 }];
      }
      case "torch": {
        const count = Math.min(4, Math.max(3, Math.floor(cols / 25)));
        const spacing = cols / (count + 1);
        const w = Math.max(3, 0.06 * cols);
        return Array.from({ length: count }, (_, i) => ({
          w,
          x: spacing * (i + 1) - w / 2
        }));
      }
      case "candles": {
        const count = Math.min(8, Math.max(5, Math.floor(cols / 15)));
        const spacing = cols / (count + 1);
        const w = Math.max(2, 0.03 * cols);
        return Array.from({ length: count }, (_, i) => ({
          w,
          x: spacing * (i + 1) - w / 2
        }));
      }
      default:
        return [{ w: cols, x: 0 }];
    }
  }
  isInFuelRegion(col, regions) {
    for (const r of regions) {
      if (col >= r.x && col < r.x + r.w) return true;
    }
    return false;
  }
  // --- simulation ---
  tick() {
    this.igniteFuelRows();
    this.flameSurges();
    this.propagate();
    this.horizontalSmooth();
  }
  igniteFuelRows() {
    const { intensity, pulse, thickness } = this.config;
    const regions = this.getFuelRegions();
    const pulseMultiplier = pulse ? 0.7 + 0.3 * Math.sin(this.pulsePhase) : 1;
    const safeThickness = Math.min(thickness, this.rows - 2);
    for (let t = 0; t < safeThickness; t++) {
      const row = this.rows - 1 - t;
      for (let col = 0; col < this.cols; col++) {
        const idx = row * this.cols + col;
        if (!this.isInFuelRegion(col, regions)) {
          this.heat[idx] *= 0.3;
          continue;
        }
        const fuel = intensity * (0.6 + 0.4 * Math.random()) * pulseMultiplier;
        const flickerChance = 0.12 / Math.sqrt(safeThickness);
        if (Math.random() < flickerChance) {
          this.heat[idx] *= 0.7;
        } else {
          this.heat[idx] = Math.max(this.heat[idx], fuel);
        }
      }
    }
  }
  flameSurges() {
    const regions = this.getFuelRegions();
    const surgeChance = this.config.mode === "wall" ? 1 : this.config.mode === "campfire" ? 0.5 : 0.3;
    const surgeCount = Math.random() < 0.5 * surgeChance ? 1 + Math.floor(Math.random() * 4) : 0;
    for (let s = 0; s < surgeCount; s++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const centerCol = Math.floor(region.x + Math.random() * region.w);
      const height = 4 + Math.floor(Math.random() * 8);
      const maxHeat = 7 + 3 * Math.random();
      for (let h = 0; h < height; h++) {
        const row = this.rows - 2 - this.config.thickness - h;
        if (row < 0) break;
        const halfWidth = 1.5 * Math.sin(h / height * Math.PI);
        for (let dc = -halfWidth; dc <= halfWidth; dc++) {
          const col = centerCol + Math.round(dc + (Math.random() - 0.5));
          if (col < 0 || col >= this.cols) continue;
          const idx = row * this.cols + col;
          const heatVal = maxHeat * (1 - h / height * 0.5) * (0.6 + 0.4 * Math.random());
          this.heat[idx] = Math.max(this.heat[idx], heatVal);
        }
      }
    }
  }
  propagate() {
    const { cols, config, heat, noise, rows } = this;
    const fuelBottom = rows - config.thickness;
    const n = cols * rows;
    const rowBuf = new Float32Array(cols);
    this.noiseScroll += 0.02;
    for (let row = 0; row < fuelBottom; row++) {
      const heightFactor = 1 - row / rows;
      rowBuf.fill(0);
      for (let col = 0; col < cols; col++) {
        const below = row + 1;
        if (below >= rows) continue;
        let srcCol = col;
        if (config.wind !== 0) {
          const drift = config.wind * heightFactor * (0.5 + 0.3 * Math.random());
          srcCol = clamp(Math.round(col + drift), 0, cols - 1);
        }
        let sum = 0;
        let weight = 0;
        sum += 3 * heat[below * cols + srcCol];
        weight += 3;
        if (srcCol > 0) {
          sum += 2 * heat[below * cols + (srcCol - 1)];
          weight += 2;
        }
        if (srcCol < cols - 1) {
          sum += 2 * heat[below * cols + (srcCol + 1)];
          weight += 2;
        }
        if (srcCol > 1) {
          sum += heat[below * cols + (srcCol - 2)];
          weight += 1;
        }
        if (srcCol < cols - 2) {
          sum += heat[below * cols + (srcCol + 2)];
          weight += 1;
        }
        if (below + 1 < rows) {
          sum += heat[(below + 1) * cols + srcCol];
          weight += 1;
        }
        let h = sum / weight;
        const decayBase = 0.2 * config.decay;
        const noiseIdx = (row + Math.floor(10 * this.noiseScroll)) % rows * cols + col;
        h -= decayBase * (0.6 + noise[Math.abs(noiseIdx) % n] + 0.4 * Math.random());
        h += (Math.random() - 0.5) * heightFactor * config.turbulence * 0.12;
        rowBuf[col] = clamp(h, 0, 10);
      }
      for (let col = 0; col < cols; col++) {
        heat[row * cols + col] = rowBuf[col];
      }
    }
  }
  horizontalSmooth() {
    const { cols, heat, rows } = this;
    const start = Math.max(0, rows - 8);
    for (let row = start; row < rows - 1; row++) {
      for (let col = 1; col < cols - 1; col++) {
        const idx = row * cols + col;
        heat[idx] = 0.85 * heat[idx] + 0.075 * (heat[idx - 1] + heat[idx + 1]);
      }
    }
  }
  // --- embers (SoA) ---
  spawnEmber() {
    const { config, embers, rows } = this;
    if (embers.count >= MAX_EMBER_COUNT || rows < 3) return;
    const regions = this.getFuelRegions();
    const chance = 0.12 + 0.02 * config.thickness + 0.01 * config.intensity;
    if (Math.random() >= chance) return;
    const region = regions[Math.floor(Math.random() * regions.length)];
    const i = embers.count++;
    embers.x[i] = region.x + Math.random() * region.w;
    embers.y[i] = rows - config.thickness - 1 - 3 * Math.random();
    embers.life[i] = 0.8 + 1.5 * Math.random();
    embers.vx[i] = 0.2 * (Math.random() - 0.5) - 0.08 * config.wind;
    embers.vy[i] = -0.3 - 0.2 * Math.random();
  }
  updateEmbers(dtSec) {
    const { cols, config, embers } = this;
    if (embers.count === 0) return;
    let alive = 0;
    for (let i = 0; i < embers.count; i++) {
      embers.life[i] -= dtSec;
      if (embers.life[i] <= 0) continue;
      embers.x[i] += embers.vx[i] * dtSec * 30;
      embers.y[i] += embers.vy[i] * dtSec * 30;
      embers.vx[i] += 0.5 * (Math.random() - 0.5) - 0.02 * config.wind;
      embers.vy[i] -= 0.05;
      embers.vx[i] = clamp(embers.vx[i], -1.5, 1.5);
      embers.vy[i] = clamp(embers.vy[i], -1.5, 0.5);
      if (embers.y[i] < 0 || embers.x[i] < 0 || embers.x[i] >= cols) continue;
      if (alive !== i) {
        embers.x[alive] = embers.x[i];
        embers.y[alive] = embers.y[i];
        embers.vx[alive] = embers.vx[i];
        embers.vy[alive] = embers.vy[i];
        embers.life[alive] = embers.life[i];
      }
      alive++;
    }
    embers.count = alive;
  }
  renderEmbers(ctx, cols, rows, charW, charH) {
    const { config, embers } = this;
    const isMono = config.palette === "mono";
    const palette = isMono ? null : PALETTES2[config.palette];
    for (let i = 0; i < embers.count; i++) {
      const col = Math.floor(embers.x[i]);
      const row = Math.floor(embers.y[i]);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const char = embers.life[i] > 0.3 ? "*" : ".";
      if (isMono) {
        const v = Math.floor((embers.life[i] > 0.5 ? 1 : 0.7) * 255);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
      } else {
        ctx.fillStyle = palette[embers.life[i] > 0.5 ? 9 : 7];
      }
      ctx.fillText(char, col * charW, (row + 1) * charH);
    }
  }
  // --- sparks (SoA) ---
  spawnSparks() {
    const { config, rows, sparks } = this;
    if (sparks.count >= MAX_SPARK_COUNT || rows < 3) return;
    const regions = this.getFuelRegions();
    const chance = 0.25 + 0.03 * config.intensity;
    if (Math.random() >= chance) return;
    const burstCount = 1 + Math.floor(Math.random() * 3);
    for (let b = 0; b < burstCount && sparks.count < MAX_SPARK_COUNT; b++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const i = sparks.count++;
      sparks.x[i] = region.x + Math.random() * region.w;
      sparks.y[i] = rows - config.thickness - 2 - 2 * Math.random();
      sparks.life[i] = 0.25 + 0.35 * Math.random();
      sparks.vx[i] = 3 * (Math.random() - 0.5) - 0.15 * config.wind;
      sparks.vy[i] = -0.5 - 1.5 * Math.random();
    }
  }
  updateSparks(dtSec) {
    const { cols, config, sparks } = this;
    if (sparks.count === 0) return;
    let alive = 0;
    for (let i = 0; i < sparks.count; i++) {
      sparks.life[i] -= dtSec;
      if (sparks.life[i] <= 0) continue;
      sparks.x[i] += sparks.vx[i] * dtSec * 30;
      sparks.y[i] += sparks.vy[i] * dtSec * 30;
      sparks.vx[i] += 2 * (Math.random() - 0.5) - 0.05 * config.wind;
      sparks.vy[i] += 0.3;
      if (sparks.y[i] < 0 || sparks.x[i] < 0 || sparks.x[i] >= cols) continue;
      if (alive !== i) {
        sparks.x[alive] = sparks.x[i];
        sparks.y[alive] = sparks.y[i];
        sparks.vx[alive] = sparks.vx[i];
        sparks.vy[alive] = sparks.vy[i];
        sparks.life[alive] = sparks.life[i];
      }
      alive++;
    }
    sparks.count = alive;
  }
  renderSparks(ctx, cols, rows, charW, charH) {
    const { config, sparks } = this;
    const isMono = config.palette === "mono";
    const palette = isMono ? null : PALETTES2[config.palette];
    for (let i = 0; i < sparks.count; i++) {
      const col = Math.floor(sparks.x[i]);
      const row = Math.floor(sparks.y[i]);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      if (isMono) {
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = palette[9];
      }
      ctx.fillText("'", col * charW, (row + 1) * charH);
    }
  }
};
var CHARS2 = "|";
var SPLASH_DECAY_PER_SECOND = 1.5;
var SPLASH_GRAVITY = 3;
var IMPACT_FRAMES = 20;
var ALPHA_CUTOFF = 0.05;
var SPLASH_CHAR_THRESHOLD = 0.4;
var DEFAULT_RAIN_CONFIG = {
  density: 1,
  speedRange: [1, 3],
  lengthRange: [5, 20],
  trailDecay: 0.05,
  splashes: true,
  impacts: true
};
var randomInRange = (min, max) => Math.random() * (max - min) + min;
var greyColor = (alpha) => {
  const v = Math.floor(alpha * 255);
  return `rgb(${v},${v},${v})`;
};
var splashCharsFor = (vCol) => {
  if (vCol < -0.8) return { heavy: "\\", light: "," };
  if (vCol > 0.8) return { heavy: "/", light: "." };
  return { heavy: "|", light: "'" };
};
var RainPattern = class {
  config;
  cols = 0;
  rows = 0;
  columns = [];
  alpha = [];
  chars = [];
  splashes = [];
  impacts = [];
  constructor(config = {}) {
    this.config = { ...DEFAULT_RAIN_CONFIG, ...config };
  }
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.splashes = [];
    this.impacts = [];
    this.columns = Array.from({ length: cols }, () => this.makeColumn(true));
    this.alpha = Array.from({ length: rows }, () => new Float32Array(cols));
    this.chars = Array.from({ length: rows }, () => new Uint8Array(cols));
  }
  update(dt) {
    const dtSec = dt / 1e3;
    this.updateColumns(dtSec);
    this.updateSplashes(dtSec);
    this.updateImpacts();
  }
  render(ctx, cols, rows, charW, charH) {
    this.renderTrail(ctx, cols, rows, charW, charH);
    this.renderImpacts(ctx, charW, charH);
    this.renderSplashes(ctx, cols, rows, charW, charH);
  }
  // init=true: wide stagger so drops arrive gradually across a large off-screen range.
  // init=false (reset): short stagger so the column refills without a visible gap.
  makeColumn(init = false) {
    const { density, lengthRange, speedRange } = this.config;
    return {
      // density < 1 keeps some columns empty; activity re-rolls on every respawn
      active: Math.random() < density,
      hitBottom: false,
      length: randomInRange(lengthRange[0], lengthRange[1]),
      speed: randomInRange(speedRange[0], speedRange[1]),
      y: init ? -(Math.random() * this.rows * 4) : -(Math.random() * this.rows * 0.5)
    };
  }
  spawnSplash(col) {
    if (this.config.impacts) {
      this.impacts.push({ col, framesLeft: IMPACT_FRAMES, row: this.rows - 1 });
    }
    if (!this.config.splashes) return;
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      const vCol = (Math.random() - 0.5) * 12;
      const { heavy, light } = splashCharsFor(vCol);
      this.splashes.push({
        alpha: 0.75 + Math.random() * 0.25,
        col: col + (Math.random() - 0.5) * 3,
        heavyChar: heavy,
        lightChar: light,
        row: this.rows - 1,
        vCol,
        vRow: -(Math.random() * 5 + 2)
      });
    }
  }
  updateColumns(dtSec) {
    const decayFactor = this.config.trailDecay ** dtSec;
    for (let col = 0; col < this.cols; col++) {
      const column = this.columns[col];
      column.y += column.speed * dtSec;
      for (let row = 0; row < this.rows; row++) {
        this.alpha[row][col] *= decayFactor;
      }
      const head = Math.floor(column.y);
      if (column.active && head >= 0 && head < this.rows) {
        this.alpha[head][col] = 1;
        this.chars[head][col] = Math.floor(Math.random() * CHARS2.length);
      }
      if (column.active && !column.hitBottom && head >= this.rows - 1) {
        column.hitBottom = true;
        this.spawnSplash(col);
      }
      if (column.y > this.rows + column.length) {
        this.columns[col] = this.makeColumn();
      }
    }
  }
  updateSplashes(dtSec) {
    const decayAmount = SPLASH_DECAY_PER_SECOND * dtSec;
    for (const s of this.splashes) {
      s.col += s.vCol * dtSec;
      s.row += s.vRow * dtSec;
      s.vRow += SPLASH_GRAVITY * dtSec;
      s.alpha -= decayAmount;
    }
    this.splashes = this.splashes.filter((s) => s.alpha > ALPHA_CUTOFF && s.row < this.rows);
  }
  updateImpacts() {
    for (const impact of this.impacts) impact.framesLeft--;
    this.impacts = this.impacts.filter((i) => i.framesLeft > 0);
  }
  renderTrail(ctx, cols, rows, charW, charH) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellAlpha = this.alpha[row][col];
        if (cellAlpha < ALPHA_CUTOFF) continue;
        const isHead = Math.floor(this.columns[col].y) === row;
        ctx.fillStyle = greyColor(isHead ? 1 : cellAlpha);
        ctx.fillText(CHARS2.charAt(this.chars[row][col]), col * charW, (row + 1) * charH);
      }
    }
  }
  renderImpacts(ctx, charW, charH) {
    for (const impact of this.impacts) {
      ctx.fillStyle = greyColor(impact.framesLeft / IMPACT_FRAMES);
      ctx.fillText("*", impact.col * charW, (impact.row + 1) * charH);
    }
  }
  renderSplashes(ctx, cols, rows, charW, charH) {
    for (const s of this.splashes) {
      const col = Math.round(s.col);
      const row = Math.round(s.row);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const char = s.alpha > SPLASH_CHAR_THRESHOLD ? s.heavyChar : s.lightChar;
      ctx.fillStyle = greyColor(s.alpha);
      ctx.fillText(char, col * charW, (row + 1) * charH);
    }
  }
};
var SPAWN_MARGIN = 0.2;
var SWAY_FREQUENCY = 0.2;
var SWAY_PHASE_RANGE = Math.PI * 2 * 50;
var RESPAWN_Y_MIN = -1;
var RESPAWN_Y_MAX = -3;
var SPEED_CHAR_LOW = 0.33;
var SPEED_CHAR_HIGH = 0.66;
var COLOR_BG = "rgb(100,100,100)";
var COLOR_FG = "rgb(220,220,220)";
var DEFAULT_SNOW_CONFIG = {
  density: 0.4,
  speedRange: [1, 4],
  swayAmount: 1,
  wind: 0
};
var randomInRange2 = (min, max) => Math.random() * (max - min) + min;
var charForSpeed = (speedY, min, max) => {
  const t = (speedY - min) / (max - min);
  if (t < SPEED_CHAR_LOW) return ".";
  if (t > SPEED_CHAR_HIGH) return "*";
  return "+";
};
var createFlake = (cols, rows, config, initialSpread) => {
  const { speedRange, swayAmount } = config;
  const depth = Math.random() < 0.5 ? 0 : 1;
  const mid = (speedRange[0] + speedRange[1]) / 2;
  const speedY = depth === 0 ? randomInRange2(speedRange[0], mid) : randomInRange2(mid, speedRange[1]);
  const swayAmplitude = depth === 0 ? swayAmount * 0.5 : swayAmount;
  const spawnMin = -cols * SPAWN_MARGIN;
  const spawnMax = cols * (1 + SPAWN_MARGIN);
  return {
    char: charForSpeed(speedY, speedRange[0], speedRange[1]),
    depth,
    speedY,
    swayAmplitude,
    swayOffset: Math.random() * SWAY_PHASE_RANGE,
    x: randomInRange2(spawnMin, spawnMax),
    y: randomInRange2(0, rows)
  };
};
var SnowPattern = class {
  config;
  flakes = [];
  constructor(config = {}) {
    this.config = { ...DEFAULT_SNOW_CONFIG, ...config };
  }
  init(cols, rows) {
    const count = Math.floor(cols * this.config.density);
    this.flakes = Array.from({ length: count }, () => createFlake(cols, rows, this.config));
  }
  update(dt) {
    const s = dt / 1e3;
    const { wind } = this.config;
    for (const flake of this.flakes) {
      flake.y += flake.speedY * s;
      flake.x += Math.sin(flake.y * SWAY_FREQUENCY + flake.swayOffset) * flake.swayAmplitude * s;
      flake.x += wind * s;
    }
  }
  render(ctx, cols, rows, charW, charH) {
    this.respawnOffscreen(cols, rows);
    for (const flake of this.flakes) {
      const col = Math.floor(flake.x);
      const row = Math.floor(flake.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillStyle = flake.depth === 0 ? COLOR_BG : COLOR_FG;
      ctx.fillText(flake.char, col * charW, row * charH);
    }
  }
  respawnOffscreen(cols, rows) {
    const spawnMin = -cols * SPAWN_MARGIN;
    const spawnMax = cols * (1 + SPAWN_MARGIN);
    for (const flake of this.flakes) {
      if (flake.y <= rows) continue;
      flake.y = randomInRange2(RESPAWN_Y_MAX, RESPAWN_Y_MIN);
      flake.x = randomInRange2(spawnMin, spawnMax);
    }
  }
};
var CHAR_TIERS = [
  [0.75, "~", "^"],
  [0.55, "~", "\u2248"],
  [0.35, "-", "="],
  [0.15, "\u2591", "\u2592"]
];
var FALLBACK_CHARS = [".", " "];
var OCEAN_COLORS = [
  [0.75, "rgb(230,240,255)"],
  [0.55, "rgb(100,180,255)"],
  [0.35, "rgb(40,100,200)"],
  [0.15, "rgb(20,50,120)"]
];
var OCEAN_COLOR_DARK = "rgb(10,20,40)";
var MONO_BASE2 = 30;
var MONO_RANGE2 = 200;
var DEFAULT_WAVE_CONFIG = {
  amplitude: 0.8,
  choppiness: 0.3,
  frequency: 1.5,
  palette: "ocean",
  speed: 1
};
var clamp2 = (v, min, max) => Math.max(min, Math.min(max, v));
var pickChar = (col, row, a, b) => (col + row * 7) % 2 === 0 ? a : b;
var oceanColor = (value) => {
  for (const [threshold, color] of OCEAN_COLORS) {
    if (value > threshold) return color;
  }
  return OCEAN_COLOR_DARK;
};
var monoColor2 = (value) => {
  const v = Math.floor(value * MONO_RANGE2 + MONO_BASE2);
  return `rgb(${v},${v},${v})`;
};
var WavePattern = class {
  config;
  noise3D = createNoise3D();
  time = 0;
  constructor(config = {}) {
    this.config = { ...DEFAULT_WAVE_CONFIG, ...config };
  }
  init(_cols, _rows) {
    this.time = 0;
    this.noise3D = createNoise3D();
  }
  update(dt) {
    this.time += dt / 1e3;
  }
  render(ctx, cols, rows, charW, charH) {
    const { amplitude, speed, frequency, choppiness, palette } = this.config;
    const t = this.time;
    const noise3D = this.noise3D;
    const maxH = 2.1 * amplitude + choppiness;
    const range = 2 * maxH;
    const isMono = palette === "mono";
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col / cols;
        const y = row / rows;
        const h = Math.sin(x * frequency * Math.PI * 2 + t * speed) * amplitude + Math.sin(x * frequency * 1.5 * Math.PI * 2 + t * speed * 1.3) * amplitude * 0.5 + Math.sin(x * frequency * 2.5 * Math.PI * 2 + t * speed * 0.7) * amplitude * 0.3 + noise3D(x * 3, y * 3, t * 0.5) * choppiness + Math.sin(y * 3 + t) * amplitude * 0.3;
        const value = clamp2((h + maxH) / range, 0, 1);
        let char = pickChar(col, row, FALLBACK_CHARS[0], FALLBACK_CHARS[1]);
        for (const [threshold, a, b] of CHAR_TIERS) {
          if (value > threshold) {
            char = pickChar(col, row, a, b);
            break;
          }
        }
        if (char === " ") continue;
        ctx.fillStyle = isMono ? monoColor2(value) : oceanColor(value);
        ctx.fillText(char, col * charW, row * charH);
      }
    }
  }
};
var NEW_MOON_EPOCH_MS = Date.UTC(2e3, 0, 6, 18, 14);
var CABIN = {
  art: [
    "          ___                  ",
    "          |=|                  ",
    "    ______|=|______________    ",
    "  .'                       '.  ",
    " .'  , ' , ' , ' , ' , ' ,  '. ",
    ".:_________________________:. ",
    " |   .--.    .---.   .--.   | ",
    " |   |++|    | . |   |++|   | ",
    " |   |__|    |  o|   |__|   | ",
    "_'___________|___|__________'_"
  ],
  colorFor: (char, tones) => {
    switch (char) {
      case "=":
        return tones.chimney;
      case "+":
        return tones.window;
      case "o":
      case ".":
        return tones.door;
      case ",":
      case "'":
        return tones.roof;
      default:
        return tones.wall;
    }
  }
};
var CABIN_HEIGHT = CABIN.art.length;
var RAINBOW_IN = 3;
var RAINBOW_HOLD = 16;
var RAINBOW_OUT = 8;
var RAINBOW_TOTAL = RAINBOW_IN + RAINBOW_HOLD + RAINBOW_OUT;

// node_modules/@asciitopia/core/dist/weather/index.js
var DEFAULT_CACHE_TTL_SECONDS = 900;
var ENDPOINT = "https://api.open-meteo.com/v1/forecast";
var CURRENT_FIELDS = "weather_code,temperature_2m,wind_speed_10m,wind_direction_10m,is_day,precipitation";
var conditionForWmoCode = (code) => {
  if (code <= 0) return "clear";
  if (code <= 2) return "partly-cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code >= 56 && code <= 63) return "rain";
  if (code >= 64 && code <= 67) return "heavy-rain";
  if (code >= 71 && code <= 73) return "snow";
  if (code >= 74 && code <= 77) return "heavy-snow";
  if (code >= 80 && code <= 82) return "heavy-rain";
  if (code === 85) return "snow";
  if (code === 86) return "heavy-snow";
  if (code >= 95) return "thunderstorm";
  return "clear";
};
var OpenMeteoProvider = class {
  location;
  ttlMs;
  cached = null;
  cachedAt = 0;
  inFlight = null;
  constructor(location, options = {}) {
    this.location = location;
    this.ttlMs = (options.cacheTtlSeconds ?? DEFAULT_CACHE_TTL_SECONDS) * 1e3;
  }
  getWeather() {
    if (this.cached && Date.now() - this.cachedAt < this.ttlMs) {
      return Promise.resolve(this.cached);
    }
    this.inFlight ??= this.fetchCurrent().finally(() => {
      this.inFlight = null;
    });
    return this.inFlight;
  }
  async fetchCurrent() {
    try {
      const url = `${ENDPOINT}?latitude=${this.location.lat}&longitude=${this.location.lng}&current=${CURRENT_FIELDS}`;
      const res = await fetch(url);
      if (!res.ok) return this.cached;
      const body = await res.json();
      const current = body.current;
      if (!current) return this.cached;
      this.cached = {
        condition: conditionForWmoCode(current.weather_code),
        temperature: current.temperature_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        isDay: current.is_day === 1,
        precipitation: current.precipitation
      };
      this.cachedAt = Date.now();
      return this.cached;
    } catch {
      return this.cached;
    }
  }
};
var PASS_WAIT_MIN = 24;
var PASS_WAIT_VAR = 50;
var SPEED_MIN = 9;
var SPEED_VAR = 5;
var BEACON_SECONDS = 0.45;
var PLANE_RIGHT = ["    _/|_____", ".:=[________\\>", "      \\|"];
var PLANE_LEFT = ["   _____|\\_", "</________]=:.", "     |/"];
var BODY_TONE = "#7e848e";
var BEACON_TONE = "#d86a5a";
var LIGHT_TONE = "#e8e8e0";
var AirplaneSystem = class {
  pass = null;
  wait = PASS_WAIT_MIN;
  speed = SPEED_MIN;
  cols = 0;
  rows = 0;
  night = true;
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.pass = null;
    this.wait = (PASS_WAIT_MIN + Math.random() * PASS_WAIT_VAR) * 0.3;
  }
  configure(weather) {
    this.night = !weather.isDay;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    const width = PLANE_RIGHT[0].length;
    if (this.pass) {
      this.pass.x += this.speed * this.pass.dir * dtSec;
      this.pass.t += dtSec;
      if (this.pass.dir === 1 && this.pass.x > this.cols + 2 || this.pass.dir === -1 && this.pass.x < -width - 2) {
        this.pass = null;
      }
      return;
    }
    this.wait -= dtSec;
    if (this.wait <= 0 && this.rows >= 16 && this.cols >= 40) {
      this.wait = PASS_WAIT_MIN + Math.random() * PASS_WAIT_VAR;
      this.speed = SPEED_MIN + Math.random() * SPEED_VAR;
      const dir = Math.random() < 0.5 ? 1 : -1;
      this.pass = {
        dir,
        t: 0,
        x: dir === 1 ? -width - 2 : this.cols + 2,
        y: 1 + Math.random() * Math.max(1, this.rows * 0.12)
      };
    }
  }
  render(ctx, cols, rows, charW, charH) {
    if (!this.pass) return;
    const left = Math.round(this.pass.x);
    const top = Math.round(this.pass.y);
    const sprite = this.pass.dir === 1 ? PLANE_RIGHT : PLANE_LEFT;
    const width = sprite[0].length;
    if (this.night) {
      const beaconOn = Math.floor(this.pass.t / BEACON_SECONDS) % 2 === 0;
      const noseCol = this.pass.dir === 1 ? left + width - 1 : left;
      const tailCol = this.pass.dir === 1 ? left : left + width - 1;
      const row = top + 1;
      if (row >= 0 && row < rows) {
        if (noseCol >= 0 && noseCol < cols) {
          ctx.fillStyle = LIGHT_TONE;
          ctx.fillText("*", noseCol * charW, (row + 1) * charH);
        }
        if (beaconOn && tailCol >= 0 && tailCol < cols) {
          ctx.fillStyle = BEACON_TONE;
          ctx.fillText("+", tailCol * charW, (row + 1) * charH);
        }
      }
      return;
    }
    ctx.fillStyle = BODY_TONE;
    for (let r = 0; r < sprite.length; r++) {
      const row = top + r;
      if (row < 0 || row >= rows) continue;
      const line = sprite[r];
      for (let c = 0; c < line.length; c++) {
        if (line[c] === " ") continue;
        const col = left + c;
        if (col < 0 || col >= cols) continue;
        ctx.fillText(line[c], col * charW, (row + 1) * charH);
      }
    }
  }
};
var FLOCK_WAIT_MIN = 9;
var FLOCK_WAIT_VAR = 16;
var FLOCK_SIZE_MIN = 3;
var FLOCK_SIZE_VAR = 3;
var SPEED_MIN2 = 7;
var SPEED_VAR2 = 5;
var FLAP_SECONDS = 0.32;
var SPACING_COLS = 3.2;
var SPACING_ROWS = 0.6;
var TONE = "#8b8578";
var BirdSystem = class {
  flock = null;
  wait = FLOCK_WAIT_MIN;
  cols = 0;
  rows = 0;
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.flock = null;
    this.wait = (FLOCK_WAIT_MIN + Math.random() * FLOCK_WAIT_VAR) * 0.4;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    if (this.flock) {
      this.flock.x += this.flock.speed * this.flock.dir * dtSec;
      this.flock.flap += dtSec;
      const span = this.flock.count * SPACING_COLS;
      if (this.flock.dir === 1 && this.flock.x - span > this.cols || this.flock.dir === -1 && this.flock.x + span < 0) {
        this.flock = null;
      }
      return;
    }
    this.wait -= dtSec;
    if (this.wait <= 0 && this.rows >= 14 && this.cols >= 30) {
      this.wait = FLOCK_WAIT_MIN + Math.random() * FLOCK_WAIT_VAR;
      const dir = Math.random() < 0.5 ? 1 : -1;
      this.flock = {
        count: FLOCK_SIZE_MIN + Math.floor(Math.random() * (FLOCK_SIZE_VAR + 1)),
        dir,
        flap: 0,
        speed: SPEED_MIN2 + Math.random() * SPEED_VAR2,
        x: dir === 1 ? -2 : this.cols + 2,
        y: 2 + Math.random() * Math.max(1, this.rows * 0.25)
      };
    }
  }
  render(ctx, cols, rows, charW, charH) {
    if (!this.flock) return;
    ctx.fillStyle = TONE;
    for (let i = 0; i < this.flock.count; i++) {
      const col = Math.round(this.flock.x - i * SPACING_COLS * this.flock.dir);
      const row = Math.round(this.flock.y + i * SPACING_ROWS);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const up = Math.floor(this.flock.flap / FLAP_SECONDS + i) % 2 === 0;
      ctx.fillText(up ? "v" : "~", col * charW, (row + 1) * charH);
    }
  }
};
var CLOUD_SHAPES = [
  ["  .:::.  ", " ::::::: ", "  ':::'  "],
  ["   ..::::..   ", " .::::::::::. ", " '::::::::::' ", "    '::::'    "],
  [
    "     ..:::::::..     ",
    "  .::::::::::::::..  ",
    " ::::::::::::::::::: ",
    "  '::::::::::::::'   "
  ]
];
var BAND_FRACTION = 0.34;
var BASE_DRIFT = 0.6;
var WIND_DRIFT_DIVISOR = 16;
var WRAP_MARGIN = 24;
var COUNT_BY_SKY = {
  clear: 1,
  "partly-cloudy": 3,
  overcast: 6
};
var DEFAULT_COUNT = 4;
var DAY_TONE = "#9aa2ad";
var DAY_SHADE = "#6e7681";
var NIGHT_TONE = "#4c515c";
var NIGHT_SHADE = "#383c46";
var CloudSystem = class {
  clouds = [];
  cols = 0;
  bandRows = 0;
  drift = BASE_DRIFT;
  count = COUNT_BY_SKY.clear;
  dark = false;
  night = true;
  init(cols, rows) {
    this.cols = cols;
    this.bandRows = Math.max(1, Math.floor(rows * BAND_FRACTION));
    this.populate(true);
  }
  configure(weather) {
    this.count = COUNT_BY_SKY[weather.condition] ?? DEFAULT_COUNT;
    this.night = !weather.isDay;
    this.dark = weather.condition !== "clear" && weather.condition !== "partly-cloudy";
    const towardEast = -Math.sin(weather.windDirection * Math.PI / 180);
    const speed = BASE_DRIFT + Math.abs(towardEast) * weather.windSpeed / WIND_DRIFT_DIVISOR;
    this.drift = towardEast >= 0 ? speed : -speed;
    this.populate(false);
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (const cloud of this.clouds) {
      cloud.x += this.drift * dtSec;
      const w = cloud.shape[0].length;
      if (this.drift > 0 && cloud.x > this.cols + WRAP_MARGIN) {
        cloud.x = -w - Math.random() * WRAP_MARGIN;
        cloud.y = Math.random() * this.bandRows;
      } else if (this.drift < 0 && cloud.x < -w - WRAP_MARGIN) {
        cloud.x = this.cols + Math.random() * WRAP_MARGIN;
        cloud.y = Math.random() * this.bandRows;
      }
    }
  }
  render(ctx, cols, rows, charW, charH) {
    const body = this.night ? NIGHT_TONE : DAY_TONE;
    const shade = this.night ? NIGHT_SHADE : DAY_SHADE;
    for (const cloud of this.clouds) {
      const left = Math.round(cloud.x);
      const top = Math.round(cloud.y);
      for (let r = 0; r < cloud.shape.length; r++) {
        const line = cloud.shape[r];
        const row = top + r;
        if (row < 0 || row >= rows) continue;
        for (let c = 0; c < line.length; c++) {
          const char = line[c];
          if (char === " ") continue;
          const col = left + c;
          if (col < 0 || col >= cols) continue;
          ctx.fillStyle = this.dark && r >= cloud.shape.length - 2 ? shade : body;
          ctx.fillText(char, col * charW, (row + 1) * charH);
        }
      }
    }
  }
  /** Grow/shrink toward the configured count; spread=true scatters across the width. */
  populate(spread) {
    while (this.clouds.length > this.count) this.clouds.pop();
    while (this.clouds.length < this.count) {
      const shape = CLOUD_SHAPES[Math.floor(Math.random() * CLOUD_SHAPES.length)];
      this.clouds.push({
        shape,
        x: spread || this.clouds.length === 0 ? Math.random() * this.cols : -shape[0].length,
        y: Math.random() * this.bandRows
      });
    }
    if (spread) for (const cloud of this.clouds) cloud.x = Math.random() * this.cols;
  }
};
var COUNT_DIVISOR = 14;
var MAX_COUNT = 12;
var BAND_ROWS = 6;
var WANDER_SPEED = 1.6;
var RETARGET_SECONDS = 2.5;
var ON_MIN = 0.5;
var ON_VAR = 0.9;
var OFF_MIN = 1.2;
var OFF_VAR = 2.8;
var GLOW = "#d8e06a";
var EMBER = "#8a8f4a";
var FireflySystem = class {
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  flies = [];
  cols = 0;
  init(cols, _rows) {
    this.cols = cols;
    const top = Math.max(0, this.anchors.groundRow - BAND_ROWS);
    const count = Math.min(MAX_COUNT, Math.floor(cols / COUNT_DIVISOR));
    this.flies = Array.from({ length: count }, () => ({
      clock: Math.random() * OFF_MIN,
      lit: Math.random() < 0.3,
      retarget: Math.random() * RETARGET_SECONDS,
      vx: 0,
      vy: 0,
      x: Math.random() * cols,
      y: top + Math.random() * BAND_ROWS
    }));
  }
  update(dt) {
    const dtSec = dt / 1e3;
    const bandTop = Math.max(0, this.anchors.groundRow - BAND_ROWS);
    const bandBottom = this.anchors.groundRow - 0.5;
    for (const fly of this.flies) {
      fly.retarget -= dtSec;
      if (fly.retarget <= 0) {
        fly.retarget = RETARGET_SECONDS * (0.5 + Math.random());
        const angle = Math.random() * Math.PI * 2;
        fly.vx = Math.cos(angle) * WANDER_SPEED;
        fly.vy = Math.sin(angle) * WANDER_SPEED * 0.4;
      }
      fly.x += fly.vx * dtSec;
      fly.y += fly.vy * dtSec;
      if (fly.x < 0) fly.x += this.cols;
      else if (fly.x >= this.cols) fly.x -= this.cols;
      fly.y = Math.max(bandTop, Math.min(bandBottom, fly.y));
      fly.clock -= dtSec;
      if (fly.clock <= 0) {
        fly.lit = !fly.lit;
        fly.clock = fly.lit ? ON_MIN + Math.random() * ON_VAR : OFF_MIN + Math.random() * OFF_VAR;
      }
    }
  }
  render(ctx, cols, rows, charW, charH) {
    for (const fly of this.flies) {
      if (!fly.lit) continue;
      const col = Math.round(fly.x);
      const row = Math.round(fly.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const soft = fly.clock < 0.18;
      ctx.fillStyle = soft ? EMBER : GLOW;
      ctx.fillText(soft ? "." : "*", col * charW, (row + 1) * charH);
    }
  }
};
var BAND_COUNT = 5;
var BAND_ZONE_TOP = 0.35;
var SPEED_MIN3 = 1.2;
var SPEED_VAR3 = 2.4;
var GLYPHS = ["-", "~", ":"];
var TONES = ["#565c64", "#6a707a", "#7e858f"];
var FogSystem = class {
  bands = [];
  rows = 0;
  init(_cols, rows) {
    this.rows = rows;
    this.bands = Array.from({ length: BAND_COUNT }, (_, i) => ({
      glyph: GLYPHS[i % GLYPHS.length],
      offset: Math.random() * 1e3,
      rowFrac: BAND_ZONE_TOP + (i + Math.random() * 0.6) / BAND_COUNT * (1 - BAND_ZONE_TOP),
      speed: (SPEED_MIN3 + Math.random() * SPEED_VAR3) * (i % 2 === 0 ? 1 : -1),
      tone: TONES[i % TONES.length],
      waveA: 11 + Math.random() * 10,
      waveB: 23 + Math.random() * 14
    }));
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (const band of this.bands) band.offset += band.speed * dtSec;
  }
  render(ctx, cols, rows, charW, charH) {
    for (const band of this.bands) {
      const row = Math.round(band.rowFrac * Math.min(rows, this.rows || rows));
      if (row < 0 || row >= rows) continue;
      const y = (row + 1) * charH;
      ctx.fillStyle = band.tone;
      for (let col = 0; col < cols; col++) {
        const t = col + band.offset;
        const density = Math.sin(t / band.waveA * Math.PI * 2) + Math.sin(t / band.waveB * Math.PI * 2);
        if (density > 0.35) ctx.fillText(band.glyph, col * charW, y);
        else if (density > -0.1 && col % 2 === 0) ctx.fillText(".", col * charW, y);
      }
    }
  }
};
var SPAWN_WAIT_MIN = 3;
var SPAWN_WAIT_VAR = 9;
var MAX_LEAVES = 5;
var TUMBLE_GLYPHS = ["-", "\\", "|", "/"];
var TUMBLE_SPEED_MIN = 3;
var TUMBLE_SPEED_VAR = 4;
var CARRY_MIN = 3.5;
var CARRY_VAR = 3;
var WIND_CARRY_DIVISOR = 9;
var BOB_FREQ = 1.8;
var BOB_AMPLITUDE = 0.8;
var SINK = 0.5;
var TONES2 = ["#a8763e", "#8a5a34", "#b08a48"];
var LeavesSystem = class {
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  leaves = [];
  timer = 0;
  cols = 0;
  windCarry = 0;
  windDir = 1;
  init(cols, _rows) {
    this.cols = cols;
    this.leaves = [];
    this.timer = Math.random() * SPAWN_WAIT_VAR;
  }
  configure(weather) {
    const towardEast = -Math.sin(weather.windDirection * Math.PI / 180);
    this.windDir = towardEast >= 0 ? 1 : -1;
    this.windCarry = Math.abs(towardEast) * weather.windSpeed / WIND_CARRY_DIVISOR;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      const leaf = this.leaves[i];
      leaf.phase += BOB_FREQ * dtSec;
      leaf.tumble += leaf.tumbleSpeed * dtSec;
      leaf.x += leaf.vx * dtSec;
      leaf.y += (SINK + Math.sin(leaf.phase) * BOB_AMPLITUDE) * dtSec;
      const gone = leaf.x < -3 || leaf.x > this.cols + 3 || leaf.y >= this.anchors.groundRow + 0.5;
      if (gone) this.leaves.splice(i, 1);
    }
    this.timer -= dtSec;
    if (this.timer <= 0 && this.leaves.length < MAX_LEAVES && this.cols >= 20) {
      this.timer = SPAWN_WAIT_MIN + Math.random() * SPAWN_WAIT_VAR;
      const vx = (CARRY_MIN + Math.random() * CARRY_VAR + this.windCarry) * this.windDir;
      this.leaves.push({
        phase: Math.random() * Math.PI * 2,
        tone: TONES2[Math.floor(Math.random() * TONES2.length)],
        tumble: Math.random() * TUMBLE_GLYPHS.length,
        tumbleSpeed: TUMBLE_SPEED_MIN + Math.random() * TUMBLE_SPEED_VAR,
        vx,
        x: this.windDir === 1 ? -2 : this.cols + 2,
        y: Math.max(1, this.anchors.groundRow - 3 - Math.random() * 8)
      });
    }
  }
  render(ctx, cols, rows, charW, charH) {
    for (const leaf of this.leaves) {
      const col = Math.round(leaf.x);
      const row = Math.round(leaf.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillStyle = leaf.tone;
      ctx.fillText(
        TUMBLE_GLYPHS[Math.floor(leaf.tumble) % TUMBLE_GLYPHS.length],
        col * charW,
        (row + 1) * charH
      );
    }
  }
};
var STRIKE_WAIT_MIN = 4;
var STRIKE_WAIT_VAR = 8;
var FLASH_SECONDS = 0.14;
var GLOW_SECONDS = 0.32;
var BRANCH_CHANCE = 0.16;
var MAX_BRANCHES = 2;
var BRANCH_LEN_MIN = 3;
var BRANCH_LEN_VAR = 4;
var FLASH_TONE = "#f2f0ff";
var GLOW_TONE = "#8a86b8";
var glyphFor = (dx) => dx < 0 ? "/" : dx > 0 ? "\\" : "|";
var LightningSystem = class {
  // seconds remaining
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  cols = 0;
  bolt = [];
  wait = STRIKE_WAIT_MIN;
  flash = 0;
  init(cols, _rows) {
    this.cols = cols;
    this.bolt = [];
    this.flash = 0;
    this.wait = STRIKE_WAIT_MIN + Math.random() * STRIKE_WAIT_VAR;
  }
  /** True during the bright part of a strike — the pattern washes the canvas. */
  isFlashing() {
    return this.flash > GLOW_SECONDS;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    if (this.flash > 0) {
      this.flash -= dtSec;
      if (this.flash <= 0) this.bolt = [];
      return;
    }
    this.wait -= dtSec;
    if (this.wait <= 0) {
      this.wait = STRIKE_WAIT_MIN + Math.random() * STRIKE_WAIT_VAR;
      this.strike();
    }
  }
  render(ctx, cols, rows, charW, charH) {
    if (this.flash <= 0) return;
    ctx.fillStyle = this.isFlashing() ? FLASH_TONE : GLOW_TONE;
    for (const cell of this.bolt) {
      if (cell.col < 0 || cell.col >= cols || cell.row < 0 || cell.row >= rows) continue;
      ctx.fillText(cell.char, cell.col * charW, (cell.row + 1) * charH);
    }
  }
  strike() {
    const ground = this.anchors.groundRow;
    if (ground < 6 || this.cols < 8) return;
    this.bolt = [];
    this.flash = FLASH_SECONDS + GLOW_SECONDS;
    let col = Math.floor(this.cols * (0.1 + Math.random() * 0.8));
    let branches = 0;
    for (let row = 1; row < ground; row++) {
      const dx = Math.floor(Math.random() * 3) - 1;
      col = Math.max(1, Math.min(this.cols - 2, col + dx));
      this.bolt.push({ char: glyphFor(dx), col, row });
      if (branches < MAX_BRANCHES && row > 2 && Math.random() < BRANCH_CHANCE) {
        branches++;
        this.branch(col, row, ground);
      }
    }
  }
  branch(fromCol, fromRow, ground) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const length = BRANCH_LEN_MIN + Math.floor(Math.random() * BRANCH_LEN_VAR);
    let col = fromCol;
    for (let i = 1; i <= length; i++) {
      const row = fromRow + i;
      if (row >= ground) break;
      const dx = Math.random() < 0.7 ? side : 0;
      col += dx;
      this.bolt.push({ char: glyphFor(dx), col, row });
    }
  }
};
var SYNODIC_DAYS = 29.530588;
var NEW_MOON_EPOCH_MS2 = Date.UTC(2e3, 0, 6, 18, 14);
var RADIUS_ROWS = 2.2;
var CHAR_ASPECT = 2;
var AT_X = 0.78;
var AT_Y = 0.16;
var LIT_CORE = "#e6e2cf";
var LIT_EDGE = "#b9b4a0";
var DARK_LIMB = "#3a3a40";
var lunarPhase = (now) => {
  const days = (now - NEW_MOON_EPOCH_MS2) / 864e5;
  return days / SYNODIC_DAYS - Math.floor(days / SYNODIC_DAYS);
};
var MoonSystem = class {
  centerCol = 0;
  centerRow = 0;
  visible = false;
  phase = lunarPhase(Date.now());
  veiled = false;
  init(cols, rows) {
    this.centerCol = Math.round(cols * AT_X);
    this.centerRow = Math.round(rows * AT_Y);
    this.visible = rows >= 12 && cols >= 30;
    this.phase = lunarPhase(Date.now());
  }
  configure(weather) {
    this.veiled = weather.condition === "overcast" || weather.condition === "thunderstorm" || weather.condition === "heavy-snow";
  }
  update(_dt) {
  }
  render(ctx, cols, rows, charW, charH) {
    if (!this.visible || this.veiled) return;
    const lit = Math.max(0.22, 1 - Math.abs(this.phase - 0.5) * 2);
    const waxing = this.phase < 0.5;
    const ry = RADIUS_ROWS;
    const rx = RADIUS_ROWS * CHAR_ASPECT;
    for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy++) {
      for (let dx = -Math.ceil(rx); dx <= Math.ceil(rx); dx++) {
        const d = (dx / rx) ** 2 + (dy / ry) ** 2;
        if (d > 1) continue;
        const col = this.centerCol + dx;
        const row = this.centerRow + dy;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        const across = waxing ? (dx / rx + 1) / 2 : (1 - dx / rx) / 2;
        const isLit = across > 1 - lit;
        if (isLit) {
          ctx.fillStyle = d > 0.62 ? LIT_EDGE : LIT_CORE;
          ctx.fillText(d > 0.62 ? "#" : "@", col * charW, (row + 1) * charH);
        } else if ((dx + dy) % 2 === 0) {
          ctx.fillStyle = DARK_LIMB;
          ctx.fillText(".", col * charW, (row + 1) * charH);
        }
      }
    }
  }
};
var DROPS_PER_COL = {
  drizzle: 0.14,
  rain: 0.42,
  "heavy-rain": 0.85,
  thunderstorm: 1.25
};
var FALL_MIN = 14;
var FALL_VAR = 18;
var WIND_SLANT_DIVISOR = 22;
var SLANT_LIMIT = 1.4;
var SPLASH_CHANCE = 0.5;
var MAX_SPLASHES = 60;
var SPLASH_RISE = -4.5;
var SPLASH_GRAVITY2 = 14;
var SPLASH_TTL = 0.55;
var DROP_TONE = "#5a7d9a";
var DROP_DIM = "#3d5568";
var SPLASH_TONE = "#7d9db8";
var RainSystem = class {
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  drops = [];
  splashes = [];
  cols = 0;
  rows = 0;
  density = DROPS_PER_COL.rain;
  slant = 0;
  drizzle = false;
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.splashes = [];
    this.rebuild(true);
  }
  configure(weather) {
    this.density = DROPS_PER_COL[weather.condition] ?? this.density;
    this.drizzle = weather.condition === "drizzle";
    const towardEast = -Math.sin(weather.windDirection * Math.PI / 180);
    this.slant = Math.max(
      -SLANT_LIMIT,
      Math.min(SLANT_LIMIT, towardEast * weather.windSpeed / WIND_SLANT_DIVISOR)
    );
    this.rebuild(false);
  }
  update(dt) {
    const dtSec = dt / 1e3;
    const ground = this.anchors.groundRow;
    for (const drop of this.drops) {
      drop.y += drop.speed * dtSec;
      drop.x += drop.speed * this.slant * dtSec;
      if (drop.y >= ground) {
        if (!drop.deep && this.splashes.length < MAX_SPLASHES && Math.random() < SPLASH_CHANCE) {
          const side = Math.random() < 0.5 ? -1 : 1;
          this.splashes.push({
            age: 0,
            vx: side * (2 + Math.random() * 4),
            vy: SPLASH_RISE * (0.6 + Math.random() * 0.6),
            x: drop.x,
            y: ground - 0.5
          });
        }
        drop.y = -Math.random() * 4;
        drop.x = Math.random() * this.cols;
      }
    }
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      s.age += dtSec;
      s.vy += SPLASH_GRAVITY2 * dtSec;
      s.x += s.vx * dtSec;
      s.y += s.vy * dtSec;
      if (s.age > SPLASH_TTL || s.y > this.anchors.groundRow + 1) {
        this.splashes.splice(i, 1);
      }
    }
  }
  render(ctx, cols, rows, charW, charH) {
    const glyph = this.drizzle ? "," : this.slant > 0.3 ? "\\" : this.slant < -0.3 ? "/" : "|";
    for (const drop of this.drops) {
      const col = Math.round(drop.x);
      const row = Math.round(drop.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillStyle = drop.deep ? DROP_DIM : DROP_TONE;
      ctx.fillText(drop.deep && !this.drizzle ? "," : glyph, col * charW, (row + 1) * charH);
    }
    ctx.fillStyle = SPLASH_TONE;
    for (const s of this.splashes) {
      const col = Math.round(s.x);
      const row = Math.round(s.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillText(s.age < SPLASH_TTL * 0.4 ? "'" : ".", col * charW, (row + 1) * charH);
    }
  }
  rebuild(scatter) {
    const target = Math.round(this.cols * this.density);
    while (this.drops.length > target) this.drops.pop();
    while (this.drops.length < target) {
      this.drops.push({
        deep: Math.random() < 0.35,
        // a dimmer far layer for depth
        speed: FALL_MIN + Math.random() * FALL_VAR,
        x: Math.random() * this.cols,
        y: scatter ? Math.random() * this.rows : -Math.random() * this.rows * 0.5
      });
    }
  }
};
var DAY_TONES = {
  bush: "#3e7a44",
  canopy: "#35803f",
  canopyFringe: "#57a75a",
  chimney: "#8a8a92",
  door: "#6e4f36",
  glow: "#b8b09a",
  grass: "#4a7a46",
  grassBright: "#639a58",
  path: "#8f857a",
  roof: "#7a6350",
  soil: "#564840",
  trunk: "#755a40",
  wall: "#967452",
  window: "#a8c4d4"
};
var NIGHT_TONES = {
  bush: "#26502e",
  canopy: "#20512a",
  canopyFringe: "#356b3c",
  chimney: "#5b5b64",
  door: "#4a3626",
  glow: "#ffd98a",
  grass: "#2e5030",
  grassBright: "#3f6a40",
  path: "#5f594f",
  roof: "#4e4036",
  soil: "#38302b",
  trunk: "#4e3c2c",
  wall: "#63503c",
  window: "#ffcf7d"
};
var FLICKER = ["#ffcf7d", "#f2bd66", "#ffd991", "#e8b158"];
var CAT_SILHOUETTE = "#7a5a2a";
var CAT_FUR = "#8a8074";
var SNOW_BRIGHT = "#dde4ea";
var SNOW_DIM = "#a7b2bc";
var groundRoll = (x, y) => {
  const h = (Math.imul(x + 1, 73856093) ^ Math.imul(y + 7, 19349663)) >>> 0;
  return (h >>> 4) % 97;
};
var TUFT_ROLL = 6;
var BLADE_ROLL = 16;
var SPRIG_ROLL = 34;
var SUBSOIL_DOT_ROLL = 5;
var SUBSOIL_TICK_ROLL = 9;
var SNOW_SALT = 31;
var CABIN2 = {
  art: [
    "          ___                  ",
    "          |=|                  ",
    "    ______|=|______________    ",
    "  .'                       '.  ",
    " .'  , ' , ' , ' , ' , ' ,  '. ",
    ".:_________________________:. ",
    " |   .--.    .---.   .--.   | ",
    " |   |++|    | . |   |++|   | ",
    " |   |__|    |  o|   |__|   | ",
    "_'___________|___|__________'_"
  ],
  colorFor: (char, tones) => {
    switch (char) {
      case "=":
        return tones.chimney;
      case "+":
        return tones.window;
      case "o":
      case ".":
        return tones.door;
      case ",":
      case "'":
        return tones.roof;
      default:
        return tones.wall;
    }
  }
};
var CABIN_CHIMNEY = { col: 11, row: -1 };
var CABIN_WINDOW_SPLIT = 15;
var CABIN_DOOR_RIGHT = 18;
var CABIN_CHIME = { col: 10, row: 6 };
var CABIN_HEIGHT2 = CABIN2.art.length;
var BROADLEAF = {
  art: [
    '    "o@@o"    ',
    '  "o@@@@@@o"  ',
    ' "@@@@@@@@@@" ',
    '  "o@@@@@@o"  ',
    "    ')||('    ",
    "      ||      "
  ],
  colorFor: (char, tones) => {
    if (char === "@") return tones.canopy;
    if (char === "o" || char === '"') return tones.canopyFringe;
    return tones.trunk;
  }
};
var LANTERN = {
  art: ["[o]", " | ", " | "],
  colorFor: (char, tones) => char === "o" ? tones.glow : tones.trunk
};
var BUSH = {
  art: [' (""), ', '("""")'],
  colorFor: (_char, tones) => tones.bush
};
var BIRDHOUSE = {
  art: [".^.", "|o|", " | ", " | "],
  colorFor: (char, tones) => char === "o" ? tones.soil : tones.trunk
};
var WOODPILE = {
  art: [" .-----. ", "(o)(o)(o)", "(o)(o)(o)"],
  colorFor: (char, tones) => {
    if (char === "o") return tones.trunk;
    if (char === "." || char === "-") return tones.roof;
    return tones.door;
  }
};
var PROPS = [
  { at: 0.11, sprite: BROADLEAF },
  { at: 0.6, sprite: LANTERN },
  { at: 0.68, sprite: BIRDHOUSE },
  { at: 0.78, sprite: BUSH },
  { at: 0.88, sprite: BROADLEAF }
];
var LANTERN_AT = 0.6;
var HOME_AT = 0.42;
var MIN_ROWS_FOR_HOME = 16;
var MIN_COLS_FOR_HOME = 44;
var STONE_SPACING = 3;
var MAX_STONES = 6;
var CAT_HIDDEN_MIN = 45;
var CAT_HIDDEN_VAR = 85;
var CAT_VISIT_MIN = 14;
var CAT_VISIT_VAR = 14;
var VISITOR_AWAY_MIN = 18;
var VISITOR_AWAY_VAR = 40;
var VISITOR_PERCH_MIN = 7;
var VISITOR_PERCH_VAR = 11;
var VISITOR_TONE = "#8b8578";
var CHIME_TONE = "#9a9aa4";
var SceneSystem = class {
  anchors = { chimneyCol: 0, chimneyRow: 0, groundRow: 0 };
  /** 0–1, fed by the traces system each frame; whitens the ground progressively. */
  snowLevel = 0;
  cols = 0;
  rows = 0;
  tones = NIGHT_TONES;
  night = true;
  wind = 5;
  precip = false;
  stamps = [];
  surfacePerches = [];
  eaveHangs = [];
  homeLeft = -1;
  homeTop = 0;
  reservedGround = /* @__PURE__ */ new Set();
  time = 0;
  // details
  cat = "hidden";
  catTimer = CAT_HIDDEN_MIN;
  catWindow = 0;
  catCol = 0;
  visitorPerched = false;
  visitorTimer = VISITOR_AWAY_MIN;
  visitorCol = -1;
  visitorRow = -1;
  chimeCol = -1;
  chimeRow = 0;
  /** Cells snow may sit on (tops of the roofline, canopies, posts). */
  get perches() {
    return this.surfacePerches;
  }
  /** Under-eave cells icicles may grow from. */
  get hangs() {
    return this.eaveHangs;
  }
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.time = 0;
    this.snowLevel = 0;
    this.anchors.groundRow = rows - this.groundRows();
    this.anchors.chimneyCol = Math.floor(cols / 2);
    this.anchors.chimneyRow = Math.max(0, this.anchors.groundRow - 12);
    this.cat = "hidden";
    this.catTimer = CAT_HIDDEN_MIN + Math.random() * CAT_HIDDEN_VAR;
    this.visitorPerched = false;
    this.visitorTimer = VISITOR_AWAY_MIN + Math.random() * VISITOR_AWAY_VAR;
    this.buildStamps();
    this.collectSurfaces();
  }
  configure(weather) {
    this.tones = weather.isDay ? DAY_TONES : NIGHT_TONES;
    this.night = !weather.isDay;
    this.wind = weather.windSpeed;
    this.precip = weather.condition !== "clear" && weather.condition !== "partly-cloudy" && weather.condition !== "overcast";
  }
  update(dt) {
    const dtSec = dt / 1e3;
    this.time += dtSec;
    this.updateCat(dtSec);
    this.updateVisitor(dtSec);
  }
  render(ctx, cols, rows, charW, charH) {
    const flicker = this.night ? FLICKER[Math.min(
      FLICKER.length - 1,
      Math.floor(
        (Math.sin(this.time * 6.1) + Math.sin(this.time * 9.7 + 1.3) + 2) / 4 * FLICKER.length
      )
    )] : null;
    for (const s of this.stamps) {
      if (s.col < 0 || s.col >= cols || s.row < 0 || s.row >= rows) continue;
      if (s.window >= 0) {
        if (this.cat === "window" && s.window === this.catWindow) {
          ctx.fillStyle = this.night ? CAT_SILHOUETTE : this.tones.door;
          ctx.fillText("^", s.col * charW, (s.row + 1) * charH);
          continue;
        }
        ctx.fillStyle = flicker ?? this.tones.window;
      } else {
        ctx.fillStyle = s.tint(this.tones);
      }
      ctx.fillText(s.char, s.col * charW, (s.row + 1) * charH);
    }
    this.renderGround(ctx, cols, rows, charW, charH);
    this.renderDetails(ctx, cols, rows, charW, charH);
  }
  // --- living details ---
  updateCat(dtSec) {
    if (this.homeLeft < 0) return;
    this.catTimer -= dtSec;
    if (this.catTimer > 0) return;
    if (this.cat === "hidden") {
      this.cat = this.precip || this.night ? "window" : "doorstep";
      this.catWindow = Math.random() < 0.5 ? 0 : 1;
      this.catCol = this.homeLeft + CABIN_DOOR_RIGHT + 1;
      this.catTimer = CAT_VISIT_MIN + Math.random() * CAT_VISIT_VAR;
    } else {
      this.cat = "hidden";
      this.catTimer = CAT_HIDDEN_MIN + Math.random() * CAT_HIDDEN_VAR;
    }
  }
  updateVisitor(dtSec) {
    if (this.visitorCol < 0) return;
    this.visitorTimer -= dtSec;
    if (this.visitorTimer > 0) return;
    if (!this.visitorPerched && !this.night && !this.precip) {
      this.visitorPerched = true;
      this.visitorTimer = VISITOR_PERCH_MIN + Math.random() * VISITOR_PERCH_VAR;
    } else {
      this.visitorPerched = false;
      this.visitorTimer = VISITOR_AWAY_MIN + Math.random() * VISITOR_AWAY_VAR;
    }
  }
  renderDetails(ctx, cols, rows, charW, charH) {
    if (this.chimeCol >= 0 && this.chimeCol < cols && this.chimeRow + 1 < rows) {
      const swing = Math.sin(this.time * (1.2 + this.wind / 14)) * Math.min(1, 0.2 + this.wind / 16);
      ctx.fillStyle = CHIME_TONE;
      ctx.fillText(".", this.chimeCol * charW, (this.chimeRow + 1) * charH);
      const tube = swing < -0.45 ? "/" : swing > 0.45 ? "\\" : "|";
      ctx.fillText(tube, this.chimeCol * charW, (this.chimeRow + 2) * charH);
    }
    if (this.cat === "doorstep") {
      const row = this.anchors.groundRow;
      ctx.fillStyle = CAT_FUR;
      const cat = "=^.^=";
      for (let i = 0; i < cat.length; i++) {
        const col = this.catCol + i;
        if (col >= 0 && col < cols && row < rows) {
          ctx.fillText(cat[i], col * charW, (row + 1) * charH);
        }
      }
    }
    if (this.visitorPerched && this.visitorCol < cols && this.visitorRow >= 0) {
      ctx.fillStyle = VISITOR_TONE;
      ctx.fillText("v", this.visitorCol * charW, (this.visitorRow + 1) * charH);
    }
  }
  // --- ground ---
  groundRows() {
    if (this.rows < 4) return 1;
    return Math.max(2, Math.min(4, Math.round(this.rows * 0.12)));
  }
  isCatCell(col) {
    return this.cat === "doorstep" && col >= this.catCol && col < this.catCol + 5;
  }
  renderGround(ctx, cols, rows, charW, charH) {
    const top = this.anchors.groundRow;
    const snow100 = this.snowLevel * 110;
    for (let row = top; row < rows && row < this.rows; row++) {
      const y = (row + 1) * charH;
      const grassLine = row === top;
      for (let col = 0; col < cols && col < this.cols; col++) {
        if (grassLine && (this.reservedGround.has(col) || this.isCatCell(col))) continue;
        const roll = groundRoll(col, row);
        const snowed = snow100 > groundRoll(col, row + SNOW_SALT);
        let char = "";
        let color = snowed ? SNOW_DIM : this.tones.grass;
        if (grassLine) {
          if (roll < TUFT_ROLL) {
            char = snowed ? "*" : '"';
            color = snowed ? SNOW_BRIGHT : this.tones.grassBright;
          } else if (roll < BLADE_ROLL) {
            char = "'";
            if (!snowed) color = this.tones.grassBright;
          } else if (roll < SPRIG_ROLL) {
            char = ",";
          } else {
            char = ".";
          }
        } else if (roll < SUBSOIL_DOT_ROLL) {
          char = ".";
          if (!snowed) color = this.tones.soil;
        } else if (roll < SUBSOIL_TICK_ROLL) {
          char = ",";
          if (!snowed) color = this.tones.soil;
        }
        if (char === "") continue;
        ctx.fillStyle = color;
        ctx.fillText(char, col * charW, y);
      }
    }
  }
  // --- sprites ---
  buildStamps() {
    this.stamps = [];
    this.reservedGround.clear();
    this.homeLeft = -1;
    this.chimeCol = -1;
    this.visitorCol = -1;
    const ground = this.anchors.groundRow;
    if (this.rows < MIN_ROWS_FOR_HOME || this.cols < MIN_COLS_FOR_HOME) return;
    const homeW = CABIN2.art[0].length;
    this.homeLeft = Math.round(this.cols * HOME_AT) - Math.floor(homeW / 2);
    this.homeTop = ground - CABIN_HEIGHT2;
    this.stampSprite(CABIN2, this.homeLeft, this.homeTop, true);
    this.anchors.chimneyCol = this.homeLeft + CABIN_CHIMNEY.col;
    this.anchors.chimneyRow = this.homeTop + CABIN_CHIMNEY.row;
    this.chimeCol = this.homeLeft + CABIN_CHIME.col;
    this.chimeRow = this.homeTop + CABIN_CHIME.row;
    const pileLeft = this.homeLeft - WOODPILE.art[0].length - 1;
    this.stampSprite(WOODPILE, pileLeft, ground - WOODPILE.art.length, false);
    for (const prop of PROPS) {
      const art = prop.sprite.art;
      const left = Math.round(this.cols * prop.at) - Math.floor(art[0].length / 2);
      if (left + art[0].length > pileLeft - 1 && left < this.homeLeft + homeW + 2) continue;
      this.stampSprite(prop.sprite, left, ground - art.length, false);
      if (prop.sprite === BIRDHOUSE) {
        this.visitorCol = left + 1;
        this.visitorRow = ground - art.length - 1;
      }
    }
    this.placeStones(ground);
  }
  /** Stepping stones from the door toward the lantern. */
  placeStones(ground) {
    const from = this.homeLeft + CABIN_DOOR_RIGHT + 2;
    const to = Math.round(this.cols * LANTERN_AT) - 3;
    if (to - from < STONE_SPACING * 2) return;
    let placed = 0;
    for (let col = from; col <= to && placed < MAX_STONES; col += STONE_SPACING) {
      this.reservedGround.add(col);
      this.stamps.push({
        char: "o",
        col,
        row: ground,
        window: -1,
        tint: (tones) => tones.path
      });
      placed++;
    }
  }
  stampSprite(sprite, left, top, isHome) {
    for (let r = 0; r < sprite.art.length; r++) {
      const line = sprite.art[r];
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === " ") continue;
        const window = isHome && char === "+" ? c < CABIN_WINDOW_SPLIT ? 0 : 1 : -1;
        this.stamps.push({
          char,
          col: left + c,
          row: top + r,
          window,
          tint: (tones) => sprite.colorFor(char, tones)
        });
      }
    }
  }
  /** Derive snow perches (open sky above) and icicle hangs (eave cells with air below). */
  collectSurfaces() {
    this.surfacePerches = [];
    this.eaveHangs = [];
    const occupied = /* @__PURE__ */ new Set();
    for (const s of this.stamps) occupied.add(s.row * 8192 + s.col);
    const eaveRow = this.homeTop + 5;
    for (const s of this.stamps) {
      if (s.row === this.anchors.groundRow) continue;
      if (s.row > 0 && !occupied.has((s.row - 1) * 8192 + s.col)) {
        this.surfacePerches.push({ col: s.col, roll: groundRoll(s.col, s.row), row: s.row });
      }
      if (this.homeLeft >= 0 && s.row === eaveRow && s.col >= this.homeLeft && !occupied.has((s.row + 1) * 8192 + s.col)) {
        this.eaveHangs.push({ col: s.col, roll: groundRoll(s.col, s.row + SNOW_SALT), row: s.row });
      }
    }
  }
};
var PUFF_INTERVAL_MIN = 0.55;
var PUFF_INTERVAL_VAR = 0.7;
var MAX_PUFFS = 18;
var RISE_MIN = 1.4;
var RISE_VAR = 0.9;
var WIND_LEAN_DIVISOR = 24;
var SWAY_FREQ = 1.3;
var SWAY_AMPLITUDE = 0.5;
var PUFF_TTL = 5.5;
var AGE_GLYPHS = [".", ":", "o", "~", "~"];
var AGE_TONES = ["#9a948a", "#8a857c", "#767268", "#5e5b54", "#4a4842"];
var SmokeSystem = class {
  // cold outside → the fire burns harder, puffs come faster
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  puffs = [];
  timer = 0;
  lean = 0;
  stoke = 1;
  init(_cols, _rows) {
    this.puffs = [];
    this.timer = Math.random() * PUFF_INTERVAL_VAR;
  }
  configure(weather) {
    const towardEast = -Math.sin(weather.windDirection * Math.PI / 180);
    this.lean = towardEast * weather.windSpeed / WIND_LEAN_DIVISOR;
    const t = weather.temperature;
    this.stoke = t <= 0 ? 0.5 : t < 10 ? 0.75 : t > 18 ? 1.6 : 1;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const puff = this.puffs[i];
      puff.age += dtSec;
      puff.phase += SWAY_FREQ * dtSec;
      const lift = Math.max(0.15, 1 - puff.age / PUFF_TTL);
      puff.y -= puff.rise * lift * dtSec;
      puff.x += (this.lean * (2 - lift) + Math.sin(puff.phase) * SWAY_AMPLITUDE) * dtSec;
      if (puff.age > PUFF_TTL || puff.y < -1) this.puffs.splice(i, 1);
    }
    this.timer -= dtSec;
    if (this.timer <= 0 && this.puffs.length < MAX_PUFFS && this.anchors.chimneyRow > 1) {
      this.timer = (PUFF_INTERVAL_MIN + Math.random() * PUFF_INTERVAL_VAR) * this.stoke;
      this.puffs.push({
        age: 0,
        phase: Math.random() * Math.PI * 2,
        rise: RISE_MIN + Math.random() * RISE_VAR,
        x: this.anchors.chimneyCol + (Math.random() - 0.5) * 0.6,
        y: this.anchors.chimneyRow
      });
    }
  }
  render(ctx, cols, rows, charW, charH) {
    for (const puff of this.puffs) {
      const col = Math.round(puff.x);
      const row = Math.round(puff.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const stage = Math.min(
        AGE_GLYPHS.length - 1,
        Math.floor(puff.age / PUFF_TTL * AGE_GLYPHS.length)
      );
      ctx.fillStyle = AGE_TONES[stage];
      ctx.fillText(AGE_GLYPHS[stage], col * charW, (row + 1) * charH);
    }
  }
};
var FLAKES_PER_COL = {
  snow: 0.45,
  "heavy-snow": 0.95
};
var FALL_NEAR_MIN = 2.2;
var FALL_NEAR_VAR = 1.6;
var FAR_SPEED_RATIO = 0.55;
var SWAY_FREQ2 = 0.7;
var SWAY_AMPLITUDE2 = 1.1;
var WIND_DRIFT_DIVISOR2 = 26;
var NEAR_TONE = "#dde4ea";
var FAR_TONE = "#8a929c";
var SnowSystem = class {
  constructor(anchors) {
    this.anchors = anchors;
  }
  anchors;
  flakes = [];
  cols = 0;
  rows = 0;
  density = FLAKES_PER_COL.snow;
  drift = 0;
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.rebuild(true);
  }
  configure(weather) {
    this.density = FLAKES_PER_COL[weather.condition] ?? this.density;
    const towardEast = -Math.sin(weather.windDirection * Math.PI / 180);
    this.drift = towardEast * weather.windSpeed / WIND_DRIFT_DIVISOR2;
    this.rebuild(false);
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (const flake of this.flakes) {
      flake.phase += SWAY_FREQ2 * dtSec;
      flake.y += flake.speed * dtSec;
      flake.x += (Math.sin(flake.phase) * SWAY_AMPLITUDE2 * 0.5 + this.drift) * dtSec;
      if (flake.y >= this.anchors.groundRow + 1) {
        flake.y = -1 - Math.random() * 3;
        flake.x = Math.random() * this.cols;
      }
      if (flake.x < -2) flake.x += this.cols + 4;
      else if (flake.x > this.cols + 2) flake.x -= this.cols + 4;
    }
  }
  render(ctx, cols, rows, charW, charH) {
    for (const flake of this.flakes) {
      const col = Math.round(flake.x);
      const row = Math.round(flake.y);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillStyle = flake.far ? FAR_TONE : NEAR_TONE;
      ctx.fillText(flake.far ? "." : "*", col * charW, (row + 1) * charH);
    }
  }
  rebuild(scatter) {
    const target = Math.round(this.cols * this.density);
    while (this.flakes.length > target) this.flakes.pop();
    while (this.flakes.length < target) {
      const far = Math.random() < 0.45;
      const near = FALL_NEAR_MIN + Math.random() * FALL_NEAR_VAR;
      this.flakes.push({
        far,
        phase: Math.random() * Math.PI * 2,
        speed: far ? near * FAR_SPEED_RATIO : near,
        x: Math.random() * this.cols,
        y: scatter ? Math.random() * this.rows : -Math.random() * this.rows * 0.4
      });
    }
  }
};
var CELL_W = 9;
var CELL_H = 4;
var OCCUPANCY = 0.34;
var SKY_FRACTION = 0.62;
var TWINKLE_SPEED_MIN = 0.35;
var TWINKLE_SPEED_VAR = 0.9;
var BRIGHT_CUT = 0.72;
var DIM_CUT = -0.2;
var SHOOTING_CHANCE_PER_SEC = 0.03;
var SHOOTING_SPEED = 26;
var STREAK_LENGTH = 7;
var STREAK_SLOPE = 0.45;
var STAR_BRIGHT = "#e8e4d8";
var STAR_MID = "#a8a494";
var STAR_DIM = "#5c5a52";
var StarsSystem = class {
  stars = [];
  streak = null;
  skyRows = 0;
  cols = 0;
  veiled = false;
  init(cols, rows) {
    this.cols = cols;
    this.skyRows = Math.max(0, Math.floor(rows * SKY_FRACTION));
    this.streak = null;
    this.stars = [];
    for (let gy = 0; gy * CELL_H < this.skyRows; gy++) {
      for (let gx = 0; gx * CELL_W < cols; gx++) {
        if (Math.random() > OCCUPANCY) continue;
        this.stars.push({
          col: gx * CELL_W + Math.floor(Math.random() * CELL_W),
          phase: Math.random() * Math.PI * 2,
          row: gy * CELL_H + Math.floor(Math.random() * CELL_H),
          speed: TWINKLE_SPEED_MIN + Math.random() * TWINKLE_SPEED_VAR
        });
      }
    }
  }
  configure(weather) {
    const heavy = ["overcast", "heavy-rain", "heavy-snow", "thunderstorm"];
    this.veiled = heavy.includes(weather.condition);
  }
  update(dt) {
    const dtSec = dt / 1e3;
    for (const star of this.stars) star.phase += star.speed * dtSec;
    if (this.streak) {
      this.streak.distance += SHOOTING_SPEED * dtSec;
      this.streak.x += SHOOTING_SPEED * dtSec * this.streak.dir;
      this.streak.y += SHOOTING_SPEED * dtSec * STREAK_SLOPE;
      if (this.streak.y > this.skyRows + STREAK_LENGTH || this.streak.x < -STREAK_LENGTH || this.streak.x > this.cols + STREAK_LENGTH) {
        this.streak = null;
      }
    } else if (!this.veiled && this.skyRows > 6 && Math.random() < SHOOTING_CHANCE_PER_SEC * dtSec) {
      this.streak = {
        dir: Math.random() < 0.5 ? 1 : -1,
        distance: 0,
        x: this.cols * (0.15 + Math.random() * 0.7),
        y: 1 + Math.random() * this.skyRows * 0.4
      };
    }
  }
  render(ctx, cols, rows, charW, charH) {
    if (this.veiled) return;
    for (const star of this.stars) {
      if (star.col >= cols || star.row >= rows) continue;
      const s = Math.sin(star.phase);
      if (s < DIM_CUT) {
        ctx.fillStyle = STAR_DIM;
        ctx.fillText(".", star.col * charW, (star.row + 1) * charH);
      } else if (s > BRIGHT_CUT) {
        ctx.fillStyle = STAR_BRIGHT;
        ctx.fillText("+", star.col * charW, (star.row + 1) * charH);
      } else {
        ctx.fillStyle = STAR_MID;
        ctx.fillText(".", star.col * charW, (star.row + 1) * charH);
      }
    }
    if (this.streak) {
      for (let i = 0; i < STREAK_LENGTH; i++) {
        const col = Math.round(this.streak.x - i * this.streak.dir);
        const row = Math.round(this.streak.y - i * STREAK_SLOPE);
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        ctx.fillStyle = i === 0 ? STAR_BRIGHT : i < 3 ? STAR_MID : STAR_DIM;
        ctx.fillText(i === 0 ? "*" : "'", col * charW, (row + 1) * charH);
      }
    }
  }
};
var AT_X2 = 0.76;
var AT_Y2 = 0.16;
var RADIUS_ROWS2 = 1.6;
var CHAR_ASPECT2 = 2;
var BREATH_SPEED = 0.45;
var RAY_BASE = 2.4;
var RAY_STRETCH = 1.4;
var CORE = "#ffd685";
var RIM = "#e0aa55";
var RAY = "#b98f4e";
var RAY_DIRS = [
  [1, 0, "-"],
  [-1, 0, "-"],
  [0, 1, "|"],
  [0, -1, "|"],
  [1, 1, "\\"],
  [-1, -1, "\\"],
  [1, -1, "/"],
  [-1, 1, "/"]
];
var SunSystem = class {
  centerCol = 0;
  centerRow = 0;
  visible = false;
  breath = Math.random() * Math.PI * 2;
  init(cols, rows) {
    this.centerCol = Math.round(cols * AT_X2);
    this.centerRow = Math.round(rows * AT_Y2);
    this.visible = rows >= 12 && cols >= 30;
  }
  update(dt) {
    this.breath += dt / 1e3 * BREATH_SPEED;
  }
  render(ctx, cols, rows, charW, charH) {
    if (!this.visible) return;
    const ry = RADIUS_ROWS2;
    const rx = RADIUS_ROWS2 * CHAR_ASPECT2;
    for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy++) {
      for (let dx = -Math.ceil(rx); dx <= Math.ceil(rx); dx++) {
        const d = (dx / rx) ** 2 + (dy / ry) ** 2;
        if (d > 1) continue;
        const col = this.centerCol + dx;
        const row = this.centerRow + dy;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        ctx.fillStyle = d > 0.6 ? RIM : CORE;
        ctx.fillText(d > 0.6 ? "*" : "@", col * charW, (row + 1) * charH);
      }
    }
    const reach = RAY_BASE + (Math.sin(this.breath) * 0.5 + 0.5) * RAY_STRETCH;
    ctx.fillStyle = RAY;
    for (const [dx, dy, glyph] of RAY_DIRS) {
      const col = this.centerCol + Math.round(dx * (rx + reach));
      const row = this.centerRow + Math.round(dy * (ry + reach / CHAR_ASPECT2));
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      ctx.fillText(glyph, col * charW, (row + 1) * charH);
    }
  }
};
var SNOW_FILL_SECONDS = 90;
var LIGHT_SNOW_RATE = 0.55;
var MELT_SECONDS = 160;
var MELT_TEMP_GAIN = 12;
var CAP_HEAVY = 0.4;
var ICICLE_COVER = 0.5;
var ICICLE_ROLL = 45;
var LONG_ICICLE_ROLL = 8;
var SNOW_BRIGHT2 = "#dde4ea";
var SNOW_DIM2 = "#b9c4cc";
var ICE_TONE = "#9fb6c6";
var WET_SECONDS = {
  drizzle: 80,
  rain: 40,
  "heavy-rain": 28,
  thunderstorm: 26
};
var DRY_SECONDS = 130;
var CLEAR_DAY_DRY_FACTOR = 1.8;
var PUDDLE_EVERY_COLS = 14;
var PUDDLE_SPAN_MIN = 3;
var PUDDLE_SPAN_VAR = 4;
var PUDDLE_THRESHOLD_MIN = 0.12;
var PUDDLE_THRESHOLD_VAR = 0.45;
var SHIMMER_SPEED = 1.7;
var WATER_TONE = "#3d5568";
var WATER_GLINT = "#6a90ad";
var RAINBOW_IN2 = 3;
var RAINBOW_HOLD2 = 16;
var RAINBOW_OUT2 = 8;
var RAINBOW_TOTAL2 = RAINBOW_IN2 + RAINBOW_HOLD2 + RAINBOW_OUT2;
var RAINBOW_MIN_WET = 0.12;
var RAINBOW_ALPHA = 0.5;
var COL_ASPECT = 0.52;
var RAINBOW_BANDS = [
  [201, 121, 116],
  [199, 178, 112],
  [118, 149, 197]
];
var isRainy = (c) => c === "drizzle" || c === "rain" || c === "heavy-rain" || c === "thunderstorm";
var isSnowy = (c) => c === "snow" || c === "heavy-snow";
var isCalm = (c) => c === "clear" || c === "partly-cloudy";
var TracesSystem = class {
  constructor(scene) {
    this.scene = scene;
  }
  scene;
  snowCover = 0;
  wetness = 0;
  cols = 0;
  rows = 0;
  time = 0;
  puddles = [];
  condition = "clear";
  temperature = 20;
  isDay = false;
  rainbowLeft = 0;
  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.time = 0;
    this.snowCover = 0;
    this.wetness = 0;
    this.rainbowLeft = 0;
    this.buildPuddleSites();
  }
  configure(weather) {
    const wasRaining = isRainy(this.condition);
    this.condition = weather.condition;
    this.temperature = weather.temperature;
    this.isDay = weather.isDay;
    if (wasRaining && isCalm(weather.condition) && weather.isDay && this.wetness > RAINBOW_MIN_WET) {
      this.rainbowLeft = RAINBOW_TOTAL2;
    }
    if (!isCalm(weather.condition) || !weather.isDay) this.rainbowLeft = 0;
  }
  update(dt) {
    const dtSec = dt / 1e3;
    this.time += dtSec;
    if (isSnowy(this.condition)) {
      const rate = this.condition === "heavy-snow" ? 1 : LIGHT_SNOW_RATE;
      this.snowCover = Math.min(1, this.snowCover + rate * dtSec / SNOW_FILL_SECONDS);
    } else if (this.temperature > 0 && this.snowCover > 0) {
      const speed = 1 + Math.min(2, this.temperature / MELT_TEMP_GAIN);
      this.snowCover = Math.max(0, this.snowCover - speed * dtSec / MELT_SECONDS);
    }
    const wetSeconds = WET_SECONDS[this.condition];
    if (wetSeconds) {
      this.wetness = Math.min(1, this.wetness + dtSec / wetSeconds);
    } else if (this.wetness > 0) {
      const factor = isCalm(this.condition) && this.isDay ? CLEAR_DAY_DRY_FACTOR : 1;
      this.wetness = Math.max(0, this.wetness - factor * dtSec / DRY_SECONDS);
    }
    if (this.rainbowLeft > 0) this.rainbowLeft = Math.max(0, this.rainbowLeft - dtSec);
    this.scene.snowLevel = this.snowCover;
  }
  render(ctx, cols, rows, charW, charH) {
    if (this.rainbowLeft > 0) this.renderRainbow(ctx, cols, rows, charW, charH);
    if (this.wetness > PUDDLE_THRESHOLD_MIN) this.renderPuddles(ctx, cols, rows, charW, charH);
    if (this.snowCover > 0) this.renderSnow(ctx, cols, rows, charW, charH);
  }
  // --- snow on the scene ---
  renderSnow(ctx, cols, rows, charW, charH) {
    const cover97 = this.snowCover * 97;
    for (const perch of this.scene.perches) {
      if (cover97 <= perch.roll) continue;
      const row = perch.row - 1;
      if (perch.col < 0 || perch.col >= cols || row < 0 || row >= rows) continue;
      const heavy = cover97 - perch.roll > CAP_HEAVY * 97;
      ctx.fillStyle = heavy ? SNOW_BRIGHT2 : SNOW_DIM2;
      ctx.fillText(heavy ? "*" : "_", perch.col * charW, (row + 1) * charH);
    }
    if (this.snowCover > ICICLE_COVER && this.temperature <= 0) {
      ctx.fillStyle = ICE_TONE;
      for (const hang of this.scene.hangs) {
        if (hang.roll >= ICICLE_ROLL) continue;
        const row = hang.row + 1;
        if (hang.col < 0 || hang.col >= cols || row >= rows) continue;
        ctx.fillText("'", hang.col * charW, (row + 1) * charH);
        if (hang.roll < LONG_ICICLE_ROLL && this.snowCover > 0.85 && row + 1 < rows) {
          ctx.fillText(".", hang.col * charW, (row + 1.4) * charH);
        }
      }
    }
  }
  // --- puddles ---
  buildPuddleSites() {
    this.puddles = [];
    const top = this.scene.anchors.groundRow + 1;
    if (top >= this.rows || this.cols < 20) return;
    for (let base = 4; base < this.cols - 6; base += PUDDLE_EVERY_COLS) {
      const h = (Math.imul(base + 3, 40503) ^ 47) >>> 0;
      const col = base + h % 7;
      const row = top + (h >>> 5) % Math.max(1, this.rows - top);
      const span = PUDDLE_SPAN_MIN + (h >>> 9) % (PUDDLE_SPAN_VAR + 1);
      const threshold = PUDDLE_THRESHOLD_MIN + (h >>> 13) % 90 / 90 * PUDDLE_THRESHOLD_VAR;
      this.puddles.push({ col, row, span, threshold });
    }
  }
  renderPuddles(ctx, cols, rows, charW, charH) {
    for (const puddle of this.puddles) {
      if (this.wetness <= puddle.threshold || puddle.row >= rows) continue;
      const grow = Math.min(1, (this.wetness - puddle.threshold) / 0.35);
      const half = Math.max(0, Math.round(puddle.span * grow / 2));
      const y = (puddle.row + 1) * charH;
      for (let c = puddle.col - half; c <= puddle.col + half; c++) {
        if (c < 0 || c >= cols) continue;
        const glint = Math.sin(this.time * SHIMMER_SPEED + c * 0.9 + puddle.row) > 0.72;
        ctx.fillStyle = glint ? WATER_GLINT : WATER_TONE;
        ctx.fillText("~", c * charW, y);
      }
    }
  }
  // --- rainbow ---
  renderRainbow(ctx, cols, rows, charW, charH) {
    const t = RAINBOW_TOTAL2 - this.rainbowLeft;
    const fade = t < RAINBOW_IN2 ? t / RAINBOW_IN2 : this.rainbowLeft < RAINBOW_OUT2 ? this.rainbowLeft / RAINBOW_OUT2 : 1;
    const alpha = fade * RAINBOW_ALPHA;
    const ground = Math.min(this.scene.anchors.groundRow, rows);
    if (ground < 8) return;
    const cx = cols * 0.55;
    const radius = ground * 0.82;
    for (let band = 0; band < RAINBOW_BANDS.length; band++) {
      const [r, g, b] = RAINBOW_BANDS[band];
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      const rb = radius - band * 1.4;
      for (let col = 0; col < cols; col++) {
        const dx = (col - cx) * COL_ASPECT;
        const under = rb * rb - dx * dx;
        if (under <= 0) continue;
        const row = Math.round(ground - Math.sqrt(under));
        if (row < 0 || row >= ground) continue;
        const glyph = Math.abs(dx) < rb * 0.45 ? "-" : col < cx ? "/" : "\\";
        ctx.fillText(glyph, col * charW, (row + 1) * charH);
      }
    }
  }
};
var DEFAULT_WEATHER_CONFIG = {
  source: null,
  pollIntervalSeconds: 900,
  fallbackWeather: {
    condition: "clear",
    temperature: 20,
    windSpeed: 5,
    windDirection: 0,
    isDay: false,
    precipitation: 0
  }
};
var FIREFLY_MIN_TEMP = 15;
var DEMO_PHASES = [
  {
    seconds: 35,
    weather: { condition: "clear", temperature: 22, windSpeed: 8, windDirection: 250, isDay: true }
  },
  {
    seconds: 30,
    weather: {
      condition: "partly-cloudy",
      temperature: 18,
      windSpeed: 14,
      windDirection: 240,
      isDay: true
    }
  },
  {
    seconds: 45,
    weather: { condition: "rain", temperature: 13, windSpeed: 18, windDirection: 235, isDay: true }
  },
  {
    seconds: 35,
    weather: {
      condition: "partly-cloudy",
      temperature: 14,
      windSpeed: 10,
      windDirection: 250,
      isDay: true
    }
  },
  {
    seconds: 25,
    weather: {
      condition: "overcast",
      temperature: 6,
      windSpeed: 12,
      windDirection: 260,
      isDay: false
    }
  },
  {
    seconds: 55,
    weather: {
      condition: "heavy-snow",
      temperature: -2,
      windSpeed: 10,
      windDirection: 265,
      isDay: false
    }
  },
  {
    seconds: 45,
    weather: {
      condition: "clear",
      temperature: -4,
      windSpeed: 4,
      windDirection: 250,
      isDay: false
    }
  }
];
var DEMO_OPENING_SECONDS = 50;
var isProvider = (source) => "getWeather" in source;
var WeatherPattern = class {
  config;
  provider;
  weather;
  pollTimer = 0;
  polledOnce = false;
  disposed = false;
  demoIndex = -1;
  // -1 = still on the fallbackWeather opening
  demoTimer = DEMO_OPENING_SECONDS;
  scene;
  stars;
  moon;
  sun;
  clouds;
  birds;
  airplane;
  smoke;
  leaves;
  rain;
  snow;
  fog;
  fireflies;
  lightning;
  lightningActive = false;
  layers;
  constructor(config = {}) {
    this.config = { ...DEFAULT_WEATHER_CONFIG, ...config };
    this.weather = this.config.fallbackWeather;
    const source = this.config.source;
    this.provider = source === null ? null : isProvider(source) ? source : new OpenMeteoProvider(source);
    this.scene = new SceneSystem();
    const anchors = this.scene.anchors;
    this.stars = { active: false, system: new StarsSystem() };
    this.moon = { active: false, system: new MoonSystem() };
    this.sun = { active: false, system: new SunSystem() };
    this.clouds = { active: true, system: new CloudSystem() };
    this.birds = { active: false, system: new BirdSystem() };
    this.airplane = { active: true, system: new AirplaneSystem() };
    this.smoke = { active: true, system: new SmokeSystem(anchors) };
    this.leaves = { active: true, system: new LeavesSystem(anchors) };
    this.rain = { active: false, system: new RainSystem(anchors) };
    this.snow = { active: false, system: new SnowSystem(anchors) };
    this.fog = { active: false, system: new FogSystem() };
    this.fireflies = { active: false, system: new FireflySystem(anchors) };
    this.lightning = new LightningSystem(anchors);
    const traces = { active: true, system: new TracesSystem(this.scene) };
    this.layers = [
      this.stars,
      this.moon,
      this.sun,
      this.clouds,
      this.birds,
      this.airplane,
      { active: true, system: this.scene },
      traces,
      this.smoke,
      this.leaves,
      this.rain,
      this.snow,
      this.fog,
      this.fireflies
    ];
  }
  init(cols, rows) {
    for (const layer of this.layers) layer.system.init(cols, rows);
    this.lightning.init(cols, rows);
    this.applyWeather(this.weather);
    this.pollTimer = 0;
    this.polledOnce = false;
    this.demoIndex = -1;
    this.demoTimer = DEMO_OPENING_SECONDS;
  }
  update(dt) {
    if (this.provider) {
      this.pollTimer -= dt / 1e3;
      if (!this.polledOnce || this.pollTimer <= 0) {
        this.polledOnce = true;
        this.pollTimer = this.config.pollIntervalSeconds;
        this.poll();
      }
    } else if (this.config.demoReel !== false) {
      this.advanceDemo(dt / 1e3);
    }
    for (const layer of this.layers) {
      if (layer.active) layer.system.update(dt);
    }
    if (this.lightningActive) this.lightning.update(dt);
  }
  render(ctx, cols, rows, charW, charH) {
    for (const layer of this.layers) {
      if (layer.active) layer.system.render(ctx, cols, rows, charW, charH);
    }
    if (this.lightningActive) {
      this.lightning.render(ctx, cols, rows, charW, charH);
      if (this.lightning.isFlashing()) {
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillRect(0, 0, cols * charW, rows * charH);
      }
    }
  }
  dispose() {
    this.disposed = true;
  }
  // --- weather plumbing ---
  /** Sourceless mode: walk the demo reel, then loop it (skipping the opening). */
  advanceDemo(dtSec) {
    this.demoTimer -= dtSec;
    if (this.demoTimer > 0) return;
    this.demoIndex = (this.demoIndex + 1) % DEMO_PHASES.length;
    const phase = DEMO_PHASES[this.demoIndex];
    this.demoTimer = phase.seconds;
    this.weather = { ...phase.weather, precipitation: 0 };
    this.applyWeather(this.weather);
  }
  poll() {
    this.provider?.getWeather().then((data) => {
      if (data && !this.disposed) {
        this.weather = data;
        this.applyWeather(data);
      }
    });
  }
  applyWeather(weather) {
    const { condition, isDay, temperature } = weather;
    const calmSky = condition === "clear" || condition === "partly-cloudy";
    const raining = condition === "drizzle" || condition === "rain" || condition === "heavy-rain" || condition === "thunderstorm";
    const snowing = condition === "snow" || condition === "heavy-snow";
    this.stars.active = !isDay;
    this.moon.active = !isDay;
    this.sun.active = isDay && calmSky;
    this.birds.active = isDay && calmSky;
    this.fireflies.active = !isDay && calmSky && temperature >= FIREFLY_MIN_TEMP;
    this.smoke.active = condition !== "heavy-rain" && condition !== "thunderstorm";
    this.leaves.active = !snowing;
    this.airplane.active = condition !== "thunderstorm" && condition !== "fog";
    this.rain.active = raining;
    this.snow.active = snowing;
    this.fog.active = condition === "fog";
    this.lightningActive = condition === "thunderstorm";
    for (const layer of this.layers) layer.system.configure?.(weather);
  }
};

// asciitopia.js
var PATTERNS = [
  {
    slug: "asciitopia-fire",
    name: "Fire",
    note: "Rising flames with embers, sparks, and a classic palette.",
    create: () => new FirePattern()
  },
  {
    slug: "asciitopia-rain",
    name: "Rain",
    note: "Falling drops with fading trails, impact flashes, and splashes.",
    create: () => new RainPattern()
  },
  {
    slug: "asciitopia-snow",
    name: "Snow",
    note: "Drifting flakes on two depth layers with sway and wind.",
    create: () => new SnowPattern()
  },
  {
    slug: "asciitopia-waves",
    name: "Waves",
    note: "Layered sine-and-noise ocean swell.",
    create: () => new WavePattern()
  },
  {
    slug: "asciitopia-aurora",
    name: "Aurora",
    note: "Northern lights shifting through drifting fractal noise.",
    create: () => new AuroraPattern()
  },
  {
    slug: "asciitopia-bonsai",
    name: "Bonsai",
    note: "A windswept tree grows limb by limb as the garden changes seasons.",
    create: () => new BonsaiPattern()
  },
  {
    slug: "asciitopia-weather",
    name: "Weather",
    note: "A cabin scene cycling through changing weather in an offline demo.",
    create: () => new WeatherPattern()
  }
];
var PATTERNS_BY_SLUG = new Map(
  PATTERNS.map((pattern) => [pattern.slug, pattern])
);
var ASCIITOPIA_PIECES = PATTERNS.map((pattern) => ({
  slug: pattern.slug,
  name: pattern.name,
  category: "asciitopia",
  note: pattern.note,
  tags: ["asciitopia", "animated", "ascii"],
  params: {}
}));
function isAsciitopiaPiece(slug) {
  return PATTERNS_BY_SLUG.has(slug);
}
function createAsciitopiaPattern(slug) {
  const pattern = PATTERNS_BY_SLUG.get(slug);
  if (!pattern) {
    throw new Error(`Unknown Asciitopia pattern: ${slug}`);
  }
  return pattern.create();
}
export {
  ASCIITOPIA_PIECES,
  CanvasEngine,
  createAsciitopiaPattern,
  isAsciitopiaPiece
};
