import { Filter } from 'lucide-react';
import { useState } from 'react';

const liveUsers = [
  { id: 1, avatar: '👨', name: 'דני', nameEn: 'Danny', isActive: true, activity: 'ריצה', activityEn: 'Running', icon: '👟', duration: '23 דק׳', mapPos: { top: '20%', right: '55%' }, color: 'from-orange-500 to-red-500' },
  { id: 2, avatar: '👧', name: 'שרה', nameEn: 'Sarah', isActive: true, activity: 'רכיבה', activityEn: 'Cycling', icon: '🚴', duration: '45 דק׳', mapPos: { top: '45%', right: '25%' }, color: 'from-cyan-500 to-blue-500' },
  { id: 3, avatar: '👦', name: 'יוסי', nameEn: 'Yossi', isActive: true, activity: 'כושר', activityEn: 'Gym', icon: '🏋️', duration: '18 דק׳', mapPos: { top: '60%', right: '70%' }, color: 'from-purple-500 to-pink-500' },
  { id: 4, avatar: '👩', name: 'נועה', nameEn: 'Noa', isActive: false, activity: 'לא פעיל', activityEn: 'Offline', icon: '💤', duration: '-', mapPos: { top: '35%', right: '12%' }, color: '' }
];

interface LiveMapSectionProps {
  isDarkMode?: boolean;
}

export default function LiveMapSection({ isDarkMode = false }: LiveMapSectionProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const dark = isDarkMode;

  return (
    <div className="flex-1 relative w-full h-full overflow-hidden">
      {/* Map Container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          background: dark
            ? 'linear-gradient(160deg, #0d0d1f 0%, #1a1a2e 40%, #16213e 100%)'
            : 'linear-gradient(160deg, #e0f2fe 0%, #f0f4ff 50%, #fdf4ff 100%)',
        }}
      >
        {/* Map Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: dark
              ? `linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px),
                 linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px)`
              : `linear-gradient(90deg, rgba(100,116,200,0.10) 1px, transparent 1px),
                 linear-gradient(rgba(100,116,200,0.10) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Subtle Road Paths */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: dark ? 0.18 : 0.25 }} xmlns="http://www.w3.org/2000/svg">
          {/* Main road horizontal */}
          <path d="M 0,150 Q 120,130 240,150 T 375,150" stroke={dark ? '#a78bfa' : '#7c3aed'} strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Secondary road horizontal */}
          <path d="M 0,300 Q 150,280 300,300 T 375,300" stroke={dark ? '#67e8f9' : '#0ea5e9'} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Vertical road */}
          <path d="M 120,0 Q 140,200 120,600" stroke={dark ? '#f9a8d4' : '#ec4899'} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Diagonal route */}
          <path d="M 0,400 Q 100,350 200,370 T 375,340" stroke={dark ? '#6ee7b7' : '#10b981'} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="8 6" />
        </svg>

        {/* Block shapes representing buildings */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: dark ? 0.06 : 0.09 }} xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="50" height="40" rx="4" fill={dark ? '#a78bfa' : '#7c3aed'} />
          <rect x="160" y="60" width="60" height="30" rx="4" fill={dark ? '#67e8f9' : '#0ea5e9'} />
          <rect x="270" y="40" width="40" height="50" rx="4" fill={dark ? '#f9a8d4' : '#ec4899'} />
          <rect x="40" y="200" width="55" height="35" rx="4" fill={dark ? '#6ee7b7' : '#10b981'} />
          <rect x="200" y="220" width="70" height="40" rx="4" fill={dark ? '#a78bfa' : '#7c3aed'} />
          <rect x="300" y="200" width="50" height="30" rx="4" fill={dark ? '#fde68a' : '#f59e0b'} />
          <rect x="30" y="360" width="45" height="55" rx="4" fill={dark ? '#f9a8d4' : '#ec4899'} />
          <rect x="180" y="380" width="60" height="45" rx="4" fill={dark ? '#67e8f9' : '#0ea5e9'} />
          <rect x="310" y="370" width="40" height="40" rx="4" fill={dark ? '#6ee7b7' : '#10b981'} />
        </svg>

        {/* LIVE Badge - Top Left */}
        <div
          className="absolute top-4 left-4 z-10 px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
          style={{
            background: dark ? 'rgba(35,35,74,0.9)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            border: dark ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <span className={`text-xs font-black ${dark ? 'text-green-400' : 'text-green-600'}`}>LIVE 🟢</span>
        </div>

        {/* Filter Button - Top Right */}
        <button
          className="absolute top-4 right-4 z-10 p-3 rounded-full shadow-lg"
          style={{
            background: dark ? 'rgba(35,35,74,0.9)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            border: dark ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(124,58,237,0.15)',
          }}
        >
          <Filter className={`w-5 h-5 ${dark ? 'text-purple-300' : 'text-gray-700'}`} />
        </button>

        {/* User Pins */}
        {liveUsers.map((user) => (
          <div
            key={user.id}
            className="absolute cursor-pointer"
            style={{ top: user.mapPos.top, right: user.mapPos.right }}
            onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
          >
            {user.isActive ? (
              <div className="relative">
                {/* Glowing Ring */}
                <div className={`absolute inset-0 -m-3 rounded-full bg-gradient-to-br ${user.color} opacity-30 blur-lg animate-pulse`} />

                {/* Avatar Pin */}
                <div className={`relative w-14 h-14 bg-gradient-to-br ${user.color} rounded-full p-0.5 shadow-xl`}>
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-2xl"
                    style={{ background: dark ? '#23234a' : '#ffffff' }}
                  >
                    {user.avatar}
                  </div>
                </div>

                {/* Activity Icon */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: dark ? '#23234a' : '#ffffff',
                    border: dark ? '2px solid #3b3b6b' : '2px solid #e9d5ff',
                  }}
                >
                  <span className="text-base">{user.icon}</span>
                </div>

                {/* Popup Card on Tap */}
                {selectedUser === user.id && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-56 rounded-2xl shadow-2xl p-4 z-20"
                    style={{
                      background: dark ? 'rgba(35,35,74,0.97)' : 'rgba(255,255,255,0.97)',
                      backdropFilter: 'blur(16px)',
                      border: dark ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(124,58,237,0.12)',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${user.color} rounded-full flex items-center justify-center text-xl`}>
                        {user.avatar}
                      </div>
                      <div className="flex-1 text-right">
                        <div className={`font-black ${dark ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                        <div className={`text-xs ${dark ? 'text-purple-300' : 'text-gray-500'}`}>{user.nameEn}</div>
                      </div>
                    </div>
                    <div
                      className="rounded-xl px-3 py-2 mb-3"
                      style={{ background: dark ? 'rgba(13,13,31,0.8)' : 'rgba(243,241,255,0.8)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{user.duration}</span>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{user.activity}</div>
                          <div className={`text-xs ${dark ? 'text-purple-300' : 'text-gray-500'}`}>{user.activityEn}</div>
                        </div>
                      </div>
                    </div>
                    <button className={`w-full py-2.5 rounded-full bg-gradient-to-r ${user.color} text-white font-black text-sm shadow-md`}>
                      הצטרף
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative opacity-40">
                <div className={`w-14 h-14 rounded-full p-0.5 shadow-md ${dark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl grayscale ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    {user.avatar}
                  </div>
                </div>
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-center ${dark ? 'text-gray-600' : 'text-gray-500'}`}>
                  לא מחובר
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
