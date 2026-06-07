import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft, ChevronRight, Trophy, Swords, Users, Zap,
  MapPin, Calendar, Clock, Star, X, AlertTriangle,
  CheckCircle2, User, Navigation, Menu, Share2
} from 'lucide-react';
import { Button } from '../components/ui';

type Tab = 'competitions' | 'challenges' | 'workouts' | 'live';

interface Competition {
  id: string;
  name: string;
  type: string;
  participants: number;
  reward: number;
  startsIn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Workout {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  cost: number;
  isFree: boolean;
}

interface Challenge {
  id: string;
  name: string;
  from: string;
  type: string;
  target: string;
  status: 'pending' | 'accepted' | 'active';
  isUserCreated?: boolean;
}

export const SocialScreen = () => {
  const navigate = useNavigate();
  const { t, isRTL, points, deductPoints, socialData, updateSocialData, darkMode } = useApp();

  const [currentTab, setCurrentTab] = useState<Tab>('competitions');
  const [showTutorial, setShowTutorial] = useState(!socialData.hasSeenTutorial);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showCompetitionDetails, setShowCompetitionDetails] = useState<string | null>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState<string | null>(null);
  const [showChallengeCreate, setShowChallengeCreate] = useState(false);
  const [showLiveWarning, setShowLiveWarning] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Form states for new challenge
  const [newChallengeType, setNewChallengeType] = useState('ריצה');
  const [newChallengeTarget, setNewChallengeTarget] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');

  // Mock data
  const competitions: Competition[] = [
    { id: '1', name: 'מרתון שבועי', type: 'ריצה', participants: 47, reward: 500, startsIn: 'מתחיל בעוד 2 ימים', difficulty: 'medium' },
    { id: '2', name: 'ספרינט 5K', type: 'ריצה', participants: 62, reward: 300, startsIn: 'מתחיל בעוד 1 יום', difficulty: 'easy' },
    { id: '3', name: 'אתגר יומי', type: 'פעילות כללית', participants: 124, reward: 200, startsIn: 'פעיל עכשיו', difficulty: 'easy' },
  ];

  const workouts: Workout[] = [
    { id: '1', name: 'ריצת קבוצה', type: 'ריצה', date: '', time: '', location: '', participants: 14, cost: 0, isFree: true },
    { id: '2', name: 'הליכה סטאדית', type: 'הליכה', date: '', time: '', location: '', participants: 18, cost: 0, isFree: true },
    { id: '3', name: 'זומבה', type: 'ריקוד', date: '', time: '', location: '', participants: 12, cost: 0, isFree: true },
    { id: '4', name: 'פילאטיס', type: 'אימון גוף', date: '', time: '', location: '', participants: 8, cost: 0, isFree: true },
  ];

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '1', name: 'ריצת 5K מהירה', from: 'מיכל כהן', type: 'ריצה', target: '5 ק״מ תוך 30 דקות', status: 'pending' },
    { id: '2', name: 'מאיה לוי', from: 'מאיה לוי', type: 'הליכה', target: '15,000 צעדים ביום', status: 'active' },
    { id: '3', name: 'יונתן שמיר', from: 'יונתן שמיר', type: 'כללי', target: 'אימון 5 ימים השבוע', status: 'accepted' },
  ]);

  const leaderboard = [
    { name: 'עדי גלבוע', distance: '12.5 ק״מ', speed: '12.5 קמ״ש', points: 500, position: 1 },
    { name: 'מיכל כהן', distance: '11.8 ק״מ', speed: '12.0 קמ״ש', points: 300, position: 2 },
    { name: 'אשרף זרעי', distance: '7.8 ק״מ', speed: '11.6 קמ״ש', points: 200, position: 3 },
    { name: 'את/ה', distance: '7.3 ק״מ', speed: '11.4 קמ״ש', points: 0, position: 4 },
  ];

  const liveRunners = [
    { name: 'עדי גלבוע', lat: 32.0853, lng: 34.7818, speed: 12.5, position: 1 },
    { name: 'מיכל כהן', lat: 32.0843, lng: 34.7808, speed: 12.0, position: 2 },
    { name: 'שומר', lat: 32.0833, lng: 34.7798, speed: 11.6, position: 3 },
  ];

  const tutorialContent = [
    {
      icon: <Trophy className="text-purple-500" size={48} />,
      title: 'ברוכים הבאים!',
      description: 'המסך החברתי שלך למטרות ואתגרים קבוצתיים',
      bullets: [
        'כאן תוכל להתחרות עם חברים',
        'להתגרות זה בזה ולהרגיש קהילתיים',
        'ליצור אתגרים משלך, להרשם לספרינטים ופעילויות במחיר מופחת',
        'להתאמן עם אנשים אחרים בסביבה',
      ],
    },
    {
      icon: <Swords className="text-blue-500" size={48} />,
      title: 'אתגרים עם חברים 🔥',
      description: 'צור אתגר משלך והזמן את החברים',
      bullets: [
        'בטאב ״אתגרים״ תוכל ליצור אתגר אישי עם חבר',
        'לבחור סוג פעילות ומטרה (ריצה 5 ק״מ, השגת צעדים)',
        'להתגר זה בזה כמו מי ישלים ראשון',
        'להגדיר מטרה משותפת, ולראות לוח התקדמות שלך',
        '',
        'משתפרים בארוך - תקבל עד 150 נקודות בהתאם לרמת קושי המטרה',
      ],
    },
    {
      icon: <Zap className="text-red-500" size={48} />,
      title: 'מצב לייב בזמן אמת ⚡',
      description: 'תחרות לייב מאפשרת לך לראות בזמן אמת:',
      bullets: [
        'מפה עם כל המשתתפים שרצים באותו מסלול',
        'קריאת מיקום של כל משתתף על המפה',
        'מהירות ממוצעת של כל משתתף',
        'מי מוביל בתחרות',
        '',
        'שים לב: המיקום שלך יוצג בזמן התחרות. במהלך השימוש תופיע אזהרת פרטיות ונבקש את הסכמתך',
      ],
    },
  ];

  const handleCreateChallenge = () => {
    if (!newChallengeTarget.trim()) {
      alert('נא להזין מטרה לאתגר');
      return;
    }

    const newChallenge: Challenge = {
      id: Math.random().toString(36).substring(7),
      name: newChallengeType + ' עם חברים',
      from: 'את/ה',
      type: newChallengeType,
      target: newChallengeTarget,
      status: 'active',
      isUserCreated: true
    };

    setChallenges(prev => [newChallenge, ...prev]);
    setShowChallengeCreate(false);
    setNewChallengeTarget(''); // reset
  };

  const handleCompetitionRegister = (comp: Competition) => {
    if (socialData.registeredCompetitions.includes(comp.id)) {
      // Already registered
      return;
    }

    const registered = [...socialData.registeredCompetitions, comp.id];
    updateSocialData({ registeredCompetitions: registered });
    setShowCompetitionDetails(null);
  };

  const handleWorkoutRegister = (workout: Workout) => {
    if (socialData.registeredWorkouts.includes(workout.id)) {
      return;
    }

    if (!workout.isFree) {
      const success = deductPoints(workout.cost);
      if (!success) {
        alert('אין מספיק נקודות!');
        return;
      }
    }

    const registered = [...socialData.registeredWorkouts, workout.id];
    updateSocialData({ registeredWorkouts: registered });
    setShowWorkoutDetails(null);
  };

  const handleChallengeAccept = (challengeId: string) => {
    const registered = [...socialData.registeredChallenges, challengeId];
    updateSocialData({ registeredChallenges: registered });
  };

  const handleTutorialComplete = () => {
    updateSocialData({ hasSeenTutorial: true });
    setShowTutorial(false);
  };

  const handleLiveAccess = () => {
    setShowLiveWarning(true);
  };

  const handleLiveWarningAccept = () => {
    setShowLiveWarning(false);
    setShowLiveMap(true);
  };

  const difficultyColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-200 to-orange-200',
    hard: 'from-red-400 to-pink-500',
  };

  return (
    <MobileContainer className="min-h-screen relative flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 dark:bg-slate-700 dark:border-slate-600">
              <Star className="text-yellow-400" size={16} />
              <span className="font-bold text-gray-800 text-base dark:text-white">{points}</span>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200 transition-all text-gray-600 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:text-gray-300"
            >
              <Menu size={22} />
            </button>
          </div>

          <button
            onClick={() => navigate('/main')}
            className={`p-3 shadow-lg border rounded-full text-pink-400 hover:scale-105 transition-transform ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-100'}`}
          >
            {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight dark:text-white">המסך החברתי</h1>
        </div>
      </div>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-16 left-4 rounded-2xl shadow-xl z-50 overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-white'}`}
          >
            <button
              onClick={() => {
                setShowMenu(false);
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className={`w-full px-6 py-3 text-right flex items-center gap-2 transition-colors ${darkMode ? 'hover:bg-slate-600 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <span>הדרכה</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className={`flex gap-2 px-4 py-3 overflow-x-auto border-b ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
        <button
          onClick={() => setCurrentTab('competitions')}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${currentTab === 'competitions'
            ? 'bg-pink-100 text-pink-600 shadow-sm'
            : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          🏆 תחרויות
        </button>
        <button
          onClick={() => setCurrentTab('challenges')}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${currentTab === 'challenges'
            ? 'bg-pink-100 text-pink-600 shadow-sm'
            : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          ⚔️ אתגרים
        </button>
        <button
          onClick={() => setCurrentTab('workouts')}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${currentTab === 'workouts'
            ? 'bg-pink-100 text-pink-600 shadow-sm'
            : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          💪 אימונים
        </button>
        <button
          onClick={handleLiveAccess}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${currentTab === 'live'
            ? 'bg-red-100 text-red-600 shadow-sm'
            : 'bg-red-50 text-red-400 border border-red-100 hover:bg-red-100'
            }`}
        >
          ⚡ LIVE
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 px-4 pt-4">
        <div className="max-w-md mx-auto space-y-4">

          {/* Competitions Tab */}
          {currentTab === 'competitions' && (
            <>
              {/* Leaderboard */}
              <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800 text-lg">🏆 טבלת מובילים</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">שבוע</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">יום</button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-3 mb-3">
                  <p className="text-xs text-orange-600 font-medium text-center mb-2">נקודות שבועיות</p>
                  <div className="space-y-2">
                    {leaderboard.map((user, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${user.position === 1 ? 'bg-gradient-to-r from-yellow-300 to-orange-300 text-white' :
                        user.position === 2 ? 'bg-gray-100 text-gray-800' :
                          user.position === 3 ? 'bg-orange-100 text-gray-800' :
                            'bg-white text-gray-700'
                        }`}>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : user.position === 3 ? '🥉' : user.position}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-xs opacity-80">{user.distance} • {user.speed}</p>
                        </div>
                        {user.points > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="fill-current" size={14} />
                            <span className="font-bold text-sm">{user.points}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">מי שמשלים מטרה ראשון מקבל +150 נקודות</p>
              </div>

              {/* Competitions List */}
              <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-lg">
                <h2 className="font-bold text-gray-800 text-lg mb-4">תחרויות בסביבה</h2>
                <div className="space-y-3">
                  {competitions.map((comp) => {
                    const isRegistered = socialData.registeredCompetitions.includes(comp.id);
                    return (
                      <div
                        key={comp.id}
                        className={`rounded-2xl p-4 border-2 transition-all ${isRegistered
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                          : 'bg-slate-50 border-slate-200 hover:border-purple-200'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">{comp.name}</h3>
                              {isRegistered && (
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                  ✓ רשום
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{comp.type} • {comp.participants} משתתפים</p>
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-1 text-orange-500">
                              <Star className="fill-current" size={14} />
                              <span className="font-bold text-sm">{comp.reward}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {comp.startsIn}
                          </span>
                          <button
                            onClick={() => setShowCompetitionDetails(comp.id)}
                            className="text-xs text-purple-600 font-medium hover:underline"
                          >
                            פרטים והרשמה →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Challenges Tab */}
          {currentTab === 'challenges' && (
            <>
              <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800 text-lg">⚔️ אתגרים עם חברים</h2>
                  <button
                    onClick={() => setShowChallengeCreate(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold hover:from-purple-600 hover:to-pink-600"
                  >
                    + צור אתגר
                  </button>
                </div>

                <div className="space-y-3">
                  {challenges.filter(c => !c.isUserCreated).map((challenge) => {
                    const isAccepted = socialData.registeredChallenges.includes(challenge.id);
                    return (
                      <div key={challenge.id} className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                            <User className="text-purple-600" size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">{challenge.from}</p>
                            <p className="text-sm text-gray-600">{challenge.type}</p>
                          </div>
                          {challenge.status === 'pending' && !isAccepted && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                              ממתין
                            </span>
                          )}
                          {isAccepted && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              אושר ✓
                            </span>
                          )}
                        </div>

                        <div className="bg-white rounded-xl p-3 mb-3">
                          <p className="text-sm text-gray-700 mb-1"><strong>מטרה:</strong> {challenge.target}</p>
                        </div>

                        {challenge.status === 'pending' && !isAccepted && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleChallengeAccept(challenge.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition-colors"
                            >
                              ✓ אשר השתתפות
                            </button>
                            <button className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-xl transition-colors">
                              ✕
                            </button>
                          </div>
                        )}

                        {isAccepted && (
                          <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-700">
                            <p className="mb-1"><strong>מיקום:</strong> פארק הירקון, תל אביב</p>
                            <p className="mb-1"><strong>תאריך:</strong> 25/02 (יום חמישי)</p>
                            <p><strong>שעה:</strong> 17:00</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    const appUrl = "https://fitapp.io/app";
                    navigator.clipboard.writeText(appUrl);
                    alert("קישור לאפליקציה הועתק! שלח לחברים כדי שיוכלו להצטרף 🔥");
                  }}
                  className="w-full mt-4 bg-blue-50 hover:bg-blue-100 rounded-2xl p-4 text-center border-2 border-dashed border-blue-200 transition-all group"
                >
                  <p className="text-sm text-blue-700 font-bold flex items-center justify-center gap-2">
                    <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                    הזמן חברים ליצור אתגרים משותפים! 🔗
                  </p>
                </button>
              </div>

              {/* My Challenges */}
              <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-lg">
                <h2 className="font-bold text-gray-800 text-lg mb-4">🔥 האתגרים שלי</h2>
                <div className="space-y-3">
                  {challenges.filter(c => c.isUserCreated).length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Swords size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">טרם יצרת אתגרים</p>
                    </div>
                  ) : (
                    challenges.filter(c => c.isUserCreated).map((challenge) => (
                      <div key={challenge.id} className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-purple-800">{challenge.type} עם חברים</h3>
                          <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-bold">פעיל</span>
                        </div>
                        <p className="text-sm text-purple-600"><strong>מטרה:</strong> {challenge.target}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Workouts Tab */}
          {currentTab === 'workouts' && (
            <>
              <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-lg">
                <h2 className="font-bold text-gray-800 text-lg mb-4">💪 אימונים חברתיים</h2>

                <div className="space-y-3">
                  {workouts.map((workout) => {
                    const isRegistered = socialData.registeredWorkouts.includes(workout.id);
                    return (
                      <div
                        key={workout.id}
                        className={`rounded-2xl p-4 border-2 transition-all ${isRegistered
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">{workout.name}</h3>
                              {isRegistered && (
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                  ✓ רשום
                                </span>
                              )}
                              {workout.isFree && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                  חינם
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{workout.type} • {workout.participants} משתתפים</p>
                          </div>
                          {/* Removed points cost display */}
                        </div>

                        <button
                          onClick={() => setShowWorkoutDetails(workout.id)}
                          className="w-full mt-3 text-xs text-purple-600 font-medium hover:underline text-right"
                        >
                          פרטים והרשמה →
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 bg-purple-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-purple-700 mb-2">
                    💡 <strong>איך זה עובד?</strong>
                  </p>
                  <p className="text-xs text-purple-600">
                    אימונים חינמיים (ריצה, הליכה) - פשוט להירשם!<br />
                    אימונים מיוחדים - תשלום בנקודות שצברתם מהתזונה והפעילות! קבלו בונוס על כל אימון קבוצתי.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFF0F3] dark:bg-slate-800 rounded-3xl p-6 w-[90%] max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl relative border border-white/50 dark:border-slate-600"
            >
              <button
                onClick={handleTutorialComplete}
                className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
              >
                <X size={16} />
              </button>
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-6">
                {tutorialContent.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${index === tutorialStep ? 'w-8 bg-purple-500' : 'w-2 bg-gray-300'
                      }`}
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {tutorialContent[tutorialStep].icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">
                  {tutorialContent[tutorialStep].title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">
                  {tutorialContent[tutorialStep].description}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-right dark:bg-slate-700">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  {tutorialContent[tutorialStep].bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {bullet && <span className="text-purple-500 mt-1">•</span>}
                      <span className={bullet ? '' : 'font-bold text-purple-700 dark:text-purple-300'}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                {tutorialStep < tutorialContent.length - 1 ? (
                  <>
                    <button
                      onClick={handleTutorialComplete}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-gray-200"
                    >
                      דלג על ההדרכה
                    </button>
                    <button
                      onClick={() => setTutorialStep(tutorialStep + 1)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      הבא →
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleTutorialComplete}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    בוא נתחיל! 🚀
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Competition Details Modal */}
      <AnimatePresence>
        {showCompetitionDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end"
            onClick={() => setShowCompetitionDetails(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFF9F2] rounded-t-3xl w-full p-6"
            >
              {(() => {
                const comp = competitions.find(c => c.id === showCompetitionDetails)!;
                const isRegistered = socialData.registeredCompetitions.includes(comp.id);
                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{comp.name}</h2>
                      <button onClick={() => setShowCompetitionDetails(null)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={18} />
                        <span className="text-sm">{comp.participants} משתתפים רשומים</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={18} />
                        <span className="text-sm">{comp.startsIn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600">
                        <Star className="fill-current" size={18} />
                        <span className="text-sm font-bold">פרס: {comp.reward} נקודות</span>
                      </div>
                    </div>

                    {isRegistered ? (
                      <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 text-center">
                        <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
                        <p className="font-bold text-green-700">נרשמת בהצלחה! ✓</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompetitionRegister(comp)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl"
                      >
                        הרשם לתחרות
                      </button>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Details Modal */}
      <AnimatePresence>
        {showWorkoutDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end"
            onClick={() => setShowWorkoutDetails(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F0F9FF] rounded-t-3xl w-full p-6"
            >
              {(() => {
                const workout = workouts.find(w => w.id === showWorkoutDetails)!;
                const isRegistered = socialData.registeredWorkouts.includes(workout.id);
                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{workout.name}</h2>
                      <button onClick={() => setShowWorkoutDetails(null)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                      </button>
                    </div>

                    {isRegistered ? (
                      <>
                        <div className="bg-purple-50 rounded-2xl p-4 mb-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={16} />
                            <span>פארק הירקון, תל אביב</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} />
                            <span>25/02/2026 (יום חמישי)</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock size={16} />
                            <span>18:00</span>
                          </div>
                        </div>

                        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 text-center">
                          <CheckCircle2 className="mx-auto text-green-500 mb-2" size={32} />
                          <p className="font-bold text-green-700">נרשמת בהצלחה! ✓</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users size={18} />
                            <span className="text-sm">{workout.participants} משתתפים</span>
                          </div>
                          {!workout.isFree && (
                            <div className="flex items-center gap-2 text-orange-600">
                              <Star className="fill-current" size={18} />
                              <span className="text-sm font-bold">תשלום: {workout.cost} נקודות</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleWorkoutRegister(workout)}
                          className={`w-full font-bold py-4 rounded-2xl ${workout.isFree
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                            : points >= workout.cost
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          disabled={!workout.isFree && points < workout.cost}
                        >
                          {workout.isFree ? 'הרשם לאימון (חינם)' : `הרשם ותשלם ${workout.cost} נקודות`}
                        </button>

                        {!workout.isFree && points < workout.cost && (
                          <p className="text-red-500 text-xs text-center mt-2">אין מספיק נקודות</p>
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showChallengeCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end"
            onClick={() => setShowChallengeCreate(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF5FF] rounded-t-3xl w-full p-6 max-h-[80vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">צור אתגר חדש</h2>
                <button onClick={() => setShowChallengeCreate(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סוג אתגר</label>
                  <select
                    value={newChallengeType}
                    onChange={(e) => setNewChallengeType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 shadow-inner"
                  >
                    <option>ריצה</option>
                    <option>הליכה</option>
                    <option>רכיבה</option>
                    <option>פעילות כללית</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">מטרה</label>
                  <input
                    type="text"
                    value={newChallengeTarget}
                    onChange={(e) => setNewChallengeTarget(e.target.value)}
                    placeholder="לדוגמה: 5 ק״מ תוך 30 דקות"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הזמן חברים לפי שם משתמש</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteUsername}
                      onChange={(e) => setInviteUsername(e.target.value)}
                      placeholder="הזן שם משתמש..."
                      className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner"
                    />
                    <button
                      onClick={() => {
                        if (inviteUsername.trim()) {
                          alert(`הזמנה נשלחה ל-${inviteUsername}! ✓`);
                          setInviteUsername('');
                        }
                      }}
                      className="px-4 py-3 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                    >
                      הזמן
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="copy-link-btn"
                    onClick={() => {
                      const link = "https://fitapp.io/invite/challenge_" + Math.random().toString(36).substring(7);
                      navigator.clipboard.writeText(link);
                      const btn = document.getElementById('copy-link-btn');
                      if (btn) {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<span>הקישור הועתק! ✓</span>';
                        btn.classList.add('bg-green-50', 'border-green-300', 'text-green-600');
                        setTimeout(() => {
                          btn.innerHTML = originalText;
                          btn.classList.remove('bg-green-50', 'border-green-300', 'text-green-600');
                        }, 2000);
                      }
                    }}
                    className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-all"
                  >
                    <Share2 size={18} />
                    <span>העתק קישור להזמנה 🔗</span>
                  </button>
                </div>

                <button
                  onClick={handleCreateChallenge}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  צור אתגר 🚀
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Warning Modal */}
      <AnimatePresence>
        {showLiveWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#FFF5F5] rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="text-red-500" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t('liveModeTitle')}</h2>
                <p className="text-sm text-gray-600 mb-4">{t('liveCompetitions')}</p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 text-right">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="text-red-500 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-800 mb-2">{t('liveWarningTitle')}</p>
                    <ul className="text-xs text-red-700 space-y-1 whitespace-pre-line">
                      {t('liveWarningPoints').split('\n').map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-600 mt-3 font-bold">
                      {t('livePrivacyNote')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLiveWarning(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                >
                  {t('back')}
                </button>
                <button
                  onClick={handleLiveWarningAccept}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Zap size={18} />
                  {t('enterLive')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Map Modal */}
      <AnimatePresence>
        {showLiveMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50"
          >
            <div className="h-full flex flex-col">
              {/* Live Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setShowLiveMap(false)}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <X size={20} className="text-white" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-sm">LIVE 🔴</span>
                  </div>
                </div>
                <h1 className="text-xl font-bold text-white text-center">תחרות בשידור חי</h1>
                <p className="text-white/90 text-sm text-center">מרתון תל אביב - הפארק אביב</p>
              </div>

              {/* Map Placeholder */}
              <div className="flex-1 bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                  {/* Simulated Map with Runners */}
                  <div className="relative w-full h-full">
                    {liveRunners.map((runner, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="absolute"
                        style={{
                          left: `${20 + index * 25}%`,
                          top: `${30 + index * 15}%`,
                        }}
                      >
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${runner.position === 1 ? 'bg-yellow-400' :
                            runner.position === 2 ? 'bg-gray-300' :
                              'bg-orange-300'
                            } shadow-lg border-4 border-white`}>
                            <span className="text-xl">🏃</span>
                          </div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-md whitespace-nowrap">
                            <p className="text-xs font-bold text-gray-800">{runner.name}</p>
                            <p className="text-xs text-gray-600">{runner.speed} קמ״ש</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path
                        d="M 50 100 Q 150 150, 250 200 T 350 300"
                        stroke="#8b5cf6"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="8,4"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Live Stats */}
              <div className="bg-white p-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Navigation className="text-purple-500" size={18} />
                  סיכום בזמן אמת (4) משתתפים
                </h3>
                <div className="space-y-2">
                  {leaderboard.slice(0, 4).map((runner, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${runner.position === 1 ? 'bg-yellow-400 text-white' :
                        runner.position === 2 ? 'bg-gray-300 text-gray-800' :
                          runner.position === 3 ? 'bg-orange-300 text-gray-800' :
                            'bg-gray-200 text-gray-700'
                        }`}>
                        {runner.position}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800">{runner.name}</p>
                        <p className="text-xs text-gray-600">
                          {runner.distance} • {runner.speed}
                        </p>
                      </div>
                      {runner.position === 1 && (
                        <Trophy className="text-yellow-500" size={20} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
