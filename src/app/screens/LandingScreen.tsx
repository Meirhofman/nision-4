import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { Button } from '../components/ui';
import { useApp } from '../context/AppContext';

export const LandingScreen = () => {
  const navigate = useNavigate();
  const { darkMode } = useApp();

  return (
    <MobileContainer className={darkMode ? 'bg-slate-900' : 'bg-[#fff5f7]'} noScroll>
      <div className="flex-1 flex flex-col w-full items-center justify-center px-3 py-6 gap-6">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center justify-center space-y-1 w-full max-w-sm">
          <img 
            src="/logo.jpeg" 
            alt="LAZOZ Logo" 
            className="w-24 h-24 object-contain rounded-2xl shadow-lg mix-blend-multiply dark:mix-blend-normal"
          />
          <h1 className={`text-lg text-center font-black leading-tight tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            ברוך הבא לאפליקציית הבריאות<br/>
            <span className="text-pink-500 text-xl mt-0 block">LAZOZ</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 max-w-sm">
          {/* Login Button with background matching slightly pinkish/white */}
          <button
            onClick={() => navigate('/login')}
            className={`w-full py-2.5 text-xl font-black rounded-2xl transition-all shadow-md active:scale-95 ${
              darkMode 
                ? 'bg-slate-800 text-pink-400 border-2 border-slate-700 hover:bg-slate-700' 
                : 'bg-white text-pink-500 border-2 border-pink-100 hover:bg-pink-50'
            }`}
          >
            התחבר
          </button>

          {/* Subtle Divider */}
          <div className="relative flex items-center w-full py-0.5">
            <div className={`flex-grow border-t ${darkMode ? 'border-slate-700' : 'border-pink-200'} opacity-60`}></div>
            <div className={`flex-grow border-t ${darkMode ? 'border-slate-700' : 'border-pink-200'} opacity-60`}></div>
          </div>

          {/* New User Button */}
          <button
            onClick={() => navigate('/questionnaire/language')}
            className="w-full py-2.5 text-xl font-black rounded-2xl transition-all shadow-xl active:scale-95 bg-pink-500 text-white hover:bg-pink-600 hover:shadow-pink-500/30"
          >
            חדש ? בוא ונכיר אותך
          </button>

          {/* Phone Auth Button */}
          <button
            onClick={() => navigate('/phone-auth')}
            className={`w-full py-2 text-base font-bold rounded-2xl transition-all border-2 border-dashed active:scale-95 ${
              darkMode
                ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                : 'border-pink-200 text-pink-400 hover:bg-white'
            }`}
          >
            היי רוצים להירשם עם טלפון ?
          </button>
        </div>

      </div>
    </MobileContainer>
  );
};
