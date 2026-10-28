/* HORIZONTE TEMPORAL — contenido editable en Pages CMS */
(() => {
'use strict';
const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined&&txt!==null)n.textContent=String(txt);return n;};
const imagePath=value=>{
 if(typeof value!=='string'||!value.trim())return '';
 const raw=value.trim();
 if(/^https:\/\//i.test(raw))return raw;
 const name=raw.replace(/^\/?images\//i,'').replace(/^\//,'');
 return name&&!name.includes('..')&&!/[\/\\]/.test(name)&&/\.(?:jpe?g|png|webp|gif|avif|svg)$/i.test(name)?'images/'+encodeURIComponent(name):'';
};
const image=(target,value)=>{if(!target)return;const src=imagePath(value);target.hidden=!src;target.removeAttribute('src');if(src){target.onerror=()=>target.hidden=true;target.src=src;}};
const text=(target,value)=>{
 if(!target||value===undefined||value===null)return;
 const v=String(value);target.hidden=!v.trim();
 if(target.tagName==='H2'&&target.dataset.copy){
  target.replaceChildren();
  v.split(/(\[[^\]]+\]|\n)/g).forEach(piece=>{
   if(!piece)return;
   if(piece==='\n'){target.append(document.createElement('br'));return;}
   if(/^\[[^\]]+\]$/.test(piece)){const mark=document.createElement('i');mark.textContent=piece.slice(1,-1);target.append(mark);}
   else target.append(document.createTextNode(piece));
  });
 }else target.textContent=v;
};
const child=(parent,tag,cls,value)=>{if(value===undefined||value===null||!String(value).trim())return;const n=el(tag,cls,value);parent.append(n);return n;};
function copy(data){
 const strings={...(data.textos||{})};
 const quote=data.cita_destacada;
 if(quote && typeof quote==='object'){
  for(const [field,key] of [['rotulo','cita_rotulo'],['texto','cita_texto'],['credito','cita_credito']]){
   if(Object.prototype.hasOwnProperty.call(quote,field))strings[key]=quote[field]??'';
  }
 }
 $$('[data-copy]').forEach(n=>{const key=n.dataset.copy;if(Object.prototype.hasOwnProperty.call(strings,key))text(n,strings[key]);});
 $$('[data-content]').forEach(n=>{const key=n.dataset.content;if(Object.prototype.hasOwnProperty.call(data,key))text(n,data[key]);});
 const meta=$('meta[name="description"]');if(meta&&strings.descripcion_seo!==undefined)meta.content=strings.descripcion_seo||'';
}
function gallery(data){
 const root=$('#galleryGrid'),nav=$('#galleryChapterNav'),dialog=$('#lightbox');
 if(!root||!nav||!dialog)return;
 root.replaceChildren();nav.replaceChildren();let photos=[],selected=0;
 (Array.isArray(data.capitulos)?data.capitulos:[]).slice(0,7).forEach((chapter,i)=>{
  const items=(Array.isArray(chapter.galeria)?chapter.galeria:[]).slice(0,3).filter(x=>x&&imagePath(x.imagen));
  if(!items.length)return;
  const anchor='galeria-capitulo-'+(i+1),section=el('section','editorial-chapter');
  section.id=anchor;
  const heading=el('div','editorial-heading');
  heading.append(el('span','editorial-chapter-number',((data.textos||{}).capitulo_etiqueta??'CAPÍTULO')+' '+String(i+1).padStart(2,'0')));
  child(heading,'h3','editorial-chapter-title',chapter.titulo);section.append(heading);
  const tiles=el('div','editorial-tiles');
  items.forEach((item,j)=>{
   const img=el('img');img.src=imagePath(item.imagen);img.loading='lazy';img.alt=item.pie||'Imagen del capítulo '+(i+1);
   const btn=el('button','editorial-tile');btn.type='button';
   btn.setAttribute('aria-label','Ampliar imagen '+(j+1)+' del capítulo '+(i+1));
   const label=el('span','editorial-tile-overlay');
   label.append(el('span','editorial-tile-counter',String(j+1).padStart(2,'0')+' / 03'));
   child(label,'span','editorial-tile-caption',item.pie);
   btn.append(img,label);tiles.append(btn);
   const at=photos.length;photos.push({src:img.src,alt:img.alt,pie:item.pie||'',chapter:chapter.titulo||''});
   btn.onclick=()=>show(at);
  });
  section.append(tiles);root.append(section);
  const link=el('a','editorial-tab');link.href='#'+anchor;
  link.append(el('span','editorial-tab-index',String(i+1).padStart(2,'0')));
  link.append(el('span','editorial-tab-label',chapter.titulo||'Capítulo '+(i+1)));nav.append(link);
 });
 nav.hidden=!nav.children.length;
 function show(i){
  if(!photos.length)return;
  selected=(i+photos.length)%photos.length;
  const p=photos[selected],im=$('img',dialog);
  im.src=p.src;im.alt=p.alt;
  text($('.lightbox-caption',dialog),[p.chapter,p.pie,(selected+1)+' / '+photos.length].filter(Boolean).join(' · '));
  if(!dialog.open)dialog.showModal();
 }
 $('.close',dialog).onclick=()=>dialog.close();
 $('.prev',dialog).onclick=()=>show(selected-1);
 $('.next',dialog).onclick=()=>show(selected+1);
 dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
 document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowLeft')show(selected-1);if(e.key==='ArrowRight')show(selected+1);});
}
function news(data){
 const root=$('#newsGrid');if(!root)return;root.replaceChildren();
 (Array.isArray(data.noticias)?data.noticias:[]).filter(n=>n.publicar!==false).sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')).forEach(n=>{
  const card=el('article','news-card'),src=imagePath(n.imagen);
  if(src){const im=el('img');im.src=src;im.loading='lazy';im.alt=n.titulo||'Noticia';card.append(im);}
  const box=el('div','news-body');
  child(box,'span','kicker',n.fecha);child(box,'h3','',n.titulo);child(box,'p','',n.texto);
  const readLabel=(data.textos||{}).noticia_leer;
  if((n.id||n.fecha)&&readLabel){const a=el('a','',readLabel+' ↗');a.href='noticia.html?id='+encodeURIComponent(n.id||n.fecha);box.append(a);}
  if(typeof n.enlace==='string'&&/^https:\/\//i.test(n.enlace)){const a=el('a','',n.texto_enlace||'VER MÁS');a.href=n.enlace;a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
  card.append(box);root.append(card);
 });
 if(!root.children.length)child(root,'p','section-sub',(data.textos||{}).noticias_vacio);
}
function buy(data){
 const b=data.compra||{};image($('#buyImage'),b.imagen);
 ['Title','Description','Price','Status'].forEach((part,i)=>text($('#buy'+part),[b.titulo,b.descripcion,b.precio,b.estado][i]||''));
 const root=$('#buyLinks');if(!root)return;root.replaceChildren();
 (Array.isArray(b.enlaces)?b.enlaces:[]).forEach(l=>{
  if(!l||!/^https:\/\//i.test(l.url||''))return;
  const a=el('a','outline-btn',l.nombre||'PUNTO DE VENTA');a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';root.append(a);
 });
}
function yt(url){
 try{const u=new URL(url),host=u.hostname.toLowerCase().replace(/^www\./,'');let id='';
  if(host==='youtu.be')id=u.pathname.split('/')[1]||'';
  else if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=u.searchParams.get('v')||u.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]{11})/)?.[1]||'';
  return /^[\w-]{11}$/.test(id)?id:'';
 }catch(_){return '';}
}
function mp4(url){
 try{const u=new URL(url,location.href);return (u.protocol==='https:'||u.origin===location.origin)&&/\.(?:mp4|webm)$/i.test(u.pathname);}catch(_){return false;}
}
function media(data){
 image($('#heroImage'),data.imagen_portada);image($('#historiaImagen'),data.imagen_historia);
 image($('#quoteImage'),data.cita_destacada && Object.prototype.hasOwnProperty.call(data.cita_destacada,'imagen') ? data.cita_destacada.imagen : data.imagen_cita);
 image($('#closingImage'),data.imagen_cierre);
 const logo=$('#heroLogo'),closing=$('#closingLogo'),heroTitle=$('#heroTitle'),closingTitle=$('#closingTitle'),logoSrc=imagePath(data.logo_portada),closingSrc=imagePath(data.logo_cierre);
 if(logoSrc){logo.src=logoSrc;logo.hidden=false;logo.style.display='block';heroTitle.hidden=true;heroTitle.style.display='none';}
 else {logo.hidden=true;logo.style.display='none';heroTitle.hidden=!(data.textos?.hero_titulo||'').trim();heroTitle.style.display=heroTitle.hidden?'none':'block';}
 if(closingSrc){closing.src=closingSrc;closing.hidden=false;closing.style.display='block';closingTitle.hidden=true;closingTitle.style.display='none';}
 else {closing.hidden=true;closing.style.display='none';closingTitle.hidden=!(data.textos?.cierre_titulo||'').trim();closingTitle.style.display=closingTitle.hidden?'none':'block';}
 logo.onerror=()=>{logo.hidden=true;logo.style.display='none';heroTitle.hidden=!(data.textos?.hero_titulo||'').trim();heroTitle.style.display=heroTitle.hidden?'none':'block';};
 closing.onerror=()=>{closing.hidden=true;closing.style.display='none';closingTitle.hidden=!(data.textos?.cierre_titulo||'').trim();closingTitle.style.display=closingTitle.hidden?'none':'block';};
 const hero=$('#heroVideo'),frame=$('#heroYoutube'),url=String(data.video_portada||'').trim(),id=yt(url);
 hero.style.display='none';frame.style.display='none';frame.removeAttribute('src');
 if(id){frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&loop=1&playlist='+id+'&controls=0&playsinline=1&rel=0';frame.style.display='block';}
 else if(mp4(url)){hero.src=url;hero.style.display='block';hero.muted=true;hero.autoplay=true;hero.loop=true;hero.playsInline=true;hero.load();const p=hero.play();if(p&&p.catch)p.catch(()=>{});}
 if(imagePath(data.video_poster))hero.poster=imagePath(data.video_poster);else hero.removeAttribute('poster');
 processVideo(data);
}
function processVideo(data){
 const mount=$('#processVideoMount');if(!mount)return;mount.replaceChildren();
 const url=String(data.video_proceso||'').trim(),poster=imagePath(data.video_poster_proceso),id=yt(url);
 let embed=id?'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&loop=1&playlist='+id+'&controls=0&playsinline=1&rel=0':'';
 if(!embed){try{const u=new URL(url),host=u.hostname.replace(/^www\./,'');if(['vimeo.com','player.vimeo.com'].includes(host)){const match=u.pathname.match(/(?:^\/|\/video\/)(\d+)(?:\/|$)/);if(match)embed='https://player.vimeo.com/video/'+match[1]+'?background=1&autoplay=1&muted=1&loop=1&controls=0';}}catch(_){}}
 if(embed){const f=el('iframe');f.src=embed;f.loading='lazy';f.title='Video del proceso creativo, sin sonido';f.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');f.setAttribute('aria-hidden','true');f.tabIndex=-1;mount.append(f);}
 else if(mp4(url)){const v=el('video');v.src=url;v.muted=true;v.defaultMuted=true;v.autoplay=true;v.loop=true;v.playsInline=true;v.controls=false;v.preload='metadata';v.poster=poster;v.setAttribute('muted','');v.setAttribute('autoplay','');v.setAttribute('loop','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.tabIndex=-1;mount.append(v);const p=v.play();if(p&&p.catch)p.catch(()=>{});}
 else if(poster){const im=el('img');im.src=poster;im.alt='Imagen del proceso creativo';mount.append(im);}
 mount.hidden=!mount.children.length;if(mount.parentElement)mount.parentElement.hidden=!mount.children.length;
}
function contact(data){
 const email=$('#contactEmail');
 if(data.contacto_email){email.href='mailto:'+data.contacto_email;email.hidden=false;}else{email.removeAttribute('href');email.hidden=true;}
 const socials=$('#socialLinks');if(!socials)return;socials.replaceChildren();
 (Array.isArray(data.redes_sociales)?data.redes_sociales:[]).forEach(s=>{
  if(!s||!/^https:\/\//i.test(s.url||''))return;
  const a=el('a','outline-btn',s.nombre||'Red social');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';socials.append(a);
 });
}
function nav(){
 const b=$('#menuToggle'),n=$('#nav');if(!b||!n)return;
 b.onclick=()=>{const active=n.classList.toggle('open');b.setAttribute('aria-expanded',String(active));};
 $$('a',n).forEach(a=>a.onclick=()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false');});
}
function organizeContent(raw){
 const data={...raw,textos:{...(raw.textos||{})}};
 const copyKeys=new Set([...$('[data-copy]').map(x=>x.dataset.copy),
  'descripcion_seo','noticia_leer','noticias_vacio','noticias_volver',
  'noticia_info_relacionada','noticia_no_encontrada','capitulo_etiqueta']);
 for(const group of ['encabezado','portada','historia','galeria_seccion','proceso','novedades_seccion','compra','contacto','cierre','pie']){
  const fields=raw[group];
  if(!fields||typeof fields!=='object'||Array.isArray(fields))continue;
  for(const [key,value] of Object.entries(fields)){
   if(copyKeys.has(key))data.textos[key]=value;
   else data[key]=value;
  }
 }
 return data;
}
async function init(){
 nav();
 try{const r=await fetch('contenido.json',{cache:'no-store'});if(!r.ok)throw Error('Contenido no disponible');const data=organizeContent(await r.json());
  copy(data);gallery(data);news(data);buy(data);media(data);contact(data);
 }catch(error){console.warn('Error cargando contenido.json en Horizonte Temporal',error);}
}
init();
})();