/* ריענון הדף מחזיר לראש הדף. קישור ישיר לחלק בדף (#contact) עדיין עובד בכניסה רגילה */
(function(){if('scrollRestoration' in history)history.scrollRestoration='manual';
var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
if(n&&n.type==='reload'){if(location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0)}
/* קישורים בתוך הדף גוללים למקום בלי להוסיף #… לכתובת, כדי שריענון לא יקפוץ לשם */
document.addEventListener('click',function(e){var l=e.target.closest&&e.target.closest('a[href^="#"]');if(!l||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey)return;
var id=l.getAttribute('href').slice(1),t=id?document.getElementById(id):null;if(!id){e.preventDefault();scrollTo({top:0});return}if(!t)return;
e.preventDefault();t.scrollIntoView({block:'start'});if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','-1');t.focus({preventScroll:true});if(location.hash)history.replaceState(null,'',location.pathname+location.search)});
})();
