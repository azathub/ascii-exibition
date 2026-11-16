/*
 * ascii.js: one script tag, then <ascii-art piece="moonlit-sea"></ascii-art>
 * anywhere on the page. No install, no build step.
 *
 *   <script type="module" src="https://www.ascii-magic.com/ascii/ascii.js"></script>
 *   <ascii-art piece="spinning-torus"></ascii-art>
 *
 * Attributes: piece (slug), speed (1), still (no animation), size (font size
 * in px, default 12), bg (background colour, default transparent), look
 * (dots, ascii, dense, numbers, binary, letters, blocks, squares, lines, dither),
 * chars (your own characters, light to dark), mono (one colour), contrast
 * (0 to 100, default 0), dot-size (halftone dot size, 25 to 120, default 51),
 * steps (halftone dot sizes: 3, 5, or 0 for smooth), density (dot spacing, 40
 * to 250, default 131: more dots closer together, dot size unchanged), all
 * (redraw text and line work in the look too, not only shading). Pieces with
 * settings take them as attributes too: <ascii-art piece="star-milestone"
 * repo="you/your-repo" stars="250">.
 */
import { play, withParams } from "./player.js";

const BRAND_STOPS = [
  [0, "#030b1d"],
  [0.12, "#071a4f"],
  [0.3, "#12398d"],
  [0.5, "#2856cc"],
  [0.68, "#4b74ff"],
  [1, "#e8eeff"],
];
const MATRIX_BRAND_STOPS = [
  [0, "#030b1d"],
  [0.2, "#0a1f54"],
  [0.4, "#12398d"],
  [0.58, "#2452cd"],
  [0.72, "#4b74ff"],
  [0.86, "#91aaff"],
  [1, "#e8eeff"],
];

function brandPalette(palette, slug) {
  if (!palette || typeof palette !== "object") return palette;

  const linear = (value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const toRgb = (hex) =>
    [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  const toHex = (rgb) =>
    `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
  const entries = Object.entries(palette);

  if (slug === "matrix-rain") {
    return Object.fromEntries(
      entries.map(([key], index) => {
        const progress = index / Math.max(1, entries.length - 1);
        let upper = 1;
        while (
          upper < MATRIX_BRAND_STOPS.length - 1 &&
          progress > MATRIX_BRAND_STOPS[upper][0]
        ) {
          upper += 1;
        }
        const [lowPoint, lowColor] = MATRIX_BRAND_STOPS[upper - 1];
        const [highPoint, highColor] = MATRIX_BRAND_STOPS[upper];
        const amount = (progress - lowPoint) / (highPoint - lowPoint);
        const lowRgb = toRgb(lowColor);
        const highRgb = toRgb(highColor);
        return [
          key,
          toHex(
            lowRgb.map(
              (value, channel) => value + (highRgb[channel] - value) * amount,
            ),
          ),
        ];
      }),
    );
  }

  return Object.fromEntries(
    entries.map(([key, color]) => {
      if (typeof color !== "string" || !/^#[\da-f]{6}$/i.test(color)) {
        return [key, color];
      }

      const [red, green, blue] = color.slice(1).match(/.{2}/g);
      const brightness =
        0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
      let upper = 1;
      while (
        upper < BRAND_STOPS.length - 1 &&
        brightness > BRAND_STOPS[upper][0]
      ) {
        upper += 1;
      }

      const [lowPoint, lowColor] = BRAND_STOPS[upper - 1];
      const [highPoint, highColor] = BRAND_STOPS[upper];
      const amount = Math.max(
        0,
        Math.min(1, (brightness - lowPoint) / (highPoint - lowPoint)),
      );
      const lowRgb = toRgb(lowColor);
      const highRgb = toRgb(highColor);
      return [
        key,
        toHex(
          lowRgb.map(
            (value, index) => value + (highRgb[index] - value) * amount,
          ),
        ),
      ];
    }),
  );
}

// Pieces sit next to this file on ascii-magic.com (/ascii/ascii.js, /ascii/pieces/) and one
// folder up in the npm package (runtime/ascii.js, pieces/), so self-hosting the package works too.
const BASE = new URL(
  /\/runtime\/[^/]*$/.test(new URL(import.meta.url).pathname) ? "../" : ".",
  import.meta.url,
).href;

class AsciiArt extends HTMLElement {
  static get observedAttributes() {
    return [
      "piece",
      "speed",
      "still",
      "size",
      "bg",
      "look",
      "chars",
      "mono",
      "brand",
      "contrast",
      "dot-size",
      "steps",
      "density",
      "all",
    ];
  }
  connectedCallback() {
    this.start();
  }
  disconnectedCallback() {
    this.stop?.();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.start();
  }
  async start() {
    this.stop?.();
    const slug = (this.getAttribute("piece") || "").replace(/[^a-z0-9-]/g, "");
    if (!slug) return;
    if (!this.pre) {
      const root = this.attachShadow
        ? this.shadowRoot || this.attachShadow({ mode: "open" })
        : this;
      root.innerHTML = `<style>
        :host{display:inline-block;max-width:100%;overflow:hidden}
        pre{margin:0;font:var(--ascii-size,12px)/1 Menlo,Consolas,"DejaVu Sans Mono","Liberation Mono",monospace;letter-spacing:0;white-space:pre;color:var(--ascii-ink,currentColor)}
      </style><pre aria-hidden="true"></pre>`;
      this.pre = root.querySelector("pre");
    }
    this.style.setProperty(
      "--ascii-size",
      (parseFloat(this.getAttribute("size")) || 12) + "px",
    );
    if (this.getAttribute("bg"))
      this.style.background = this.getAttribute("bg");
    this.setAttribute("role", "img");
    try {
      const pieceUrl = `${BASE}pieces/${slug}.js${slug === "matrix-rain" ? "?v=3" : ""}`;
      const source = await import(pieceUrl);
      const mod = this.hasAttribute("brand")
        ? {
            ...source,
            meta: {
              ...source.meta,
              palette: brandPalette(source.meta.palette, source.meta.slug),
            },
          }
        : source;
      if (!this.getAttribute("aria-label"))
        this.setAttribute("aria-label", mod.meta.name + ", animated ASCII art");
      // a piece's own settings come straight from attributes of the same name (repo="..." stars="...")
      const P = mod.meta.params || {},
        values = {};
      for (const k of Object.keys(P))
        if (this.hasAttribute(k)) values[k] = this.getAttribute(k);
      this.stop = play(this.pre, withParams(mod, values), {
        speed: parseFloat(this.getAttribute("speed")) || 1,
        still: this.hasAttribute("still") || undefined,
        look: {
          look: this.getAttribute("look") || undefined,
          chars: this.getAttribute("chars") || undefined,
          mono: this.hasAttribute("mono"),
          all: this.hasAttribute("all") || undefined,
          gamma: this.hasAttribute("contrast")
            ? 0.35 +
              ((parseFloat(this.getAttribute("contrast")) || 0) / 100) * 0.8
            : undefined,
          size: this.hasAttribute("dot-size")
            ? (parseFloat(this.getAttribute("dot-size")) || 85) / 100
            : undefined,
          density: this.hasAttribute("density")
            ? (parseFloat(this.getAttribute("density")) || 100) / 100
            : undefined,
          steps: this.hasAttribute("steps")
            ? parseInt(this.getAttribute("steps"), 10) || 0
            : undefined,
        },
      });
    } catch (e) {
      this.pre.textContent = `ascii-art: no piece "${slug}"`;
    }
  }
}
if (!customElements.get("ascii-art"))
  customElements.define("ascii-art", AsciiArt);
