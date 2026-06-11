import React from 'react';
import { useApp } from '../context/AppContext';

export const StreakBadge: React.FC = () => {
  const { currentStreak } = useApp();
  const { darkMode } = useApp();

  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse ${
      darkMode
        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
        : 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
    }`}>
      <span className="text-xl">🔥</span>
      <span className="text-lg">{currentStreak}</span>
    </div>
  );
};
