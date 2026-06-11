import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { StreakBadge } from './StreakBadge';
import { UserAvatar } from './UserAvatar';

interface TopBarProps {
  isDarkMode: boolean;
  onToggleDarkMode?: () => void;
  title?: string;
  showBackButton?: boolean;
}

export default function TopBar({ isDarkMode, onToggleDarkMode, title = "חברתי", showBackButton = true }: TopBarProps) {
  const { points, currentUser, userData, dailyGoals, dailyProgress } = useApp();
  const nextLevelXP = 2000;
  const xpProgress = (points / nextLevelXP) * 100;
  const navigate = useNavigate();

  // Calculate daily progress percentage
  const waterPercent = Math.min((dailyProgress.water / dailyGoals.water) * 100, 100);
  const caloriesPercent = Math.min((dailyProgress.calories / dailyGoals.calories) * 100, 100);
  const stepsPercent = Math.min((dailyProgress.steps / dailyGoals.steps) * 100, 100);
  const workoutPercent = Math.min((dailyProgress.workoutMinutes / dailyGoals.workoutMinutes) * 100, 100);
  const averageProgress = (waterPercent + caloriesPercent + stepsPercent + workoutPercent) / 4;

  return (
    <div className="w-full bg-white dark:bg-[#1a1a2e] shadow-sm z-40 relative">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        {/* Left - Daily Progress / XP Button */}
        <button
          onClick={() => navigate('/daily-goals')}
          className="flex items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2 bg-white dark:bg-[#23234a] px-3 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800">
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
            <span className="text-gray-900 dark:text-white font-black text-sm">{points}</span>
          </div>
          {/* Progress bar */}
          <div className="w-20 h-1.5 bg-gray-200 dark:bg-[#23234a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-[#ff4d6d] transition-all duration-300"
              style={{ width: `${Math.min(averageProgress, 100)}%` }}
            />
          </div>
          <StreakBadge />
        </button>

        {/* Center - Title */}
        <h1 className="text-gray-900 dark:text-white font-black text-lg">{title}</h1>

        {/* Right - Back Button & User Avatar */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#23234a] text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div className="relative">
            <UserAvatar
              photoURL={currentUser?.photoURL}
              displayName={userData?.displayName || currentUser?.displayName}
              size={44}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1a1a2e]" />
          </div>
        </div>
      </div>
    </div>
  );
}
