window.ImageTools = {
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  compress(dataUrl, maxW, maxH, quality) {
    maxW = maxW || 800;
    maxH = maxH || 800;
    quality = quality || 0.75;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = (h * maxW) / w; w = maxW; }
        if (h > maxH) { w = (w * maxH) / h; h = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  },

  async fileToDataUrl(file, maxW, maxH, quality) {
    const raw = await this.readFile(file);
    if (!file.type.startsWith('image/')) return raw;
    return this.compress(raw, maxW, maxH, quality);
  }
};
