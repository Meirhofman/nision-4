import {
  ChevronRight,
  Star,
  Scan,
  Camera,
  Book,
  Bot
} from "lucide-react";
import { nutritionScreenStrings, Language } from "@/i18n/nutritionScreen";

export function NutritionScreen({ lang = 'he' }: { lang?: Language }) {
  const t = nutritionScreenStrings[lang];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: 'var(--nutrition-bg)' }}>
      {/* Mobile Frame */}
      <div className="w-full max-w-[390px] min-h-[844px] relative flex flex-col overflow-hidden" style={{ background: 'var(--nutrition-bg)' }}>

        {/* Top Bar */}
        <div className="flex items-center justify-between p-4" dir={lang === 'he' ? 'rtl' : 'ltr'}>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'var(--nutrition-card)', border: '1px solid var(--nutrition-border)' }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: '#7C3AED', fill: '#7C3AED' }} />
            <span className="font-medium" style={{ color: 'var(--nutrition-text)', fontSize: '13px' }}>1,240</span>
            <span style={{ color: 'var(--nutrition-muted)', fontSize: '11px' }}>{t.points}</span>
          </div>
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--nutrition-card)', border: '1px solid var(--nutrition-border)' }}
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--nutrition-text)' }} />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-10" dir={lang === 'he' ? 'rtl' : 'ltr'}>
          
          {/* Hero Card */}
          <div 
            className="relative overflow-hidden mb-5"
            style={{ 
              background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
              borderRadius: '24px',
              padding: '24px'
            }}
          >
            {/* Decorative Circles */}
            <div 
              className="absolute"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                top: '-40px',
                right: '-30px'
              }}
            />
            <div 
              className="absolute"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                bottom: '20px',
                left: '-20px'
              }}
            />

            <div className="relative z-10">
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div
                    className="text-xs mb-1"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {t.caloriesToday}
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: '#FFFFFF', fontSize: '32px', lineHeight: '1.2' }}
                  >
                    1,847
                  </div>
                </div>
                <div
                  className="px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {t.dayScore}
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: '#FFFFFF', fontSize: '18px' }}
                  >
                    B+
                  </div>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="flex gap-2 mt-4">
                <MacroPill label={t.protein} value="78g" progress={78} />
                <MacroPill label={t.carbs} value="165g" progress={65} />
                <MacroPill label={t.fat} value="52g" progress={85} />
              </div>
            </div>
          </div>

          {/* Quick Add Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <QuickAddCard
              icon={<Scan className="w-5 h-5" />}
              label={t.scanFood}
              highlighted
            />
            <QuickAddCard
              icon={<Camera className="w-5 h-5" />}
              label={t.photoPlate}
            />
            <QuickAddCard
              icon={<Book className="w-5 h-5" />}
              label={t.recipes}
            />
          </div>

          {/* AI Buddy Card */}
          <div
            className="p-4 mb-5"
            style={{
              background: 'var(--nutrition-card)',
              borderRadius: '20px',
              border: '1px solid var(--nutrition-border)'
            }}
          >
            <div className="flex gap-3">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)'
                }}
              >
                <Bot className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div
                  className="text-xs mb-1"
                  style={{ color: '#7C3AED' }}
                >
                  {t.novaLabel}
                </div>
                <div
                  className="text-sm mb-3"
                  style={{ color: 'var(--nutrition-text)' }}
                >
                  {t.novaMessage}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: '#7C3AED',
                      color: '#FFFFFF'
                    }}
                  >
                    {t.novaSure}
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{
                      background: 'var(--nutrition-purple-light)',
                      color: '#7C3AED'
                    }}
                  >
                    {t.novaLater}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Log Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div
                className="font-medium"
                style={{ color: 'var(--nutrition-text)' }}
              >
                {t.mealLog}
              </div>
              <button
                className="text-sm"
                style={{ color: '#7C3AED' }}
              >
                {t.seeAll}
              </button>
            </div>

            <div className="space-y-2">
              <MealRow
                emoji="🥗"
                name={t.breakfast}
                time="08:30"
                calories="420"
                caloriesLabel={t.calories}
                grade="A"
                gradeColor="#10B981"
              />
              <MealRow
                emoji="🍝"
                name={t.lunch}
                time="13:15"
                calories="680"
                caloriesLabel={t.calories}
                grade="B"
                gradeColor="#F59E0B"
              />
              <MealRow
                emoji="🍕"
                name={t.dinner}
                time="19:45"
                calories="747"
                caloriesLabel={t.calories}
                grade="C"
                gradeColor="#EF4444"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MacroPill({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div 
      className="flex-1 px-3 py-2 rounded-xl"
      style={{ background: 'rgba(255, 255, 255, 0.15)' }}
    >
      <div 
        className="text-xs mb-1"
        style={{ color: 'rgba(255, 255, 255, 0.9)' }}
      >
        {label}
      </div>
      <div 
        className="font-medium text-sm mb-2"
        style={{ color: '#FFFFFF' }}
      >
        {value}
      </div>
      <div 
        className="h-1 rounded-full"
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      >
        <div 
          className="h-full rounded-full"
          style={{ 
            background: '#FFFFFF',
            width: `${progress}%`
          }}
        />
      </div>
    </div>
  );
}

function QuickAddCard({
  icon,
  label,
  highlighted
}: {
  icon: React.ReactNode;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className="p-4 rounded-2xl flex flex-col items-center gap-2"
      style={{
        background: highlighted ? 'var(--nutrition-purple-light)' : 'var(--nutrition-card)',
        border: highlighted ? '2px solid #7C3AED' : '1px solid var(--nutrition-border)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: highlighted ? '#7C3AED' : 'var(--nutrition-purple-light)',
          color: highlighted ? '#FFFFFF' : '#7C3AED'
        }}
      >
        {icon}
      </div>
      <div
        className="text-xs text-center"
        style={{ color: 'var(--nutrition-text)' }}
      >
        {label}
      </div>
    </div>
  );
}

function MealRow({
  emoji,
  name,
  time,
  calories,
  caloriesLabel,
  grade,
  gradeColor
}: {
  emoji: string;
  name: string;
  time: string;
  calories: string;
  caloriesLabel: string;
  grade: string;
  gradeColor: string;
}) {
  return (
    <div
      className="p-4 rounded-2xl flex items-center gap-3"
      style={{
        background: 'var(--nutrition-card)',
        border: '1px solid var(--nutrition-border)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: 'var(--nutrition-bg)' }}
      >
        {emoji}
      </div>
      <div className="flex-1">
        <div
          className="font-medium text-sm"
          style={{ color: 'var(--nutrition-text)' }}
        >
          {name}
        </div>
        <div
          className="text-xs"
          style={{ color: 'var(--nutrition-muted)' }}
        >
          {time}
        </div>
      </div>
      <div className="text-left">
        <div
          className="font-medium text-sm"
          style={{ color: 'var(--nutrition-text)' }}
        >
          {calories}
        </div>
        <div
          className="text-xs"
          style={{ color: 'var(--nutrition-muted)' }}
        >
          {caloriesLabel}
        </div>
      </div>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center font-medium text-sm"
        style={{
          background: `${gradeColor}15`,
          color: gradeColor
        }}
      >
        {grade}
      </div>
    </div>
  );
}

