import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, MapPin, Activity, Pause, Square, Play } from 'lucide-react';
import { motion } from 'motion/react';

export const WorkoutActiveScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, darkMode } = useApp();
  
  const [workoutType, setWorkoutType] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Get workout data from navigation state
    if (location.state) {
      setWorkoutType(location.state.workoutType || '');
      setStartTime(location.state.startTime || Date.now());
      setIsActive(true);
    }
  }, [location.state]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (window.confirm('האם אתה בטוח שברצונך להפסיק את האימון?')) {
      // Save workout to history
      const workout = {
        id: Date.now(),
        type: workoutType,
        duration: Math.floor(elapsedTime / 1000 / 60), // in minutes
        distance: Math.floor(Math.random() * 10) + 1, // mock distance
        calories: Math.floor(elapsedTime / 1000 / 60 * 5), // mock calories
        date: new Date().toISOString()
      };
      
      // Add to workout history (this would normally be saved to context/state)
      console.log('Workout completed:', workout);
      
      // Navigate to summary
      navigate(`/workout-summary/${workout.id}`);
    }
  };

  const handleBack = () => {
    if (window.confirm('האם אתה בטוח שברצונך לצאת מהאימון?')) {
      navigate('/workouts');
    }
  };

  if (!workoutType) {
    return (
      <MobileContainer className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-4">לא נבחר סוג אימון</p>
          <button
            onClick={() => navigate('/workouts')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            חזור לאימונים
          </button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer className={`min-h-screen relative flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50 to-purple-50'}`}
    >
      {/* Header */}
      <div className="p-4 pb-0 relative">
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 p-2 bg-gray-100 rounded-full text-gray-600 shadow-sm border border-gray-200 z-10"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-center pt-8">
          <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {workoutType}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {isPaused ? 'מופסק' : 'פעיל'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Timer Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center mb-12 ${isPaused ? 'animate-pulse' : ''}`}
        >
          <div className={`text-6xl font-black tabular-nums ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {formatTime(elapsedTime)}
          </div>
          <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            זמן אימון
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-12">
          <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <Activity className={`mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={24} />
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {Math.floor(elapsedTime / 1000 / 60)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              דקות
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <MapPin className={`mx-auto mb-2 ${darkMode ? 'text-green-400' : 'text-green-500'}`} size={24} />
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {Math.floor(Math.random() * 5) + 1}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ק"מ
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <Clock className={`mx-auto mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} size={24} />
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {Math.floor(elapsedTime / 1000 / 60 * 5)}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              קלוריות
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={handlePauseResume}
            className={`flex-1 p-4 rounded-2xl font-bold text-white transition-all ${
              isPaused 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {isPaused ? (
              <>
                <Play size={24} className="inline-block mr-2" />
                המשך
              </>
            ) : (
              <>
                <Pause size={24} className="inline-block mr-2" />
                הפסק
              </>
            )}
          </button>
          
          <button
            onClick={handleStop}
            className="flex-1 p-4 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all"
          >
            <Square size={24} className="inline-block mr-2" />
            הפסק
          </button>
        </div>
      </div>
    </MobileContainer>
  );
};
