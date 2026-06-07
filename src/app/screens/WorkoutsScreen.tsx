import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronDown, Clock, Footprints, MapPin, Play, History, Calendar, Share2, BarChart2, ChevronUp, ChevronLeft, ChevronRight, Star, X, Sparkles } from 'lucide-react';
import { Button } from '../components/ui';
import { showToast } from '../components/ui/toast';

const ProgressStar = ({ percentage }: { percentage: number }) => {
  const [currentFill, setCurrentFill] = useState(0);

  useEffect(() => {
    // Animate from 0 to percentage
    const timer = setTimeout(() => {
      setCurrentFill(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        <defs>
          <linearGradient id="starGradient" x1="0" x2="0" y1="1" y2="0">
            <stop offset={`${currentFill}%`} stopColor="#fbbf24" />
            <stop offset={`${currentFill}%`} stopColor="#e5e7eb" />
          </linearGradient>
          <clipPath id="starClip">
            <path d="M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39L50 0Z" />
          </clipPath>
        </defs>

        {/* Background Star (Stroke) */}
        <path
          d="M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39L50 0Z"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Filled Star */}
        <path
          d="M50 0L61 35H98L68 57L79 91L50 70L21 91L32 57L2 35H39L50 0Z"
          fill="url(#starGradient)"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinejoin="round"
          className="transition-all duration-[2000ms] ease-out"
        />
      </svg>
    </div>
  );
};

export const WorkoutsScreen = () => {
  const navigate = useNavigate();
  const { t, isRTL, userData, points, darkMode, updateUserData, addWorkoutToHistory } = useApp();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showDailyGoalModal, setShowDailyGoalModal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(userData?.dailyStepsGoal || 8000);
  const suggestedType = (() => {
    const g = userData?.goal;
    if (g === 'loseWeight') return 'הליכה';
    if (g === 'buildMuscle') return 'אימון כוח';
    if (g === 'improveEndurance') return 'ריצה';
    if (g === 'flexibility') return 'יוגה';
    return 'הליכה';
  })();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [workoutType, setWorkoutType] = useState(suggestedType);
  const [progress, setProgress] = useState(60);
  const [showWorkoutStartModal, setShowWorkoutStartModal] = useState(false);
  const [showWorkoutEntryModal, setShowWorkoutEntryModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    type: suggestedType,
    duration: '',
    distance: '',
    speed: '',
    weight: '',
    setsOrReps: ''
  });
  const [scheduleForm, setScheduleForm] = useState({
    type: suggestedType,
    date: '',
    time: ''
  });

  // Check if first time visiting workout screen
  React.useEffect(() => {
    const hasSeenWorkoutTutorial = localStorage.getItem('hasSeenWorkoutTutorial');
    if (!hasSeenWorkoutTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const tutorialSteps = [
    {
      title: "ברוכים הבאים למרכז האימונים! 💪",
      description: "כאן תוכלו לעקוב אחר האימונים שלכם, לצפות בסיכומים ולראות את ההיסטוריה שלכם.",
      bullets: [
        "עקוב אחר אימונים בזמן אמת",
        "צפה בסיכומי אימונים מפורטים",
        "גש להיסטוריית האימונים המלאה שלך",
        "קבע אימונים וקבל תזכורות"
      ]
    },
    {
      title: "התחל אימון חדש 🏃‍♂️",
      description: "לחץ על כפתור 'התחל אימון' כדי להתחיל לעקוב אחר הפעילות שלך.",
      bullets: [
        "בחר סוג אימון מתוך רשימה",
        "עקוב אחר זמן, מרחק וקלוריות",
        "קבל סיכום מפורט בסיום",
        "שמור אוטומטית להיסטוריה"
      ]
    },
    {
      title: "סידור אימונים ותזכורות ⏰",
      description: "קבע אימונים מראש וקבל תזכורות כדי לא לפספס אף אימון מתוכנן.",
      bullets: [
        "בחר סוג אימון, תאריך ושעה",
        "קבל תזכורת אוטומטית",
        "נהל אימונים מתוכננים",
        "עקוב אחר היעדים שלך"
      ]
    },
    {
      title: "עוזר AI אישי 🤖",
      description: "קבל המלצות אימונים מותאמות אישית מהעוזר המתקדם שלנו.",
      bullets: [
        "המלצות לפי המטרות שלך",
        "תכנונים מותאמים לגיל ומשקל",
        "מגוון סוגי אימונים",
        "שיפור ביצועים מתמשך"
      ]
    }
  ];

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenWorkoutTutorial', 'true');
    setShowDailyGoalModal(true);
  };

  const handleDailyGoalSave = () => {
    updateUserData({ dailyStepsGoal: dailyGoal });
    setShowDailyGoalModal(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'האימון שלי 🏃‍♂️',
      text: `היום עשיתי ${progress}% מהיעד שלי! הצטרפו אליי לאימון ${workoutType} 🎯\n\nסטטוס: ${progress > 80 ? 'מצוין! 💪' : progress > 50 ? 'טוב מאוד! 👍' : 'ממשיכים בעבודה! 💪'}\n\n#כושר #אימון #LAZOZ`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const fullText = `${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(fullText);
        showToast('הקישור הועתק ללוח! שתף אותו עם חברים 🔥', 'success');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Try alternative method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text}\n${shareData.url}`;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('הקישור הועתק ללוח! שתף אותו עם חברים 🔥');
      } catch (fallbackError) {
        showToast('לא היה ניתן לשתף. נסה שוב מאוחר יותר.', 'error');
      }
    }
  };

  const workoutTypes = [
    'הליכה', 'ריצה', 'רכיבה על אופניים', 'יוגה', 'שחייה', 'ריקוד',
    'פילאטיס', 'HIIT', 'אימון כוח', 'טיולים', 'קיקבוקסינג', 'קפיצה בחבל',
    'אליפטיקל', 'חתירה', 'מתיחות'
  ];

  return (
    <MobileContainer className="min-h-screen relative flex flex-col"
    >
      {/* Header */}
      <div className="p-4 pb-0 relative">
        <button
          onClick={() => navigate('/main')}
          className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full text-gray-600 shadow-sm border border-gray-200 z-10 rtl:left-auto rtl:right-6"
        >
          {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <div className="flex items-center justify-between mb-4 pt-2">
          <div></div>
          <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>מרכז האימונים</p>
          <div
            onClick={() => navigate('/points')}
            className={`flex items-center rounded-full px-3 py-1.5 shadow-lg space-x-2 border cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
          >
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span className={`font-black text-sm ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>{points}</span>
          </div>
        </div>

        <div className="space-y-1 mt-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">מה עושים היום?</p>
          <button
            onClick={() => setShowTypeModal(true)}
            className="w-full bg-gray-50 rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 group active:scale-95 transition-all"
          >
            <span className="font-black text-xl text-gray-800 tracking-tight">{workoutType}</span>
            <div className="bg-orange-100 p-2 rounded-xl group-hover:rotate-180 transition-transform">
              <ChevronDown className="text-orange-600" size={24} />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden pt-2">

        {/* Star Progress - no background per request */}
        <div className="flex flex-col items-center justify-center p-4 rounded-[2.5rem] w-full">
          <ProgressStar percentage={68} />
          <div className="text-center mt-2">
            <h2 className={`text-5xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-gray-800'}`}>5,420</h2>
            <p className={`font-bold mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('stepsOf')} {dailyGoal.toLocaleString()} {t('steps')}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="bg-[#FCE7F3] rounded-3xl p-4 flex flex-col items-center justify-center space-y-1 shadow-md border border-pink-100">
            <Clock size={24} className="text-pink-600 mb-1" />
            <span className={`text-xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-gray-800'}`}>24m</span>
            <span className={`text-[10px] font-black uppercase ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>זמן פעילות</span>
          </div>
          <div className="bg-[#DCFCE7] rounded-3xl p-4 flex flex-col items-center justify-center space-y-1 shadow-md border border-green-100">
            <Footprints size={24} className="text-green-600 mb-1" />
            <span className={`text-xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-gray-800'}`}>5,420</span>
            <span className={`text-[10px] font-black uppercase ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>צעדים</span>
          </div>
          <div className="bg-[#FCE7F3] rounded-3xl p-4 flex flex-col items-center justify-center space-y-1 shadow-md border border-pink-100">
            <MapPin size={24} className="text-pink-600 mb-1" />
            <span className={`text-xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-gray-800'}`}>3.2</span>
            <span className={`text-[10px] font-black uppercase ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>מרחק (ק״מ)</span>
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={() => setShowWorkoutStartModal(true)}
          className="w-full h-20 bg-[#FCE7F3] text-pink-600 rounded-3xl shadow-lg flex flex-row items-center justify-center gap-3 active:scale-95 transition-all border-4 border-pink-100"
        >
          <div className="bg-pink-500 p-2 rounded-full text-white shadow-md">
            <Play fill="currentColor" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight">התחל אימון {workoutType}</span>
        </Button>

        {/* Grid Options */}
        <div className="grid grid-cols-2 gap-3 w-full pb-20">
          <button onClick={() => navigate('/history')} className="bg-[#FCE7F3] p-5 rounded-3xl shadow-md border border-pink-100 flex flex-col items-center justify-center gap-2 h-24 hover:bg-pink-200 transition-all group">
            <History className="text-pink-600 group-hover:rotate-12 transition-transform" size={28} />
            <span className="text-xs font-black text-pink-700">היסטוריית אימונים</span>
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#DCFCE7] p-5 rounded-3xl shadow-md border border-green-100 flex flex-col items-center justify-center gap-2 h-24 hover:bg-green-200 transition-all group"
          >
            <Calendar className="text-green-600 group-hover:rotate-12 transition-transform" size={28} />
            <span className="text-xs font-black text-green-700">קבע אימון</span>
          </button>
          <button onClick={handleShare} className="bg-[#FCE7F3] p-5 rounded-3xl shadow-md border border-pink-100 flex flex-col items-center justify-center gap-2 h-24 hover:bg-pink-200 transition-all group" title={t('shareWithFriends')}>
            <Share2 className="text-pink-600 group-hover:rotate-12 transition-transform" size={28} />
            <span className="text-xs font-black text-pink-700">{t('shareWithFriends')}</span>
          </button>
          <button onClick={() => navigate('/summary')} className="bg-[#DCFCE7] p-5 rounded-3xl shadow-md border border-green-100 flex flex-col items-center justify-center gap-2 h-24 hover:bg-green-200 transition-all group">
            <BarChart2 className="text-green-600 group-hover:rotate-12 transition-transform" size={28} />
            <span className="text-xs font-black text-green-700">סיכום ביצועים</span>
          </button>
        </div>
        
        {/* AI Assistant Button */}
        <div className="w-full pb-4">
          <button 
            onClick={() => setShowAIModal(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-3xl shadow-lg flex flex-row items-center justify-center gap-3 active:scale-95 transition-all border-4 border-purple-100"
          >
            <div className="bg-white p-2 rounded-full text-purple-500 shadow-md">
              <Sparkles size={20} />
            </div>
            <span className="text-lg font-bold">עוזר AI אישי</span>
          </button>
        </div>
      </div>


      {/* Workout Type Modal */}
      <AnimatePresence>
        {showTypeModal && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTypeModal(false)}
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          />
        )}
        {showTypeModal && (
          <motion.div
            key="modal"
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            className="absolute top-[120px] left-6 right-6 bg-white rounded-2xl z-50 shadow-xl border border-gray-100 overflow-hidden max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-col">
              {workoutTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setWorkoutType(type);
                    setShowTypeModal(false);
                  }}
                  className={`p-4 text-left font-medium hover:bg-pink-50 transition-colors ${workoutType === type ? 'bg-pink-50 text-pink-600' : 'text-gray-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTutorial(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-[#FFF0F3] rounded-3xl z-50 shadow-2xl flex flex-col max-w-sm mx-auto overflow-hidden border border-white/50"
            >
              <button
                onClick={handleTutorialComplete}
                className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
              
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-6 mt-6">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${index === tutorialStep ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
                      }`}
                  />
                ))}
              </div>

              <div className="text-center mb-6 px-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Footprints className="text-purple-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {tutorialSteps[tutorialStep].title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {tutorialSteps[tutorialStep].description}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right mx-6">
                <ul className="space-y-2 text-sm text-gray-700">
                  {tutorialSteps[tutorialStep].bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {bullet && <span className="text-purple-500 mt-1">•</span>}
                      <span className={bullet ? '' : 'font-bold text-purple-700'}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-100">
                {tutorialStep < tutorialSteps.length - 1 ? (
                  <>
                    <button
                      onClick={() => setTutorialStep(tutorialStep + 1)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      ← הבא
                    </button>
                    <button
                      onClick={handleTutorialComplete}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                      דלג על ההדרכה
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleTutorialComplete}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    בוא נתחיל! 🚀
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Daily Goal Modal */}
      <AnimatePresence>
        {showDailyGoalModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDailyGoalModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-white rounded-3xl z-50 shadow-2xl flex flex-col max-w-md mx-auto overflow-hidden"
            >
              <div className="flex-1 p-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    קבע יעד צעדים יומי 🎯
                  </h2>
                  <p className="text-gray-600">
                    בחר כמה צעדים תרצה ללכת מדי יום
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      יעד צעדים יומי
                    </label>
                    <input
                      type="number"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 8000)}
                      className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                      min="1000"
                      max="50000"
                      step="1000"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      הצעדים שלך: 5,420 מתוך {dailyGoal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={handleDailyGoalSave}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  שמור יעד
                </button>
                <button
                  onClick={() => setShowDailyGoalModal(false)}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  דלג
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Workout Start Modal */}
      <AnimatePresence>
        {showWorkoutStartModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkoutStartModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-white rounded-3xl z-50 shadow-2xl flex flex-col max-w-md mx-auto overflow-hidden"
            >
              <div className="flex-1 p-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t('workoutType')}
                  </h2>
                  <p className="text-gray-600">
                    בחר את סוג הפעולה שתרצה לבצע
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowWorkoutStartModal(false);
                      setShowWorkoutEntryModal(true);
                      setWorkoutForm(prev => ({ ...prev, type: workoutType }));
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    {t('logWorkout')}
                  </button>
                  <button
                    onClick={() => {
                      setShowWorkoutStartModal(false);
                      showToast(t('comingSoon'), 'info');
                    }}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    {t('trackWorkout')}
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowWorkoutStartModal(false)}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('workoutCancel')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Workout Entry Modal */}
      <AnimatePresence>
        {showWorkoutEntryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWorkoutEntryModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-white rounded-3xl z-50 shadow-2xl flex flex-col max-w-md mx-auto overflow-hidden"
            >
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t('workoutEntryForm')}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('workoutType')}
                    </label>
                    <select
                      value={workoutForm.type}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                    >
                      {workoutTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('activityDuration')} ({t('minutes')})
                    </label>
                    <input
                      type="number"
                      value={workoutForm.duration}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                      placeholder="30"
                      min="1"
                    />
                  </div>

                  {(workoutForm.type === 'ריצה' || workoutForm.type === 'הליכה' || workoutForm.type === 'רכיבה על אופניים') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('distance')} ({t('km')})
                        </label>
                        <input
                          type="number"
                          value={workoutForm.distance}
                          onChange={(e) => setWorkoutForm(prev => ({ ...prev, distance: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                          placeholder="5.0"
                          step="0.1"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('speed')} ({t('km')}/h) ({t('optional')})
                        </label>
                        <input
                          type="number"
                          value={workoutForm.speed}
                          onChange={(e) => setWorkoutForm(prev => ({ ...prev, speed: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                          placeholder="10.0"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </>
                  )}

                  {workoutForm.type === 'אימון כוח' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('weightUsed')} ({t('kg')})
                        </label>
                        <input
                          type="number"
                          value={workoutForm.weight}
                          onChange={(e) => setWorkoutForm(prev => ({ ...prev, weight: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                          placeholder="20"
                          step="0.5"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('setsOrReps')} ({t('optional')})
                        </label>
                        <input
                          type="text"
                          value={workoutForm.setsOrReps}
                          onChange={(e) => setWorkoutForm(prev => ({ ...prev, setsOrReps: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none"
                          placeholder="3 סטים של 12 חזרות"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    // Save workout to history
                    const workout = {
                      type: workoutForm.type,
                      duration: parseInt(workoutForm.duration),
                      ...(workoutForm.distance && { distance: parseFloat(workoutForm.distance) }),
                      ...(workoutForm.speed && { speed: parseFloat(workoutForm.speed) }),
                      ...(workoutForm.weight && { weight: parseFloat(workoutForm.weight) }),
                      ...(workoutForm.setsOrReps && { setsOrReps: workoutForm.setsOrReps }),
                      date: new Date().toISOString()
                    };
                    
                    addWorkoutToHistory(workout);
                    setShowWorkoutEntryModal(false);
                    
                    // Reset form
                    setWorkoutForm({
                      type: workoutType,
                      duration: '',
                      distance: '',
                      speed: '',
                      weight: '',
                      setsOrReps: ''
                    });
                    
                    showToast('אימון נשמר בהצלחה!', 'success');
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  {t('confirmSave')}
                </button>
                <button
                  onClick={() => setShowWorkoutEntryModal(false)}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('workoutCancel')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Workout Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 bg-white rounded-3xl z-50 shadow-2xl flex flex-col max-w-md mx-auto overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">קבע אימון</h2>
                <p className="text-gray-600 text-sm">בחר סוג אימון, תאריך ושעה</p>
              </div>
              
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג אימון
                  </label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none"
                  >
                    {workoutTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תאריך
                  </label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שעה
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => {
                    // Save scheduled workout
                    const scheduledWorkout = {
                      ...scheduleForm,
                      id: Date.now().toString(),
                      timestamp: Date.now()
                    };
                    
                    // Save to localStorage (in a real app, this would be handled by a backend)
                    const existingScheduled = JSON.parse(localStorage.getItem('scheduledWorkouts') || '[]');
                    existingScheduled.push(scheduledWorkout);
                    localStorage.setItem('scheduledWorkouts', JSON.stringify(existingScheduled));
                    
                    // Schedule notification (in a real app, this would use a notification service)
                    if ('Notification' in window && Notification.permission === 'granted') {
                      const [hours, minutes] = scheduleForm.time.split(':');
                      const workoutDate = new Date(scheduleForm.date);
                      workoutDate.setHours(parseInt(hours), parseInt(minutes));
                      
                      const timeUntilWorkout = workoutDate.getTime() - Date.now();
                      if (timeUntilWorkout > 0) {
                        setTimeout(() => {
                          new Notification('תזכורת אימון', {
                            body: `זמן לאימון ${scheduleForm.type}!`,
                            icon: '/logo.jpeg'
                          });
                        }, timeUntilWorkout);
                      }
                    }
                    
                    setShowScheduleModal(false);
                    showToast('אימון נקבע בהצלחה!', 'success');
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all"
                  disabled={!scheduleForm.date || !scheduleForm.time}
                >
                  קבע אימון
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  ביטול
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAIModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIModal(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`fixed inset-4 rounded-3xl z-50 shadow-2xl flex flex-col max-w-md mx-auto overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
            >
              <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t('personalAIAssistant')}</h2>
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>{t('aiDesc')}</p>
              </div>
              
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse ${darkMode ? 'bg-gradient-to-br from-pink-900 to-green-900' : 'bg-gradient-to-br from-pink-100 to-green-100'}`}>
                    <Sparkles className={`${darkMode ? 'text-pink-300' : 'text-pink-500'} animate-spin-slow`} size={40} />
                  </div>
                  <p className={`mb-6 text-lg font-medium ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                    {t('whatWorkoutTypeToday')}
                  </p>
                  <div className="flex justify-center space-x-2 mb-4">
                    <span className="text-2xl animate-bounce">💪</span>
                    <span className="text-2xl animate-bounce delay-100">🏃</span>
                    <span className="text-2xl animate-bounce delay-200">🧘</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: t('strengthTraining'), emoji: '🏋️', color: 'from-pink-300 to-pink-400' },
                    { type: t('cardio'), emoji: '🏃', color: 'from-green-300 to-green-400' },
                    { type: t('yoga'), emoji: '🧘', color: 'from-purple-300 to-pink-300' },
                    { type: 'HIIT', emoji: '⚡', color: 'from-pink-200 to-purple-300' },
                    { type: t('running'), emoji: '🏃‍♀️', color: 'from-green-200 to-green-300' },
                    { type: t('swimming'), emoji: '🏊', color: 'from-pink-100 to-green-200' }
                  ].map((workout) => (
                    <button
                      key={workout.type}
                      onClick={() => {
                        const goal = userData?.goal;
                        let recommendation = '';
                        
                        // Generate recommendation based on user data
                        if (goal === 'buildMuscle' && workout.type === t('strengthTraining')) {
                          recommendation = `מומלץ לך (${userData?.age || '20'} שנים, ${userData?.weight || '70'} ק"ג): אימון כוח עם התמקדות בתרגילי משקולות כבדות. התחל עם 3 סטים של 8-12 חזרות, עם מנוחה של 60 שניות בין הסטים. התמקד בתרגילים מרכזיים כמו סקוואט, דדליפט ובנץ' פרס.`;
                        } else if (goal === 'loseWeight' && (workout.type === t('cardio') || workout.type === t('running'))) {
                          recommendation = `מומלץ לך (${userData?.age || '20'} שנים, ${userData?.weight || '70'} ק"ג): אימון קרדיו התערבותי לשריפת קלוריות. התחל עם 30 דקות, החלף בין ריצה מהירה ל-90 שניות והליכה ל-60 שניות. חזור על הפעולה 10-15 פעמים.`;
                        } else if (goal === 'improveEndurance' && workout.type === t('running')) {
                          recommendation = `מומלץ לך (${userData?.age || '20'} שנים): ריצת התערבותית הדרגתית לשיפור סיבולת. התחל מ-20 דקות ריצה קלה, והוסף 2 דקות כל שבוע. מטרה: הגעה ל-45 דקות ריצה רצופה תוך חודשיים.`;
                        } else if (goal === 'flexibility' && workout.type === t('yoga')) {
                          recommendation = `מומלץ לך: יוגה לגמישות ואיזון. התחל עם 20 דקות של תנוחות בסיסיות כמו כלב מכוון, עץ, ולוחם. התמקד בנשימות עמוקות והשאר בכל תנוחה 5-10 נשימות.`;
                        } else {
                          recommendation = `מומלץ לך (${userData?.age || '20'} שנים, ${userData?.weight || '70'} ק"ג): ${workout.type} - אימון מאוזן שמתאים למטרות הכושר הכלליות שלך. התחל עם 30 דקות והגדל בהדרגה את העצימות והמשך הזמן.`;
                        }
                        
                        showToast(recommendation, 'info');
                        setShowAIModal(false);
                      }}
                      className={`w-full p-4 rounded-2xl transition-all transform hover:scale-105 ${darkMode ? `bg-gradient-to-r ${workout.color.replace('300', '800').replace('200', '700')} hover:from-${workout.color.split('-')[0]}-700 hover:to-${workout.color.split('-')[2].replace('300', '800').replace('200', '700')} border border-white/20` : `bg-gradient-to-r ${workout.color} hover:from-${workout.color.split('-')[0]}-400 hover:to-${workout.color.split('-')[2].replace('300', '400').replace('200', '300')} border border-white/50`} shadow-lg`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{workout.emoji}</span>
                        <span className={`font-medium text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{workout.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={`p-6 border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                <button
                  onClick={() => setShowAIModal(false)}
                  className={`w-full font-bold py-4 rounded-2xl transition-all ${darkMode ? 'bg-pink-800 hover:bg-pink-700 text-pink-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
