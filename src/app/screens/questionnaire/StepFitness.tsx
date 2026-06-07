import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui';

export const StepFitness = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [selectedFitness, setSelectedFitness] = useState<string | null>(userData.fitness || null);

  const levels = ['noBackground', 'beginner', 'intermediate', 'advanced'];

  const handleNext = () => {
    if (selectedFitness) {
      updateUserData({ fitness: selectedFitness });
      navigate('/questionnaire/complete');
    }
  };

  return (
    <QuestionLayout
      title={t('fitnessQuestion')}
      onNext={handleNext}
      canNext={!!selectedFitness}
      showBack={true}
    >
      <div className="flex flex-col w-full space-y-2">
        {levels.map((level) => (
          <Button
            key={level}
            variant={selectedFitness === level ? 'primary' : 'secondary'}
            onClick={() => {
              setSelectedFitness(level);
              updateUserData({ fitness: level });
            }}
            className="h-12 text-lg font-medium"
            fullWidth
          >
            {t(level)}
          </Button>
        ))}
      </div>
    </QuestionLayout>
  );
};
