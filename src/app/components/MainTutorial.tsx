import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Character } from './Character';

interface TutorialStep {
  title: string;
  description: string;
  target: string;
}

export const MainTutorial = () => {
  const { t, hasSeenMainTutorial, setHasSeenMainTutorial } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(!hasSeenMainTutorial);

  const tutorialSteps: TutorialStep[] = [
    {
      title: t('tutorialTitle1'),
      description: t('tutorialDesc1'),
      target: "character"
    },
    {
      title: t('tutorialTitle2'),
      description: t('tutorialDesc2'),
      target: "character"
    },
    {
      title: t('tutorialTitle3'),
      description: t('tutorialDesc3'),
      target: "buttons"
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHasSeenMainTutorial(true);
    setIsVisible(false);
  };

  const handleClose = () => {
    setHasSeenMainTutorial(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Character */}
          <div className="flex justify-center mb-6">
            <Character 
              state={{
                skin: 'blue',
                hat: 'none',
                shirt: 'none',
                set: 'none',
                accessory: 'none',
                hatPos: { x: 0, y: 0 },
                shirtPos: { x: 0, y: 0 },
                setPos: { x: 0, y: 0 },
                accessoryPos: { x: 0, y: 0 },
              }}
              size="sm"
            />
          </div>

          {/* Tutorial content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {currentTutorial.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentTutorial.description}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-6 space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              {currentStep === tutorialSteps.length - 1 ? t('tutorialGotIt') : t('nextBtn')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
