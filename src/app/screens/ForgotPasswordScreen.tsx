import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { Button, Input } from '../components/ui';
import { Character } from '../components/Character';
import { useApp } from '../context/AppContext';
import { getStoredAppState, saveAppState } from '../../lib/storage';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

export const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const { t, characterState } = useApp();
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerifyUsername = () => {
    setError(null);
    const storedState = getStoredAppState();
    
    if (!storedState?.userData?.username) {
      setError('לא נמצא משתמש רשום במערכת');
      return;
    }

    if (username.trim().toLowerCase() !== storedState.userData.username.toLowerCase()) {
      setError('שם המשתמש לא נמצא במערכת');
      return;
    }

    setStep('reset');
  };

  const handleResetPassword = () => {
    setError(null);

    if (newPassword.length < 4) {
      setError('הסיסמה חייבת להכיל לפחות 4 תווים');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    const storedState = getStoredAppState();
    if (storedState) {
      saveAppState({
        ...storedState,
        userData: {
          ...storedState.userData,
          password: newPassword
        }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <MobileContainer className="">
      <div className="flex-1 w-full h-full p-4 sm:p-5 flex flex-col justify-start pt-6 sm:pt-10 space-y-4 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors z-10"
          aria-label="Back to login"
        >
          <ArrowRight size={24} />
        </button>

      <div className="flex flex-col items-center justify-center space-y-1 min-h-[120px] sm:min-h-[140px]">
        <Character state={characterState} size="md" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">LAZOZ</h1>
      </div>

      <div className="w-full max-w-sm mx-auto space-y-4">
        {step === 'verify' ? (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-gray-800">שחזור סיסמה</h2>
              <p className="text-sm text-gray-600">הכנס את שם המשתמש כדי לאמת את זהותך</p>
            </div>

            <div className="space-y-3">
              <Input 
                placeholder="שם משתמש" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyUsername()}
                className="min-h-[48px] touch-manipulation" 
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleVerifyUsername} 
                disabled={!username.trim()}
                fullWidth 
                className="min-h-[48px] touch-manipulation"
              >
                אמת זהות <ArrowRight size={16} className="mr-2" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-gray-800">הגדרת סיסמה חדשה</h2>
              <p className="text-sm text-gray-600">עבור משתמש: {username}</p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input 
                  placeholder="סיסמה חדשה" 
                  type={showPassword ? 'text' : 'password'} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="min-h-[48px] touch-manipulation pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <Input 
                  placeholder="אימות סיסמה חדשה" 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                  className="min-h-[48px] touch-manipulation pr-12" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <p className="text-sm text-green-600 text-center font-medium">הסיסמה שונתה בהצלחה!</p>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleResetPassword} 
                disabled={!newPassword || !confirmPassword || success}
                fullWidth 
                className="min-h-[48px] touch-manipulation"
              >
                {success ? '✓ סיסמה עודכנה' : 'עדכן סיסמה'}
              </Button>
            </div>
          </>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-700 font-medium touch-manipulation py-2 transition-colors"
        >
          חזרה להתחברות
        </button>
      </div>
      </div>
    </MobileContainer>
  );
};
