import { X, Plus, Users, Clock } from 'lucide-react';
import { useState } from 'react';

interface ActivitiesSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const activities = [
  {
    id: 1,
    icon: '🏃',
    nameHe: 'ריצה בפארק',
    nameEn: 'Park Run',
    organizerAvatar: '👨',
    organizerName: 'דני',
    participants: 12,
    time: '17:00',
    difficulty: 'קל',
    borderColor: 'border-orange-500',
    category: 'running'
  },
  {
    id: 2,
    icon: '💪',
    nameHe: 'אימון כוח',
    nameEn: 'Strength',
    organizerAvatar: '👧',
    organizerName: 'שרה',
    participants: 8,
    time: '18:30',
    difficulty: 'בינוני',
    borderColor: 'border-purple-500',
    category: 'gym'
  },
  {
    id: 3,
    icon: '🚴',
    nameHe: 'רכיבה',
    nameEn: 'Cycling',
    organizerAvatar: '👦',
    organizerName: 'יוסי',
    participants: 15,
    time: '16:00',
    difficulty: 'מאתגר',
    borderColor: 'border-cyan-500',
    category: 'cycling'
  },
  {
    id: 4,
    icon: '🧘',
    nameHe: 'יוגה',
    nameEn: 'Yoga',
    organizerAvatar: '👩',
    organizerName: 'נועה',
    participants: 20,
    time: '19:00',
    difficulty: 'קל',
    borderColor: 'border-pink-500',
    category: 'yoga'
  }
];

const filters = [
  { id: 'all', labelHe: 'הכל' },
  { id: 'running', labelHe: 'ריצה' },
  { id: 'cycling', labelHe: 'רכיבה' },
  { id: 'gym', labelHe: 'כושר' },
  { id: 'yoga', labelHe: 'יוגה' }
];

export default function ActivitiesSheet({ isOpen, onClose }: ActivitiesSheetProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen) return null;

  const filteredActivities = activeFilter === 'all'
    ? activities
    : activities.filter(a => a.category === activeFilter);

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
          <h2 className="text-gray-900 dark:text-white text-xl font-black">פעילויות משותפות 🏃</h2>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(70vh-80px)] scrollbar-hide px-5 py-6 space-y-5">
          {/* Create Activity Button */}
          <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#7c3aed] to-purple-500 text-white font-black text-base shadow-lg flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>צור פעילות</span>
          </button>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-[#23234a] text-gray-600 dark:text-gray-400'
                }`}
              >
                {filter.labelHe}
              </button>
            ))}
          </div>

          {/* Activity Cards */}
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-white dark:bg-[#23234a] rounded-2xl p-5 shadow-md border-l-4 ${activity.borderColor}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a1a2e] dark:to-[#23234a] rounded-2xl flex items-center justify-center text-3xl">
                    {activity.icon}
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-gray-900 dark:text-white font-black text-lg leading-tight">{activity.nameHe}</h3>
                    <p className="text-gray-600 dark:text-[#9898bb] text-sm">{activity.nameEn}</p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <span className="text-gray-600 dark:text-[#9898bb] text-xs">{activity.organizerName}</span>
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm">
                        {activity.organizerAvatar}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-bold text-sm">{activity.participants}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white font-bold text-sm">{activity.time}</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    <span className="text-purple-700 dark:text-purple-300 text-xs font-bold">{activity.difficulty}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#7c3aed] to-purple-500 text-white font-black text-sm shadow-md">
                  הצטרף
                </button>
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

