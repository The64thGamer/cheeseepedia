
(function(){
  const STORAGE_KEY = 'pp_state_v1';
  const byId = id => document.getElementById(id);
  const pp = byId('persistent-player');
  const titleEl = byId('pp-title');
  const btnClose = byId('pp-close');
  const ppBody = pp.querySelector('.pp-body');

  let player = null;   // audio/video element
  let sourceEl = null; // <source> element

  const norm = s => { try { return s ? new URL(s, location.href).toString() : ''; } catch(e){ return s||''; } };
  const safeTitle = t => String(t || 'Player');
  const parseTimecode = tc => {
    if(tc==null) return 0;
    tc = String(tc).trim();
    if(!tc) return 0;
    if(tc[0]===':') tc='0'+tc;
    const parts = tc.split(':').map(p=>parseInt(p,10));
    if(parts.some(isNaN)) return 0;
    if(parts.length===3) return parts[0]*3600+parts[1]*60+parts[2];
    if(parts.length===2) return parts[0]*60+parts[1];
    return parts[0];
  };

  function showPlayer(){ pp.classList.remove('hidden'); pp.setAttribute('aria-hidden','false'); }
  function hidePlayer(){
    try{ player.pause(); } catch(e){}
    saveState(undefined, { closed: true });
    pp.classList.add('hidden'); pp.setAttribute('aria-hidden','true');
  }

  // Dynamically create audio/video player
  function createPlayer(src){
    const ext = src.split('.').pop().toLowerCase();
    const isVideo = ['mp4','webm','ogg'].includes(ext);
    ppBody.innerHTML = ''; // clear
    player = document.createElement(isVideo ? 'video' : 'audio');
    player.controls = true;
    player.preload = 'metadata';
    player.style.width='100%';
    sourceEl = document.createElement('source');
    sourceEl.src = src;
    player.appendChild(sourceEl);
    ppBody.appendChild(player);

    // attach listeners
    player.addEventListener('timeupdate', throttle(()=>{ saveState(); updateActiveTrack(); }, 800));
    player.addEventListener('play', ()=>saveState());
    player.addEventListener('pause', ()=>saveState());
  }

  function setSource(src, cb){
    if(!src) return;
    if(!player || norm(player.currentSrc||'') !== norm(src)){
      createPlayer(src);
    } else {
      player.src = src;
      player.load();
    }
    const onLoaded = ()=>{ player.removeEventListener('loadedmetadata', onLoaded); if(cb) cb(); };
    if(player.readyState>=1){ if(cb) cb(); } else { player.addEventListener('loadedmetadata', onLoaded); }
  }

  function seekAndPlay(seconds){
    try{ player.currentTime = Math.max(0, seconds); } catch(e){
      player.addEventListener('loadedmetadata', function _once(){ player.removeEventListener('loadedmetadata',_once); player.currentTime=seconds; });
      return;
    }
    player.play().catch(()=>{});
  }

  function saveState(explicitTitle, overrides={}){
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      const state = Object.assign({
        src: norm(player?.currentSrc||''),
        time: Math.floor(player?.currentTime||0),
        playing: player ? !player.paused && !player.ended : false,
        title: explicitTitle!==undefined ? safeTitle(explicitTitle) : prev.title,
        originUrl: prev.originUrl||'',
        closed: prev.closed||false
      }, overrides);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch(e){}
  }

  function playTrackFromElement(el){
    if(!el) return;
    const start = parseTimecode(el.dataset.start);
    const src = el.dataset.src||'';
    const pageTitle = safeTitle(document.title);
    const origin = String(window.location.href);

    titleEl.textContent = pageTitle;
    titleEl.href = origin;
    showPlayer();

    const cur = player?.currentSrc||'';
    if(norm(cur) === norm(src)) seekAndPlay(start);
    else setSource(src, ()=>seekAndPlay(start));

    saveState(pageTitle, { originUrl: origin, closed:false });
    updateUrlParams(src, Math.floor(start));
  }

  document.addEventListener('click', function(ev){
    const el = ev.target.closest && ev.target.closest('.track');
    if(!el) return;
    if(el.closest('a')) ev.preventDefault();
    playTrackFromElement(el);
  });

  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const state = JSON.parse(raw);
      if(!state) return;
      const { src, time, playing, title, originUrl, closed } = state;
      if(title) titleEl.textContent = safeTitle(title);
      if(originUrl) titleEl.href = originUrl;
      if(closed||!src) return;
      setSource(src, ()=>{
        if(typeof time==='number'){
          try{ player.currentTime = time; } catch(e){ player.addEventListener('loadedmetadata', function _once(){ player.removeEventListener('loadedmetadata',_once); player.currentTime=time; }); }
        }
        if(playing) player.play().catch(()=>{});
      });
    } catch(e){}
  }

  function updateUrlParams(src,t){
    try{ const url = new URL(window.location); if(src) url.searchParams.set('src',src); if(typeof t==='number') url.searchParams.set('t',t); window.history.replaceState({},'',url); } catch(e){}
  }

  function updateActiveTrack(){
    if(pp.classList.contains('hidden')) return;
    const current = player?.currentTime; if(isNaN(current)) return;
    const tracks = document.querySelectorAll('.track[data-start]');
    let active = null;
    tracks.forEach(track=>{
      const start = parseTimecode(track.dataset.start);
      if(start <= current && (!active || start > parseTimecode(active.dataset.start))) active = track;
    });
    document.querySelectorAll('.track.active').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.active-parent').forEach(el=>el.classList.remove('active-parent'));
    if(!active) return;
    active.classList.add('active');
    let parent = active.parentElement;
    while(parent){
      if(parent.classList?.contains('segment')||parent.classList?.contains('medley')) parent.classList.add('active-parent');
      parent = parent.parentElement;
    }
  }

  btnClose.addEventListener('click', hidePlayer);
  window.addEventListener('beforeunload', ()=>saveState());

  (function init(){
    const params = new URLSearchParams(window.location.search);
    const qsrc = params.get('src');
    const qt = params.get('t');
    if(qsrc){
      const start = qt ? parseFloat(qt):0;
      setSource(qsrc, ()=>{
        if(!isNaN(start)) try{ player.currentTime=start; }catch(e){}
        showPlayer();
      });
      titleEl.textContent = safeTitle(document.title);
      titleEl.href = String(window.location.href);
      saveState(document.title,{originUrl:String(window.location.href),closed:false});
    } else { loadState(); }
  })();

  function throttle(fn, wait){ let last=0; return function(){ const now=Date.now(); if(now-last>=wait){ last=now; fn.apply(this,arguments); last=now; } } }
})();