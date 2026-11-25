{
/* כפתור המייל: פותח את תוכנת המייל, ובנוסף מעתיק את הכתובת. במחשב בלי תוכנת מייל מוגדרת קישור mailto לא עושה כלום */
const m=document.getElementById('rmail');
if(m){m.addEventListener('click',async()=>{
  const sp=m.querySelector('span'),orig=sp.textContent;
  try{await navigator.clipboard.writeText('segalautomations@gmail.com');sp.textContent='הכתובת הועתקה';sp.dir='rtl';setTimeout(()=>{sp.textContent=orig;sp.dir='ltr'},2200)}catch{}
});}
}
