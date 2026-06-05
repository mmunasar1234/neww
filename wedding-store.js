window.WeddingStore = {
  DATA_DIR: 'data/',

  save(key, data) {
    const clean = this.cleanForSave(data);
    localStorage.setItem(WeddingBase.STORAGE_PREFIX + key, JSON.stringify(clean));
  },

  cleanForSave(data) {
    if (!data || typeof data !== 'object') return data;
    const copy = JSON.parse(JSON.stringify(data));
    if (copy.gallery && Array.isArray(copy.gallery)) {
      copy.gallery = copy.gallery.map(function (g) {
        if (typeof g === 'string') return g;
        return { src: g.src, maxW: g.maxW, maxH: g.maxH, quality: g.quality };
      });
    }
    return copy;
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

  async fetchRemote(key, noCache) {
    try {
      const url = this.dataFilePath(key) + (noCache ? '?t=' + Date.now() : '');
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return this.cleanForSave(data);
    } catch {
      return null;
    }
  },

  downloadJson(key, data) {
    const blob = new Blob([JSON.stringify(this.cleanForSave(data), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = key + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  encodeForQR(data) {
    const json = JSON.stringify(this.cleanForSave(data));
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
