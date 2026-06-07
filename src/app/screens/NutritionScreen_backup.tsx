import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { Button } from '../components/ui';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Calendar, 
  Settings, 
  Star, 
  Utensils, 
  Users, 
  Dumbbell, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Character } from '../components/Character';

interface MealData {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
  rating: number;
  photoScanned: boolean;
  time: string;
}

export const NutritionScreen = () => {
  const navigate = useNavigate();
  const { t, isRTL, language, points, addPoints, nutritionData, updateNutritionData, userData, updateUserData } = useApp();

  // Debug: Log userData on component mount
  console.log('=== NUTRITION SCREEN DEBUG ===');
  console.log('Current userData:', userData);
  console.log('Medical conditions:', userData?.medicalConditions);
  console.log('Allergies:', userData?.allergies);
  console.log('Goal:', userData?.goal);
  console.log('Fitness:', userData?.fitness);
  console.log('================================');

  const [currentMeal, setCurrentMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2' | null>(null);
  const [mealInput, setMealInput] = useState({ proteins: 0, carbs: 0, fats: 0, calories: 0 });
  const [waterGlasses, setWaterGlasses] = useState(nutritionData.water || 0);
  const [showReward, setShowReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [fridgeInput, setFridgeInput] = useState("");
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [chatStage, setChatStage] = useState<'gathering_info' | 'ready_for_recipes'>('ready_for_recipes'); // Start in ready mode
  const [aiMealRecommendation, setAiMealRecommendation] = useState<{
    name: string,
    proteins: number,
    carbs: number,
    fats: number,
    calories: number
  } | null>(null);

  const today = new Date().toDateString();
  const meals = nutritionData.meals?.[today] || {};

  const handleWaterClick = (index: number) => {
    setWaterGlasses(index + 1);
    updateNutritionData({ water: index + 1 });
  };

  const mealCount = Object.keys(meals).length;

  const handleDeleteMeal = (mealType: string) => {
    const updatedMeals = { ...nutritionData.meals };
    if (updatedMeals[today]) {
      delete updatedMeals[today][mealType];
      updateNutritionData({ meals: updatedMeals });
    }
  };

  const handleAddAiMeal = () => {
    if (!aiMealRecommendation) return;
    const slots: Array<'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner'> = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
    const nextSlot = slots.find(slot => !meals[slot]);

    if (!nextSlot) {
      alert("כל הארוחות להיום כבר מלאות!");
      return;
    }

    const currentTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const mealData: MealData = {
      proteins: aiMealRecommendation.proteins,
      carbs: aiMealRecommendation.carbs,
      fats: aiMealRecommendation.fats,
      calories: aiMealRecommendation.calories,
      rating: 5,
      photoScanned: false,
      time: currentTime
    };

    const updatedMeals = {
      ...nutritionData.meals,
      [today]: {
        ...meals,
        [nextSlot]: mealData
      }
    };

    updateNutritionData({ meals: updatedMeals });
    addPoints(15);
    setRewardAmount(15);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);

    setShowAIAssistant(false);
    setFridgeInput("");
    setAIResponse(null);
    setAiMealRecommendation(null);
    setAiMessageCount(0);
  };

  const handleAIQuery = (overrideInput?: string) => {
    const query = (overrideInput ?? fridgeInput).trim();
    if (!query) return;
    
    console.log('handleAIQuery called with:', query);
    console.log('Current aiMessageCount:', aiMessageCount);
    
    setAiMessageCount((c) => c + 1);
    const msgCount = aiMessageCount + 1;
    setAIResponse(language === 'en' ? "Thinking of the perfect recipe for you... 👨‍🍳" : "חושב על מתכון מושלם עבורך... 👨‍🍳");
    setAiMealRecommendation(null);
    
    // Only clear input if it's from button click (overrideInput exists)
    if (overrideInput) {
      setFridgeInput("");
    }

    // Build context from questionnaire
    const qContext = {
      age: userData?.age,
      weight: userData?.weight,
      height: userData?.height,
      goal: userData?.goal,
      fitness: userData?.fitness,
      medicalConditions: userData?.medicalConditions || [],
      allergies: userData?.allergies || '',
      additionalHealthInfo: userData?.additionalHealthInfo || '',
    };

    // Debug: Log the current data
    console.log('Debug - userData:', userData);
    console.log('Debug - qContext:', qContext);

    setTimeout(() => {
      const ingredients = query.toLowerCase();
      
      // Check if we have health data from questionnaire
      const hasHealthData = qContext.medicalConditions.length > 0 || qContext.allergies.length > 0;
      
      // Debug: Log the health data check
      console.log('Debug - hasHealthData:', hasHealthData);
      console.log('Debug - medicalConditions:', qContext.medicalConditions);
      console.log('Debug - allergies:', qContext.allergies);
      console.log('Debug - chatStage:', chatStage);
      
      // Always work in ready mode - skip gathering phase for now
      if (chatStage === 'gathering_info') {
        setChatStage('ready_for_recipes');
        setAiMessageCount(0);
        if (hasHealthData) {
          setAIResponse("שלום! ראיתי שכבר מילאת את השאלון. אני כבר מכיר את המצב הרפואי והאלרגיות שלך. מה תרצה להכין היום?");
        } else {
          setAIResponse("שלום! אני השף האישי שלך. בוא נבנה יחד מתכון מושלם! ספר לי מה יש לך במקרר.");
        }
        return;
      }

      // Force show all options immediately after first message
      if (chatStage === 'ready_for_recipes' && aiMessageCount === 0) {
        setAiMessageCount(1); // Move to show options
      }

      // Prevent recommending nutritional supplements
      if (ingredients.includes("תוסף") || ingredients.includes("אבקת חלבון") || ingredients.includes("כדורים") || ingredients.includes("ויטמינים")) {
         setAIResponse("אני מתמקד בתזונה טבעית ומלאה ממרכיבים טריים! 🌿 בוא נמצא כיוון לאוכל אמיתי וטוב.");
         setFridgeInput("");
         return;
      }

      // Handle medical advice requests
      if (ingredients.includes("תרופה") || ingredients.includes("כאב") || ingredients.includes("אינסולין") || ingredients.includes("לחץ דם")) {
         setAIResponse("אני לא רופא, אנא פנה לרופא 👨‍⚕️ אני מתמקד רק בהצעות לאוכל יומיומי!");
         setFridgeInput("");
         return;
      }

      let mealName = "חביתת ירק עשירה";
      let macros = { proteins: 15, carbs: 10, fats: 12, calories: 220 };
      let responseText = "";

      // Check for medical conditions and adjust recommendations
      const hasDiabetes = qContext.medicalConditions.includes('diabetes') || qContext.medicalConditions.includes('סוכרת');
      const hasHeartDisease = qContext.medicalConditions.includes('heartDisease') || qContext.medicalConditions.includes('מחלת לב');
      const hasHypertension = qContext.medicalConditions.includes('hypertension') || qContext.medicalConditions.includes('לחץ דם גבוה');
      const hasCeliac = qContext.medicalConditions.includes('celiac') || qContext.medicalConditions.includes('סליאק');
      const hasAsthma = qContext.medicalConditions.includes('asthma') || qContext.medicalConditions.includes('אסתמה');
      const hasThyroid = qContext.medicalConditions.includes('thyroid') || qContext.medicalConditions.includes('בלוטת תריס');

      // Diabetes-specific recommendations
      if (hasDiabetes && (ingredients.includes("מתוק") || ingredients.includes("סוכר") || ingredients.includes("שוקולד"))) {
         setAIResponse("מאחר וציינת סוכרת, בוא נתמקד במאכלים מתוקים שטובים עבורך כמו פירות טריים ומאוזנים! אם יש ספק, אנא פנה לרופא.");
         setFridgeInput("");
         return;
      }

      // Heart disease/hypertension recommendations
      if ((hasHeartDisease || hasHypertension) && (ingredients.includes("מלוח") || ingredients.includes("מלח") || ingredients.includes("שומני"))) {
         setAIResponse("בהתחשב במצב הרפואי שציינת, בוא נעדיף מנות נמוכות מלח ושומן! אני יכול להמליץ על הכנה באפייה או אידוי במקום טיגון.");
         setFridgeInput("");
         return;
      }

      // Celiac disease recommendations
      if (hasCeliac && (ingredients.includes("לחם") || ingredients.includes("פסטה") || ingredients.includes("חיטה"))) {
         setAIResponse("ראיתי שציינת סליאק! במקום חיטה, בוא נשתמש באורז, תפוח אדמה או קינואה - אותם טעמים נהדרים ללא גלוטן!");
         setFridgeInput("");
         return;
      }

      // Consider allergies from questionnaire
      const allergiesStr = qContext.allergies.toLowerCase();
      const isAllergicToEggs = allergiesStr.includes("ביצ") || allergiesStr.includes("egg");
      const isAllergicToPeanuts = allergiesStr.includes("בוטנ") || allergiesStr.includes("peanut");
      const isAllergicToDairy = allergiesStr.includes("חלב") || allergiesStr.includes("גבינה") || allergiesStr.includes("dairy");
      const isAllergicToGluten = allergiesStr.includes("גלוטן") || allergiesStr.includes("גלוטן");
      const isAllergicToFish = allergiesStr.includes("דג") || allergiesStr.includes("fish");
      const isAllergicToShellfish = allergiesStr.includes("פירות ים") || allergiesStr.includes("צדפות") || allergiesStr.includes("shellfish");

      const mentionsEggs = ingredients.includes("ביצ") || ingredients.includes("egg");
      const mentionsPeanuts = ingredients.includes("בוטנ") || ingredients.includes("peanut");
      const mentionsDairy = ingredients.includes("חלב") || ingredients.includes("גבינה") || ingredients.includes("יוגורט");
      const mentionsFish = ingredients.includes("דג") || ingredients.includes("טונה") || ingredients.includes("סלמון");
      const mentionsChicken = ingredients.includes("עוף") || ingredients.includes("חזה עוף");

      // Check for allergy conflicts
      if ((isAllergicToEggs && mentionsEggs) || (isAllergicToPeanuts && mentionsPeanuts)) {
        setAIResponse("ראיתי שציינת אלרגיות, לכן נתמקד במה שכן מתאים לך! אפשר להכין מנה טעימה מירקות או טופו, במקום מה שציינת 🥗.");
        setAiMealRecommendation({ name: "סלט עשיר עם טופו", proteins: 20, carbs: 15, fats: 12, calories: 250 });
        setFridgeInput("");
        return;
      }

      if (isAllergicToDairy && mentionsDairy) {
        setAIResponse("שמתי לב שיש לך אלרגיה לחלב! במקום יוגורט או גבינה, אפשר להשתמש בחלב צמחי או טחינה - טעם מעולה ובריא!");
        setFridgeInput("");
        return;
      }

      if (isAllergicToFish && mentionsFish) {
        setAIResponse("ראיתי שיש אלרגיה לדגים! במקום טונה או סלמון, בוא נכין משהו עם חזה עוף או טופו - חלבון איכותי בטוח עבורך!");
        setFridgeInput("");
        return;
      }

      // Generate personalized meal recommendations based on ingredients and health profile
      if (mentionsChicken) {
        mealName = hasHeartDisease || hasHypertension ? "חזה עוף באפייה עם ירקות" : "סלט חזה עוף וירקות";
        macros = hasHeartDisease || hasHypertension ? 
          { proteins: 35, carbs: 12, fats: 6, calories: 250 } : // Lower fat for heart conditions
          { proteins: 35, carbs: 15, fats: 8, calories: 280 };
      } else if (!isAllergicToEggs && mentionsEggs) {
        mealName = hasDiabetes ? "חביתה עם ירקות וסלק" : "שקשוקה ביתית מהירה";
        macros = hasDiabetes ? 
          { proteins: 18, carbs: 18, fats: 12, calories: 270 } : // Lower carbs for diabetes
          { proteins: 18, carbs: 25, fats: 15, calories: 310 };
      } else if (mentionsFish && !isAllergicToFish) {
        mealName = hasHeartDisease ? "סלמון באפייה עם לימון" : "סלט טונה ומלפפון";
        macros = hasHeartDisease ? 
          { proteins: 30, carbs: 8, fats: 12, calories: 280 } : // Omega-3 good for heart
          { proteins: 28, carbs: 5, fats: 10, calories: 240 };
      }

      // Adjust response based on goal
      if (qContext.goal === 'loseWeight') {
        responseText = `מעולה! בהתחשב במטרת הירידה במשקל שלך והמידע הרפואי, בוא נכין **${mealName}**! זו מנה קלילה ומזינה שתתאים לך בדיוק.`;
        // Reduce calories for weight loss
        macros.calories = Math.round(macros.calories * 0.85);
      } else if (qContext.goal === 'buildMuscle') {
        responseText = `מצוין! לצורך בניית שריר, בוא נכין **${mealName}** עם חלבון מוגבר! זו מנה שתעזור לך להגיע למטרות שלך.`;
        // Increase protein for muscle building
        macros.proteins = Math.round(macros.proteins * 1.2);
        macros.calories = Math.round(macros.calories * 1.1);
      } else {
        responseText = `מעולה! מבוסס על מה שיש לך במקרר והנתונים הרפואיים שלך, בוא נכין **${mealName}**! זו מנה מאוזנת ומומלצת עבורך.`;
      }

      // Only suggest recipe after enough messages and when ready for recipes
      if (chatStage === 'ready_for_recipes' && msgCount >= 2) {
        // Build personalized recipe based on all ingredients and health profile
        let personalizedRecipe = "";
        const ingredientList = ingredients.split(/[,\s]+/).filter(word => word.length > 2);
        
        // Create comprehensive recipe suggestion
        personalizedRecipe = `מצוין! בהתבסס על מה שיש לך והפרופיל התזונתי שלך:\n\n`;
        
        // List available ingredients
        if (ingredientList.length > 0) {
          personalizedRecipe += `🥘 **מרכיבים זמינים:** ${ingredientList.join(', ')}\n\n`;
        }
        
        // Add health considerations
        if (qContext.allergies) {
          personalizedRecipe += `⚠️ **התחשבות באלרגיות:** ${qContext.allergies}\n\n`;
        }
        
        if (qContext.medicalConditions.length > 0) {
          personalizedRecipe += `🏥 **התחשבות רפואית:** ${qContext.medicalConditions.join(', ')}\n\n`;
        }
        
        // Suggest the personalized meal
        personalizedRecipe += `🍽️ **המלצה:** ${mealName}\n`;
        personalizedRecipe += `📊 **ערכים תזונתיים:** חלבון ${macros.proteins}g, פחמימות ${macros.carbs}g, שומנים ${macros.fats}g, קלוריות ${macros.calories}\n\n`;
        personalizedRecipe += `📝 **הוראות הכנה:**\n`;
        personalizedRecipe += `1. הכן את כל המרכיבים\n`;
        personalizedRecipe += `2. בצע בישול/אפייה מתאימה למצבך הרפואי\n`;
        personalizedRecipe += `3. תבשם והגש חם\n\n`;
        personalizedRecipe += `✨ **טיפים אישיים:** המתכון הותאם במיוחד עבורך בהתחשב במטרות והמגבלות שלך!`;
        
        setAIResponse(personalizedRecipe);
        setAiMealRecommendation({ name: mealName, ...macros });
      } else if (chatStage === 'ready_for_recipes') {
        setAIResponse(`נשמע טוב! ספר לי בדיוק מה יש לך במקרר ואני אכין לך מתכון מותאם אישית עם כל הפרטים. אפשר לציין ירקות, חלבונים, פחמימות - כל מה שיש!`);
      }
    }, 2000);
  };

  // Wrapper for button clicks
  const handleButtonClick = (query: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      handleAIQuery(query);
    };
  };

  // Wrapper for submit button
  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentInput = fridgeInput.trim();
    if (currentInput) {
      handleAIQuery(); // Uses fridgeInput
      setFridgeInput(""); // Clear after sending
    }
  };

  return (
    <MobileContainer className="min-h-screen relative flex flex-col">
      {/* Reward Banner */}
      <AnimatePresence>
        {showReward && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-4 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-white" size={24} />
              <div>
                <p className="font-bold text-lg">כל הכבוד! 🎉</p>
                <p className="text-sm">הרווחת +{rewardAmount} נקודות</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 pb-2 relative flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate('/main')} className="p-2 bg-gray-100 rounded-full shadow-sm border border-gray-200 z-10">
          {isRTL ? <div>→</div> : <div>←</div>}
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
          <div className="bg-white rounded-full p-1.5 shadow-sm"><Sparkles className="text-orange-500" size={16} /></div>
          <span className="font-bold text-gray-800 text-lg">{points}</span>
          <span className="text-gray-500 text-sm ml-1">נקודות</span>
        </div>
        <button onClick={() => setShowArchive(!showArchive)} className="p-2 bg-gray-100 rounded-full shadow-sm border border-gray-200">
          <Calendar size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6 px-4 pt-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black text-gray-800 mb-1">
              {(() => {
                const hour = new Date().getHours();
                if (hour >= 5 && hour < 12) return 'בוקר טוב! ☀️';
                if (hour >= 12 && hour < 17) return 'צהריים טובים! 🌤️';
                if (hour >= 17 && hour < 21) return 'ערב טוב! 🌙';
                return 'לילה טוב! ✨';
              })()}
            </h1>
            <p className="text-gray-600 text-sm font-medium">הזנת ארוחות יומית</p>
            <p className="text-gray-400 text-xs mt-1 bg-gray-100 inline-block px-3 py-1 rounded-full">{mealCount} מתוך 5 ארוחות</p>
          </div>

          {/* Water Tracker */}
          <div className="bg-[#E0F2FE] rounded-3xl p-5 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div><h3 className="font-bold text-gray-800">שתיית מים</h3><p className="text-xs text-gray-500">יעד יומי: 8 כוסות</p></div>
              <div className="flex items-center gap-2"><Droplet className="text-blue-400" size={20} /><span className="font-bold text-blue-600">{waterGlasses}/8</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <button key={i} onClick={() => handleWaterClick(i)}
                  className={`flex-1 h-12 rounded-lg transition-all ${i < waterGlasses ? 'bg-blue-400 shadow-md' : 'bg-gray-100'}`}
                >
                  {i < waterGlasses && <Droplet className="mx-auto text-white" size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* New Integrated AI Chef Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2.5rem] p-6 shadow-lg border border-purple-200 relative overflow-hidden"
          >
            {/* Animated background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-center gap-3 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg ring-4 ring-purple-100"
              >
                <Sparkles className="text-white" size={20} />
              </motion.div>
              <div>
                <h3 className="text-lg font-black text-gray-800 leading-tight">שף AI אישי 🤖</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">זמין תמיד לעזור</p>
              </div>
            </div>

            <div className="space-y-4">
                {/* Chat Input Bubble-style */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 shadow-sm"
                >
                  {aiMessageCount < 1 ? (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">בחר מה תרצה להכין:</p>
                      <div className="grid grid-cols-2 gap-2">
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick(t('whatCanMakeWithEggs'))} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🥚 {t('whatCanMakeWithEggs')}
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick(t('wantSomethingLight'))} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🥗 {t('wantSomethingLight')}
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick(t('haveChickenAndVeg'))} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🍗 {t('haveChickenAndVeg')}
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick('יש לי דגים וירקות טריים')} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🐟 דגים וירקות
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick('יש לי טופו, אורז וירקות')} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🥘 טופו ואורז
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick('יש לי בשר טחון ותפוחי אדמה')} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🥩 בשר ותפוא"ד
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick('יש לי פסטה ורוטב עגבניות')} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🍝 פסטה ורוטב
                         </motion.button>
                         <motion.button 
                           whileHover={{ scale: 1.05 }} 
                           whileTap={{ scale: 0.95 }}
                           onClick={handleButtonClick('יש לי סלט ירקות וגבינה')} 
                           className="bg-white px-3 py-2 rounded-xl text-right text-xs border border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                         >
                           🥗 סלט וגבינה
                         </motion.button>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={fridgeInput}
                      onChange={(e) => setFridgeInput(e.target.value)}
                      placeholder={t('typeFreely')}
                      className="w-full bg-transparent text-gray-700 placeholder:text-gray-400 text-sm outline-none resize-none h-20 font-medium"
                    />
                  )}
                
                  <div className={`flex justify-end mt-2 ${aiMessageCount < 1 ? 'hidden' : ''}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitClick}
                      disabled={!fridgeInput.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-black text-xs shadow-md hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {t('sendMessage')} ✨
                    </motion.button>
                  </div>
                </motion.div>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-2"
                  >
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl rounded-tr-none p-4 border border-purple-200 self-end max-w-[90%] shadow-sm"
                    >
                      <p className="text-sm text-purple-950 font-medium leading-relaxed whitespace-pre-line">
                        {aiResponse}
                      </p>
                    </motion.div>
                    {aiMealRecommendation && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddAiMeal}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 active:scale-[0.98] transition-all"
                      >
                        <CheckCircle2 size={18} /> הוסף לתפריט היומי המומלץ
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </MobileContainer>
  );
};
