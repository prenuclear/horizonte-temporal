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
      <div class="cinema-visual" aria-hidden="true"><img class="cinema-shot is-visible" alt=""><img class="cinema-shot" alt=""></div>
      <div class="cinema-meta"><span class="cinema-signature">HORIZONTE TEMPORAL / ARCHIVO NARRATIVO</span><span class="cinema-count"></span></div>
      <div class="cinema-content" aria-live="polite" aria-atomic="true">
        <p class="cinema-eyebrow"></p><h3></h3><p class="cinema-synopsis"></p>
      </div>
      <div class="cinema-sequence" hidden aria-label="Escenas de este capítulo">
        <div class="cinema-sequence-copy"><span class="cinema-sequence-label">SECUENCIA DE IMÁGENES <span class="cinema-sequence-counter"></span></span><p class="cinema-scene-caption" aria-live="polite"></p></div>
        <div class="cinema-sequence-actions"><div class="cinema-scene-dots" role="group" aria-label="Seleccionar escena"></div><button type="button" class="cinema-play" aria-label="Reproducir secuencia" aria-pressed="false">▶ REPRODUCIR</button></div>
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
  const visualLayers = Array.from(explorer.querySelectorAll('.cinema-visual .cinema-shot'));
  const sequencePanel = explorer.querySelector('.cinema-sequence');
  const sequenceCounter = explorer.querySelector('.cinema-sequence-counter');
  const sequenceCaption = explorer.querySelector('.cinema-scene-caption');
  const sequenceDots = explorer.querySelector('.cinema-scene-dots');
  const playButton = explorer.querySelector('.cinema-play');
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
  let cmsChapters = [];
  let scenes = [];
  let activeScene = 0;
  let currentLayer = 0;
  let imageRequest = 0;
  let playback = null;
  const sceneDuration = 6800;

  function stopPlayback() {
    if (playback !== null) { window.clearInterval(playback); playback = null; }
    playButton.textContent = '▶ REPRODUCIR';
    playButton.setAttribute('aria-pressed', 'false');
    playButton.setAttribute('aria-label', 'Reproducir secuencia');
  }
  function togglePlayback() {
    if (playback !== null) { stopPlayback(); return; }
    if (scenes.length < 2) return;
    playButton.textContent = 'Ⅱ PAUSAR';
    playButton.setAttribute('aria-pressed', 'true');
    playButton.setAttribute('aria-label', 'Pausar secuencia');
    playback = window.setInterval(() => showScene((activeScene + 1) % scenes.length), sceneDuration);
  }
  function imagePath(input) {
    if (typeof input !== 'string') return '';
    const filename = input.trim().replace(/^\/?images\//i, '');
    return /^(?!\.)(?!.*\.\.)[^\/\\<>:"|?*]+\.(?:jpe?g|png|webp|gif)$/i.test(filename) ? 'images/' + filename : '';
  }
  function updateImage(src) {
    if (!src) return;
    const request = ++imageRequest;
    const nextLayer = 1 - currentLayer;
    const incoming = visualLayers[nextLayer];
    const outgoing = visualLayers[currentLayer];
    if (outgoing.getAttribute('src') === src && outgoing.classList.contains('is-visible')) return;
    incoming.classList.remove('is-visible');
    incoming.onload = () => {
      if (request !== imageRequest) return;
      incoming.classList.add('is-visible');
      outgoing.classList.remove('is-visible');
      currentLayer = nextLayer;
    };
    incoming.onerror = () => {
      if (request === imageRequest) incoming.classList.remove('is-visible');
    };
    incoming.src = src;
    if (incoming.complete && incoming.naturalWidth > 0) incoming.onload();
  }
  function showScene(index) {
    if (!scenes.length) return;
    activeScene = (index + scenes.length) % scenes.length;
    const scene = scenes[activeScene];
    updateImage(scene.image);
    sequenceCounter.textContent = num(activeScene + 1) + ' / ' + num(scenes.length);
    sequenceCaption.textContent = scene.text;
    Array.from(sequenceDots.children).forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === activeScene));
      button.setAttribute('aria-label', 'Mostrar escena ' + (i + 1) + ' de ' + scenes.length);
    });
    const following = scenes[(activeScene + 1) % scenes.length];
    if (following && following.image !== scene.image) {
      const preload = new Image();
      preload.src = following.image;
    }
  }
  function setupScenes(chapterIndex) {
    stopPlayback();
    const chapter = cmsChapters[chapterIndex] || {};
    const primaryImage = imagePath(entries[chapterIndex]?.image) || entries[chapterIndex]?.image || '';
    scenes = [{ image: primaryImage, text: chapter.epigrafe || '' }];
    if (Array.isArray(chapter.escenas)) {
      for (const scene of chapter.escenas.slice(0, 7)) {
        const path = imagePath(scene?.imagen);
        if (path) scenes.push({ image: path, text: typeof scene.texto === 'string' ? scene.texto : '' });
      }
    }
    sequencePanel.hidden = scenes.length < 2;
    sequenceDots.replaceChildren();
    scenes.forEach((scene, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cinema-scene-dot';
      button.addEventListener('click', () => showScene(i));
      sequenceDots.append(button);
    });
    showScene(0);
  }


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

    setupScenes(active);
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

  playButton.addEventListener('click', togglePlayback);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlayback(); });
  window.addEventListener('pagehide', stopPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([record]) => {
      if (!record.isIntersecting) stopPlayback();
    }, { threshold: 0.12 }).observe(stage);
  }
  // Pages CMS guarda las escenas en contenido.json; los otros capítulos permanecen intactos.
  fetch('contenido.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw Error('No se pudo leer el contenido'); return response.json(); })
    .then(data => { cmsChapters = Array.isArray(data.capitulos) ? data.capitulos : []; if (entries.length) setupScenes(active); })
    .catch(() => { /* La navegación básica sigue funcionando sin este archivo. */ });

  previous.addEventListener('click', () => activate(active - 1, { url: true, animate: true }));
  next.addEventListener('click', () => activate(active + 1, { url: true, animate: true }));
  explorer.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('.cinema-sequence')) return;
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