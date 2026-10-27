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
  const baseTitle = 'A Guerra do Paraguai — Museu Digital Interativo';

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

    syncFullscreenMode();
  });
  updateScrollUI();

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
    setPresentation(true, 'button');
    if (document.documentElement.requestFullscreen) {
      requestedFullscreenForPresentation = true;
      document.documentElement.requestFullscreen().catch(() => {
        requestedFullscreenForPresentation = false;
        // Keep the presentation usable even if the browser refuses fullscreen.
      });
    }
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
    if (presentationActive) {
      if (event.key === 'Escape') {
        event.preventDefault();
        exitPresentation();
      } else if (event.key === 'ArrowRight' || event.key === 'PageDown' || (event.key === ' ' && tag !== 'button' && tag !== 'a')) {
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

  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (!image) return;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      const figure = button.closest('figure');
      const caption = figure ? figure.querySelector('figcaption') : null;
      lightboxCaption.textContent = caption ? caption.textContent.trim().replace(/\s+/g, ' ').slice(0, 130) : image.alt;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else window.open(image.src, '_blank', 'noopener,noreferrer');
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.src = '';
    lightboxImage.alt = '';
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 760px)').matches) setMenu(false);
  }));
})();