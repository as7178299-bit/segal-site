{
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* sticky header shadow + phone dock */
const top=document.querySelector('.top'),dock=$('dock'),hero=document.querySelector('.herob'),contact=$('contact');
let contactVis=false;
new IntersectionObserver(([e])=>{contactVis=e.isIntersecting;upd()}).observe(contact);
function upd(){const y=scrollY;top.classList.toggle('stuck',y>8);dock.classList.toggle('show',y>hero.offsetHeight*.7&&!contactVis)}
addEventListener('scroll',upd,{passive:true});upd();
/* current section in nav */
const links=[...document.querySelectorAll('.nav a')];
const secIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('cur',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
['work','what','process','faq','contact'].forEach(id=>$(id)&&secIO.observe($(id)));
/* reveal */
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach((el,i)=>{if(el.parentElement.classList.contains('caps'))el.style.transitionDelay=(i%4)*90+'ms';rio.observe(el)});
/* process line fills right-to-left with the scroll */
const proc=$('proc'),steps=[...proc.children];
function procUpd(){
  const r=proc.getBoundingClientRect(),vh=innerHeight;
  let p=reduce?1:Math.min(1,Math.max(0,(vh*.8-r.top)/(r.height+vh*.35)));
  proc.style.setProperty('--p',p.toFixed(3));
  steps.forEach((li,i)=>li.classList.toggle('on',p>=i/(steps.length-1)-.02));
}
addEventListener('scroll',procUpd,{passive:true});addEventListener('resize',procUpd);procUpd();
/* lead form */
const LEAD_URL='https://n8n.srv1187730.hstgr.cloud/webhook/segal-lead';
const f=$('lead'),err=$('ferr'),nm=$('fname'),ph=$('fphone'),btn=$('send');
const phoneOk=v=>/^0\d{8,9}$/.test(v.replace(/[\s-]/g,''));
ph.addEventListener('input',()=>{if(ph.getAttribute('aria-invalid')==='true'&&phoneOk(ph.value)){ph.removeAttribute('aria-invalid');err.textContent=''}});
nm.addEventListener('input',()=>{if(nm.value.trim()){nm.removeAttribute('aria-invalid');if(!ph.getAttribute('aria-invalid'))err.textContent=''}});
f.addEventListener('submit',ev=>{
  ev.preventDefault();
  if(!nm.value.trim()){nm.setAttribute('aria-invalid','true');err.textContent='נא למלא שם.';nm.focus();return}
  if(!phoneOk(ph.value)){ph.setAttribute('aria-invalid','true');err.textContent='נא לבדוק את מספר הטלפון: 9 או 10 ספרות, מתחיל ב-0.';ph.focus();return}
  err.textContent='';btn.disabled=true;btn.classList.add('busy');$('sendt').textContent='שולח...';
  // הפנייה נשמרת בטבלה ב-n8n ומייל יוצא לאריה (תהליך "סגל אוטומציות · פניות מהאתר")
  const fail=()=>{btn.disabled=false;btn.classList.remove('busy');$('sendt').textContent='שליחת הפרטים';err.textContent='השליחה לא הצליחה. ניתן לנסות שוב, או לכתוב בוואטסאפ ל-052-7178299.'};
  fetch(LEAD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nm.value,phone:ph.value,message:$('fmsg').value,website:$('fweb').value,source:'אתר · '+(location.hash||'דף הבית')})})
    .then(r=>r.json().catch(()=>({})).then(j=>{if(r.ok){$('done').classList.add('show');$('done').focus()}else if(j.message){btn.disabled=false;btn.classList.remove('busy');$('sendt').textContent='שליחת הפרטים';err.textContent=j.message}else fail()}))
    .catch(fail);
});
}
