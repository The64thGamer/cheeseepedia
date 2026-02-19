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
  const EVENT_CHANCE = 0.0005; // Probability per frame (~1 every 3-4 seconds at 60fps)
  
  // Camera panning settings
  const PAN_DURATION = 8000; // milliseconds to pan
  const PAUSE_DURATION = 2000; // millisecond pause at each end
  const LEFT_POSITION = -16; // Left X position in %
  const RIGHT_POSITION = 0; // Right X position in %
  
  const fnafWrap = document.getElementById('fnaf_wrap');
  const fnafBackground = document.getElementById('fnaf_background');
  const fnafStatic = document.getElementById('fnaf_static');
  
  if (!fnafWrap || !fnafBackground || !fnafStatic) return null;
  
  let currentOpacity = MIN_OPACITY;
  let targetOpacity = MIN_OPACITY;
  let isRunning = false;
  
  // Camera pan state
  let panStartTime = 0;
  let currentPanState = 'paused-left'; // 'paused-left', 'panning-right', 'paused-right', 'panning-left'
  let panPosition = LEFT_POSITION; // Start at left
  
  // Set random background on load
  function setRandomBackground() {
    const randomBg = Math.floor(Math.random() * BACKGROUND_COUNT);
    fnafBackground.style.backgroundImage = `url('/UI/Backgrounds/${randomBg}.avif')`;
  }
  
  // Update camera pan position
  function updateCameraPan() {
    const now = Date.now();
    const elapsed = now - panStartTime;
    
    if (currentPanState === 'paused-left') {
      panPosition = LEFT_POSITION;
      if (elapsed >= PAUSE_DURATION) {
        currentPanState = 'panning-right';
        panStartTime = now;
      }
    } else if (currentPanState === 'panning-right') {
      const progress = Math.min(elapsed / PAN_DURATION, 1);
      panPosition = LEFT_POSITION + (progress * (RIGHT_POSITION - LEFT_POSITION));
      if (progress >= 1) {
        currentPanState = 'paused-right';
        panStartTime = now;
      }
    } else if (currentPanState === 'paused-right') {
      panPosition = RIGHT_POSITION;
      if (elapsed >= PAUSE_DURATION) {
        currentPanState = 'panning-left';
        panStartTime = now;
      }
    } else if (currentPanState === 'panning-left') {
      const progress = Math.min(elapsed / PAN_DURATION, 1);
      panPosition = RIGHT_POSITION - (progress * (RIGHT_POSITION - LEFT_POSITION));
      if (progress >= 1) {
        currentPanState = 'paused-left';
        panStartTime = now;
      }
    }
    
    fnafBackground.style.transform = `translateX(${panPosition}%)`;
  }
  
  // Randomize static position
  function randomizeStaticPosition() {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    fnafStatic.style.backgroundPosition = `${x}% ${y}%`;
  }
  
  // Random opacity change
  function updateOpacity() {
    if (Math.random() < 0.01) {
      targetOpacity = MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY);
    }
    currentOpacity += (targetOpacity - currentOpacity) * 0.05;
    fnafStatic.style.opacity = currentOpacity;
  }
  
  // Random "event" - flash static and change background
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
  
  // Animation loop
  function animate() {
    if (!isRunning) return;
    updateCameraPan();
    randomizeStaticPosition();
    updateOpacity();
    checkForEvent();
    fnafAnimationId = requestAnimationFrame(animate);
  }
  
  return {
    start: function() {
      if (isRunning) return;
      isRunning = true;
      fnafWrap.style.display = 'block';
      setRandomBackground();
      fnafStatic.style.opacity = MIN_OPACITY;
      panStartTime = Date.now();
      currentPanState = 'paused-left';
      panPosition = LEFT_POSITION;
      animate();
    },
    stop: function() {
      isRunning = false;
      fnafWrap.style.display = 'none';
      if (fnafAnimationId) {
        cancelAnimationFrame(fnafAnimationId);
        fnafAnimationId = null;
      }
    }
  };
})();

function updateLogo(theme) {
  const logo = document.getElementById("mainLogo");
  if (logo && logoMap[theme]) {
    logo.src = logoMap[theme];
  }
}

function updateThemeEffects(theme) {
  if (currentTheme === 'winter') updateSnow(null);
  if (currentTheme === 'fnaf' && FNaFCamera) FNaFCamera.stop();
  
  currentTheme = theme;
  
  if (theme === 'winter') {
    updateSnow(theme);
  } else if (theme === 'fnaf' && FNaFCamera) {
    FNaFCamera.start();
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "standard") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  updateLogo(theme);
  updateThemeEffects(theme);
}

function applyPageWidth(width) {
  const root = document.documentElement;
  if (width === "default") {
    root.removeAttribute("data-width");
  } else {
    root.setAttribute("data-width", width);
  }
}

function applyDateBasedTheme() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  if (month === 10) return "halloween";
  if (month === 6 || month === 7) return "pride";
  if (month === 5 && date === 17) return "anniversary";
  if (month === 12) return "winter";

  return null;
}

function determineActiveTheme() {
  const selectedTheme = document.getElementById('colorThemeSelector').value;
  const eventSelection = document.getElementById('eventThemeSelector').value;
  
  let themeToApply = selectedTheme;
  
  if (eventSelection === "auto") {
    const seasonalTheme = applyDateBasedTheme();
    if (seasonalTheme) themeToApply = seasonalTheme;
  }
  
  return themeToApply;
}

// Settings modal
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');

settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeSettings.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) settingsModal.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && settingsModal.style.display === 'flex') {
    settingsModal.style.display = 'none';
  }
});

// Color theme selector
document.getElementById('colorThemeSelector').addEventListener('change', function () {
  const themeToApply = determineActiveTheme();
  applyTheme(themeToApply);
  localStorage.setItem('selectedColorTheme', this.value);
});

// Event selector
document.getElementById('eventThemeSelector').addEventListener('change', function () {
  const themeToApply = determineActiveTheme();
  applyTheme(themeToApply);
  localStorage.setItem('eventThemeSetting', this.value);
});

// Page width selector
document.getElementById('pageWidthSelector').addEventListener('change', function () {
  applyPageWidth(this.value);
  localStorage.setItem('pageWidth', this.value);
});

// Contributor username field — saves on every keystroke
document.getElementById('contributorUsername').addEventListener('input', function () {
  const val = this.value.trim();
  if (val) {
    localStorage.setItem('cheeseepedia_username', val);
  } else {
    localStorage.removeItem('cheeseepedia_username');
  }
});

// Initial load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('selectedColorTheme') || "standard";
  const savedEvent = localStorage.getItem('eventThemeSetting') || "auto";
  const savedWidth = localStorage.getItem('pageWidth') || "default";
  const savedUsername = localStorage.getItem('cheeseepedia_username') || "";

  document.getElementById('colorThemeSelector').value = savedTheme;
  document.getElementById('eventThemeSelector').value = savedEvent;
  document.getElementById('pageWidthSelector').value = savedWidth;
  document.getElementById('contributorUsername').value = savedUsername;

  const themeToApply = determineActiveTheme();
  applyTheme(themeToApply);
  applyPageWidth(savedWidth);
});
