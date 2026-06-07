import React from 'react';
import { motion, Variants, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { Settings, Award, Utensils, Users, Dumbbell } from 'lucide-react';
import { Character } from '../components/Character';
import { CLOTHING_ITEMS } from './CharacterScreen';

export const MainScreen = () => {
  const { t, points, characterState, currentUser, userData, language, darkMode } = useApp();
  const navigate = useNavigate();

  const [showTutorial, setShowTutorial] = React.useState(false);
  const [tutorialStep, setTutorialStep] = React.useState(0);

  React.useEffect(() => {
    // Check if user has completed the questionnaire OR if bypass flag is set
    const hasBypassFlag = localStorage.getItem('hasCompletedQuestionnaire_v1');
    const hasCompletedQuestionnaire = userData?.goal && userData?.fitness && 
      (userData?.medicalConditions || userData?.allergies !== undefined);
    
    console.log('=== MAIN SCREEN DEBUG ===');
    console.log('hasBypassFlag:', hasBypassFlag);
    console.log('userData:', userData);
    console.log('hasCompletedQuestionnaire:', hasCompletedQuestionnaire);
    console.log('goal:', userData?.goal);
    console.log('fitness:', userData?.fitness);
    console.log('==========================');
    
    if (!hasCompletedQuestionnaire && !hasBypassFlag) {
      // Redirect to questionnaire if not completed and no bypass flag
      navigate('/questionnaire/language');
      return;
    }

    const hasSeenTutorial = localStorage.getItem('hasSeenMainTutorial_v2');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [userData, navigate]);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenMainTutorial_v2', 'true');
  };

  const tutorialSteps = [
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

  const floatingVariant: Variants = {
    animate: (custom: number) => ({
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: custom * 0.4,
      },
    }),
  };

  const isRTL = language === 'he';

  return (
    <MobileContainer className={`min-h-[100dvh] overflow-hidden flex flex-col relative ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50/40 to-purple-50/20'}`}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {!darkMode ? (
          <>
            <div className="absolute top-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </>
        ) : (
          <>
            <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center z-20 px-5 pt-8 mb-3 animate-slide-up">
        <button
          onClick={() => navigate('/settings')}
          className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 shadow-md ${darkMode ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white/70 backdrop-blur-xl border border-white/60 hover:bg-white/80 hover:shadow-lg animate-glow-pulse group'}`}
        >
          <Settings className={`w-7 h-7 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700 group-hover:text-gray-800'}`} />
        </button>

        <button
          onClick={() => navigate('/points')}
          className={`flex items-center gap-3 px-6 py-3 rounded-3xl active:scale-95 transition-all duration-200 shadow-md ${darkMode ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white border border-gray-100 hover:shadow-lg hover:border-amber-200 hover:bg-amber-50/50 group'}`}
        >
          <Award className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
          <span className={`text-xl font-bold transition-colors ${darkMode ? 'text-slate-100' : 'text-gray-700 group-hover:text-amber-700'}`}>
            {points}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-sm mx-auto flex flex-col h-full px-5 relative z-10 pt-4 pb-6">

        {/* Welcome Text */}
        <div className="text-center mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {(userData?.displayName || currentUser?.displayName)
              ? t('welcomeBackUser').replace('{name}', (userData?.displayName || currentUser?.displayName || '').split(' ')[0])
              : (t('welcomeBack') || "ברוך שובך!")}
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('readyForGoals') || "טוב לראות אותך"}
          </p>
        </div>

        {/* Character Area */}
        <motion.div
          custom={1.5}
          variants={floatingVariant}
          animate="animate"
          className="flex flex-col items-center justify-center py-4 animate-slide-up cursor-pointer group"
          style={{ animationDelay: "0.2s" }}
          onClick={() => navigate('/character')}
        >
          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-3 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700"
          >
            <p className={`text-center font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              לחצו עליי ותגלו! ✨
            </p>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 ${darkMode ? 'border-t-slate-800' : 'border-t-white'}`} />
          </motion.div>
          
          <div className="relative">
            <div className="drop-shadow-2xl animate-float pointer-events-none mt-[-5px] transition-transform duration-300 group-hover:scale-105">
              <Character 
                state={characterState} 
                width={320} 
                clothingImages={{
                  shirt: CLOTHING_ITEMS.find(item => item.id === characterState.shirt)?.image,
                  set: CLOTHING_ITEMS.find(item => item.id === characterState.set)?.image,
                  hat: CLOTHING_ITEMS.find(item => item.id === characterState.hat)?.image,
                  accessory: CLOTHING_ITEMS.find(item => item.id === characterState.accessory)?.image,
                }}
              />
            </div>
            
            {/* Glow effect behind character */}
            <div className={`absolute inset-0 rounded-full blur-3xl -z-10 ${!darkMode ? 'bg-gradient-to-t from-blue-300/20 to-purple-300/20' : 'bg-gradient-to-t from-blue-600/15 to-purple-600/15'}`} />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 pb-5 animate-slide-up w-full mt-2" style={{ animationDelay: "0.3s" }}>
          {/* Nutrition */}
          <button 
            onClick={() => navigate('/nutrition')}
            className={`flex flex-col items-center gap-2 py-5 px-1 rounded-3xl transition-all duration-300 shadow-md group ${darkMode ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white border border-gray-100 hover:shadow-lg hover:border-emerald-200 hover:bg-emerald-50/50'}`}
          >
            <Utensils className={`w-10 h-10 transition-transform group-hover:scale-110 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            <span className={`text-sm font-semibold transition-colors ${darkMode ? 'text-slate-300' : 'text-gray-700 group-hover:text-emerald-700'}`}>
              {t('nutrition')}
            </span>
          </button>

          {/* Workouts */}
          <button 
            onClick={() => navigate('/workouts')}
            className={`flex flex-col items-center gap-2 py-5 px-1 rounded-3xl transition-all duration-300 shadow-md group ${darkMode ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white border border-gray-100 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/50'}`}
          >
            <Dumbbell className={`w-10 h-10 transition-transform group-hover:scale-110 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <span className={`text-sm font-semibold transition-colors ${darkMode ? 'text-slate-300' : 'text-gray-700 group-hover:text-blue-700'}`}>
              {t('workouts')}
            </span>
          </button>

          {/* Social */}
          <button 
            onClick={() => navigate('/social')}
            className={`flex flex-col items-center gap-2 py-5 px-1 rounded-3xl transition-all duration-300 shadow-md group ${darkMode ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white border border-gray-100 hover:shadow-lg hover:border-purple-200 hover:bg-purple-50/50'}`}
          >
            <Users className={`w-10 h-10 transition-transform group-hover:scale-110 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            <span className={`text-sm font-semibold transition-colors ${darkMode ? 'text-slate-300' : 'text-gray-700 group-hover:text-purple-700'}`}>
              {t('social')}
            </span>
          </button>
        </div>

        {/* Tutorial Overlay — responds to selected language */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className={`rounded-[2rem] p-8 shadow-2xl text-center max-w-sm w-full ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="text-5xl mb-4">
                  {tutorialStep === 0 ? '👋' : tutorialStep === 1 ? '👤' : '🛠️'}
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                  {tutorialSteps[tutorialStep].title}
                </h3>
                <p className={`mb-8 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {tutorialSteps[tutorialStep].description}
                </p>

                <div className="flex gap-3">
                  {tutorialStep > 0 && (
                    <button
                      onClick={() => setTutorialStep(prev => prev - 1)}
                      className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-500 font-bold"
                    >
                      {t('back')}
                    </button>
                  )}
                  {tutorialStep < tutorialSteps.length - 1 ? (
                    <button
                      onClick={() => setTutorialStep(prev => prev + 1)}
                      className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold shadow-lg"
                    >
                      {t('continue')}
                    </button>
                  ) : (
                    <button
                      onClick={handleTutorialComplete}
                      className="flex-[2] py-4 rounded-xl bg-green-500 text-white font-bold shadow-lg"
                    >
                      {t('tutorialGotIt')}
                    </button>
                  )}
                </div>

                {/* Steps Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {tutorialSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === tutorialStep ? 'w-6 bg-pink-500' : 'w-1.5 bg-gray-200'}`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  );
};