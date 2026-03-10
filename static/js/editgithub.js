(async function () {
  while (!window.editorLibsReady || !window.toastui || !window.OctokitClass) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const { Editor } = window.toastui;

  const currentPageTitle      = window.EDITOR_CONFIG.pageTitle;
  // Hugo's jsonify may produce a string instead of an array if tags is a
  // single scalar value in the front matter, so always normalise to a proper JS array.
  const currentPageTags = (() => {
    const raw = window.EDITOR_CONFIG.pageTags;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [p]; } catch (_) {}
      return [raw];
    }
    return [String(raw)];
  })();
  const isNewPage             = window.EDITOR_CONFIG.isNewPage || false;
  const isTheoryweb           = window.location.pathname.includes('theoryweb');

  // Hugo supplies the exact source file path (e.g. "wiki/Chuck-E-Cheese-Winter-2025-Show.md")
  // so casing always matches the real file regardless of the URL slug.
  const sourceFilePath = window.EDITOR_CONFIG.sourceFilePath || '';

  const currentPagePath = sourceFilePath
    ? ('content/' + sourceFilePath)
    : (() => { let p = 'content' + window.location.pathname; if (p.endsWith('/')) p = p.slice(0, -1); return p + '.md'; })();

  // Fetch the raw markdown via the Hugo-known path so casing is always correct.
  const markdownUrl = sourceFilePath
    ? ('/' + sourceFilePath)
    : (() => { let u = window.location.pathname; if (u.endsWith('/')) u = u.slice(0, -1); return u + '.md'; })();

  const GITHUB_OWNER  = 'The64thGamer';
  const GITHUB_REPO   = 'cheeseepedia';
  const GITHUB_BRANCH = 'main';
  const USERNAME_KEY  = 'cheeseepedia_username';
  const TOKEN_KEY     = 'cheeseepedia_github_token';

  let editor              = null;
  let octokit             = null;
  let userLogin           = '';
  let originalFrontmatter = '';
  let parsedFM            = {};

  // ─── NEW PAGE STATE ────────────────────────────────────────────────────────
  let newPageTitle     = '';
  let newPageTag       = '';
  let newPageStartDate = '';

  // ─── TOKEN / AUTH ─────────────────────────────────────────────────────────

  function getToken() { return sessionStorage.getItem(TOKEN_KEY) || ''; }

  async function ensureOctokit() {
    if (octokit) return true;
    const token = getToken();
    if (!token) {
      alert('No GitHub token found.\n\nOpen ⚙ Settings (bottom right) and paste your GitHub Personal Access Token.');
      return false;
    }
    try {
      const kit = new OctokitClass({ auth: token });
      const { data: user } = await kit.rest.users.getAuthenticated();
      octokit   = kit;
      userLogin = user.login;
      return true;
    } catch (e) {
      alert('GitHub token is invalid or expired: ' + e.message + '\n\nUpdate it in ⚙ Settings.');
      return false;
    }
  }

  function refreshTokenNotice() {
    const notice = document.getElementById('no-token-notice');
    if (notice) notice.style.display = getToken() ? 'none' : 'block';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshTokenNotice);
  } else {
    refreshTokenNotice();
  }
  document.getElementById('closeSettings')?.addEventListener('click', refreshTokenNotice);

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  function toTomlStr(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }
  function safeTitle(str) {
    return toTomlStr(String(str).replace(/^"+|"+$/g, ''));
  }

  function parseFrontmatter(markdown) {
    // Normalize line endings so CRLF files don't break the regex
    const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const match = normalized.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?([\s\S]*)$/);
    if (match) return { frontmatter: match[1].trim(), content: match[2] };
    return { frontmatter: '', content: normalized };
  }

  function parseTOML(text) {
    const result = {};
    const lines  = text.split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      const mlArr = line.match(/^(\w+)\s*=\s*\[$/);
      if (mlArr) {
        const key = mlArr[1];
        const items = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(']')) {
          const val = lines[i].trim().replace(/,$/, '');
          if (val) items.push(unquote(val));
          i++;
        }
        result[key] = items;
        i++;
        continue;
      }
      const inlArr = line.match(/^(\w+)\s*=\s*\[([^\]]*)\]/);
      if (inlArr) {
        result[inlArr[1]] = inlArr[2]
          .split(',')
          .map(s => unquote(s.trim()))
          .filter(Boolean);
        i++;
        continue;
      }
      const kv = line.match(/^(\w+)\s*=\s*(.*)/);
      if (kv) {
        const raw = kv[2].trim();
        if      (raw === 'true')  result[kv[1]] = true;
        else if (raw === 'false') result[kv[1]] = false;
        else                      result[kv[1]] = unquote(raw);
      }
      i++;
    }
    return result;
  }

  function unquote(s) {
    if ((s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
    return s;
  }

  function updateContributors(frontmatter, username) {
    // Match both inline [ "a", "b" ] and multi-line arrays for contributors
    const re = /contributors\s*=\s*\[([\s\S]*?)\]/;
    const match = frontmatter.match(re);
    if (!match) return frontmatter.trimEnd() + `\ncontributors = ["${toTomlStr(username)}"]`;
    const names = [...match[1].matchAll(/"([^"]*)"/g)].map(m => m[1]);
    if (names.includes(username)) return frontmatter;
    names.push(username);
    return frontmatter.replace(re, `contributors = [${names.map(n => `"${toTomlStr(n)}"`).join(', ')}]`);
  }

  function ensureDraftFalse(fm) {
    if (/^draft\s*=/m.test(fm)) return fm.replace(/^draft\s*=\s*.*/m, 'draft = false');
    return fm.trimEnd() + '\ndraft = false';
  }

  function setFMKey(fm, key, tomlValue) {
    // Remove existing key — handle multi-line arrays (key = [\n...\n]) and inline/scalar forms.
    // Strategy: split into lines, find the key line, remove it plus any continuation until ']'
    const lines = fm.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const isKeyLine = new RegExp(`^${key}\\s*=`).test(line.trim());
      if (isKeyLine) {
        // Check if this is the start of a multi-line array (ends with '[' and no ']' on same line)
        const isOpenArray = /\[\s*$/.test(line) && !/\]/.test(line);
        if (isOpenArray) {
          // Skip lines until we find the closing ']'
          i++;
          while (i < lines.length && !/^\s*\]/.test(lines[i])) i++;
          i++; // skip the ']' line
        } else {
          i++; // skip just this line
        }
        continue;
      }
      out.push(line);
      i++;
    }
    return out.join('\n').trimEnd() + `\n${key} = ${tomlValue}`;
  }

  function tomlStringArray(arr) {
    if (!arr || !arr.length) return '[]';
    return `[\n${arr.map(s => `  "${toTomlStr(s)}"`).join(',\n')}\n]`;
  }

  function tomlInlineArray(arr) {
    // Guard: if a non-array truthy value sneaks in (e.g. a string from Hugo jsonify),
    // coerce it to a single-element array so we never produce mangled TOML.
    if (!arr) return '[]';
    if (!Array.isArray(arr)) arr = [arr];
    if (!arr.length) return '[]';
    return `[${arr.map(s => `"${toTomlStr(String(s))}"`).join(', ')}]`;
  }

  /**
   * Collapse any multi-line TOML arrays in frontmatter to single-line inline form.
   * Hugo's front matter parser fails on multi-line arrays for some keys, so we
   * normalize ALL arrays to inline before committing.
   *
   * Handles both forms:
   *   key = [          key = ["a", "b"]
   *     "a",
   *     "b"
   *   ]
   */
  function normalizeFrontmatter(fm) {
    // Collapse multi-line TOML arrays to single-line inline form.
    // Process line by line to avoid regex issues with special characters in values.
    const lines = fm.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      // Detect start of multi-line array: key = [  (with nothing after [)
      const mlMatch = line.match(/^(\w+)\s*=\s*\[\s*$/);
      if (mlMatch) {
        const key = mlMatch[1];
        const items = [];
        i++;
        while (i < lines.length && !/^\s*\]/.test(lines[i])) {
          const val = lines[i].trim().replace(/,$/, '');
          if (val) {
            // Re-quote bare values; already-quoted pass through
            if ((val.startsWith('"') && val.endsWith('"')) ||
                (val.startsWith("'") && val.endsWith("'"))) {
              items.push(val);
            } else {
              items.push(`"${toTomlStr(val)}"`);
            }
          }
          i++;
        }
        i++; // skip closing ]
        out.push(`${key} = [${items.join(', ')}]`);
        continue;
      }
      out.push(line);
      i++;
    }
    return out.join('\n');
  }

  const INLINE_ARRAY_KEYS = new Set(['citations', 'downloadLinks', 'tags', 'latitudeLongitude']);

  function applyFMUpdates(fm, updates) {
    const PROTECTED = new Set(['draft', 'contributors', 'title']);
    const DATE_KEYS = new Set(['startDate', 'endDate', 'cuDate']);
    for (const [key, value] of Object.entries(updates)) {
      if (PROTECTED.has(key) || key.startsWith('_')) continue;
      let tomlVal;
      if (Array.isArray(value)) {
        // Empty arrays mean "not edited by this tab" — skip rather than clobber existing data
        if (!value.length) continue;
        tomlVal = INLINE_ARRAY_KEYS.has(key) ? tomlInlineArray(value) : tomlStringArray(value);
      } else if (typeof value === 'boolean') {
        tomlVal = value ? 'true' : 'false';
      } else if (value == null) {
        continue;
      } else if (value === '') {
        // Allow empty string for date fields (means "the present"); skip others
        if (!DATE_KEYS.has(key)) continue;
        tomlVal = '""';
      } else {
        tomlVal = `"${toTomlStr(String(value))}"`;
      }
      fm = setFMKey(fm, key, tomlVal);
    }
    return ensureDraftFalse(fm);
  }

  // ─── EDITOR ───────────────────────────────────────────────────────────────

  function initEditor(markdownContent) {
    const el = document.querySelector('#editor');
    if (!el) { console.error('Editor element #editor not found'); return; }
    const panel = document.getElementById('edit-content');
    const prevDisplay = panel ? panel.style.display : null;
    if (panel) panel.style.display = 'block';
    editor = new Editor({
      el,
      height: '600px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      initialValue: markdownContent,
      usageStatistics: false,
      theme: 'dark',
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['code', 'codeblock']
      ]
    });
    if (panel && prevDisplay !== null) panel.style.display = prevDisplay;
  }

  async function loadMarkdownFile() {
    if (isNewPage) {
      originalFrontmatter = '';
      parsedFM            = {};
      if (isTheoryweb) {
        // Don't init the markdown editor yet — buildTheorywebUI will call
        // applyTheorywebContentArea which decides what to show based on type
      } else {
        initEditor('');
      }
      buildAllFrontmatterUI();
      return;
    }
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const markdown = await response.text();
      if (markdown.trim().startsWith('<!DOCTYPE') || markdown.trim().startsWith('<html'))
        throw new Error('File not found at ' + markdownUrl);
      const { frontmatter, content: bodyContent } = parseFrontmatter(markdown);
      originalFrontmatter = frontmatter;
      parsedFM            = parseTOML(frontmatter);

      if (isTheoryweb) {
        // Pre-extract image data before building UI
        twImageFilename = parsedFM.pageThumbnailFile || '';
        if (parsedFM.type === 'Images') {
          twOcrRegions = parseOcrRegionsFromContent(bodyContent);
          // Don't init markdown editor for Images type
        } else {
          initEditor(bodyContent);
        }
      } else {
        initEditor(bodyContent);
      }

      buildAllFrontmatterUI();
    } catch (error) {
      alert('Error loading file: ' + error.message);
    }
  }

  // ─── FOLDER ROUTING ───────────────────────────────────────────────────────

  const TAG_TO_FOLDER = {
    'Meta':           'content/meta',
    'Transcriptions': 'content/transcriptions',
    'User':           'content/users',
  };

  function getFolderForTag(tag) {
    return TAG_TO_FOLDER[tag] || 'content/wiki';
  }

  function generateRandomFilename() {
    return Math.random().toString(36).substring(2, 18);
  }

  // ─── UI BUILDING HELPERS ──────────────────────────────────────────────────

  const S = {
    label:    'display:block; color:var(--yellow); margin-bottom:0.3rem; font-family:var(--font-display); font-size:0.95rem;',
    note:     'font-size:0.78rem; color:var(--deep-white); margin-top:0.2rem;',
    input:    'width:100%; padding:0.4rem 0.6rem; background:var(--deep-white); color:var(--white); border:0.15rem solid var(--brown); border-radius:0.4rem; font-family:var(--font-body); box-sizing:border-box;',
    wrap:     'margin-bottom:1.25rem;',
    rowWrap:  'border:0.125rem solid var(--brown); border-radius:0.5rem; padding:0.75rem; margin-bottom:0.75rem; background:var(--blue);',
    addBtn:   'background:var(--aqua); color:var(--white); border:none; border-radius:0.5rem; padding:0.3rem 0.75rem; cursor:pointer; margin-top:0.4rem; font-family:var(--font-display);',
    removeBtn:'background:var(--orange); color:var(--white); border:none; border-radius:0.35rem; padding:0.2rem 0.6rem; cursor:pointer; font-family:var(--font-display); margin-top:0.4rem;',
    disabled: 'opacity:0.45; cursor:not-allowed;',
  };

  function fieldBlock(label, el, note) {
    const w = document.createElement('div');
    w.style.cssText = S.wrap;
    const lbl = document.createElement('label');
    lbl.style.cssText = S.label;
    lbl.textContent = label;
    w.appendChild(lbl);
    if (el) w.appendChild(el);
    if (note) {
      const n = document.createElement('div');
      n.style.cssText = S.note;
      n.textContent = note;
      w.appendChild(n);
    }
    return w;
  }

  function textInput(val, placeholder) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = val || '';
    inp.placeholder = placeholder || '';
    inp.style.cssText = S.input;
    return inp;
  }

  function disabledInput(val) {
    const inp = textInput(val);
    inp.disabled = true;
    inp.style.cssText += S.disabled;
    return inp;
  }

  function makeDateSelects(idPrefix, initialValue) {
    const parts     = (initialValue || '').split('-');
    // Empty initialValue means "the present"; '0000' parts mean unknown
    const isPresent = initialValue === '';
    const initYear  = isPresent ? 'present' : ((parts[0] && parts[0] !== '0000') ? parts[0] : '');
    const initMonth = (parts[1] && parts[1] !== '00')   ? parts[1] : '';
    const initDay   = (parts[2] && parts[2] !== '00')   ? parts[2] : '';
    const wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex; gap:0.3rem; flex-wrap:wrap;';
    wrap.dataset.datePrefix = idPrefix;
    const ySel = document.createElement('select');
    ySel.dataset.datePart = 'year';
    addOpt(ySel, '', 'Year (Unknown)');
    addOpt(ySel, 'present', 'The Present', isPresent);
    for (let y = new Date().getFullYear(); y >= 1970; y--) addOpt(ySel, y, y, String(y) === initYear);
    const mSel = document.createElement('select');
    mSel.dataset.datePart = 'month';
    const MONTHS = ['Month (Unknown)','January','February','March','April','May','June','July','August','September','October','November','December'];
    MONTHS.forEach((m, idx) => addOpt(mSel, idx === 0 ? '' : String(idx).padStart(2,'0'), m, String(idx).padStart(2,'0') === initMonth));
    const dSel = document.createElement('select');
    dSel.dataset.datePart = 'day';
    addOpt(dSel, '', 'Day (Unknown)');
    for (let d = 1; d <= 31; d++) {
      const dv = String(d).padStart(2,'0');
      addOpt(dSel, dv, d, dv === initDay);
    }

    function updatePresentState() {
      const isNowPresent = ySel.value === 'present';
      mSel.disabled = isNowPresent;
      dSel.disabled = isNowPresent;
      mSel.style.opacity = isNowPresent ? '0.45' : '';
      dSel.style.opacity = isNowPresent ? '0.45' : '';
    }
    ySel.addEventListener('change', updatePresentState);
    updatePresentState();

    [ySel, mSel, dSel].forEach(s => { s.style.cssText = 'flex:1; min-width:6rem;'; wrap.appendChild(s); });
    return wrap;
  }

  function addOpt(sel, val, text, selected = false) {
    const o = document.createElement('option');
    o.value = val; o.textContent = text;
    if (selected) o.selected = true;
    sel.appendChild(o);
  }

  function readDateSelects(wrap) {
    const y = wrap.querySelector('[data-date-part="year"]')?.value  || '';
    if (y === 'present') return '';  // empty string = "the present"
    const m = wrap.querySelector('[data-date-part="month"]')?.value || '00';
    const d = wrap.querySelector('[data-date-part="day"]')?.value   || '00';
    return `${y||'0000'}-${m||'00'}-${d||'00'}`;
  }

  function makeStringArrayEditor(container, items) {
    container.innerHTML = '';
    function addRow(val) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:0.4rem; margin-bottom:0.4rem; align-items:center;';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = val || '';
      inp.style.cssText = S.input + 'flex:1;';
      const rm = document.createElement('button');
      rm.textContent = '✕'; rm.style.cssText = S.removeBtn;
      rm.addEventListener('click', () => row.remove());
      row.appendChild(inp); row.appendChild(rm);
      container.appendChild(row);
    }
    (items || []).forEach(addRow);
    return {
      addRow: () => addRow(''),
      getValues: () => Array.from(container.querySelectorAll('input')).map(i => i.value.trim()).filter(Boolean)
    };
  }

  // ── Multi-select checkbox list ──────────────────────────────────────────
  function makeCheckboxList(options, selectedValues) {
    const selected = new Set(selectedValues || []);
    const wrap = document.createElement('div');
    wrap.style.cssText = 'border:0.125rem solid var(--brown); border-radius:0.5rem; padding:0.6rem 0.75rem; max-height:14rem; overflow-y:auto; background:var(--blue); display:flex; flex-wrap:wrap; gap:0.35rem 1rem;';
    options.forEach(opt => {
      const lbl = document.createElement('label');
      lbl.style.cssText = 'display:flex; align-items:center; gap:0.35rem; cursor:pointer; font-size:0.88rem; color:var(--white); white-space:nowrap;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = opt;
      cb.checked = selected.has(opt);
      cb.style.cssText = 'accent-color:var(--aqua); width:0.95rem; height:0.95rem; cursor:pointer;';
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(opt));
      wrap.appendChild(lbl);
    });
    return {
      el: wrap,
      getValues: () => Array.from(wrap.querySelectorAll('input[type=checkbox]'))
        .filter(cb => cb.checked)
        .map(cb => cb.value),
    };
  }

  function makePipedArrayEditor(container, items, fieldDefs) {
    container.innerHTML = '';
    let rowIndex = 0;
    function addRow(pipedValue) {
      const parts = (pipedValue || '').split('|');
      const row   = document.createElement('div');
      row.style.cssText = S.rowWrap;
      rowIndex++;
      const ri = rowIndex;
      const fieldEls = fieldDefs.map((def, fi) => {
        const fWrap = document.createElement('div');
        fWrap.style.cssText = 'margin-bottom:0.45rem;';
        const lbl = document.createElement('label');
        lbl.style.cssText = 'font-size:0.8rem; color:var(--deep-white); display:block; margin-bottom:0.15rem;';
        lbl.textContent = def.label;
        fWrap.appendChild(lbl);
        let el;
        if (def.type === 'date') {
          el = makeDateSelects(`pipe-${ri}-${fi}`, parts[fi] || '');
        } else if (def.type === 'textarea') {
          el = document.createElement('textarea');
          el.rows = 2;
          el.value = parts[fi] || '';
          el.style.cssText = S.input;
        } else if (def.type === 'dropdown') {
          el = document.createElement('select');
          el.style.cssText = 'width:100%; margin:0;';
          addOpt(el, '', '— Select —');
          (EDITOR_DROPDOWNS[def.dropdownKey] || []).forEach(opt => {
            addOpt(el, opt, opt, opt === (parts[fi] || ''));
          });
          const cur = parts[fi] || '';
          if (cur && !(EDITOR_DROPDOWNS[def.dropdownKey] || []).includes(cur)) {
            addOpt(el, cur, cur, true);
          }
        } else {
          el = document.createElement('input');
          el.type = 'text';
          el.value = parts[fi] || '';
          el.style.cssText = S.input;
        }
        fWrap.appendChild(el);
        row.appendChild(fWrap);
        return { def, el };
      });
      const rm = document.createElement('button');
      rm.textContent = '✕ Remove'; rm.style.cssText = S.removeBtn;
      rm.addEventListener('click', () => row.remove());
      row.appendChild(rm);
      row._getPipedValue = () => fieldEls.map(({ def, el }) => {
        if (def.type === 'date') return readDateSelects(el);
        return (el.value || '').trim();
      }).join('|');
      container.appendChild(row);
    }
    (items || []).forEach(addRow);
    return {
      addRow:    () => addRow(''),
      getValues: () => Array.from(container.children).map(r => r._getPipedValue ? r._getPipedValue() : '').filter(Boolean)
    };
  }

  // ─── TAGS LIST ────────────────────────────────────────────────────────────

  const TAGS_LIST = [
    "Locations","Showtapes","Animatronic Shows","Stage Variations","Animatronics",
    "Animatronic Parts","Animatronic Preservation","Costumed Characters","Retrofits",
    "History","Cancelled Locations","Remodels and Initiatives","Arcades and Attractions",
    "Store Fixtures","Companies/Brands","Characters","Events","Animatronic Control Systems",
    "Other Systems","Simulators","Programming Systems","Commercials","News Footage",
    "Company Media","Movies","Puppets","Live Shows","ShowBiz Pizza Programs","Showtape Formats",
    "Family Vision","Corporate Documents","Documents","Promotional Material",
    "Social Media and Websites","Ad Vehicles","In-Store Merchandise","Products","Menu Items",
    "Tickets","Tokens","Employee Wear","Video Games","Meta","Transcriptions"
  ];

  const CATEGORIES_LIST = [
    "Celebration Station",
    "Chuck E. Cheese's",
    "Circus Pizza",
    "Disney Parks",
    "Jungle Jim's",
    "Pasquallys Pizza & Wings",
    "Pizza Time Theatre",
    "ShowBiz Pizza Place",
    "Advanced Animations",
    "AVG Technologies",
    "Creative Engineering",
    "Creative Presentations",
    "Golding Leisure",
    "Heimotion",
    "Hofmann Figuren",
    "Jim Henson's Creature Shop",
    "Sally Corporation",
    "Unknown Manufacturers",
    "Setmakers",
    "AnimatedFX",
    "Villalobos Producciones",
    "VP Animations",
    "Chuck E. Cheese in the Galaxy 5000",
    "Five Nights at Freddy's",
    "Five Nights at Freddy's (Movie)",
    "Five Nights at Freddy's 2 (Movie)",
    "The Rock-afire Explosion (Movie)",
    "Walt Disney Imagineering",
    "Other FECs",
  ];

  // ─── BUILD FRONTMATTER UIs ────────────────────────────────────────────────

  let fmGeneralGetValues   = null;
  let fmLocationGetValues  = null;
  let fmShowtapeGetValues  = null;
  let fmProductsGetValues  = null;
  // TheoryWeb
  let fmTheorywebGetValues = null;

  function buildAllFrontmatterUI() {
    if (isTheoryweb) {
      buildTheorywebUI();
      applyTheorywebTabVisibility();
    } else {
      fmGeneralGetValues  = buildGeneralUI(document.getElementById('fm-general-fields'));
      fmLocationGetValues = buildLocationUI(document.getElementById('fm-location-fields'));
      fmShowtapeGetValues = buildShowtapeUI(document.getElementById('fm-showtape-fields'));
      fmProductsGetValues = buildProductsUI(document.getElementById('fm-products-fields'));
      buildCitationsUI();
    }
  }

  // ─── THEORYWEB TAB VISIBILITY ─────────────────────────────────────────────

  function applyTheorywebTabVisibility() {
    const hideTabIds = ['edit-fm-general','edit-fm-location','edit-fm-showtape','edit-fm-products','edit-actions'];
    hideTabIds.forEach(id => {
      const panel = document.getElementById(id);
      if (panel) panel.style.display = 'none';
    });
    document.querySelectorAll('#edit-tabs .tab-button').forEach(btn => {
      if (hideTabIds.includes(btn.dataset.tab)) btn.style.display = 'none';
    });
    // Hide citations section — not used on TheoryWeb
    const citSec = document.getElementById('citations-section');
    if (citSec) citSec.style.display = 'none';

    let twBtn = document.querySelector('[data-tab="edit-fm-theoryweb"]');
    if (!twBtn) {
      twBtn = document.createElement('button');
      twBtn.className = 'tab-button';
      twBtn.dataset.tab = 'edit-fm-theoryweb';
      twBtn.textContent = 'Page Info';
      document.querySelector('#edit-tabs .tab-buttons')?.appendChild(twBtn);
      twBtn.addEventListener('click', () => {
        document.querySelectorAll('#edit-tabs .tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#edit-tabs .tab-panel').forEach(p => p.classList.remove('active'));
        twBtn.classList.add('active');
        document.getElementById('edit-fm-theoryweb')?.classList.add('active');
      });
    }
  }

  // ─── THEORYWEB CONTENT AREA SWITCHER ──────────────────────────────────────
  // Swaps what's shown in the Content tab based on the current type.

  let twCurrentType   = '';
  let twPendingFile   = null; // File object for a newly chosen image
  let twImageFilename = '';   // existing pageThumbnailFile value
  let twOcrRegions    = [];   // parsed from existing Images page content

  function applyTheorywebContentArea(type) {
    twCurrentType = type;
    const editorWrap   = document.getElementById('editor');
    const customToolbar = document.getElementById('custom-toolbar');
    let   ocrMount     = document.getElementById('tw-ocr-mount');

    if (type === 'Images') {
      // Hide markdown editor + toolbar, show OCR tool
      if (editorWrap)    editorWrap.style.display    = 'none';
      if (customToolbar) customToolbar.style.display = 'none';
      if (!ocrMount) {
        ocrMount = document.createElement('div');
        ocrMount.id = 'tw-ocr-mount';
        editorWrap?.parentNode.insertBefore(ocrMount, editorWrap);
      }
      ocrMount.style.display = 'block';
      buildOcrEditor(ocrMount);
    } else {
      // Show markdown editor, hide OCR tool
      if (editorWrap)    editorWrap.style.display    = 'block';
      if (customToolbar) customToolbar.style.display = 'block';
      if (ocrMount)      ocrMount.style.display      = 'none';
      // Init editor if not done yet
      if (!editor) initEditor('');
    }
  }

  // ─── OCR EDITOR (embedded, no <style> — site provides .ocr-wrap/.ocr-region CSS) ──

  function buildOcrEditor(mount) {
    if (mount.dataset.built) return; // already initialized
    mount.dataset.built = '1';

    // Parse existing regions from parsedFM content if editing an existing Images page
    // Content looks like: <div class="ocr-region" style="left:X%;top:Y%;width:W%;height:H%;transform:rotate(Rdeg)" data-tip="TEXT"></div>
    let regions    = [];
    let idCounter  = 0;
    let selectedId = null;
    let dragging   = null;
    let zoom       = 1;
    let imgNaturalW = 0, imgNaturalH = 0;
    let imageEl    = null;

    function genId() { return ++idCounter; }
    function pct(v)  { return Math.round(v * 1000) / 1000; }

    // Parse existing content HTML for ocr-region divs
    if (!isNewPage && twOcrRegions.length) {
      regions = twOcrRegions.map(r => ({ ...r, id: genId() }));
    }

    mount.style.cssText = 'display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;';
    mount.innerHTML = '';

    // ── Image upload area ─────────────────────────────────
    const uploadArea = document.createElement('div');
    uploadArea.style.cssText = 'display:flex; align-items:center; gap:1rem; flex-wrap:wrap;';

    const previewBox = document.createElement('div');
    previewBox.id = 'tw-img-preview';
    previewBox.style.cssText = 'width:120px; height:80px; border:0.15rem solid var(--brown); border-radius:0.4rem; display:flex; align-items:center; justify-content:center; overflow:hidden; background:var(--blue); flex-shrink:0;';

    const previewImg = document.createElement('img');
    previewImg.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain; display:none;';
    const previewLabel = document.createElement('span');
    previewLabel.style.cssText = 'color:var(--deep-white); font-size:0.75rem; text-align:center; padding:0.25rem;';
    previewLabel.textContent = 'No image';
    previewBox.appendChild(previewImg);
    previewBox.appendChild(previewLabel);

    const chooseBtn = document.createElement('button');
    chooseBtn.textContent = twImageFilename ? '⬆ Replace Image (.avif)' : '⬆ Choose Image (.avif)';
    chooseBtn.style.cssText = 'background:var(--aqua); color:var(--white); border:none; border-radius:0.5rem; padding:0.4rem 0.9rem; cursor:pointer; font-family:var(--font-display);';

    const fileInp = document.createElement('input');
    fileInp.type = 'file'; fileInp.accept = '.avif'; fileInp.style.display = 'none';

    const filenameNote = document.createElement('span');
    filenameNote.style.cssText = 'font-size:0.8rem; color:var(--deep-white);';
    filenameNote.textContent = twImageFilename ? ('Current: ' + twImageFilename) : '';

    chooseBtn.addEventListener('click', () => fileInp.click());
    fileInp.addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      if (!f.name.toLowerCase().endsWith('.avif')) { alert('Only .avif files are accepted.'); return; }
      twPendingFile = f;
      const url = URL.createObjectURL(f);
      previewImg.src    = url;
      previewImg.style.display  = 'block';
      previewLabel.style.display = 'none';
      filenameNote.textContent = 'New file: ' + f.name;
      chooseBtn.textContent = '⬆ Replace Image (.avif)';
      loadOcrImage(url);
    });

    // If editing existing page with an image, show it
    if (twImageFilename && !isNewPage) {
      const existingUrl = '/photos/' + twImageFilename;
      previewImg.src    = existingUrl;
      previewImg.style.display   = 'block';
      previewLabel.style.display = 'none';
      // Also load into canvas
      setTimeout(() => loadOcrImage(existingUrl), 0);
    }

    uploadArea.appendChild(previewBox);
    uploadArea.appendChild(chooseBtn);
    uploadArea.appendChild(fileInp);
    uploadArea.appendChild(filenameNote);
    mount.appendChild(uploadArea);

    // ── Canvas area ───────────────────────────────────────
    const canvasWrap = document.createElement('div');
    canvasWrap.style.cssText = 'border:0.15rem solid var(--brown); border-radius:0.5rem; overflow:hidden; background:#080808; display:flex; flex-direction:column;';

    const canvasToolbar = document.createElement('div');
    canvasToolbar.style.cssText = 'background:var(--blue); padding:0.4rem 0.75rem; display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--deep-white); flex-shrink:0; flex-wrap:wrap;';
    canvasToolbar.innerHTML = '<span>Click image to place region · Drag to move · Corner to resize</span>';

    const zoomWrap = document.createElement('span');
    zoomWrap.style.cssText = 'display:flex; align-items:center; gap:0.3rem; margin-left:auto;';
    const mkZBtn = (t) => {
      const b = document.createElement('button');
      b.textContent = t;
      b.style.cssText = 'background:var(--bg,#111); border:1px solid var(--brown); color:var(--white); padding:0.1rem 0.4rem; cursor:pointer; border-radius:0.25rem; font-size:0.75rem;';
      return b;
    };
    const zOutBtn   = mkZBtn('−');
    const zLabel    = document.createElement('span');
    zLabel.style.cssText = 'font-size:0.75rem; min-width:2.5rem; text-align:center; color:var(--deep-white);';
    zLabel.textContent = '100%';
    const zInBtn    = mkZBtn('+');
    const zFitBtn   = mkZBtn('FIT');
    zoomWrap.append(zOutBtn, zLabel, zInBtn, zFitBtn);
    canvasToolbar.appendChild(zoomWrap);

    const canvasScroll = document.createElement('div');
    canvasScroll.style.cssText = 'flex:1; min-height:320px; max-height:520px; overflow:auto; display:flex; align-items:flex-start; justify-content:flex-start; padding:1rem;';

    const dropZone = document.createElement('div');
    dropZone.id = 'tw-ocr-dropzone';
    dropZone.style.cssText = 'width:100%; min-height:280px; border:2px dashed var(--brown); display:flex; align-items:center; justify-content:center; color:var(--deep-white); font-size:0.85rem; cursor:pointer; border-radius:0.5rem;';
    dropZone.textContent = 'Choose an image above to begin editing regions';
    canvasScroll.appendChild(dropZone);

    // ── Region sidebar ─────────────────────────────────────
    const regionSidebar = document.createElement('div');
    regionSidebar.style.cssText = 'background:var(--blue); border-top:0.125rem solid var(--brown); padding:0.5rem 0.75rem; max-height:180px; overflow-y:auto;';

    const regionHeader = document.createElement('div');
    regionHeader.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;';
    regionHeader.innerHTML = '<span style="font-size:0.8rem; color:var(--yellow); font-family:var(--font-display);">OCR Regions</span>';
    const addRegBtn = document.createElement('button');
    addRegBtn.textContent = '+ Add Region';
    addRegBtn.style.cssText = 'background:var(--aqua); color:var(--white); border:none; border-radius:0.35rem; padding:0.2rem 0.5rem; cursor:pointer; font-size:0.78rem; font-family:var(--font-display);';
    regionHeader.appendChild(addRegBtn);

    const regionList = document.createElement('div');
    regionList.id = 'tw-ocr-region-list';

    regionSidebar.appendChild(regionHeader);
    regionSidebar.appendChild(regionList);

    canvasWrap.appendChild(canvasToolbar);
    canvasWrap.appendChild(canvasScroll);
    canvasWrap.appendChild(regionSidebar);
    mount.appendChild(canvasWrap);

    // ── Properties panel (below canvas) ────────────────────
    const propsWrap = document.createElement('div');
    propsWrap.id = 'tw-ocr-props';
    propsWrap.style.cssText = 'border:0.125rem solid var(--brown); border-radius:0.5rem; padding:0.75rem; background:var(--blue); font-size:0.82rem; color:var(--deep-white);';
    propsWrap.textContent = 'Select a region to edit its properties.';
    mount.appendChild(propsWrap);

    // ── Core OCR functions ─────────────────────────────────

    function loadOcrImage(url) {
      const container = document.createElement('div');
      container.id = 'tw-ocr-imgcontainer';
      container.style.cssText = 'position:relative; flex-shrink:0; cursor:crosshair; user-select:none;';

      const img = document.createElement('img');
      img.src = url;
      img.draggable = false;
      img.onload = () => {
        imgNaturalW = img.naturalWidth;
        imgNaturalH = img.naturalHeight;
        setZoom(zoom);
        renderAllOverlays();
      };

      container.appendChild(img);
      canvasScroll.innerHTML = '';
      canvasScroll.appendChild(container);
      imageEl = img;

      container.addEventListener('mousedown', e => {
        if (e.target === container || e.target === img) {
          if (e.button !== 0) return;
          const rect = container.getBoundingClientRect();
          addRegion(
            pct(((e.clientX - rect.left) / rect.width) * 100),
            pct(((e.clientY - rect.top) / rect.height) * 100)
          );
          e.stopPropagation();
        }
      });

      container.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
      });
    }

    function setZoom(z) {
      zoom = z;
      zLabel.textContent = Math.round(z * 100) + '%';
      if (!imageEl) return;
      const w = Math.round(imgNaturalW * z);
      const h = Math.round(imgNaturalH * z);
      imageEl.style.width  = w + 'px';
      imageEl.style.height = h + 'px';
      const c = document.getElementById('tw-ocr-imgcontainer');
      if (c) { c.style.width = w + 'px'; c.style.height = h + 'px'; renderAllOverlays(); }
    }

    zInBtn.addEventListener('click',  () => setZoom(Math.min(zoom * 1.25, 4)));
    zOutBtn.addEventListener('click', () => setZoom(Math.max(zoom / 1.25, 0.1)));
    zFitBtn.addEventListener('click', () => {
      if (!imageEl) return;
      const fitZ = Math.min((canvasScroll.clientWidth - 32) / imgNaturalW, (canvasScroll.clientHeight - 32) / imgNaturalH, 1);
      setZoom(fitZ);
    });

    function addRegion(xPct = 10, yPct = 10) {
      const r = { id: genId(), x: xPct, y: yPct, w: 15, h: 8, rot: 0, text: '' };
      regions.push(r);
      selectedId = r.id;
      renderRegionList();
      renderAllOverlays();
      renderRegionProps();
    }

    function deleteRegion(id) {
      regions = regions.filter(r => r.id !== id);
      if (selectedId === id) selectedId = null;
      renderRegionList();
      renderAllOverlays();
      renderRegionProps();
    }

    function selectRegion(id) {
      selectedId = id;
      renderRegionList();
      renderAllOverlays();
      renderRegionProps();
    }

    function renderRegionList() {
      regionList.innerHTML = '';
      regions.forEach(r => {
        const item = document.createElement('div');
        item.style.cssText = 'display:flex; align-items:center; gap:0.5rem; padding:0.25rem 0; border-bottom:1px solid rgba(255,255,255,0.07); cursor:pointer;' + (r.id === selectedId ? 'background:rgba(255,200,0,0.08);' : '');
        item.innerHTML = `<span style="width:8px;height:8px;border:2px solid var(--yellow);display:inline-block;flex-shrink:0;"></span>
          <span style="flex:1;font-size:0.78rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.text || '(no text)'}</span>
          <span style="font-size:0.72rem;color:var(--deep-white);">${r.x.toFixed(1)}%, ${r.y.toFixed(1)}%</span>
          <button data-id="${r.id}" style="background:none;border:none;color:var(--deep-white);cursor:pointer;font-size:1rem;padding:0 0.2rem;">×</button>`;
        item.addEventListener('mousedown', e => { if (!e.target.dataset.id) selectRegion(r.id); });
        item.querySelector('button').addEventListener('click', e => { e.stopPropagation(); deleteRegion(r.id); });
        regionList.appendChild(item);
      });
    }

    function renderAllOverlays() {
      const container = document.getElementById('tw-ocr-imgcontainer');
      if (!container) return;
      container.querySelectorAll('.tw-region-overlay').forEach(el => el.remove());
      regions.forEach(r => {
        const el = document.createElement('div');
        el.className = 'tw-region-overlay' + (r.id === selectedId ? ' selected' : '');
        el.style.cssText = `position:absolute; border:1.5px solid rgba(232,197,71,${r.id === selectedId ? '1' : '0.6'}); background:rgba(232,197,71,${r.id === selectedId ? '0.15' : '0.05'}); cursor:move; left:${r.x}%; top:${r.y}%; width:${r.w}%; height:${r.h}%; transform:rotate(${r.rot}deg); transform-origin:top left; box-sizing:border-box;`;

        const handle = document.createElement('div');
        handle.style.cssText = 'position:absolute; width:8px; height:8px; background:var(--yellow,#e8c547); border:1px solid #000; right:-4px; bottom:-4px; cursor:se-resize;';
        el.appendChild(handle);

        el.addEventListener('mousedown', e => {
          if (e.target === handle) return;
          e.preventDefault(); e.stopPropagation();
          selectRegion(r.id);
          const rect = container.getBoundingClientRect();
          dragging = { type:'move', id:r.id, startX:e.clientX, startY:e.clientY, origX:r.x, origY:r.y, containerW:rect.width, containerH:rect.height };
        });

        handle.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          selectRegion(r.id);
          const rect = container.getBoundingClientRect();
          dragging = { type:'resize', id:r.id, startX:e.clientX, startY:e.clientY, origW:r.w, origH:r.h, containerW:rect.width, containerH:rect.height };
        });

        container.appendChild(el);
      });
    }

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const r = regions.find(r => r.id === dragging.id);
      if (!r) return;
      const dx = ((e.clientX - dragging.startX) / dragging.containerW) * 100;
      const dy = ((e.clientY - dragging.startY) / dragging.containerH) * 100;
      if (dragging.type === 'move') {
        r.x = pct(Math.max(0, dragging.origX + dx));
        r.y = pct(Math.max(0, dragging.origY + dy));
      } else {
        r.w = pct(Math.max(2, dragging.origW + dx));
        r.h = pct(Math.max(2, dragging.origH + dy));
      }
      renderAllOverlays(); renderRegionList(); renderRegionProps();
    });
    document.addEventListener('mouseup', () => { dragging = null; });

    document.addEventListener('keydown', e => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId !== null) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        deleteRegion(selectedId);
      }
      if (e.key === 'Escape') { selectedId = null; renderAllOverlays(); renderRegionProps(); renderRegionList(); }
    });

    function renderRegionProps() {
      const r = regions.find(r => r.id === selectedId);
      if (!r) { propsWrap.textContent = 'Select a region to edit its properties.'; return; }

      propsWrap.innerHTML = '';
      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; margin-bottom:0.75rem;';

      const mkField = (label, key, step, min, max) => {
        const wrap = document.createElement('div');
        const lbl = document.createElement('label');
        lbl.style.cssText = 'display:block; font-size:0.72rem; color:var(--deep-white); margin-bottom:0.2rem;';
        lbl.textContent = label;
        const inp = document.createElement('input');
        inp.type = 'number'; inp.value = r[key]; inp.step = step; inp.min = min; inp.max = max;
        inp.style.cssText = 'width:100%; background:var(--bg,#111); border:1px solid var(--brown); color:var(--white); padding:0.2rem 0.4rem; font-size:0.78rem; border-radius:0.25rem; box-sizing:border-box;';
        inp.addEventListener('input', e => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v)) { r[key] = v; renderAllOverlays(); }
        });
        wrap.appendChild(lbl); wrap.appendChild(inp);
        return wrap;
      };

      grid.appendChild(mkField('X %', 'x', 0.1, 0, 100));
      grid.appendChild(mkField('Y %', 'y', 0.1, 0, 100));
      grid.appendChild(mkField('Rot °', 'rot', 0.5, -180, 180));
      grid.appendChild(mkField('W %', 'w', 0.1, 0.5, 100));
      grid.appendChild(mkField('H %', 'h', 0.1, 0.5, 100));

      const textWrap = document.createElement('div');
      const textLbl = document.createElement('label');
      textLbl.style.cssText = 'display:block; font-size:0.78rem; color:var(--yellow); margin-bottom:0.3rem; font-family:var(--font-display);';
      textLbl.textContent = 'Tooltip Text';
      const textArea = document.createElement('textarea');
      textArea.value = r.text;
      textArea.rows = 2;
      textArea.style.cssText = 'width:100%; background:var(--bg,#111); border:1px solid var(--brown); color:var(--white); padding:0.3rem 0.5rem; font-size:0.82rem; border-radius:0.25rem; resize:vertical; box-sizing:border-box;';
      textArea.addEventListener('input', e => { r.text = e.target.value; renderRegionList(); });

      propsWrap.appendChild(grid);
      textWrap.appendChild(textLbl); textWrap.appendChild(textArea);
      propsWrap.appendChild(textWrap);
    }

    addRegBtn.addEventListener('click', () => addRegion(10, 10));

    // ── Expose a function to get the generated HTML content ──
    mount._getOcrContent = () => {
      const fname = twPendingFile
        ? (mount.dataset.pendingFilename || (twImageFilename || 'image.avif'))
        : (twImageFilename || 'image.avif');
      const regionDivs = regions.map(r => {
        const safeText = r.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        return `<div class="ocr-region" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%;transform:rotate(${r.rot}deg)" data-tip="${safeText}"></div>`;
      }).join('\n');
      return `<div class="ocr-wrap">\n<img src="${fname}" alt="">\n${regionDivs}\n</div>`;
    };

    // Render initial regions if any
    if (regions.length > 0) renderRegionList();
  }

  // ─── PARSE OCR REGIONS FROM EXISTING CONTENT ─────────────────────────────

  function parseOcrRegionsFromContent(contentHtml) {
    const results = [];
    const re = /class="ocr-region"[^>]*style="([^"]*)"[^>]*data-tip="([\s\S]*?)"/g;
    let m;
    while ((m = re.exec(contentHtml)) !== null) {
      const s    = m[1];
      const text = m[2].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
      const n = (rx) => { const r = s.match(rx); return r ? parseFloat(r[1]) : 0; };
      results.push({
        x:   n(/left:([\d.]+)%/),
        y:   n(/top:([\d.]+)%/),
        w:   n(/width:([\d.]+)%/),
        h:   n(/height:([\d.]+)%/),
        rot: n(/rotate\(([-\d.]+)deg\)/),
        text,
      });
    }
    return results;
  }

  // ─── THEORYWEB UI ─────────────────────────────────────────────────────────

  const TW_TYPES = ['Theories', 'Images', 'Videos'];

  function buildTheorywebUI() {
    let container = document.getElementById('fm-theoryweb-fields');
    if (!container) {
      const tabContent = document.querySelector('#edit-tabs .tab-content');
      const panel = document.createElement('div');
      panel.className = 'tab-panel';
      panel.id = 'edit-fm-theoryweb';
      panel.innerHTML = `<p style="color:var(--deep-white); font-size:0.85rem; margin-bottom:1rem;">
        TheoryWeb page metadata. Contributors are managed automatically.
      </p>
      <div id="fm-theoryweb-fields"></div>
      <div style="margin-top:1.5rem;">
        <button id="save-fm-theoryweb-btn">Save Page Info &amp; Create PR</button>
        <button id="cancel-fm-theoryweb-btn" style="margin-left:1rem;">Cancel</button>
      </div>`;
      tabContent?.appendChild(panel);
      container = panel.querySelector('#fm-theoryweb-fields');

      document.getElementById('save-fm-theoryweb-btn')?.addEventListener('click', () => saveFMTab(fmTheorywebGetValues));
      document.getElementById('cancel-fm-theoryweb-btn')?.addEventListener('click', () => { if (confirm('Discard changes?')) location.reload(); });
    }

    container.innerHTML = '';

    // Title
    if (isNewPage) {
      const titleInp = textInput('', 'Page title');
      titleInp.id = 'tw-title-input';
      container.appendChild(fieldBlock('Title', titleInp, 'The title of this page.'));
    } else {
      container.appendChild(fieldBlock(
        'Title',
        disabledInput(parsedFM.title || currentPageTitle || ''),
        'Title changes affect URLs. Request a change on the Forums.'
      ));
    }

    // startDate
    const startDateEl = makeDateSelects('tw-startDate', parsedFM.startDate || '');
    container.appendChild(fieldBlock('Start Date', startDateEl));

    // Type — now a real dropdown (unlocked)
    const typeSel = document.createElement('select');
    typeSel.style.cssText = 'width:100%; padding:0.4rem 0.6rem; background:var(--deep-white); color:var(--white); border:0.15rem solid var(--brown); border-radius:0.4rem; font-family:var(--font-body); box-sizing:border-box;';
    TW_TYPES.forEach(t => addOpt(typeSel, t, t, t === (parsedFM.type || 'Theories')));
    container.appendChild(fieldBlock('Type', typeSel, 'Controls what fields and editor are shown.'));

    // Type-specific fields container — rebuilt when type changes
    const typeFieldsEl = document.createElement('div');
    typeFieldsEl.id = 'tw-type-fields';
    container.appendChild(typeFieldsEl);

    let tagsEditor = null;
    let videoLinkInp = null;

    function buildTypeFields(type) {
      typeFieldsEl.innerHTML = '';
      tagsEditor   = null;
      videoLinkInp = null;

      if (type === 'Images' || type === 'Videos') {
        // Tags — free string array
        const tagsCont = document.createElement('div');
        tagsEditor = makeStringArrayEditor(tagsCont, parsedFM.tags || []);
        const tagsAddBtn = document.createElement('button');
        tagsAddBtn.textContent = '+ Add Tag'; tagsAddBtn.style.cssText = S.addBtn;
        tagsAddBtn.addEventListener('click', () => tagsEditor.addRow());
        const tagsWrap = document.createElement('div');
        tagsWrap.appendChild(tagsCont); tagsWrap.appendChild(tagsAddBtn);
        typeFieldsEl.appendChild(fieldBlock('Tags', tagsWrap, 'Free-form tags for this page.'));
      }

      if (type === 'Images') {
        // pageThumbnailFile is managed by the OCR image upload, show read-only hint
        const thumbHint = document.createElement('div');
        thumbHint.style.cssText = 'font-size:0.8rem; color:var(--deep-white); padding:0.5rem 0;';
        thumbHint.textContent = twImageFilename
          ? ('Image file: ' + twImageFilename + ' — replace it in the Content tab.')
          : 'Upload the image in the Content tab. The filename will be set automatically.';
        typeFieldsEl.appendChild(fieldBlock('Image File', thumbHint));
      }

      if (type === 'Videos') {
        videoLinkInp = textInput(parsedFM.videoLink || '', 'https://youtu.be/...');
        typeFieldsEl.appendChild(fieldBlock('Video Link', videoLinkInp, 'YouTube or other video URL.'));
      }

      // Switch the content area
      applyTheorywebContentArea(type);
    }

    // Initial render
    const initialType = parsedFM.type || 'Theories';
    buildTypeFields(initialType);

    // Live type switching
    typeSel.addEventListener('change', () => buildTypeFields(typeSel.value));

    fmTheorywebGetValues = () => {
      const type = typeSel.value;
      const base = {
        startDate: readDateSelects(startDateEl),
        type,
        ...(isNewPage ? { title: document.getElementById('tw-title-input')?.value.trim() || '' } : {}),
      };
      if (tagsEditor)    base.tags      = tagsEditor.getValues();
      if (videoLinkInp)  base.videoLink = videoLinkInp.value.trim();
      return base;
    };

    return fmTheorywebGetValues;
  }

  // ─── BUILD GENERAL UI ─────────────────────────────────────────────────────

  function buildGeneralUI(container) {
    container.innerHTML = '';

    if (isNewPage) {
      // Editable title for new pages
      const titleInp = textInput('', 'Page title');
      titleInp.id = 'new-page-title-input';
      container.appendChild(fieldBlock('Title', titleInp, 'The title of the new page.'));
    } else {
      container.appendChild(fieldBlock(
        'Title',
        disabledInput(parsedFM.title || ''),
        'Title changes affect page URLs and links across the entire site. Request a change on the Forums.'
      ));
    }

    // Type — single dropdown (plain string)
    const tagSel = document.createElement('select');
    addOpt(tagSel, '', '— Select a type —');
    const currentTag = isNewPage ? '' : (parsedFM.type || '');
    TAGS_LIST.forEach(t => addOpt(tagSel, t, t, t === currentTag));
    container.appendChild(fieldBlock('Type', tagSel, isNewPage
      ? 'Determines which folder the page goes into.'
      : 'Page type.'));

    // Tags — multi-select checkbox list (franchise/category)
    const tagsCheck = makeCheckboxList(CATEGORIES_LIST, parsedFM.tags || []);
    container.appendChild(fieldBlock('Tags', tagsCheck.el, 'Select all that apply.'));

    const startDateEl = makeDateSelects('fm-startDate', parsedFM.startDate || '');
    container.appendChild(fieldBlock('Start Date', startDateEl));
    const endDateEl = makeDateSelects('fm-endDate', parsedFM.endDate || '');
    container.appendChild(fieldBlock('End Date', endDateEl, 'Leave all Unknown if still active / ongoing.'));

    const thumbInp = textInput(parsedFM.pageThumbnailFile || '', 'e.g. abc123def456.avif');
    container.appendChild(fieldBlock('Thumbnail File', thumbInp, 'Filename to use for the thumbnail (example.avif)'));

    const dlCont   = document.createElement('div');
    const dlEditor = makePipedArrayEditor(dlCont, parsedFM.downloadLinks || [], [
      { label: 'URL', type: 'text' },
      { label: 'Label (display text)', type: 'text' },
    ]);
    const dlAddBtn = document.createElement('button');
    dlAddBtn.textContent = '+ Add Download'; dlAddBtn.style.cssText = S.addBtn;
    dlAddBtn.addEventListener('click', () => dlEditor.addRow());
    const dlWrap = document.createElement('div');
    dlWrap.appendChild(dlCont); dlWrap.appendChild(dlAddBtn);
    container.appendChild(fieldBlock('Download Links', dlWrap));

    return () => ({
      title:             isNewPage ? (document.getElementById('new-page-title-input')?.value.trim() || '') : undefined,
      type:              tagSel.value || (parsedFM.type || ''),
      tags:              tagsCheck.getValues().length ? tagsCheck.getValues() : (parsedFM.tags || []),
      startDate:         readDateSelects(startDateEl),
      endDate:           readDateSelects(endDateEl),
      pageThumbnailFile: thumbInp.value.trim(),
      downloadLinks:     dlEditor.getValues(),
      _newPageTag:       tagSel.value, // used by new-page save logic
    });
  }

  let EDITOR_DROPDOWNS = { stages: [], remodels: [], animatronics: [], showtapeFormats: [] };
  (async () => {
    try {
      const res = await fetch('/data/editor_dropdowns.json');
      if (res.ok) EDITOR_DROPDOWNS = await res.json();
    } catch (e) { console.warn('Could not load editor_dropdowns.json', e); }
  })();

  function buildLocationUI(container) {
    container.innerHTML = '';
    const snInp   = textInput(parsedFM.storeNumber || '', 'e.g. 3');
    container.appendChild(fieldBlock('Store Number', snInp));
    const sqftInp = textInput(parsedFM.sqft || '', 'e.g. 10,000');
    container.appendChild(fieldBlock('Square Footage', sqftInp));
    const coords  = parsedFM.latitudeLongitude || [];
    const latInp  = textInput(coords[0] || '', 'Latitude  e.g. 37.96875');
    const lngInp  = textInput(coords[1] || '', 'Longitude  e.g. -122.057');
    const coordRow = document.createElement('div');
    coordRow.style.cssText = 'display:flex; gap:0.5rem;';
    coordRow.appendChild(latInp); coordRow.appendChild(lngInp);
    container.appendChild(fieldBlock('Latitude / Longitude', coordRow));
    function pipedSection(label, fmKey, fieldDefs) {
      const cont   = document.createElement('div');
      const ed     = makePipedArrayEditor(cont, parsedFM[fmKey] || [], fieldDefs);
      const addBtn = document.createElement('button');
      addBtn.textContent = `+ Add ${label}`; addBtn.style.cssText = S.addBtn;
      addBtn.addEventListener('click', () => ed.addRow());
      const wrap = document.createElement('div');
      wrap.appendChild(cont); wrap.appendChild(addBtn);
      container.appendChild(fieldBlock(label, wrap));
      return ed;
    }
    const remodelsEd = pipedSection('Remodel', 'remodels', [
      { label: 'Remodel Name', type: 'dropdown', dropdownKey: 'remodels' },
      { label: 'Date',         type: 'date' },
    ]);
    const stagesEd = pipedSection('Stage', 'stages', [
      { label: 'Stage Name', type: 'dropdown', dropdownKey: 'stages' },
      { label: 'Start Date', type: 'date' },
      { label: 'End Date',   type: 'date' },
      { label: 'Notes',      type: 'text' },
    ]);
    const franchEd = pipedSection('Franchisee', 'franchisees', [
      { label: 'Franchisee Name', type: 'text' },
      { label: 'Start Date',      type: 'date' },
      { label: 'End Date',        type: 'date' },
    ]);
    const animEd = pipedSection('Animatronic', 'animatronics', [
      { label: 'Animatronic Name',    type: 'dropdown', dropdownKey: 'animatronics' },
      { label: 'Start Date',          type: 'date' },
      { label: 'End Date',            type: 'date' },
      { label: 'Serial Number',       type: 'text' },
      { label: 'Notes / Whereabouts', type: 'textarea' },
    ]);
    const attrEd = pipedSection('Attraction / Arcade Game', 'attractions', [
      { label: 'Name',       type: 'text' },
      { label: 'Start Date', type: 'date' },
      { label: 'End Date',   type: 'date' },
      { label: 'Notes',      type: 'textarea' },
    ]);
    return () => ({
      storeNumber:       snInp.value.trim(),
      sqft:              sqftInp.value.trim(),
      latitudeLongitude: [latInp.value.trim(), lngInp.value.trim()].filter(Boolean),
      remodels:          remodelsEd.getValues(),
      stages:            stagesEd.getValues(),
      franchisees:       franchEd.getValues(),
      animatronics:      animEd.getValues(),
      attractions:       attrEd.getValues(),
    });
  }

  function buildShowtapeUI(container) {
    container.innerHTML = '';
    const durationInp = textInput(parsedFM.mediaDuration || '', 'e.g. 42:52');
    container.appendChild(fieldBlock('Media Duration', durationInp, 'Total runtime in MM:SS format.'));
    const fmtCont   = document.createElement('div');
    const fmtEditor = makePipedArrayEditor(fmtCont, (parsedFM.showtapeFormats || []).map(v => v), [
      { label: 'Format', type: 'dropdown', dropdownKey: 'showtapeFormats' },
    ]);
    const fmtAddBtn = document.createElement('button');
    fmtAddBtn.textContent = '+ Add Format'; fmtAddBtn.style.cssText = S.addBtn;
    fmtAddBtn.addEventListener('click', () => fmtEditor.addRow());
    const fmtWrap = document.createElement('div');
    fmtWrap.appendChild(fmtCont); fmtWrap.appendChild(fmtAddBtn);
    container.appendChild(fieldBlock('Showtape Formats', fmtWrap, 'Formats a tape released in.'));
    const transCont   = document.createElement('div');
    const transEditor = makeStringArrayEditor(transCont, parsedFM.transcriptions || []);
    const transAddBtn = document.createElement('button');
    transAddBtn.textContent = '+ Add Transcription'; transAddBtn.style.cssText = S.addBtn;
    transAddBtn.addEventListener('click', () => transEditor.addRow());
    const transWrap = document.createElement('div');
    transWrap.appendChild(transCont); transWrap.appendChild(transAddBtn);
    container.appendChild(fieldBlock('Transcriptions', transWrap, 'Titles of transcription pages to link to this page.'));
    const akaCont   = document.createElement('div');
    const akaEditor = makeStringArrayEditor(akaCont, parsedFM.alsoKnownAs || []);
    const akaAddBtn = document.createElement('button');
    akaAddBtn.textContent = '+ Add Alias'; akaAddBtn.style.cssText = S.addBtn;
    akaAddBtn.addEventListener('click', () => akaEditor.addRow());
    const akaWrap = document.createElement('div');
    akaWrap.appendChild(akaCont); akaWrap.appendChild(akaAddBtn);
    container.appendChild(fieldBlock('Also Known As', akaWrap, 'Alternative titles or full label transcriptions.'));
    return () => ({
      mediaDuration:   durationInp.value.trim(),
      ...(parsedFM.cuDate ? { cuDate: parsedFM.cuDate } : {}),
      showtapeFormats: fmtEditor.getValues(),
      transcriptions:  transEditor.getValues(),
      alsoKnownAs:     akaEditor.getValues(),
    });
  }

  function buildProductsUI(container) {
    container.innerHTML = '';
    const dimInp  = textInput(parsedFM.dimensions || '', 'e.g. 12" x 8" x 4"');
    container.appendChild(fieldBlock('Dimensions', dimInp));
    const wsInp   = textInput(parsedFM.wholesalePrice || '', 'e.g. $14.99');
    container.appendChild(fieldBlock('Wholesale Price', wsInp));
    const mfgInp  = textInput(parsedFM.manufacturer || '', 'e.g. Dennis Foland');
    container.appendChild(fieldBlock('Manufacturer', mfgInp));
    const rawPrices = (parsedFM.prices || []).map(v => v.replace(/^\(|\)$/g, ''));
    const pricesCont   = document.createElement('div');
    const pricesEditor = makePipedArrayEditor(pricesCont, rawPrices, [
      { label: 'Price',              type: 'text' },
      { label: 'Date (approximate)', type: 'date' },
    ]);
    const pricesAddBtn = document.createElement('button');
    pricesAddBtn.textContent = '+ Add Price'; pricesAddBtn.style.cssText = S.addBtn;
    pricesAddBtn.addEventListener('click', () => pricesEditor.addRow());
    const pricesWrap = document.createElement('div');
    pricesWrap.appendChild(pricesCont); pricesWrap.appendChild(pricesAddBtn);
    container.appendChild(fieldBlock('Prices', pricesWrap, 'Known retail prices at a given point in time.'));
    const salesCont   = document.createElement('div');
    const salesEditor = makePipedArrayEditor(salesCont, parsedFM.sales || [], [
      { label: 'Price',        type: 'text' },
      { label: 'Date of Sale', type: 'date' },
      { label: 'Archived URL', type: 'text' },
    ]);
    const salesAddBtn = document.createElement('button');
    salesAddBtn.textContent = '+ Add Sale'; salesAddBtn.style.cssText = S.addBtn;
    salesAddBtn.addEventListener('click', () => salesEditor.addRow());
    const salesWrap = document.createElement('div');
    salesWrap.appendChild(salesCont); salesWrap.appendChild(salesAddBtn);
    container.appendChild(fieldBlock('Sales', salesWrap, 'Recorded sales with price, date, and archived listing URL. PLEASE keep in mind that eBay listings need to be archived on archive.org first.'));
    return () => ({
      dimensions:    dimInp.value.trim(),
      wholesalePrice: wsInp.value.trim(),
      manufacturer:  mfgInp.value.trim(),
      prices:        pricesEditor.getValues().map(v => `(${v})`),
      sales:         salesEditor.getValues(),
    });
  }

  // ─── CITATIONS UI ─────────────────────────────────────────────────────────

  let citationsGetValues = null;

  function buildCitationsUI() {
    const container = document.getElementById('citations-editor');
    if (!container) return;
    container.innerHTML = '';
    const hint = document.getElementById('cite-hint');
    if (hint) hint.textContent = '{{< cite N >}}';
    const items = parsedFM.citations || [];
    function addCitRow(val, idx) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:0.5rem; margin-bottom:0.5rem; align-items:center;';
      const num = document.createElement('span');
      num.style.cssText = 'color:var(--yellow); font-family:var(--font-display); min-width:1.5rem; text-align:right; padding-top:0.4rem;';
      num.textContent = (idx + 1) + '.';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = val || '';
      inp.placeholder = 'https://…';
      inp.style.cssText = S.input + 'flex:1;';
      const rm = document.createElement('button');
      rm.textContent = '✕'; rm.style.cssText = S.removeBtn;
      rm.addEventListener('click', () => {
        row.remove();
        Array.from(container.querySelectorAll('.cit-num')).forEach((n, i) => { n.textContent = (i + 1) + '.'; });
      });
      num.classList.add('cit-num');
      row.appendChild(num); row.appendChild(inp); row.appendChild(rm);
      container.appendChild(row);
    }
    items.forEach((v, i) => addCitRow(v, i));
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Add Citation'; addBtn.style.cssText = S.addBtn;
    addBtn.addEventListener('click', () => {
      const count = container.querySelectorAll('.cit-num').length;
      addCitRow('', count);
    });
    container.appendChild(addBtn);
    citationsGetValues = () => Array.from(container.querySelectorAll('input')).map(i => i.value.trim()).filter(Boolean);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────

  // Tab system
  document.querySelectorAll('#edit-tabs .tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#edit-tabs .tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#edit-tabs .tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  await loadMarkdownFile();

  // ─── SAVE HELPERS ─────────────────────────────────────────────────────────

  function setSaveProgress(step, status) {
    const el = document.getElementById(`save-progress-${step}`);
    if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
  }

  // ─── NEW PAGE FRONTMATTER BUILDER ─────────────────────────────────────────

  function buildNewPageFrontmatter(title, tag, startDate, extraFields) {
    const today     = new Date();
    const todayStr  = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const username  = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    let fm = `title = "${toTomlStr(title)}"`;
    fm += `\nstartDate = "${startDate || todayStr}"`;
    fm += `\ncontributors = ["${toTomlStr(username)}"]`;
    if (tag) fm += `\ntags = ["${toTomlStr(tag)}"]`;
    if (extraFields) {
      for (const [key, value] of Object.entries(extraFields)) {
        // Skip private/internal keys (prefixed with _), and keys already written above
        if (key.startsWith('_') || key === 'title' || key === 'startDate' || key === 'contributors' || key === 'tags') continue;
        if (value === '' || value == null) continue;
        if (Array.isArray(value)) {
          const serialized = INLINE_ARRAY_KEYS.has(key) ? tomlInlineArray(value) : tomlStringArray(value);
          fm += `\n${key} = ${serialized}`;
        } else {
          fm += `\n${key} = "${toTomlStr(String(value))}"`;
        }
      }
    }
    fm += '\ndraft = false';
    return fm;
  }

  function buildNewPageFrontmatterTheoryweb(title, startDate) {
    const username = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    return `title = "${toTomlStr(title)}"\nstartDate = "${startDate}"\ncontributors = ["${toTomlStr(username)}"]\ntype = "Theories"\ndraft = false`;
  }

  // ─── DETERMINE NEW PAGE PATH ───────────────────────────────────────────────

  function resolveNewPagePath(tag) {
    const filename = generateRandomFilename();
    if (isTheoryweb) {
      return `content/theoryweb/${filename}.md`;
    }
    const folder = getFolderForTag(tag);
    return `${folder}/${filename}.md`;
  }

  // ─── CORE SAVE ────────────────────────────────────────────────────────────

  async function doSave(newFrontmatter, bodyMarkdown, overridePath) {
    await doSaveWithExtras(newFrontmatter, bodyMarkdown, overridePath, []);
  }

  // doSaveWithExtras: commits the .md file plus any extra binary files (e.g. avif uploads)
  // extraFiles: [{ path: 'static/photos/xyz.avif', base64: '...' }]
  async function doSaveWithExtras(newFrontmatter, bodyMarkdown, overridePath, extraFiles) {
    if (!await ensureOctokit()) return;
    const username  = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    let   fm        = isNewPage ? newFrontmatter : updateContributors(newFrontmatter, username);
    fm              = ensureDraftFalse(fm);
    fm              = normalizeFrontmatter(fm);
    const full      = `+++\n${fm}\n+++\n${bodyMarkdown}`;
    const savePath  = overridePath || currentPagePath;
    document.getElementById('save-progress-modal').style.display = 'block';
    try {
      await saveToGitHub(full, savePath, extraFiles || []);
    } catch (error) {
      document.getElementById('save-progress').style.display = 'none';
      document.getElementById('save-error').style.display = 'block';
      document.getElementById('save-error-message').textContent = error.message;
    }
  }

  // ─── CONTENT SAVE ─────────────────────────────────────────────────────────

  // ─── THEORYWEB CONTENT COLLECTOR ─────────────────────────────────────────
  // Returns { fm, body, extraFiles } where extraFiles is [] or [{ path, base64 }]
  // for the Images type which needs to commit the avif alongside the .md

  async function collectTheorywebSaveData(vals, mdPath) {
    const type  = vals.type || 'Theories';
    const title = vals.title || currentPageTitle || '';
    const username = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
    let fm = isNewPage
      ? `title = "${toTomlStr(title)}"
startDate = "${vals.startDate || '0000-00-00'}"
contributors = ["${toTomlStr(username)}"]
type = "${toTomlStr(type)}"
draft = false`
      : updateContributors(originalFrontmatter, username);

    // Apply standard FM updates for non-new-page
    if (!isNewPage) {
      fm = applyFMUpdates(fm, {
        startDate: vals.startDate,
        type,
        ...(vals.tags      ? { tags:      vals.tags }      : {}),
        ...(vals.videoLink ? { videoLink: vals.videoLink } : {}),
      });
    } else {
      // new page: inject type-specific fields
      if (vals.tags && vals.tags.length)
        fm += `\ntags = ${tomlInlineArray(vals.tags)}`;
      if (vals.videoLink)
        fm += `
videoLink = "${toTomlStr(vals.videoLink)}"`;
    }
    fm = ensureDraftFalse(fm);

    let body       = '';
    let extraFiles = [];

    if (type === 'Images') {
      const ocrMount = document.getElementById('tw-ocr-mount');
      if (!ocrMount || !ocrMount._getOcrContent) {
        alert('OCR editor not loaded. Switch to the Content tab and set up the image first.');
        return null;
      }

      if (twPendingFile) {
        // Upload new image — generate random filename
        const randomName = generateRandomFilename() + '.avif';
        // Read as base64
        const base64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload  = () => res(reader.result.split(',')[1]);
          reader.onerror = rej;
          reader.readAsDataURL(twPendingFile);
        });
        extraFiles.push({ path: 'static/photos/' + randomName, base64 });
        // Store so the OCR content generator uses the right filename
        ocrMount.dataset.pendingFilename = randomName;
        // Also update FM pageThumbnailFile
        fm = setFMKey(fm, 'pageThumbnailFile', `"${toTomlStr(randomName)}"`);
      } else if (twImageFilename) {
        // Re-using existing image — ensure FM still has it
        if (!isNewPage) fm = setFMKey(fm, 'pageThumbnailFile', `"${toTomlStr(twImageFilename)}"`);
      }

      body = ocrMount._getOcrContent();
    } else if (type === 'Videos') {
      body = editor ? editor.getMarkdown() : '';
    } else {
      // Theories
      body = editor ? editor.getMarkdown() : '';
    }

    return { fm, body, extraFiles };
  }

  document.getElementById('save-changes-btn').addEventListener('click', async () => {
    if (isNewPage) {
      let title, tag, newPath;
      if (isTheoryweb) {
        const vals = fmTheorywebGetValues ? fmTheorywebGetValues() : {};
        title = vals.title || '';
        if (!title) { alert('Please enter a title.'); return; }
        newPath = resolveNewPagePath(null);
        const data = await collectTheorywebSaveData(vals, newPath);
        if (!data) return;
        await doSaveWithExtras(data.fm, data.body, newPath, data.extraFiles);
      } else {
        const vals = fmGeneralGetValues ? fmGeneralGetValues() : {};
        title     = vals.title || '';
        tag       = vals._newPageTag || '';
        if (!title) { alert('Please enter a title for the new page.'); return; }
        if (!tag)   { alert('Please select a tag to determine the page folder.'); return; }
        newPath   = resolveNewPagePath(tag);
        const fm  = buildNewPageFrontmatter(title, tag, vals.startDate || '0000-00-00', {
          endDate:           vals.endDate,
          pageThumbnailFile: vals.pageThumbnailFile,
          downloadLinks:     vals.downloadLinks,
          tags:              vals.tags,
        });
        await doSave(fm, editor.getMarkdown(), newPath);
      }
    } else if (isTheoryweb) {
      const vals = fmTheorywebGetValues ? fmTheorywebGetValues() : {};
      const data = await collectTheorywebSaveData(vals, currentPagePath);
      if (!data) return;
      await doSaveWithExtras(data.fm, data.body, currentPagePath, data.extraFiles);
    } else {
      let fm = originalFrontmatter;
      if (citationsGetValues) {
        const cits = citationsGetValues();
        fm = setFMKey(fm, 'citations', tomlInlineArray(cits));
      }
      await doSave(fm, editor.getMarkdown());
    }
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    if (confirm('Discard changes?')) location.reload();
  });

  document.getElementById('close-save-modal').addEventListener('click', () => location.reload());

  document.getElementById('retry-save').addEventListener('click', () => {
    document.getElementById('save-error').style.display = 'none';
    document.getElementById('save-progress').style.display = 'block';
    for (let i = 1; i <= 5; i++) setSaveProgress(i, 'loading');
    document.getElementById('save-changes-btn').click();
  });

  // ─── FRONTMATTER SAVES ────────────────────────────────────────────────────

  async function saveFMTab(getValuesFn) {
    if (!getValuesFn) return;
    const updates = getValuesFn();

    if (isTheoryweb) {
      const title = updates.title || currentPageTitle || '';
      if (isNewPage && !title) { alert('Please enter a title first.'); return; }
      const newPath = isNewPage ? resolveNewPagePath(null) : currentPagePath;
      const data = await collectTheorywebSaveData(updates, newPath);
      if (!data) return;
      await doSaveWithExtras(data.fm, data.body, newPath, data.extraFiles);
      return;
    }

    if (isNewPage) {
      const title = updates.title || document.getElementById('new-page-title-input')?.value.trim() || '';
      const tag   = updates._newPageTag || updates.tags?.[0] || '';
      if (!title) { alert('Please enter a title first.'); return; }
      if (!tag)   { alert('Please select a tag first.'); return; }
      const newPath = resolveNewPagePath(tag);
      const fm = buildNewPageFrontmatter(title, tag, updates.startDate || '0000-00-00', updates);
      await doSave(fm, editor ? editor.getMarkdown() : '', newPath);
    } else {
      const newFM = applyFMUpdates(originalFrontmatter, updates);
      await doSave(newFM, editor ? editor.getMarkdown() : '');
    }
  }

  document.getElementById('save-fm-general-btn')?.addEventListener('click',  () => saveFMTab(fmGeneralGetValues));
  document.getElementById('cancel-fm-general-btn')?.addEventListener('click', () => { if (confirm('Discard changes?')) location.reload(); });
  document.getElementById('save-fm-location-btn')?.addEventListener('click',  () => saveFMTab(fmLocationGetValues));
  document.getElementById('cancel-fm-location-btn')?.addEventListener('click', () => { if (confirm('Discard changes?')) location.reload(); });
  document.getElementById('save-fm-showtape-btn')?.addEventListener('click',  () => saveFMTab(fmShowtapeGetValues));
  document.getElementById('cancel-fm-showtape-btn')?.addEventListener('click', () => { if (confirm('Discard changes?')) location.reload(); });
  document.getElementById('save-fm-products-btn')?.addEventListener('click',  () => saveFMTab(fmProductsGetValues));
  document.getElementById('cancel-fm-products-btn')?.addEventListener('click', () => { if (confirm('Discard changes?')) location.reload(); });

  // ─── CUSTOM TOOLBAR ───────────────────────────────────────────────────────

  document.getElementById('insert-wikilink').addEventListener('click', () => {
    const title = prompt('Enter wiki page title:');
    const ob = '{' + '{'; const cb = '}' + '}';
    if (title) editor.insertText(ob + '< wiki-link "' + title + '" >' + cb);
  });

  document.getElementById('insert-citation').addEventListener('click', () => {
    const num = prompt('Enter citation number:', '1');
    const ob = '{' + '{'; const cb = '}' + '}';
    if (num && /^\d+$/.test(num)) editor.insertText(ob + '< cite ' + num + ' >' + cb);
  });

  // ─── GITHUB HELPERS ───────────────────────────────────────────────────────

  async function saveToGitHub(content, filePath, extraFiles) {
    const path = filePath || currentPagePath;
    const pageLabel = isNewPage
      ? (path.split('/').pop().replace('.md',''))
      : currentPageTitle;

    setSaveProgress(1, 'loading');
    await octokit.rest.users.getAuthenticated();
    setSaveProgress(1, 'success');

    setSaveProgress(2, 'loading');
    await ensureFork(octokit, userLogin);
    setSaveProgress(2, 'success');

    setSaveProgress(3, 'loading');
    const prefix = isNewPage ? 'new-page' : 'edit';
    const { branchName, baseSha } = await createBranch(octokit, userLogin, prefix);
    setSaveProgress(3, 'success');

    setSaveProgress(4, 'loading');
    // Build file list: the .md file + any extra binary files (e.g. avif images)
    const allFiles = [{ path, content }];
    for (const ef of (extraFiles || [])) {
      allFiles.push({ path: ef.path, content: null, base64: ef.base64 });
    }
    await commitFilesMulti(octokit, userLogin, branchName, baseSha,
      allFiles,
      isNewPage ? `New page: ${pageLabel}` : `Edit: ${currentPageTitle}`);
    setSaveProgress(4, 'success');

    setSaveProgress(5, 'loading');
    const prTitle = isNewPage ? `New page: ${pageLabel}` : `Edit: ${currentPageTitle}`;
    const prBody  = isNewPage
      ? `## New Page\n\nCreated via web interface.\n\n**File:** \`${path}\``
      : `## Page Edit\n\nEdited via web interface.\n\n**Page:** ${currentPageTitle}\n**File:** \`${currentPagePath}\``;
    const { data: pr } = await octokit.rest.pulls.create({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      title: prTitle,
      head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
      body: prBody,
    });
    setSaveProgress(5, 'success');
    document.getElementById('save-progress').style.display = 'none';
    document.getElementById('save-success').style.display = 'block';
    document.getElementById('save-pr-link').href = pr.html_url;
  }

  async function ensureFork(kit, login) {
    let exists = false;
    try {
      await kit.rest.repos.get({ owner: login, repo: GITHUB_REPO });
      exists = true;
    } catch (e) {
      if (e.status === 404) {
        await kit.rest.repos.createFork({ owner: GITHUB_OWNER, repo: GITHUB_REPO });
        await new Promise(r => setTimeout(r, 5000));
      } else throw e;
    }
    if (exists) {
      try {
        await kit.request('POST /repos/{owner}/{repo}/merge-upstream', {
          owner: login, repo: GITHUB_REPO, branch: GITHUB_BRANCH
        });
      } catch (e) { console.log('Fork sync skipped:', e.message); }
    }
  }

  async function createBranch(kit, login, prefix) {
    const { data: ref } = await kit.rest.git.getRef({
      owner: login, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`
    });
    const baseSha    = ref.object.sha;
    const branchName = `${prefix}-${Date.now()}`;
    await kit.rest.git.createRef({
      owner: login, repo: GITHUB_REPO,
      ref: `refs/heads/${branchName}`, sha: baseSha
    });
    return { branchName, baseSha };
  }

  // Commits one or more files. Each entry: { path, content } for text OR { path, base64 } for binary.
  async function commitFilesMulti(kit, login, branchName, baseSha, files, message) {
    const treeEntries = await Promise.all(files.map(async ({ path, content, base64 }) => {
      const blobContent  = base64 || btoa(unescape(encodeURIComponent(content)));
      const { data: blob } = await kit.rest.git.createBlob({
        owner: login, repo: GITHUB_REPO, content: blobContent, encoding: 'base64'
      });
      return { path, mode: '100644', type: 'blob', sha: blob.sha };
    }));
    const { data: baseCommit } = await kit.rest.git.getCommit({
      owner: login, repo: GITHUB_REPO, commit_sha: baseSha
    });
    const { data: newTree } = await kit.rest.git.createTree({
      owner: login, repo: GITHUB_REPO,
      base_tree: baseCommit.tree.sha, tree: treeEntries
    });
    const { data: newCommit } = await kit.rest.git.createCommit({
      owner: login, repo: GITHUB_REPO,
      message, tree: newTree.sha, parents: [baseSha]
    });
    await kit.rest.git.updateRef({
      owner: login, repo: GITHUB_REPO,
      ref: `heads/${branchName}`, sha: newCommit.sha
    });
    return newCommit;
  }

  // ─── REVIEW MODAL ─────────────────────────────────────────────────────────
  // Not available on TheoryWeb

  if (!isTheoryweb) {
    const reviewModal = document.getElementById('review-modal');

    function showReviewStep(num) {
      document.querySelectorAll('#review-modal .step').forEach(s => s.style.display = 'none');
      document.getElementById(`review-step-${num}`).style.display = 'block';
    }

    document.getElementById('write-review-btn')?.addEventListener('click', async () => {
      if (!await ensureOctokit()) return;
      const name = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
      document.getElementById('review-author-note').textContent =
        `Submitting under ${name} — you can change this in the bottom right settings.`;
      reviewModal.style.display = 'block';
      showReviewStep(1);
    });

    document.querySelector('.close-review')?.addEventListener('click', () => { reviewModal.style.display = 'none'; });

    document.getElementById('review-submit')?.addEventListener('click', async () => {
      const recommend = document.querySelector('input[name="review-recommend"]:checked');
      const title     = document.getElementById('review-title').value.trim();
      const body      = document.getElementById('review-body').value.trim();
      if (!recommend) { alert('Please select whether you recommend this.'); return; }
      if (!title)     { alert('Please enter a review title.'); return; }
      if (!body)      { alert('Please write your review.'); return; }
      showReviewStep(2);
      await submitReview();
    });

    document.getElementById('review-done')?.addEventListener('click',  () => { reviewModal.style.display = 'none'; });

    document.getElementById('review-retry')?.addEventListener('click', () => {
      document.getElementById('review-error').style.display = 'none';
      document.getElementById('review-progress').style.display = 'block';
      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`review-prog-${i}`);
        if (el) el.textContent = '⏳';
      }
      submitReview();
    });

    function setReviewProgress(step, status) {
      const el = document.getElementById(`review-prog-${step}`);
      if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
    }

    async function submitReview() {
      try {
        const recommend = document.querySelector('input[name="review-recommend"]:checked').value;
        const title     = document.getElementById('review-title').value.trim();
        const body      = document.getElementById('review-body').value.trim();
        const author    = localStorage.getItem(USERNAME_KEY) || 'Anonymous';
        const today     = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

        setReviewProgress(1, 'loading'); await octokit.rest.users.getAuthenticated(); setReviewProgress(1, 'success');
        setReviewProgress(2, 'loading'); await ensureFork(octokit, userLogin);        setReviewProgress(2, 'success');
        setReviewProgress(3, 'loading');
        const { branchName, baseSha } = await createBranch(octokit, userLogin, 'review');
        setReviewProgress(3, 'success');

        setReviewProgress(4, 'loading');
        const randomName  = Math.random().toString(36).substring(2, 18);
        const fileContent =
`+++
recommend = ${recommend}
title = "${toTomlStr(title)}"
startDate = "${startDate}"
contributors = ["${toTomlStr(author)}"]
type = "Reviews"
tags = ${tomlInlineArray([safeTitle(currentPageTitle), "User-Generated Content"])}
+++
${body}`;
        await commitFilesMulti(octokit, userLogin, branchName, baseSha,
          [{ path: `content/reviews/${randomName}.md`, content: fileContent }],
          `Review: ${currentPageTitle}`);
        setReviewProgress(4, 'success');

        setReviewProgress(5, 'loading');
        const { data: pr } = await octokit.rest.pulls.create({
          owner: GITHUB_OWNER, repo: GITHUB_REPO,
          title: `Review: ${currentPageTitle}`,
          head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
          body: `## Review Submission\n\n**Page:** ${currentPageTitle}\n**Title:** ${title}\n**Recommend:** ${recommend === 'true' ? 'Yes 👍' : 'No 👎'}\n**Author:** ${author}`
        });
        setReviewProgress(5, 'success');
        document.getElementById('review-progress').style.display = 'none';
        document.getElementById('review-success').style.display = 'block';
        document.getElementById('review-pr-link').href = pr.html_url;

      } catch (error) {
        console.error('Review error:', error);
        for (let i = 1; i <= 5; i++) {
          const el = document.getElementById(`review-prog-${i}`);
          if (el && el.textContent === '⏳') { el.textContent = '❌'; break; }
        }
        document.getElementById('review-progress').style.display = 'none';
        document.getElementById('review-error').style.display = 'block';
        document.getElementById('review-error-msg').textContent = error.message;
      }
    }
  }

  // ─── GALLERY MODAL ────────────────────────────────────────────────────────
  // Not available on TheoryWeb

  if (!isTheoryweb) {
    const galleryModal = document.getElementById('gallery-upload-modal');
    let galleryFiles   = [];

    const galleryYear = document.getElementById('gallery-year');
    addOpt(galleryYear, 'present', 'The Present');
    for (let y = new Date().getFullYear(); y >= 1950; y--) addOpt(galleryYear, y, y);
    const galleryDay = document.getElementById('gallery-day');
    for (let d = 1; d <= 31; d++) addOpt(galleryDay, String(d).padStart(2,'0'), d);

    // Disable month/day when "The Present" is selected
    const galleryMonth = document.getElementById('gallery-month');
    galleryYear.addEventListener('change', () => {
      const isPresent = galleryYear.value === 'present';
      galleryMonth.disabled = isPresent;
      galleryDay.disabled   = isPresent;
      galleryMonth.style.opacity = isPresent ? '0.45' : '';
      galleryDay.style.opacity   = isPresent ? '0.45' : '';
    });

    function showGalleryStep(num) {
      document.querySelectorAll('#gallery-upload-modal .step').forEach(s => s.style.display = 'none');
      const el = num === 'citations'
        ? document.getElementById('gallery-step-citations')
        : document.getElementById(`gallery-step-${num}`);
      if (el) el.style.display = 'block';
    }

    document.getElementById('add-to-gallery-btn')?.addEventListener('click', async () => {
      if (!await ensureOctokit()) return;
      // Inject citations step if not already present
      if (!document.getElementById('gallery-step-citations')) {
        const citStep = document.createElement('div');
        citStep.id = 'gallery-step-citations';
        citStep.className = 'step';
        citStep.style.display = 'none';
        citStep.innerHTML = `
          <h3>Citations</h3>
          <p style="font-size:0.85rem; color:#aaa; margin-bottom:0.75rem;">Add any citations/sources for these photos (optional).</p>
          <div id="gallery-citations-list"></div>
          <button id="gallery-add-citation" style="background:var(--aqua);color:var(--white);border:none;border-radius:0.5rem;padding:0.3rem 0.75rem;cursor:pointer;margin-top:0.4rem;font-family:var(--font-display);">+ Add Citation</button>
          <div style="margin-top:1rem;">
            <button id="gallery-back-citations">Back</button>
            <button id="gallery-next-citations" style="margin-left:0.75rem;">Next</button>
          </div>`;
        // Insert before gallery-step-4 (date step)
        const step4 = document.getElementById('gallery-step-4');
        step4?.parentNode.insertBefore(citStep, step4);

        function addGalCitRow() {
          const list = document.getElementById('gallery-citations-list');
          const row = document.createElement('div');
          row.style.cssText = 'display:flex; gap:0.4rem; margin-bottom:0.4rem; align-items:center;';
          const inp = document.createElement('input');
          inp.type = 'text'; inp.placeholder = 'https://…';
          inp.style.cssText = 'flex:1; padding:0.4rem 0.6rem; background:var(--deep-white); color:var(--white); border:0.15rem solid var(--brown); border-radius:0.4rem; font-family:var(--font-body); box-sizing:border-box;';
          const rm = document.createElement('button');
          rm.textContent = '✕';
          rm.style.cssText = 'background:var(--orange);color:var(--white);border:none;border-radius:0.35rem;padding:0.2rem 0.6rem;cursor:pointer;font-family:var(--font-display);';
          rm.addEventListener('click', () => row.remove());
          row.appendChild(inp); row.appendChild(rm);
          list.appendChild(row);
        }
        document.getElementById('gallery-add-citation')?.addEventListener('click', addGalCitRow);
        document.getElementById('gallery-back-citations')?.addEventListener('click', () => showGalleryStep(3));
        document.getElementById('gallery-next-citations')?.addEventListener('click', () => showGalleryStep(4));
      }
      galleryModal.style.display = 'block';
      showGalleryStep(2);
    });
    document.querySelector('.close-gallery')?.addEventListener('click', () => { galleryModal.style.display = 'none'; });

    document.getElementById('gallery-next-2')?.addEventListener('click', () => {
      const files = Array.from(document.getElementById('gallery-image-files').files);
      if (!files.length) { alert('Please select at least one image'); return; }
      if (files.some(f => !f.name.toLowerCase().endsWith('.avif'))) { alert('Only .avif files allowed'); return; }
      galleryFiles = files;
      showGalleryStep(3);
    });
    document.getElementById('gallery-back-2')?.addEventListener('click', () => showGalleryStep(2));
    document.getElementById('gallery-next-3')?.addEventListener('click', () => {
      if (!document.getElementById('gallery-description').value.trim()) { alert('Please enter a description'); return; }
      showGalleryStep('citations');
    });
    document.getElementById('gallery-back-3')?.addEventListener('click', () => showGalleryStep(3));
    document.getElementById('gallery-next-4')?.addEventListener('click', () => { showGalleryStep(5); uploadGalleryImages(); });
    document.getElementById('gallery-done')?.addEventListener('click',   () => location.reload());
    document.getElementById('gallery-retry')?.addEventListener('click',  () => showGalleryStep(2));

    function setGalleryProgress(step, status) {
      const el = document.getElementById(`gallery-prog-${step}`);
      if (el) el.textContent = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
    }

    async function uploadGalleryImages() {
      try {
        const desc    = document.getElementById('gallery-description').value.trim();
        const year    = document.getElementById('gallery-year').value;
        const month   = document.getElementById('gallery-month').value;
        const day     = document.getElementById('gallery-day').value;
        // Empty year means "the present" → empty string; otherwise build date
        const dateStr = year === '' ? '' : `${year||'0000'}-${month||'00'}-${day||'00'}`;
        const citationInputs = document.querySelectorAll('#gallery-citations-list input[type="text"]');
        const citations = Array.from(citationInputs).map(i => i.value.trim()).filter(Boolean);

        setGalleryProgress(1, 'loading'); await octokit.rest.users.getAuthenticated(); setGalleryProgress(1, 'success');
        setGalleryProgress(2, 'loading');
        await ensureFork(octokit, userLogin);
        const { branchName, baseSha } = await createBranch(octokit, userLogin, 'photos');
        setGalleryProgress(2, 'success');

        setGalleryProgress(3, 'loading');
        const fileData   = [];
        const imageBlobs = [];
        for (const file of galleryFiles) {
          const randomName = Math.random().toString(36).substring(2, 18);
          const filename   = `${randomName}.avif`;
          fileData.push({ filename, randomName });
          const base64 = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload  = () => res(reader.result.split(',')[1]);
            reader.onerror = rej;
            reader.readAsDataURL(file);
          });
          const { data: blob } = await octokit.rest.git.createBlob({
            owner: userLogin, repo: GITHUB_REPO, content: base64, encoding: 'base64'
          });
          imageBlobs.push({ path: `static/photos/${filename}`, sha: blob.sha });
        }
        setGalleryProgress(3, 'success');

        setGalleryProgress(4, 'loading');
        const mdFiles = fileData.map(info => ({
          path: `content/photos/${info.randomName}.md`,
          content:
`+++
title = "${toTomlStr(info.filename)}"
startDate = "${dateStr}"
citations = ${tomlInlineArray(citations)}
type = "Photos"
tags = ${tomlInlineArray([safeTitle(currentPageTitle), ...(currentPageTags || [])])}
+++
${desc}`
        }));

        const { data: baseCommit } = await octokit.rest.git.getCommit({
          owner: userLogin, repo: GITHUB_REPO, commit_sha: baseSha
        });
        const mdBlobEntries = await Promise.all(mdFiles.map(async f => {
          const b64 = btoa(unescape(encodeURIComponent(f.content)));
          const { data: blob } = await octokit.rest.git.createBlob({
            owner: userLogin, repo: GITHUB_REPO, content: b64, encoding: 'base64'
          });
          return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha };
        }));
        const treeEntries = [
          ...imageBlobs.map(b => ({ path: b.path, mode: '100644', type: 'blob', sha: b.sha })),
          ...mdBlobEntries
        ];
        const { data: newTree } = await octokit.rest.git.createTree({
          owner: userLogin, repo: GITHUB_REPO, base_tree: baseCommit.tree.sha, tree: treeEntries
        });
        const { data: newCommit } = await octokit.rest.git.createCommit({
          owner: userLogin, repo: GITHUB_REPO,
          message: `Add ${fileData.length} photo(s): ${desc.substring(0, 50)}`,
          tree: newTree.sha, parents: [baseSha]
        });
        await octokit.rest.git.updateRef({
          owner: userLogin, repo: GITHUB_REPO, ref: `heads/${branchName}`, sha: newCommit.sha
        });
        setGalleryProgress(4, 'success');
        setGalleryProgress(5, 'loading'); setGalleryProgress(5, 'success');

        setGalleryProgress(6, 'loading');
        const { data: pr } = await octokit.rest.pulls.create({
          owner: GITHUB_OWNER, repo: GITHUB_REPO,
          title: `Add photos to ${currentPageTitle}`,
          head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
          body: `## Photo Submission\n\n**Description:** ${desc}\n**Date:** ${dateStr}\n**Page:** ${currentPageTitle}\n\n**Files:** ${fileData.length} photo(s)`
        });
        setGalleryProgress(6, 'success');
        document.getElementById('gallery-progress').style.display = 'none';
        document.getElementById('gallery-success').style.display = 'block';
        document.getElementById('gallery-pr-link').href = pr.html_url;

      } catch (error) {
        console.error('Gallery upload error:', error);
        document.getElementById('gallery-progress').style.display = 'none';
        document.getElementById('gallery-error').style.display = 'block';
        document.getElementById('gallery-error-msg').textContent = error.message;
      }
    }
  }

  // ── Video submission modal ─────────────────────────────────────────────────
  {
    const videoModal = document.getElementById('video-upload-modal');
    if (videoModal) {
      const videoYear  = document.getElementById('video-year');
      const videoMonth = document.getElementById('video-month');
      const videoDay   = document.getElementById('video-day');

      addOpt(videoYear, 'present', 'The Present');
      for (let y = new Date().getFullYear(); y >= 1950; y--) addOpt(videoYear, y, y);
      for (let d = 1; d <= 31; d++) addOpt(videoDay, String(d).padStart(2,'0'), d);

      videoYear.addEventListener('change', () => {
        const isPresent = videoYear.value === 'present';
        videoMonth.disabled = isPresent;
        videoDay.disabled   = isPresent;
        videoMonth.style.opacity = isPresent ? '0.45' : '';
        videoDay.style.opacity   = isPresent ? '0.45' : '';
      });

      function showVideoStep(num) {
        videoModal.querySelectorAll('.step').forEach(s => s.style.display = 'none');
        const el = document.getElementById(`video-step-${num}`);
        if (el) el.style.display = 'block';
      }

      function addVideoMirrorRow() {
        const list = document.getElementById('video-mirrors-list');
        const row  = document.createElement('div');
        row.style.cssText = 'display:flex;gap:0.4rem;margin-bottom:0.4rem;';
        row.innerHTML = `<input type="text" placeholder="https://youtu.be/..." style="flex:1;padding:0.3rem 0.5rem;background:var(--dark2);color:var(--white);border:1px solid var(--dark3);border-radius:0.4rem;font-family:var(--font-display);font-size:0.85rem;">
          <button style="background:var(--red);color:var(--white);border:none;border-radius:0.4rem;padding:0.2rem 0.6rem;cursor:pointer;font-family:var(--font-display);">✕</button>`;
        row.querySelector('button').addEventListener('click', () => row.remove());
        list.appendChild(row);
      }

      function addVideoCitRow() {
        const list = document.getElementById('video-citations-list');
        const row  = document.createElement('div');
        row.style.cssText = 'display:flex;gap:0.4rem;margin-bottom:0.4rem;';
        row.innerHTML = `<input type="text" placeholder="https://..." style="flex:1;padding:0.3rem 0.5rem;background:var(--dark2);color:var(--white);border:1px solid var(--dark3);border-radius:0.4rem;font-family:var(--font-display);font-size:0.85rem;">
          <button style="background:var(--red);color:var(--white);border:none;border-radius:0.4rem;padding:0.2rem 0.6rem;cursor:pointer;font-family:var(--font-display);">✕</button>`;
        row.querySelector('button').addEventListener('click', () => row.remove());
        list.appendChild(row);
      }

      document.getElementById('add-video-btn')?.addEventListener('click', () => {
        videoModal.style.display = 'block';
        showVideoStep(1);
      });

      document.querySelector('.close-video')?.addEventListener('click', () => {
        videoModal.style.display = 'none';
      });

      document.getElementById('video-next-1')?.addEventListener('click', () => {
        const url = document.getElementById('video-url').value.trim();
        if (!url) { alert('Please enter a video URL'); return; }
        showVideoStep(2);
      });

      document.getElementById('video-back-1')?.addEventListener('click', () => {
        videoModal.style.display = 'none';
      });

      document.getElementById('video-next-2')?.addEventListener('click', () => {
        if (!document.getElementById('video-description').value.trim()) { alert('Please enter a description'); return; }
        showVideoStep(3);
      });
      document.getElementById('video-back-2')?.addEventListener('click', () => showVideoStep(1));

      document.getElementById('video-next-3')?.addEventListener('click', () => showVideoStep(4));
      document.getElementById('video-back-3')?.addEventListener('click', () => showVideoStep(2));

      document.getElementById('video-add-mirror')?.addEventListener('click', addVideoMirrorRow);
      document.getElementById('video-add-citation')?.addEventListener('click', addVideoCitRow);

      document.getElementById('video-back-4')?.addEventListener('click', () => showVideoStep(3));
      document.getElementById('video-next-4')?.addEventListener('click', () => { showVideoStep(5); uploadVideo(); });
      document.getElementById('video-done')?.addEventListener('click',   () => location.reload());
      document.getElementById('video-retry')?.addEventListener('click',  () => showVideoStep(1));

      function setVideoProgress(step, status) {
        const el = document.getElementById(`video-prog-${step}`);
        if (el) el.textContent = status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌';
      }

      async function uploadVideo() {
        try {
          const url       = document.getElementById('video-url').value.trim();
          const desc      = document.getElementById('video-description').value.trim();
          const year      = videoYear.value;
          const month     = videoMonth.value;
          const day       = videoDay.value;
          const dateStr   = year === 'present' || year === '' ? '' : `${year||'0000'}-${month||'00'}-${day||'00'}`;

          const mirrorInputs   = document.querySelectorAll('#video-mirrors-list input[type="text"]');
          const citationInputs = document.querySelectorAll('#video-citations-list input[type="text"]');
          const mirrors   = Array.from(mirrorInputs).map(i => i.value.trim()).filter(Boolean);
          const citations = Array.from(citationInputs).map(i => i.value.trim()).filter(Boolean);

          const randomName = Math.random().toString(36).substring(2, 18);

          setVideoProgress(1, 'loading'); await octokit.rest.users.getAuthenticated(); setVideoProgress(1, 'success');
          setVideoProgress(2, 'loading');
          await ensureFork(octokit, userLogin);
          const { branchName, baseSha } = await createBranch(octokit, userLogin, 'videos');
          setVideoProgress(2, 'success');

          setVideoProgress(3, 'loading');
          const mdContent =
`+++
title = "${toTomlStr(url)}"
startDate = "${dateStr}"
${citations.length ? `citations = ${tomlInlineArray(citations)}\n` : ''}${mirrors.length ? `mirroredLinks = ${tomlInlineArray(mirrors)}\n` : ''}type = "Videos"
tags = ${tomlInlineArray([safeTitle(currentPageTitle), ...(currentPageTags || [])])}
+++
${desc}`;

          const b64 = btoa(unescape(encodeURIComponent(mdContent)));
          const { data: blob } = await octokit.rest.git.createBlob({
            owner: userLogin, repo: GITHUB_REPO, content: b64, encoding: 'base64'
          });

          const { data: baseCommit } = await octokit.rest.git.getCommit({
            owner: userLogin, repo: GITHUB_REPO, commit_sha: baseSha
          });
          const { data: newTree } = await octokit.rest.git.createTree({
            owner: userLogin, repo: GITHUB_REPO,
            base_tree: baseCommit.tree.sha,
            tree: [{ path: `content/videos/${randomName}.md`, mode: '100644', type: 'blob', sha: blob.sha }]
          });
          const { data: newCommit } = await octokit.rest.git.createCommit({
            owner: userLogin, repo: GITHUB_REPO,
            message: `Add video: ${desc.substring(0, 60)}`,
            tree: newTree.sha, parents: [baseSha]
          });
          await octokit.rest.git.updateRef({
            owner: userLogin, repo: GITHUB_REPO, ref: `heads/${branchName}`, sha: newCommit.sha
          });
          setVideoProgress(3, 'success');
          setVideoProgress(4, 'loading'); setVideoProgress(4, 'success');

          setVideoProgress(5, 'loading');
          const { data: pr } = await octokit.rest.pulls.create({
            owner: GITHUB_OWNER, repo: GITHUB_REPO,
            title: `Add video to ${currentPageTitle}`,
            head: `${userLogin}:${branchName}`, base: GITHUB_BRANCH,
            body: `## Video Submission\n\n**URL:** ${url}\n**Description:** ${desc}\n**Date:** ${dateStr}\n**Page:** ${currentPageTitle}${mirrors.length ? `\n**Alternate URLs:** ${mirrors.join(', ')}` : ''}`
          });
          setVideoProgress(5, 'success');
          document.getElementById('video-progress').style.display = 'none';
          document.getElementById('video-success').style.display = 'block';
          document.getElementById('video-pr-link').href = pr.html_url;

        } catch (error) {
          console.error('Video upload error:', error);
          document.getElementById('video-progress').style.display = 'none';
          document.getElementById('video-error').style.display = 'block';
          document.getElementById('video-error-msg').textContent = error.message;
        }
      }
    }
  }

})();