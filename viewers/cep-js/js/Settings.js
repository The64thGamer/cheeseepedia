const STORAGE_KEY  = 'cep-theme';
const CUSTOM_KEY   = 'cep-theme-custom';
const WIDE_KEY     = 'cep-wide';

export const THEMES = [
  'standard','dark','light','classic','funnet','showbiz',
  'fnaf','pasqually','winter','halloween','pride','anniversary',
];

const CSS_VARS = [
  { key: '--background', label: 'Background' },
  { key: '--text',       label: 'Text'        },
  { key: '--primary',    label: 'Primary'     },
  { key: '--secondary',  label: 'Secondary'   },
  { key: '--good-link',  label: 'Good Link'   },
  { key: '--bad-link',   label: 'Bad Link'    },
  { key: '--distant',    label: 'Distant'     },
  { key: '--dark',       label: 'Dark'        },
];

const FONTS = [
  'Aleo','RockoFLF','Stalker','Sylvar','Octobre','Unutterable',
  'sans-serif','serif','monospace',
];

const LOGOS = [
  'CEPLogo.avif','LogoDark.avif','LogoLight.avif','LogoClassic.avif',
  'LogoFunNet.avif','LogoFunNetLow.avif','LogoShowBiz.avif','LogoFNaF.avif',
  'LogoPasqually.avif','LogoWinter.avif','LogoHalloween.avif','LogoPride.avif',
  'LogoAnniversary.avif',
];

// Default custom values — used only if no saved custom exists yet
const CUSTOM_DEFAULTS = {
  '--background': '#233355',
  '--text':       '#dbd1b1',
  '--primary':    '#e0961f',
  '--secondary':  '#D44A02',
  '--good-link':  '#39A481',
  '--bad-link':   '#D44A02',
  '--distant':    '#993b08',
  '--dark':       '#2c2422',
  '--font-body':    'Aleo',
  '--font-display': 'RockoFLF',
};

// ── Theme + wide application ──────────────────────────────────────────────────
export function applyTheme(theme, custom = null) {
  const root = document.documentElement;
  CSS_VARS.forEach(({key}) => root.style.removeProperty(key));
  root.style.removeProperty('--font-body');
  root.style.removeProperty('--font-display');

  if(theme === 'custom' && custom) {
    root.removeAttribute('data-theme');
    Object.entries(custom).forEach(([k, v]) => root.style.setProperty(k, v));
  } else {
    if(theme === 'standard') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }
}

export function applyWide(wide) {
  document.documentElement.toggleAttribute('data-wide', !!wide);
}

export function loadSavedTheme() {
  const theme  = localStorage.getItem(STORAGE_KEY) || 'standard';
  const custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || 'null');
  applyTheme(theme, custom);
  applyWide(localStorage.getItem(WIDE_KEY) === '1');
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toHex(color) {
  if(!color) return '#000000';
  color = color.replace(/['"]/g, '').trim();
  if(/^#[0-9a-f]{6}$/i.test(color)) return color;
  if(/^#[0-9a-f]{8}$/i.test(color)) return '#' + color.slice(1, 7);
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    const c = ctx.fillStyle;
    return /^#[0-9a-f]{6}$/i.test(c) ? c : '#000000';
  } catch { return '#000000'; }
}

// ── Page init ─────────────────────────────────────────────────────────────────
export function initSettings(app) {
  const root = app.querySelector('#SettingsRoot') || app.querySelector('.Body');
  if(!root) return;

  const currentTheme = localStorage.getItem(STORAGE_KEY) || 'standard';
  const isWide       = localStorage.getItem(WIDE_KEY) === '1';

  // Custom values are always sourced from saved custom — never from the
  // currently active preset. This ensures switching presets and back never
  // overwrites what the user built.
  const savedCustom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || 'null') || CUSTOM_DEFAULTS;
  const customValues = { ...savedCustom };
  // Ensure all keys exist
  CSS_VARS.forEach(({key}) => {
    if(!customValues[key]) customValues[key] = toHex(CUSTOM_DEFAULTS[key] || '#000000');
    else customValues[key] = toHex(customValues[key]);
  });
  if(!customValues['--font-body'])    customValues['--font-body']    = CUSTOM_DEFAULTS['--font-body'];
  if(!customValues['--font-display']) customValues['--font-display'] = CUSTOM_DEFAULTS['--font-display'];
  if(!customValues['--logo'])         customValues['--logo']         = 'CEPLogo.avif';

  const persist = () => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customValues));
  };

  root.innerHTML = '';

  // Title
  const titleEl = document.createElement('h1');
  titleEl.className = 'SettingsTitle';
  titleEl.textContent = 'Settings';
  root.appendChild(titleEl);

  // ── Theme section ───────────────────────────────────────────────────────────
  const themeSection = document.createElement('div');
  themeSection.className = 'SettingsSection';

  const themeSectionTitle = document.createElement('h2');
  themeSectionTitle.className = 'SettingsSectionTitle';
  themeSectionTitle.textContent = 'Theme';
  themeSection.appendChild(themeSectionTitle);

  // Theme dropdown
  const dropRow = document.createElement('div');
  dropRow.className = 'SettingsRow';
  const dropLabel = document.createElement('label');
  dropLabel.className = 'SettingsLabel';
  dropLabel.textContent = 'Theme';
  const select = document.createElement('select');
  select.className = 'SettingsSelect';
  [...THEMES, 'custom'].forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    opt.selected = t === currentTheme;
    select.appendChild(opt);
  });
  dropRow.appendChild(dropLabel);
  dropRow.appendChild(select);
  themeSection.appendChild(dropRow);

  // ── Custom builder panel ────────────────────────────────────────────────────
  const customPanel = document.createElement('div');
  customPanel.className = 'SettingsCustomPanel';
  customPanel.style.display = currentTheme === 'custom' ? 'block' : 'none';

  // Color grid
  const colorGrid = document.createElement('div');
  colorGrid.className = 'SettingsColorGrid';

  CSS_VARS.forEach(({key, label}) => {
    const cell = document.createElement('div');
    cell.className = 'SettingsColorCell';

    const lbl = document.createElement('label');
    lbl.className = 'SettingsColorLabel';
    lbl.textContent = label;

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.className = 'SettingsColorPicker';
    picker.value = customValues[key];

    picker.addEventListener('input', () => {
      customValues[key] = picker.value;
      applyTheme('custom', customValues);
      persist();
    });

    cell.appendChild(lbl);
    cell.appendChild(picker);
    colorGrid.appendChild(cell);
  });

  customPanel.appendChild(colorGrid);

  // Font selectors
  const fontRow = document.createElement('div');
  fontRow.className = 'SettingsFontRow';

  [
    { key: '--font-body',    label: 'Body Font'    },
    { key: '--font-display', label: 'Display Font' },
  ].forEach(({key, label}) => {
    const cell = document.createElement('div');
    cell.className = 'SettingsFontCell';

    const lbl = document.createElement('label');
    lbl.className = 'SettingsLabel';
    lbl.textContent = label;

    const sel = document.createElement('select');
    sel.className = 'SettingsSelect';
    const currentFont = (customValues[key] || '').replace(/['"]/g,'').trim();
    FONTS.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f;
      opt.textContent = f;
      opt.selected = currentFont === f;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', () => {
      customValues[key] = sel.value;
      applyTheme('custom', customValues);
      persist();
    });

    cell.appendChild(lbl);
    cell.appendChild(sel);
    fontRow.appendChild(cell);
  });

  customPanel.appendChild(fontRow);

  // Logo picker
  const logoRow = document.createElement('div');
  logoRow.className = 'SettingsRow';
  const logoLabel = document.createElement('label');
  logoLabel.className = 'SettingsLabel';
  logoLabel.textContent = 'Logo';
  const logoSel = document.createElement('select');
  logoSel.className = 'SettingsSelect';
  LOGOS.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f.replace('.avif','').replace('Logo','');
    opt.selected = customValues['--logo'] === f;
    logoSel.appendChild(opt);
  });
  logoSel.addEventListener('change', () => {
    customValues['--logo'] = logoSel.value;
    // Update logo img immediately
    const logoEl = document.querySelector('.Logo img');
    if(logoEl) logoEl.src = '/viewers/cep-js/assets/Logos/' + logoSel.value;
    persist();
  });
  logoRow.appendChild(logoLabel);
  logoRow.appendChild(logoSel);
  customPanel.appendChild(logoRow);

  themeSection.appendChild(customPanel);

  // Theme dropdown change — never touches customValues
  select.addEventListener('change', () => {
    const val = select.value;
    localStorage.setItem(STORAGE_KEY, val);
    if(val === 'custom') {
      applyTheme('custom', customValues);
      customPanel.style.display = 'block';
    } else {
      applyTheme(val);
      customPanel.style.display = 'none';
    }
    // Update logo to match new theme
    const LOGOS = {
      'standard':'CEPLogo.avif','dark':'LogoDark.avif','light':'LogoLight.avif',
      'classic':'LogoClassic.avif','funnet':'LogoFunNet.avif','showbiz':'LogoShowBiz.avif',
      'fnaf':'LogoFNaF.avif','pasqually':'LogoPasqually.avif','winter':'LogoWinter.avif',
      'halloween':'LogoHalloween.avif','pride':'LogoPride.avif','anniversary':'LogoAnniversary.avif',
    };
    const logoWrap = app.querySelector('.Logo') || document.querySelector('.Logo');
    if(logoWrap) {
      let img = logoWrap.querySelector('img');
      if(!img){ img = document.createElement('img'); logoWrap.appendChild(img); }
      const logoFile = val === 'custom'
        ? (customValues['--logo'] || 'CEPLogo.avif')
        : (LOGOS[val] || 'CEPLogo.avif');
      img.src = '/viewers/cep-js/assets/Logos/' + logoFile;
    }
  });

  root.appendChild(themeSection);

  // ── Layout section ──────────────────────────────────────────────────────────
  const layoutSection = document.createElement('div');
  layoutSection.className = 'SettingsSection';

  const layoutTitle = document.createElement('h2');
  layoutTitle.className = 'SettingsSectionTitle';
  layoutTitle.textContent = 'Layout';
  layoutSection.appendChild(layoutTitle);

  const wideRow = document.createElement('div');
  wideRow.className = 'SettingsRow';

  const wideLabel = document.createElement('label');
  wideLabel.className = 'SettingsLabel';
  wideLabel.textContent = 'Wide Pages';

  const wideToggle = document.createElement('input');
  wideToggle.type = 'checkbox';
  wideToggle.className = 'SettingsToggle';
  wideToggle.checked = isWide;

  wideToggle.addEventListener('change', () => {
    const wide = wideToggle.checked;
    localStorage.setItem(WIDE_KEY, wide ? '1' : '0');
    applyWide(wide);
  });

  wideRow.appendChild(wideLabel);
  wideRow.appendChild(wideToggle);
  layoutSection.appendChild(wideRow);
  root.appendChild(layoutSection);
}