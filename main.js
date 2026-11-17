import {
  ASCIITOPIA_PIECES,
  CanvasEngine,
  createAsciitopiaPattern,
  isAsciitopiaPiece,
} from "./vendor/asciitopia.bundle.js?v=2";
import {
  GENERATIVE_PIECES,
  createGenerativePattern,
  isGenerativePiece,
} from "./exhibition-patterns.js?v=2";

const STORAGE_KEY = "ascii-exhibition-config-v1";
const CONFIG_VERSION = 2;
const BRAND_COLOR = "#4b74ff";
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
  still: false,
  fitToScreen: true,
  size: 12,
  bg: "",
  look: "",
  chars: "",
  mono: false,
  colorMode: "palette",
  contrast: 0,
  dotSize: 51,
  density: 131,
  steps: "",
  all: false,
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
let LIBRARY_CATEGORIES = [];
let editingPieceParamSlug = null;
let activePanelTab = "playlist";
let galleryTimer = null;
let fallbackTimer = null;
let appearancePreviewTimer = null;
let libraryPromise = null;
let galleryRunId = 0;
let previewPieceName = null;
let patternEngine = null;

const stage = document.getElementById("stage");
const configPanel = document.getElementById("config-panel");

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
      ...savedOptions,
      colorMode:
        savedOptions.colorMode || (savedOptions.mono ? "mono" : "palette"),
    };

    if (
      (Number(parsed.VERSION) || 1) < CONFIG_VERSION &&
      savedOptions.mono === true &&
      savedOptions.bg === "#ffffff"
    ) {
      options.mono = false;
      options.bg = "";
    }

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

function readLibraryOptions() {
  const value = (id) => document.getElementById(id)?.value ?? "";
  const checked = (id) => Boolean(document.getElementById(id)?.checked);
  return {
    speed: Math.max(0.1, Number(value("option-speed")) || 1),
    still: checked("option-still"),
    fitToScreen: checked("option-fit-to-screen"),
    size: Math.max(1, Number(value("option-size")) || 12),
    bg: value("option-bg").trim(),
    look: value("option-look"),
    chars: value("option-chars"),
    mono:
      document.querySelector('input[name="option-color-mode"]:checked')
        ?.value !== "palette",
    colorMode:
      document.querySelector('input[name="option-color-mode"]:checked')
        ?.value || "palette",
    contrast: Math.min(100, Math.max(0, Number(value("option-contrast")) || 0)),
    dotSize: Math.min(
      120,
      Math.max(25, Number(value("option-dot-size")) || 51),
    ),
    density: Math.min(
      250,
      Math.max(40, Number(value("option-density")) || 131),
    ),
    steps: value("option-steps"),
    all: checked("option-all"),
  };
}

function commitPanelConfig() {
  const urlInput = document.getElementById("lib-url");
  const msInput = document.getElementById("piece-ms");
  const nextUrl = urlInput ? urlInput.value.trim() : DEFAULT_CONFIG.LIB_URL;
  const nextMs = Number(msInput?.value) || DEFAULT_CONFIG.PIECE_MS;

  CONFIG = {
    ...CONFIG,
    LIB_URL: nextUrl || DEFAULT_CONFIG.LIB_URL,
    PIECE_MS: Math.max(1000, nextMs),
    OPTIONS: readLibraryOptions(),
  };
  saveSelectedPieceParams();
  saveConfig();
}

function applyConfigFromPanel() {
  commitPanelConfig();
  if (previewPieceName) {
    showPiece(previewPieceName);
  } else {
    startGallery();
  }
}

function scheduleAppearancePreview() {
  clearTimeout(appearancePreviewTimer);
  appearancePreviewTimer = setTimeout(() => {
    appearancePreviewTimer = null;
    commitPanelConfig();
    const activePiece = stage.querySelector("ascii-art");
    if (activePiece) showPiece(activePiece.getAttribute("piece"));
  }, 120);
}

function resetConfig() {
  CONFIG = {
    ...DEFAULT_CONFIG,
    PIECES: [...DEFAULT_AVAILABLE_PIECES],
    OPTIONS: { ...DEFAULT_LIBRARY_OPTIONS },
    PIECE_PARAMS: {},
  };
  saveConfig();
  renderConfigPanel();
  startGallery();
}

function renderConfigPanel() {
  if (!configPanel) return;

  const categoryOptions = LIBRARY_CATEGORIES.map(
    (category) =>
      `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>`,
  ).join("");
  const options = CONFIG.OPTIONS;
  const colorMode = options.colorMode || (options.mono ? "mono" : "palette");

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

    <nav class="panel-tabs" role="tablist" aria-label="Control panel sections">
      <button type="button" role="tab" id="tab-playlist" aria-controls="view-playlist" data-panel-tab="playlist">Playlist <span>${CONFIG.PIECES.length}</span></button>
      <button type="button" role="tab" id="tab-appearance" aria-controls="view-appearance" data-panel-tab="appearance">Appearance</button>
      <button type="button" role="tab" id="tab-library" aria-controls="view-library" data-panel-tab="library">Library</button>
    </nav>

    <div class="panel-views">
      <section id="view-playlist" class="panel-view" role="tabpanel" aria-labelledby="tab-playlist" data-panel-view="playlist">
        <div class="view-heading">
          <div><h3>Animation playlist</h3><p>Choose, preview, and order the show.</p></div>
          <div class="playlist-bulk-actions">
            <button type="button" class="text-button" data-action="select-all">Add all</button>
            <button type="button" class="text-button danger-text" data-action="clear-playlist" ${CONFIG.PIECES.length ? "" : "disabled"}>Clear playlist</button>
          </div>
        </div>

        <label>
          Category
          <select id="category-picker">
            <option value="">All categories</option>
            ${categoryOptions}
          </select>
        </label>
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

        <div class="playlist-controls">
          <button type="button" data-action="add-piece">Add to playlist</button>
        </div>

        <div class="list-heading"><h3>On the playlist</h3><span>${CONFIG.PIECES.length}</span></div>
        <div class="playlist-list">${playlistItems}</div>
      </section>

      <section id="view-appearance" class="panel-view" role="tabpanel" aria-labelledby="tab-appearance" data-panel-view="appearance" hidden>
        <div class="view-heading"><div><h3>Appearance</h3><p>Adjust how the artwork fills the screen.</p></div></div>
        <div class="form-grid">
          <label>Animation speed<input id="option-speed" type="number" min="0.1" step="0.1" value="${options.speed}" /></label>
          <label class="check-setting"><input id="option-fit-to-screen" type="checkbox" ${options.fitToScreen ? "checked" : ""} /> Fit artwork to screen</label>
          <label>Manual size (px)<input id="option-size" type="number" min="1" value="${options.size}" ${options.fitToScreen ? "disabled" : ""} /></label>
          <label>Background color<input id="option-bg" type="text" value="${escapeHtml(options.bg)}" placeholder="Piece default" /></label>
          <label>Character look
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
          <label>Custom characters<input id="option-chars" type="text" value="${escapeHtml(options.chars)}" placeholder="Example: .:-=+*#@" /></label>
        </div>

        <fieldset class="color-mode-fieldset">
          <legend>Art color</legend>
          <div class="color-mode-options">
            <label class="color-mode-option"><input type="radio" name="option-color-mode" value="palette" ${colorMode === "palette" ? "checked" : ""} /><span class="color-swatch palette-swatch"></span><span>Piece palette</span></label>
            <label class="color-mode-option"><input type="radio" name="option-color-mode" value="mono" ${colorMode === "mono" ? "checked" : ""} /><span class="color-swatch mono-swatch"></span><span>Monochrome</span></label>
            <label class="color-mode-option"><input type="radio" name="option-color-mode" value="brand" ${colorMode === "brand" ? "checked" : ""} /><span class="color-swatch brand-swatch"></span><span>Brand blue <code>#4b74ff</code></span></label>
          </div>
        </fieldset>

        <details class="advanced-settings">
          <summary>Advanced rendering</summary>
          <label class="range-setting">Contrast<input id="option-contrast" type="range" min="0" max="100" value="${options.contrast}" /><output for="option-contrast">${options.contrast}</output></label>
          <label class="range-setting">Dot size<input id="option-dot-size" type="range" min="25" max="120" value="${options.dotSize}" /><output for="option-dot-size">${options.dotSize}</output></label>
          <label class="range-setting">Dot density<input id="option-density" type="range" min="40" max="250" value="${options.density}" /><output for="option-density">${options.density}</output></label>
          <label>Halftone steps
            <select id="option-steps">
              <option value="" ${options.steps === "" ? "selected" : ""}>Piece default</option>
              <option value="0" ${String(options.steps) === "0" ? "selected" : ""}>Smooth</option>
              <option value="3" ${String(options.steps) === "3" ? "selected" : ""}>3 steps</option>
              <option value="5" ${String(options.steps) === "5" ? "selected" : ""}>5 steps</option>
            </select>
          </label>
          <label class="check-setting"><input id="option-still" type="checkbox" ${options.still ? "checked" : ""} /> Still frame</label>
          <label class="check-setting"><input id="option-all" type="checkbox" ${options.all ? "checked" : ""} /> Redraw text and line work</label>
        </details>
      </section>

      <section id="view-library" class="panel-view" role="tabpanel" aria-labelledby="tab-library" data-panel-view="library" hidden>
        <div class="view-heading"><div><h3>Library</h3><p>Playback behavior and local source.</p></div></div>
        <label>Time per animation (ms)<input id="piece-ms" type="number" min="1000" step="500" value="${CONFIG.PIECE_MS}" /></label>
        <label>Library script URL<input id="lib-url" type="text" value="${escapeHtml(CONFIG.LIB_URL)}" /></label>
        <div class="library-note">Animations and catalog are bundled locally for offline playback.</div>
      </section>

    </div>

    <footer class="panel-actions">
      <button type="button" data-action="apply">Apply settings</button>
      <button type="button" class="secondary" data-action="reset">Reset</button>
    </footer>
  `;

  const picker = configPanel.querySelector("#piece-picker");
  const categoryPicker = configPanel.querySelector("#category-picker");
  const searchInput = configPanel.querySelector("#piece-search");
  const fitToggle = configPanel.querySelector("#option-fit-to-screen");
  const sizeInput = configPanel.querySelector("#option-size");

  setActivePanelTab(activePanelTab);
  updatePieceOptions();
  const savePieceDraft = () => {
    saveSelectedPieceParams();
    saveConfig();
  };
  categoryPicker?.addEventListener("change", () => {
    savePieceDraft();
    updatePieceOptions();
  });
  searchInput?.addEventListener("input", () => {
    savePieceDraft();
    updatePieceOptions();
  });
  picker?.addEventListener("change", () => {
    savePieceDraft();
    renderPieceDetails();
    if (picker.value) {
      commitPanelConfig();
      previewPiece(picker.value);
    } else {
      startGallery();
    }
  });
  fitToggle?.addEventListener("change", () => {
    if (sizeInput) sizeInput.disabled = fitToggle.checked;
  });
  configPanel
    .querySelector('[data-action="add-piece"]')
    ?.addEventListener("click", () => {
      commitPanelConfig();
      addPieceToPlaylist(picker?.value);
    });

  configPanel.querySelectorAll('input[type="range"]').forEach((input) => {
    input.addEventListener("input", () => {
      const output = configPanel.querySelector(`output[for="${input.id}"]`);
      if (output) output.textContent = output.value = input.value;
    });
  });

  configPanel
    .querySelectorAll(
      '#view-appearance input:not([type="range"]), #view-appearance select',
    )
    .forEach((control) => {
      const eventName = control.matches(
        'input[type="text"], input[type="number"]',
      )
        ? "input"
        : "change";
      control.addEventListener(eventName, scheduleAppearancePreview);
    });

  configPanel
    .querySelector('[data-action="apply"]')
    ?.addEventListener("click", applyConfigFromPanel);
  configPanel
    .querySelector('[data-action="reset"]')
    ?.addEventListener("click", resetConfig);
  configPanel.onclick = (event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest("[data-panel-tab], [data-action]")
        : null;
    if (!target) return;

    if (target.dataset.panelTab) {
      setActivePanelTab(target.dataset.panelTab);
      return;
    }

    const index = Number(target.dataset.index ?? "-1");
    if (target.dataset.action === "close-panel") {
      toggleConfigPanel();
    } else if (target.dataset.action === "select-all") {
      CONFIG.PIECES = [...AVAILABLE_PIECES];
      saveConfig();
      renderConfigPanel();
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

function setActivePanelTab(tabName) {
  activePanelTab = tabName;
  configPanel.querySelectorAll("[data-panel-tab]").forEach((tab) => {
    const selected = tab.dataset.panelTab === tabName;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  configPanel.querySelectorAll("[data-panel-view]").forEach((view) => {
    const selected = view.dataset.panelView === tabName;
    view.hidden = !selected;
    view.setAttribute("aria-hidden", String(!selected));
  });
}

function updatePieceOptions() {
  const picker = document.getElementById("piece-picker");
  if (!picker) return;

  const category = document.getElementById("category-picker")?.value || "";
  const query = (document.getElementById("piece-search")?.value || "")
    .trim()
    .toLowerCase();
  const numericQuery = query.match(/^#?(\d+)$/);
  const requestedIndex = numericQuery ? Number(numericQuery[1]) : null;
  const current = picker.value;
  const filtered = PIECE_CATALOG.filter((piece, index) => {
    if (category && piece.category !== category) return false;
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
  const category = LIBRARY_CATEGORIES.find(
    (item) => item.id === piece.category,
  );
  details.innerHTML = `
    <strong>${escapeHtml(category?.name || "Animation")}</strong>
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
  if (isCanvasPattern(pieceName)) {
    showCanvasPattern(pieceName);
    return;
  }

  const el = document.createElement("ascii-art");
  const options = CONFIG.OPTIONS || DEFAULT_LIBRARY_OPTIONS;
  const size = options.fitToScreen
    ? getFittedPieceSize(pieceName)
    : options.size;
  const background = options.bg;
  const colorMode = options.colorMode || (options.mono ? "mono" : "palette");
  stage.style.background = background;
  el.setAttribute("piece", pieceName);
  el.setAttribute("speed", String(options.speed));
  el.setAttribute("size", String(size));
  if (background) el.setAttribute("bg", background);
  if (options.still) el.setAttribute("still", "");
  if (options.look) el.setAttribute("look", options.look);
  if (options.chars) el.setAttribute("chars", options.chars);
  if (colorMode === "mono") el.setAttribute("mono", "");
  if (colorMode === "brand") {
    el.setAttribute("brand", "");
    el.style.color = BRAND_COLOR;
  }
  if (options.all) el.setAttribute("all", "");
  if (options.contrast !== "") {
    el.setAttribute("contrast", String(options.contrast));
  }
  if (options.dotSize !== "") {
    el.setAttribute("dot-size", String(options.dotSize));
  }
  if (options.density !== "") {
    el.setAttribute("density", String(options.density));
  }
  if (options.steps !== "") el.setAttribute("steps", String(options.steps));
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
  return isAsciitopiaPiece(pieceName) || isGenerativePiece(pieceName);
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
  stage.style.background = CONFIG.OPTIONS.bg || "";
  stage.appendChild(canvas);

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(stage.clientWidth * pixelRatio);
  canvas.height = Math.round(stage.clientHeight * pixelRatio);
  patternEngine = new CanvasEngine(canvas, {
    font: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: (CONFIG.OPTIONS.fitToScreen ? 16 : CONFIG.OPTIONS.size) * pixelRatio,
  });
  const pattern = isAsciitopiaPiece(pieceName)
    ? createAsciitopiaPattern(pieceName)
    : createGenerativePattern(pieceName);
  patternEngine.setPattern(
    scalePatternSpeed(pattern, CONFIG.OPTIONS.speed),
  );
  patternEngine.start();
}

function getFittedPieceSize(pieceName) {
  const piece = PIECE_CATALOG.find((item) => item.slug === pieceName);
  if (!piece?.cols || !piece?.rows) return CONFIG.OPTIONS.size;

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
  const widthSize = (availableWidth * 0.94) / (piece.cols * cellWidth);
  const heightSize =
    (availableHeight * 0.94) / (piece.rows * cellWidth * cellAspect);
  return Math.max(1, Math.floor(Math.min(widthSize, heightSize) * 10) / 10);
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
  stage.style.background = CONFIG.OPTIONS.bg || "";

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
    LIBRARY_CATEGORIES = Array.isArray(catalog.categories)
      ? catalog.categories
      : [];
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
    LIBRARY_CATEGORIES = [];
  }

  const additionalPieces = [...ASCIITOPIA_PIECES, ...GENERATIVE_PIECES];
  const existingPieceSlugs = new Set(PIECE_CATALOG.map((piece) => piece.slug));
  PIECE_CATALOG.push(
    ...additionalPieces.filter((piece) => !existingPieceSlugs.has(piece.slug)),
  );
  const additionalCategories = [
    { id: "asciitopia", name: "Asciitopia" },
    { id: "generative", name: "Generative art" },
  ];
  const existingCategoryIds = new Set(
    LIBRARY_CATEGORIES.map((category) => category.id),
  );
  LIBRARY_CATEGORIES.push(
    ...additionalCategories.filter(
      (category) => !existingCategoryIds.has(category.id),
    ),
  );
  AVAILABLE_PIECES = PIECE_CATALOG.map((piece) => piece.slug);

  loadSavedConfig();
  CONFIG.PIECES = sanitizePieceList(CONFIG.PIECES);
  renderConfigPanel();
  startGallery();
}

init();
