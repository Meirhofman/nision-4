import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../../components/MobileContainer';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Info } from 'lucide-react';

export const StepComplete = () => {
  const navigate = useNavigate();
  const { t, persistState } = useApp();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after a short delay when reaching the final screen
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MobileContainer className="bg-white relative">
      <div className="flex-1 flex flex-col p-8 items-center justify-center space-y-12 w-full h-full">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
             <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 text-center">{t('allSet')}</h1>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xs"
        >
          <Button 
            fullWidth 
            variant="primary"
            onClick={() => {
              persistState();
              localStorage.removeItem('hasSeenMainTutorial_v2');
              navigate('/main');
              // Tutorial will show on MainScreen (hasSeenMainTutorial removed)
            }}
            className="h-16 text-xl shadow-lg"
          >
            {t('letsGetStarted')}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute inset-x-8 bottom-32 bg-slate-800 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-start space-x-3 rtl:space-x-reverse"
          >
            <div className="bg-blue-500/20 p-2 rounded-full">
              <Info size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed">
                {t('changeLater')}
              </p>
              <button 
                onClick={() => setShowPopup(false)}
                className="mt-2 text-xs font-bold text-blue-400 uppercase tracking-wider hover:text-blue-300"
              >
                {t('next')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
