function runWeddingApp() {
  if (runWeddingApp.done) return;
  runWeddingApp.done = true;

  const C = window.WEDDING_CONFIG || WeddingBase.defaultConfig();
  let galleryUrls = [];
  let lightboxIdx = 0;

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val != null && val !== '') el.textContent = val;
  }

  function setBg(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url) {
      el.style.backgroundImage = 'url(' + url + ')';
      el.classList.add('has-photo');
    } else {
      el.style.backgroundImage = '';
      el.classList.remove('has-photo');
    }
  }

  document.title = (C.groom && C.bride) ? C.groom + ' & ' + C.bride + ' — Martiqaad Aroos' : 'Martiqaad Aroos';

  // Splash & hero
  setText('splashInitials', C.initials);
  setText('splashSub', C.splashSub);
  setText('splashGroom', C.groom);
  setText('splashBride', C.bride);
  setText('splashHint', C.splashHint);
  setText('heroSub', C.heroSub);
  setText('heroGroom', C.groom);
  setText('heroBride', C.bride);
  setText('heroDate', C.heroDate);
  setText('heroTime', C.heroTime);
  setText('scrollHint', C.scrollHint);
  setBg('heroBg', C.heroBg);

  // Sections
  setText('coupleSub', C.coupleSub);
  setText('coupleTitle', C.coupleTitle);
  setText('gallerySub', C.gallerySub);
  setText('galleryTitle', C.galleryTitle);
  setText('loveSub', C.loveSub);
  setText('loveTitle', C.loveTitle);
  setText('loveQuote', C.loveQuote);
  setText('loveSign', C.loveSign);
  setText('countdownSub', C.countdownSub);
  setText('countdownTitle', C.countdownTitle);
  setText('venueSub', C.venueSub);
  setText('venueTitle', C.venueTitle);
  setText('venueName', C.venueName);
  setText('venueAddress', C.venueAddress);
  setText('venueTime', C.venueTime || C.heroTime);
  setText('footerNames', C.groom + ' & ' + C.bride);
  setText('footerTag', C.footerTag);
  setText('rsvpText', C.footerTag || 'Waxaan rajaynaynaa inaad nala joogtaan');
  setText('labelDays', C.labelDays);
  setText('labelHours', C.labelHours);
  setText('labelMins', C.labelMins);
  setText('labelSecs', C.labelSecs);

  const venueBtn = document.getElementById('venueBtn');
  if (venueBtn && C.venueMapUrl) {
    venueBtn.href = C.venueMapUrl;
    venueBtn.target = '_blank';
    venueBtn.rel = 'noopener';
  }

  // Couple grid
  const coupleGrid = document.getElementById('coupleGrid');
  if (coupleGrid && C.couple) {
    coupleGrid.innerHTML = C.couple.map(function (p, i) {
      const initial = (p.name || '?')[0].toUpperCase();
      const photoHtml = p.photo
        ? '<img class="couple-photo" src="' + p.photo + '" alt="' + p.name + '">'
        : '<span class="photo-placeholder">' + initial + '</span>';
      const frameClass = p.photo ? 'photo-frame' : 'photo-frame no-photo';
      return '<div class="couple-card" style="transition-delay:' + (i * 0.15) + 's">' +
        '<div class="' + frameClass + '">' + photoHtml + '</div>' +
        '<p class="couple-name">' + (p.name || '') + '</p>' +
        '<p class="couple-role">' + (p.role || '') + '</p>' +
        '<p class="couple-desc">' + (p.desc || '') + '</p></div>';
    }).join('');
  }

  function gallerySrc(item) {
    return typeof item === 'string' ? item : (item && item.src) || '';
  }

  // Gallery
  const gallerySection = document.getElementById('gallery');
  const galleryGrid = document.getElementById('galleryGrid');
  galleryUrls = (C.gallery && C.gallery.length) ? C.gallery.map(gallerySrc).filter(Boolean) : [];

  if (gallerySection && galleryGrid) {
    if (!galleryUrls.length) {
      gallerySection.classList.add('hidden');
    } else {
      gallerySection.classList.remove('hidden');
      galleryGrid.innerHTML = galleryUrls.map(function (src, i) {
        return '<div class="gallery-item" style="--i:' + i + '" data-idx="' + i + '">' +
          '<div class="gallery-frame" role="button" tabindex="0" aria-label="Fur sawirka">' +
          '<div class="gallery-ornament"></div>' +
          '<img src="' + src + '" alt="Sawir ' + (i + 1) + '" loading="lazy">' +
          '</div></div>';
      }).join('');
    }
  }

  // Music
  const audio = document.getElementById('weddingMusic');
  const musicBtn = document.getElementById('musicControl');
  if (audio && C.musicUrl) {
    audio.src = C.musicUrl;
    if (musicBtn) musicBtn.classList.add('show');
  }

  function toggleMusic() {
    if (!C.musicUrl || !audio) return;
    if (audio.paused) {
      audio.play().then(function () { musicBtn.classList.add('playing'); }).catch(function () {});
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
    }
  }
  if (musicBtn) musicBtn.addEventListener('click', toggleMusic);

  // Splash
  const splash = document.getElementById('splash');
  const splashCard = document.getElementById('splashCard');
  function openInvite() {
    if (splash) splash.classList.add('hidden');
    const sideNav = document.getElementById('sideNav');
    if (sideNav) sideNav.classList.add('show');
    if (C.musicUrl && audio) {
      audio.play().then(function () { musicBtn.classList.add('playing'); }).catch(function () {});
    }
    if (musicBtn && C.musicUrl) musicBtn.classList.add('show');
  }
  if (splashCard) splashCard.addEventListener('click', openInvite);

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  function openLightbox(idx) {
    if (!galleryUrls.length || !lightbox) return;
    lightboxIdx = idx;
    lightboxImg.src = galleryUrls[lightboxIdx];
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    lightboxIdx = (lightboxIdx + dir + galleryUrls.length) % galleryUrls.length;
    lightboxImg.src = galleryUrls[lightboxIdx];
  }

  if (galleryGrid) {
    galleryGrid.addEventListener('click', function (e) {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      openLightbox(parseInt(item.dataset.idx, 10));
    });
    galleryGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      const frame = e.target.closest('.gallery-frame');
      if (!frame) return;
      const item = frame.closest('.gallery-item');
      if (item) openLightbox(parseInt(item.dataset.idx, 10));
    });
  }

  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', function () { navLightbox(-1); });
  document.getElementById('lightboxNext')?.addEventListener('click', function () { navLightbox(1); });
  lightbox?.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // Side nav active state
  const sideNav = document.getElementById('sideNav');
  const navLinks = sideNav ? sideNav.querySelectorAll('a') : [];
  const sections = ['hero', 'couple', 'gallery', 'love', 'countdown', 'venue']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sideNav) {
    const navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  // Particles
  function makeParticles(container, cls, count, styleFn) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = cls;
      Object.assign(el.style, styleFn(i));
      container.appendChild(el);
    }
  }

  makeParticles(document.getElementById('sparkles'), 'sparkle', 24, function () {
    return { left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDelay: Math.random() * 3 + 's' };
  });
  makeParticles(document.getElementById('splashPetals'), 'splash-petal', 14, function () {
    return { left: Math.random() * 100 + '%', animationDuration: 6 + Math.random() * 6 + 's', animationDelay: Math.random() * 5 + 's' };
  });
  makeParticles(document.getElementById('petals'), 'petal', 10, function () {
    return { left: Math.random() * 100 + '%', animationDuration: 8 + Math.random() * 8 + 's', animationDelay: Math.random() * 6 + 's' };
  });

  // Scroll reveal
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .couple-card, .gallery-item, .love-quote-box').forEach(function (el) {
    observer.observe(el);
  });

  // Countdown with flip animation on change
  let prevSecs = '';
  function updateCountdown() {
    const target = new Date(C.countdownDate).getTime();
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    const sStr = String(s).padStart(2, '0');
    setText('days', String(d).padStart(2, '0'));
    setText('hours', String(h).padStart(2, '0'));
    setText('mins', String(m).padStart(2, '0'));
    const secsEl = document.getElementById('secs');
    if (secsEl && sStr !== prevSecs) {
      secsEl.style.transform = 'scale(1.1)';
      setTimeout(function () { secsEl.style.transform = ''; }, 150);
      prevSecs = sStr;
    }
    setText('secs', sStr);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Subtle hero parallax
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
    }, { passive: true });
  }
}

if (window.__weddingConfigLoaded) {
  runWeddingApp();
} else {
  document.addEventListener('wedding-config-ready', runWeddingApp);
}
