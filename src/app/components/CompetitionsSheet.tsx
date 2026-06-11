import { X, MapPin } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface CompetitionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const competitions = [
  {
    id: 1,
    nameHe: 'מרתון תל אביב',
    nameEn: 'Tel Aviv Marathon',
    prize: 500,
    participants: 324,
    participants_preview: [
      { displayName: 'דני', photoURL: null },
      { displayName: 'שרה', photoURL: null },
      { displayName: 'יוסי', photoURL: null },
    ],
    gradient: 'from-[#ff4d6d] to-orange-500',
    icon: '🏃'
  },
  {
    id: 2,
    nameHe: 'אתגר רכיבה',
    nameEn: 'Cycling Challenge',
    prize: 300,
    participants: 156,
    participants_preview: [
      { displayName: 'יוסי', photoURL: null },
      { displayName: 'דני', photoURL: null },
    ],
    gradient: 'from-cyan-500 to-blue-600',
    icon: '🚴'
  },
  {
    id: 3,
    nameHe: 'יוגה בפארק',
    nameEn: 'Park Yoga',
    prize: 150,
    participants: 89,
    participants_preview: [
      { displayName: 'שרה', photoURL: null },
      { displayName: 'נועה', photoURL: null },
    ],
    gradient: 'from-purple-600 to-pink-500',
    icon: '🧘'
  }
];

const localCompetitions = [
  {
    id: 4,
    nameHe: 'אימון כוח',
    nameEn: 'Strength Training',
    prize: 200,
    participants: 67,
    distance: '1.2 ק"מ',
    participants_preview: [{ displayName: 'דני', photoURL: null }],
    gradient: 'from-amber-500 to-orange-600',
    icon: '💪'
  }
];

export default function CompetitionsSheet({ isOpen, onClose }: CompetitionsSheetProps) {
  if (!isOpen) return null;

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
          <h2 className="text-gray-900 dark:text-white text-xl font-black">תחרויות 🏆</h2>
        </div>

        {/* Content - Scrollable with hidden scrollbar */}
        <div className="overflow-y-auto h-[calc(70vh-80px)] scrollbar-hide px-5 py-6 space-y-6">
          {/* Main Competitions */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {competitions.map((comp) => (
              <div key={comp.id} className="flex-shrink-0 w-72 rounded-3xl overflow-hidden shadow-xl">
                <div className={`relative bg-gradient-to-br ${comp.gradient} p-6 pb-20`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border border-white/30 mb-4">
                    {comp.icon}
                  </div>
                  <div className="text-right mb-4">
                    <h3 className="text-white text-2xl font-black leading-tight drop-shadow-lg">{comp.nameHe}</h3>
                    <p className="text-white/90 text-sm font-semibold">{comp.nameEn}</p>
                  </div>
                  <div className="absolute bottom-5 right-5 bg-white dark:bg-[#23234a] px-4 py-3 rounded-full shadow-xl flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white font-black text-lg">{comp.prize}</div>
                      <div className="text-gray-600 dark:text-[#9898bb] text-xs">נקודות</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#23234a] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex -space-x-2">
                      {comp.participants_preview.map((participant, idx) => (
                        <div key={idx} className="border-2 border-white dark:border-[#23234a] rounded-full">
                          <UserAvatar
                            photoURL={participant.photoURL}
                            displayName={participant.displayName}
                            size={36}
                          />
                        </div>
                      ))}
                      <div className="w-9 h-9 bg-gray-200 dark:bg-[#1a1a2e] rounded-full flex items-center justify-center text-xs font-black text-gray-600 dark:text-gray-400 border-2 border-white dark:border-[#23234a]">
                        +{comp.participants - comp.participants_preview.length}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white font-black">{comp.participants}</div>
                      <div className="text-gray-600 dark:text-[#9898bb] text-xs">משתתפים</div>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm">
                    הצטרף
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Local Competitions */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-black mb-4 text-right">תחרויות בסביבה</h3>
            {localCompetitions.map((comp) => (
              <div key={comp.id} className="rounded-3xl overflow-hidden shadow-xl mb-4">
                <div className={`relative bg-gradient-to-br ${comp.gradient} p-6 pb-16`}>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 mb-3">
                    {comp.icon}
                  </div>
                  <div className="text-right">
                    <h3 className="text-white text-xl font-black leading-tight drop-shadow-lg">{comp.nameHe}</h3>
                    <p className="text-white/90 text-sm font-semibold">{comp.nameEn}</p>
                  </div>
                  <div className="absolute bottom-4 right-5 bg-white dark:bg-[#23234a] px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900 dark:text-white font-black text-sm">{comp.distance}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#23234a] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex -space-x-2">
                      {comp.participants_preview.map((participant, idx) => (
                        <div key={idx} className="border-2 border-white dark:border-[#23234a] rounded-full">
                          <UserAvatar
                            photoURL={participant.photoURL}
                            displayName={participant.displayName}
                            size={32}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white font-black">{comp.participants}</div>
                      <div className="text-gray-600 dark:text-[#9898bb] text-xs">משתתפים</div>
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm">
                    הצטרף
                  </button>
                </div>
              </div>
            ))}
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
