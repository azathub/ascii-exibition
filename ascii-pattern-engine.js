const DEFAULT_FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace';

export class AsciiPatternEngine {
  constructor(canvas, options = {}) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get 2D canvas context");

    this.canvas = canvas;
    this.context = context;
    this.fontSize = options.fontSize ?? 16;
    this.font = `${this.fontSize}px ${options.font ?? DEFAULT_FONT}`;
    this.maxDt = options.maxDt ?? 100;
    this.pattern = null;
    this.frameId = null;
    this.lastTime = 0;
    this.charWidth = 0;
    this.charHeight = 0;

    this.measureCell();
  }

  measureCell() {
    this.context.font = this.font;
    const metrics = this.context.measureText("M");
    this.charWidth = metrics.width || this.fontSize * 0.6;
    this.charHeight =
      metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent ||
      this.fontSize;
  }

  getGridSize() {
    return {
      cols: Math.floor(this.canvas.width / this.charWidth),
      rows: Math.floor(this.canvas.height / this.charHeight),
    };
  }

  setPattern(pattern) {
    this.pattern?.dispose?.();
    this.pattern = pattern;
    const { cols, rows } = this.getGridSize();
    pattern.init(cols, rows);
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.measureCell();
    if (this.pattern) {
      const { cols, rows } = this.getGridSize();
      this.pattern.init(cols, rows);
    }
  }

  start() {
    if (this.frameId !== null) return;
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.lastTime = 0;
  }

  destroy() {
    this.stop();
    this.pattern?.dispose?.();
    this.pattern = null;
  }

  onVisibilityChange = () => {
    if (!document.hidden) this.lastTime = 0;
  };

  tick = (timestamp) => {
    this.frameId = null;
    if (!this.pattern) return;

    const dt =
      this.lastTime === 0
        ? 0
        : Math.min(timestamp - this.lastTime, this.maxDt);
    this.lastTime = timestamp;

    this.pattern.update(dt);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.font = this.font;
    const { cols, rows } = this.getGridSize();
    this.pattern.render(
      this.context,
      cols,
      rows,
      this.charWidth,
      this.charHeight,
    );
    this.frameId = requestAnimationFrame(this.tick);
  };
}
