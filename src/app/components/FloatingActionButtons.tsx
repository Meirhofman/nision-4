import { Trophy, Activity, Flame } from 'lucide-react';

interface FloatingActionButtonsProps {
  activeButton: 'competitions' | 'activities' | 'leaderboard' | null;
  onButtonClick: (button: 'competitions' | 'activities' | 'leaderboard') => void;
}

export default function FloatingActionButtons({ activeButton, onButtonClick }: FloatingActionButtonsProps) {
  const buttons = [
    { id: 'competitions' as const, icon: Trophy, labelHe: 'תחרויות', emoji: '🏆', gradient: 'from-[#ff4d6d] to-orange-500' },
    { id: 'activities' as const, icon: Activity, labelHe: 'פעילויות', emoji: '🏃', gradient: 'from-[#7c3aed] to-purple-500' },
    { id: 'leaderboard' as const, icon: Flame, labelHe: 'מובילים', emoji: '🔥', gradient: 'from-amber-500 to-orange-500' }
  ];

  return (
    <div className="absolute bottom-28 left-0 right-0 z-30 px-4 pb-3 pt-2">
      <div className="flex items-center justify-center gap-2">
        {buttons.map(({ id, icon: Icon, labelHe, emoji, gradient }) => {
          const isActive = activeButton === id;

          return (
            <button
              key={id}
              onClick={() => onButtonClick(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-xl transition-all ${
                isActive
                  ? `bg-gradient-to-r ${gradient}`
                  : 'bg-white/95 dark:bg-[#23234a]/95 backdrop-blur-md'
              }`}
            >
              {isActive ? (
                <span className="text-xl">{emoji}</span>
              ) : (
                <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
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
