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
var UP = -Math.PI / 2;
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
