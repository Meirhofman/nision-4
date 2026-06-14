import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Character } from './Character';
import { getFirebaseFirestore } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const TOUR_STEPS_HE = [
  {
    path: '/main',
    text: 'שלום! אני כאן לעזור לך להגיע ליעדים שלך 💪\nזה המסך הראשי שלך!',
  },
  {
    path: '/main',
    text: 'הפס הסגול מראה את ההתקדמות היומית שלך 📊\nלחץ עליו לראות את כל היעדים',
  },
  {
    path: '/workouts',
    text: 'כאן תוכל לעקוב אחרי האימונים היומיים שלך 🏃',
  },
  {
    path: '/nutrition',
    text: 'עקוב אחרי מה שאתה אוכל ושמור על תזונה מאוזנת 🥗',
  },
  {
    path: '/social',
    text: 'התחבר לחברים והצטרף לפעילויות משותפות 👥',
  },
  {
    path: '/character',
    text: 'כאן תוכל להתאים את הדמות שלך לפי הסגנון שלך 🎨',
  },
  {
    path: '/leaderboard-streak',
    text: 'שמור על רצף ימים וטפס בדירוג! 🔥',
  }
];

const TOUR_STEPS_EN = [
  {
    path: '/main',
    text: 'Hello! I\'m here to help you reach your goals 💪\nThis is your main screen!',
  },
  {
    path: '/main',
    text: 'The purple bar shows your daily progress 📊\nTap it to see all your goals',
  },
  {
    path: '/workouts',
    text: 'Track your daily workouts here 🏃',
  },
  {
    path: '/nutrition',
    text: 'Track what you eat and maintain balanced nutrition 🥗',
  },
  {
    path: '/social',
    text: 'Connect with friends and join group activities 👥',
  },
  {
    path: '/character',
    text: 'Customize your character to match your style 🎨',
  },
  {
    path: '/leaderboard-streak',
    text: 'Keep your streak and climb the rankings! 🔥',
  }
];

export const OnboardingTour = () => {
  const navigate = useNavigate();
  const { userData, updateUserData, currentUser, isRTL, language } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const TOUR_STEPS = language === 'en' ? TOUR_STEPS_EN : TOUR_STEPS_HE;

  useEffect(() => {
    if (userData && (userData.hasSeenTour === false || userData.hasSeenTour === undefined)) {
      setIsActive(true);
      setCurrentStep(0);
      navigate(TOUR_STEPS[0].path);
    }
  }, [userData?.hasSeenTour, language, navigate]);

  const finishTour = async () => {
    setIsActive(false);
    updateUserData({ hasSeenTour: true });
    
    if (currentUser?.uid) {
      const db = getFirebaseFirestore();
      if (db) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), { hasSeenTour: true }, { merge: true });
        } catch (error) {
          console.error("Error updating hasSeenTour in Firestore:", error);
        }
      }
    }
    
    navigate('/main');
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      navigate(TOUR_STEPS[nextIndex].path);
    } else {
      finishTour();
    }
  };

  if (!isActive) return null;

  const currentStepData = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-black/50 flex flex-col justify-end" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="absolute bottom-[80px] right-[20px] z-50 flex flex-col items-center animate-in slide-in-from-bottom duration-300 ease-out"
        style={{ transformOrigin: 'bottom center' }}
      >
        {/* Speech Bubble */}
        <div className="bg-white rounded-[20px] border-[0.5px] border-[#F0F0F0] px-4 py-3 max-w-[220px] shadow-lg mb-4 relative">
          <p className="text-[14px] text-gray-800 font-medium whitespace-pre-wrap text-right leading-relaxed mb-4">
            {currentStepData.text}
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mb-4" dir="ltr">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-[#534AB7]' : 'bg-[#E0E0E0]'}`} 
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button 
              onClick={finishTour}
              className="text-[#999999] text-sm font-medium hover:text-gray-600 px-2 transition-colors"
            >
              דלג
            </button>
            <button 
              onClick={nextStep}
              className="bg-[#534AB7] text-white px-4 py-1.5 rounded-[20px] text-sm font-bold shadow-md hover:bg-[#433b9c] transition-colors active:scale-95"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'בואו נתחיל! 🎉' : 'הבא'}
            </button>
          </div>

          {/* Tail */}
          <div className="absolute -bottom-[8px] right-[40px] w-4 h-4 bg-white border-b-[0.5px] border-r-[0.5px] border-[#F0F0F0] transform rotate-45" />
        </div>

        {/* Character */}
        <div className="w-32 h-32 relative flex justify-center translate-x-4">
          <div className="transform scale-[0.4] origin-top">
            <Character state={{ skin: 'blue', hat: 'none', shirt: 'none', set: 'none', accessory: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
