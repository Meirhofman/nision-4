import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { Settings, Utensils, Users, Dumbbell, TrendingUp } from 'lucide-react';
import { Character } from '../components/Character';
import { CLOTHING_ITEMS } from './CharacterScreen';
import { UserAvatar } from '../components/UserAvatar';

const NAV_CARDS = [
  {
    key: 'workouts',
    path: '/workouts',
    label: 'אימונים',
    Icon: Dumbbell,
    iconColor: '#534AB7',
    bg: '#F4F0FF',
    textColor: '#3D3580',
  },
  {
    key: 'nutrition',
    path: '/nutrition',
    label: 'תזונה',
    Icon: Utensils,
    iconColor: '#1D9E75',
    bg: '#E1F5EE',
    textColor: '#157A5C',
  },
  {
    key: 'social',
    path: '/social',
    label: 'חברתי',
    Icon: Users,
    iconColor: '#7F77DD',
    bg: '#EEEDFE',
    textColor: '#534AB7',
  },
  {
    key: 'streak',
    path: '/leaderboard-streak',
    label: 'טבלת רצף',
    Icon: TrendingUp,
    iconColor: '#D85A30',
    bg: '#FFF5F0',
    textColor: '#B84A28',
  },
] as const;

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="relative flex flex-col items-center mb-3" style={{ maxWidth: 200 }}>
      <div
        className="w-full text-center"
        style={{
          background: '#ffffff',
          border: '0.5px solid #F0F0F0',
          borderRadius: 20,
          padding: '10px 20px',
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--color-text-primary, #1a1a1a)',
            lineHeight: 1.4,
          }}
        >
          {text}
        </p>
      </div>
      {/* זנב — מצביע למטה לדמות */}
      <div
        style={{
          width: 12,
          height: 12,
          background: '#ffffff',
          borderRight: '0.5px solid #F0F0F0',
          borderBottom: '0.5px solid #F0F0F0',
          transform: 'rotate(45deg)',
          marginTop: -7,
        }}
      />
    </div>
  );
}

export const MainScreen = () => {
  const { characterState, currentUser, userData, language, t, darkMode } = useApp();
  const navigate = useNavigate();

  const displayName = userData?.displayName || currentUser?.displayName || 'מאיר';

  // Calculate daily progress percentage
  const dailyProgress = userData?.dailyProgress || 0;
  const progressPercentage = Math.min(100, Math.round((dailyProgress / (userData?.dailyGoals?.total || 100)) * 100));

  React.useEffect(() => {
    const hasBypassFlag = localStorage.getItem('hasCompletedQuestionnaire_v1');
    const hasCompletedQuestionnaire = userData?.goal && userData?.fitness;

    if (!hasCompletedQuestionnaire && !hasBypassFlag) {
      navigate('/questionnaire/language');
    }
  }, [userData, navigate]);

  const greeting = language === 'en' ? `Hello ${displayName}!` : `שלום ${displayName}!`;
  const subGreeting = language === 'en' ? 'Ready for your daily goals?' : 'מוכן ליעדים היומיים שלך?';

  return (
    <MobileContainer className={`min-h-[100dvh] overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-[#F9F9F9]'}`}>
      <div className="flex flex-col items-center justify-start h-full px-5 pt-8 pb-6">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <UserAvatar
              photoURL={currentUser?.photoURL}
              displayName={displayName}
              size={40}
            />
            <div>
              <h2 className={`text-[20px] font-medium ${darkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {greeting}
              </h2>
              <p className={`text-[13px] ${darkMode ? 'text-gray-400' : 'text-[#999999]'}`}>{subGreeting}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
            style={{ border: '0.5px solid #F0F0F0' }}
          >
            <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Daily Progress Bar */}
        <div className="w-full mb-8">
          <div className={`h-1 rounded-[2px] overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-[#E5E5E5]'}`}>
            <div
              className="h-full rounded-[2px] bg-gradient-to-r from-[#534AB7] to-[#A78BFA] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Character + בועת דיבור */}
        <div
          className="flex flex-col items-center mb-10 cursor-pointer"
          onClick={() => navigate('/character')}
        >
          <SpeechBubble text={language === 'en' ? 'Click me and discover! ✨' : 'לחצו עליי ותגלו ✨'} />

          <div className="w-[200px] h-[200px]">
            <Character
              state={characterState}
              width={200}
              clothingImages={{
                shirt: CLOTHING_ITEMS.find((item) => item.id === characterState.shirt)?.image,
                set: CLOTHING_ITEMS.find((item) => item.id === characterState.set)?.image,
                hat: CLOTHING_ITEMS.find((item) => item.id === characterState.hat)?.image,
                accessory: CLOTHING_ITEMS.find((item) => item.id === characterState.accessory)?.image,
              }}
            />
          </div>
        </div>

        {/* כרטיסיות ניווט */}
        <div className="w-full grid grid-cols-2 gap-3">
          {NAV_CARDS.map(({ key, path, label, Icon, iconColor, bg, textColor }) => (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2.5"
              style={{
                padding: 14,
                borderRadius: 16,
                background: bg,
              }}
            >
              <Icon className="w-7 h-7" style={{ color: iconColor }} />
              <span className="text-[13px] font-medium" style={{ color: textColor }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </MobileContainer>
  );
};
