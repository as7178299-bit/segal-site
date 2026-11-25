{
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage=$('hxs');
const STEPS=[
 {t:'09:14',l:'פנייה',h:'פנייה חדשה מהאתר',c:'מבקר באתר של עלווה משאיר פרטים, והפנייה נכנסת למערכת.',k:'a',tag:'<b>עלווה</b> · אתר לכפר נופש',d:3800},
 {t:'11:32',l:'תשלום',h:'הזמנה ותשלום',c:'הורה מזמין ספרים לילדים ומשלם, והמסך של המזכירות מתעדכן.',k:'o',tag:'<b>אור הספר</b> · מערכת הזמנות',d:4200},
 {t:'02:00',l:'לילה',h:'בשעות השקטות',c:'תזכורות, הזמנות לספקים וגיבוי רצים לבד.',k:'o',tag:'<b>אור הספר</b> · מערכת הזמנות',d:4000},
 {t:'07:00',l:'בוקר',h:'דוח הבוקר מחכה',c:'סיכום הפעילות ומה שדורש טיפול היום, במייל.',k:'r',tag:'<b>אור הספר</b> · מסך הבית',d:4600}
];
const chips=$('hxchips');
STEPS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='hx-chip';b.innerHTML='<span><i></i></span>';b.append(s.l);b.setAttribute('aria-label',s.t+' · '+s.h);b.addEventListener('click',()=>{go(i);if(playing)arm()});chips.append(b)});
let cur=0,timer=0,playing=!reduce,visible=true;
const ils=v=>v.toLocaleString('he-IL')+' ₪';
function count(el,a,b){if(reduce){el.textContent=ils(b);return}const t0=performance.now();(function k(t){const p=Math.min((t-t0)/900,1);el.textContent=ils(Math.round(a+(b-a)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(k)})(t0)}
function go(i){
  cur=i;const s=STEPS[i];stage.dataset.s=i;
  stage.querySelectorAll('img[data-k]').forEach(im=>im.classList.toggle('on',im.dataset.k===s.k));
  $('hxtag').innerHTML=s.tag;
  $('hxt').textContent=s.t;$('hxh').textContent=s.h;$('hxc').textContent=s.c;
  [...chips.children].forEach((c,j)=>{c.classList.toggle('hx-dn',j<i);c.classList.toggle('hx-cu',j===i);c.classList.toggle('hx-hd',!playing);c.style.setProperty('--d',s.d+'ms');c.setAttribute('aria-current',j===i?'step':'false');
    const f=c.querySelector('i');if(j===i){f.style.animation='none';f.offsetWidth;f.style.animation=''}});
  if(i===1)count($('hxrev'),38200,43000);else $('hxrev').textContent=ils(38200);
}
function arm(){clearTimeout(timer);if(playing&&visible)timer=setTimeout(()=>{go((cur+1)%STEPS.length);arm()},STEPS[cur].d)}
function setPlay(p){playing=p;$('hxpath').setAttribute('d',p?'M4 2h3v12H4zM9 2h3v12H9z':'M4 2l10 6-10 6z');$('hxpp').setAttribute('aria-label',p?'עצירה':'המשך');[...chips.children].forEach(c=>c.classList.toggle('hx-hd',!p));if(p){go((cur+1)%STEPS.length);arm()}else clearTimeout(timer)}
$('hxpp').addEventListener('click',()=>setPlay(!playing));
if(reduce)$('hxpath').setAttribute('d','M4 2l10 6-10 6z');
go(0);arm();
/* עוצרים כשהפתיחה לא על המסך או שהלשונית מוסתרת */
const hero=document.querySelector('.hx');
new IntersectionObserver(([e])=>{visible=e.isIntersecting;document.body.classList.toggle('hxdark',e.intersectionRatio>0&&e.boundingClientRect.bottom>70);arm()},{threshold:[0,.01,.1,.5,1],rootMargin:'0px 0px 0px 0px'}).observe(hero);
addEventListener('scroll',()=>{document.body.classList.toggle('hxdark',hero.getBoundingClientRect().bottom>70)},{passive:true});
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;arm()});
}
