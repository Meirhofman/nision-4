# הגדרת Firebase להתחברות Google אמיתית

## שלב 1: יצירת פרויקט Firebase
1. פתח את הדפדפן וגש ל- https://console.firebase.google.com/
2. התחבר עם חשבון Google שלך
3. לחץ על "Add project" (הוסף פרויקט)
4. תן שם לפרויקט: `lazoz-app`
5. לחץ "Continue" ואז "Create project"

## שלב 2: הפעלת Authentication
1. בתפריט השמאלי, לחץ על "Authentication"
2. לחץ על "Get started"
3. בקטע "Sign-in providers", לחץ על "Google"
4. הפעל את הכפתור (Enable)
5. בחר אימייל תומך (לדוגמה: support@lazoz.com)
6. לחץ "Save"

## שלב 3: הוספת אפליקציית Web
1. לחץ על אייקון הגלגל שיניים (⚙️) ליד "Project Overview"
2. בחר "Project settings"
3. בקטע "Your apps", לחץ על "Web" (אייקון </>)
4. תן שם לאפליקציה: "Lazoz Web"
5. לחץ "Register app"
6. **העתק את כל הקוד שמופיע** - הוא ייראה כך:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "lazoz-app.firebaseapp.com",
  projectId: "lazoz-app",
  storageBucket: "lazoz-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## שלב 4: עדכון קובץ הסביבה
1. פתח את הקובץ `.env` בתיקייה הראשית
2. החלף את הערכים הריקים במפתחות האמיתיים מ-Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=lazoz-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lazoz-app
VITE_FIREBASE_STORAGE_BUCKET=lazoz-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## שלב 5: החזרת Firebase למצב רגיל
1. פתח את הקובץ `src/lib/auth.ts`
2. מצא את הפונקציה `isAuthAvailable()`
3. החלף את השורה `return true;` ב- `return isFirebaseConfigured;`

## שלב 6: הפעלה מחדש
1. עצור את האפליקציה (Ctrl+C)
2. הפעל מחדש עם: `npm run dev`

## מה קורה אחרי זה?
- כפתור Google יפתח חלון התחברות אמיתי של Google
- משתמשים יכולים להיכנס עם חשבון Google אמיתי
- המידע יישמר ב-Firebase

## טיפים חשובים:
- שמור את קובץ `.env` במקום בטוח - אל תעלה אותו ל-Git
- אם תעלה לאירוח, הוסף את הדומיין שלך בהגדרות Firebase
- במצב פיתוח אפשר להשתמש ב-localhost
