const logoMap = {
  "standard": "/UI/CEPLogo.avif",
  "dark": "/UI/LogoDark.avif",
  "light": "/UI/LogoLight.avif",
  "classic": "/UI/LogoClassic.avif",
  "showbiz": "/UI/LogoShowBiz.avif",
  "fnaf": "/UI/LogoFNaF.avif",
  "funnet": "/UI/LogoFunNetLow.avif",
  "anniversary": "/UI/LogoAnniversary.avif",
  "halloween": "/UI/LogoHalloween.avif",
  "pride": "/UI/LogoPride.avif",
  "winter": "/UI/LogoWinter.avif",
  "pasqually": "/UI/LogoPasqually.avif"
};

// Prevents programmatic .value assignments from triggering change listeners
let isProgrammaticChange = false;

// Theme effect manager
let currentTheme = null;
let fnafAnimationId = null;

// Snow effect handler
function updateSnow(theme) {
  const snowContainer = document.getElementById("snow_wrap");
  if (!snowContainer) return;
  snowContainer.style.display = (theme === "winter") ? "block" : "none";
}

// FNaF Camera System
const FNaFCamera = (function() {
  const BACKGROUND_COUNT = 52;
  const MIN_OPACITY = 0.5;
  const MAX_OPACITY = 0.7;
  const EVENT_CHANCE = 0.0005;
  const PAN_DURATION = 8000;
  const PAUSE_DURATION = 2000;
  const LEFT_POSITION = -16;
  const RIGHT_POSITION = 0;

  const fnafWrap       = document.getElementById('fnaf_wrap');
  const fnafBackground = document.getElementById('fnaf_background');
  const fnafStatic     = document.getElementById('fnaf_static');

  if (!fnafWrap || !fnafBackground || !fnafStatic) return null;

  let currentOpacity = MIN_OPACITY;
  let targetOpacity  = MIN_OPACITY;
  let isRunning      = false;
  let panStartTime   = 0;
  let currentPanState = 'paused-left';
  let panPosition    = LEFT_POSITION;

  function setRandomBackground() {
    const randomBg = Math.floor(Math.random() * BACKGROUND_COUNT);
    fnafBackground.style.backgroundImage = `url('/UI/Backgrounds/${randomBg}.avif')`;
  }

  function updateCameraPan() {
    const now     = Date.now();
    const elapsed = now - panStartTime;
    if (currentPanState === 'paused-left') {
      panPosition = LEFT_POSITION;
      if (elapsed >= PAUSE_DURATION) { currentPanState = 'panning-right'; panStartTime = now; }
    } else if (currentPanState === 'panning-right') {
      const p = Math.min(elapsed / PAN_DURATION, 1);
      panPosition = LEFT_POSITION + (p * (RIGHT_POSITION - LEFT_POSITION));
      if (p >= 1) { currentPanState = 'paused-right'; panStartTime = now; }
    } else if (currentPanState === 'paused-right') {
      panPosition = RIGHT_POSITION;
      if (elapsed >= PAUSE_DURATION) { currentPanState = 'panning-left'; panStartTime = now; }
    } else if (currentPanState === 'panning-left') {
      const p = Math.min(elapsed / PAN_DURATION, 1);
      panPosition = RIGHT_POSITION - (p * (RIGHT_POSITION - LEFT_POSITION));
      if (p >= 1) { currentPanState = 'paused-left'; panStartTime = now; }
    }
    fnafBackground.style.transform = `translateX(${panPosition}%)`;
  }

  function randomizeStaticPosition() {
    fnafStatic.style.backgroundPosition = `${Math.random()*100}% ${Math.random()*100}%`;
  }

  function updateOpacity() {
    if (Math.random() < 0.01) targetOpacity = MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY);
    currentOpacity += (targetOpacity - currentOpacity) * 0.05;
    fnafStatic.style.opacity = currentOpacity;
  }

  function checkForEvent() {
    if (Math.random() < EVENT_CHANCE) {
      fnafStatic.style.transition = 'opacity 0.05s';
      fnafStatic.style.opacity = '1';
      setRandomBackground();
      setTimeout(() => {
        fnafStatic.style.transition = 'opacity 0.5s';
        currentOpacity = targetOpacity;
        fnafStatic.style.opacity = currentOpacity;
      }, 50);
    }
  }

  function animate() {
    if (!isRunning) return;
    updateCameraPan();
    randomizeStaticPosition();
    updateOpacity();
    checkForEvent();
    fnafAnimationId = requestAnimationFrame(animate);
  }

  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      fnafWrap.style.display = 'block';
      setRandomBackground();
      fnafStatic.style.opacity = MIN_OPACITY;
      panStartTime    = Date.now();
      currentPanState = 'paused-left';
      panPosition     = LEFT_POSITION;
      animate();
    },
    stop() {
      isRunning = false;
      fnafWrap.style.display = 'none';
      if (fnafAnimationId) { cancelAnimationFrame(fnafAnimationId); fnafAnimationId = null; }
    }
  };
})();

function updateLogo(theme) {
  const logo = document.getElementById("mainLogo");
  if (logo && logoMap[theme]) logo.src = logoMap[theme];
}

function updateThemeEffects(theme) {
  if (currentTheme === 'winter') updateSnow(null);
  if (currentTheme === 'fnaf' && FNaFCamera) FNaFCamera.stop();
  currentTheme = theme;
  if (theme === 'winter') updateSnow(theme);
  else if (theme === 'fnaf' && FNaFCamera) FNaFCamera.start();
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "standard") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  updateLogo(theme);
  updateThemeEffects(theme);
}

function applyPageWidth(width) {
  const root = document.documentElement;
  if (width === "default") root.removeAttribute("data-width");
  else root.setAttribute("data-width", width);
}

function applyDateBasedTheme() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date  = today.getDate();
  if (month === 10) return "halloween";
  if (month === 6 || month === 7) return "pride";
  if (month === 5 && date === 17) return "anniversary";
  if (month === 12) return "winter";
  return null;
}

function getDefaultThemeForPage() {
  return window.location.pathname.includes("theoryweb") ? "fnaf" : "standard";
}

function determineActiveTheme() {
  const selectedTheme = document.getElementById('colorThemeSelector').value;
  const eventSelection = document.getElementById('eventThemeSelector').value;

  if (selectedTheme === "cep") return "standard";

  let themeToApply = selectedTheme === "standard"
    ? getDefaultThemeForPage()
    : selectedTheme;

  if (eventSelection === "auto") {
    const seasonalTheme = applyDateBasedTheme();
    if (seasonalTheme) themeToApply = seasonalTheme;
  }
  return themeToApply;
}

// ─── SETTINGS MODAL ───────────────────────────────────────────────────────────

const settingsButton = document.getElementById('settingsButton');
const settingsModal  = document.getElementById('settingsModal');
const closeSettings  = document.getElementById('closeSettings');

settingsButton.addEventListener('click', () => { settingsModal.style.display = 'flex'; });
closeSettings.addEventListener('click',  () => { settingsModal.style.display = 'none'; });
settingsModal.addEventListener('click',  (e) => { if (e.target === settingsModal) settingsModal.style.display = 'none'; });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && settingsModal.style.display === 'flex') settingsModal.style.display = 'none';
});

// ─── THEME & WIDTH SELECTORS ──────────────────────────────────────────────────

document.getElementById('colorThemeSelector').addEventListener('change', function () {
  if (isProgrammaticChange) return;
  applyTheme(determineActiveTheme());
  localStorage.setItem('selectedColorTheme', this.value);
});

document.getElementById('eventThemeSelector').addEventListener('change', function () {
  if (isProgrammaticChange) return;
  applyTheme(determineActiveTheme());
  localStorage.setItem('eventThemeSetting', this.value);
});

document.getElementById('pageWidthSelector').addEventListener('change', function () {
  if (isProgrammaticChange) return;
  applyPageWidth(this.value);
  localStorage.setItem('pageWidth', this.value);
});

document.getElementById('contributorUsername').addEventListener('input', function () {
  const val = this.value.trim();
  if (val) localStorage.setItem('cheeseepedia_username', val);
  else     localStorage.removeItem('cheeseepedia_username');
});

// ─── GITHUB TOKEN (sessionStorage only) ──────────────────────────────────────
//
// Security rationale: GitHub tokens are credentials. We store them in
// sessionStorage rather than localStorage so they are automatically cleared
// when the browser tab is closed, and are never written to persistent disk
// storage by the browser. sessionStorage is scoped to the exact origin and
// tab, so it cannot be read by other tabs or sites.
// We never log, transmit, or embed the token anywhere except the Octokit
// Authorization header when the user explicitly triggers a save/PR action.

const TOKEN_SESSION_KEY = 'cheeseepedia_github_token';

const githubTokenInput  = document.getElementById('githubTokenInput');
const githubTokenStatus = document.getElementById('githubTokenStatus');
const clearTokenBtn     = document.getElementById('clearGithubToken');

function refreshTokenUI() {
  const has = !!sessionStorage.getItem(TOKEN_SESSION_KEY);
  if (githubTokenInput) {
    githubTokenInput.placeholder = has
      ? '●●●●●●●●●●●● (active for this session)'
      : 'Paste GitHub Personal Access Token (Classic)';
  }
  if (githubTokenStatus) {
    githubTokenStatus.textContent = has ? '✅ Token active — clears when tab closes' : '';
    githubTokenStatus.style.color = has ? 'var(--aqua)' : '';
  }
}

if (githubTokenInput) {
  refreshTokenUI();

  githubTokenInput.addEventListener('input', function () {
    const val = this.value.trim();
    if (val.length > 10) {
      sessionStorage.setItem(TOKEN_SESSION_KEY, val);
      this.value = ''; // clear the visible field immediately after saving
      refreshTokenUI();
    }
  });
}

if (clearTokenBtn) {
  clearTokenBtn.addEventListener('click', () => {
    sessionStorage.removeItem(TOKEN_SESSION_KEY);
    if (githubTokenInput) githubTokenInput.value = '';
    refreshTokenUI();
    if (githubTokenStatus) {
      githubTokenStatus.textContent = '🗑 Token cleared';
      githubTokenStatus.style.color = 'var(--yellow)';
      setTimeout(() => refreshTokenUI(), 2000);
    }
  });
}

// ─── DOMContentLoaded ─────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme    = localStorage.getItem('selectedColorTheme') || "standard";
  const savedEvent    = localStorage.getItem('eventThemeSetting')  || "auto";
  const savedWidth    = localStorage.getItem('pageWidth')           || "default";
  const savedUsername = localStorage.getItem('cheeseepedia_username') || "";

  isProgrammaticChange = true;
  document.getElementById('colorThemeSelector').value  = savedTheme;
  document.getElementById('eventThemeSelector').value  = savedEvent;
  document.getElementById('pageWidthSelector').value   = savedWidth;
  document.getElementById('contributorUsername').value = savedUsername;
  isProgrammaticChange = false;

  // Pre-seed currentTheme to what the inline head script already applied,
  // so updateThemeEffects doesn't redundantly stop/start effects on first load,
  // but still runs logo/camera/snow side-effects via applyTheme.
  currentTheme = window.__initialTheme || determineActiveTheme();
  applyTheme(determineActiveTheme());
  applyPageWidth(savedWidth);
});