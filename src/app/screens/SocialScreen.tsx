import React, { useState } from 'react';
import { NewTopBar } from '../components/NewTopBar';
import LiveMapSection from '../components/LiveMapSection';
import CompetitionsSheet from '../components/CompetitionsSheet';
import ActivitiesSheet from '../components/ActivitiesSheet';
import LeaderboardSheet from '../components/LeaderboardSheet';
import { MobileContainer } from '../components/MobileContainer';
import { Trophy, Activity, Flame } from 'lucide-react';

export const SocialScreen = () => {
  const [activeSheet, setActiveSheet] = useState<'competitions' | 'activities' | 'leaderboard' | null>(null);

  const closeSheet = () => setActiveSheet(null);

  const buttons = [
    { id: 'competitions' as const, icon: Trophy, label: 'תחרויות', emoji: '🏆' },
    { id: 'activities' as const, icon: Activity, label: 'פעילויות', emoji: '🏃' },
    { id: 'leaderboard' as const, icon: Flame, label: 'מובילים', emoji: '🔥' },
  ];

  return (
    <MobileContainer className="h-[100dvh] overflow-hidden flex flex-col bg-white">
      <NewTopBar title="חברתי" />
      
      <div className="flex-1 relative flex flex-col">
        {/* Map Section */}
        <div className="flex-1">
          <LiveMapSection />
        </div>
        
        {/* Floating Buttons Below Map */}
        <div className="p-4">
          <div className="flex items-center justify-center gap-3">
            {buttons.map(({ id, icon: Icon, label, emoji }) => {
              const isActive = activeSheet === id;
              
              return (
                <button
                  key={id}
                  onClick={() => setActiveSheet(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-[#ff4d6d] text-white shadow-md'
                      : 'bg-[#F5F5F5] text-gray-700'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="font-bold text-sm">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <CompetitionsSheet isOpen={activeSheet === 'competitions'} onClose={closeSheet} />
      <ActivitiesSheet isOpen={activeSheet === 'activities'} onClose={closeSheet} />
      <LeaderboardSheet isOpen={activeSheet === 'leaderboard'} onClose={closeSheet} />
    </MobileContainer>
  );
};
