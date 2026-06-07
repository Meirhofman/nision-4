import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../../components/ui';

export const StepGoal = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(userData.goal || null);
  const [otherGoal, setOtherGoal] = useState<string>('');

  const goals = [
    'loseWeight',
    'buildMuscle',
    'improveEndurance',
    'flexibility',
    'generalHealth',
    'funPlay',
  ];

  const handleNext = () => {
    const goal = selectedGoal === 'other' ? otherGoal : selectedGoal;
    if (goal) {
      updateUserData({ goal });
      navigate('/questionnaire/fitness');
    }
  };

  return (
    <QuestionLayout
      title={t('goalQuestion')}
      onNext={handleNext}
      canNext={!!selectedGoal && (selectedGoal !== 'other' || otherGoal.length > 0)}
      showBack={true}
    >
      <div className="flex flex-col w-full space-y-2">
        {goals.map((goalKey) => (
          <Button
            key={goalKey}
            variant={selectedGoal === goalKey ? 'primary' : 'secondary'}
            onClick={() => {
              setSelectedGoal(goalKey);
              updateUserData({ goal: goalKey });
              setTimeout(() => navigate('/questionnaire/fitness'), 300);
            }}
            className="h-10 justify-start text-left px-4"
            fullWidth
          >
            {t(goalKey)}
          </Button>
        ))}

        <Button
          variant={selectedGoal === 'other' ? 'primary' : 'secondary'}
          onClick={() => setSelectedGoal('other')}
          className="h-10 justify-start text-left px-4"
          fullWidth
        >
          {t('other')}
        </Button>

        {selectedGoal === 'other' && (
          <Input
            placeholder={t('enterGoal')}
            value={otherGoal}
            onChange={(e) => setOtherGoal(e.target.value)}
          />
        )}
      </div>
    </QuestionLayout>
  );
};
