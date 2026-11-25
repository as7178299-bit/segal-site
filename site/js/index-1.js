/* ריענון הדף מחזיר לראש הדף. קישור ישיר לחלק בדף (#contact) עדיין עובד בכניסה רגילה */
(function(){if('scrollRestoration' in history)history.scrollRestoration='manual';
var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
if(n&&n.type==='reload'){if(location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0)}})();
