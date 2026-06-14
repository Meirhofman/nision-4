import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, ChevronRight, X, TrendingUp, TrendingDown, Coffee, Music, Gift } from 'lucide-react';
import { Button } from '../components/ui';

export const PointsScreen = () => {
    const navigate = useNavigate();
    const { t, isRTL, points, addPoints, pointsHistory, language } = useApp();
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showRewards, setShowRewards] = useState(false);

    // Calculate points by category
    const pointsByCategory = {
        joining: (pointsHistory || []).filter(item => item.category === 'joining').reduce((sum, item) => sum + item.points, 0),
        nutrition: (pointsHistory || []).filter(item => item.category === 'nutrition').reduce((sum, item) => sum + item.points, 0),
        workouts: (pointsHistory || []).filter(item => item.category === 'workouts').reduce((sum, item) => sum + item.points, 0),
        social: (pointsHistory || []).filter(item => item.category === 'social').reduce((sum, item) => sum + item.points, 0),
        other: (pointsHistory || []).filter(item => !item.category || item.category === 'other').reduce((sum, item) => sum + item.points, 0)
    };

    const rewards = [
        { id: 1, title: t('coffeeVoucher'), cost: 150, icon: <Coffee size={24} className="text-orange-500" />, color: 'bg-orange-100' },
        { id: 2, title: t('musicSubscription'), cost: 200, icon: <Music size={24} className="text-purple-500" />, color: 'bg-purple-100' },
        { id: 3, title: t('giftCard10'), cost: 500, icon: <Gift size={24} className="text-pink-500" />, color: 'bg-pink-100' },
        { id: 4, title: t('proSubscription'), cost: 1000, icon: <Star size={24} className="text-yellow-500" />, color: 'bg-yellow-100' },
    ];

    return (
        <MobileContainer className="min-h-screen relative flex flex-col"
        >
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
                <button onClick={() => navigate('/main')} className="p-2 bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft size={24} className={isRTL ? "rotate-180" : ""} />
                </button>
                <span className="text-gray-800 font-bold text-lg">{t('pointsTracking')}</span>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-24">
                <div className="bg-[#FCE7F3] rounded-3xl p-8 shadow-md border border-pink-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mr-10 -mt-10 opacity-10 blur-3xl"></div>
                    <span className="text-pink-600 font-bold uppercase tracking-wider text-xs">{t('totalPoints')}</span>
                    <div className="flex items-center gap-3">
                        <Star className="text-yellow-500 fill-yellow-500" size={32} />
                        <span className="text-4xl font-black text-gray-800 tracking-tighter">{points.toLocaleString()}</span>
                    </div>

                    <button
                        onClick={() => setShowBreakdown(true)}
                        className="mt-6 px-8 py-3 bg-white text-pink-600 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm border border-pink-100"
                    >
                        {t('pointsBreakdown')} <ChevronRight size={18} className={isRTL ? "rotate-180" : ""} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-800">{t('recentActivities')}</h3>
                        {(pointsHistory && pointsHistory.length > 1) && (
                            <button onClick={() => setShowHistory(true)} className="text-sm font-bold text-pink-500 hover:text-pink-600 underline underline-offset-4">{t('viewAll')}</button>
                        )}
                    </div>

                    <div className="bg-[#DBEAFE] rounded-[2.5rem] p-5 shadow-sm border border-blue-100">
                        {(pointsHistory && pointsHistory.length > 1) ? (
                            pointsHistory.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl shadow-inner ${item.type === 'earn' ? 'bg-green-100' : 'bg-red-100'}`}>
                                            {item.type === 'earn' ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-600" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{item.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-lg ${item.type === 'earn' ? 'text-green-600' : 'text-gray-500'}`}>
                                        {item.type === 'earn' ? '+' : ''}{item.points}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm font-medium">{t('noRecentActivities') || 'No recent activities yet'}</p>
                                <p className="text-gray-300 text-xs mt-2">{t('startEarningPoints') || 'Start earning points by completing activities!'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-800">{t('rewardsShop')}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {rewards.slice(0, 2).map((reward) => (
                            <div key={reward.id} className="bg-gray-50 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-3 hover:scale-105 transition-transform cursor-pointer group">
                                <div className={`p-4 rounded-[1.5rem] ${reward.color} mb-1 group-hover:rotate-12 transition-transform shadow-inner`}>
                                    {reward.icon}
                                </div>
                                <span className="text-sm font-black text-gray-800">{reward.title}</span>
                                <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1.5 text-yellow-700 text-xs font-black">
                                    <Star size={14} fill="currentColor" />
                                    {reward.cost}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => setShowRewards(true)}
                        className="h-16 rounded-[2rem] bg-pink-100 text-pink-600 font-black text-lg shadow-sm hover:bg-pink-200 active:scale-95 transition-all mt-4"
                    >
                        {t('allRewards')}
                    </Button>
                </div>
            </div>



            {/* Modals */}
            <AnimatePresence>
                {/* Breakdown Modal */}
                {showBreakdown && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-8 w-full max-w-sm shadow-2xl relative">
                            <button onClick={() => setShowBreakdown(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full">
                                <X size={20} />
                            </button>
                            <h3 className="text-2xl font-black text-gray-800 mb-8 text-center tracking-tight">{t('pointsBreakdown')}</h3>
                            <div className="space-y-5">
                                {/* Categories */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl">
                                        <span className="font-bold text-pink-700">{t('joining')}: {t('joiningBonus')}</span>
                                        <span className="font-black text-pink-600">+{pointsByCategory.joining}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                                        <span className="font-bold text-green-700">{t('nutrition')}</span>
                                        <span className="font-black text-green-600">+{pointsByCategory.nutrition}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                        <span className="font-bold text-blue-700">{t('workouts')}</span>
                                        <span className="font-black text-blue-600">+{pointsByCategory.workouts}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                                        <span className="font-bold text-purple-700">{t('social')}</span>
                                        <span className="font-black text-purple-600">+{pointsByCategory.social}</span>
                                    </div>
                                    {pointsByCategory.other > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-bold text-gray-700">{t('other')}</span>
                                            <span className="font-black text-gray-600">+{pointsByCategory.other}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Individual Activities */}
                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-bold text-gray-600 mb-3">{t('recentActivities')}</h4>
                                    {(pointsHistory || []).slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm py-2">
                                            <span className="text-gray-500 font-bold">{item.title}</span>
                                            <span className={`font-black ${item.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                                                {item.type === 'earn' ? '+' : ''}{item.points}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between text-2xl font-black pt-6 border-t-2 border-gray-800 text-gray-800">
                                    <span className="tracking-tight">{t('totalPoints2')}</span>
                                    <span>{points.toLocaleString()}</span>
                                </div>
                            </div>
                            <Button fullWidth onClick={() => setShowBreakdown(false)} className="mt-10 h-16 rounded-2xl bg-purple-600 text-white font-black text-lg hover:bg-purple-700 shadow-xl">{t('closePoints')}</Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* History Modal */}
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-8 w-full max-w-sm shadow-2xl relative max-h-[85vh] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{t('fullHistory')}</h3>
                                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                                {(pointsHistory || []).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl shadow-sm ${item.type === 'earn' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {item.type === 'earn' ? <TrendingUp size={18} className="text-green-600" /> : <TrendingDown size={18} className="text-red-600" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`font-black text-lg ${item.type === 'earn' ? 'text-green-600' : 'text-gray-500'}`}>
                                            {item.type === 'earn' ? '+' : ''}{item.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button fullWidth onClick={() => setShowHistory(false)} className="mt-8 h-16 rounded-2xl bg-gray-800 text-white font-black text-lg hover:bg-black shadow-xl">{t('backPoints')}</Button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Rewards Modal */}
                {showRewards && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-8 w-full max-w-sm shadow-2xl relative max-h-[85vh] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{t('rewardsShop')}</h3>
                                <button onClick={() => setShowRewards(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 scrollbar-hide">
                                {rewards.map((reward) => (
                                    <div key={reward.id} className="bg-gray-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-purple-200 transition-all cursor-pointer flex flex-col items-center text-center space-y-3 group shadow-sm hover:shadow-md">
                                        <div className={`p-4 rounded-[1.5rem] ${reward.color} mb-1 group-hover:rotate-12 transition-transform shadow-inner`}>
                                            {reward.icon}
                                        </div>
                                        <span className="text-sm font-black text-gray-800">{reward.title}</span>
                                        <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1.5 text-yellow-700 text-xs font-black">
                                            <Star size={14} fill="currentColor" />
                                            {reward.cost}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button fullWidth onClick={() => setShowRewards(false)} className="mt-8 h-16 rounded-2xl bg-purple-600 text-white font-black text-lg hover:bg-purple-700 shadow-xl">{t('completePurchase')}</Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MobileContainer>
    );
};
