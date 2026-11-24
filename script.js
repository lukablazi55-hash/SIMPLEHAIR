document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const modal=document.querySelector('#booking');document.querySelectorAll('[data-book],[data-service]').forEach(el=>el.addEventListener('click',()=>{document.querySelector('#chosen-service').textContent=el.dataset.service?`Tvoj odabir: ${el.dataset.service}.`:'Dogovorimo termin koji ti odgovara.';modal.showModal()}));document.querySelector('.close').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen));menu.setAttribute('aria-label',isOpen?'Zatvori izbornik':'Otvori izbornik');menu.textContent=isOpen?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Otvori izbornik');menu.textContent='☰'}));
if(!reduced&&matchMedia('(pointer:fine)').matches){const scene=document.querySelector('.logo-scene'),logo=scene.querySelector('img');scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;logo.style.transform=`rotateY(${x*15}deg) rotateX(${-y*15}deg) translateZ(20px)`});scene.addEventListener('pointerleave',()=>logo.style.transform='none')}
// Three chapters track native scroll; reduced motion retains the original hero.
const story=document.querySelector('.hero-story');
if(!reduced&&story){
 document.documentElement.classList.add('story-enabled');
 const panels=[...story.querySelectorAll('.story-panel')],steps=[...story.querySelectorAll('[data-story-step]')],caption=story.querySelector('.story-caption');
 const captions=['Prirodna kosa.<br>Početak nove priče.','Pramen po pramen.<br>Promjena je u tijeku.','Ista ti. Novi sjaj.<br>Tvoj SIMPLE glow-up.'];
 let active=-1,pending=false;
 function updateStory(){
  pending=false;
  const rect=story.getBoundingClientRect(),distance=Math.max(1,story.offsetHeight-innerHeight),progress=Math.max(0,Math.min(1,-rect.top/distance)),chapter=progress<.32?0:progress<.67?1:2;
  story.dispatchEvent(new CustomEvent('storyprogress',{detail:progress}));story.style.setProperty('--story-progress',String(progress));story.style.setProperty('--photo-scale',String(1+progress*.1));
  if(active!==chapter){active=chapter;story.dataset.active=String(chapter);caption.innerHTML=captions[chapter];panels.forEach((panel,i)=>{panel.classList.toggle('is-active',i===chapter);panel.inert=i!==chapter;panel.setAttribute('aria-hidden',String(i!==chapter))});steps.forEach((step,i)=>{if(i===chapter)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current')})}
 }
 function queueStory(){if(!pending){pending=true;requestAnimationFrame(updateStory)}}
 addEventListener('scroll',queueStory,{passive:true});addEventListener('resize',queueStory);
 steps.forEach((step,i)=>step.addEventListener('click',()=>{const top=scrollY+story.getBoundingClientRect().top,distance=story.offsetHeight-innerHeight;window.scrollTo({top:top+distance*[0,.49,.88][i],behavior:'smooth'})}));
 updateStory();
}

// Scroll-driven hair strands, opening scissors and a progressive photo reveal.
if(!reduced&&story){
 const visual=story.querySelector('.hero-visual'),canvas=story.querySelector('.hair-motion'),ctx=canvas.getContext('2d'),scissors=story.querySelector('.scissor-motion'),result=story.querySelector('.cut-result'),spa=story.querySelector('.story-photo'),glint=story.querySelector('.finish-glint');
 let target=0,current=0,w=0,h=0,raf=0,visible=true;
 const clamp=x=>Math.max(0,Math.min(1,x));
 function size(){const r=visual.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);requestDraw()}
 function draw(){
  raf=0;current+=(target-current)*.16;if(Math.abs(target-current)<.0001)current=target;
  const p=current,care=clamp((p-.13)/.22),cut=clamp((p-.52)/.30),strandOpacity=Math.sin(clamp(p/.9)*Math.PI)*.8;
  spa.style.opacity='1';spa.style.clipPath=`inset(0 0 ${100-care*100}% 0)`;
  result.style.clipPath=`inset(0 ${100-cut*100}% 0 0)`;
  result.style.transform=`scale(${1+p*.06})`;spa.style.transform=`scale(${1+p*.06})`;visual.querySelector('.hero-photo').style.transform=`scale(${1+p*.06})`;
  scissors.style.opacity=String(clamp((p-.48)/.05)*clamp((.87-p)/.06));
  scissors.style.left=`${cut*110-5}%`;scissors.style.top=`${52+Math.sin(cut*Math.PI)*8}%`;
  scissors.style.transform=`translate(-50%,-50%) rotate(${88+Math.sin(cut*Math.PI*2)*10}deg)`;
  scissors.style.setProperty('--snip',`${Math.sin(cut*Math.PI*7)*14}deg`);
  glint.style.opacity=String(Math.sin(clamp((p-.8)/.2)*Math.PI)*.65);glint.style.transform=`translateX(${(p-.8)*1100-120}%) rotate(-20deg)`;
  ctx.clearRect(0,0,w,h);
  if(strandOpacity>.005){
   ctx.globalAlpha=strandOpacity;
   for(let i=0;i<42;i++){
    const n=i/41,spread=(n-.5)*w*.28,flow=p*Math.PI*2;
    const startX=w*(.8-.65*p)+spread;
    const gradient=ctx.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#fbe3c1');gradient.addColorStop(.28,'#9c5c39');gradient.addColorStop(.52,'#ffe9c7');gradient.addColorStop(.78,'#b47b51');gradient.addColorStop(1,'#f3d1a8');
    ctx.strokeStyle=gradient;ctx.lineWidth=i%7===0?2.5:.8;
    ctx.beginPath();ctx.moveTo(startX,-h*.1);
    ctx.bezierCurveTo(startX-w*.9*Math.sin(flow*.6),h*.25,w*(.1+.7*p)+spread,h*.27,w*.48+spread+Math.sin(flow)*w*.17,h*.55);
    ctx.bezierCurveTo(w*(1.15-.4*p)+spread,h*.8,w*(.1+.75*p)+spread,h*.95,w*(.7-.3*p)+spread,h*1.15);ctx.stroke();
   }
   ctx.globalAlpha=1;
  }
  if(visible&&Math.abs(target-current)>.0001)raf=requestAnimationFrame(draw);
 }
 function requestDraw(){if(!raf&&visible)raf=requestAnimationFrame(draw)}
 story.addEventListener('storyprogress',e=>{target=e.detail;requestDraw()});
 new ResizeObserver(size).observe(visual);
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)requestDraw();else if(raf){cancelAnimationFrame(raf);raf=0}}).observe(story);
 const r=story.getBoundingClientRect();target=clamp(-r.top/Math.max(1,story.offsetHeight-innerHeight));current=target;size();
}
