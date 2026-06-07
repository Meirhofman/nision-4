# התחברות בטלפון + קוד SMS (Firebase)

## חשוב: Web vs Android

הקוד ב-Kotlin (`firebase-pnv`) מיועד **לאפליקציית Android בלבד**.

בפרויקט React (Vite) משתמשים ב-**Firebase Authentication – Phone** דרך הדפדפן:
- `signInWithPhoneNumber`
- `RecaptchaVerifier`

זה כבר מחובר ב-`src/lib/auth.ts` ובטאב **"טלפון + SMS"** בדף `/login`.

---

## מה כבר מוגדר אצלך

קובץ `.env` עם פרויקט `lazoz-app`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=lazoz-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lazoz-app
...
```

אחרי שינוי ב-`.env` — **הפעל מחדש** את `npm run dev`.

---

## שגיאה: `auth/configuration-not-found` (הכי נפוץ)

**משמעות:** Firebase Authentication לא הופעל בפרויקט, או ש-**Phone** לא מופעל.

### תיקון צעד-אחר-צעד

1. פתח: [הפעלת Phone ב-lazoz-app](https://console.firebase.google.com/project/lazoz-app/authentication/providers)
2. אם מופיע **Get started** — לחץ והמשך (זה מפעיל Authentication בפעם הראשונה).
3. בטאב **Sign-in method** → שורה **Phone** → לחץ עליה.
4. הפעל **Enable** → **Save**.
5. (מומלץ) הפעל גם **Email/Password** אם תרצה התחברות במייל.
6. רענן את האפליקציה (F5) ונסה שוב.

אם עדיין לא עובד — ב-[Google Cloud APIs](https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=lazoz-app) ודא ש-**Identity Toolkit API** מופעל (Enable).

---

## הגדרות חובה ב-Firebase Console

1. פתח [Firebase Console](https://console.firebase.google.com) → פרויקט **lazoz-app**
2. **Authentication** → **Get started** (אם עדיין לא לחצת)
3. **Sign-in method** → הפעל **Phone** (Enable) → Save
4. **Authentication** → **Settings** → **Authorized domains**
   - ודא שיש: `localhost`
   - הוסף את הדומיין שלך בפרודקשן (למשל `your-app.web.app`)
5. (אופציונלי לבדיקות) **Phone numbers for testing**
   - הוסף מספר בדיקה + קוד קבוע (למשל `+972501234567` / `123456`)
   - בבדיקה לא נשלח SMS אמיתי

---

## איך להשתמש באפליקציה

1. עבור ל-`/login` (או `/landing` → התחברות)
2. בחר טאב **"טלפון + SMS"**
3. הזן מספר (למשל `0501234567` — יומר אוטומטית ל-`+972...`)
4. לחץ **שלח לי קוד SMS**
5. הזן את הקוד מ-SMS → **אימות והתחברות**

---

## חובה ל-SMS אמיתי (לא הודעה על המסך)

1. **שדרוג ל-Blaze** (תשלום לפי שימוש): Firebase Console → ⚙️ Project settings → **Usage and billing** → Upgrade  
   ללא Blaze, SMS לרוב לא נשלח למספרים אמיתיים.

2. **הפעל Phone**: Authentication → Sign-in method → **Phone** → Enable

3. **Authorized domains**: Authentication → Settings → הוסף:
   - `localhost`
   - כתובת הרשת שלך (למשל `192.168.1.5` אם פותחים מהמובייל)

4. **reCAPTCHA**: לפני "שלח קוד" — **סמן** את תיבת "אני לא רובוט" שמופיעה במסך

5. **הפעלה מחדש**: אחרי שינוי `.env` — עצור את השרת (Ctrl+C) והרץ שוב `npm run dev`

## פתרון בעיות

| בעיה | פתרון |
|------|--------|
| **`operation-not-allowed`** | התחברות בטלפון או Google כבויה — הפעל ב-Sign-in method; ודא ש-Identity Toolkit API מופעל ב-Google Cloud. |
| **`unauthorized-domain`** | הדומיין (כמו ה-IP של המחשב) לא רשום ב-Authorized domains ב-Firebase. |
| מופיע קוד על המסך (דמו) | עודכן — אין דמו. אם עדיין קורה, רענן דף (Ctrl+F5) |
| `operation-not-allowed` | הפעל Phone ב-Sign-in method |
| `billing-not-enabled` / לא מגיע SMS | שדרג ל-Blaze ב-Firebase |
| `captcha-check-failed` | סמן reCAPTCHA לפני שליחה |
| `invalid-app-credential` | הוסף domain ב-Authorized domains; בדוק הגבלות API key |
| `invalid-phone-number` | מספר ישראלי: `05XXXXXXXX` |

---

## אבטחה

- **אל תעלה** את `.env` ל-Git (הוא ב-`.gitignore`)
- מפתחות ב-GitHub / צ'אט — עדיף ליצור מפתח חדש ב-Firebase אם דלפו
