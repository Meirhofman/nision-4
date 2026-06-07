import React from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Clock, Utensils, CheckCircle, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export const MealHistoryScreen = () => {
  const navigate = useNavigate();
  const { t, nutritionData } = useApp();

  const formatMealDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `${t('today')}, ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `${t('yesterday')}, ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.getDate()}.${date.getMonth() + 1}, ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'ארוחת בוקר';
      case 'lunch': return 'ארוחת צהריים';
      case 'dinner': return 'ארוחת ערב';
      case 'snack1': return 'חטיף 1';
      case 'snack2': return 'חטיף 2';
      default: return mealType;
    }
  };

  const calculateTotalCalories = (meal: any) => {
    return (meal.proteins * 4) + (meal.carbs * 4) + (meal.fats * 9);
  };

  const shareMeal = async (meal: any, mealType: string, date: string) => {
    const totalCalories = calculateTotalCalories(meal);
    const shareData = {
      title: 'ארוחה בריאה 🥗',
      text: `האכלתי ${getMealTypeLabel(mealType)}! 🍽\n${meal.foodName ? `🍽 מנה: ${meal.foodName}` : ''}\n🔥 קלוריות: ${totalCalories}\n💪 חלבון: ${meal.proteins}g\n🌾 פחמימות: ${meal.carbs}g\n🥑 שומנים: ${meal.fats}g\n\n#כושר #תזונה #LAZOZ`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const fullText = `${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(fullText);
        alert('הקישור הועתק ללוח! שתף אותו עם חברים 🔥');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text}\n${shareData.url}`;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('הקישור הועתק ללוח! שתף אותו עם חברים 🔥');
      } catch (fallbackError) {
        alert('לא היה ניתן לשתף. נסה שוב מאוחר יותר.');
      }
    }
  };

  // Get all meals from all dates
  const allMeals: Array<{date: string, mealType: string, mealData: any}> = [];
  
  Object.entries(nutritionData.meals || {}).forEach(([date, meals]) => {
    Object.entries(meals as any).forEach(([mealType, mealData]) => {
      allMeals.push({ date, mealType, mealData });
    });
  });

  // Sort by date (newest first)
  allMeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <MobileContainer className="min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-6 pb-2 pt-12 flex items-center relative justify-center bg-white/50 backdrop-blur-sm z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:bg-gray-50"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">היסטוריית ארוחות</h1>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden pb-24">
        {allMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">עדיין אין היסטוריית ארוחות</p>
            <p className="text-gray-400 text-sm mt-2">התחל לרשום ארוחות כדי לראות אותן כאן</p>
          </div>
        ) : (
          allMeals.map((item, index) => (
            <motion.div
              key={`${item.date}-${item.mealType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs font-medium mb-1">
                    {formatMealDate(item.date)}
                  </p>
                  <h3 className="text-xl font-bold text-slate-800">{getMealTypeLabel(item.mealType)}</h3>
                  {item.mealData.foodName && (
                    <p className="text-sm text-gray-600 font-medium mt-1">{item.mealData.foodName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#f3e8ff] text-[#9333ea] px-3 py-1 rounded-xl text-xs font-bold">
                    {item.mealData.time}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      shareMeal(item.mealData, item.mealType, item.date);
                    }}
                    className="p-2 bg-[#f0f9ff] text-[#0369a1] rounded-full hover:bg-[#e0f2fe] transition-colors"
                    title="שתף ארוחה"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                  <Utensils size={16} className="text-green-500/70" />
                  <span className="text-sm font-medium text-gray-600">חלבון: {item.mealData.proteins}g</span>
                </div>
                <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                  <span className="text-sm font-medium text-gray-600">פחמימות: {item.mealData.carbs}g</span>
                </div>
                <div className="flex items-center gap-2 bg-[#ecfdf5] px-3 py-2 rounded-xl border border-green-100 min-w-[100px]">
                  <span className="text-sm font-medium text-gray-600">שומנים: {item.mealData.fats}g</span>
                </div>
                <div className="flex items-center gap-2 bg-[#fef3c7] px-3 py-2 rounded-xl border border-yellow-100 min-w-[100px]">
                  <span className="text-sm font-medium text-gray-600">קלוריות: {calculateTotalCalories(item.mealData)}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </MobileContainer>
  );
};
