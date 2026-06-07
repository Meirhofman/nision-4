import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui';

export const StepGender = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(userData.gender || null);

  const handleNext = () => {
    if (selectedGender) {
      updateUserData({ gender: selectedGender });
      navigate('/questionnaire/age');
    }
  };

  const handleSelectGender = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    updateUserData({ gender });
    setTimeout(() => {
      navigate('/questionnaire/age');
    }, 300);
  };

  return (
    <QuestionLayout
      title={t('genderQuestion')}
      onNext={handleNext}
      canNext={!!selectedGender}
      showBack={false}
    >
      <div className="flex flex-col w-full space-y-4">
        <Button
          variant={selectedGender === 'male' ? 'primary' : 'secondary'}
          onClick={() => handleSelectGender('male')}
          className="h-20 text-xl font-medium"
          fullWidth
        >
          {t('male')}
        </Button>
        <Button
          variant={selectedGender === 'female' ? 'primary' : 'secondary'}
          onClick={() => handleSelectGender('female')}
          className="h-20 text-xl font-medium"
          fullWidth
        >
          {t('female')}
        </Button>
      </div>
    </QuestionLayout>
  );
};
