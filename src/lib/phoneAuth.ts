import type { ConfirmationResult } from 'firebase/auth';
import { firebaseConfig } from './firebase';

/** מזהה גרסה — אם לא רואים "v4" במסך, הדפדפן טוען קוד ישן */
export const PHONE_AUTH_BUILD = 'v4-real-sms-2026-05-26';

export const FIREBASE_CONSOLE_AUTH_URL =
  `https://console.firebase.google.com/project/${firebaseConfig.projectId || 'lazoz-app'}/authentication/providers`;

export const FIREBASE_CONSOLE_AUTH_HOME =
  `https://console.firebase.google.com/project/${firebaseConfig.projectId || 'lazoz-app'}/authentication`;

/** וידוא ש-Firebase באמת שלח בקשת SMS (לא דמו) */
export function assertFirebaseSmsSent(result: ConfirmationResult): void {
  const verificationId = (result as { verificationId?: string }).verificationId;
  if (!verificationId || typeof verificationId !== 'string' || verificationId.length < 10) {
    throw Object.assign(new Error('Firebase לא אישר שליחת SMS'), {
      code: 'auth/sms-not-sent',
    });
  }
}
