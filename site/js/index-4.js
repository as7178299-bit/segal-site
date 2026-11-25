{
const acc=document.getElementById('acc');
if(acc){
  const items=[...acc.children];
  const open=el=>items.forEach(x=>{const on=x===el;x.classList.toggle('on',on);x.setAttribute('aria-expanded',on)});
  items.forEach(el=>{
    el.addEventListener('mouseenter',()=>matchMedia('(hover:hover)').matches&&open(el));
    el.addEventListener('focus',()=>open(el));
    el.addEventListener('click',()=>open(el));
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el)}});
  });
}
}
