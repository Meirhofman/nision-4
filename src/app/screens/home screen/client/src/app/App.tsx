import { useState } from "react";
import {
  Settings,
  Award,
  Salad,
  Dumbbell,
  Users,
} from "lucide-react";

/**
 * Design Philosophy: Modern Health & Wellness App for Teens
 * - Soft gradients with blue-to-purple palette
 * - Rounded, friendly UI elements with enhanced depth
 * - Character-driven engagement with smooth animations
 * - Clear visual hierarchy with icons and badges
 * - Modern glassmorphism effects and smooth transitions
 */

export default function App() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleButtonClick = (tab: string) => {
    setActiveTab(tab);
    setTimeout(() => setActiveTab(null), 300);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50/40 to-purple-50/20 flex items-center justify-center relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-sm flex flex-col h-full px-5 py-5 relative z-10">
        {/* Top Buttons Section */}
        <div className="flex justify-between items-center mb-3 animate-slide-up">
          <button 
            className="w-16 h-16 bg-white/70 backdrop-blur-xl border border-white/60 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/80 hover:border-white/80 group animate-glow-pulse"
          >
            <Settings className="w-7 h-7 text-gray-700 group-hover:text-gray-800 transition-colors" />
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-3xl active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg hover:border-amber-200 group hover:bg-amber-50/50">
            <Award className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-gray-700 group-hover:text-amber-700 transition-colors">
              250
            </span>
          </button>
        </div>

        {/* Heading Section */}
        <div className="text-center mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            ברוך הבא!
          </h1>
          <p className="text-lg text-gray-600">
            טוב לראות אותך
          </p>
        </div>

        {/* Character in the middle */}
        <div className="flex-1 flex items-center justify-center -my-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438076704/jUkFRkoNyYX8kA8fyKJieZ/blue-character-no-bg-3799tyfsB3hfxRzFSMVmfM.webp"
              alt="Character"
              className="w-[16rem] h-[16rem] object-contain drop-shadow-2xl animate-float"
            />
            {/* Glow effect behind character */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-300/20 to-purple-300/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        {/* Bottom Buttons Section */}
        <div className="grid grid-cols-3 gap-3 pb-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <button 
            onClick={() => handleButtonClick("nutrition")}
            className={`flex flex-col items-center gap-3 py-7 px-1 bg-white border border-gray-100 rounded-3xl transition-all duration-300 shadow-md hover:shadow-lg hover:border-emerald-200 group ${
              activeTab === "nutrition" ? "scale-95 bg-emerald-50" : "hover:bg-emerald-50/50"
            }`}
          >
            <Salad className="w-11 h-11 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-base font-semibold text-gray-700 group-hover:text-emerald-700 transition-colors">
              תזונה
            </span>
          </button>

          <button 
            onClick={() => handleButtonClick("workouts")}
            className={`flex flex-col items-center gap-3 py-7 px-1 bg-white border border-gray-100 rounded-3xl transition-all duration-300 shadow-md hover:shadow-lg hover:border-blue-200 group ${
              activeTab === "workouts" ? "scale-95 bg-blue-50" : "hover:bg-blue-50/50"
            }`}
          >
            <Dumbbell className="w-11 h-11 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-base font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
              אימונים
            </span>
          </button>

          <button 
            onClick={() => handleButtonClick("social")}
            className={`flex flex-col items-center gap-3 py-7 px-1 bg-white border border-gray-100 rounded-3xl transition-all duration-300 shadow-md hover:shadow-lg hover:border-purple-200 group ${
              activeTab === "social" ? "scale-95 bg-purple-50" : "hover:bg-purple-50/50"
            }`}
          >
            <Users className="w-11 h-11 text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-base font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
              חברתי
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
