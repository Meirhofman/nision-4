import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const { darkMode } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Navigate after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      navigate('/landing');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileContainer className={`flex flex-col items-center justify-center relative ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50 to-purple-50'}`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center justify-center"
          >
            {/* Logo */}
            <img 
              src="/logo.jpeg" 
              alt="LAZOZ Logo" 
              className="w-32 h-32 object-contain mb-4"
              style={{ background: 'transparent' }}
            />
            
            {/* App Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              LAZOZ
            </motion.h1>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}
            >
              Your Personal Fitness Journey
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
