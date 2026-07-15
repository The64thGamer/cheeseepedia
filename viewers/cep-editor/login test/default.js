export async function render(params, app) {
  const theme  = localStorage.getItem('cep-theme') || 'standard';
  const custom = JSON.parse(localStorage.getItem('cep-theme-custom') || 'null');
  const root   = document.documentElement;

  ['--background','--text','--primary','--secondary','--good-link','--bad-link','--distant','--dark',
   '--font-body','--font-display'].forEach(k => root.style.removeProperty(k));

  if (theme === 'custom' && custom) {
    root.removeAttribute('data-theme');
    Object.entries(custom).forEach(([k, v]) => root.style.setProperty(k, v));
  } else {
    theme === 'standard' ? root.removeAttribute('data-theme') : root.setAttribute('data-theme', theme);
  }

  root.toggleAttribute('data-wide', localStorage.getItem('cep-wide') === '1');

  const loginHTML = await fetch('/viewers/cep-editor/Login.html');
  app.innerHTML = await loginHTML.text();

  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/forge/1.3.1/forge.min.js');
  await import('/viewers/cep-editor/Login.js');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}