import {
  AuroraPattern,
  BonsaiPattern,
  CanvasEngine,
  FirePattern,
  RainPattern,
  SnowPattern,
  WavePattern,
} from "@asciitopia/core";
import { WeatherPattern } from "@asciitopia/core/weather";

const PATTERNS = [
  {
    slug: "asciitopia-fire",
    name: "Fire",
    note: "Rising flames with embers, sparks, and a classic palette.",
    create: () => new FirePattern(),
  },
  {
    slug: "asciitopia-rain",
    name: "Rain",
    note: "Falling drops with fading trails, impact flashes, and splashes.",
    create: () => new RainPattern(),
  },
  {
    slug: "asciitopia-snow",
    name: "Snow",
    note: "Drifting flakes on two depth layers with sway and wind.",
    create: () => new SnowPattern(),
  },
  {
    slug: "asciitopia-waves",
    name: "Waves",
    note: "Layered sine-and-noise ocean swell.",
    create: () => new WavePattern(),
  },
  {
    slug: "asciitopia-aurora",
    name: "Aurora",
    note: "Northern lights shifting through drifting fractal noise.",
    create: () => new AuroraPattern(),
  },
  {
    slug: "asciitopia-bonsai",
    name: "Bonsai",
    note: "A windswept tree grows limb by limb as the garden changes seasons.",
    create: () => new BonsaiPattern(),
  },
  {
    slug: "asciitopia-weather",
    name: "Weather",
    note: "A cabin scene cycling through changing weather in an offline demo.",
    create: () => new WeatherPattern(),
  },
];

const PATTERNS_BY_SLUG = new Map(
  PATTERNS.map((pattern) => [pattern.slug, pattern]),
);

export const ASCIITOPIA_PIECES = PATTERNS.map((pattern) => ({
  slug: pattern.slug,
  name: pattern.name,
  category: "asciitopia",
  note: pattern.note,
  tags: ["asciitopia", "animated", "ascii"],
  params: {},
}));

export { CanvasEngine };

export function isAsciitopiaPiece(slug) {
  return PATTERNS_BY_SLUG.has(slug);
}

export function createAsciitopiaPattern(slug) {
  const pattern = PATTERNS_BY_SLUG.get(slug);
  if (!pattern) {
    throw new Error(`Unknown Asciitopia pattern: ${slug}`);
  }
  return pattern.create();
}
