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
  if(Array.isArray(data.capitulos)&&data.capitulos.length){chapters.splice(0,chapters.length,...data.capitulos.map(c=>({title:c.titulo||'',image:c.imagen||'',text:c.texto||''})));chapterGrid.replaceChildren();pintarCapitulos()}
  if(Array.isArray(data.galeria)&&data.galeria.length){images.splice(0,images.length,...data.galeria.map(g=>[g.imagen||'',g.titulo||'',g.categoria||'cosmos']));renderGallery(document.querySelector('[data-filter].active')?.dataset.filter||'todos')}
  const news=document.querySelector('#newsGrid');news.replaceChildren();
  (data.noticias||[]).filter(n=>n.publicar!==false).sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')).forEach(n=>{
   const item=document.createElement('article');item.className='news-card';
   if(n.imagen){const im=document.createElement('img');im.src='images/'+n.imagen.replace(/^\/?images\//,'');im.alt=n.titulo||'Noticia';im.loading='lazy';item.append(im)}
   const body=document.createElement('div');body.className='news-body';
   const date=document.createElement('span');date.className='kicker';date.textContent=n.fecha||'NOVEDADES';body.append(date);
   const title=document.createElement('h3');title.textContent=n.titulo||'';body.append(title);
   const description=document.createElement('p');description.textContent=n.texto||'';body.append(description);
   if(n.enlace&&/^https?:\/\//i.test(n.enlace)){const a=document.createElement('a');a.href=n.enlace;a.textContent=n.texto_enlace||'VER MÁS ↗';a.target='_blank';a.rel='noopener noreferrer';body.append(a)}
   item.append(body);news.append(item)
  });
  if(!news.children.length){const msg=document.createElement('p');msg.className='section-sub';msg.textContent='Pronto compartiremos nuevas noticias del proyecto.';news.append(msg)}
  const buy=data.compra||{};
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
