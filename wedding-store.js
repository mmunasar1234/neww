window.WeddingStore = {
  DATA_DIR: 'data/',

  save(key, data) {
    localStorage.setItem(WeddingBase.STORAGE_PREFIX + key, JSON.stringify(data));
  },

  load(key) {
    const raw = localStorage.getItem(WeddingBase.STORAGE_PREFIX + key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  remove(key) {
    localStorage.removeItem(WeddingBase.STORAGE_PREFIX + key);
  },

  dataFilePath(key) {
    return this.DATA_DIR + encodeURIComponent(key) + '.json';
  },

  async fetchRemote(key) {
    try {
      const res = await fetch(this.dataFilePath(key) + '?t=' + Date.now());
      if (!res.ok) return null;
      const data = await res.json();
      this.save(key, data);
      return data;
    } catch {
      return null;
    }
  },

  downloadJson(key, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = key + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  encodeForQR(data) {
    const json = JSON.stringify(data);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },

  decodeFromQR(encoded) {
    try {
      let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const json = decodeURIComponent(escape(atob(b64)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  },

  importFromUrl() {
    const params = new URLSearchParams(location.search);
    const hashMatch = location.hash.match(/data=([^&]+)/);
    const encoded = params.get('d') || (hashMatch ? hashMatch[1] : null);
    if (!encoded) return null;

    const data = this.decodeFromQR(decodeURIComponent(encoded));
    if (data) {
      const key = params.get('w') || params.get('key') || WeddingBase.getKey();
      this.save(key, data);
      history.replaceState(null, '', location.pathname + '?w=' + encodeURIComponent(key));
    }
    return data;
  },

  importFromHash() {
    return this.importFromUrl();
  }
};
