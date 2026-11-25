{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=id=>document.getElementById(id);
const P={phone:[1421,560],mail:[1065,245],lap:[947,470],night:[947,380],rep:[947,470],n2:[700,130]};
const STEPS=[
 {t:'09:14',l:'פנייה',h:'פנייה חדשה',c:'לקוח משאיר פרטים מהטלפון, והפנייה נכנסת למערכת.',sky:0,d:3200},
 {t:'09:15',l:'הצעה',h:'הצעת מחיר נשלחה',c:'הלקוח מקבל הצעה ממותגת במייל, תוך דקה.',sky:1,d:3000},
 {t:'11:32',l:'תשלום',h:'תשלום התקבל',c:'הלקוח מאשר ומשלם, ולוח הבקרה מתעדכן.',sky:1,d:3400},
 {t:'02:00',l:'לילה',h:'תהליכים מתוזמנים',c:'תזכורות, גיבוי והזמנות לספקים רצים בשעות השקטות.',sky:3,d:3400},
 {t:'07:00',l:'דוח',h:'דוח יומי',c:'סיכום הפעילות מחכה בבוקר, בגרפים ברורים.',sky:0,d:4200}
];
const chips=$('chips');
STEPS.forEach((s,i)=>{const b=document.createElement('button');b.className='chip';b.type='button';b.innerHTML='<span></span><i></i>';b.firstChild.textContent=s.l;b.setAttribute('aria-label',s.t+' · '+s.c);b.addEventListener('click',()=>{go(i,true);setPlay(false)});chips.appendChild(b)});

let steamT=1,steamK=1;
const LOOK=[
 {f:'saturate(1.04) sepia(.12) brightness(1.02)',bg:'linear-gradient(115deg,rgba(255,214,160,.28),transparent 55%)',o:1},
 {f:'none',bg:'transparent',o:0},
 {f:'saturate(1.1) sepia(.28) brightness(.92)',bg:'linear-gradient(100deg,rgba(255,140,70,.38),rgba(120,80,160,.22) 70%)',o:1},
 {f:'saturate(.7) brightness(.42) hue-rotate(-8deg)',bg:'radial-gradient(60% 55% at 42% 42%,rgba(60,90,170,0),rgba(8,14,34,.55))',o:1}];
function setSky(k){steamT=k===3?0:k===2?.5:1;$('steamcover').style.opacity=k===3?1:0;const L=LOOK[k];$('pw').style.filter=L.f;$('motes').style.opacity=k===3?0:k===2?.6:1;const t=$('tint');t.style.background=L.bg;t.style.opacity=L.o;
  $('lap').classList.toggle('glow',k===3);$('lap').style.filter=k===3?'brightness(.88)':'none';$('ph').style.filter=k===3?'brightness(.75)':'none'}
const CIRC=201;
function ringTo(p){$('ring').setAttribute('stroke-dashoffset',(CIRC*(1-p/100)).toFixed(1));$('pct').textContent=p+'%'}
function count(el,a,b,f,anim){if(reduce||!anim){el.textContent=f(b);return}const t0=performance.now();(function k(t){const p=Math.min((t-t0)/800,1);el.textContent=f(Math.round(a+(b-a)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(k)})(t0)}
const ils=v=>v.toLocaleString('he-IL')+' ₪';
const BASE_FEED='';
function feed(txt,time,anim){if(!$('feed'))return;const d=document.createElement('div');if(anim)d.className='new';d.innerHTML='<span></span><small></small>';d.firstChild.textContent=txt;d.lastChild.textContent=time;$('feed').prepend(d);while($('feed').children.length>3)$('feed').lastElementChild.remove()}
function flash(ids){ids.forEach(k=>{$(k).classList.add('flash');setTimeout(()=>$(k).classList.remove('flash'),900)})}
const phone=v=>{$('ps').dataset.v=v};
const NOTES=['note0','note1','note2','note3','note4'];
function resetUI(){NOTES.forEach(c=>$(c).classList.remove('show'));phone('form');['sbtn','qbtn'].forEach(b=>$(b).classList.remove('tap'));
  $('n1').textContent='4';$('n2').textContent='6';$('n3').textContent='38,200 ₪';ringTo(64);$('ptx').textContent='38,200 מתוך 60,000 ₪';$('pipe').dataset.s='0';$('dsum').textContent='—'}
function a0(an){count($('n1'),4,5,String,an);$('pipe').dataset.s='1';if(an)flash(['deal']);feed('פנייה חדשה · דוד לוי','09:14',an);if(an)flash(['k1'])}
function a1(an){count($('n2'),6,7,String,an);$('pipe').dataset.s='2';$('dsum').textContent='4,800 ₪';if(an)flash(['deal']);feed('הצעת מחיר 2041 נשלחה','09:15',an);if(an)flash(['k2'])}
function a2(an){count($('n2'),7,6,String,an);$('pipe').dataset.s='3';if(an)flash(['deal']);count($('n3'),38200,43000,ils,an);ringTo(72);$('ptx').textContent='43,000 מתוך 60,000 ₪';feed('תשלום התקבל · 4,800 ₪','11:32',an);if(an)flash(['k2','k3'])}
function stateUpTo(i){resetUI();if(i>0){phone('sent');a0(false)}if(i>1){phone('quote');a1(false)}if(i>2){phone('paid');a2(false)}}
const W=ms=>reduce?0:ms;
let cur=-1,timer,playing=!reduce;
let pend=[];const T=(f,ms)=>pend.push(setTimeout(f,ms));
function go(i,jump){clearTimeout(timer);pend.forEach(clearTimeout);pend=[];cur=i;const s=STEPS[i];
  [...chips.children].forEach((c,j)=>{c.setAttribute('aria-current',j===i);c.classList.toggle('past',j<i);const bar=c.querySelector('i');bar.style.animation='none';bar.offsetWidth;bar.style.animation=(j===i&&playing&&!reduce)?`fill ${s.d}ms linear forwards`:''});
  $('ct').textContent=s.t;$('st').textContent=s.h;$('cp').textContent=s.c;const ctx=document.querySelector('.captxt');ctx.classList.remove('in');void ctx.offsetWidth;ctx.classList.add('in');
  $('ph').classList.toggle('act',i<3&&i!==1);$('lap').classList.toggle('act',i>=2);setSky(s.sky);
  if(jump)stateUpTo(i);else if(i===0)resetUI();
  NOTES.forEach(c=>$(c).classList.remove('show'));
  $('ls').dataset.v=i===3?'night':i===4?'rep':'day';
  document.querySelectorAll('.donut circle').forEach(c=>{const C=201.06;c.setAttribute('stroke-dasharray',i===4?`${c.dataset.l} ${C}`:`0 ${C}`)});
  T(()=>$('note'+i).classList.add('show'),W(i===0?900:520));
  if(i===0){T(()=>{$('sbtn').classList.add('tap');T(()=>{phone('sent');a0(true)},W(380))},W(320))}
  if(i===1){T(()=>{phone('quote');a1(true)},W(380))}
  if(i===2){T(()=>{$('qbtn').classList.add('tap');T(()=>{phone('paid');a2(true)},W(380))},W(320))}
  if(playing)timer=setTimeout(()=>go((i+1)%STEPS.length,false),s.d);
}
function setPlay(p){playing=p;$('pp').setAttribute('aria-pressed',!p);$('ppath').setAttribute('d',p?'M4 2h3v12H4zM9 2h3v12H9z':'M4 2l10 6-10 6z');$('ppt').textContent=p?'עצירה':'המשך';$('pp').setAttribute('aria-label',p?'עצירה':'המשך');if(p)go((cur+1)%STEPS.length,false);else clearTimeout(timer)}
$('pp').addEventListener('click',()=>setPlay(!playing));
$('ph').addEventListener('click',()=>{playing=true;$('pp').setAttribute('aria-pressed',false);$('ppath').setAttribute('d','M4 2h3v12H4zM9 2h3v12H9z');$('ppt').textContent='עצירה';go(0,true)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else if(playing)go(cur,false)});

if(!reduce){
 const NS='http://www.w3.org/2000/svg',st=$('steam'),mo=$('motes');
 const wisps=[...Array(5)].map((_,i)=>{const p=document.createElementNS(NS,'path');p.setAttribute('stroke-width',10+i*3);st.appendChild(p);return{p,t:i/5}});
 const motes=[...Array(26)].map(()=>{const c=document.createElementNS(NS,'circle');c.setAttribute('fill','url(#mote)');mo.appendChild(c);
   return{c,x:220+Math.random()*560,y:120+Math.random()*420,r:2+Math.random()*3.5,vx:(Math.random()-.5)*6,vy:-2-Math.random()*5,ph:Math.random()*6}});
 let t0=performance.now(),lastT=t0;
 (function air(t){const dt=Math.min((t-lastT)/1000,.05);lastT=t;const s=(t-t0)/1000;
  wisps.forEach((w,i)=>{const k=((s/4.2+w.t)%1),y0=545-k*190,x0=492+Math.sin(s*.9+i)*6,sw=14+k*26;
    w.p.setAttribute('d',`M${x0} ${y0} q${-sw} -30 0 -60 q${sw} -30 0 -60`);steamK+=(steamT-steamK)*.03;w.p.setAttribute('opacity',(Math.sin(k*Math.PI)*.38*steamK).toFixed(3))});
  motes.forEach(m=>{m.x+=m.vx*dt+Math.sin(s*.7+m.ph)*.15;m.y+=m.vy*dt;if(m.y<90){m.y=560;m.x=220+Math.random()*560}
    const a=.25+.55*Math.abs(Math.sin(s*.6+m.ph));m.c.setAttribute('cx',m.x.toFixed(1));m.c.setAttribute('cy',m.y.toFixed(1));m.c.setAttribute('r',m.r);m.c.setAttribute('opacity',a.toFixed(2))});
  if(!document.hidden)requestAnimationFrame(air);else{const r=()=>{if(!document.hidden){lastT=performance.now();requestAnimationFrame(air)}else setTimeout(r,500)};setTimeout(r,500)}})(t0);
}

if(reduce){go(2,true)}else go(0,false);
if(reduce){$('ppath').setAttribute('d','M4 2l10 6-10 6z');$('ppt').textContent='הפעלה'}
}
