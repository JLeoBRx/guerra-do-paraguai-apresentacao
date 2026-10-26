(() => {
  const app = document.getElementById('app');
  const stage = document.getElementById('stage');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const railButtons = Array.from(document.querySelectorAll('.rail-btn[data-go]'));
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const nextLabel = document.getElementById('nextLabel');
  const progressFill = document.getElementById('progressFill');
  const progressCopy = document.getElementById('progressCopy');
  const railCount = document.getElementById('railCount');
  const notesPanel = document.getElementById('notesPanel');
  const notesText = document.getElementById('notesText');
  const notesToggle = document.getElementById('notesToggle');
  const presentToggle = document.getElementById('presentToggle');
  const helpModal = document.getElementById('helpModal');
  const titles = ['Abertura','Roteiro','Contexto','Paraguai antes da guerra','Causas','Cronologia','Tríplice Aliança','Batalhas','Campanha final','Custo humano','Consequências','Memória e fontes'];
  let current = 0;
  let isPresent = false;
  const pad = value => String(value).padStart(2, '0');

  function setSlide(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      slide.setAttribute('aria-label', `Slide ${i + 1} de ${slides.length}: ${slide.dataset.title || titles[i]}`);
    });
    railButtons.forEach((button, i) => {
      if (i === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    prevButton.disabled = current === 0;
    nextButton.disabled = current === slides.length - 1;
    nextLabel.innerHTML = current === slides.length - 1 ? 'Fim da apresentação ✓' : 'Próximo slide <span aria-hidden="true">→</span>';
    progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    progressCopy.textContent = `${pad(current + 1)} / ${pad(slides.length)} · ${titles[current]}`;
    railCount.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
    const note = slides[current].querySelector('.speaker-note');
    notesText.textContent = note ? note.textContent.trim() : 'Sem notas para esta seção.';
    slides[current].scrollTop = 0;
    if (updateHash) history.replaceState(null, '', `#slide-${current + 1}`);
    document.title = `${slides[current].dataset.title || titles[current]} — A Guerra do Paraguai`;
  }
  function toggleNotes(force) {
    const open = typeof force === 'boolean' ? force : !notesPanel.classList.contains('open');
    notesPanel.classList.toggle('open', open);
    notesToggle.setAttribute('aria-pressed', String(open));
    if (open) notesPanel.focus();
  }
  async function togglePresent() {
    if (!isPresent) {
      isPresent = true;
      document.body.classList.add('present-mode');
      presentToggle.textContent = 'Sair da apresentação';
      try { if (document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch (_) { /* Tela cheia pode não ser permitida pelo navegador. */ }
    } else {
      isPresent = false;
      document.body.classList.remove('present-mode');
      presentToggle.innerHTML = 'Apresentar <span aria-hidden="true">↗</span>';
      try { if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen(); } catch (_) { /* Alternância de tela cheia não disponível. */ }
    }
  }

  document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => setSlide(Number(el.dataset.go))));
  document.querySelectorAll('[data-next]').forEach(el => el.addEventListener('click', () => setSlide(current + 1)));
  railButtons.forEach(button => button.addEventListener('click', () => setSlide(Number(button.dataset.go))));
  prevButton.addEventListener('click', () => setSlide(current - 1));
  nextButton.addEventListener('click', () => setSlide(current + 1));
  nextLabel.addEventListener('click', () => { if (current < slides.length - 1) setSlide(current + 1); });
  notesToggle.addEventListener('click', () => toggleNotes());
  document.getElementById('notesClose').addEventListener('click', () => toggleNotes(false));
  presentToggle.addEventListener('click', togglePresent);
  document.getElementById('helpToggle').addEventListener('click', () => { helpModal.hidden = false; document.getElementById('helpClose').focus(); });
  document.getElementById('helpClose').addEventListener('click', () => { helpModal.hidden = true; document.getElementById('helpToggle').focus(); });
  helpModal.addEventListener('click', e => { if (e.target === helpModal) helpModal.hidden = true; });
  document.getElementById('printButton').addEventListener('click', () => window.print());
  document.getElementById('resetNames').addEventListener('click', () => {
    document.querySelectorAll('[contenteditable="true"]').forEach(field => {
      field.textContent = field.dataset.default || '';
      const key = `guerra-paraguai-capa-${field.dataset.storageKey || 'campo'}`;
      try { localStorage.removeItem(key); } catch (_) {}
    });
  });
  document.addEventListener('keydown', e => {
    if (!helpModal.hidden) { if (e.key === 'Escape') { helpModal.hidden = true; document.getElementById('helpToggle').focus(); } return; }
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); setSlide(current + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setSlide(current - 1); }
    else if (e.key.toLowerCase() === 'n') toggleNotes();
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); togglePresent(); }
    else if (e.key === 'Home') setSlide(0);
    else if (e.key === 'End') setSlide(slides.length - 1);
    else if (e.key === 'Escape') { toggleNotes(false); if (isPresent) togglePresent(); }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isPresent) {
      isPresent = false;
      document.body.classList.remove('present-mode');
      presentToggle.innerHTML = 'Apresentar <span aria-hidden="true">↗</span>';
    }
  });
  let touchX = null;
  stage.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (touchX === null) return;
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 65) setSlide(current + (delta < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
  document.querySelectorAll('[contenteditable="true"]').forEach((field, index) => {
    const key = `guerra-paraguai-capa-${field.dataset.storageKey || index}`;
    const defaultValue = field.dataset.default || field.textContent.trim();
    try {
      const saved = localStorage.getItem(key);
      field.textContent = saved !== null ? saved : defaultValue;
      field.addEventListener('input', () => { try { localStorage.setItem(key, field.textContent || ''); } catch (_) {} });
    } catch (_) {
      field.textContent = defaultValue;
      field.addEventListener('input', () => {});
    }
  });
  const match = location.hash.match(/slide-(\d+)/);
  setSlide(match ? Number(match[1]) - 1 : 0, false);
})();