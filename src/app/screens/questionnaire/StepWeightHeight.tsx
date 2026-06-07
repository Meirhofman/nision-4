import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { NumberInput } from '../../components/NumberInput';

export const StepWeightHeight = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [weight, setWeight] = useState<number>(userData.weight || 50);
  const [height, setHeight] = useState<number>(userData.height || 160);

  const handleNext = () => {
    updateUserData({ weight, height });
    navigate('/questionnaire/health');
  };

  return (
    <QuestionLayout 
      title={t('weightHeightQuestion')} 
      onNext={handleNext}
      canNext={weight > 0 && height > 0}
      showBack={true}
    >
      <div className="flex flex-col items-center justify-center space-y-4 w-full">
        <NumberInput 
          value={weight} 
          onChange={setWeight} 
          min={20} 
          max={150} 
          label={t('weight')} 
          suffix={t('kg')} 
        />
        <NumberInput 
          value={height} 
          onChange={setHeight} 
          min={100} 
          max={220} 
          label={t('height')} 
          suffix={t('cm')} 
        />
      </div>
    </QuestionLayout>
  );
};
