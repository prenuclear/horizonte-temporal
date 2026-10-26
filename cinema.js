/* Navegación cinematográfica de capítulos.
   El contenido proviene de las tarjetas existentes, alimentadas por contenido.json / Pages CMS.
   Si falla el script, la cuadrícula original sigue disponible. */
(() => {
  'use strict';
  const section = document.querySelector('#capitulos');
  const grid = document.querySelector('#chapterGrid');
  if (!section || !grid) return;

  const explorer = document.createElement('div');
  explorer.id = 'chapterExplorer';
  explorer.className = 'cinema-explorer chapter-explorer';
  explorer.hidden = true;
  explorer.innerHTML = `
    <div class="cinema-stage" tabindex="0" role="region" aria-label="Recorrido cinematográfico por los capítulos">
      <div class="cinema-visual" aria-hidden="true"><img alt=""></div>
      <div class="cinema-meta"><span class="cinema-signature">HORIZONTE TEMPORAL / ARCHIVO NARRATIVO</span><span class="cinema-count"></span></div>
      <div class="cinema-content" aria-live="polite" aria-atomic="true">
        <p class="cinema-eyebrow"></p><h3></h3><p class="cinema-synopsis"></p>
      </div>
      <div class="cinema-footer">
        <div class="cinema-controls">
          <button type="button" class="cinema-arrow cinema-prev" aria-label="Capítulo anterior"><span aria-hidden="true">←</span> ANTERIOR</button>
          <button type="button" class="cinema-arrow cinema-next" aria-label="Capítulo siguiente">SIGUIENTE <span aria-hidden="true">→</span></button>
        </div>
        <span class="cinema-hint">EXPLORA CON LAS FLECHAS O EL TECLADO</span>
      </div>
    </div>
    <nav class="cinema-timeline" aria-label="Elegir uno de los siete capítulos"></nav>
    <div class="cinema-progress" aria-hidden="true"><div class="cinema-progress-fill"></div></div>
    <div class="cinema-progress-label"><span>INICIO DEL RECORRIDO</span><span>FIN DEL RECORRIDO</span></div>
  `;
  grid.before(explorer);

  const stage = explorer.querySelector('.cinema-stage');
  const visual = explorer.querySelector('.cinema-visual img');
  const counter = explorer.querySelector('.cinema-count');
  const eyebrow = explorer.querySelector('.cinema-eyebrow');
  const title = explorer.querySelector('.cinema-content h3');
  const synopsis = explorer.querySelector('.cinema-synopsis');
  const timeline = explorer.querySelector('.cinema-timeline');
  const progress = explorer.querySelector('.cinema-progress-fill');
  const previous = explorer.querySelector('.cinema-prev');
  const next = explorer.querySelector('.cinema-next');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let entries = [];
  let active = 0;
  let initialized = false;

  function readEntries() {
    return Array.from(grid.querySelectorAll(':scope > .chapter')).map(card => ({
      title: card.querySelector('h3')?.textContent?.trim() || 'Capítulo sin título',
      text: card.querySelector('p')?.textContent?.trim() || '',
      image: card.querySelector('img')?.getAttribute('src') || ''
    }));
  }

  function num(number) { return String(number).padStart(2, '0'); }
  function chapterFromHash() {
    const match = /^#capitulo-(\d+)$/.exec(location.hash);
    return match ? Number(match[1]) - 1 : null;
  }
  function activate(index, options = {}) {
    if (!entries.length) return;
    const nextIndex = Math.max(0, Math.min(entries.length - 1, index));
    const changed = nextIndex !== active;
    active = nextIndex;
    const entry = entries[active];

    visual.src = entry.image;
    visual.alt = '';
    counter.textContent = `${num(active + 1)} — ${num(entries.length)}`;
    eyebrow.textContent = `CAPÍTULO ${num(active + 1)} / ${num(entries.length)}`;
    title.textContent = entry.title;
    synopsis.textContent = entry.text;
    previous.disabled = active === 0;
    next.disabled = active === entries.length - 1;
    progress.style.width = `${((active + 1) / entries.length) * 100}%`;

    Array.from(timeline.children).forEach((button, i) => {
      if (i === active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

    if (options.url) {
      try { history.replaceState(null, '', `#capitulo-${active + 1}`); } catch (_) { /* Abrir localmente también funciona. */ }
    }
    if (options.animate && changed && !prefersReducedMotion.matches) {
      stage.classList.remove('is-changing');
      void stage.offsetWidth; // Reinicia la animación CSS cuando cambia el capítulo.
      stage.classList.add('is-changing');
    }
    if (options.returnToStage) {
      stage.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    }
    const button = timeline.children[active];
    if (button) {
      const left = button.offsetLeft - timeline.offsetLeft - (timeline.clientWidth - button.clientWidth) / 2;
      timeline.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion.matches ? 'instant' : 'smooth' });
    }
  }

  function rebuild() {
    const result = readEntries();
    if (!result.length) return;
    entries = result;
    timeline.replaceChildren();
    entries.forEach((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cinema-step';
      button.setAttribute('aria-label', `Ir al capítulo ${index + 1}: ${entry.title}`);
      const thumbnail = document.createElement('img');
      thumbnail.src = entry.image;
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      const labels = document.createElement('span');
      labels.className = 'cinema-step-text';
      const number = document.createElement('span');
      number.className = 'cinema-step-number';
      number.textContent = `CAP. ${num(index + 1)}`;
      const name = document.createElement('span');
      name.className = 'cinema-step-label';
      name.textContent = entry.title;
      labels.append(number, name);
      button.append(thumbnail, labels);
      button.addEventListener('click', () => activate(index, { url: true, animate: true, returnToStage: true }));
      timeline.append(button);
    });
    const linkIndex = chapterFromHash();
    if (!initialized && linkIndex !== null) active = linkIndex;
    active = Math.max(0, Math.min(entries.length - 1, active));
    explorer.hidden = false;
    section.classList.add('cinema-ready');
    activate(active);
    initialized = true;
  }

  previous.addEventListener('click', () => activate(active - 1, { url: true, animate: true }));
  next.addEventListener('click', () => activate(active + 1, { url: true, animate: true }));
  explorer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' && active < entries.length - 1) {
      event.preventDefault(); activate(active + 1, { url: true, animate: true });
    }
    if (event.key === 'ArrowLeft' && active > 0) {
      event.preventDefault(); activate(active - 1, { url: true, animate: true });
    }
  });

  let touchStartX = null;
  let touchStartY = null;
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button')) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (touchStartX === null || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    touchStartX = touchStartY = null;
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
    activate(active + (deltaX < 0 ? 1 : -1), { url: true, animate: true });
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touchStartX = touchStartY = null; }, { passive: true });

  window.addEventListener('hashchange', () => {
    const fromHash = chapterFromHash();
    if (fromHash !== null) activate(fromHash, { animate: true });
  });
  new MutationObserver(rebuild).observe(grid, { childList: true });
  rebuild();
})();