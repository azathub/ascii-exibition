import { AsciiPatternEngine } from "./ascii-pattern-engine.js?v=1";
import {
  GENERATIVE_PIECES,
  createGenerativePattern,
  isGenerativePiece,
} from "./exhibition-patterns.js?v=4";

const STORAGE_KEY = "ascii-exhibition-config-v1";
const CONFIG_VERSION = 3;
const BRAND_COLOR = "#4b74ff";
const FULL_SCREEN_PIECES = new Set([
  "lava-cracks",
  "metaballs",
  "plasma",
  "rotozoomer",
  "starburst",
  "tunnel",
]);
const DEFAULT_AVAILABLE_PIECES = [
  "abu-simbel-colossi",
  "acropolis-hill-dusk",
  "alhambra-hill-dusk",
  "alien-wave",
  "alpine-lake-village",
  "amber-fort-elephants",
  "amber-ledger-spreadsheet",
  "amsterdam-canal-bikes",
];

const DEFAULT_LIBRARY_OPTIONS = {
  speed: 1,
  fitToScreen: true,
  size: 12,
  look: "",
};

const DEFAULT_CONFIG = {
  PIECES: [...DEFAULT_AVAILABLE_PIECES],
  PIECE_MS: 20000,
  LIB_URL: "./vendor/ascii.js?v=5",
  OPTIONS: { ...DEFAULT_LIBRARY_OPTIONS },
  PIECE_PARAMS: {},
  FALLBACK_ROWS: 40,
  FALLBACK_FRAME_MS: 80,
  FALLBACK_ANIM_MS: 20000,
};

let CONFIG = { ...DEFAULT_CONFIG };
let AVAILABLE_PIECES = [...DEFAULT_AVAILABLE_PIECES];
let PIECE_CATALOG = [];
let editingPieceParamSlug = null;
let galleryTimer = null;
let fallbackTimer = null;
let libraryPromise = null;
let galleryRunId = 0;
let previewPieceName = null;
let patternEngine = null;

const stage = document.getElementById("stage");
const configPanel = document.getElementById("config-panel");

function shouldCoverStage(piece) {
  return piece?.category === "algorithms" || FULL_SCREEN_PIECES.has(piece?.slug);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] || char;
  });
}

function sanitizePieceList(list) {
  const pool = new Set(AVAILABLE_PIECES);
  return Array.from(
    new Set(
      (Array.isArray(list) ? list : [])
        .filter(
          (piece) =>
            typeof piece === "string" &&
            piece.trim() &&
            (pool.has(piece) || DEFAULT_AVAILABLE_PIECES.includes(piece)),
        )
        .map((piece) => piece.trim()),
    ),
  );
}

function loadSavedConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    const savedOptions =
      parsed.OPTIONS && typeof parsed.OPTIONS === "object"
        ? parsed.OPTIONS
        : {};
    const options = {
      ...DEFAULT_LIBRARY_OPTIONS,
      look: typeof savedOptions.look === "string" ? savedOptions.look : "",
    };

    CONFIG = {
      ...DEFAULT_CONFIG,
      ...parsed,
      VERSION: CONFIG_VERSION,
      LIB_URL:
        parsed.LIB_URL === "./vendor/ascii.js" ||
        parsed.LIB_URL === "./vendor/ascii.js?v=2" ||
        parsed.LIB_URL === "./vendor/ascii.js?v=3" ||
        parsed.LIB_URL === "./vendor/ascii.js?v=4"
          ? DEFAULT_CONFIG.LIB_URL
          : parsed.LIB_URL || DEFAULT_CONFIG.LIB_URL,
      OPTIONS: options,
      PIECE_PARAMS:
        parsed.PIECE_PARAMS && typeof parsed.PIECE_PARAMS === "object"
          ? parsed.PIECE_PARAMS
          : {},
      PIECES: sanitizePieceList(parsed.PIECES),
    };
  } catch (error) {
    console.warn("Could not load saved exhibition config.", error);
    CONFIG = { ...DEFAULT_CONFIG };
  }
}

function saveConfig() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      VERSION: CONFIG_VERSION,
      PIECES: CONFIG.PIECES,
      PIECE_MS: CONFIG.PIECE_MS,
      LIB_URL: CONFIG.LIB_URL,
      OPTIONS: CONFIG.OPTIONS,
      PIECE_PARAMS: CONFIG.PIECE_PARAMS,
    }),
  );
}

function clearTimers() {
  if (galleryTimer) {
    clearInterval(galleryTimer);
    galleryTimer = null;
  }
  if (fallbackTimer) {
    clearInterval(fallbackTimer);
    fallbackTimer = null;
  }
}

function addPieceToPlaylist(piece) {
  if (!piece) return;
  if (!CONFIG.PIECES.includes(piece)) {
    CONFIG.PIECES.push(piece);
    saveConfig();
    renderConfigPanel();
  }
  startGallery();
}

function removePieceFromPlaylist(index) {
  CONFIG.PIECES.splice(index, 1);
  saveConfig();
  renderConfigPanel();
}

function movePieceInPlaylist(index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= CONFIG.PIECES.length) return;

  const items = [...CONFIG.PIECES];
  [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  CONFIG.PIECES = items;
  saveConfig();
  renderConfigPanel();
}

function saveSelectedPieceParams() {
  const piece = PIECE_CATALOG.find(
    (item) => item.slug === editingPieceParamSlug,
  );
  if (!piece || !Object.keys(piece.params || {}).length) return;

  const params = {};
  configPanel.querySelectorAll("[data-piece-param]").forEach((input) => {
    params[input.dataset.pieceParam] =
      input.dataset.paramType === "number" && input.value !== ""
        ? Number(input.value)
        : input.value;
  });
  CONFIG.PIECE_PARAMS[piece.slug] = params;
}

function renderConfigPanel() {
  if (!configPanel) return;

  const options = CONFIG.OPTIONS;

  const playlistItems = CONFIG.PIECES.length
    ? CONFIG.PIECES.map((piece, index) => {
        const catalogIndex = PIECE_CATALOG.findIndex(
          (item) => item.slug === piece,
        );
        const pieceNumber = catalogIndex >= 0 ? `${catalogIndex + 1}. ` : "";
        const pieceName = PIECE_CATALOG[catalogIndex]?.name || piece;
        return `
          <div class="playlist-item">
            <span>${pieceNumber}${escapeHtml(pieceName)}</span>
            <div class="playlist-actions">
              <button type="button" data-action="move-up" data-index="${index}" aria-label="Move ${escapeHtml(piece)} up">↑</button>
              <button type="button" data-action="move-down" data-index="${index}" aria-label="Move ${escapeHtml(piece)} down">↓</button>
              <button type="button" class="danger" data-action="remove-piece" data-index="${index}" aria-label="Remove ${escapeHtml(piece)}">Remove</button>
            </div>
          </div>
        `;
      }).join("")
    : '<div class="empty-playlist">Your playlist is empty.</div>';

  configPanel.innerHTML = `
    <header class="panel-header">
      <div class="panel-identity">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <h2>Exhibition control</h2>
          <p>${CONFIG.PIECES.length} animations queued</p>
        </div>
      </div>
      <button type="button" class="panel-close" data-action="close-panel" aria-label="Hide control panel" title="Hide panel (H)">×</button>
    </header>

    <section id="view-playlist" class="panel-view" aria-label="Playlist builder">
        <div class="view-heading">
          <div><h3>Build your playlist</h3><p>Choose animations for your show.</p></div>
        </div>

        <div class="collection-heading"><strong>All animations</strong><span>${PIECE_CATALOG.length}</span></div>
        <label>
          Find an animation
          <input id="piece-search" type="search" placeholder="Name, tag, or index (e.g. #25)" />
        </label>
        <label>
          Animation
          <select id="piece-picker"><option value="">Choose an animation...</option></select>
        </label>
        <div id="piece-count" class="piece-count" aria-live="polite"></div>
        <div id="piece-details" class="piece-details"></div>
        <div id="piece-params" class="piece-params"></div>

        <label>
          Character look
          <select id="option-look">
            <option value="" ${options.look === "" ? "selected" : ""}>Piece default</option>
            <option value="dots" ${options.look === "dots" ? "selected" : ""}>Dots</option>
            <option value="ascii" ${options.look === "ascii" ? "selected" : ""}>ASCII</option>
            <option value="dense" ${options.look === "dense" ? "selected" : ""}>Dense</option>
            <option value="numbers" ${options.look === "numbers" ? "selected" : ""}>Numbers</option>
            <option value="binary" ${options.look === "binary" ? "selected" : ""}>Binary</option>
            <option value="letters" ${options.look === "letters" ? "selected" : ""}>Letters</option>
            <option value="blocks" ${options.look === "blocks" ? "selected" : ""}>Blocks</option>
            <option value="squares" ${options.look === "squares" ? "selected" : ""}>Squares</option>
            <option value="lines" ${options.look === "lines" ? "selected" : ""}>Lines</option>
            <option value="dither" ${options.look === "dither" ? "selected" : ""}>Dither</option>
          </select>
        </label>

        <div class="playlist-controls">
          <button type="button" data-action="add-piece">Add to playlist</button>
          <button type="button" class="secondary" data-action="select-all">Add all</button>
        </div>

        <div class="list-heading">
          <h3>Your playlist</h3>
          <div class="playlist-bulk-actions">
            <span>${CONFIG.PIECES.length}</span>
            <button type="button" class="text-button" data-action="clear-playlist" ${CONFIG.PIECES.length ? "" : "disabled"}>Clear</button>
          </div>
        </div>
        <div class="playlist-list">${playlistItems}</div>
    </section>
  `;

  const picker = configPanel.querySelector("#piece-picker");
  const searchInput = configPanel.querySelector("#piece-search");
  updatePieceOptions();
  const savePieceDraft = () => {
    saveSelectedPieceParams();
    saveConfig();
  };
  searchInput?.addEventListener("input", () => {
    savePieceDraft();
    updatePieceOptions();
  });
  picker?.addEventListener("change", () => {
    savePieceDraft();
    renderPieceDetails();
    if (picker.value) {
      previewPiece(picker.value);
    } else {
      startGallery();
    }
  });
  configPanel
    .querySelector("#option-look")
    ?.addEventListener("change", (event) => {
      CONFIG.OPTIONS.look = event.target.value;
      saveConfig();
      const activePiece = stage.querySelector("ascii-art");
      if (activePiece) showPiece(activePiece.getAttribute("piece"));
    });
  configPanel
    .querySelector('[data-action="add-piece"]')
    ?.addEventListener("click", () => {
      saveSelectedPieceParams();
      saveConfig();
      addPieceToPlaylist(picker?.value);
    });
  configPanel.onclick = (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-action]")
        : null;
    if (!target) return;

    const index = Number(target.dataset.index ?? "-1");
    if (target.dataset.action === "close-panel") {
      toggleConfigPanel();
    } else if (target.dataset.action === "select-all") {
      CONFIG.PIECES = [...AVAILABLE_PIECES];
      saveConfig();
      renderConfigPanel();
      startGallery();
    } else if (target.dataset.action === "clear-playlist") {
      CONFIG.PIECES = [];
      saveConfig();
      startGallery();
      renderConfigPanel();
    } else if (target.dataset.action === "remove-piece") {
      removePieceFromPlaylist(index);
    } else if (target.dataset.action === "move-up") {
      movePieceInPlaylist(index, -1);
    } else if (target.dataset.action === "move-down") {
      movePieceInPlaylist(index, 1);
    }
  };
}

function updatePieceOptions() {
  const picker = document.getElementById("piece-picker");
  if (!picker) return;

  const query = (document.getElementById("piece-search")?.value || "")
    .trim()
    .toLowerCase();
  const numericQuery = query.match(/^#?(\d+)$/);
  const requestedIndex = numericQuery ? Number(numericQuery[1]) : null;
  const current = picker.value;
  const filtered = PIECE_CATALOG.filter((piece, index) => {
    if (!query) return true;
    if (requestedIndex !== null) return index + 1 === requestedIndex;
    return [piece.name, piece.slug, piece.note, ...(piece.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  picker.innerHTML = `<option value="">Choose...</option>${filtered
    .map((piece) => {
      const index = PIECE_CATALOG.indexOf(piece);
      return `<option value="${escapeHtml(piece.slug)}">${index + 1}. ${escapeHtml(piece.name)}</option>`;
    })
    .join("")}`;
  if (filtered.some((piece) => piece.slug === current)) picker.value = current;

  const count = document.getElementById("piece-count");
  if (count) count.textContent = `${filtered.length} animations`;
  renderPieceDetails();
}

function renderPieceDetails() {
  const picker = document.getElementById("piece-picker");
  const details = document.getElementById("piece-details");
  const paramsContainer = document.getElementById("piece-params");
  if (!picker || !details || !paramsContainer) return;

  const piece = PIECE_CATALOG.find((item) => item.slug === picker.value);
  if (!piece) {
    editingPieceParamSlug = null;
    details.textContent = "";
    paramsContainer.innerHTML = "";
    return;
  }

  editingPieceParamSlug = piece.slug;
  details.innerHTML = `
    <strong>All animations</strong>
    <span>${escapeHtml(piece.note || "")}</span>
  `;

  const schemas = Object.entries(piece.params || {});
  if (!schemas.length) {
    paramsContainer.innerHTML = "";
    return;
  }

  const saved = CONFIG.PIECE_PARAMS[piece.slug] || {};
  paramsContainer.innerHTML = `
    <h3>Animation-specific settings</h3>
    ${schemas
      .map(([key, schema]) => {
        const type = schema.type === "number" ? "number" : "text";
        const value = saved[key] ?? schema.default ?? "";
        return `
          <label>
            ${escapeHtml(schema.label || key)}
            <input data-piece-param="${escapeHtml(key)}" data-param-type="${type}" type="${type}" value="${escapeHtml(value)}" ${schema.min !== undefined ? `min="${schema.min}"` : ""} ${schema.max !== undefined ? `max="${schema.max}" maxlength="${schema.max}"` : ""} ${type === "number" ? 'step="1"' : ""} />
          </label>
        `;
      })
      .join("")}
  `;
}

function toggleConfigPanel() {
  if (!configPanel) return;
  configPanel.hidden = !configPanel.hidden;
  configPanel.setAttribute("aria-hidden", String(configPanel.hidden));
}

window.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    event.target?.isContentEditable;

  if (isTyping) return;

  if (event.key.toLowerCase() === "h") {
    toggleConfigPanel();
  }
});

function showPiece(pieceName) {
  stopPatternEngine();
  stage.innerHTML = "";
  const piece = PIECE_CATALOG.find((item) => item.slug === pieceName);
  const options = CONFIG.OPTIONS || DEFAULT_LIBRARY_OPTIONS;
  const fillsScreen = options.fitToScreen && shouldCoverStage(piece);
  stage.style.padding = fillsScreen ? "0" : "";
  if (isCanvasPattern(pieceName)) {
    showCanvasPattern(pieceName);
    return;
  }

  const el = document.createElement("ascii-art");
  const size = options.fitToScreen
    ? getFittedPieceSize(pieceName)
    : options.size;
  stage.style.background = "";
  el.setAttribute("piece", pieceName);
  el.setAttribute("speed", String(options.speed));
  el.setAttribute("size", String(size));
  el.setAttribute("brand", "");
  if (options.look) el.setAttribute("look", options.look);
  el.style.color = BRAND_COLOR;
  for (const [key, value] of Object.entries(
    CONFIG.PIECE_PARAMS[pieceName] || {},
  )) {
    if (value !== "" && value !== null && value !== undefined) {
      el.setAttribute(key, String(value));
    }
  }
  stage.appendChild(el);
}

function isCanvasPattern(pieceName) {
  return isGenerativePiece(pieceName);
}

function stopPatternEngine() {
  patternEngine?.destroy();
  patternEngine = null;
}

function scalePatternSpeed(pattern, speed) {
  if (speed === 1) return pattern;
  return {
    init: (...args) => pattern.init(...args),
    update: (dt) => pattern.update(dt * speed),
    render: (...args) => pattern.render(...args),
    dispose: () => pattern.dispose?.(),
  };
}

function showCanvasPattern(pieceName) {
  const canvas = document.createElement("canvas");
  canvas.className = "exhibition-canvas";
  canvas.setAttribute("aria-label", "Animated ASCII pattern");
  stage.style.background = "";
  stage.appendChild(canvas);

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(stage.clientWidth * pixelRatio);
  canvas.height = Math.round(stage.clientHeight * pixelRatio);
  patternEngine = new AsciiPatternEngine(canvas, {
    font: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: (CONFIG.OPTIONS.fitToScreen ? 16 : CONFIG.OPTIONS.size) * pixelRatio,
  });
  const pattern = createGenerativePattern(pieceName);
  patternEngine.setPattern(
    scalePatternSpeed(pattern, CONFIG.OPTIONS.speed),
  );
  patternEngine.start();
}

function getFittedPieceSize(pieceName) {
  const piece = PIECE_CATALOG.find((item) => item.slug === pieceName);
  if (!piece?.cols || !piece?.rows) return CONFIG.OPTIONS.size;
  const fillsScreen = shouldCoverStage(piece);

  const styles = getComputedStyle(stage);
  const availableWidth =
    stage.clientWidth -
    parseFloat(styles.paddingLeft) -
    parseFloat(styles.paddingRight);
  const availableHeight =
    stage.clientHeight -
    parseFloat(styles.paddingTop) -
    parseFloat(styles.paddingBottom);
  const cellWidth = 0.602;
  const cellAspect = piece.cell === "square" ? 1 : 1 / cellWidth;
  const widthSize =
    (availableWidth * (fillsScreen ? 1 : 0.94)) / (piece.cols * cellWidth);
  const heightSize =
    (availableHeight * (fillsScreen ? 1 : 0.94)) /
    (piece.rows * cellWidth * cellAspect);
  const fittedSize = fillsScreen
    ? Math.max(widthSize, heightSize)
    : Math.min(widthSize, heightSize);
  const roundedSize = fillsScreen
    ? Math.ceil(fittedSize * 10) / 10
    : Math.floor(fittedSize * 10) / 10;
  return Math.max(1, roundedSize);
}

let resizeFrame = 0;
window.addEventListener("resize", () => {
  if (patternEngine) {
    const canvas = stage.querySelector(".exhibition-canvas");
    if (!canvas) return;
    const pixelRatio = window.devicePixelRatio || 1;
    patternEngine.resize(
      Math.round(stage.clientWidth * pixelRatio),
      Math.round(stage.clientHeight * pixelRatio),
    );
    return;
  }
  if (!CONFIG.OPTIONS.fitToScreen) return;
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    const activePiece = stage.querySelector("ascii-art");
    if (!activePiece) return;
    activePiece.setAttribute(
      "size",
      String(getFittedPieceSize(activePiece.getAttribute("piece"))),
    );
  });
});

function loadLibrary() {
  if (customElements.get("ascii-art")) return Promise.resolve();
  if (libraryPromise) return libraryPromise;
  if (!CONFIG.LIB_URL)
    return Promise.reject(new Error("No library URL configured."));

  const script = document.createElement("script");
  script.type = "module";
  script.src = CONFIG.LIB_URL;
  libraryPromise = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = () => {
      libraryPromise = null;
      reject(new Error("The ASCII animation library could not be loaded."));
    };
    document.head.appendChild(script);
  });
  return libraryPromise;
}

function previewPiece(pieceName) {
  galleryRunId += 1;
  clearTimers();
  previewPieceName = pieceName;
  if (isCanvasPattern(pieceName)) {
    showPiece(pieceName);
    return;
  }
  loadLibrary()
    .then(() => {
      if (previewPieceName === pieceName) showPiece(pieceName);
    })
    .catch((error) => {
      if (previewPieceName !== pieceName) return;
      console.warn(error.message);
      startFallback();
    });
}

function startGallery() {
  clearTimers();
  previewPieceName = null;
  const runId = ++galleryRunId;

  const beginPlayback = () => {
    if (runId !== galleryRunId) return;
    if (CONFIG.PIECES.length === 0) {
      startFallback();
      return;
    }

    let i = 0;
    const show = () => {
      if (!CONFIG.PIECES.length) return;
      showPiece(CONFIG.PIECES[i % CONFIG.PIECES.length]);
    };

    show();
    galleryTimer = setInterval(() => {
      i += 1;
      show();
    }, CONFIG.PIECE_MS);
  };

  if (
    CONFIG.PIECES.length > 0 &&
    CONFIG.PIECES.every((piece) => isCanvasPattern(piece))
  ) {
    beginPlayback();
    return;
  }

  loadLibrary()
    .then(beginPlayback)
    .catch((error) => {
      if (runId !== galleryRunId) return;
      console.warn(`${error.message} Using local fallback.`);
      startFallback();
    });
}

/* =========================================================
   Fallback renderer (vanilla, no dependencies)
   ========================================================= */
function startFallback() {
  stopPatternEngine();
  clearTimers();
  stage.style.background = "";

  const pre = document.createElement("pre");
  pre.id = "fallback";
  stage.innerHTML = "";
  stage.appendChild(pre);

  let rows = CONFIG.FALLBACK_ROWS;
  let cols = 0;
  const CHAR_ASPECT = 0.6;
  const LINE_HEIGHT = 1.1;

  function fit() {
    const aspect = window.innerWidth / window.innerHeight;
    cols = Math.max(40, Math.round((rows * aspect) / CHAR_ASPECT));
    const charH = Math.min(
      window.innerHeight / (rows * LINE_HEIGHT),
      window.innerWidth / (cols * CHAR_ASPECT),
    );
    pre.style.fontSize = `${charH}px`;
    pre.style.lineHeight = String(LINE_HEIGHT);
  }
  fit();
  window.addEventListener("resize", fit);

  const wave = (f, cols, rows) => {
    const phase = f * 0.13;
    const lines = [];
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        const w =
          Math.sin(x * 0.12 + phase) * (rows / 5) +
          Math.sin(x * 0.05 - phase * 0.7) * (rows / 8);
        const d = Math.abs(y - (rows / 2 + w));
        line += d < 0.5 ? "#" : d < 1.2 ? "+" : d < 2.2 ? "." : " ";
      }
      lines.push(line);
    }
    return lines.join("\n");
  };

  const pulse = (f, cols, rows) => {
    const cx = (cols - 1) / 2,
      cy = (rows - 1) / 2;
    const maxR = Math.min(cols / 2 / CHAR_ASPECT, rows / 2) * 0.85;
    const radius = ((Math.sin(f * 0.08) + 1) / 2) * maxR + 2;
    const lines = [];
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        const d = Math.hypot((x - cx) * CHAR_ASPECT, y - cy);
        const diff = Math.abs(d - radius);
        line += diff < 0.6 ? "#" : diff < 1.4 ? "+" : diff < 2.4 ? "." : " ";
      }
      lines.push(line);
    }
    return lines.join("\n");
  };

  const bars = (f, cols, rows) => {
    const barW = 4;
    const n = Math.floor(cols / barW);
    const h = [];
    for (let i = 0; i < n; i++) {
      const p = i * 0.37;
      const s = 0.12 + ((i * 0.07) % 0.15);
      const a = Math.sin(f * s + p) * 0.5 + 0.5;
      const b = Math.sin(f * s * 1.3 + p * 2.1) * 0.5 + 0.5;
      h.push(Math.floor(((a + b) / 2) * (rows - 2)) + 2);
    }
    const lines = [];
    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let i = 0; i < n; i++) {
        line += h[i] > rows - 1 - y ? "██" : "  ";
        line += "  ";
      }
      lines.push(line.slice(0, cols).padEnd(cols, " "));
    }
    return lines.join("\n");
  };

  const animations = [wave, pulse, bars];
  let f = 0,
    idx = 0,
    start = performance.now();

  fallbackTimer = setInterval(() => {
    const now = performance.now();
    if (now - start > CONFIG.FALLBACK_ANIM_MS) {
      idx = (idx + 1) % animations.length;
      start = now;
      f = 0;
    }
    pre.textContent = animations[idx](f, cols, rows);
    f++;
  }, CONFIG.FALLBACK_FRAME_MS);
}

async function init() {
  try {
    const response = await fetch("./vendor/catalog.json", {
      cache: "no-cache",
    });
    const catalog = await response.json();
    if (!Array.isArray(catalog.pieces) || !catalog.pieces.length) {
      throw new Error("Animation catalog is empty.");
    }
    PIECE_CATALOG = catalog.pieces;
    AVAILABLE_PIECES = PIECE_CATALOG.map((piece) => piece.slug);
  } catch (error) {
    console.warn("Falling back to default piece list.", error);
    try {
      const response = await fetch("./vendor/pieces.json", {
        cache: "force-cache",
      });
      const pieces = await response.json();
      AVAILABLE_PIECES = Array.isArray(pieces)
        ? pieces
        : [...DEFAULT_AVAILABLE_PIECES];
    } catch {
      AVAILABLE_PIECES = [...DEFAULT_AVAILABLE_PIECES];
    }
    PIECE_CATALOG = AVAILABLE_PIECES.map((slug) => ({
      slug,
      name: slug,
      category: "",
      note: "",
      tags: [],
      params: {},
    }));
  }

  const additionalPieces = [...GENERATIVE_PIECES];
  const existingPieceSlugs = new Set(PIECE_CATALOG.map((piece) => piece.slug));
  PIECE_CATALOG.push(
    ...additionalPieces.filter((piece) => !existingPieceSlugs.has(piece.slug)),
  );
  AVAILABLE_PIECES = PIECE_CATALOG.map((piece) => piece.slug);

  loadSavedConfig();
  CONFIG.PIECES = sanitizePieceList(CONFIG.PIECES);
  renderConfigPanel();
  startGallery();
}

init();
