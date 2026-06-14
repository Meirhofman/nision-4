import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.6 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out after 1.8 seconds (total display: 1.8s + 0.4s fade out = 2.2s)
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    // Navigate after 2.5 seconds total
    const navigateTimer = setTimeout(() => {
      navigate('/landing');
    }, 2500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <MobileContainer className="flex flex-col items-center justify-center relative bg-[#ffffff] h-screen">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center w-full h-full"
          >
            {/* Logo */}
            <img 
              src="/logo.jpeg" 
              alt="LAZOZ Logo" 
              className="w-[120px] h-[120px] object-contain"
              style={{ background: 'transparent' }}
            />
            
            {/* App Name */}
            <h1
              className="text-[36px] font-bold text-[#534AB7] mt-4"
            >
              LAZOZ
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
};
