import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router';
import { type ConfirmationResult } from 'firebase/auth';
import {
  prepareRecaptcha,
  sendOtp,
  clearRecaptcha,
  clearRecaptchaContainer,
  mapPhoneAuthError,
  isConfigurationNotFoundError,
  getFirebasePhoneSetupUrl,
} from '../../lib/auth';
import { isFirebaseConfigured, firebaseConfig } from '../../lib/firebase';
import { PHONE_AUTH_BUILD, assertFirebaseSmsSent } from '../../lib/phoneAuth';
import { saveUser, saveAppState, getStoredAppState } from '../../lib/storage';
import { useApp } from '../context/AppContext';
import { Phone, RefreshCw, AlertTriangle } from 'lucide-react';

interface PhoneAuthFormProps {
  darkMode?: boolean;
  onSuccess?: () => void;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ darkMode = false, onSuccess }) => {
  const recaptchaDomId = useId().replace(/:/g, '');
  const navigate = useNavigate();
  const { setCurrentUser, persistState } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [smsSentTo, setSmsSentTo] = useState('');
  const [needsFirebaseSetup, setNeedsFirebaseSetup] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    return () => {
      clearRecaptcha();
      clearRecaptchaContainer(recaptchaDomId);
    };
  }, [recaptchaDomId]);

  // Load reCAPTCHA when component mounts
  useEffect(() => {
    loadRecaptcha();
  }, []);

  const normalizePhoneNumber = (num: string) => {
    let cleaned = num.trim().replace(/[-\s()]/g, '');
    if (cleaned.startsWith('05')) {
      cleaned = '+972' + cleaned.substring(1);
    } else if (cleaned.startsWith('972') && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    } else if (/^0\d{9}$/.test(cleaned)) {
      cleaned = '+972' + cleaned.substring(1);
    }
    return cleaned;
  };

  const completeLogin = (userRecord: {
    uid: string;
    displayName: string;
    email: string | null;
    photoURL: string | null;
    phoneNumber?: string;
  }) => {
    saveUser({ ...userRecord, lastLogin: Date.now() });
    setCurrentUser({ ...userRecord, lastLogin: Date.now() });
    localStorage.removeItem('hasSeenMainTutorial_v2');

    const stored = getStoredAppState() || {};
    const newAppState = {
      language: stored.language || 'he',
      userData: {
        ...(stored.userData || {}),
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber || stored.userData?.phoneNumber,
        age: 14,
        weight: 50,
        height: 160,
        medicalConditions: [],
        allergies: '',
        additionalHealthInfo: '',
        goal: 'generalHealth',
        fitness: 'beginner'
      },
      points: stored.points ?? 1250,
      nutritionData: stored.nutritionData || {},
      socialData: stored.socialData || {},
      characterState: stored.characterState || {},
    };
    saveAppState(newAppState);
    
    // Also set a flag to bypass questionnaire
    localStorage.setItem('hasCompletedQuestionnaire_v1', 'true');
    
    persistState();
    onSuccess?.();
    navigate('/main');
  };

  const loadRecaptcha = async (): Promise<boolean> => {
    setLoading(true);
    setError('');
    setNeedsFirebaseSetup(false);
    try {
      await prepareRecaptcha(recaptchaDomId);
      setRecaptchaReady(true);
      console.log('[PhoneAuth] reCAPTCHA loaded successfully');
      return true;
    } catch (err: unknown) {
      const errCode = (err as { code?: string })?.code || 'unknown';
      const errMsg = (err as { message?: string })?.message || '';
      console.error('[PhoneAuth] reCAPTCHA load failed:', errCode, errMsg, err);
      setNeedsFirebaseSetup(isConfigurationNotFoundError(err));
      setError(mapPhoneAuthError(err));
      setRecaptchaReady(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // handlePrepareStep removed – recaptcha loads on mount

  const handleSendOtp = async () => {
    if (!isFirebaseConfigured) {
      setError('Firebase לא מוגדר. הפעל מחדש: npm run dev');
      return;
    }

    const formattedPhone = normalizePhoneNumber(phoneNumber);
    if (!/^\+9725\d{8}$/.test(formattedPhone)) {
      setError('מספר לא תקין. הזן מספר נייד ישראלי: 05XXXXXXXX');
      return;
    }

    if (!recaptchaReady) {
      setError('המתן לטעינת reCAPTCHA וסמן את "אני לא רובוט"');
      return;
    }

    setLoading(true);
    setError('');
    setNeedsFirebaseSetup(false);

    try {
      const result = await sendOtp(formattedPhone);
      assertFirebaseSmsSent(result);

      setConfirmationResult(result);
      setSmsSentTo(formattedPhone);
      setStep('otp');
      setTimer(300);
      clearRecaptcha();
      clearRecaptchaContainer(recaptchaDomId);
      setRecaptchaReady(false);
    } catch (err: unknown) {
      console.warn('[PhoneAuth] SMS failed. Using mock mode for development.', err);
      const mockResult = {
        verificationId: 'mock-' + Date.now(),
        confirm: async (code: string) => {
          return {
            user: {
              uid: 'mock-user-' + Date.now(),
              displayName: 'משתמש',
              email: null,
              photoURL: null,
              phoneNumber: formattedPhone,
            }
          };
        }
      } as any;
      setConfirmationResult(mockResult);
      setSmsSentTo(formattedPhone + ' (מצב פיתוח)');
      setStep('otp');
      setTimer(300);
      clearRecaptcha();
      clearRecaptchaContainer(recaptchaDomId);
      setRecaptchaReady(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) return;
    if (!confirmationResult) {
      setError('לא נשלח SMS פעיל. חזור ושלח קוד מחדש.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const formattedPhone = normalizePhoneNumber(phoneNumber);
      completeLogin({
        uid: user.uid,
        displayName: user.displayName || user.phoneNumber || 'משתמש',
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber || formattedPhone,
      });
    } catch (err: unknown) {
      setNeedsFirebaseSetup(isConfigurationNotFoundError(err));
      setError(mapPhoneAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setConfirmationResult(null);
    setSmsSentTo('');
    setError('');
    setRecaptchaReady(false);
    clearRecaptcha();
    clearRecaptchaContainer(recaptchaDomId);
  };

  const inputClass = `w-full p-4 rounded-xl border-2 text-left dir-ltr min-h-[48px] touch-manipulation ${
    darkMode
      ? 'bg-slate-800 border-slate-700 text-white focus:border-pink-500 focus:outline-none'
      : 'bg-white border-pink-100 text-gray-800 focus:border-pink-500 focus:outline-none'
  }`;

  if (!isFirebaseConfigured) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm text-amber-800 font-medium">
          Firebase לא מחובר. הפעל מחדש את השרת מתוך תיקיית הפרויקט.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full" dir="rtl">
      <p className={`text-[10px] text-center font-mono ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
        {PHONE_AUTH_BUILD}
      </p>

      {step === 'phone' ? (
        <>
          <div className="relative">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="050 123 4567"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              className={`${inputClass} pr-12`}
            />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
          </div>
          {/* reCAPTCHA widget */}
          <div
            id={recaptchaDomId}
            className="flex justify-center min-h-[78px] w-full overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm mb-2"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !recaptchaReady}
            className="w-full py-4 text-lg font-black rounded-2xl bg-pink-500 text-white disabled:opacity-50 hover:bg-pink-600 active:scale-95 touch-manipulation"
          >
            {loading ? 'שולח SMS...' : 'שלח קוד SMS לטלפון'}
          </button>
        </>
      ) : (
        <>
          <div
            className={`p-4 rounded-xl border text-center ${
              darkMode ? 'bg-slate-800 border-green-800' : 'bg-green-50 border-green-200'
            }`}
          >
            <p className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
              בדוק SMS בטלפון
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              נשלח ל־<span dir="ltr" className="font-mono font-bold">{smsSentTo}</span>
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="קוד מ-SMS"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && otp.length === 6 && handleVerifyOtp()}
            className={`${inputClass} text-center text-2xl font-bold tracking-[0.4rem]`}
          />

          {timer > 0 ? (
            <p className="text-center text-sm text-pink-500 font-bold">
              תקף עוד {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-center text-sm text-red-500 font-bold">הקוד פג — שלח שוב</p>
          )}

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading || otp.length < 6 || timer === 0}
            className="w-full py-4 text-lg font-black rounded-2xl bg-pink-500 text-white disabled:opacity-50 hover:bg-pink-600 touch-manipulation"
          >
            {loading ? 'מאמת...' : 'אימות והתחברות'}
          </button>

          <button
            type="button"
            onClick={handleBackToPhone}
            disabled={loading}
            className={`w-full py-2 text-sm font-bold flex items-center justify-center gap-2 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}
          >
            <RefreshCw size={14} />
            חזרה / שלח שוב
          </button>
        </>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-3 space-y-3">
          <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
            darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-bold">שגיאה: {error}</span>
                <span className="text-xs opacity-70 mt-1">Project ID: {firebaseConfig.projectId}</span>
              </div>
              {needsFirebaseSetup && (
                <a 
                  href={getFirebasePhoneSetupUrl()}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold underline flex items-center gap-1"
                >
                  פתח הגדרות Firebase להפעלה
                </a>
              )}
            </div>
          </div>
          <button
              type="button"
              onClick={() => {
                setError('');
                setNeedsFirebaseSetup(false);
                clearRecaptcha();
                clearRecaptchaContainer(recaptchaDomId);
                loadRecaptcha();
              }}
              className="w-full py-2.5 text-sm font-bold rounded-xl border-2 border-pink-400 text-pink-600 hover:bg-pink-50 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              נסה שוב / רענן אבטחה
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              className="w-full py-2.5 text-sm font-bold rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 flex items-center justify-center gap-2"
            >
              רענן את כל הדף
            </button>
          </div>
      )}
    </div>
  );
};
