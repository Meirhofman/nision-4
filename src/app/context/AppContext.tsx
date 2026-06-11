import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, Language } from './translations';
import {
  getStoredAppState,
  saveAppState,
  getStoredUser,
  clearStoredData,
  type StoredUser,
  type StoredAppState,
  updateLoginStreak,
} from '../../lib/storage';
import { signOut as authSignOut, handleRedirectResult } from '../../lib/auth';
import { listenToAuthState } from '../../lib/firebase';

const DEFAULT_USER_DATA = { 
  age: 14, 
  weight: 50, 
  height: 160,
  medicalConditions: [],
  allergies: '',
  additionalHealthInfo: '',
  goal: 'generalHealth',
  fitness: 'beginner'
};
const DEFAULT_NUTRITION = { meals: {}, water: 0, archive: [] };
const DEFAULT_SOCIAL = {
  registeredCompetitions: [],
  registeredWorkouts: [],
  registeredChallenges: [],
  hasSeenTutorial: false,
};
const DEFAULT_WORKOUT_HISTORY: any[] = [];
const DEFAULT_CHARACTER = {
  modelType: 'v2',
  skin: 'blue',
  hat: 'none',
  shirt: 'none',
  pants: 'none',
  shoes: 'none',
  accessory: 'none',
  hatPos: { x: 0, y: 0 },
  shirtPos: { x: 0, y: 0 },
  accessoryPos: { x: 0, y: 0 },
};

const DEFAULT_DAILY_GOALS = {
  water: 8,
  calories: 2000,
  steps: 10000,
  workoutMinutes: 30,
};

const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  userData: any;
  updateUserData: (data: any) => void;
  isRTL: boolean;
  points: number;
  addPoints: (amount: number) => void;
  deductPoints: (amount: number) => boolean;
  nutritionData: any;
  updateNutritionData: (data: any) => void;
  socialData: any;
  updateSocialData: (data: any) => void;
  characterState: any;
  updateCharacterState: (data: any) => void;
  workoutHistory: any[];
  addWorkoutToHistory: (workout: any) => void;
  logout: () => void;
  currentUser: StoredUser | null;
  hasSeenMainTutorial: boolean;
  setHasSeenMainTutorial: (seen: boolean) => void;
  showMainTutorial: () => void;
  setCurrentUser: (user: StoredUser | null) => void;
  loadStoredState: (state: StoredAppState) => void;
  persistState: () => void;
  resetToDefaults: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  currentStreak: number;
  dailyGoals: {
    water: number;
    calories: number;
    steps: number;
    workoutMinutes: number;
  };
  dailyProgress: {
    water: number;
    calories: number;
    steps: number;
    workoutMinutes: number;
    date: string;
  };
  updateDailyGoals: (goals: any) => void;
  updateDailyProgress: (progress: any) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

function loadInitialState() {
  const stored = getStoredAppState();
  const today = getTodayString();
  if (stored) {
    return {
      language: stored.language || 'he',
      userData: stored.userData || DEFAULT_USER_DATA,
      points: stored.points ?? 1250,
      nutritionData: stored.nutritionData || DEFAULT_NUTRITION,
      socialData: stored.socialData || DEFAULT_SOCIAL,
      characterState: stored.characterState || DEFAULT_CHARACTER,
      workoutHistory: stored.workoutHistory || DEFAULT_WORKOUT_HISTORY,
      currentStreak: stored.currentStreak || 0,
      dailyGoals: stored.dailyGoals || DEFAULT_DAILY_GOALS,
      dailyProgress: stored.dailyProgress?.date === today 
        ? stored.dailyProgress 
        : { water: 0, calories: 0, steps: 0, workoutMinutes: 0, date: today },
    };
  }
  return {
    language: 'he' as Language,
    userData: DEFAULT_USER_DATA,
    points: 1250,
    nutritionData: DEFAULT_NUTRITION,
    socialData: DEFAULT_SOCIAL,
    characterState: DEFAULT_CHARACTER,
    workoutHistory: DEFAULT_WORKOUT_HISTORY,
    currentStreak: 0,
    dailyGoals: DEFAULT_DAILY_GOALS,
    dailyProgress: { water: 0, calories: 0, steps: 0, workoutMinutes: 0, date: today },
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => loadInitialState().language);
  const [userData, setUserData] = useState<any>(() => loadInitialState().userData);
  const [points, setPoints] = useState<number>(() => loadInitialState().points);
  const [nutritionData, setNutritionData] = useState<any>(() => loadInitialState().nutritionData);
  const [socialData, setSocialData] = useState<any>(() => loadInitialState().socialData);
  const [characterState, setCharacterState] = useState<any>(() => loadInitialState().characterState);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>(() => loadInitialState().workoutHistory);
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => getStoredUser());
  const [currentStreak, setCurrentStreak] = useState<number>(() => loadInitialState().currentStreak);
  const [dailyGoals, setDailyGoals] = useState<any>(() => loadInitialState().dailyGoals);
  const [dailyProgress, setDailyProgress] = useState<any>(() => loadInitialState().dailyProgress);
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lahoz_darkMode');
      return saved === 'true';
    }
    return false;
  });

  const [hasSeenMainTutorial, setHasSeenMainTutorialState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasSeenMainTutorial_v2') === 'true';
    }
    return false;
  });

  // Update streak on app load
  useEffect(() => {
    const newStreak = updateLoginStreak();
    setCurrentStreak(newStreak);
  }, []);

  useEffect(() => {
    localStorage.setItem('lahoz_darkMode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Handle Firebase redirect sign-in results (Google/Facebook/Apple)
  useEffect(() => {
    async function checkRedirectResult() {
      try {
        const user = await handleRedirectResult();
        if (user) {
          console.log('[AppContext] Redirect sign-in successful:', user);
          setCurrentUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
          localStorage.setItem('hasCompletedQuestionnaire_v1', 'true');
        }
      } catch (error) {
        console.error('[AppContext] Redirect sign-in error:', error);
      }
    }
    checkRedirectResult();

    // Listen to ongoing auth state changes
    const unsubscribe = listenToAuthState((firebaseUser) => {
      if (firebaseUser) {
        console.log('[AppContext] Auth state changed - user signed in:', firebaseUser.uid);
        setCurrentUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        });
        localStorage.setItem('hasCompletedQuestionnaire_v1', 'true');
      } else if (currentUser) {
        // If Firebase user signs out, clear our local user
        console.log('[AppContext] Auth state changed - user signed out');
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const setDarkMode = useCallback((v: boolean) => setDarkModeState(v), []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const updateUserData = useCallback((data: any) => {
    setUserData((prev: any) => ({ ...prev, ...data }));
  }, []);

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => prev + amount);
  }, []);

  const deductPoints = useCallback((amount: number): boolean => {
    let success = false;
    setPoints((prev) => {
      if (prev >= amount) {
        success = true;
        return prev - amount;
      }
      return prev;
    });
    return success;
  }, []);

  const updateNutritionData = useCallback((data: any) => {
    setNutritionData((prev: any) => ({ ...prev, ...data }));
  }, []);

  const updateSocialData = useCallback((data: any) => {
    setSocialData((prev: any) => ({ ...prev, ...data }));
  }, []);

  const updateCharacterState = useCallback((data: any) => {
    setCharacterState((prev: any) => ({ ...prev, ...data }));
  }, []);

  const addWorkoutToHistory = useCallback((workout: any) => {
    const newWorkout = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...workout
    };
    setWorkoutHistory((prev: any[]) => [newWorkout, ...prev]);
  }, []);

  const setHasSeenMainTutorial = useCallback((seen: boolean) => {
    setHasSeenMainTutorialState(seen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenMainTutorial_v2', String(seen));
    }
  }, []);

  const showMainTutorial = useCallback(() => {
    setHasSeenMainTutorialState(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasSeenMainTutorial_v2');
    }
  }, []);

  const updateDailyGoals = useCallback((goals: any) => {
    setDailyGoals((prev: any) => ({ ...prev, ...goals }));
  }, []);

  const updateDailyProgress = useCallback((progress: any) => {
    setDailyProgress((prev: any) => ({ ...prev, ...progress }));
  }, []);

  const persistState = useCallback(() => {
    saveAppState({
      language,
      userData,
      points,
      nutritionData,
      socialData,
      characterState,
      workoutHistory,
      currentStreak,
      dailyGoals,
      dailyProgress,
    });
  }, [language, userData, points, nutritionData, socialData, characterState, workoutHistory, currentStreak, dailyGoals, dailyProgress]);

  const loadStoredState = useCallback((state: StoredAppState) => {
    if (state.language) setLanguageState(state.language);
    if (state.userData) setUserData((prev: any) => ({ ...prev, ...state.userData }));
    if (state.points != null) setPoints(state.points);
    if (state.nutritionData) setNutritionData(state.nutritionData);
    if (state.socialData) setSocialData(state.socialData);
    if (state.characterState) setCharacterState(state.characterState);
  }, []);

  const resetToDefaults = useCallback(() => {
    setLanguageState('he');
    setUserData(DEFAULT_USER_DATA);
    setPoints(1250);
    setNutritionData(DEFAULT_NUTRITION);
    setSocialData(DEFAULT_SOCIAL);
    setCharacterState(DEFAULT_CHARACTER);
    setCurrentUser(null);
    clearStoredData();
  }, []);

  useEffect(() => {
    persistState();
  }, [persistState]);

  const logout = useCallback(async () => {
    try {
      await authSignOut();
    } catch (_) {
      /* Firebase not configured */
    }
    // Only clear the auth session - preserve questionnaire/profile data for returning users
    setCurrentUser(null);
    // Save state so it's available when they come back
    saveAppState({ language, userData, points, nutritionData, socialData, characterState });
    // Reset returning-user dialog so they see "use saved data?" next time
    sessionStorage.removeItem('lahoz_returning_asked');
  }, [language, userData, points, nutritionData, socialData, characterState]);

  const isRTL = language === 'he';

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userData,
        updateUserData,
        isRTL,
        points,
        addPoints,
        deductPoints,
        nutritionData,
        updateNutritionData,
        socialData,
        updateSocialData,
        characterState,
        updateCharacterState,
        workoutHistory,
        addWorkoutToHistory,
        logout,
        currentUser,
        setCurrentUser,
        loadStoredState,
        persistState,
        resetToDefaults,
        darkMode,
        setDarkMode,
        hasSeenMainTutorial,
        currentStreak,
        setHasSeenMainTutorial,
        showMainTutorial,
        dailyGoals,
        dailyProgress,
        updateDailyGoals,
        updateDailyProgress,
      }}
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`min-h-screen font-sans antialiased transition-all duration-300 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'text-slate-900 bg-pink-50/30'}`}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
