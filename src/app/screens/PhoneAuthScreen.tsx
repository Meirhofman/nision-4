import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { PhoneAuthForm } from '../components/PhoneAuthForm';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

/** מסך נפרד — מפנה גם מ-Landing. אותה לוגיקה כמו בטאב "טלפון" בדף ההתחברות */
export const PhoneAuthScreen = () => {
  const navigate = useNavigate();
  const { darkMode } = useApp();

  return (
    <MobileContainer className={darkMode ? 'bg-slate-900' : 'bg-[#fff5f7]'}>
      <div className="flex-1 flex flex-col w-full h-full p-6 text-right relative overflow-y-auto" dir="rtl">
        <button
          onClick={() => navigate('/login')}
          className={`mt-4 mb-6 self-start p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
          aria-label="חזרה להתחברות"
        >
          <ArrowRight size={24} />
        </button>

        <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          התחברות עם טלפון
        </h1>
        <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          נשלח אליך קוד ב-SMS לאימות המספר
        </p>

        <PhoneAuthForm darkMode={darkMode} />
      </div>
    </MobileContainer>
  );
};
