import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

type MetricType = 'calories' | 'distance' | 'steps' | 'time';

const COLORS = {
  calories: { bg: 'bg-purple-100', text: 'text-purple-600', fill: '#d8b4fe' },
  distance: { bg: 'bg-green-100', text: 'text-green-600', fill: '#86efac' },
  steps: { bg: 'bg-pink-100', text: 'text-pink-600', fill: '#f9a8d4' },
  time: { bg: 'bg-orange-100', text: 'text-orange-600', fill: '#fdba74' },
};

const MOTIVATION_SENTENCES = [
  "Look how far you came!",
  "Every step counts.",
  "You’re building something amazing.",
  "Keep pushing forward!",
  "Small steps lead to big changes.",
  "Believe in yourself.",
  "You are stronger than you think.",
  "Fitness is a journey, enjoy it.",
  "Your body can do it. Tell your mind.",
  "Don't stop until you're proud."
];

// --- Mock Data ---

const WEEKLY_DATA = [
  { day: 'M', steps: 4000 },
  { day: 'T', steps: 6500 },
  { day: 'W', steps: 5000 },
  { day: 'T', steps: 8000 },
  { day: 'F', steps: 5500 },
  { day: 'S', steps: 9000 },
  { day: 'S', steps: 3000 },
];

const MONTHLY_DATA = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  steps: Math.floor(Math.random() * 8000) + 2000, // Random steps between 2000-10000
}));

// --- Components ---

const MetricCard = ({ label, value, unit, type, fullWidth = false }: { label: string; value: string | number; unit?: string; type: MetricType; fullWidth?: boolean }) => {
  const color = COLORS[type];
  return (
    <div className={`rounded-2xl p-4 flex flex-col justify-center shadow-sm border border-white/50 ${color.bg} ${fullWidth ? 'col-span-2 w-full' : ''}`}>
      <span className="text-gray-500 text-xs font-medium uppercase tracking-wide opacity-80">{label}</span>
      <div className={`mt-1 font-bold ${color.text} ${fullWidth ? 'text-3xl' : 'text-2xl'}`}>
        {value} <span className="text-sm font-normal opacity-70">{unit}</span>
      </div>
    </div>
  );
};

export const SummaryScreen = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    // Random motivation on mount
    setMotivation(MOTIVATION_SENTENCES[Math.floor(Math.random() * MOTIVATION_SENTENCES.length)]);
  }, []); // Empty dependency array ensures it runs only once per mount (when entering screen)

  // --- Render Content ---

  const renderDaily = () => (
    <motion.div 
      key="daily"
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label={t('steps')} value="5,420" type="steps" fullWidth />
        <MetricCard label={t('distance')} value="3.2" unit="km" type="distance" />
        <MetricCard label={t('calories')} value="320" unit="kcal" type="calories" />
        <MetricCard label={t('activeTime')} value="24" unit="min" type="time" fullWidth />
      </div>
    </motion.div>
  );

  const renderWeekly = () => {
    const totalSteps = WEEKLY_DATA.reduce((acc, curr) => acc + curr.steps, 0);
    
    return (
      <motion.div 
        key="weekly"
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        {/* Weekly Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 text-sm font-medium mb-4 uppercase">{t('stepsThisWeek')}</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={WEEKLY_DATA}>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                 <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 />
                 <Bar dataKey="steps" radius={[4, 4, 4, 4]} animationDuration={1500}>
                    {WEEKLY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.steps.fill} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-4 text-center">
             <span className="text-3xl font-bold text-gray-800">{totalSteps.toLocaleString()}</span>
             <p className="text-gray-400 text-sm">{t('totalSteps')}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <MetricCard label={t('distance')} value="24.5" unit="km" type="distance" />
            <MetricCard label={t('calories')} value="1,850" unit="kcal" type="calories" />
            <MetricCard label={t('activeTime')} value="4h 20m" type="time" fullWidth />
        </div>
      </motion.div>
    );
  };

  const renderMonthly = () => {
    const totalSteps = MONTHLY_DATA.reduce((acc, curr) => acc + curr.steps, 0);
    
    return (
      <motion.div 
        key="monthly"
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6"
      >
        {/* Calendar View */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">{t('monthFeb')}</h3>
                <CalendarIcon size={20} className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 justify-items-center">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-xs font-bold text-gray-400">{d}</span>
                ))}
                
                {MONTHLY_DATA.map((dayData, i) => {
                    // Size based on steps: 2000 -> 24px, 10000 -> 36px
                    const size = 24 + (dayData.steps / 10000) * 12; 
                    const isToday = i === 18; // Mock today

                    return (
                        <div key={i} className="flex items-center justify-center w-10 h-10">
                            <div 
                                style={{ width: size, height: size }}
                                className={`
                                    rounded-full flex items-center justify-center text-[10px] font-medium transition-all
                                    ${isToday ? 'bg-pink-400 text-white shadow-md ring-2 ring-pink-100' : 'bg-green-100 text-green-700'}
                                `}
                            >
                                {dayData.day}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <MetricCard label={t('totalSteps')} value={totalSteps.toLocaleString()} type="steps" fullWidth />
             <MetricCard label={t('totalDistance')} value="112" unit="km" type="distance" />
             <MetricCard label={t('totalCalories')} value="8,400" unit="kcal" type="calories" />
             <MetricCard label={t('totalTime')} value="18h 45m" type="time" fullWidth />
        </div>
      </motion.div>
    );
  };

  return (
    <MobileContainer className="min-h-screen relative flex flex-col overflow-y-auto">
       {/* Header */}
       <div className="p-6 pt-12 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10 sticky top-0">
         <h1 className="text-2xl font-bold text-gray-800">{t('activitySummary')}</h1>
         <button
           onClick={() => navigate('/main')}
           className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-50 border border-gray-100"
         >
           <ChevronLeft size={24} className={isRTL ? "rotate-180" : ""} />
         </button>
       </div>

       {/* Tabs */}
       <div className="px-6 mb-6">
         <div className="flex p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
           {['daily', 'weekly', 'monthly'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                 activeTab === tab 
                 ? 'bg-[#c1f5c1] text-green-900 shadow-sm' 
                 : 'text-gray-400 hover:text-gray-600'
               }`}
             >
               {t(tab)}
             </button>
           ))}
         </div>
       </div>

       {/* Content */}
       <div className="flex-1 px-6 pb-24 overflow-y-auto [&::-webkit-scrollbar]:hidden">
         <AnimatePresence mode="wait">
            {activeTab === 'daily' && renderDaily()}
            {activeTab === 'weekly' && renderWeekly()}
            {activeTab === 'monthly' && renderMonthly()}
         </AnimatePresence>

         {/* Motivation Sentence */}
         <div className="mt-8 mb-4 text-center">
            <p className="text-gray-500 font-medium italic">"{motivation}"</p>
         </div>
       </div>

    </MobileContainer>
  );
};
