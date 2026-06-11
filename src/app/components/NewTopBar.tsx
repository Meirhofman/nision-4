import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Star, Target, ChevronRight } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface NewTopBarProps {
  title?: string;
}

export const NewTopBar: React.FC<NewTopBarProps> = ({ title = "חברתי" }) => {
  const { points, currentStreak, currentUser, userData, dailyGoals, dailyProgress } = useApp();
  const navigate = useNavigate();

  const waterPercent = Math.min((dailyProgress.water / dailyGoals.water) * 100, 100);
  const caloriesPercent = Math.min((dailyProgress.calories / dailyGoals.calories) * 100, 100);
  const stepsPercent = Math.min((dailyProgress.steps / dailyGoals.steps) * 100, 100);
  const workoutPercent = Math.min((dailyProgress.workoutMinutes / dailyGoals.workoutMinutes) * 100, 100);
  const averageProgress = (waterPercent + caloriesPercent + stepsPercent + workoutPercent) / 4;

  return (
    <div className="w-full h-[56px] bg-white flex items-center justify-between px-4">
      {/* Left: Back Button + Profile + Daily Goals */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
        >
          <ChevronRight size={20} className="text-gray-500" />
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="relative shrink-0"
        >
          <UserAvatar
            photoURL={currentUser?.photoURL}
            displayName={userData?.displayName || currentUser?.displayName}
            size={36}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </button>
        <button
          onClick={() => navigate('/daily-goals')}
          className="h-9 px-4 rounded-[20px] bg-[#F4F0FF] flex items-center gap-1.5 active:opacity-80"
        >
          <Target className="w-4 h-4 text-[#534AB7]" />
          <span className="text-[#534AB7] font-medium text-sm">
            יעדי היום
          </span>
        </button>
      </div>

      {/* Middle: Spacer */}
      <div className="flex-1" />

      {/* Right: Streak Button + Points & Progress */}
      <div className="flex items-center gap-3">
        {/* Streak Button */}
        <button
          onClick={() => navigate('/leaderboard-streak')}
          className="h-9 px-3 rounded-[20px] bg-[#FFF5F0] flex items-center gap-1.5 active:opacity-80"
        >
          <span className="text-lg">🔥</span>
          <span className="text-[#FF6B35] font-bold text-sm">
            {currentStreak}
          </span>
        </button>

        {/* Points & Progress */}
        <button
          onClick={() => navigate('/points')}
          className="flex items-center gap-2 active:opacity-80"
        >
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#E9A800]" fill="#E9A800" />
              <span className="text-gray-800 font-medium text-sm">
                {points}
              </span>
            </div>
            <div className="w-20 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-[#ff4d6d] transition-all duration-300"
                style={{ width: `${Math.min(averageProgress, 100)}%` }}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
