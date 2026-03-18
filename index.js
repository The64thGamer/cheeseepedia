const params = new URLSearchParams(window.location.search);
const viewerMap = {
  'cep-js':    'cep-js/default',
  'theoryweb': 'theoryweb/default',
};
const viewerKey = params.get('v') || 'cep-js';
const viewer = viewerMap[viewerKey] || 'cep-js/default';
if (!params.has('v')) {
  params.set('v', viewerKey);
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);
}
const mod = await import(`/viewers/${viewer}.js`);
mod.render(params, document.getElementById('app'));