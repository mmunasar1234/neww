window.QRLib = {
  _scanLoaded: false,

  loadScanner() {
    if (this._scanLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
      s.onload = () => { this._scanLoaded = true; resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  getSiteBase(siteUrl) {
    const custom = (siteUrl || '').trim().replace(/\/+$/, '');
    if (custom) {
      if (!/^https?:\/\//i.test(custom)) return 'https://' + custom.replace(/^\/+/, '');
      return custom;
    }
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      const dir = location.pathname.replace(/[^/]*$/, '');
      return location.origin + dir.replace(/\/$/, '');
    }
    return null;
  },

  buildUrl(key, data, siteUrl) {
    const base = this.getSiteBase(siteUrl || (data && data.siteUrl));
    const path = 'class.html?w=' + encodeURIComponent(key);
    return base ? base + '/' + path : path;
  },

  isWebReady(url) {
    return /^https?:\/\//i.test(url);
  },

  showQR(containerId, text, meta) {
    const box = document.getElementById(containerId);
    if (!box) return;
    meta = meta || {};

    const safe = encodeURIComponent(text);
    const isWeb = this.isWebReady(text);
    const warn = meta.warning || (!isWeb
      ? 'Geli GitHub URL kor ku qoran. Kadib soo dejiso index.json oo ku rid folder-ka data/'
      : '');

    box.innerHTML =
      '<img id="qrImage" width="260" height="260" alt="QR Code" ' +
      'style="display:block;margin:0 auto;border-radius:4px" ' +
      'src="https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=14&color=2c2416&bgcolor=ffffff&data=' + safe + '">' +
      (warn ? '<p class="qr-warn" style="font-size:0.78rem;color:#ffb74d;margin-top:0.75rem;line-height:1.5">' + warn + '</p>' : '') +
      '<p style="font-size:0.72rem;color:rgba(255,255,255,0.5);margin-top:0.5rem">QR Link (gaaban):</p>' +
      '<a href="' + text + '" target="_blank" rel="noopener" ' +
      'style="display:block;font-size:0.8rem;color:var(--gold,#c9a962);margin-top:0.35rem;word-break:break-all;text-decoration:underline">' + text + '</a>' +
      '<p style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin-top:0.5rem">' + text.length + ' xaraf — xogtu waa data/' + (meta.key || 'index') + '.json</p>';

    box.style.display = 'block';
  },

  downloadQR() {
    const img = document.getElementById('qrImage');
    if (!img) return;
    const a = document.createElement('a');
    a.download = 'martiqaad-qr.png';
    a.href = img.src;
    a.click();
  },

  parseScanResult(text) {
    try {
      const url = new URL(text, location.href);
      const key = url.searchParams.get('w') || url.searchParams.get('key');
      if (key) return { _key: key, _url: text };

      const d = url.searchParams.get('d');
      if (d) {
        const data = WeddingStore.decodeFromQR(d);
        if (data) {
          data._key = url.searchParams.get('w') || 'index';
          return data;
        }
      }
    } catch {}
    return null;
  },

  openFromWebLink() {
    const params = new URLSearchParams(location.search);
    const w = params.get('w') || params.get('key');
    if (!w || params.get('d')) return false;
    location.replace('class.html?w=' + encodeURIComponent(w));
    return true;
  }
};
