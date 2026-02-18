document.addEventListener("DOMContentLoaded", () => {
  // --- DATA STORAGE ---
  let DOCS = [], TAGS_BY_PAGE = {}, PAGES_BY_TAG = {}, TAG_COUNTS = {}, ALL_TAGS = [];
  const DOC_TAGS = {}; // map normalized page path -> [tags]
  const SEARCH_TABS = ["tab-articles", "tab-photos", "tab-videos", "tab-reviews"];
  
  // Store both tags and fuzzy terms as unified chips
  let searchChips = []; // Array of {type: 'tag'|'fuzzy', value: string, negative: bool}
  let searchTimer = null;

  // --- DOM ELEMENTS ---
  const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
  const tagInput = document.getElementById("tag-input");
  const tagChipContainer = document.getElementById("tag-chip-container");
  const tagSuggestions = document.getElementById("tag-suggestions");
  const listArticles = document.getElementById("list-articles");
  const listPhotos = document.getElementById("list-photos");
  const listVideos = document.getElementById("list-videos");
  const listReviews = document.getElementById("list-reviews");
  const resultsPerSelect = document.getElementById("results-per-section");
  const articlesSortSelect = document.getElementById("articles-sort");
  const keepTagsCheckbox = document.getElementById("keep-tags-visible");
  const collapsible = document.getElementById("search-collapsible");

  // --- Helpers for path normalization & permalinks ---
  function normalizePageKey(raw) {
    if (!raw) return "";
    let p = (typeof raw === "object") ? (raw.path || "") : String(raw);
    p = p.trim();
    if (/^https?:\/\//i.test(p)) return p;
    if (p.startsWith("/")) p = p.slice(1);
    if (p.startsWith("content/")) p = p.slice("content/".length);
    if (p.endsWith("/")) p = p.slice(0, -1);
    p = p.replace(/\.(md|markdown|mdown)$/i, "");
    return p;
  }

  function makePermalink(rawPath) {
    if (!rawPath) return "#";
    if (/^https?:\/\//i.test(rawPath)) return rawPath;
    const key = normalizePageKey(rawPath);
    if (!key) return "/";
    if (key === "_index" || key === "") return "/";
    return "/" + key + (key.endsWith("/") ? "" : "/");
  }

  // --- collapsible open-once ---
  let opened = false;
  function openOnce() {
    if (!collapsible || opened) return;
    opened = true;
    collapsible.style.maxHeight = collapsible.scrollHeight + "px";
    collapsible.addEventListener("transitionend", () => {
      collapsible.style.maxHeight = "none";
    }, { once: true });
  }
  
  if (tagInput) {
    tagInput.addEventListener("click", openOnce);
    tagInput.addEventListener("focus", openOnce);
  }
  
  if (tagChipContainer) {
    tagChipContainer.addEventListener("click", (e) => {
      if (e.target.closest(".tag-chip-close")) return;
      if (tagInput) {
        tagInput.focus();
        openOnce();
      }
    });
  }

  // --- Basic text utilities ---
  const reNonWord = /[^\w\s]/g, reSpace = /\s+/g;
  function normalizeText(s) { 
    return s ? String(s).toLowerCase().replace(reNonWord, " ").replace(reSpace, " ").trim() : ""; 
  }
  function tokenize(s) { 
    return s ? normalizeText(s).split(/\s+/).filter(Boolean) : []; 
  }
  function charTrigrams(s) { 
    s = "  " + normalizeText(s) + "  "; 
    const out = new Set(); 
    for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3)); 
    return out; 
  }
  function jaccard(a, b) { 
    if (!a.size || !b.size) return 0; 
    let inter = 0; 
    for (const x of a) if (b.has(x)) inter++; 
    return inter / (a.size + b.size - inter); 
  }
  function escapeHtml(s) { 
    return s ? String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;") : ""; 
  }

  // --- Tab activation helper ---
  function activateTab(containerId, panelId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const btns = Array.from(container.querySelectorAll(".tab-button"));
    const panels = Array.from(container.querySelectorAll(".tab-panel"));
    btns.forEach(b => b.classList.toggle("active", b.dataset.tab === panelId));
    panels.forEach(p => p.classList.toggle("active", p.id === panelId));
  }
  tabButtons.forEach(b => b.addEventListener("click", () => activateTab("results-tabs", b.dataset.tab)));

  // --- Load JSON data and normalize keys ---
  async function loadSearchData() {
    const [docsRes, tagsRes, pagsRes, countsRes] = await Promise.all([
      fetch("/data/search/docs.json"),
      fetch("/data/tags/tags_by_page.json"),
      fetch("/data/tags/pages_by_tag.json"),
      fetch("/data/tags/tag_counts.json")
    ]);
    DOCS = await docsRes.json();
    TAGS_BY_PAGE = await tagsRes.json();
    PAGES_BY_TAG = await pagsRes.json();
    TAG_COUNTS = await countsRes.json();

    ALL_TAGS = Object.keys(TAG_COUNTS || {}).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));

    DOCS.forEach(doc => {
      const text = [doc.title || "", doc.excerpt || "", doc.content || "", doc.summary || ""].join(" ");
      doc.tokens = doc.tokens || Array.from(new Set(tokenize(text)));
      doc.trigrams = doc.trigrams || Array.from(charTrigrams(text));
      if (doc.path) doc.path = normalizePageKey(doc.path);
    });

    for (const rawKey in TAGS_BY_PAGE) {
      const normKey = normalizePageKey(rawKey);
      DOC_TAGS[normKey] = TAGS_BY_PAGE[rawKey] || [];
    }

    document.querySelectorAll(".predef-tag-btn").forEach(b => 
      b.addEventListener("click", function(){ addChip('tag', this.dataset.tag, false); })
    );
  }

  // --- Unified chip management ---
  function addChip(type, value, negative=false) {
    if (!value) return;
    
    // For tags, find canonical form
    if (type === 'tag') {
      const found = ALL_TAGS.find(t => t.toLowerCase() === value.toLowerCase());
      value = found || value;
    }
    
    // Check if already exists
    const idx = searchChips.findIndex(c => 
      c.type === type && 
      c.value.toLowerCase() === value.toLowerCase() && 
      c.negative === negative
    );
    if (idx !== -1) return;
    
    // Remove opposite (positive/negative) if exists
    const opp = searchChips.findIndex(c => 
      c.type === type && 
      c.value.toLowerCase() === value.toLowerCase() && 
      c.negative !== negative
    );
    if (opp !== -1) searchChips.splice(opp, 1);
    
    searchChips.push({ type, value, negative });
    renderChips();
  }

  function renderChips() {
    if (!tagChipContainer) return;
    Array.from(tagChipContainer.querySelectorAll(".tag-chip")).forEach(n => n.remove());
    
    searchChips.forEach((chip, i) => {
      const chipEl = document.createElement("span");
      const chipClass = chip.type === 'fuzzy' ? 'tag-chip-fuzzy' : (chip.negative ? 'tag-chip-neg' : 'tag-chip-pos');
      chipEl.className = `tag-chip ${chipClass}`;
      chipEl.setAttribute("data-type", chip.type);
      chipEl.setAttribute("data-value", chip.value);
      
      const prefix = chip.negative ? '-' : '';
      const label = chip.type === 'fuzzy' ? `"${chip.value}"` : chip.value;
      
      chipEl.innerHTML = `<button class="tag-chip-close" aria-label="Remove" data-idx="${i}">✕</button><span class="tag-chip-label">${prefix}${escapeHtml(label)}</span>`;
      tagChipContainer.insertBefore(chipEl, tagInput);
    });
    
    if (tagInput) { 
      tagInput.value = ""; 
      tagInput.focus(); 
    }
    scheduleSearch();
    updateSearchLayout();
  }

  if (tagChipContainer) {
    tagChipContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".tag-chip-close");
      if (!btn) return;
      const idx = Number(btn.getAttribute("data-idx"));
      if (!Number.isNaN(idx)) {
        searchChips.splice(idx, 1);
        renderChips();
      }
    });
  }

  // --- Tag suggestion logic ---
  let suggestionIndex = -1;
  function suggestTags(prefix, limit=10) {
    if (!prefix) return [];
    let isNeg = false;
    if (prefix.startsWith("-")) { 
      isNeg = true; 
      prefix = prefix.slice(1).trim(); 
    }
    const q = normalizeText(prefix);
    if (!q) return [];
    const matches = ALL_TAGS
      .map(tag => ({ tag, count: TAG_COUNTS[tag] || 0, negative: isNeg }))
      .filter(t => normalizeText(t.tag).includes(q))
      .sort((a,b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.tag.localeCompare(b.tag);
      })
      .slice(0, limit);
    return matches;
  }

  function showSuggestions(list) {
    if (!tagSuggestions) return;
    tagSuggestions.innerHTML = "";
    if (!list || !list.length) {
      tagSuggestions.style.display = "none";
      tagSuggestions.setAttribute("aria-hidden","true");
      suggestionIndex = -1;
      return;
    }
    tagSuggestions.style.display = "block";
    tagSuggestions.setAttribute("aria-hidden","false");
    list.forEach((s,i) => {
      const el = document.createElement("div");
      el.className = "tag-suggestion";
      el.dataset.i = i;
      el.innerHTML = `<span class="suggest-tag">${s.negative?'-':''}${escapeHtml(s.tag)}</span> <span class="suggest-count">(${s.count||0})</span>`;

      el.addEventListener("mousedown", ev => { 
        ev.preventDefault(); 
        addChip('tag', s.tag, s.negative); 
        hideSuggestions(); 
      });

      el.addEventListener("mouseover", () => {
        const items = Array.from(tagSuggestions.querySelectorAll(".tag-suggestion"));
        items.forEach((it,i2) => it.classList.toggle("active", i2 === i));
        suggestionIndex = i;
      });

      tagSuggestions.appendChild(el);
    });
    suggestionIndex = -1;
    tagSuggestions.scrollTop = 0;
  }

  function hideSuggestions() { 
    if (!tagSuggestions) return; 
    tagSuggestions.innerHTML=""; 
    tagSuggestions.style.display="none"; 
    tagSuggestions.setAttribute("aria-hidden","true"); 
    suggestionIndex = -1; 
  }

  // Process input and decide what's a tag vs fuzzy term
  function processInputTerms(inputValue) {
    const parts = (inputValue || "").trim().split(/\s+/).filter(Boolean);
    
    parts.forEach(part => {
      const isNeg = part.startsWith("-");
      const term = isNeg ? part.slice(1) : part;
      
      // Check if this term matches any tag (case-insensitive)
      const matchedTag = ALL_TAGS.find(t => t.toLowerCase() === term.toLowerCase());
      
      if (matchedTag) {
        addChip('tag', matchedTag, isNeg);
      } else {
        // Not a tag, add as fuzzy search term
        addChip('fuzzy', term, isNeg);
      }
    });
  }

  function commitSelectedSuggestionOrInput() {
    if (!tagInput) return;
    const v = tagInput.value || "";
    const items = tagSuggestions ? Array.from(tagSuggestions.querySelectorAll(".tag-suggestion")) : [];
    const activeItem = items.find(it => it.classList.contains("active"));
    
    if (activeItem) {
      const txt = (activeItem.querySelector(".suggest-tag").textContent || "").trim();
      const negative = txt.startsWith("-");
      const tagText = negative ? txt.slice(1) : txt;
      if (tagText) addChip('tag', tagText, negative);
    } else {
      const val = v.trim();
      if (val) processInputTerms(val);
    }
    hideSuggestions();
  }

  if (tagInput) {
    tagInput.addEventListener("input", () => {
      const v = tagInput.value || "";
      if (!v.trim()) { 
        hideSuggestions(); 
        return; 
      }
      showSuggestions(suggestTags(v, 12));
    });

    tagInput.addEventListener("keydown", (e) => {
      const items = tagSuggestions ? Array.from(tagSuggestions.querySelectorAll(".tag-suggestion")) : [];

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        commitSelectedSuggestionOrInput();
      } else if (e.key === "ArrowDown") {
        if (items.length) {
          e.preventDefault();
          suggestionIndex = Math.min(suggestionIndex + 1, items.length - 1);
          items.forEach((it,i)=> it.classList.toggle("active", i===suggestionIndex));
          items[suggestionIndex].scrollIntoView({block:"nearest"});
        }
      } else if (e.key === "ArrowUp") {
        if (items.length) {
          e.preventDefault();
          suggestionIndex = Math.max(suggestionIndex - 1, 0);
          items.forEach((it,i)=> it.classList.toggle("active", i===suggestionIndex));
          items[suggestionIndex].scrollIntoView({block:"nearest"});
        }
      } else if (e.key === "Escape") {
        hideSuggestions();
      }
    });

    document.addEventListener("click", (e) => {
      if (!tagSuggestions || !tagInput) return;
      if (!tagSuggestions.contains(e.target) && e.target !== tagInput && !tagChipContainer.contains(e.target)) {
        hideSuggestions();
      }
    });
  }

  function scheduleSearch() { 
    if (searchTimer) clearTimeout(searchTimer); 
    searchTimer = setTimeout(executeSearch, 150); 
  }

  // --- Layout control ---
  function updateSearchLayout() {
    const tagPanel = document.getElementById("quick-tags-panel");
    const resultsPanel = document.getElementById("results-tabs");
    const searchLayout = document.querySelector(".search-layout");
    
    if (!tagPanel || !resultsPanel || !searchLayout) return;
    
    const hasInput = tagInput && tagInput.value.trim().length > 0;
    const hasChips = searchChips.length > 0;
    const showResults = hasInput || hasChips;
    const keepTagsVisible = keepTagsCheckbox && keepTagsCheckbox.checked;
    
    if (showResults) { 
      resultsPanel.hidden = false;
      
      if (keepTagsVisible) {
        tagPanel.hidden = false;
        searchLayout.style.display = "block";
        searchLayout.style.gridTemplateColumns = "300px 1fr";
        searchLayout.style.gap = "1rem";
      } else {
        tagPanel.hidden = true;
        searchLayout.style.display = "block";
      }
    } else { 
      tagPanel.hidden = false;
      resultsPanel.hidden = true;
      searchLayout.style.display = "block";
    }
  }

  // Load saved preference for keep tags visible
  if (keepTagsCheckbox) {
    const savedPref = localStorage.getItem("keepTagsVisible");
    if (savedPref === "true") keepTagsCheckbox.checked = true;
    
    keepTagsCheckbox.addEventListener("change", () => {
      localStorage.setItem("keepTagsVisible", keepTagsCheckbox.checked);
      updateSearchLayout();
    });
  }

  // --- Consolidated date formatting ---
  const MONTHS = { 
    "00": "", "01":"Jan. ", "02":"Feb. ", "03":"Mar. ", "04":"Apr. ", 
    "05":"May ", "06":"Jun. ", "07":"Jul. ", "08":"Aug. ", "09":"Sep. ", 
    "10":"Oct. ", "11":"Nov. ", "12":"Dec.",
    "0": "", "1":"Jan. ", "2":"Feb. ", "3":"Mar. ", "4":"Apr. ", 
    "5":"May ", "6":"Jun. ", "7":"Jul. ", "8":"Aug. ", "9":"Sep. "
  };
  
  const DAYS = { 
    "00":"", "01":"1, ", "02":"2, ", "03":"3, ", "04":"4, ", "05":"5, ", 
    "06":"6, ", "07":"7, ", "08":"8, ", "09":"9, ", "10":"10, ", 
    "11":"11, ", "12":"12, ", "13":"13, ", "14":"14, ", "15":"15, ", 
    "16":"16, ", "17":"17, ", "18":"18, ", "19":"19, ", "20":"20, ", 
    "21":"21, ", "22":"22, ", "23":"23, ", "24":"24, ", "25":"25, ", 
    "26":"26, ", "27":"27, ", "28":"28, ", "29":"29, ", "30":"30, ", 
    "31":"31, ",
    "0":"", "1":"1, ", "2":"2, ", "3":"3, ", "4":"4, ", "5":"5, ", 
    "6":"6, ", "7":"7, ", "8":"8, ", "9":"9, "
  };

  function formatDate(dateStr) {
    if (!dateStr || dateStr === "0000-00-00") return "?";
    if (dateStr === "") return "";
    
    const parts = (dateStr.split(" ")[0] || "").split("-");
    if (parts.length !== 3) return dateStr;
    
    const year = parts[0] || "0000";
    const month = parts[1] || "00";
    const day = parts[2] || "00";
    
    const monthName = MONTHS[month] || "";
    const dayName = DAYS[day] || "";
    const datePart = monthName + dayName;
    
    return datePart + (year !== "0000" ? year : "");
  }

  // Format date range with "Present" for empty end dates
  function formatDateRange(startDate, endDate) {
    const start = formatDate(startDate);
    
    // Check if endDate is explicitly empty string (not missing/invalid) BEFORE formatting
    if (endDate === "") {
      // If start is also unknown, return empty
      if (!start || start === "?") return "";
      return start + " - Present";
    }
    
    // Now format the end date
    const end = formatDate(endDate);
    
    // If both are unknown or missing, return empty
    if ((!start || start === "?") && (!end || end === "?")) return "";
    
    // If we have at least one date (even if the other is ?), show the range
    if (start && end) return start + " - " + end;
    
    // Only start is valid
    if (start && !end) return start;
    
    // Only end is valid (shouldn't happen but handle it)
    if (end && !start) return end;
    
    return "";
  }

  // --- Init load ---
  (async function init() {
    await loadSearchData();
    executeSearch();
    updateSearchLayout();
  })();

  // --- Scoring & search helpers ---
  function docHasTag(doc, tag) {
    if (!doc || !doc.path) return false;
    const tags = DOC_TAGS[doc.path] || [];
    const lk = tag.toLowerCase();
    return tags.some(t => String(t).toLowerCase() === lk);
  }

  function scoreDocForQuery(doc, qTokens, qTris) {
    const docTris = new Set(doc.trigrams || []);
    const docTokens = new Set(doc.tokens || []);
    const tJ = jaccard(qTris, docTris);
    const tokOverlap = qTokens.length ? qTokens.filter(t => docTokens.has(t)).length / qTokens.length : 0;
    const titleBoost = qTokens.some(t => (doc.title || "").toLowerCase().includes(t)) ? 0.12 : 0;
    return 0.72 * tJ + 0.26 * tokOverlap + titleBoost;
  }

  function titleSimilarityToQuery(doc, queryStr) {
    const titleStr = (doc.title || doc.path || "");
    if (!titleStr || !queryStr) return 0;
    const tTris = charTrigrams(titleStr);
    const qTris = charTrigrams(queryStr);
    return jaccard(tTris, qTris);
  }

  // --- SEARCH (handles tags, fuzzy, and combined) ---
  function search(fuzzyQuery, tagFilters, maxResults=500) {
    let results = [];
    const isFuzzyEmpty = !fuzzyQuery || !fuzzyQuery.trim();
    const isTagOnly = isFuzzyEmpty && tagFilters.length > 0;

    if (isTagOnly) {
      // TAG-ONLY
      let candidatePaths = null;
      tagFilters.forEach(tf => {
        const tagKey = tf.tag;
        const pagesForTagObjs = PAGES_BY_TAG[tagKey] || [];
        const pagesForTag = pagesForTagObjs.map(p => normalizePageKey(p.path || p));
        if (tf.negative) {
          if (!candidatePaths) {
            candidatePaths = Object.values(PAGES_BY_TAG).flat().map(p => normalizePageKey(p.path || p));
          }
          candidatePaths = candidatePaths.filter(p => !pagesForTag.includes(p));
        } else {
          candidatePaths = candidatePaths ? candidatePaths.filter(p => pagesForTag.includes(p)) : [...pagesForTag];
        }
      });

      if (!candidatePaths) candidatePaths = [];
      const positiveTags = tagFilters.filter(t => !t.negative).map(t => t.tag);

      results = candidatePaths.map(p => {
        const doc = DOCS.find(d => d.path === p) || { path: p, title: p, frontmatter: {} };
        let score = 0;
        if (positiveTags.length > 0) {
          let acc = 0;
          positiveTags.forEach(pt => {
            acc += titleSimilarityToQuery(doc, pt);
          });
          score = acc / positiveTags.length;
          for (const pt of positiveTags) {
            if ((doc.title || "").toLowerCase() === pt.toLowerCase()) {
              score += 1.0;
              break;
            }
          }
        }
        return { score, doc };
      });

      results.sort((a,b) => {
        const diff = (b.score || 0) - (a.score || 0);
        if (Math.abs(diff) > 1e-9) return diff;
        const aStart = (a.doc.frontmatter?.startDate || "0000-00-00").split(" ")[0];
        const bStart = (b.doc.frontmatter?.startDate || "0000-00-00").split(" ")[0];
        if ((aStart && aStart.startsWith("0000")) && !(bStart && bStart.startsWith("0000"))) return 1;
        if ((bStart && bStart.startsWith("0000")) && !(aStart && aStart.startsWith("0000"))) return -1;
        return aStart.localeCompare(bStart);
      });

    } else {
      // FUZZY + optional tag filters
      const qTokens = tokenize(fuzzyQuery);
      const qTris = charTrigrams(fuzzyQuery);
      
      for (const doc of DOCS) {
        // Check tag filters
        if (!tagFilters.every(tf => tf.negative ? !docHasTag(doc, tf.tag) : docHasTag(doc, tf.tag))) continue;
        
        const score = scoreDocForQuery(doc, qTokens, qTris);
        if (score > 0) results.push({ score, doc });
      }
      results.sort((a,b) => b.score - a.score);
    }

    return results.slice(0, maxResults);
  }

  // --- Renderers ---
  function renderArticle(doc) {
    const fm = doc.frontmatter || {};
    const hasContent = !!(doc.content || doc.excerpt || doc.title);
    const wrapper = document.createElement("div");
    wrapper.className = hasContent ? "list-page-block" : "list-page-empty-block";

    const dateRange = formatDateRange(fm.startDate, fm.endDate);
    
    const imgFile = fm.pageThumbnailFile;
    const lowImgSrc = imgFile ? `/lowphotos/${imgFile}` : "/UI/File%20Not%20Found.jpg";
    const highImgSrc = imgFile ? `/photos/${imgFile}` : "/UI/File%20Not%20Found.jpg";
    const href = makePermalink(doc.path);
    const title = fm.title || doc.title || doc.path;
    const hasDownloads = fm.downloadLinks && fm.downloadLinks.length;

    wrapper.innerHTML = `
      <div class="list-page-container">
        <div class="list-image">
          <a href="${href}">
            <img src="${lowImgSrc}" data-src="${highImgSrc}" class="thumbnail lazy-photo" loading="lazy" />
          </a>
        </div>
        <div class="list-page-content">
          <a href="${href}">
            ${escapeHtml(title)}
            ${hasDownloads ? '<img src="/UI/Emojis/inbox.svg" class="emoji">' : ""}
          </a>
          <div class="list-page-date">${dateRange}</div>
        </div>
      </div>
    `;
    return wrapper;
  }

  function renderPhoto(doc) {
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-image-box";
    let fileName = (doc.title || "").trim();
    let imgURL = "/UI/File Not Found.jpg";
    let lowResURL = "/UI/File Not Found.jpg";

    if (fileName) {
      if (fileName.startsWith("/")) fileName = fileName.slice(1);
      lowResURL = `/lowphotos/${fileName}`;
      imgURL = `/photos/${fileName}`;
    }

    const dateRange = formatDateRange(doc.frontmatter?.startDate, doc.frontmatter?.endDate);
    const photoDesc = doc.frontmatter?.photoDescription?.trim();
    const displayText = photoDesc || doc.title + (dateRange ? ` (${dateRange})` : "");
    const href = makePermalink(doc.path);

    wrapper.innerHTML = `
      <div class="article-photo-image">
        <a href="${href}">
          <img src="${lowResURL}" data-src="${imgURL}" alt="${escapeHtml(doc.title || "File Not Found")}" class="lazy-photo" loading="lazy" />
        </a>
      </div>
      <div class="article-photo-description">${escapeHtml(displayText)}</div>
    `;
    return wrapper;
  }

  function renderVideo(doc) {
    const wrapper = document.createElement("div");
    wrapper.className = "list-page-block-video";
    const container = document.createElement("div"); 
    container.className = "list-page-container";

    const videoDiv = document.createElement("div"); 
    videoDiv.className = "list-video";
    const videoURL = doc.title || "";
    let thumbURL = "/UI/File Not Found.jpg";
    
    if (videoURL.includes("youtube.com")) {
      const videoID = videoURL.replace("https://www.youtube.com/watch?v=","").split("&")[0];
      thumbURL = `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
    } else if (videoURL.includes("youtu.be")) {
      const parts = videoURL.split("/"); 
      const videoID = parts[parts.length-1]; 
      thumbURL = `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
    } else if (videoURL.includes("archive.org")) {
      const parts = videoURL.split("/"); 
      const videoID = parts[4] || ""; 
      if (videoID) thumbURL = `https://archive.org/services/img/${videoID}`;
    }
    
    const thumbLink = document.createElement("a"); 
    thumbLink.href = videoURL; 
    thumbLink.target = "_blank";
    const thumbImg = document.createElement("img"); 
    thumbImg.src = thumbURL; 
    thumbImg.alt = "Video Thumbnail";
    thumbLink.appendChild(thumbImg); 
    videoDiv.appendChild(thumbLink);

    const contentDiv = document.createElement("div"); 
    contentDiv.className = "list-page-video-content";
    const aLink = document.createElement("a"); 
    aLink.href = makePermalink(doc.path || "#");
    const excerpt = (doc.excerpt || "").substring(0,150);
    aLink.textContent = excerpt.length < (doc.excerpt || "").length ? excerpt + "..." : excerpt;
    contentDiv.appendChild(aLink);
    
    const dateDiv = document.createElement("div"); 
    dateDiv.className = "list-page-date";
    dateDiv.textContent = formatDate(doc.frontmatter?.startDate || "");
    contentDiv.appendChild(dateDiv);

    container.appendChild(videoDiv); 
    container.appendChild(contentDiv); 
    wrapper.appendChild(container);
    return wrapper;
  }

  function renderReview(doc) {
    const wrapper = document.createElement("div");
    wrapper.className = "list-review-block";
    const container = document.createElement("div"); 
    container.className = "list-review-container";
    const contentDiv = document.createElement("div"); 
    contentDiv.className = "list-review-content";

    const aLink = document.createElement("a"); 
    aLink.href = makePermalink(doc.path || "#");
    const recommend = doc.frontmatter?.recommend;
    const baseTitle = doc.frontmatter?.LinkTitle || doc.title || "";

    let reviewedPageStr = "";
    const pageTitle = doc.frontmatter?.Page;
    if (pageTitle) {
      const match = DOCS.find(d => d.title === pageTitle);
      reviewedPageStr = match 
        ? ` - <a href="${makePermalink(match.path)}">${escapeHtml(match.title)}</a>`
        : ` - ${escapeHtml(pageTitle)}`;
    }
    aLink.innerHTML = (recommend === true ? "👍 " : "👎 ") + escapeHtml(baseTitle) + reviewedPageStr;
    contentDiv.appendChild(aLink);

    const dateDiv = document.createElement("div"); 
    dateDiv.className = "list-review-date";
    const startDate = doc.frontmatter?.startDate || "";
    let dateText = formatDate(startDate);
    const contributors = doc.frontmatter?.contributors || [];
    
    if (contributors.length > 0) {
      const contribLinks = contributors.map(c => {
        const match = DOCS.find(d => d.title === c);
        return match 
          ? `<a href="${makePermalink(match.path)}">${escapeHtml(match.title)}</a>`
          : escapeHtml(c);
      }).join(", ");
      dateText += ` - ${contribLinks}`;
    } else {
      dateText += " - Anonymous";
    }
    dateDiv.innerHTML = dateText;
    contentDiv.appendChild(dateDiv);

    const bodyDiv = document.createElement("div"); 
    bodyDiv.className = "list-review-body";
    bodyDiv.innerHTML = escapeHtml(doc.excerpt || doc.content || "");
    contentDiv.appendChild(bodyDiv);

    container.appendChild(contentDiv); 
    wrapper.appendChild(container);
    return wrapper;
  }

  function dateSortableRaw(raw) {
    if (!raw) return null;
    const s = String(raw).split(" ")[0];
    return (s && !s.startsWith("0000")) ? s : null;
  }
  
  function compareDatesForSort(aRaw, bRaw, order='oldest') {
    const a = dateSortableRaw(aRaw), b = dateSortableRaw(bRaw);
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;
    return order === 'oldest' ? a.localeCompare(b) : b.localeCompare(a);
  }

  const showMoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sentinel = entry.target;
      const container = sentinel.closest(".results-list");
      if (!container) return;
      const showMoreEl = container.querySelector(".show-more-wrapper");
      if (!showMoreEl) return;
      const total = parseInt(sentinel.dataset.total || "0", 10) || 0;
      const shown = parseInt(sentinel.dataset.shown || "0", 10) || 0;
      const perVal = resultsPerSelect && resultsPerSelect.value ? resultsPerSelect.value : "10";
      const isAll = perVal === "all";
      if (entry.isIntersecting && !isAll && total > shown) {
        showMoreEl.style.display = "block";
      } else {
        showMoreEl.style.display = "none";
      }
    });
  }, { root: null, rootMargin: "0px", threshold: 0.1 });

  function attachSentinel(container, totalCount, shownCount) {
    const existingSent = container.querySelector(".results-bottom-sentinel");
    if (existingSent) {
      showMoreObserver.unobserve(existingSent);
      existingSent.remove();
    }
    let showMoreWrap = container.querySelector(".show-more-wrapper");
    if (showMoreWrap) showMoreWrap.remove();

    showMoreWrap = document.createElement("div");
    showMoreWrap.className = "show-more-wrapper";
    showMoreWrap.style.display = "none";
    showMoreWrap.innerHTML = `<a href="#" class="show-more-link">Show more</a>`;
    container.appendChild(showMoreWrap);

    const link = showMoreWrap.querySelector(".show-more-link");
    link.addEventListener("click", (ev) => {
      ev.preventDefault();
      const tiers = ["10","50","100","all"];
      const current = resultsPerSelect && resultsPerSelect.value ? resultsPerSelect.value : "10";
      const idx = tiers.indexOf(current);
      const next = tiers[Math.min(idx + 1, tiers.length - 1)];
      if (resultsPerSelect) resultsPerSelect.value = next;
      executeSearch();
    });

    const sentinel = document.createElement("div");
    sentinel.className = "results-bottom-sentinel";
    sentinel.dataset.total = String(totalCount || 0);
    sentinel.dataset.shown = String(shownCount || 0);
    sentinel.style.width = "100%";
    sentinel.style.height = "1px";
    container.appendChild(sentinel);
    showMoreObserver.observe(sentinel);
  }

  // --- executeSearch ---
  function executeSearch() {
    if (!DOCS || !DOCS.length) {
      console.warn("Search data not yet loaded or empty");
      return;
    }

    // Separate chips into tags and fuzzy terms
    const tagChips = searchChips.filter(c => c.type === 'tag');
    const fuzzyChips = searchChips.filter(c => c.type === 'fuzzy');
    
    // Build fuzzy query from fuzzy chips
    const fuzzyQuery = fuzzyChips.map(c => (c.negative ? '-' : '') + c.value).join(" ");
    const tagFilters = tagChips.map(c => ({ tag: c.value, negative: c.negative }));

    // both empty -> clear results
    if (!fuzzyQuery && !tagFilters.length) {
      [listArticles, listPhotos, listVideos, listReviews].forEach(c => { if (c) c.innerHTML = ""; });
      activateTab("results-tabs", "tab-articles");
      updateSearchLayout();
      return;
    }

    const results = search(fuzzyQuery, tagFilters, 2000);

    const articles=[], photos=[], videos=[], reviews=[];
    for (const r of results) {
      const doc = r.doc;
      const tags = (DOC_TAGS[doc.path] || []).map(t=>String(t).toLowerCase());
      if (tags.includes("photos")) photos.push({score:r.score, doc});
      else if (tags.includes("videos")) videos.push({score:r.score, doc});
      else if (tags.includes("reviews")) reviews.push({score:r.score, doc});
      else articles.push({score:r.score, doc});
    }

    const artSort = (articlesSortSelect && articlesSortSelect.value) ? articlesSortSelect.value : 'relevancy';

    if (artSort === 'relevancy') {
      articles.sort((A,B) => {
        const diff = (B.score || 0) - (A.score || 0);
        if (Math.abs(diff) > 1e-9) return diff;
        const aDate = A.doc.frontmatter?.startDate || A.doc.frontmatter?.date || "";
        const bDate = B.doc.frontmatter?.startDate || B.doc.frontmatter?.date || "";
        return compareDatesForSort(aDate, bDate, 'newest');
      });
    } else {
      articles.sort((A,B) => {
        const aDate = A.doc.frontmatter?.startDate || A.doc.frontmatter?.date || "";
        const bDate = B.doc.frontmatter?.startDate || B.doc.frontmatter?.date || "";
        return compareDatesForSort(aDate, bDate, artSort);
      });
    }

    const perVal = resultsPerSelect && resultsPerSelect.value ? resultsPerSelect.value : "10";
    const perLimit = perVal === "all" ? Infinity : parseInt(perVal, 10) || 10;

    function clearAndRender(container, arr, renderer) {
      if (!container) return;
      const existingSent = container.querySelectorAll(".results-bottom-sentinel");
      existingSent.forEach(s => {
        try { showMoreObserver.unobserve(s); } catch(e){}
        s.remove();
      });
      const existingShow = container.querySelectorAll(".show-more-wrapper");
      existingShow.forEach(s => s.remove());

      container.innerHTML = "";
      if (!arr.length) { 
        container.innerHTML = `<div class="no-results">No results</div>`; 
        return; 
      }
      const limited = (perLimit === Infinity) ? arr : arr.slice(0, perLimit);
      if (renderer === renderPhoto) {
        const gallery = document.createElement("div"); 
        gallery.className = "gallery";
        limited.forEach(item => gallery.appendChild(renderer(item.doc)));
        container.appendChild(gallery);
      } else {
        limited.forEach(item => container.appendChild(renderer(item.doc)));
      }

      const totalCount = arr.length;
      const shownCount = limited.length;
      attachSentinel(container, totalCount, shownCount);
      
      // Trigger lazy loading for newly rendered images
      if (typeof initLazyPhotos === 'function') {
        initLazyPhotos(container);
      }
    }

    clearAndRender(listArticles, articles, renderArticle);
    clearAndRender(listPhotos, photos, renderPhoto);
    clearAndRender(listVideos, videos, renderVideo);
    clearAndRender(listReviews, reviews, renderReview);

    const tabCounts = { 
      "tab-articles": articles.length, 
      "tab-photos": photos.length, 
      "tab-videos": videos.length, 
      "tab-reviews": reviews.length 
    };
    
    SEARCH_TABS.forEach(key => {
      const btn = tabButtons.find(b=>b.dataset.tab===key);
      if (!btn) return;
      const labelMap = { 
        "tab-articles":"Articles", 
        "tab-photos":"Photos", 
        "tab-videos":"Videos", 
        "tab-reviews":"Reviews" 
      };
      btn.textContent = `${labelMap[key]} (${tabCounts[key]||0})`;
    });

    updateSearchLayout();
  }

  if (resultsPerSelect) {
    resultsPerSelect.addEventListener("change", () => { 
      executeSearch(); 
      updateSearchLayout(); 
    });
  }
  
  if (articlesSortSelect) {
    articlesSortSelect.addEventListener("change", () => { 
      executeSearch(); 
      updateSearchLayout(); 
    });
  }

});
