import React from 'react';
import { MobileContainer } from '../../components/MobileContainer';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface QuestionLayoutProps {
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
  canNext?: boolean;
  showBack?: boolean;
}

export const QuestionLayout = ({ title, children, onNext, canNext = false, showBack = true }: QuestionLayoutProps) => {
  const { t, isRTL } = useApp();
  const navigate = useNavigate();

  return (
    <MobileContainer className="relative bg-[#fff5f7] dark:bg-slate-900">
      <div className="flex-1 flex flex-col w-full p-6 h-full">
        <div className="flex items-center justify-between mb-8 pt-4">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
              <ArrowLeft className={isRTL ? "rotate-180" : ""} size={24} />
            </button>
          ) : <div className="w-10" />}
          
          <h2 className="text-xl font-bold text-center flex-1">{title}</h2>
          <div className="w-10" />
        </div>

        <div className="flex justify-center mb-6">
          <img 
            src="/logo.jpeg" 
            alt="App Logo" 
            className="w-20 h-20 object-contain"
            style={{ background: 'transparent' }}
          />
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="flex-1 flex flex-col items-center justify-start w-full max-w-xs mx-auto space-y-4 pt-4 pb-12"
        >
          {children}
        </motion.div>

        <div className="mt-auto pt-8 pb-4">
          <Button 
            fullWidth 
            variant={canNext ? 'primary' : 'secondary'}
            disabled={!canNext}
            onClick={onNext}
            className="h-14 text-lg shadow-md"
          >
            {t('next')}
            <ArrowRight className={`ml-2 ${isRTL ? "rotate-180 mr-2 ml-0" : ""}`} size={20} />
          </Button>
        </div>
      </div>
    </MobileContainer>
  );
};
