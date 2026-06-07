import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  type User,
  signOut as firebaseSignOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured, firebaseConfig } from './firebase';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName || null,
    email: user.email || null,
    photoURL: user.photoURL || null,
  };
}

/** Detect mobile for redirect flow (popups often blocked on mobile) */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

export async function signInWithGoogle(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth לא מאותחל. ודא שקובץ .env תקין.');
  }
  try {
    if (isMobileDevice()) {
      console.log('[Auth] Mobile device detected, using redirect flow');
      await signInWithRedirect(auth, new GoogleAuthProvider());
      return null;
    }
    console.log('[Auth] Starting Google popup sign-in');
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    console.log('[Auth] Google sign-in success');
    return mapFirebaseUser(result.user);
  } catch (err: any) {
    console.error('[Auth] Google sign-in error:', err.code, err.message, err);
    throw err;
  }
}

export async function signInWithFacebook(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth לא מאותחל. ודא שקובץ .env תקין.');
  }
  try {
    if (isMobileDevice()) {
      console.log('[Auth] Mobile device detected, using redirect flow');
      await signInWithRedirect(auth, new FacebookAuthProvider());
      return null;
    }
    console.log('[Auth] Starting Facebook popup sign-in');
    const result = await signInWithPopup(auth, new FacebookAuthProvider());
    console.log('[Auth] Facebook sign-in success');
    return mapFirebaseUser(result.user);
  } catch (err: any) {
    console.error('[Auth] Facebook sign-in error:', err.code, err.message, err);
    throw err;
  }
}

export async function signInWithApple(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth לא מאותחל. ודא שקובץ .env תקין.');
  }
  try {
    const provider = new OAuthProvider('apple.com');
    if (isMobileDevice()) {
      console.log('[Auth] Mobile device detected, using redirect flow');
      await signInWithRedirect(auth, provider);
      return null;
    }
    console.log('[Auth] Starting Apple popup sign-in');
    const result = await signInWithPopup(auth, provider);
    console.log('[Auth] Apple sign-in success');
    return mapFirebaseUser(result.user);
  } catch (err: any) {
    console.error('[Auth] Apple sign-in error:', err.code, err.message, err);
    throw err;
  }
}

export async function handleRedirectResult(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) return mapFirebaseUser(result.user);
  } catch (err) {
    console.error('Redirect result error:', err);
  }
  return null;
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) await firebaseSignOut(auth);
}

export function isAuthAvailable(): boolean {
  return isFirebaseConfigured;
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth || !auth.currentUser) {
    return { success: false, error: 'No authenticated user' };
  }

  try {
    const user = auth.currentUser;
    if (user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    }
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    let errorMessage = 'Failed to update password';
    switch (code) {
      case 'auth/wrong-password':
        errorMessage = 'Current password is incorrect';
        break;
      case 'auth/weak-password':
        errorMessage = 'New password is too weak (minimum 6 characters)';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      default:
        errorMessage = (error as { message?: string })?.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}

/** Phone Authentication — SMS אמיתי דרך Firebase (לא דמו) */

let activeRecaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaWidgetId: number | null = null;

/** פונקציה לקבלת קישור ישיר להפעלת Phone בפרויקט הנוכחי */
export function getFirebasePhoneSetupUrl(): string {
  const projectId = firebaseConfig.projectId || 'lazoz-app';
  return `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
}

export function isConfigurationNotFoundError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  const message = ((error as { message?: string })?.message || '').toLowerCase();
  return (
    code === 'auth/configuration-not-found' ||
    (code === 'auth/internal-error' && message.includes('configuration_not_found')) ||
    message.includes('configuration-not-found') ||
    message.includes('configuration_not_found')
  );
}

export function mapPhoneAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const message = (error as { message?: string })?.message || '';

  if (isConfigurationNotFoundError(error)) {
    return (
      'Firebase Authentication לא הוגדר בפרויקט. פתח Firebase Console → Authentication → ' +
      'לחץ "Get started" אם מופיע → Sign-in method → הפעל Phone (טלפון) → Save.'
    );
  }

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'מספר טלפון לא תקין. הזן 05XXXXXXXX או +9725XXXXXXXX';
    case 'auth/missing-phone-number':
      return 'חסר מספר טלפון';
    case 'auth/too-many-requests':
      return 'יותר מדי ניסיונות. המתן 10–15 דקות ונסה שוב';
    case 'auth/captcha-check-failed':
      return 'אימות האבטחה נכשל. סמן את תיבת "אני לא רובוט" ונסה שוב';
    case 'auth/invalid-app-credential':
    case 'auth/app-not-authorized':
      return 'האפליקציה לא מורשית ל-SMS. ב-Firebase: Authentication → Settings → Authorized domains — הוסף localhost והדומיין שלך. ב-Google Cloud ודא ש-API key לא חוסם את הדומיין';
    case 'auth/invalid-verification-code':
      return 'קוד שגוי. בדוק את ה-SMS והזן שוב';
    case 'auth/code-expired':
      return 'הקוד פג תוקף. לחץ "שלח שוב"';
    case 'auth/quota-exceeded':
      return 'מכסת SMS מלאה. ב-Firebase Console הפעל חיוב (Blaze) תחת Upgrade';
    case 'auth/operation-not-allowed':
      return 'התחברות בטלפון כבויה (Operation Not Allowed). ודא ש-Phone מופעל ב-Firebase Console ושה-Project ID תואם. לפעמים נדרש להפעיל Identity Toolkit API ב-Google Cloud Console.';
    case 'auth/sms-not-sent':
      return 'שליחת SMS נכשלה. ודא Blaze + Phone מופעלים ב-Firebase (ראה FIREBASE_PHONE.md)';
    case 'auth/billing-not-enabled':
      return 'נדרש חשבון חיוב ב-Firebase (Blaze) לשליחת SMS. שדרג ב-Project Settings → Usage and billing';
    default:
      if (message.includes('reCAPTCHA')) {
        return 'סמן את תיבת האבטחה (reCAPTCHA) לפני שליחת הקוד';
      }
      return message || 'שגיאה בשליחת SMS. בדוק הגדרות Firebase (ראה FIREBASE_PHONE.md)';
  }
}

export function clearRecaptcha(): void {
  if (activeRecaptchaVerifier) {
    try {
      activeRecaptchaVerifier.clear();
    } catch {
      /* ignore */
    }
    activeRecaptchaVerifier = null;
    recaptchaWidgetId = null;
  }
}

export function clearRecaptchaContainer(containerId?: string): void {
  if (containerId) {
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = '';
  }
}

/** יוצר ומציג reCAPTCHA גלוי — חובה לפני שליחת SMS */
export async function prepareRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase לא מאותחל. בדוק קובץ .env והפעל מחדש את npm run dev');
  }
  if (!isFirebaseConfigured) {
    throw new Error('הגדרות Firebase חסרות');
  }

  clearRecaptcha();
  clearRecaptchaContainer(containerId);

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error('שגיאת ממשק: חסר אזור reCAPTCHA');
  }
  container.innerHTML = '';

  activeRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'normal',
    callback: () => {
      /* reCAPTCHA נפתר */
    },
    'expired-callback': () => {
      clearRecaptcha();
    },
  });

  recaptchaWidgetId = await activeRecaptchaVerifier.render();
  return activeRecaptchaVerifier;
}

/** האם reCAPTCHA מוכן לשליחה */
export function isRecaptchaReady(): boolean {
  return activeRecaptchaVerifier !== null;
}

/** ממתין לאימות reCAPTCHA לפני SMS */
export async function ensureRecaptchaVerified(): Promise<void> {
  if (!activeRecaptchaVerifier) {
    throw Object.assign(new Error('סמן את תיבת האבטחה (אני לא רובוט)'), {
      code: 'auth/captcha-check-failed',
    });
  }
  try {
    await activeRecaptchaVerifier.verify();
  } catch {
    throw Object.assign(new Error('סמן את תיבת האבטחה (אני לא רובוט) לפני שליחה'), {
      code: 'auth/captcha-check-failed',
    });
  }
}

export async function sendOtp(
  phoneNumber: string,
  recaptchaVerifier?: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase לא זמין — לא ניתן לשלוח SMS');
  }

  const verifier = recaptchaVerifier || activeRecaptchaVerifier;
  if (!verifier) {
    throw new Error('סמן קודם את תיבת האבטחה (אני לא רובוט) למטה');
  }

  try {
    console.log('[Auth] Starting SMS send to:', phoneNumber);
    await ensureRecaptchaVerified();
    console.log('[Auth] reCAPTCHA verified, calling signInWithPhoneNumber');
    const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    const verificationId = (result as { verificationId?: string }).verificationId;
    console.log('[Auth] SMS request successful, Verification ID:', verificationId);
    if (!verificationId) {
      throw Object.assign(new Error('SMS לא נשלח — אין verificationId מ-Firebase'), {
        code: 'auth/sms-not-sent',
      });
    }
    return result;
  } catch (error: any) {
    clearRecaptcha();
    console.error('[Auth] sendOtp failed:', error.code, error.message, error);
    throw error;
  }
}
