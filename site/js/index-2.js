{
document.documentElement.classList.add('js');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.25});
document.querySelectorAll('.vis').forEach(v=>io.observe(v));
document.querySelectorAll('.tabs').forEach(g=>{
  const c=g.dataset.case;
  g.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b)return;
    g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    const set=(k,i)=>document.querySelectorAll(`[data-set="${c}-${k}"] img`).forEach((im,j)=>im.classList.toggle('on',j==i));
    set('l',b.dataset.l);set('p',b.dataset.p);
  });
});
}
