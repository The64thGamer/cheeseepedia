const params = new URLSearchParams(window.location.search);
const viewerMap = { 
  'cep-js': 'cep-js/default', 
  'cep-editor': 'cep-editor/default' 
};

if (params.has('payload') && !params.has('v')) params.set('v', 'cep-editor');
if (!params.has('v')) params.set('v', 'cep-js');

window.history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`);

const mod = await import(`/viewers/${viewerMap[params.get('v')] || 'cep-js/default'}.js`);
mod.render(params, document.getElementById('app'));