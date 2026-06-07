import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../../components/MobileContainer';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

export const StepLanguage = () => {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useApp();

  const handleLanguageSelect = (lang: 'en' | 'he') => {
    setLanguage(lang);
    setTimeout(() => {
        navigate('/questionnaire/username');
    }, 300);
  };

  return (
    <MobileContainer className="bg-white relative">
      <div className="flex-1 flex flex-col w-full p-8">
        {/* Header with Back Button */}
        <div className="w-full flex justify-between items-start mb-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium flex items-center hover:bg-gray-200 transition-all z-10"
          >
            <span>←</span>
          </motion.button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center shadow-lg">
               <img src="/logo.jpeg" alt="App Logo" className="w-16 h-16 object-contain" style={{ background: 'transparent' }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">{t('chooseLanguage')}</h1>
          </motion.div>

          <div className="w-full space-y-4 max-w-xs">
            <Button 
              fullWidth 
              variant={language === 'en' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageSelect('en')}
              className="h-16 text-lg"
            >
              {t('english')}
            </Button>
            <Button 
              fullWidth 
              variant={language === 'he' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageSelect('he')}
              className="h-16 text-lg font-hebrew"
            >
              {t('hebrew')}
            </Button>
          </div>
        </div>
        
        <div className="mt-auto hidden" />
      </div>
    </MobileContainer>
  );
};
