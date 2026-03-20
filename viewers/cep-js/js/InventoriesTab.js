let INDEX = null;
const getIndex = async () =>
  INDEX ||= await fetch('/viewers/cep-js/compiled-json/inventoryIndex.json')
    .then(r => r.ok ? r.json() : {})
    .catch(() => ({}));

const MNAMES = ['','Jan. ','Feb. ','Mar. ','Apr. ','May ','Jun. ','Jul. ','Aug. ','Sep. ','Oct. ','Nov. ','Dec. '];

function fmtDate(d) {
  if(!d || d === '0000-00-00' || !d.trim()) return '???';
  const [y, m, day] = d.split('-');
  const yi = parseInt(y, 10), mi = parseInt(m, 10), di = parseInt(day, 10);
  if(!yi) return '???';
  const mn = mi ? MNAMES[mi] : '', dn = di ? String(di) : '', dp = mn + dn;
  return (dp ? dp + (dp.endsWith(' ') ? '' : ' ') : '') + yi;
}

function fmtDateRange(s, e) {
  const start = fmtDate(s);
  if(e === undefined || e === null || e === '') return start + ' – Present';
  if(!e || e === '0000-00-00') return start + ' – ???';
  return start + ' – ' + fmtDate(e);
}

const FIELD_LABELS = {
  animatronics: 'Animatronics',
  stages:       'Stages',
  remodels:     'Remodels & Initiatives',
  attractions:  'Attractions',
};

export async function renderInventoriesTab(articleTitle, linker) {
  const index = await getIndex();
  const entries = index[articleTitle];
  if(!entries?.length) return null;

  const wrap = document.createElement('div');
  wrap.className = 'InventoriesTab';

  // Group by field type so we can render separate sub-tables if needed.
  // For most items they'll all be one type, but handle mixed gracefully.
  const groups = {};
  entries.forEach(e => {
    const f = e.field || 'animatronics';
    if(!groups[f]) groups[f] = [];
    groups[f].push(e);
  });

  Object.entries(groups).forEach(([field, rows]) => {
    // Section heading only if multiple field types present
    if(Object.keys(groups).length > 1) {
      const h = document.createElement('h3');
      h.className = 'InventoryHeading';
      h.textContent = FIELD_LABELS[field] || field;
      wrap.appendChild(h);
    }

    const table = document.createElement('table');
    table.className = 'InventoryTable';

    // Columns: Location | Dates | Serial # | Notes
    // Serial and Notes only shown for animatronics
    const showSerial = field === 'animatronics';
    const cols = ['Location', 'Dates', ...(showSerial ? ['Serial #'] : []), 'Notes'];
    table.innerHTML = `<thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;

    const tbody = document.createElement('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');

      // Location cell — linked if we have a linker entry
      const tdLoc = document.createElement('td');
      const pid = linker ? (linker[row.title] || null) : null;
      if(pid) {
        const a = document.createElement('a');
        a.href = `/?v=cep-js&=${encodeURIComponent(pid)}`;
        a.textContent = row.title;
        tdLoc.appendChild(a);
      } else {
        tdLoc.textContent = row.title;
      }

      // Dates cell
      const tdDate = document.createElement('td');
      tdDate.textContent = fmtDateRange(row.s || '', row.e);

      tr.appendChild(tdLoc);
      tr.appendChild(tdDate);

      if(showSerial) {
        const tdSerial = document.createElement('td');
        tdSerial.textContent = row.l || '';
        tr.appendChild(tdSerial);
      }

      const tdNotes = document.createElement('td');
      tdNotes.textContent = row.desc || row.st || '';
      tr.appendChild(tdNotes);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
  });

  return wrap;
}