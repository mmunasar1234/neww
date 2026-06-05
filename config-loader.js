window.WEDDING_CONFIG = WeddingBase.defaultConfig();

(function showLoading() {
  const el = document.createElement('div');
  el.id = 'configLoading';
  el.innerHTML = '<p>Xogta web-ka la soo rarayaa...</p>';
  el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#1a1510;display:flex;align-items:center;justify-content:center;color:#e8d5a3;font-family:sans-serif;letter-spacing:2px';
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(el); });
  if (document.body) document.body.appendChild(el);
})();

(async function loadWeddingConfig() {
  const params = new URLSearchParams(location.search);
  const key = WeddingBase.getKey();
  const forceWeb = params.get('load') === 'web' || params.has('scan');

  if (forceWeb) WeddingStore.remove(key);

  const embedded = WeddingStore.importFromUrl();
  let data = embedded;

  if (!data && (location.protocol === 'https:' || location.protocol === 'http:')) {
    data = await WeddingStore.fetchRemote(key, true);
  }

  if (!data) data = WeddingStore.load(key);

  if (data) {
    window.WEDDING_CONFIG = Object.assign(WeddingBase.defaultConfig(), data);
    WeddingStore.save(key, data);
  }

  const loading = document.getElementById('configLoading');
  if (loading) loading.remove();

  if (forceWeb && params.get('load')) {
    params.delete('load');
    const qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  window.__weddingConfigLoaded = true;
  document.dispatchEvent(new CustomEvent('wedding-config-ready'));
})();
