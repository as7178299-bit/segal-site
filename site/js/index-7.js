/* וואו: זרקור לעכבר ואור רקע */
(()=>{
const a=document.createElement('div');a.className='wow-aur';a.setAttribute('aria-hidden','true');document.body.prepend(a);
if(matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.querySelectorAll('.case,.ap').forEach(c=>{
    const s=document.createElement('span');s.className='wow-spot';s.setAttribute('aria-hidden','true');c.prepend(s);
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')});
  });
}
})();
