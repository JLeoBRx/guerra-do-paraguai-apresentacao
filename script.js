(() => {
  const progress = document.getElementById('readingProgress');
  const backToTop = document.getElementById('backToTop');
  const menuButton = document.getElementById('menuButton');
  const sidebar = document.getElementById('sumario');
  const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
  const sections = Array.from(document.querySelectorAll('.research > .chapter'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxZoom = document.getElementById('lightboxZoom');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxCount = document.getElementById('lightboxCount');
  const lightboxError = document.getElementById('lightboxError');
  let activeLightboxImages = [];
  let activeLightboxIndex = 0;
  let lastImageFocus = null;

  // Presentation layer: a concise 10-slide summary of the longer research site.
  const presentation = document.getElementById('presentation');
  const presentationButton = document.getElementById('presentButton');
  const presentationExit = document.getElementById('presentationExit');
  const presSlides = Array.from(document.querySelectorAll('.pres-slide'));
  const presCounter = document.getElementById('presCounter');
  const presProgressFill = document.getElementById('presProgressFill');
  const presPrev = document.getElementById('presPrev');
  const presNext = document.getElementById('presNext');
  const presDots = document.getElementById('presDots');
  let presIndex = 0;
  let presentationActive = false;
  let startedByBrowserFullscreen = false;
  let requestedFullscreenForPresentation = false;
  let suppressBrowserFullscreenPresentation = false;
  let scrollQueued = false;
  let fullscreenResyncQueued = false;
  const baseTitle = 'Guerra do Paraguai — Atlas Histórico Interativo';

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const doc = document.documentElement;
    const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
    progress.style.width = Math.min(100, Math.max(0, scrollTop / maxScroll * 100)) + '%';
    backToTop.classList.toggle('visible', scrollTop > 640);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScrollUI);
      scrollQueued = true;
    }
  }, { passive: true });
  window.addEventListener('resize', () => {
    updateScrollUI();
    syncFullscreenMode();
    // F11 changes the browser chrome and viewport on separate frames in some
    // browsers. Re-check once after the resize settles without cancelling F11.
    if (!fullscreenResyncQueued) {
      fullscreenResyncQueued = true;
      window.setTimeout(() => {
        fullscreenResyncQueued = false;
        syncFullscreenMode();
      }, 180);
    }
  }, { passive: true });
  updateScrollUI();

  // Editorial reveal motion for the long-form research page.
  function initRevealMotion() {
    const selector = [
      '.chapter > .chapter-tag', '.chapter > h2', '.chapter > .abstract',
      '.chapter > .question-box', '.chapter > .two-column-copy', '.chapter > .method-strip',
      '.chapter > .figure', '.chapter > .figure-note', '.country-grid article',
      '.cause-list article', '.interpretation-note', '.timeline-row', '.battle-feature',
      '.image-grid .figure', '.caution-box', '.impact-row', '.historiography-grid article',
      '.source-method', '.final-thesis', '.references-list li', '.references-note'
    ].join(',');
    const targets = Array.from(document.querySelectorAll(selector));
    if (!targets.length) return;
    targets.forEach((element, index) => {
      element.classList.add('site-reveal');
      element.style.setProperty('--reveal-order', String(index % 5));
    });
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(element => element.classList.add('is-revealed'));
      return;
    }
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    targets.forEach(element => observer.observe(element));
  }
  initRevealMotion();

  // Subtle cover depth effect for fine pointers; it is disabled for touch
  // devices and for users who request reduced motion.
  function initAtlasInteractions() {
    const cover = document.querySelector('.cover');
    const frame = cover && cover.querySelector('.cover-image-frame');
    if (!cover || !frame || !window.matchMedia) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return;
    cover.addEventListener('pointermove', event => {
      const rect = cover.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cover.style.setProperty('--atlas-tilt-x', (x * 3.6).toFixed(2) + 'deg');
      cover.style.setProperty('--atlas-tilt-y', (y * -3.2).toFixed(2) + 'deg');
    }, { passive: true });
    cover.addEventListener('pointerleave', () => {
      cover.style.setProperty('--atlas-tilt-x', '0deg');
      cover.style.setProperty('--atlas-tilt-y', '0deg');
    }, { passive: true });
  }
  initAtlasInteractions();

  function setMenu(open) {
    sidebar.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-icon').textContent = open ? '✕' : '☰';
  }
  menuButton.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
  tocLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.getElementById('printButton').addEventListener('click', () => window.print());
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  function renderPresSlide(index) {
    const previousIndex = presIndex;
    presIndex = Math.max(0, Math.min(presSlides.length - 1, index));
    const direction = presIndex >= previousIndex ? 'next' : 'prev';
    presSlides.forEach((slide, i) => {
      slide.hidden = i !== presIndex;
      if (i === presIndex) slide.dataset.direction = direction;
      slide.setAttribute('tabindex', '-1');
      slide.setAttribute('aria-label', 'Slide ' + (i + 1) + ' de ' + presSlides.length + ': ' + (slide.dataset.presTitle || 'Apresentação'));
    });
    presCounter.textContent = String(presIndex + 1).padStart(2, '0') + ' / ' + String(presSlides.length).padStart(2, '0');
    presProgressFill.style.width = ((presIndex + 1) / presSlides.length * 100) + '%';
    if (presentationActive) {
      document.title = (presSlides[presIndex].dataset.presTitle || 'Apresentação') + ' — Guerra do Paraguai';
    }
    presPrev.disabled = presIndex === 0;
    presNext.disabled = presIndex === presSlides.length - 1;
    presNext.innerHTML = presIndex === presSlides.length - 1 ? 'Fim <span aria-hidden="true">✓</span>' : 'Próximo <span aria-hidden="true">→</span>';
    Array.from(presDots.children).forEach((dot, i) => {
      if (i === presIndex) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
  }

  function createSlideDots() {
    presSlides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'pres-dot';
      dot.setAttribute('aria-label', 'Ir para slide ' + (index + 1) + ': ' + (slide.dataset.presTitle || 'Slide'));
      dot.addEventListener('click', () => renderPresSlide(index));
      presDots.appendChild(dot);
    });
  }

  createSlideDots();

  // Cards become little exploration controls: selecting one updates a live
  // context panel while keeping all slide content available.
  function initSlideInteractions() {
    const groupSelector = '.pres-country-list, .pres-cause-grid, .pres-timeline, .pres-consequence-list, .pres-hist-grid, .pres-human-list';
    document.querySelectorAll(groupSelector).forEach(group => {
      const items = Array.from(group.querySelectorAll(':scope > article, :scope > li'));
      if (!items.length || group.dataset.interactiveReady === 'true') return;
      group.dataset.interactiveReady = 'true';

      const panel = document.createElement('div');
      panel.className = 'pres-interaction-panel';
      panel.setAttribute('aria-live', 'polite');
      panel.setAttribute('role', 'status');
      const kicker = document.createElement('span');
      kicker.className = 'pres-interaction-kicker';
      kicker.textContent = 'MODO EXPLORAR';
      const title = document.createElement('strong');
      title.textContent = 'Escolha um item';
      const body = document.createElement('p');
      body.textContent = 'Selecione qualquer cartão para destacá-lo e ver seu resumo nesta área.';
      panel.append(kicker, title, body);
      group.insertAdjacentElement('afterend', panel);

      const selectItem = item => {
        items.forEach(other => {
          const active = other === item;
          other.classList.toggle('is-selected', active);
          other.setAttribute('aria-pressed', String(active));
        });
        const time = item.querySelector('time');
        const heading = item.querySelector('h3, strong');
        const titleText = [time && time.textContent.trim(), heading && heading.textContent.trim()]
          .filter(Boolean).join(' — ') || (item.querySelector('span') && item.querySelector('span').textContent.trim()) || 'Item selecionado';
        const detailNode = item.querySelector('p, small, li > span, div > span');
        title.textContent = titleText;
        body.textContent = detailNode ? detailNode.textContent.trim() : item.textContent.trim();
      };

      items.forEach(item => {
        item.classList.add('pres-interactive-card');
        item.tabIndex = 0;
        item.setAttribute('role', 'button');
        item.setAttribute('aria-pressed', 'false');
        item.addEventListener('click', () => selectItem(item));
        item.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectItem(item);
          }
        });
      });
    });
  }
  initSlideInteractions();

  function setPresentation(active, source) {
    presentationActive = active;
    if (active) {
      if (source === 'browser') {
        startedByBrowserFullscreen = true;
        suppressBrowserFullscreenPresentation = false;
      }
      if (source === 'button') startedByBrowserFullscreen = false;
      presentation.hidden = false;
      document.body.classList.add('is-presenting');
      setMenu(false);
      renderPresSlide(presIndex);
      // Put keyboard/screen-reader focus inside the active presentation layer.
      try { presSlides[presIndex].focus({ preventScroll: true }); } catch (_) { presSlides[presIndex].focus(); }
      presentationButton.setAttribute('aria-pressed', 'true');
      presentationButton.querySelector('span:last-child').textContent = 'Em apresentação';
      document.title = (presSlides[presIndex].dataset.presTitle || 'Apresentação') + ' — Guerra do Paraguai';
    } else {
      if (source === 'hide-in-browser-fullscreen') suppressBrowserFullscreenPresentation = true;
      if (source === 'browser-exit') suppressBrowserFullscreenPresentation = false;
      presentation.hidden = true;
      document.body.classList.remove('is-presenting');
      presentationButton.setAttribute('aria-pressed', 'false');
      presentationButton.querySelector('span:last-child').textContent = 'Apresentar';
      document.title = baseTitle;
      startedByBrowserFullscreen = false;
      presSlides.forEach((slide, i) => { slide.hidden = i !== 0; });
      presIndex = 0;
      renderPresSlide(0);
      // Return focus to the control that opened the presentation when possible.
      try { presentationButton.focus({ preventScroll: true }); } catch (_) { presentationButton.focus(); }
    }
  }

  function browserWindowIsFullscreen() {
    // F11 usually toggles the browser chrome, not document.fullscreenElement.
    // Infer it from the viewport filling almost all available screen height.
    const availableHeight = window.screen && window.screen.availHeight;
    if (!availableHeight || !window.innerHeight || !window.outerHeight) return false;
    return window.innerHeight >= availableHeight - 45 &&
      window.outerHeight >= availableHeight - 25;
  }

  function syncFullscreenMode() {
    const documentFullscreen = Boolean(document.fullscreenElement);
    const browserFullscreen = !documentFullscreen && browserWindowIsFullscreen();
    const full = documentFullscreen || browserFullscreen;
    if (full && !presentationActive && !suppressBrowserFullscreenPresentation) {
      setPresentation(true, 'browser');
    } else if (full && presentationActive && browserFullscreen && !requestedFullscreenForPresentation) {
      // If F11 is pressed after the fallback button failed to requestFullscreen,
      // still remember that this presentation now follows browser-level fullscreen.
      startedByBrowserFullscreen = true;
    } else if (!full && suppressBrowserFullscreenPresentation) {
      // The user explicitly returned to the article while browser F11 was active.
      suppressBrowserFullscreenPresentation = false;
    } else if (!full && presentationActive && startedByBrowserFullscreen && !requestedFullscreenForPresentation) {
      setPresentation(false, 'browser-exit');
    }
  }

  function exitPresentation() {
    const shouldExitDocumentFullscreen = Boolean(document.fullscreenElement);
    const shouldStayInBrowserFullscreen = !shouldExitDocumentFullscreen &&
      startedByBrowserFullscreen && browserWindowIsFullscreen();
    requestedFullscreenForPresentation = false;
    setPresentation(false, shouldStayInBrowserFullscreen ? 'hide-in-browser-fullscreen' : 'exit');
    if (shouldExitDocumentFullscreen && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  presentationButton.addEventListener('click', () => {
    if (presentationActive) {
      exitPresentation();
      return;
    }
    // Keep browser F11 in charge of browser fullscreen. The button only opens
    // the slide layer, so F11 can reliably enter/leave the deck without a
    // competing requestFullscreen() state.
    requestedFullscreenForPresentation = false;
    setPresentation(true, 'button');
  });
  presentationExit.addEventListener('click', exitPresentation);
  presPrev.addEventListener('click', () => renderPresSlide(presIndex - 1));
  presNext.addEventListener('click', () => renderPresSlide(presIndex + 1));

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && requestedFullscreenForPresentation) {
      requestedFullscreenForPresentation = false;
      if (presentationActive) setPresentation(false, 'fullscreen-exit');
    }
    syncFullscreenMode();
  });

  document.addEventListener('keydown', event => {
    const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
    const inFormControl = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;
    if (event.key === 'F11' && !event.repeat) {
      // Never toggle early: F11 belongs to the browser. Re-check after its viewport changes.
      window.setTimeout(syncFullscreenMode, 180);
      window.setTimeout(syncFullscreenMode, 520);
      return;
    }
    if (lightbox.open) {
      if (event.key === 'ArrowRight') { event.preventDefault(); showLightboxAt(activeLightboxIndex + 1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); showLightboxAt(activeLightboxIndex - 1); }
      else if (event.key.toLowerCase() === 'z' || event.key === '+') { event.preventDefault(); lightboxZoom.click(); }
      return;
    }
    const interactiveCard = event.target && event.target.closest ? event.target.closest('.pres-interactive-card') : null;
    if (presentationActive) {
      if (event.key === 'Escape') {
        event.preventDefault();
        exitPresentation();
      } else if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && tag !== 'button' && tag !== 'a' && !interactiveCard)) {
        if (!inFormControl) { event.preventDefault(); renderPresSlide(presIndex + 1); }
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        if (!inFormControl) { event.preventDefault(); renderPresSlide(presIndex - 1); }
      } else if (event.key === 'Home') {
        event.preventDefault(); renderPresSlide(0);
      } else if (event.key === 'End') {
        event.preventDefault(); renderPresSlide(presSlides.length - 1);
      }
      return;
    }
    if (event.key === 'Escape') setMenu(false);
  });

  // Browser F11 can be intercepted before the page sees it; use viewport changes and
  // deferred checks instead of cancelling or prematurely toggling the browser shortcut.
  window.addEventListener('focus', () => window.setTimeout(syncFullscreenMode, 120));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) window.setTimeout(syncFullscreenMode, 120);
  });
  syncFullscreenMode();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tocLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + visible.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      const index = sections.findIndex(section => section.id === visible.target.id);
      const counter = document.querySelector('.sidebar-index');
      if (counter && index >= 0) counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0');
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .1, .35, .65] });
    sections.forEach(section => observer.observe(section));
  }


  // Retry a historical image through a documented alternate source. If both
  // sources fail, show an explicit status instead of a broken-image icon.
  function imageFallbackMessage(image, caption) {
    if (caption && caption.querySelector('.image-fallback-note')) return;
    const note = document.createElement('div');
    note.className = 'image-fallback-note';
    note.setAttribute('role', 'note');
    const title = document.createElement('strong');
    title.textContent = 'Imagem principal indisponível';
    const detail = document.createElement('span');
    detail.textContent = image.dataset.fallbackCaption || 'A imagem principal não carregou; esta alternativa mantém o contexto visual.';
    note.append(title, detail);
    image.addEventListener('load', () => {
      if (image.dataset.fallbackTried === 'true' && image.naturalWidth > 0) {
        title.textContent = 'Imagem alternativa exibida';
      }
    }, { once: true });
    if (image.dataset.fallbackCreditUrl) {
      const source = document.createElement('a');
      source.href = image.dataset.fallbackCreditUrl;
      source.target = '_blank';
      source.rel = 'noreferrer';
      source.textContent = 'Fonte da imagem alternativa ↗';
      note.append(source);
    }
    if (caption) caption.prepend(note);
    else {
      const parent = image.closest('figure') || image.parentElement;
      if (parent) parent.append(note);
    }
  }

  function showImageFailure(image) {
    image.hidden = true;
    const figure = image.closest('figure');
    if (figure) {
      figure.classList.add('image-load-failed');
      if (!figure.querySelector('.image-unavailable-panel')) {
        const panel = document.createElement('div');
        panel.className = 'image-unavailable-panel';
        panel.setAttribute('role', 'status');
        panel.textContent = 'A imagem não pôde ser carregada. Use o link da fonte na legenda para abrir o registro original.';
        figure.append(panel);
      }
    }
  }

  function handleImageError(image) {
    const fallback = image.dataset.fallbackSrc;
    if (fallback && image.dataset.fallbackTried !== 'true' && image.src !== fallback) {
      image.dataset.fallbackTried = 'true';
      image.alt = image.dataset.fallbackAlt || image.alt;
      const caption = image.closest('figure') && image.closest('figure').querySelector('figcaption');
      imageFallbackMessage(image, caption);
      image.src = fallback;
      return;
    }
    showImageFailure(image);
  }

  function initImageFallbacks() {
    document.querySelectorAll('img[src]').forEach(image => {
      if (image.id === 'lightboxImage' || !image.getAttribute('src')) return;
      image.addEventListener('error', () => handleImageError(image));
      if (image.complete && image.naturalWidth === 0) handleImageError(image);
    });
  }
  initImageFallbacks();

  function getGalleryImages(referenceImage) {
    const selector = presentationActive
      ? '.pres-slide:not([hidden]) figure img[src]'
      : '.cover-visual img[src], .figure .image-button img[src]';
    const found = Array.from(document.querySelectorAll(selector)).filter(image =>
      image.id !== 'lightboxImage' && !image.hidden && image.getAttribute('src')
    );
    if (referenceImage && !found.includes(referenceImage)) found.unshift(referenceImage);
    return found;
  }

  function showLightboxAt(index) {
    if (!activeLightboxImages.length) {
      lightboxError.hidden = false;
      return;
    }
    activeLightboxIndex = (index + activeLightboxImages.length) % activeLightboxImages.length;
    const sourceImage = activeLightboxImages[activeLightboxIndex];
    lightboxImage.hidden = false;
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt || 'Imagem histórica ampliada';
    const caption = sourceImage.closest('figure') && sourceImage.closest('figure').querySelector('figcaption');
    lightboxCaption.textContent = caption ? caption.textContent.trim().replace(/\s+/g, ' ').slice(0, 220) : (sourceImage.alt || 'Imagem histórica');
    lightboxCount.textContent = String(activeLightboxIndex + 1).padStart(2, '0') + ' / ' +
      String(activeLightboxImages.length).padStart(2, '0');
    lightboxPrev.disabled = activeLightboxImages.length < 2;
    lightboxNext.disabled = activeLightboxImages.length < 2;
    lightboxError.hidden = true;
    lightboxStage.classList.remove('is-zoomed');
    lightboxZoom.setAttribute('aria-pressed', 'false');
    lightboxZoom.textContent = 'ZOOM +';
  }

  function openImageViewer(image) {
    if (!image || !image.src) return;
    lastImageFocus = image;
    activeLightboxImages = getGalleryImages(image);
    activeLightboxIndex = Math.max(0, activeLightboxImages.indexOf(image));
    showLightboxAt(activeLightboxIndex);
    if (typeof lightbox.showModal === 'function') {
      if (!lightbox.open) lightbox.showModal();
    } else {
      window.open(image.currentSrc || image.src, '_blank', 'noopener,noreferrer');
    }
  }

  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => openImageViewer(button.querySelector('img')));
  });

  // Slide and cover images can be opened with either a click or the keyboard.
  document.querySelectorAll('.pres-slide figure img[src], .cover-visual img[src]').forEach(image => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', 'Ampliar imagem: ' + (image.alt || 'imagem histórica'));
    image.addEventListener('click', () => openImageViewer(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImageViewer(image);
      }
    });
  });

  lightboxPrev.addEventListener('click', () => showLightboxAt(activeLightboxIndex - 1));
  lightboxNext.addEventListener('click', () => showLightboxAt(activeLightboxIndex + 1));
  lightboxZoom.addEventListener('click', () => {
    const zoomed = lightboxStage.classList.toggle('is-zoomed');
    lightboxZoom.setAttribute('aria-pressed', String(zoomed));
    lightboxZoom.textContent = zoomed ? 'ZOOM −' : 'ZOOM +';
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.src = '';
    lightboxImage.alt = '';
    lightboxStage.classList.remove('is-zoomed');
    lightboxError.hidden = true;
    if (lastImageFocus && document.contains(lastImageFocus)) {
      try { lastImageFocus.focus({ preventScroll: true }); } catch (_) { lastImageFocus.focus(); }
    }
  });
  lightboxImage.addEventListener('error', () => {
    const sourceImage = activeLightboxImages[activeLightboxIndex];
    if (sourceImage && sourceImage.dataset.fallbackSrc) {
      if (sourceImage.dataset.fallbackTried !== 'true') handleImageError(sourceImage);
      if (sourceImage.dataset.fallbackTried === 'true' && sourceImage.src !== lightboxImage.src) {
        lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
        lightboxImage.hidden = false;
        lightboxError.hidden = true;
        return;
      }
    }
    lightboxImage.hidden = true;
    lightboxError.hidden = false;
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 760px)').matches) setMenu(false);
  }));
})();