{
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage=$('hxs'),hero=document.querySelector('.hx');
const STEPS=[
 {l:'נופש',t:'נופש וצימרים',h:'הזמנה ותשלום באתר',c:'אחרי התשלום האורח מקבל אישור, הוראות הגעה וקוד כניסה.',c1:'#19B5A5',c2:'#FF8A5B'},
 {l:'קייטרינג',t:'קייטרינג ואולם שמחות',h:'בחירת תפריט לאירוע',c:'המשפחה בוחרת מנות, והכמויות למטבח מחושבות במערכת.',c1:'#C2405F',c2:'#E3B35A'},
 {l:'מוסך',t:'מוסך',h:'לוח עבודה לפי שלבים',c:'בסיום הטיפול נשלחת ללקוח הודעה עם קישור לתשלום.',c1:'#FF7A1A',c2:'#5B6B80'},
 {l:'נגרות',t:'דלתות ונגרות',h:'מעקב ייצור והתקנה',c:'כל שלב בייצור מתעדכן, ומועד ההתקנה נשלח ללקוח.',c1:'#B07A48',c2:'#5E7F5B'},
 {l:'הובלות',t:'הובלות ושליחויות',h:'מסלול יומי ואישור מסירה',c:'הלקוח מקבל זמן הגעה משוער, והמסירה נשמרת עם צילום וחתימה.',c1:'#4F7BFF',c2:'#A3E635'}
];
const DUR=5600,P1=500,P2=2600;
/* התאמת המסך החי לגודל המסגרת */
const fits=[...stage.querySelectorAll('.hx-fit')];
const ro=new ResizeObserver(()=>fits.forEach(f=>{const w=f.parentElement.clientWidth;f.style.setProperty('--k',w/ +f.dataset.w)}));
fits.forEach(f=>ro.observe(f.parentElement));
/* לוח תפוסה: מיקום ההזמנות לפי הימים */
/* המשאית: מעצירה 3 לעצירה 4 */
const trk=$('hxtrk'),done=stage.querySelector('.x-route.x-done');
const A=[548,520],B=[690,506],F0=.1695;
function truckAt(p){const x=A[0]+(B[0]-A[0])*p,y=A[1]+(B[1]-A[1])*p;trk.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');done.style.strokeDashoffset=(F0*(1-p)).toFixed(4)}
let raf=0;function runTruck(){cancelAnimationFrame(raf);if(reduce){truckAt(1);return}truckAt(0);const t0=performance.now();(function f(t){const p=Math.min((t-t0)/(P2-P1-150),1);truckAt(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2);if(p<1)raf=requestAnimationFrame(f)})(t0)}
/* שלבים */
const chips=$('hxchips');
STEPS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='hx-chip';b.innerHTML='<span><i></i></span>';b.append(s.l);b.setAttribute('aria-label',s.t);b.addEventListener('click',()=>{go(i);arm()});chips.append(b)});
const cards=[...stage.querySelectorAll('.hx-card')];
let cur=0,timers=[],playing=!reduce,visible=true;
function clear(){timers.forEach(clearTimeout);timers=[]}
function phase(n){stage.classList.toggle('x-p1',n>=1);stage.classList.toggle('x-p2',n>=2);
  cards.forEach(c=>c.classList.toggle('x-on',+c.dataset.i===cur&&((n===1&&c.classList.contains('x-ta'))||(n===2&&c.classList.contains('x-tb')))));
  if(n===1&&cur===4)runTruck();if(n===2&&cur===4){cancelAnimationFrame(raf);truckAt(1)}}
function go(i){
  clear();cur=i;const s=STEPS[i];stage.dataset.s=i;
  stage.querySelectorAll('.x-sc').forEach(el=>el.classList.toggle('x-on',+el.dataset.i===i));
  $('hxt').textContent=s.t;$('hxh').textContent=s.h;
  hero.style.setProperty('--hc1',s.c1);hero.style.setProperty('--hc2',s.c2);
  [...chips.children].forEach((c,j)=>{c.classList.toggle('hx-dn',j<i);c.classList.toggle('hx-cu',j===i);c.classList.toggle('hx-hd',!playing);c.style.setProperty('--d',DUR+'ms');c.setAttribute('aria-current',j===i?'true':'false');const f=c.querySelector('i');if(j===i){f.style.animation='none';f.offsetWidth;f.style.animation=''}});
  phase(0);if(i===4){truckAt(0)}
  if(reduce){phase(2);return}
  timers.push(setTimeout(()=>phase(1),P1),setTimeout(()=>phase(2),P2));
}
function arm(){if(playing&&visible)timers.push(setTimeout(()=>{go((cur+1)%STEPS.length);arm()},DUR))}
function setPlay(p){playing=p;$('hxpath').setAttribute('d',p?'M4 2h3v12H4zM9 2h3v12H9z':'M4 2l10 6-10 6z');$('hxpp').setAttribute('aria-label',p?'עצירה':'המשך');
  if(p){go((cur+1)%STEPS.length);arm()}else{clear();phase(2);[...chips.children].forEach(c=>c.classList.add('hx-hd'))}}
$('hxpp').addEventListener('click',()=>setPlay(!playing));
if(reduce)$('hxpath').setAttribute('d','M4 2l10 6-10 6z');
go(0);arm();
/* עוצרים כשהפתיחה לא על המסך או שהלשונית מוסתרת; הכותרת העליונה כהה מעל הפתיחה */
const setDark=()=>document.body.classList.toggle('hxdark',hero.getBoundingClientRect().bottom>70);
new IntersectionObserver(([e])=>{const v=e.isIntersecting;if(v!==visible){visible=v;if(v&&playing){go(cur);arm()}else if(!v)clear()}},{threshold:0}).observe(hero);
addEventListener('scroll',setDark,{passive:true});setDark();
document.addEventListener('visibilitychange',()=>{const v=!document.hidden;if(v===visible)return;visible=v;if(v&&playing){go(cur);arm()}else if(!v)clear()});
}
