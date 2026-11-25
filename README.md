# סגל אוטומציות · האתר

האתר הראשי של סגל אוטומציות: https://segalautomations.cloud

- `src/` מקור הדפים (site.html הוא דף הבית). עורכים כאן.
- `site/` מה שמוגש בפועל. נוצר מ-`src` עם `python3 tools/build.py`, שמוציא את הקוד מהדפים לקבצים ב-`js/` (בשביל CSP קשיחה).
- `deploy/docker-compose.yml` הגשה בשרת: מושך את המאגר כל דקה ומגיש עם nginx מאחורי Traefik.
- `n8n/` קוד התהליך של טופס הפניות (פניות נשמרות בטבלה ב-n8n ובלוח הלידים ב-Airtable, ומייל לאריה).

אין במאגר סודות: כתובת ה-webhook של הטופס ציבורית ממילא, ומוגנת בבדיקת מקור, מלכודת לבוטים ובדיקת שדות.

## קרדיט לתמונות
התמונות ב-`site/img/hx/` מ-Unsplash (רישיון Unsplash: שימוש חופשי, גם מסחרי, בלי חובת קרדיט). צלמים: Ryan Stone, Polina Kuzovkova, The Anam, Clay Banks, Iglucraft, Ella Olsson, Orkun Orcan, Tim Toomey, iman zaker, ABHISHEK HAJARE, Laura Peruchi, Reshma Mallecha, Antonio Groß, Alex Marc Wagner, Nina Mercado, Cecep Rahmat, Rohit Choudhari, Sander Yigin, Artem Balashevsky, Kasem Sleem (הכנרת).

תמונות רכבים מ-Wikimedia Commons, ברישיון CC BY-SA 4.0 (מותר שימוש מסחרי עם קרדיט):
- `car-i30.webp`: "2017 hyundai i30 front-side", צלם: Ki hoon, נחתך והוקטן.
- `car-corolla.webp`: "Lateral Toyota Corolla Hybrid CRI 10 2021 1613", צלם: Mariordo (Mario Roberto Durán Ortiz), נחתך והוקטן.

המפה (`map-rehovot.webp`): © OpenStreetMap contributors, רישיון ODbL. הקרדיט מוצג על המפה עצמה.
הדמיות הדלתות (`door-*.svg`) וצללית הרכב (`car-sil.svg`): ציור מקורי.
