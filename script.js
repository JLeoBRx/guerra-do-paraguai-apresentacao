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
  let scrollQueued = false;

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
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  function setMenu(open) {
    sidebar.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-icon').textContent = open ? '✕' : '☰';
  }
  menuButton.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
  tocLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  document.getElementById('printButton').addEventListener('click', () => window.print());
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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