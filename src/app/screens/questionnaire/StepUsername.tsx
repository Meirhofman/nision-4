import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/ui';
import { User } from 'lucide-react';

export const StepUsername = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [displayName, setDisplayName] = useState<string>(userData.displayName || '');
  const [username, setUsername] = useState<string>(userData.username || '');
  const [email, setEmail] = useState<string>(userData.email || '');

  const handleNext = () => {
    updateUserData({ 
      displayName: displayName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase()
    });
    navigate('/questionnaire/password');
  };

  const isValid = displayName.trim().length >= 2 && username.trim().length >= 3 && email.trim().length >= 5 && email.includes('@');

  return (
    <QuestionLayout
      title={t('whatsYourName')}
      onNext={handleNext}
      canNext={isValid}
      showBack={true}
    >
      <div className="flex flex-col items-center w-full space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center shadow-sm">
          <User size={38} className="text-pink-400" />
        </div>

        {/* Name Inputs */}
        <div className="w-full space-y-4">
          <p className="text-sm text-gray-500 text-center">
            {t('nameWillAppear')}
          </p>
          
          {/* Display Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('displayName')}
            </label>
            <Input
              placeholder={t('enterYourName')}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-center text-lg font-bold min-h-[56px]"
              maxLength={30}
              autoFocus
            />
            {displayName.trim().length > 0 && displayName.trim().length < 2 && (
              <p className="text-xs text-red-400 text-center">
                {t('nameMinLength')}
              </p>
            )}
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('username')}
            </label>
            <Input
              placeholder={t('enterUsername')}
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
              className="text-center min-h-[48px]"
              maxLength={20}
            />
            {username.trim().length > 0 && username.trim().length < 3 && (
              <p className="text-xs text-red-400 text-center">
                {t('usernameMinLength')}
              </p>
            )}
          </div>
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t('email') || 'Email'}
            </label>
            <Input
              placeholder={t('enterEmail') || 'Enter your email'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center min-h-[48px]"
              maxLength={50}
            />
            {email.trim().length > 0 && (email.trim().length < 5 || !email.includes('@')) && (
              <p className="text-xs text-red-400 text-center">
                {t('emailInvalid') || 'Please enter a valid email'}
              </p>
            )}
          </div>
        </div>
      </div>
    </QuestionLayout>
  );
};
