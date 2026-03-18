const FAV = '/viewers/cep-js/compiled-json/favicons';

const safeName  = d => d.replace(/^https?:\/\/(www\.)?/,'').replace(/[^\w\-.]/g,'_')+'.png';
const stripProto = s => s.replace(/^https?:\/\/(www\.)?/,'');
const getDomain  = url => { try { return new URL(url).hostname.replace(/^www\./,''); } catch { return null; } };
const getOrigin  = url => { try { return stripProto(new URL(url).origin); } catch { return null; } };
const isUrl      = s => /^https?:\/\//i.test(s);

export function buildCitations(container, citations) {
  if (!citations?.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'Citations';
  wrap.innerHTML = '<h2>Citations</h2>';

  citations.forEach((cite, i) => {
    const n = i + 1;
    const url = isUrl(cite);
    const domain = url ? getDomain(cite) : null;

    const item = document.createElement('div');
    item.className = 'CitationItem';
    item.id = `cite-${n}`;

    const icon = document.createElement('div');
    icon.className = 'CitationIcon';
    if (domain) {
    const img = document.createElement('img');
    img.alt = domain;
    img.src = `${FAV}/${safeName(domain)}`;
    img.onerror = () => { img.style.display = 'none'; };
    icon.appendChild(img);
  }

    const text = document.createElement('div');
    text.className = 'CitationText';

    if (url) {
      const origin = getOrigin(cite);
      text.innerHTML = `
        <a class="CitationTitle" href="${cite}" target="_blank" rel="noopener">${n}. ${origin||domain||cite}</a>
        <a class="CitationUrl"   href="${cite}" target="_blank" rel="noopener">${stripProto(cite)}</a>`;
    } else {
      text.innerHTML = `<span class="CitationTitle">${n}. ${cite}</span>`;
    }

    item.appendChild(icon); item.appendChild(text);
    wrap.appendChild(item);
  });

  container.appendChild(wrap);

  // Wire [n] superscripts to jump to #cite-n
  container.querySelectorAll('sup').forEach(sup => {
    const m = sup.textContent.match(/^\((\d+)\)$/);
    if (m) sup.innerHTML = `<a href="#cite-${m[1]}">${sup.textContent}</a>`;
  });
}