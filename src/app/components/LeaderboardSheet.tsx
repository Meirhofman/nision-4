import { X } from 'lucide-react';
import { useState } from 'react';
import { UserAvatar } from './UserAvatar';

interface LeaderboardSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const leaderboardData = {
  day: [
    { rank: 2, name: 'שרה', nameEn: 'Sarah', photoURL: null, stat: '10.8 ק"מ', score: 8520 },
    { rank: 1, name: 'דני', nameEn: 'Danny', photoURL: null, stat: '12.5 ק"מ', score: 9850 },
    { rank: 3, name: 'יוסי', nameEn: 'Yossi', photoURL: null, stat: '9.2 ק"מ', score: 7340 }
  ],
  week: [
    { rank: 2, name: 'נועה', nameEn: 'Noa', photoURL: null, stat: '42.8 ק"מ', score: 8200 },
    { rank: 1, name: 'עומר', nameEn: 'Omer', photoURL: null, stat: '45.2 ק"מ', score: 9500 },
    { rank: 3, name: 'מיה', nameEn: 'Mia', photoURL: null, stat: '38.1 ק"מ', score: 7800 }
  ],
  month: [
    { rank: 2, name: 'אלון', nameEn: 'Alon', photoURL: null, stat: '178 ק"מ', score: 32000 },
    { rank: 1, name: 'תומר', nameEn: 'Tomer', photoURL: null, stat: '195 ק"מ', score: 38000 },
    { rank: 3, name: 'רונית', nameEn: 'Ronit', photoURL: null, stat: '165 ק"מ', score: 29500 }
  ]
};

const otherRanks = [
  { rank: 4, name: 'רונית', photoURL: null, score: 6210 },
  { rank: 5, name: 'אלון', photoURL: null, score: 5890 },
  { rank: 6, name: 'תומר', photoURL: null, score: 5120 }
];

const activityFeed = [
  {
    id: 1,
    photoURL: null,
    name: 'דני',
    action: 'סיים מרתון שבועי',
    emoji: '🏅',
    timestamp: 'לפני 5 דקות',
    reactions: [
      { emoji: '🔥', count: 12 },
      { emoji: '💪', count: 8 },
      { emoji: '👏', count: 15 }
    ]
  },
  {
    id: 2,
    photoURL: null,
    name: 'שרה',
    action: 'שברה שיא אישי',
    emoji: '⚡',
    timestamp: 'לפני 12 דקות',
    reactions: [
      { emoji: '🔥', count: 20 },
      { emoji: '👏', count: 18 }
    ]
  }
];

export default function LeaderboardSheet({ isOpen, onClose }: LeaderboardSheetProps) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  if (!isOpen) return null;

  const topThree = leaderboardData[period];

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a2e] rounded-t-3xl shadow-2xl animate-slide-up max-h-[70%] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1a1a2e] border-b border-gray-100 dark:border-gray-800 px-5 py-4 flex items-center justify-between">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#23234a] flex items-center justify-center">
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-gray-900 dark:text-white text-xl font-black">מובילים 🔥</h2>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(70vh-80px)] scrollbar-hide px-5 py-6 space-y-6">
          {/* Period Toggle */}
          <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-[#23234a] p-1.5 rounded-full">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                period === 'month' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              חודש
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                period === 'week' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              שבוע
            </button>
            <button
              onClick={() => setPeriod('day')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                period === 'day' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              יום
            </button>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 min-h-[240px]">
            {topThree.map((user) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const height = isFirst ? 'h-48' : isSecond ? 'h-36' : 'h-32';
              const order = isSecond ? 'order-1' : isFirst ? 'order-2' : 'order-3';
              const ringColor = isFirst ? 'from-amber-400 to-amber-600' : isSecond ? 'from-gray-300 to-gray-500' : 'from-amber-700 to-orange-700';

              return (
                <div key={user.rank} className={`flex-1 ${order}`}>
                  <div className={`bg-white dark:bg-[#23234a] rounded-3xl p-3 shadow-xl ${height} flex flex-col items-center justify-between`}>
                    <div className="relative mt-2">
                      <div className={`${isFirst ? 'w-16 h-16' : 'w-14 h-14'} bg-gradient-to-br ${ringColor} p-0.5 rounded-full`}>
                        <UserAvatar
                          photoURL={user.photoURL}
                          displayName={user.name}
                          size={isFirst ? 56 : 48}
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                        <span className="text-white dark:text-gray-900 text-xs font-black">{user.rank}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 dark:text-white font-black text-sm mb-1">{user.name}</div>
                      <div className="text-gray-600 dark:text-[#9898bb] text-[10px] mb-2">{user.nameEn}</div>
                      <div className="bg-gray-100 dark:bg-[#1a1a2e] rounded-xl px-2 py-1.5">
                        <div className="text-gray-900 dark:text-white font-black text-xs">{user.stat}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Other Ranks */}
          <div className="space-y-2">
            {otherRanks.map((user) => (
              <div key={user.rank} className="flex items-center justify-between bg-white dark:bg-[#23234a] rounded-2xl px-4 py-3 shadow-md">
                <div className="text-gray-900 dark:text-white font-black text-sm">{user.score.toLocaleString()}</div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 dark:text-white font-bold text-sm">{user.name}</span>
                  <UserAvatar photoURL={user.photoURL} displayName={user.name} size={36} />
                  <div className="w-7 h-7 bg-gray-200 dark:bg-[#1a1a2e] rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-black">{user.rank}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-black mb-3 text-right">פעילות אחרונה</h3>
            <div className="space-y-3">
              {activityFeed.map((item) => (
                <div key={item.id} className="bg-white dark:bg-[#23234a] rounded-2xl p-4 shadow-md">
                  <div className="flex items-start gap-3 mb-3">
                    <UserAvatar photoURL={item.photoURL} displayName={item.name} size={40} />
                    <div className="flex-1 text-right">
                      <div className="text-gray-900 dark:text-white font-black text-sm mb-1">{item.name}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">{item.action}</span>
                      </div>
                      <div className="text-gray-500 dark:text-[#9898bb] text-xs">{item.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {item.reactions.map((reaction, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#1a1a2e] px-3 py-1.5 rounded-full"
                      >
                        <span className="text-sm">{reaction.emoji}</span>
                        <span className="text-gray-900 dark:text-white text-xs font-bold">{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}

