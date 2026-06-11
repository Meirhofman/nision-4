const STORAGE_KEYS = {
  USER: 'lahoz_user',
  USER_DATA: 'lahoz_userData',
  APP_STATE: 'lahoz_appState',
};

export interface StoredUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  lastLogin: number;
}

export interface DailyGoals {
  water: number; // cups/liters
  calories: number;
  steps: number;
  workoutMinutes: number;
}

export interface StoredAppState {
  userData: {
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    goal?: string;
    fitness?: string;
    medicalConditions?: string[];
    allergies?: string;
    additionalHealthInfo?: string;
    displayName?: string;
    username?: string;
    password?: string;
  };
  points?: number;
  nutritionData?: any;
  socialData?: any;
  characterState?: any;
  language?: 'en' | 'he';
  workoutHistory?: any[];
  pointsHistory?: any[];
  lastLoginDate?: string; // YYYY-MM-DD
  currentStreak?: number;
  dailyGoals?: DailyGoals;
  dailyProgress?: {
    water: number;
    calories: number;
    steps: number;
    workoutMinutes: number;
    date: string; // YYYY-MM-DD
  };
}

export function saveUser(user: StoredUser): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
      ...user,
      lastLogin: Date.now(),
    }));
  } catch (e) {
    console.warn('Failed to save user', e);
  }
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAppState(state: StoredAppState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save app state', e);
  }
}

export function getStoredAppState(): StoredAppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export function updateLoginStreak(): number {
  const storedState = getStoredAppState();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  let currentStreak = storedState?.currentStreak || 0;
  const lastLoginDate = storedState?.lastLoginDate;

  if (lastLoginDate === today) {
    // Already logged in today, do nothing
    return currentStreak;
  }

  if (lastLoginDate === yesterday) {
    // Streak continues!
    currentStreak += 1;
  } else {
    // Streak broken, reset to 1
    currentStreak = 1;
  }

  // Save updated state
  saveAppState({
    ...(storedState || {}),
    lastLoginDate: today,
    currentStreak: currentStreak,
  });

  return currentStreak;
}

export function clearStoredData(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.APP_STATE);
}
