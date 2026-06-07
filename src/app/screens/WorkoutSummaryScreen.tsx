import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, MapPin, Weight, Activity, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const WorkoutSummaryScreen = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const { t, workoutHistory } = useApp();

  const workout = workoutHistory.find(w => w.id === parseInt(workoutId || '0'));

  const calculateCalories = (workout: any) => {
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

  const formatWorkoutDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!workout) {
    return (
      <MobileContainer className="min-h-screen flex flex-col relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">האימון לא נמצא</h2>
            <button
              onClick={() => navigate('/history')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-6 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              חזור להיסטוריה
            </button>
          </div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className="min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-6 pb-2 pt-12 flex items-center relative justify-center bg-white/50 backdrop-blur-sm z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">{t('workoutSummary')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden pb-24">
        {/* Workout Type and Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{workout.type}</h2>
              <p className="text-gray-500 text-sm">{formatWorkoutDate(workout.date)}</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl text-lg font-bold">
              {workout.duration} דק'
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {workout.distance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#DBEAFE] rounded-3xl p-4 flex flex-col items-center justify-center space-y-2 shadow-md border border-blue-100"
            >
              <MapPin size={32} className="text-blue-600 mb-2" />
              <span className="text-xl font-black text-gray-800 tracking-tighter">{workout.distance}</span>
              <span className="text-xs font-black text-gray-400 uppercase">ק"מ</span>
            </motion.div>
          )}

          {workout.weight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#DBEAFE] rounded-3xl p-4 flex flex-col items-center justify-center space-y-2 shadow-md border border-blue-100"
            >
              <Weight size={32} className="text-blue-600 mb-2" />
              <span className="text-xl font-black text-gray-800 tracking-tighter">{workout.weight}</span>
              <span className="text-xs font-black text-gray-400 uppercase">ק"ג</span>
            </motion.div>
          )}

          {workout.speed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#DBEAFE] rounded-3xl p-4 flex flex-col items-center justify-center space-y-2 shadow-md border border-blue-100"
            >
              <Activity size={32} className="text-blue-600 mb-2" />
              <span className="text-xl font-black text-gray-800 tracking-tighter">{workout.speed}</span>
              <span className="text-xs font-black text-gray-400 uppercase">קמ"ש</span>
            </motion.div>
          )}

          {workout.setsOrReps && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#DBEAFE] rounded-3xl p-4 flex flex-col items-center justify-center space-y-2 shadow-md border border-blue-100"
            >
              <Clock size={32} className="text-blue-600 mb-2" />
              <span className="text-lg font-black text-gray-800 tracking-tighter text-center">{workout.setsOrReps}</span>
              <span className="text-xs font-black text-gray-400 uppercase">סטים/חזרות</span>
            </motion.div>
          )}
        </div>

        {/* Calories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-6 shadow-lg border border-orange-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame size={40} className="text-white" />
              <div>
                <p className="text-white font-bold text-lg">{t('estimatedCalories')}</p>
                <p className="text-white/90 text-sm">בוסס סוג האימון והמשך</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-white">{calculateCalories(workout)}</span>
              <span className="text-white text-sm block">קלוריות</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/history')}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
          >
            חזור להיסטוריה
          </button>
          <button
            onClick={() => navigate('/workouts')}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            אימון חדש
          </button>
        </div>
      </div>
    </MobileContainer>
  );
};
