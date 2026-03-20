/**
 * SalesTab.js
 * Renders a sales-over-time chart + table from meta.sales data.
 * Call renderSalesTab(sales) → returns a DOM element ready to insert.
 */

const MNAMES = ['','Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '];

function fmtDate(d) {
  if(!d) return '???';
  const [y,m,day] = d.split('-');
  const mi = parseInt(m,10), di = parseInt(day,10);
  return (mi ? MNAMES[mi].trim() : '') + (di ? ' '+di : '') + ' ' + y;
}

function parsePrice(m) {
  return parseFloat(String(m).replace(/[^0-9.]/g,'')) || 0;
}

function dateToTs(d) {
  return new Date(d + 'T00:00:00Z').getTime();
}

/**
 * Weighted recent projection.
 * First isolates the most recent contiguous cluster of sales — if there's a
 * large time gap between sales (>2x the median gap in the cluster), earlier
 * outliers are excluded. Then does exponentially-weighted linear regression
 * on up to the last 8 sales in that cluster.
 */
function projectPrice(entries, targetTs) {
  if(entries.length < 2) return entries[entries.length-1]?.price ?? 0;

  // Find the recent cluster: walk backwards and stop when a gap is >2x the
  // median gap of the trailing sales. This drops ancient outliers like a
  // 1999 sale mixed in with 2025 sales.
  const recent = [entries[entries.length-1]];
  for(let i = entries.length-2; i >= 0; i--) {
    const gap     = entries[i+1].ts - entries[i].ts;
    const clusterSpan = recent[recent.length-1].ts - recent[0].ts;
    const clusterN    = recent.length;
    // If cluster has at least 2 points, check if this gap is an outlier
    if(clusterN >= 2) {
      const medianGap = clusterSpan / (clusterN - 1);
      // Gap is more than 4x the current cluster's average gap — stop here
      if(gap > medianGap * 4) break;
    }
    recent.unshift(entries[i]);
  }

  // Use up to last 8 sales from the cluster
  const pool = recent.slice(-8);
  if(pool.length < 2) return pool[pool.length-1].price;

  // Exponential weights: most recent = highest weight
  const weights = pool.map((_, i) => Math.pow(2, i));
  const totalW  = weights.reduce((s,w) => s+w, 0);

  const wMeanX = pool.reduce((s,e,i) => s + weights[i]*e.ts,    0) / totalW;
  const wMeanY = pool.reduce((s,e,i) => s + weights[i]*e.price, 0) / totalW;
  const num    = pool.reduce((s,e,i) => s + weights[i]*(e.ts-wMeanX)*(e.price-wMeanY), 0);
  const den    = pool.reduce((s,e,i) => s + weights[i]*(e.ts-wMeanX)**2, 0);

  if(den === 0) return wMeanY;
  const slope     = num / den;
  const intercept = wMeanY - slope * wMeanX;
  const raw = slope * targetTs + intercept;
  // Floor at half the cluster weighted mean — prevents runaway extrapolation
  // on short downtrends from reporting an implausible near-zero price.
  return Math.max(wMeanY * 0.5, raw);
}

export function renderSalesTab(sales) {
  if(!sales?.length) {
    const el = document.createElement('div');
    el.className = 'SalesEmpty';
    el.textContent = 'No sales data available.';
    return el;
  }

  // Parse and sort ascending by date
  const entries = sales
    .filter(s => s.m && s.s)
    .map(s => ({ price: parsePrice(s.m), raw: s.m, date: s.s, ts: dateToTs(s.s), link: s.l||null }))
    .sort((a,b) => a.ts - b.ts);

  if(!entries.length) {
    const el = document.createElement('div');
    el.className = 'SalesEmpty';
    el.textContent = 'No valid sales data.';
    return el;
  }

  const prices    = entries.map(e => e.price);
  const maxPrice  = Math.max(...prices);
  const minPrice  = Math.min(...prices);
  const avgPrice  = prices.reduce((s,p) => s+p, 0) / prices.length;
  const nowTs     = Date.now();
  const lastEntry = entries[entries.length-1];

  // Only show projection if latest sale isn't today
  const dayMs = 86400000;
  const showProjection = (nowTs - lastEntry.ts) > dayMs;
  const projectedNow   = showProjection ? projectPrice(entries, nowTs) : lastEntry.price;

  // Chart bounds: X from first sale to today, Y from 0 to max+headroom
  const minTs    = entries[0].ts;
  const maxTs    = nowTs;
  const timeSpan = maxTs - minTs || 1;
  const yMax     = maxPrice * 1.18 || 10;

  // ── Wrapper ───────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'SalesTab';

  // ── Stats bar ─────────────────────────────────────────────────────────────
  const stats = document.createElement('div');
  stats.className = 'SalesStats';
  stats.innerHTML = `
    <span class="SalesStat"><span class="SalesStatLabel">Sales</span> ${entries.length}</span>
    <span class="SalesStat"><span class="SalesStatLabel">Average Price</span> $${avgPrice.toFixed(2)}</span>
    ${showProjection ? `<span class="SalesStat"><span class="SalesStatLabel">Projected Price</span> $${projectedNow.toFixed(2)}</span>` : ''}
    <span class="SalesStat"><span class="SalesStatLabel">Range</span> $${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}</span>
  `;
  wrap.appendChild(stats);

  // ── SVG Chart ─────────────────────────────────────────────────────────────
  const W = 800, H = 280;
  const PAD = { top: 24, right: 32, bottom: 44, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  const tx = ts  => PAD.left + ((ts  - minTs) / timeSpan) * chartW;
  const ty = val => PAD.top  + chartH - (Math.max(0, val) / yMax) * chartH;

  // Y-axis ticks
  const yTicks = Array.from({length: 6}, (_, i) => (yMax / 5) * i);

  // X-axis month ticks
  const xTicks = [];
  {
    const d = new Date(Date.UTC(
      new Date(minTs).getUTCFullYear(),
      new Date(minTs).getUTCMonth(), 1
    ));
    d.setUTCMonth(d.getUTCMonth() + 1);
    const end = new Date(maxTs);
    while(d <= end) {
      xTicks.push({ ts: d.getTime(), label: MNAMES[d.getUTCMonth()+1].trim()+' '+d.getUTCFullYear() });
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
    const step = Math.ceil(xTicks.length / 8);
    xTicks.forEach((t, i) => t.show = i % step === 0);
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'SalesChart');
  svg.style.cssText = 'width:100%;px;display:block;';

  const mk = (tag, attrs = {}, parent = svg) => {
    const el = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
    parent.appendChild(el);
    return el;
  };

  // ── Grid ──────────────────────────────────────────────────────────────────
  yTicks.forEach(val => {
    const y = ty(val);
    mk('line', {x1:PAD.left, y1:y, x2:PAD.left+chartW, y2:y,
      stroke:'var(--color-border,#334)', 'stroke-width':'1', 'stroke-dasharray':'4 3'});
    mk('text', {x:PAD.left-8, y:y+4, 'text-anchor':'end', 'font-size':'11',
      fill:'var(--color-muted,#888)'}).textContent = '$'+val.toFixed(0);
  });

  xTicks.filter(t => t.show).forEach(t => {
    const x = tx(t.ts);
    if(x < PAD.left || x > PAD.left+chartW) return;
    mk('line', {x1:x, y1:PAD.top, x2:x, y2:PAD.top+chartH,
      stroke:'var(--color-border,#334)', 'stroke-width':'1', 'stroke-dasharray':'2 4'});
    mk('text', {x, y:H-PAD.bottom+16, 'text-anchor':'middle', 'font-size':'10',
      fill:'var(--color-muted,#888)'}).textContent = t.label;
  });

  // ── Axes ──────────────────────────────────────────────────────────────────
  mk('line', {x1:PAD.left, y1:PAD.top, x2:PAD.left, y2:PAD.top+chartH,
    stroke:'var(--color-border,#556)', 'stroke-width':'1.5'});
  mk('line', {x1:PAD.left, y1:PAD.top+chartH, x2:PAD.left+chartW, y2:PAD.top+chartH,
    stroke:'var(--color-border,#556)', 'stroke-width':'1.5'});

  // ── Average line (horizontal, full width) ─────────────────────────────────
  const avgY = ty(avgPrice);
  mk('line', {x1:PAD.left, y1:avgY, x2:PAD.left+chartW, y2:avgY,
    stroke:'var(--color-accent2,#f0a030)', 'stroke-width':'1.5',
    'stroke-dasharray':'6 3', opacity:'0.75'});

  // ── Projection line (dashed, from last sale dot → right edge) ─────────────
  // Only drawn if latest sale isn't today; starts exactly at the last dot.
  if(showProjection) {
    const px1 = tx(lastEntry.ts);
    const py1 = ty(lastEntry.price);
    const px2 = tx(nowTs);
    const py2 = ty(projectedNow);
    mk('line', {x1:px1, y1:py1, x2:px2, y2:py2,
      stroke:'var(--color-accent,#7b9ef0)', 'stroke-width':'1.5',
      'stroke-dasharray':'5 4', opacity:'0.55'});
  }

  // ── Sale price polyline (solid, only between actual sale points) ───────────
  const polyPoints = entries.map(e =>
    `${tx(e.ts).toFixed(1)},${ty(e.price).toFixed(1)}`
  ).join(' ');
  mk('polyline', {points: polyPoints, fill:'none',
    stroke:'var(--color-accent,#7b9ef0)', 'stroke-width':'2',
    'stroke-linejoin':'round', 'stroke-linecap':'round'});

  // ── Projected endpoint dot ────────────────────────────────────────────────
  if(showProjection) {
    mk('circle', {cx:tx(nowTs), cy:ty(projectedNow), r:'4',
      fill:'none', stroke:'var(--color-accent,#7b9ef0)',
      'stroke-width':'1.5', opacity:'0.55', 'stroke-dasharray':'2 2'});
  }

  // ── Tooltip ───────────────────────────────────────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.className = 'SalesChartTooltip';
  tooltip.style.cssText = [
    'display:none','position:absolute','pointer-events:none',
    'background:var(--color-bg2,#1e2535)','border:1px solid var(--color-border,#334)',
    'border-radius:6px','padding:6px 10px','font-size:13px',
    'white-space:nowrap','z-index:10','line-height:1.5'
  ].join(';');

  // ── Sale dots (drawn last so they're on top) ───────────────────────────────
  entries.forEach(e => {
    const cx = tx(e.ts), cy = ty(e.price);
    mk('circle', {cx, cy, r:'4.5',
      fill:'var(--color-accent,#7b9ef0)',
      stroke:'var(--color-bg,#131a2e)', 'stroke-width':'2'});
    // Invisible larger hit area
    const hit = mk('circle', {cx, cy, r:'14', fill:'transparent', style:'cursor:pointer'});
    hit.addEventListener('mouseenter', ev => {
      tooltip.style.display = 'block';
      tooltip.innerHTML = `<strong>${e.raw}</strong><br>${fmtDate(e.date)}`;
      moveTooltip(ev);
    });
    hit.addEventListener('mousemove', moveTooltip);
    hit.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
  });

  function moveTooltip(ev) {
    const rect = svg.getBoundingClientRect();
    const px = ev.clientX - rect.left;
    const py = ev.clientY - rect.top;
    // Flip to left if near right edge
    const tipW = 130;
    tooltip.style.left = (px + tipW > W ? px - tipW - 8 : px + 12) + 'px';
    tooltip.style.top  = Math.max(0, py - 36) + 'px';
  }

  const chartWrap = document.createElement('div');
  chartWrap.className = 'SalesChartWrap';
  chartWrap.style.cssText = 'position:relative;margin-bottom:16px;';
  chartWrap.appendChild(svg);
  chartWrap.appendChild(tooltip);
  wrap.appendChild(chartWrap);

  // ── Legend ────────────────────────────────────────────────────────────────
  const legend = document.createElement('div');
  legend.className = 'SalesLegend';
  const mkLegendSvg = (content) =>
    `<svg width="28" height="12" style="vertical-align:middle;margin-right:4px">${content}</svg>`;
  legend.innerHTML = `
    <span class="SalesLegendItem">${mkLegendSvg(
      `<line x1="0" y1="6" x2="28" y2="6" stroke="var(--color-accent,#7b9ef0)" stroke-width="2"/>
       <circle cx="14" cy="6" r="3.5" fill="var(--color-accent,#7b9ef0)" stroke="var(--color-bg,#131a2e)" stroke-width="1.5"/>`
    )} Sale price</span>
    <span class="SalesLegendItem">${mkLegendSvg(
      `<line x1="0" y1="6" x2="28" y2="6" stroke="var(--color-accent2,#f0a030)" stroke-width="1.5" stroke-dasharray="6 3"/>`
    )} Average</span>
    ${showProjection ? `<span class="SalesLegendItem">${mkLegendSvg(
      `<line x1="0" y1="6" x2="28" y2="6" stroke="var(--color-accent,#7b9ef0)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.55"/>`
    )} Projection</span>` : ''}
  `;
  wrap.appendChild(legend);

  // ── Table (newest first) ──────────────────────────────────────────────────
  const table = document.createElement('table');
  table.className = 'SalesTable';
  table.innerHTML = '<thead><tr><th>Date</th><th>Price</th></tr></thead>';
  const tbody = document.createElement('tbody');
  [...entries].sort((a,b) => b.ts - a.ts).forEach(e => {
    const tr = document.createElement('tr');
    const tdDate  = document.createElement('td');
    const tdPrice = document.createElement('td');
    tdDate.textContent = fmtDate(e.date);
    if(e.link) {
      const a = document.createElement('a');
      a.href = e.link; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = e.raw;
      tdPrice.appendChild(a);
    } else {
      tdPrice.textContent = e.raw;
    }
    tr.appendChild(tdDate);
    tr.appendChild(tdPrice);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);

  return wrap;
}