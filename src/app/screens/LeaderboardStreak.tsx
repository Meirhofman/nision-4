import React from 'react';
import { Trophy } from 'lucide-react';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { NewTopBar } from '../components/NewTopBar';
import { UserAvatar } from '../components/UserAvatar';

interface LeaderboardUser {
  id: string;
  name: string;
  displayName: string;
  photoURL: string | null;
  streak: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: Omit<LeaderboardUser, 'isCurrentUser'>[] = [
  { id: '1', name: 'מיכל כהן', displayName: 'מיכל כהן', photoURL: null, streak: 25 },
  { id: '2', name: 'דוד לוי', displayName: 'דוד לוי', photoURL: null, streak: 22 },
  { id: '3', name: 'שרה אברהם', displayName: 'שרה אברהם', photoURL: null, streak: 19 },
  { id: '4', name: 'יעקב מזרחי', displayName: 'יעקב מזרחי', photoURL: null, streak: 15 },
  { id: '5', name: 'אסתר כהן', displayName: 'אסתר כהן', photoURL: null, streak: 12 },
];

const MEDAL_CONFIG = [
  { emoji: '🥇', bg: '#FFF8E7' },
  { emoji: '🥈', bg: '#F5F5F5' },
  { emoji: '🥉', bg: '#FFF5F0' },
] as const;

export function LeaderboardStreak() {
  const { currentStreak, currentUser, userData } = useApp();

  const currentName = userData?.displayName || currentUser?.displayName || 'אני';

  const leaderboardData: LeaderboardUser[] = [
    ...MOCK_LEADERBOARD,
    {
      id: 'me',
      name: currentName,
      displayName: currentName,
      photoURL: currentUser?.photoURL ?? null,
      streak: currentStreak,
      isCurrentUser: true,
    },
  ].sort((a, b) => b.streak - a.streak);

  const getMedal = (index: number) => {
    if (index < 3) return MEDAL_CONFIG[index];
    return null;
  };

  return (
    <MobileContainer className="bg-[#F9F9F9]">
      <NewTopBar title="טבלת רצפים" />
      <div className="flex flex-col gap-5 px-5 pt-4 pb-8 h-full overflow-y-auto">
        {/* כרטיסיית הרצף האישי */}
        <div
          className="bg-white text-center py-6 px-5"
          style={{ borderRadius: 20, border: '0.5px solid #F0F0F0' }}
        >
          <p className="text-[13px] text-[#999999] mb-3">הרצף שלך</p>
          <div className="flex justify-center items-center gap-2 mb-2">
            <span
              className="text-[#1a1a1a]"
              style={{ fontSize: 48, fontWeight: 500, lineHeight: 1 }}
            >
              {currentStreak}
            </span>
            <span style={{ fontSize: 36, lineHeight: 1 }}>🔥</span>
          </div>
          <p className="text-[13px] text-[#999999]">ימים ברצף</p>
        </div>

        {/* טבלת המובילים */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-medium text-[#1a1a1a]">טבלת המובילים</h3>
            <Trophy size={18} className="text-[#E9A800]" />
          </div>

          {leaderboardData.map((user, index) => {
            const medal = getMedal(index);
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`relative flex items-center gap-3 px-4 bg-white ${isCurrentUser ? 'pt-7 pb-3' : 'py-3'}`}
                style={{
                  borderRadius: 16,
                  border: isCurrentUser ? '0.5px solid #E0D9FF' : '0.5px solid #F0F0F0',
                  background: isCurrentUser ? '#F4F0FF' : '#ffffff',
                }}
              >
                {isCurrentUser && (
                  <span
                    className="absolute top-2 left-3 text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: '#EEEDFE', color: '#534AB7' }}
                  >
                    אתה
                  </span>
                )}

                <span
                  className="font-medium text-[#1a1a1a] tabular-nums shrink-0"
                  style={{ fontSize: 15, minWidth: 28 }}
                >
                  {user.streak}
                </span>

                <span className="text-base shrink-0">🔥</span>

                <UserAvatar
                  photoURL={user.photoURL}
                  displayName={user.displayName}
                  size={36}
                />

                <span className="flex-1 text-[14px] font-medium text-[#1a1a1a] truncate">
                  {user.name}
                </span>

                {medal ? (
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: medal.bg,
                      fontSize: 14,
                    }}
                  >
                    {medal.emoji}
                  </div>
                ) : (
                  <span
                    className="text-[12px] text-[#999999] font-medium shrink-0"
                    style={{ width: 28, textAlign: 'center' }}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MobileContainer>
  );
}
