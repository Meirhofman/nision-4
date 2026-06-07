import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface TopBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TopBar({ isDarkMode, onToggleDarkMode }: TopBarProps) {
  const currentXP = 1250;
  const nextLevelXP = 2000;
  const xpProgress = (currentXP / nextLevelXP) * 100;
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white dark:bg-[#1a1a2e] shadow-sm z-40 relative">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        {/* Left - XP Badge */}
        <button onClick={onToggleDarkMode} className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-[#23234a] px-3 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800">
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
            <span className="text-gray-900 dark:text-white font-black text-sm">{currentXP}</span>
          </div>
          {/* Progress bar */}
          <div className="w-14 h-1.5 bg-gray-200 dark:bg-[#23234a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-[#ff4d6d]"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </button>

        {/* Center - Title */}
        <h1 className="text-gray-900 dark:text-white font-black text-lg">חברתי</h1>

        {/* Right - Back Button & User Avatar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-[#23234a] text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#ff4d6d] p-0.5">
              <div className="w-full h-full bg-white dark:bg-[#1a1a2e] rounded-full flex items-center justify-center text-xl">
                👤
              </div>
            </div>
            {/* Activity status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#1a1a2e]" />
          </div>
        </div>
      </div>
    </div>
  );
}
