import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuestionLayout } from './QuestionLayout';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../../components/ui';

const DISEASE_OPTIONS = ['diabetes', 'heartDisease', 'hypertension', 'asthma', 'thyroid', 'celiac', 'none'];

export const StepHealth = () => {
  const navigate = useNavigate();
  const { t, updateUserData, userData } = useApp();
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(userData.medicalConditions || []);
  const [allergies, setAllergies] = useState<string>(userData.allergies || '');
  const [additionalInfo, setAdditionalInfo] = useState<string>(userData.additionalHealthInfo || '');

  const toggleDisease = (key: string) => {
    if (key === 'none') {
      setSelectedDiseases(['none']);
      return;
    }
    setSelectedDiseases((prev) => {
      const withoutNone = prev.filter((x) => x !== 'none');
      if (prev.includes(key)) {
        return withoutNone.filter((x) => x !== key);
      }
      return [...withoutNone, key];
    });
  };

  const handleNext = () => {
    updateUserData({
      medicalConditions: selectedDiseases,
      allergies: allergies.trim(),
      additionalHealthInfo: additionalInfo.trim(),
    });
    navigate('/questionnaire/goal');
  };

  return (
    <QuestionLayout
      title={t('healthQuestion')}
      onNext={handleNext}
      canNext={true}
      showBack={true}
    >
      <div className="flex flex-col w-full space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{t('diseasesQuestion')}</p>
          <div className="flex flex-wrap gap-2">
            {DISEASE_OPTIONS.map((key) => (
              <Button
                key={key}
                variant={selectedDiseases.includes(key) ? 'primary' : 'secondary'}
                onClick={() => toggleDisease(key)}
                className="h-10"
              >
                {t(key)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">{t('allergiesQuestion')}</label>
          <Input
            placeholder={t('allergiesPlaceholder')}
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">{t('additionalHealthInfo')}</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder={t('additionalHealthPlaceholder')}
            className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c1f5c1]"
            rows={4}
          />
        </div>
      </div>
    </QuestionLayout>
  );
};
