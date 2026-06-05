window.WEDDING_CONFIG = WeddingBase.defaultConfig();

(async function loadWeddingConfig() {
  const key = WeddingBase.getKey();
  WeddingStore.importFromUrl();

  let data = WeddingStore.load(key);
  if (!data) {
    data = await WeddingStore.fetchRemote(key);
  }

  if (data) {
    window.WEDDING_CONFIG = Object.assign(WeddingBase.defaultConfig(), data);
  }

  window.__weddingConfigLoaded = true;
  document.dispatchEvent(new CustomEvent('wedding-config-ready'));
})();
