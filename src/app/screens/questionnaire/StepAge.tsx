import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { NumberInput } from '../../components/NumberInput';

export const StepAge = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [age, setAge] = useState<number>(userData.age || 13);

  // Get gender-specific age question
  const getAgeQuestion = () => {
    if (userData.gender === 'male') {
      return t('ageQuestionMale');
    } else if (userData.gender === 'female') {
      return t('ageQuestionFemale');
    }
    return t('ageQuestion'); // fallback
  };

  const handleNext = () => {
    updateUserData({ age });
    navigate('/questionnaire/weight-height');
  };

  return (
    <QuestionLayout 
      title={getAgeQuestion()} 
      onNext={handleNext}
      canNext={age >= 13}
      showBack={true}
    >
      <div className="flex flex-col items-center justify-center space-y-4 w-full">
        <NumberInput 
          value={age} 
          onChange={setAge} 
          min={13} 
          max={20} 
          label={getAgeQuestion()} 
          suffix={t('yearsOld')} 
        />
      </div>
    </QuestionLayout>
  );
};
