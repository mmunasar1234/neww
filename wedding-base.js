window.WeddingBase = {
  STORAGE_PREFIX: 'wedding_',
  DEFAULT_KEY: 'index',

  getKey() {
    const params = new URLSearchParams(location.search);
    const hashKey = location.hash.replace(/^#/, '').split('data=')[0].replace(/\/$/, '');
    return params.get('w') || params.get('key') || (hashKey && !hashKey.startsWith('data') ? hashKey : null) || document.documentElement.dataset.weddingKey || this.DEFAULT_KEY;
  },

  defaultConfig() {
    return {
      groom: 'Ahmed',
      bride: 'Amina',
      initials: 'A & A',
      splashSub: 'Waxaa laydinku casuumay',
      splashHint: 'Guji si aad u furto martiqaadka',
      heroSub: 'Martiqaad Aroos',
      heroDate: '15 Juun 2026',
      heroTime: '6:00 Galabnimo',
      coupleSub: 'Lamaanaha',
      coupleTitle: 'Aroosayaashu',
      gallerySub: 'Xusuusaha',
      galleryTitle: 'Sawirrada',
      loveSub: 'Sheekadeenna',
      loveTitle: 'Jacaylkeenna',
      loveQuote: 'Jacaylku waa safar wanaagsan oo laba qalbi ay wadaagaan.',
      loveSign: 'Ahmed & Amina',
      countdownSub: 'Waqtiga Haray',
      countdownTitle: 'Tirinta Waqtiga',
      countdownDate: '2026-06-15T18:00:00',
      venueSub: 'Goobta',
      venueTitle: 'Halka Aroosku Ka Dhacayo',
      venueName: 'Grand Hall Hotel',
      venueAddress: 'Mogadishu, Soomaaliya',
      venueTime: '6:00 Galabnimo',
      venueMapUrl: 'https://maps.google.com',
      footerTag: 'Waxaan rajaynaynaa inaad nala joogtaan',
      scrollHint: 'Hoos u eeg',
      labelDays: 'Maalmood',
      labelHours: 'Saacado',
      labelMins: 'Daqiiqo',
      labelSecs: 'Ilbiriqsi',
      siteUrl: '',
      imageSettings: {
        hero: { maxW: 1200, maxH: 800, quality: 75 },
        groom: { maxW: 800, maxH: 800, quality: 75 },
        bride: { maxW: 800, maxH: 800, quality: 75 },
        gallery: { maxW: 600, maxH: 600, quality: 70 }
      },
      heroBg: '',
      musicUrl: '',
      couple: [
        { name: 'Ahmed', role: 'Arooski', desc: 'Wiilka arooska', photo: '' },
        { name: 'Amina', role: 'Aroosadda', desc: 'Gabadha arooska', photo: '' }
      ],
      gallery: []
    };
  }
};
