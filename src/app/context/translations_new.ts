export type Language = 'en' | 'he';

export interface Translations {
  [key: string]: {
    en: string;
    he: string;
  };
}

export const translations: Translations = {
  // Common
  continue: { en: 'Continue', he: 'Continue' },
  next: { en: 'Next', he: 'Next' },
  back: { en: 'Back', he: 'Back' },
  skip: { en: 'Skip', he: 'Skip' },
  updating: { en: 'Updating...', he: 'Updating...' },

  // Login
  email: { en: 'Email', he: 'Email' },
  password: { en: 'Password', he: 'Password' },
  login: { en: 'Log In', he: 'Log In' },
  welcomeBack: { en: 'Welcome back!', he: 'Welcome back!' },
  readyForGoals: { en: 'Ready for your daily goals?', he: 'Ready for your daily goals?' },
  gettingStarted: { en: 'Getting started!', he: 'Getting started!' },
  createAccount: { en: 'New? Create Account', he: 'New? Create Account' },
  orLoginWith: { en: 'Or log in with', he: 'Or log in with' },

  // Post Login Popup
  changeLater: { en: 'You can change all details later.', he: 'You can change all details later.' },

  // Language Selection
  chooseLanguage: { en: 'Choose Language', he: 'Choose Language' },
  english: { en: 'English', he: 'English' },
  hebrew: { en: 'Hebrew', he: 'Hebrew' },

  // Questionnaire - Gender
  genderQuestion: { en: 'How should we refer to you?', he: 'How should we refer to you?' },
  male: { en: 'Male', he: 'Male' },
  female: { en: 'Female', he: 'Female' },

  // Questionnaire - Age
  ageQuestion: { en: 'How old are you?', he: 'How old are you?' },
  yearsOld: { en: 'years old', he: 'years old' },

  // Questionnaire - Weight/Height
  weightHeightQuestion: { en: 'What is your weight and height?', he: 'What is your weight and height?' },
  weight: { en: 'Weight', he: 'Weight' },
  height: { en: 'Height', he: 'Height' },
  kg: { en: 'kg', he: 'kg' },
  cm: { en: 'cm', he: 'cm' },

  // Questionnaire - Goal
  goalQuestion: { en: 'What is your main goal?', he: 'What is your main goal?' },
  loseWeight: { en: 'Lose Weight', he: 'Lose Weight' },
  buildMuscle: { en: 'Build Muscle', he: 'Build Muscle' },
  improveEndurance: { en: 'Improve Endurance', he: 'Improve Endurance' },
  flexibility: { en: 'Flexibility / Stretching', he: 'Flexibility / Stretching' },
  generalHealth: { en: 'General Health / Well-being', he: 'General Health / Well-being' },
  funPlay: { en: 'Fun / Play', he: 'Fun / Play' },
  other: { en: 'Other', he: 'Other' },
  enterGoal: { en: 'Enter your goal...', he: 'Enter your goal...' },

  // Tutorial
  skipTutorial: { en: 'Skip Tutorial', he: 'Skip Tutorial' },
  nextBtn: { en: 'Next â', he: 'Next â' },
  letsStart: { en: "Let's Start! \ud83d\ude80", he: "Let's Start! \ud83d\ude80" },
  setDailyStepGoal: { en: 'Set Daily Step Goal \ud83c\udfaf', he: 'Set Daily Step Goal \ud83c\udfaf' },
  enterStepGoal: { en: 'Enter step goal', he: 'Enter step goal' },
};
