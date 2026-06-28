import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, MapPin, Footprints, CheckCircle, Share2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

const typeToKey: Record<string, string> = {
  Walking: 'walking', Running: 'running', Cycling: 'cycling', Yoga: 'yoga',
  Dance: 'dance', HIIT: 'hiit', Swimming: 'swimming',
};

const historyData = [
  { id: 1, dateKey: 'today', dateSuffix: '3:45', type: 'Walking', duration: "24 דק'", steps: '5,420', distance: '3.2 ק״מ', status: 'active' },
  { id: 2, dateKey: 'yesterday', dateSuffix: '17:20', type: 'Running', duration: "32 דק'", steps: '7,840', distance: '5.8 ק״מ', status: 'active' },
  { id: 3, dateKey: 'date', dateVal: '9.2', dateSuffix: '16:15', type: 'Cycling', duration: "45 דק'", distance: '12.5 ק״מ', status: 'active' },
  { id: 4, dateKey: 'date', dateVal: '8.2', dateSuffix: '18:30', type: 'Yoga', duration: "30 דק'", status: 'completed' },
  { id: 5, dateKey: 'date', dateVal: '7.2', dateSuffix: '7:00', type: 'Walking', duration: "28 דק'", steps: '6,240', distance: '3.8 ק״מ', status: 'active' },
  { id: 6, dateKey: 'date', dateVal: '6.2', dateSuffix: '17:45', type: 'Dance', duration: "40 דק'", calories: '320 קלוריות', status: 'active' },
  { id: 7, dateKey: 'date', dateVal: '5.2', dateSuffix: '8:00', type: 'Running', duration: "25 דק'", steps: '4,500', distance: '3.5 ק״מ', status: 'active' },
  { id: 8, dateKey: 'date', dateVal: '4.2', dateSuffix: '18:00', type: 'HIIT', duration: "20 דק'", calories: '280 קלוריות', status: 'completed' },
  { id: 9, dateKey: 'date', dateVal: '3.2', dateSuffix: '17:15', type: 'Walking', duration: "35 דק'", steps: '6,800', distance: '4.2 ק״מ', status: 'active' },
  { id: 10, dateKey: 'date', dateVal: '2.2', dateSuffix: '9:00', type: 'Swimming', duration: "45 דק'", distance: '1.2 ק״מ', status: 'active' },
  { id: 11, dateKey: 'date', dateVal: '1.2', dateSuffix: '16:30', type: 'Cycling', duration: "50 דק'", distance: '15.0 ק״מ', status: 'active' },
];

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const { t, workoutHistory, language, deleteWorkoutFromHistory, darkMode } = useApp();

  const formatWorkoutDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const locale = language === 'en' ? 'en-US' : 'he-IL';
    
    if (date.toDateString() === today.toDateString()) {
      return `${t('today')}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `${t('yesterday')}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.getDate()}.${date.getMonth() + 1}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const formatDuration = (duration: number) => {
    return `${duration} ${t('minutesShort')}`;
  };

  const formatDistance = (distance: number) => {
    return `${distance} ${t('kmShort')}`;
  };

  const shareWorkout = async (workout: any) => {
    const shareData = {
      title: t('workoutAchievement'),
      text: `${t('completedWorkout')}\n⏱️ ${t('timeLabel')}: ${workout.duration}${workout.steps ? `\n👟 ${t('stepsLabel2')}: ${workout.steps}` : ''}${workout.distance ? `\n📍 ${t('distanceLabel2')}: ${workout.distance}` : ''}${workout.calories ? `\n🔥 ${t('caloriesLabel')}: ${workout.calories}` : ''}\n\n#כושר #אימון #LAZOZ`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const fullText = `${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(fullText);
        alert(t('shareCopied'));
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text}\n${shareData.url}`;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(t('shareCopied'));
      } catch (fallbackError) {
        alert(t('shareError'));
      }
    }
  };

  const deleteWorkout = (workoutId: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק אימון זה?')) {
      deleteWorkoutFromHistory(workoutId);
    }
  };

  const calculateCalories = (workout: any) => {
    // Simple calorie estimation based on workout type and duration
    const caloriesPerMinute = {
      'ריצה': 10,
      'הליכה': 4,
      'רכיבה על אופניים': 8,
      'שחייה': 11,
      'אימון כוח': 6,
      'יוגה': 3,
      'ריקוד': 7,
      'HIIT': 12,
      'פילאטיס': 4,
      'טיולים': 5,
      'קיקבוקסינג': 8,
      'קפיצה בחבל': 10,
      'אליפטיקל': 7,
      'חתירה': 8,
      'מתיחות': 2
    };
    
    const rate = caloriesPerMinute[workout.type as keyof typeof caloriesPerMinute] || 5;
    return Math.round(rate * workout.duration);
  };

  return (
    <MobileContainer className={`min-h-screen flex flex-col relative ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-6 pb-2 pt-12 flex items-center relative justify-center z-10 ${darkMode ? 'bg-slate-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <button
          onClick={() => navigate('/workouts')}
          className={`absolute left-6 w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 ${darkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-white text-gray-600'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t('workoutHistory')}</h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden pb-24">
        {workoutHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{t('noWorkoutHistory')}</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{t('startLoggingWorkouts')}</p>
          </div>
        ) : (
          workoutHistory.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-3xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100/50'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatWorkoutDate(workout.date)}
                  </p>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{workout.type}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-xl text-xs font-bold">
                    {formatDuration(workout.duration)}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkout(workout.id);
                    }}
                    className="p-2 bg-[#fef2f2] text-[#dc2626] rounded-full hover:bg-[#fee2e2] transition-colors"
                    title="מחק אימון"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareWorkout(workout);
                    }}
                    className="p-2 bg-[#f0f9ff] text-[#0369a1] rounded-full hover:bg-[#e0f2fe] transition-colors"
                    title={t('shareWorkout')}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {workout.distance && (
                  <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                    <MapPin size={16} className="text-green-500/70" />
                    <span className="text-sm font-medium text-gray-600">{formatDistance(workout.distance)}</span>
                  </div>
                )}
                {workout.weight && (
                  <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                    <span className="text-sm font-medium text-gray-600">{workout.weight} {t('kgShort')}</span>
                  </div>
                )}
                {workout.setsOrReps && (
                  <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                    <span className="text-sm font-medium text-gray-600">{workout.setsOrReps}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                  <span className="text-sm font-medium text-gray-600">{calculateCalories(workout)} {t('caloriesLabel')}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
      

    </MobileContainer>
  );
};
