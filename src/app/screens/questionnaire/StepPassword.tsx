import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/ui';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const StepPassword = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = () => {
    updateUserData({ password: password });
    navigate('/questionnaire/gender');
  };

  const isValid = password.length >= 6 && password === confirmPassword;

  return (
    <QuestionLayout
      title={t('createPassword')}
      onNext={handleNext}
      canNext={isValid}
      showBack={true}
    >
      <div className="flex flex-col items-center w-full space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center shadow-sm">
          <Lock size={38} className="text-blue-400" />
        </div>

        {/* Password Inputs */}
        <div className="w-full space-y-4">
          <p className="text-sm text-gray-500 text-center">
            {t('passwordWillBeRemembered')}
          </p>
          
          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('enterPassword')}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
                maxLength={50}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-red-400">
                {t('passwordMinLength')}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('confirmPassword')}
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-12"
                maxLength={50}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="text-xs text-red-400">
                {t('passwordsDoNotMatch')}
              </p>
            )}
          </div>
        </div>
      </div>
    </QuestionLayout>
  );
};
