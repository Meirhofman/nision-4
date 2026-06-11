import { Trophy, Activity, Flame, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

interface FloatingActionButtonsProps {
  activeButton: 'competitions' | 'activities' | 'leaderboard' | null;
  onButtonClick: (button: 'competitions' | 'activities' | 'leaderboard') => void;
}

export default function FloatingActionButtons({ activeButton, onButtonClick }: FloatingActionButtonsProps) {
  const navigate = useNavigate();
  
  const buttons = [
    { id: 'competitions' as const, icon: Trophy, labelHe: 'תחרויות', emoji: '🏆', gradient: 'from-[#ff4d6d] to-orange-500' },
    { id: 'activities' as const, icon: Activity, labelHe: 'פעילויות', emoji: '🏃', gradient: 'from-[#7c3aed] to-purple-500' },
    { id: 'leaderboard' as const, icon: Flame, labelHe: 'מובילים', emoji: '🔥', gradient: 'from-amber-500 to-orange-500' },
    { id: 'streak' as const, icon: TrendingUp, labelHe: 'רצף ימים', emoji: '🏅', gradient: 'from-green-500 to-emerald-600', isLink: true }
  ];

  return (
    <div className="absolute bottom-32 left-0 right-0 z-30 px-4 pb-3 pt-2">
      <div className="flex items-center justify-center gap-2">
        {buttons.map(({ id, icon: Icon, labelHe, emoji, gradient, isLink }) => {
          const isActive = activeButton === id;
          
          return (
            <button
              key={id}
              onClick={() => {
                if (isLink) {
                  navigate('/leaderboard-streak');
                } else {
                  onButtonClick(id as any);
                }
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full shadow-lg transition-all ${
                isActive
                  ? `bg-gradient-to-r ${gradient}`
                  : 'bg-white/95 dark:bg-[#23234a]/95 backdrop-blur-md'
              }`}
            >
              {isActive || isLink ? (
                <span className="text-xl">{emoji}</span>
              ) : (
                <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
              )}
              <span className={`font-black text-sm ${
                isActive ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {labelHe}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
