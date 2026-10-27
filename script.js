// Todo el contenido editorial de esta maqueta puede modificarse aquí.
const chapters=[
{title:'Las galaxias silenciosas',image:'1000057951.jpg',text:'El universo deja de producir estrellas. Un mensaje conduce al viajero hacia una misión imposible.'},
{title:'La Tierra que recuerda',image:'1000057953.jpg',text:'Señales del cosmos alteran las ciudades, los paisajes y la memoria humana.'},
{title:'El Príncipe Robot',image:'1000057956.jpg',text:'Un informe contradictorio oculta el origen de una transformación.'},
{title:'El umbral de las ruinas',image:'1000057954.jpg',text:'Los restos de otros mundos se confunden con la arquitectura de la Tierra.'},
{title:'El becerro de oro',image:'1000057944.jpg',text:'Un símbolo antiguo emerge en una geografía que ya no reconoce el tiempo.'},
{title:'La ceniza del cosmos',image:'1000057949.jpg',text:'La materia se acerca al límite de sus combinaciones posibles.'},
{title:'El Mundo Infierno',image:'1000057952.jpg',text:'Una nueva forma de existencia reclama el lugar que la vida ha dejado atrás.'}
];
const images=[
['1000057956.jpg','Ciudad de los otros','tierra'],['1000057955.jpg','Gigantes en la Tierra','criaturas'],['1000057954.jpg','Viaje por las ruinas','tierra'],['1000057953.jpg','La partida','tierra'],['1000057952.jpg','Mundo Infierno','criaturas'],['1000057951.jpg','El viajero cósmico','cosmos'],['1000057950.jpg','El mundo de ceniza','cosmos'],['1000057949.jpg','La mujer alada','criaturas'],['1000057948.jpg','La ruina del ángel','criaturas'],['1000057947.jpg','El visitante','criaturas'],['1000057946.jpg','Criaturas del umbral','criaturas'],['1000057945.jpg','La casa distante','cosmos'],['1000057944.jpg','El becerro de oro','cosmos']
];
const chapterGrid=document.querySelector('#chapterGrid');function pintarCapitulos(){chapters.forEach((c,i)=>{const article=document.createElement('article');article.className='chapter';article.innerHTML=`<img loading="lazy" src="images/${c.image}" alt="${c.title}"><div class="chapter-content"><span class="chapter-number">CAPÍTULO ${String(i+1).padStart(2,'0')} / 07</span><h3>${c.title}</h3><p>${c.text}</p></div>`;chapterGrid.append(article)});}
pintarCapitulos();const gallery=document.querySelector('#galleryGrid'),dialog=document.querySelector('#lightbox');let visible=images,current=0;function renderGallery(filter='todos'){visible=images.filter(x=>filter==='todos'||x[2]===filter);gallery.replaceChildren();visible.forEach((x,i)=>{const b=document.createElement('button');b.className='gallery-item';b.setAttribute('aria-label','Ampliar '+x[1]);b.innerHTML=`<img loading="lazy" src="images/${x[0]}" alt="${x[1]}"><span>${String(i+1).padStart(2,'0')} / ${x[1].toUpperCase()}</span>`;b.onclick=()=>openImage(i);gallery.append(b)})}function openImage(i){current=(i+visible.length)%visible.length;dialog.querySelector('img').src='images/'+visible[current][0];dialog.querySelector('img').alt=visible[current][1];dialog.querySelector('.lightbox-caption').textContent=visible[current][1].toUpperCase()+' · '+(current+1)+' / '+visible.length;if(!dialog.open)dialog.showModal()}document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderGallery(b.dataset.filter)});dialog.querySelector('.close').onclick=()=>dialog.close();dialog.querySelector('.prev').onclick=()=>openImage(current-1);dialog.querySelector('.next').onclick=()=>openImage(current+1);dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowRight')openImage(current+1);if(e.key==='ArrowLeft')openImage(current-1)});const menu=document.querySelector('#menuToggle'),nav=document.querySelector('#nav');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};nav.querySelectorAll('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')});renderGallery();

// Contenidos administrados desde Pages CMS (GitHub).
async function cargarContenido(){
 try {
  const response=await fetch('contenido.json',{cache:'no-store'});
  if(!response.ok)throw new Error('contenido.json no disponible');
  const data=await response.json();
  document.querySelectorAll('[data-content]').forEach(el=>{const value=data[el.dataset.content];if(typeof value==='string')el.textContent=value});

  // Pages CMS devuelve /images/archivo.jpg; usar ruta relativa también en GitHub Pages.
  const historiaImagen=document.querySelector('#historiaImagen');
  if(historiaImagen && typeof data.imagen_historia==='string'){
    const nombre=data.imagen_historia.trim().replace(/^\/?images\//i,'');
    if(/^[^\/\\]+\.(?:jpe?g|png|webp|gif|avif)$/i.test(nombre) && !nombre.includes('..')){
      historiaImagen.src='images/'+encodeURIComponent(nombre);
    }
  }
  configurarVideoProceso(data);
  if(Array.isArray(data.capitulos)&&data.capitulos.length){chapters.splice(0,chapters.length,...data.capitulos.map(c=>({title:c.titulo||'',image:c.imagen||'',text:c.texto||''})));chapterGrid.replaceChildren();pintarCapitulos()}
  if(Array.isArray(data.galeria)&&data.galeria.length){images.splice(0,images.length,...data.galeria.map(g=>[g.imagen||'',g.titulo||'',g.categoria||'cosmos']));renderGallery(document.querySelector('[data-filter].active')?.dataset.filter||'todos')}
  const news=document.querySelector('#newsGrid');news.replaceChildren();
  (data.noticias||[]).filter(n=>n.publicar!==false).sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')).forEach(n=>{
   const item=document.createElement('article');item.className='news-card';
   if(n.imagen){const im=document.createElement('img');im.src='images/'+n.imagen.replace(/^\/?images\//,'');im.alt=n.titulo||'Noticia';im.loading='lazy';item.append(im)}
   const body=document.createElement('div');body.className='news-body';
   const date=document.createElement('span');date.className='kicker';date.textContent=n.fecha||'NOVEDADES';body.append(date);
   const title=document.createElement('h3');title.textContent=n.titulo||'';body.append(title);
   const description=document.createElement('p');description.textContent=n.texto||'';body.append(description);const read=document.createElement('a');read.href='noticia.html?id='+encodeURIComponent(n.id||n.fecha||'');read.textContent='LEER NOTICIA COMPLETA ↗';body.append(read);
   if(n.enlace&&/^https?:\/\//i.test(n.enlace)){const a=document.createElement('a');a.href=n.enlace;a.textContent=n.texto_enlace||'VER MÁS ↗';a.target='_blank';a.rel='noopener noreferrer';body.append(a)}
   item.append(body);news.append(item)
  });
  if(!news.children.length){const msg=document.createElement('p');msg.className='section-sub';msg.textContent='Pronto compartiremos nuevas noticias del proyecto.';news.append(msg)}
  const logo=document.querySelector('#heroLogo'),title=document.querySelector('#heroTitle');const logoPath=(data.logo_portada||'').trim();if(logoPath){logo.src=/^https?:\/\//i.test(logoPath)?logoPath:(logoPath.startsWith('/')?logoPath:'images/'+logoPath.replace(/^images\//,''));logo.onload=()=>{logo.style.display='block';title.style.display='none';const closing=document.querySelector('#closingLogo');if(closing){closing.src=logo.src;closing.style.display='block';document.querySelector('#closingTitle').style.display='none'}};logo.onerror=()=>{logo.style.display='none';title.style.display='block';const closing=document.querySelector('#closingLogo');if(closing)closing.style.display='none';document.querySelector('#closingTitle').style.display='block'}}else{logo.style.display='none';title.style.display='block'};const hero=document.querySelector('#heroVideo'),youtube=document.querySelector('#heroYoutube');const url=(data.video_portada||'').trim();let youtubeId='';try{const parsed=new URL(url);const host=parsed.hostname.replace(/^www\./,'');if(host==='youtube.com'||host==='m.youtube.com'||host==='youtube-nocookie.com'){youtubeId=parsed.searchParams.get('v')||parsed.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1]||''}else if(host==='youtu.be'){youtubeId=parsed.pathname.slice(1).split('/')[0]}}catch(e){}if(!/^[\w-]{11}$/.test(youtubeId))youtubeId='';if(youtubeId){hero.style.display='none';youtube.src='https://www.youtube-nocookie.com/embed/'+youtubeId+'?autoplay=1&mute=1&loop=1&playlist='+youtubeId+'&controls=0&playsinline=1&rel=0';youtube.style.display='block'}else{youtube.style.display='none';youtube.removeAttribute('src');if(url){hero.src=url;hero.style.display='block';hero.load()}else{hero.style.display='none'}}if(data.video_poster)hero.poster='images/'+data.video_poster.replace(/^\/?images\//,'');const email=document.querySelector('#contactEmail');if(data.contacto_email){email.href='mailto:'+encodeURIComponent(data.contacto_email);email.style.display='inline-flex'}else{email.style.display='none'}const socials=document.querySelector('#socialLinks');socials.replaceChildren();(data.redes_sociales||[]).forEach(s=>{if(!/^https:\/\//i.test(s.url||''))return;const a=document.createElement('a');a.className='outline-btn';a.href=s.url;a.textContent=s.nombre||'RED SOCIAL';a.target='_blank';a.rel='noopener noreferrer';socials.append(a)});const buy=data.compra||{};
  if(buy.titulo)document.querySelector('#buyTitle').textContent=buy.titulo;
  if(buy.descripcion)document.querySelector('#buyDescription').textContent=buy.descripcion;
  document.querySelector('#buyPrice').textContent=buy.precio||'';
  document.querySelector('#buyStatus').textContent=buy.estado||'PRÓXIMAMENTE';
  if(buy.imagen)document.querySelector('#buyImage').src='images/'+buy.imagen.replace(/^\/?images\//,'');
  const links=document.querySelector('#buyLinks');links.replaceChildren();
  (buy.enlaces||[]).forEach(l=>{if(!/^https?:\/\//i.test(l.url||''))return;const a=document.createElement('a');a.className='outline-btn';a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=l.nombre||'VER PUNTO DE VENTA ↗';links.append(a)});
 }catch(error){console.warn('No se pudieron cargar los contenidos editables:',error);const news=document.querySelector('#newsGrid');news.textContent='Próximamente compartiremos novedades del proyecto.'}
}

cargarContenido();



function configurarVideoProceso(data){
  const mount = document.querySelector('#processVideoMount');
  if (!mount) return;
  const source = typeof data.video_proceso === 'string' ? data.video_proceso.trim() : '';
  const fallback = 'images/1000057954.jpg';
  const posterRaw = typeof data.video_poster_proceso === 'string' ? data.video_poster_proceso.trim() : '';
  const safePoster = /^(?:\/?images\/)?[^\/\\]+\.(?:jpe?g|png|webp)$/i;
  const poster = safePoster.test(posterRaw) ? 'images/' + posterRaw.replace(/^\/?images\//i, '') : fallback;
  function showPoster() {
    const image = document.createElement('img');
    image.loading = 'lazy';
    image.src = poster;
    image.alt = 'Imagen del proceso creativo de Horizonte Temporal';
    mount.replaceChildren(image);
  }
  if (!source) { showPoster(); return; }
  let url;
  try { url = new URL(source, window.location.href); }
  catch (_) { showPoster(); return; }
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const isHttp = ['http:', 'https:'].includes(url.protocol);
  let embed = '';
  if (isHttp && ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(hostname)) {
    const id = hostname === 'youtu.be' ? url.pathname.split('/')[1] : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1];
    if (id && /^[\w-]{11}$/.test(id)) embed = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id + '&controls=0&playsinline=1&rel=0';
  } else if (isHttp && ['vimeo.com', 'player.vimeo.com'].includes(hostname)) {
    const id = url.pathname.match(/(?:^\/|\/video\/)([0-9]+)(?:\/|$)/)?.[1];
    if (id) embed = 'https://player.vimeo.com/video/' + id + '?background=1&autoplay=1&muted=1&loop=1&controls=0';
  }
  if (embed) {
    const frame = document.createElement('iframe');
    frame.src = embed;
    frame.title = 'Proceso creativo de Horizonte Temporal — video automático sin sonido';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.loading = 'lazy';
    frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    mount.replaceChildren(frame);
    return;
  }
  const isVideo = isHttp && /\.(?:mp4|webm)$/i.test(url.pathname) &&
    (url.origin === window.location.origin || url.protocol === 'https:');
  if (isVideo) {
    const video = document.createElement('video');
    video.src = url.href;
    video.autoplay = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.controls = false;
    video.preload = 'auto';
    video.playsInline = true;
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    video.poster = poster;
    video.setAttribute('aria-label', 'Video del proceso creativo de Horizonte Temporal');
    mount.replaceChildren(video);
    const started = video.play();
    if (started && typeof started.catch === 'function') started.catch(() => { /* La reproducción automática depende del navegador. */ });
    return;
  }
  showPoster();
}
