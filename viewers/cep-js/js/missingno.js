let cinnibar = parseInt(localStorage.getItem('cinnibar') || '0');
cinnibar += 1;
localStorage.setItem('cinnibar', cinnibar.toString());

const intensity = Math.min(cinnibar / 100, 1.0);
const SPEED = 50;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'CANVAS', 'SVG']);
const DONE = new WeakSet();
const IMG_DONE = new WeakSet();

const seededRandom = (s) => {
  const x = Math.sin(s) * 10000;
  return x - Math.floor(x);
};


function getThemePalette(imgSeed) {
  const style = getComputedStyle(document.documentElement);
  const vars = ['--background', '--primary', '--secondary', '--text'];
  let colors = vars.map(v => parseHex(style.getPropertyValue(v).trim() || '#000000'));
  
  // EFFECT 3: Randomized Palette
  if (seededRandom(imgSeed + 10) < intensity * 0.5) {
    colors = colors.sort(() => seededRandom(imgSeed + 11) - 0.5);
  }
  return colors;
}

function parseHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function applyPalette(img) {
  if (IMG_DONE.has(img) || img.src.startsWith('data:')) return;
  if (!img.complete) {
    img.crossOrigin = "anonymous";
    img.onload = () => applyPalette(img);
    return;
  }

  const imgSeed = Math.random() * 1000; 
  const PALETTE = getThemePalette(imgSeed);
  const bgColor = PALETTE[0];
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let canvasSize = 128;
  if (seededRandom(imgSeed) < intensity) {
    canvasSize = Math.floor(64 + (seededRandom(imgSeed + 1) * 192));
  }
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  ctx.save();
  ctx.translate(canvasSize / 2, canvasSize / 2);

  if (seededRandom(imgSeed + 2) < intensity * 0.7) {
    const rotations = [0, 90, 180, 270];
    const angle = rotations[Math.floor(seededRandom(imgSeed + 3) * rotations.length)];
    ctx.rotate((angle * Math.PI) / 180);
    
    const scaleX = seededRandom(imgSeed + 4) > 0.5 ? 1 : -1;
    const scaleY = seededRandom(imgSeed + 5) > 0.5 ? 1 : -1;
    ctx.scale(scaleX, scaleY);
  }
  
  ctx.drawImage(img, -64, -64, 128, 128);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    let closest = PALETTE[0], minDistance = Infinity;

    for (const color of PALETTE) {
      const dist = Math.sqrt((r - color[0]) ** 2 + (g - color[1]) ** 2 + (b - color[2]) ** 2);
      if (dist < minDistance) {
        minDistance = dist;
        closest = color;
      }
    }
    data[i] = closest[0];
    data[i + 1] = closest[1];
    data[i + 2] = closest[2];
  }

  ctx.putImageData(imageData, 0, 0);
  IMG_DONE.add(img);
  img.src = canvas.toDataURL();
}

const style = document.createElement('style');
style.textContent = `body { color: transparent !important; } img { image-rendering: pixelated; }`;
document.head.appendChild(style);

function typeNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
      if (DONE.has(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    DONE.add(node);
    const full = node.textContent;
    node.textContent = '';
    let i = 0;
    const tick = () => { 
      node.textContent += full[i++]; 
      if (i < full.length) setTimeout(tick, SPEED); 
    };
    tick();
  });
}

window.addEventListener('cep-render-done', e => {
  const app = e.detail?.app || document.body;
  style.remove();
  
  typeNodes(app);
  app.querySelectorAll('img').forEach(applyPalette);

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          typeNodes(node);
          if (node.tagName === 'IMG') applyPalette(node);
          node.querySelectorAll('img').forEach(applyPalette);
        }
      }
    }
  });
  observer.observe(app, { childList: true, subtree: true });
}, { once: true });