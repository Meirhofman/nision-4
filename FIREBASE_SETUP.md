# Firebase Configuration

## 1. צור פרויקט Firebase
1. היכנס ל- [Firebase Console](https://console.firebase.google.com/)
2. לחץ על "Add project" או "הוסף פרויקט"
3. תן שם לפרויקט (לדוגמה: "lazoz-app")
4. הפעל את Google Analytics (אופציונלי)
5. לחץ "Create project"

## 2. הפעל Authentication
1. בתוך הפרויקט, לחץ על "Authentication" בצד שמאל
2. לחץ על "Get started" או "התחל"
3. בקטע "Sign-in method", לחץ על "Google"
4. הפעל אותו (Enable)
5. הכנס אימייל תומך (support email)
6. שמור

## 3. הוסף אפליקציית Web
1. לחץ על אייקון הגלגל שיניים (⚙️) ליד "Project Overview"
2. בחר "Project settings"
3. בקטע "Your apps", לחץ על "Web" או על האייקון </>
4. תן שם לאפליקציה (לדוגמה: "Lazoz Web App")
5. לחץ "Register app"
6. העתק את פרטי התצורה שמופיעים

## 4. עדכן את קובץ הסביבה
צור קובץ חדש בשם `.env` בתיקייה הראשית של הפרויקט עם התוכן הבא:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_name.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_name
VITE_FIREBASE_STORAGE_BUCKET=your_project_name.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 5. הפעל מחדש את האפליקציה
אחרי שתעדכן את קובץ ה-.env, הפעל מחדש את האפליקציה עם:
```bash
npm run dev
```

## חשוב!
- קובץ ה-.env לא עולה ל-Git (הוא כבר ב-.gitignore)
- החלף את הערכים של `your_...` בערכים האמיתיים מ-Firebase
- אחרי ההגדרה, כפתורי Google ו-Facebook יעבדו אמיתי
