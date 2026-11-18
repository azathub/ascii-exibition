const GLYPHS = " .:-=+*#%@";
const BRAND_COLOR = [75, 116, 255];

const hash = (x, y) => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const smooth = (value) => value * value * (3 - 2 * value);
const mix = (a, b, amount) => a + (b - a) * amount;

function noise(x, y) {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const xAmount = smooth(x - left);
  const yAmount = smooth(y - top);
  const upper = mix(
    hash(left, top),
    hash(left + 1, top),
    xAmount,
  );
  const lower = mix(
    hash(left, top + 1),
    hash(left + 1, top + 1),
    xAmount,
  );
  return mix(upper, lower, yAmount);
}

function drawGlyph(ctx, value, col, row, charW, charH) {
  const glyphIndex = Math.min(
    GLYPHS.length - 1,
    Math.floor(value * GLYPHS.length),
  );
  const glyph = GLYPHS[glyphIndex];
  if (glyph === " ") return;
  const opacity = 0.18 + value * 0.82;
  ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${opacity.toFixed(2)})`;
  ctx.fillText(glyph, col * charW, (row + 1) * charH);
}

function drawAsciiLine(ctx, x0, y0, x1, y1, cols, rows, charW, charH, glyph, color) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const endX = Math.round(x1);
  const endY = Math.round(y1);
  const dx = Math.abs(endX - x);
  const dy = Math.abs(endY - y);
  const stepX = x < endX ? 1 : -1;
  const stepY = y < endY ? 1 : -1;
  let error = dx - dy;
  ctx.fillStyle = color;

  while (true) {
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      ctx.fillText(glyph, x * charW, (y + 1) * charH);
    }
    if (x === endX && y === endY) break;
    const doubledError = error * 2;
    if (doubledError > -dy) {
      error -= dy;
      x += stepX;
    }
    if (doubledError < dx) {
      error += dx;
      y += stepY;
    }
  }
}

class NoiseFieldPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = noise(
          col * 0.105 + this.time * 0.16,
          row * 0.19 - this.time * 0.11,
        );
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class InterferencePattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const centerX = cols / 2;
    const centerY = rows / 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - centerX) * 0.6;
        const y = row - centerY;
        const radius = Math.hypot(x, y);
        const angle = Math.atan2(y, x);
        const firstWave = Math.sin(radius * 0.46 - this.time * 1.4);
        const secondWave = Math.sin(
          radius * 0.24 + angle * 3 - this.time * 0.8,
        );
        const value = (firstWave + secondWave + 2) / 4;
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class TravellingWavesPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const layers = [
      { center: 0.28, amplitude: 0.1, speed: 1.2, phase: 0, opacity: 0.42 },
      { center: 0.5, amplitude: 0.14, speed: 0.9, phase: 2.1, opacity: 0.72 },
      { center: 0.72, amplitude: 0.09, speed: 0.7, phase: 4.2, opacity: 0.54 },
    ];
    const lastCol = Math.max(1, cols - 1);

    for (const layer of layers) {
      for (let col = 0; col < cols; col++) {
        const progress = col / lastCol;
        const phase =
          progress * Math.PI * 4 + this.time * layer.speed + layer.phase;
        const rowPosition =
          layer.center * rows +
          Math.sin(phase) * layer.amplitude * rows +
          Math.sin(phase * 0.55 - this.time * 0.35) *
            layer.amplitude *
            rows *
            0.3;
        const centerRow = Math.round(rowPosition);

        for (const offset of [-1, 0, 1]) {
          const row = centerRow + offset;
          if (row < 0 || row >= rows) continue;

          const opacity = layer.opacity * (offset === 0 ? 1 : 0.45);
          const glyph = offset === 0 ? "~" : offset < 0 ? "." : "-";
          ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${opacity.toFixed(2)})`;
          ctx.fillText(glyph, col * charW, (row + 1) * charH);
        }
      }
    }
  }
}

class OrbitalsPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const centerX = cols / 2;
    const centerY = rows / 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - centerX) * 0.6;
        const y = row - centerY;
        const radius = Math.hypot(x, y);
        const angle = Math.atan2(y, x);
        const orbit = Math.sin(angle * 4 - this.time + radius * 0.08);
        const ring = Math.cos(radius * 0.38 - this.time * 0.65);
        const value = (orbit * ring + 1) / 2;
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class StarfieldPattern {
  stars = [];
  cols = 0;
  rows = 0;

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    const count = Math.min(300, Math.max(80, Math.floor(cols * rows * 0.025)));
    this.stars = Array.from({ length: count }, () => this.createStar());
  }

  update(dt) {
    for (const star of this.stars) {
      star.depth -= dt * 0.00012;
      if (star.depth <= 0.025) {
        Object.assign(star, this.createStar(1));
      }
    }
  }

  render(ctx, cols, rows, charW, charH) {
    const centerX = cols / 2;
    const centerY = rows / 2;
    const spread = rows * 0.45;
    for (const star of this.stars) {
      const col = Math.round(centerX + (star.x / star.depth) * spread);
      const row = Math.round(centerY + (star.y / star.depth) * spread);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const brightness = 1 - star.depth;
      const glyph = brightness > 0.82 ? "*" : brightness > 0.5 ? "+" : ".";
      ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${(0.25 + brightness * 0.75).toFixed(2)})`;
      ctx.fillText(glyph, col * charW, (row + 1) * charH);
    }
  }

  createStar(depth = Math.random() * 0.95 + 0.05) {
    return {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      depth,
    };
  }
}

class MatrixFallPattern {
  columns = [];
  rows = 0;
  time = 0;

  init(cols, rows) {
    this.rows = rows;
    this.time = 0;
    this.columns = Array.from({ length: cols }, () => ({
      head: Math.random() * rows,
      length: 8 + Math.random() * 16,
      speed: 5 + Math.random() * 9,
    }));
  }

  update(dt) {
    this.time += dt / 1000;
    for (const column of this.columns) {
      column.head += column.speed * dt / 1000;
      if (column.head - column.length > this.rows) {
        column.head = -Math.random() * this.rows * 0.5;
        column.length = 8 + Math.random() * 16;
        column.speed = 5 + Math.random() * 9;
      }
    }
  }

  render(ctx, cols, rows, charW, charH) {
    for (let col = 0; col < cols; col++) {
      const column = this.columns[col];
      if (!column) continue;
      const firstRow = Math.max(0, Math.floor(column.head - column.length));
      const lastRow = Math.min(rows - 1, Math.floor(column.head));
      for (let row = firstRow; row <= lastRow; row++) {
        const distance = column.head - row;
        const brightness = 1 - distance / column.length;
        const glyph = String((col * 7 + row * 13 + Math.floor(this.time * 5)) % 10);
        ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${(0.12 + brightness * 0.88).toFixed(2)})`;
        ctx.fillText(glyph, col * charW, (row + 1) * charH);
      }
    }
  }
}

class LifePattern {
  cells = new Uint8Array(0);
  cols = 0;
  rows = 0;
  stepTime = 0;

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.stepTime = 0;
    this.cells = Uint8Array.from(
      { length: cols * rows },
      () => (Math.random() < 0.24 ? 1 : 0),
    );
  }

  update(dt) {
    this.stepTime += dt;
    while (this.stepTime >= 160) {
      this.stepTime -= 160;
      this.advance();
    }
  }

  render(ctx, cols, rows, charW, charH) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!this.cells[row * this.cols + col]) continue;
        const glyph = (row + col) % 4 === 0 ? "*" : "#";
        const opacity = 0.45 + ((row * 7 + col * 3) % 6) * 0.09;
        ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${opacity.toFixed(2)})`;
        ctx.fillText(glyph, col * charW, (row + 1) * charH);
      }
    }
  }

  advance() {
    const next = new Uint8Array(this.cells.length);
    for (let row = 0; row < this.rows; row++) {
      const above = (row + this.rows - 1) % this.rows;
      const below = (row + 1) % this.rows;
      for (let col = 0; col < this.cols; col++) {
        const left = (col + this.cols - 1) % this.cols;
        const right = (col + 1) % this.cols;
        const neighbors =
          this.cells[above * this.cols + left] +
          this.cells[above * this.cols + col] +
          this.cells[above * this.cols + right] +
          this.cells[row * this.cols + left] +
          this.cells[row * this.cols + right] +
          this.cells[below * this.cols + left] +
          this.cells[below * this.cols + col] +
          this.cells[below * this.cols + right];
        const index = row * this.cols + col;
        next[index] = neighbors === 3 || (this.cells[index] && neighbors === 2);
      }
    }
    this.cells = next;
  }
}

class DnaHelixPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const center = cols / 2;
    const radius = Math.min(cols * 0.32, rows * 1.15);
    for (let row = 0; row < rows; row++) {
      const phase = row * 0.22 - this.time * 1.3;
      const offset = Math.sin(phase) * radius;
      const left = Math.round(center - offset);
      const right = Math.round(center + offset);
      if (row % 3 === 0) {
        const start = Math.min(left, right);
        const end = Math.max(left, right);
        ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},0.28)`;
        for (let col = start + 1; col < end; col++) {
          ctx.fillText(".", col * charW, (row + 1) * charH);
        }
      }
      const front = Math.cos(phase) > 0;
      ctx.fillStyle = front
        ? `rgba(${BRAND_COLOR.join(",")},0.95)`
        : `rgba(${BRAND_COLOR.join(",")},0.55)`;
      ctx.fillText(front ? "@" : "o", left * charW, (row + 1) * charH);
      ctx.fillText(front ? "o" : "@", right * charW, (row + 1) * charH);
    }
  }
}

class MandelbrotPattern {
  maxIterations = 28;
  values = new Uint8Array(0);
  cols = 0;
  rows = 0;
  time = 0;

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.time = 0;
    this.values = new Uint8Array(cols * rows);
    for (let row = 0; row < rows; row++) {
      const imaginary = ((row / Math.max(1, rows - 1)) * 2 - 1) * 1.25;
      for (let col = 0; col < cols; col++) {
        const real =
          (((col / Math.max(1, cols - 1)) * 2 - 1) * 1.6 - 0.5);
        let zx = 0;
        let zy = 0;
        let iteration = 0;
        while (zx * zx + zy * zy <= 4 && iteration < this.maxIterations) {
          const nextX = zx * zx - zy * zy + real;
          zy = 2 * zx * zy + imaginary;
          zx = nextX;
          iteration++;
        }
        this.values[row * cols + col] = iteration;
      }
    }
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const iteration = this.values[row * this.cols + col];
        const value =
          iteration === this.maxIterations
            ? 0.08
            : 0.2 +
              (0.5 + Math.sin(iteration * 0.34 + this.time * 0.65) * 0.5) *
                0.8;
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class BlackHolePattern {
  stars = [];
  time = 0;
  cols = 0;
  rows = 0;

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.time = 0;
    const count = Math.min(260, Math.max(100, Math.floor(cols * rows * 0.022)));
    this.stars = Array.from({ length: count }, () => this.createStar());
  }

  update(dt) {
    const seconds = dt / 1000;
    this.time += seconds;
    for (const star of this.stars) {
      star.angle += star.orbitSpeed * seconds;
      star.radius -= star.infallSpeed * seconds;
      if (star.radius < 0.2) {
        Object.assign(star, this.createStar());
      }
    }
  }

  render(ctx, cols, rows, charW, charH) {
    const centerX = cols / 2;
    const centerY = rows / 2;
    const scale = Math.min(cols * 0.28, rows * 0.78);
    const horizon = scale * 0.18;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - centerX) * 0.6;
        const y = row - centerY;
        const radius = Math.hypot(x, y);
        const diskRadius = Math.hypot(x, y * 2.4) / scale;
        if (radius < horizon) {
          ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},0.28)`;
          ctx.fillText(radius < horizon * 0.58 ? "@" : "#", col * charW, (row + 1) * charH);
        } else if (diskRadius > 0.34 && diskRadius < 1.05) {
          const angle = Math.atan2(y, x);
          const spiral = Math.sin(angle * 5 - this.time * 2.4 + diskRadius * 12);
          const band = Math.max(0, 1 - Math.abs(diskRadius - 0.69) / 0.36);
          const value = Math.min(1, 0.18 + band * (0.45 + spiral * 0.35));
          drawGlyph(ctx, value, col, row, charW, charH);
        }
      }
    }

    for (const star of this.stars) {
      const col = Math.round(
        centerX + Math.cos(star.angle) * star.radius * scale,
      );
      const row = Math.round(
        centerY + Math.sin(star.angle) * star.radius * scale * 0.28,
      );
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const brightness = Math.max(0.25, 1 - star.radius * 0.68);
      ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${brightness.toFixed(2)})`;
      ctx.fillText(star.radius < 0.38 ? "*" : ".", col * charW, (row + 1) * charH);
    }
  }

  createStar() {
    const radius = 0.4 + Math.random() * 0.72;
    return {
      angle: Math.random() * Math.PI * 2,
      radius,
      orbitSpeed: 0.5 + 0.16 / radius,
      infallSpeed: 0.012 + Math.random() * 0.014,
    };
  }
}

class KaleidoscopePattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const centerX = cols / 2;
    const centerY = rows / 2;
    const sector = (Math.PI * 2) / 8;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - centerX) * 0.6;
        const y = row - centerY;
        const radius = Math.hypot(x, y);
        const angle = Math.atan2(y, x) + this.time * 0.18;
        const folded = Math.abs(
          (((angle % sector) + sector) % sector) - sector / 2,
        );
        const petal = Math.sin(folded * 18 + radius * 0.35 - this.time);
        const ring = Math.cos(radius * 0.48 - this.time * 0.6);
        const value = (petal * ring + 1) / 2;
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class LavaLampPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const blobs = [
      { x: 0.2, y: 0.28, radius: 0.12, speed: 0.72 },
      { x: 0.48, y: 0.62, radius: 0.16, speed: 0.48 },
      { x: 0.74, y: 0.34, radius: 0.11, speed: 0.61 },
      { x: 0.85, y: 0.76, radius: 0.14, speed: 0.39 },
      { x: 0.29, y: 0.82, radius: 0.1, speed: 0.55 },
    ];
    const centers = blobs.map((blob, index) => ({
      x: (blob.x + Math.sin(this.time * blob.speed + index) * 0.09) * cols,
      y: (blob.y + Math.cos(this.time * blob.speed * 0.8 + index) * 0.12) * rows,
      radius: Math.min(cols, rows * 1.5) * blob.radius,
    }));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * 0.6;
        let field = 0;
        for (const center of centers) {
          const dx = x - center.x * 0.6;
          const dy = row - center.y;
          const radiusSquared = center.radius * center.radius;
          field += radiusSquared / (dx * dx + dy * dy + radiusSquared * 0.24);
        }
        const value = Math.max(0, Math.min(1, field / 3.2));
        drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class TopographicPattern {
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const offsetX = Math.sin(this.time * 0.12) * 2;
    const offsetY = Math.cos(this.time * 0.09) * 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * 0.075 + offsetX;
        const y = row * 0.16 + offsetY;
        const elevation =
          noise(x, y) * 0.68 + noise(x * 2.1 + 8, y * 2.1 - 4) * 0.32;
        const contour = Math.abs(((elevation * 13) % 1) - 0.5);
        const value = Math.max(0, Math.min(1, 1 - contour * 5));
        if (value > 0.12) drawGlyph(ctx, value, col, row, charW, charH);
      }
    }
  }
}

class TesseractPattern {
  vertices = Array.from({ length: 16 }, (_, index) => ({
    x: index & 1 ? 1 : -1,
    y: index & 2 ? 1 : -1,
    z: index & 4 ? 1 : -1,
    w: index & 8 ? 1 : -1,
  }));
  edges = this.vertices.flatMap((vertex, index) =>
    this.vertices
      .slice(index + 1)
      .map((other, offset) => [index, index + offset + 1, vertex, other])
      .filter(([, , a, b]) => {
        const differing = Number(a.x !== b.x) + Number(a.y !== b.y) +
          Number(a.z !== b.z) + Number(a.w !== b.w);
        return differing === 1;
      }),
  );
  time = 0;

  init() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    const angles = [
      [0, 3, this.time * 0.48],
      [1, 2, this.time * 0.37],
      [0, 1, this.time * 0.23],
      [2, 3, -this.time * 0.31],
    ];
    const scale = Math.min(cols * 0.13, rows * 0.28);
    const points = this.vertices.map((vertex) => {
      const point = [vertex.x, vertex.y, vertex.z, vertex.w];
      for (const [first, second, angle] of angles) {
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);
        const a = point[first];
        const b = point[second];
        point[first] = a * cosine - b * sine;
        point[second] = a * sine + b * cosine;
      }
      const perspective4 = 2.7 / (3.4 - point[3]);
      const x = point[0] * perspective4;
      const y = point[1] * perspective4;
      const z = point[2] * perspective4;
      const perspective3 = 3.2 / (4.2 - z);
      return {
        x: cols / 2 + (x * perspective3 * scale) / 0.6,
        y: rows / 2 + y * perspective3 * scale,
        depth: (z + 1) / 2,
      };
    });

    for (const [from, to, a, b] of this.edges) {
      const depth = (points[from].depth + points[to].depth) / 2;
      const color = `rgba(${BRAND_COLOR.join(",")},${(0.2 + depth * 0.5).toFixed(2)})`;
      drawAsciiLine(
        ctx,
        points[from].x,
        points[from].y,
        points[to].x,
        points[to].y,
        cols,
        rows,
        charW,
        charH,
        a.w + b.w === 0 ? ":" : ".",
        color,
      );
    }
    for (const point of points) {
      if (point.x < 0 || point.x >= cols || point.y < 0 || point.y >= rows) continue;
      const glyph = point.depth > 0.55 ? "@" : "o";
      ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${(0.45 + point.depth * 0.5).toFixed(2)})`;
      ctx.fillText(glyph, point.x * charW, (point.y + 1) * charH);
    }
  }
}

class DoublePendulumPattern {
  cols = 0;
  rows = 0;
  pivotX = 0;
  pivotY = 0;
  length1 = 0;
  length2 = 0;
  angle1 = 2.15;
  angle2 = 2.45;
  velocity1 = 0;
  velocity2 = 0;
  trail = [];

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.pivotX = cols / 2;
    this.pivotY = rows * 0.18;
    this.length1 = rows * 0.2;
    this.length2 = rows * 0.2;
    this.angle1 = 2.15;
    this.angle2 = 2.45;
    this.velocity1 = 0;
    this.velocity2 = 0;
    this.trail = [];
  }

  update(dt) {
    const stepCount = Math.max(1, Math.ceil(dt / 8));
    const step = dt / 1000 / stepCount;
    for (let i = 0; i < stepCount; i++) this.integrate(step);
    const point = this.secondBob();
    const last = this.trail[this.trail.length - 1];
    if (!last || last.x !== point.x || last.y !== point.y) {
      this.trail.push(point);
      if (this.trail.length > 260) this.trail.shift();
    }
  }

  integrate(dt) {
    const { angle1: a1, angle2: a2, velocity1: v1, velocity2: v2 } = this;
    const delta = a1 - a2;
    const cosine = Math.cos(delta);
    const denominator = 3 - Math.cos(2 * delta);
    const acceleration1 =
      (-3 * 9.81 * Math.sin(a1) -
        9.81 * Math.sin(a1 - 2 * a2) -
        2 * Math.sin(delta) *
          (v2 * v2 * this.length2 +
            v1 * v1 * this.length1 * cosine)) /
      (this.length1 * denominator);
    const acceleration2 =
      (2 *
        Math.sin(delta) *
        (v1 * v1 * this.length1 * 2 +
          2 * 9.81 * Math.cos(a1) +
          v2 * v2 * this.length2 * cosine)) /
      (this.length2 * denominator);
    this.velocity1 = Math.max(-18, Math.min(18, v1 + acceleration1 * dt));
    this.velocity2 = Math.max(-18, Math.min(18, v2 + acceleration2 * dt));
    this.angle1 += this.velocity1 * dt;
    this.angle2 += this.velocity2 * dt;
  }

  secondBob() {
    return {
      x: Math.round(
        this.pivotX +
          (this.length1 * Math.sin(this.angle1) +
            this.length2 * Math.sin(this.angle2)) /
            0.6,
      ),
      y: Math.round(
        this.pivotY +
          this.length1 * Math.cos(this.angle1) +
          this.length2 * Math.cos(this.angle2),
      ),
    };
  }

  render(ctx, cols, rows, charW, charH) {
    for (let index = 0; index < this.trail.length; index++) {
      const point = this.trail[index];
      const opacity = 0.12 + (index / this.trail.length) * 0.65;
      ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${opacity.toFixed(2)})`;
      ctx.fillText(".", point.x * charW, (point.y + 1) * charH);
    }
    const firstBob = {
      x: this.pivotX + (this.length1 * Math.sin(this.angle1)) / 0.6,
      y: this.pivotY + this.length1 * Math.cos(this.angle1),
    };
    const secondBob = this.secondBob();
    const rod = `rgba(${BRAND_COLOR.join(",")},0.55)`;
    drawAsciiLine(ctx, this.pivotX, this.pivotY, firstBob.x, firstBob.y, cols, rows, charW, charH, ":", rod);
    drawAsciiLine(ctx, firstBob.x, firstBob.y, secondBob.x, secondBob.y, cols, rows, charW, charH, ":", rod);
    ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},0.85)`;
    ctx.fillText("@", Math.round(firstBob.x) * charW, (Math.round(firstBob.y) + 1) * charH);
    ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},1)`;
    ctx.fillText("*", secondBob.x * charW, (secondBob.y + 1) * charH);
  }
}

class FernPattern {
  points = new Float32Array(0);
  cols = 0;
  rows = 0;
  time = 0;

  init(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.time = 0;
    const count = 4200;
    this.points = new Float32Array(count * 2);
    let x = 0;
    let y = 0;
    for (let index = 0; index < count; index++) {
      const choice = Math.random();
      const nextX = choice < 0.01
        ? 0
        : choice < 0.86
          ? 0.85 * x + 0.04 * y
          : choice < 0.93
            ? 0.2 * x - 0.26 * y
            : -0.15 * x + 0.28 * y;
      const nextY = choice < 0.01
        ? 0.16 * y
        : choice < 0.86
          ? -0.04 * x + 0.85 * y + 1.6
          : choice < 0.93
            ? 0.23 * x + 0.22 * y + 1.6
            : 0.26 * x + 0.24 * y + 0.44;
      x = nextX;
      y = nextY;
      this.points[index * 2] = x;
      this.points[index * 2 + 1] = y;
    }
  }

  update(dt) {
    this.time += dt / 1000;
  }

  render(ctx, cols, rows, charW, charH) {
    for (let index = 0; index < this.points.length; index += 2) {
      const x = this.points[index];
      const y = this.points[index + 1];
      const sway = Math.sin(y * 0.48 + this.time * 0.7) * 0.025;
      const col = Math.round(((x + 2.6 + sway) / 5.2) * (cols - 1));
      const row = Math.round((1 - y / 10.2) * (rows - 1));
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const height = y / 10.2;
      ctx.fillStyle = `rgba(${BRAND_COLOR.join(",")},${(0.35 + height * 0.6).toFixed(2)})`;
      ctx.fillText(height > 0.78 ? "*" : height > 0.45 ? "+" : ".", col * charW, (row + 1) * charH);
    }
  }
}

const PATTERNS = [
  {
    slug: "noise-field",
    name: "Noise field",
    note: "A drifting, blue-shaded field of animated ASCII noise.",
    create: () => new NoiseFieldPattern(),
  },
  {
    slug: "wave-interference",
    name: "Wave interference",
    note: "Concentric waves overlap to form a moving interference pattern.",
    create: () => new InterferencePattern(),
  },
  {
    slug: "waves",
    name: "Waves",
    note: "Layered ASCII waves travel across the screen in a flowing rhythm.",
    create: () => new TravellingWavesPattern(),
  },
  {
    slug: "orbitals",
    name: "Orbitals",
    note: "Four rotating ASCII orbits cross and fold over one another.",
    create: () => new OrbitalsPattern(),
  },
  {
    slug: "starfield",
    name: "Starfield",
    note: "ASCII stars rush outward from a shifting vanishing point.",
    create: () => new StarfieldPattern(),
  },
  {
    slug: "matrix-fall",
    name: "Matrix fall",
    note: "Columns of blue glyphs stream down the screen.",
    create: () => new MatrixFallPattern(),
  },
  {
    slug: "cellular-life",
    name: "Cellular life",
    note: "A living ASCII grid evolves with Conway's cellular automaton.",
    create: () => new LifePattern(),
  },
  {
    slug: "dna-helix",
    name: "DNA helix",
    note: "Two animated ASCII strands twist together across the screen.",
    create: () => new DnaHelixPattern(),
  },
  {
    slug: "mandelbrot",
    name: "Mandelbrot",
    note: "A shifting ASCII view of the Mandelbrot fractal.",
    create: () => new MandelbrotPattern(),
  },
  {
    slug: "black-hole",
    name: "Black hole",
    note: "A swirling accretion disk pulls stars past its dark event horizon.",
    create: () => new BlackHolePattern(),
  },
  {
    slug: "kaleidoscope",
    name: "Kaleidoscope",
    note: "Eight-fold symmetry spins into a changing ASCII mandala.",
    create: () => new KaleidoscopePattern(),
  },
  {
    slug: "lava-lamp",
    name: "Lava lamp",
    note: "Blue ASCII blobs drift, merge, and separate like a liquid lamp.",
    create: () => new LavaLampPattern(),
  },
  {
    slug: "topographic",
    name: "Topographic",
    note: "Animated contour lines reveal a shifting ASCII landscape.",
    create: () => new TopographicPattern(),
  },
  {
    slug: "tesseract",
    name: "Tesseract",
    note: "A four-dimensional cube rotates through ASCII space.",
    create: () => new TesseractPattern(),
  },
  {
    slug: "double-pendulum",
    name: "Double pendulum",
    note: "A chaotic swinging pendulum draws a fading trail.",
    create: () => new DoublePendulumPattern(),
  },
  {
    slug: "fractal-fern",
    name: "Fractal fern",
    note: "Thousands of points grow into a gently swaying ASCII fern.",
    create: () => new FernPattern(),
  },
];

const PATTERNS_BY_SLUG = new Map(
  PATTERNS.map((pattern) => [pattern.slug, pattern]),
);

export const GENERATIVE_PIECES = PATTERNS.map((pattern) => ({
  slug: pattern.slug,
  name: pattern.name,
  category: "generative",
  note: pattern.note,
  tags: ["generative", "animated", "ascii"],
  params: {},
}));

export function isGenerativePiece(slug) {
  return PATTERNS_BY_SLUG.has(slug);
}

export function createGenerativePattern(slug) {
  const pattern = PATTERNS_BY_SLUG.get(slug);
  if (!pattern) {
    throw new Error(`Unknown exhibition pattern: ${slug}`);
  }
  return pattern.create();
}
