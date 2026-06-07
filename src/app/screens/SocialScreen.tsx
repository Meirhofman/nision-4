import { useState } from 'react';
import TopBar from '../components/TopBar';
import LiveMapSection from '../components/LiveMapSection';
import FloatingActionButtons from '../components/FloatingActionButtons';
import CompetitionsSheet from '../components/CompetitionsSheet';
import ActivitiesSheet from '../components/ActivitiesSheet';
import LeaderboardSheet from '../components/LeaderboardSheet';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';

export function SocialScreen() {
  const { darkMode, setDarkMode } = useApp();
  const [activeSheet, setActiveSheet] = useState<'competitions' | 'activities' | 'leaderboard' | null>(null);

  const closeSheet = () => setActiveSheet(null);

  return (
    <MobileContainer noScroll className={`h-[100dvh] overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
      {/* Top Bar */}
      <TopBar isDarkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      {/* Main Map - fills remaining space */}
      <div className="flex-1 relative">
        <LiveMapSection isDarkMode={darkMode} />

        {/* Floating Action Buttons - Over the map */}
        <FloatingActionButtons
          activeButton={activeSheet}
          onButtonClick={setActiveSheet}
        />
      </div>

      {/* Bottom Sheets */}
      <CompetitionsSheet isOpen={activeSheet === 'competitions'} onClose={closeSheet} />
      <ActivitiesSheet isOpen={activeSheet === 'activities'} onClose={closeSheet} />
      <LeaderboardSheet isOpen={activeSheet === 'leaderboard'} onClose={closeSheet} />
    </MobileContainer>
  );
}
