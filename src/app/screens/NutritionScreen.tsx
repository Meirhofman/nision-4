import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  Star,
  ClipboardList,
  Camera,
  Book,
  X,
  Plus,
  ChevronLeft,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { nutritionScreenStrings, Language } from "@/i18n/nutritionScreen";
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Meal {
  id: number;
  type: string;
  typeEmoji: string;
  name: string;
  calories: string;
  time: string;
  grade: string;
  gradeColor: string;
}

const MEAL_TYPES = [
  { id: 'breakfast', label: 'ארוחת בוקר', emoji: '🥣' },
  { id: 'lunch',     label: 'ארוחת צהריים', emoji: '🍝' },
  { id: 'dinner',    label: 'ארוחת ערב',  emoji: '🍽️' },
  { id: 'snack',     label: 'חטיף',       emoji: '🍎' },
];

const QUICK_FOODS = [
  { name: 'בננה', calories: '89', emoji: '🍌' },
  { name: 'ביצה', calories: '78', emoji: '🥚' },
  { name: 'לחם', calories: '79', emoji: '🍞' },
  { name: 'עוף', calories: '165', emoji: '🍗' },
  { name: 'אורז', calories: '206', emoji: '🍚' },
  { name: 'סלט', calories: '45', emoji: '🥗' },
  { name: 'יוגורט', calories: '59', emoji: '🥛' },
  { name: 'שוקולד', calories: '150', emoji: '🍫' },
];

function getGrade(cal: number): { grade: string; color: string } {
  if (cal < 400) return { grade: 'A', color: '#10B981' };
  if (cal < 600) return { grade: 'B', color: '#F59E0B' };
  return { grade: 'C', color: '#EF4444' };
}

// ─── Meal Modal ────────────────────────────────────────────────────────────────
interface MealModalProps {
  onClose: () => void;
  darkMode: boolean;
  onSave: (meal: Omit<Meal, 'id'>) => void;
  initial?: Meal | null;
}

function MealModal({ onClose, darkMode, onSave, initial }: MealModalProps) {
  const [step, setStep] = useState<'type' | 'details'>(initial ? 'details' : 'type');
  const [mealType, setMealType] = useState(initial?.type ?? '');
  const [mealEmoji, setMealEmoji] = useState(initial?.typeEmoji ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [calories, setCalories] = useState(initial?.calories ?? '');
  const [saved, setSaved] = useState(false);

  const dk = darkMode;
  const bg      = dk ? '#1a1033' : '#fff';
  const surface = dk ? '#241a40' : '#f7f6ff';
  const border  = dk ? '#3a2a60' : '#e8e4ff';
  const text    = dk ? '#f3f0ff' : '#2d1f60';
  const muted   = dk ? '#9b8dc8' : '#b0a8cc';

  const handleSave = () => {
    if (!name || !calories) return;
    const cal = parseInt(calories) || 0;
    const { grade, color } = getGrade(cal);
    onSave({
      type: mealType,
      typeEmoji: mealEmoji,
      name,
      calories,
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      grade,
      gradeColor: color,
    });
    setSaved(true);
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full rounded-t-3xl p-5 pb-8" style={{ background: bg, border: `1px solid ${border}` }} dir="rtl">
        <div className="w-12 h-1.5 rounded-full mx-auto mb-4" style={{ background: border }} />

        {saved ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
            <p className="font-bold text-lg" style={{ color: text }}>
              {initial ? 'הארוחה עודכנה!' : 'הארוחה נשמרה!'}
            </p>
          </div>
        ) : step === 'type' ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={onClose}><X className="w-5 h-5" style={{ color: muted }} /></button>
              <h2 className="font-black text-lg" style={{ color: text }}>הוסף ארוחה</h2>
              <div />
            </div>

            {/* Meal type grid */}
            <p className="text-sm mb-3 text-center" style={{ color: muted }}>בחר סוג ארוחה</p>
            <div className="grid grid-cols-2 gap-3">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMealType(m.label); setMealEmoji(m.emoji); setStep('details'); }}
                  className="p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-all"
                  style={{ background: surface, border: `1.5px solid ${border}` }}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: text }}>{m.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {!initial ? (
                <button onClick={() => setStep('type')}><ChevronLeft className="w-5 h-5" style={{ color: muted }} /></button>
              ) : <div />}
              <h2 className="font-black text-base" style={{ color: text }}>{mealEmoji} {mealType}</h2>
              <button onClick={onClose}><X className="w-5 h-5" style={{ color: muted }} /></button>
            </div>

            {/* Quick food chips */}
            <p className="text-xs mb-2 font-bold" style={{ color: muted }}>בחר מזון מהיר</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {QUICK_FOODS.map((f) => (
                <button
                  key={f.name}
                  onClick={() => { setName(f.name); setCalories(f.calories); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: name === f.name ? '#7c3aed' : surface,
                    color: name === f.name ? '#fff' : text,
                    border: `1px solid ${name === f.name ? '#7c3aed' : border}`,
                  }}
                >
                  <span>{f.emoji}</span>
                  <span>{f.name}</span>
                  <span style={{ color: name === f.name ? 'rgba(255,255,255,0.7)' : muted }}>{f.calories}</span>
                </button>
              ))}
            </div>

            {/* Manual entry */}
            <p className="text-xs mb-2 font-bold" style={{ color: muted }}>או הזן ידנית</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם המאכל"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: surface, border: `1px solid ${border}`, color: text }}
              />
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="קל'"
                className="w-20 px-3 py-2.5 rounded-xl text-sm text-center outline-none"
                style={{ background: surface, border: `1px solid ${border}`, color: text }}
              />
            </div>

            {calories && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: surface }}>
                <span className="text-sm" style={{ color: muted }}>קלוריות:</span>
                <span className="font-black text-sm" style={{ color: '#7c3aed' }}>{calories} קל'</span>
                <div className="flex-1" />
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                  background: `${getGrade(parseInt(calories)||0).color}20`,
                  color: getGrade(parseInt(calories)||0).color,
                }}>
                  {getGrade(parseInt(calories)||0).grade}
                </span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!name || !calories}
              className="w-full py-3.5 rounded-2xl font-black text-white text-sm disabled:opacity-40 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
            >
              {initial ? 'עדכן ארוחה' : 'שמור ארוחה'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Recipes Modal ─────────────────────────────────────────────────────────────
function RecipesModal({ onClose, darkMode }: { onClose: () => void; darkMode: boolean }) {
  const bg     = darkMode ? '#1a1033' : '#fff';
  const border = darkMode ? '#3a2a60' : '#e8e4ff';
  const text   = darkMode ? '#f3f0ff' : '#2d1f60';
  const muted  = darkMode ? '#9b8dc8' : '#b0a8cc';
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full rounded-t-3xl p-7 pb-10 text-center" style={{ background: bg, border: `1px solid ${border}` }} dir="rtl">
        <div className="w-12 h-1.5 rounded-full mx-auto mb-5" style={{ background: border }} />
        <div className="text-5xl mb-3">📖</div>
        <h2 className="font-black text-xl mb-1" style={{ color: text }}>מתכונים</h2>
        <p className="text-sm mb-5" style={{ color: muted }}>🚀 בקרוב יעלו מתכונים חדשים ומותאמים אישית!</p>
        <div className="rounded-2xl p-4 mb-5 text-right" style={{ background: darkMode ? '#241a40' : '#f3f1ff', border: `1px solid ${border}` }}>
          {['מתכונים לפי יעד קלורי', 'מתכונים לפי אלרגיות', 'תוכנית שבועית מותאמת אישית'].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm" style={{ color: text }}>{item}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-2xl font-black text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>
          סגור
        </button>
      </div>
    </div>
  );
}

// ─── MealRow with edit hover ───────────────────────────────────────────────────
function MealRow({ meal, bg, border, text, muted, onEdit }: {
  meal: Meal; bg: string; border: string; text: string; muted: string;
  onEdit: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="p-4 rounded-2xl flex items-center gap-3 relative transition-all"
      style={{ background: hovered ? `${bg}ee` : bg, border: `1px solid ${hovered ? '#7c3aed' : border}`, cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(124,58,237,0.08)' }}>
        {meal.typeEmoji}
      </div>
      <div className="flex-1">
        <div className="font-bold text-sm" style={{ color: text }}>{meal.name}</div>
        <div className="text-xs" style={{ color: muted }}>{meal.type} · {meal.time}</div>
      </div>
      <div className="text-left">
        <div className="font-bold text-sm" style={{ color: text }}>{meal.calories}</div>
        <div className="text-xs" style={{ color: muted }}>קל'</div>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: `${meal.gradeColor}20`, color: meal.gradeColor }}>
        {meal.grade}
      </div>

      {/* Edit overlay on hover */}
      {hovered && (
        <button
          onClick={onEdit}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
          style={{ background: '#7c3aed' }}
          title="ערוך ארוחה"
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
const INITIAL_MEALS: Meal[] = [
  { id: 1, type: 'ארוחת בוקר', typeEmoji: '🥣', name: 'שקשוקה', calories: '420', time: '08:30', grade: 'A', gradeColor: '#10B981' },
  { id: 2, type: 'ארוחת צהריים', typeEmoji: '🍝', name: 'פסטה עם עוף', calories: '680', time: '13:15', grade: 'B', gradeColor: '#F59E0B' },
  { id: 3, type: 'ארוחת ערב', typeEmoji: '🍕', name: 'פיצה', calories: '747', time: '19:45', grade: 'C', gradeColor: '#EF4444' },
];

export function NutritionScreen({ lang = 'he' }: { lang?: Language }) {
  const t = nutritionScreenStrings[lang];
  const navigate = useNavigate();
  const { darkMode } = useApp();

  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [activeModal, setActiveModal] = useState<'addMeal' | 'recipes' | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraPhoto, setCameraPhoto] = useState<string | null>(null);

  const dk      = darkMode;
  const bg      = dk ? '#0f0a1e' : '#f7f6ff';
  const card    = dk ? '#1a1033' : '#ffffff';
  const border  = dk ? '#2e1f50' : '#e8e4ff';
  const text    = dk ? '#f3f0ff' : '#2d1f60';
  const muted   = dk ? '#9b8dc8' : '#b0a8cc';

  const totalCalories = meals.reduce((s, m) => s + (parseInt(m.calories) || 0), 0);

  const handleSaveMeal = (meal: Omit<Meal, 'id'>) => {
    if (editingMeal) {
      setMeals((prev) => prev.map((m) => m.id === editingMeal.id ? { ...meal, id: editingMeal.id } : m));
    } else {
      setMeals((prev) => [...prev, { ...meal, id: Date.now() }]);
    }
    setEditingMeal(null);
    setActiveModal(null);
  };

  const handleCameraClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCameraPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: dk ? '#060410' : '#eee9ff' }}>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      {/* Phone Frame */}
      <div
        className="w-full max-w-[390px] min-h-[844px] relative flex flex-col overflow-hidden rounded-[36px] shadow-2xl"
        style={{ background: bg, border: `3px solid ${border}` }}
      >
        {/* Camera Photo Toast */}
        {cameraPhoto && (
          <div className="absolute top-20 left-4 right-4 z-40 rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${border}` }}>
            <img src={cameraPhoto} alt="צולם" className="w-full h-36 object-cover" />
            <div className="p-3 flex items-center justify-between" style={{ background: card }}>
              <button onClick={() => setCameraPhoto(null)} className="text-xs" style={{ color: muted }}>סגור</button>
              <span className="text-xs font-bold" style={{ color: '#7c3aed' }}>📸 תמונה צולמה!</span>
              <button onClick={() => { setActiveModal('addMeal'); setCameraPhoto(null); }} className="text-xs font-black px-3 py-1 rounded-full text-white" style={{ background: '#7c3aed' }}>
                הוסף ארוחה
              </button>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex items-center justify-between p-4" dir="rtl">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: card, border: `1px solid ${border}` }}>
            <Star className="w-3.5 h-3.5" style={{ color: '#7C3AED', fill: '#7C3AED' }} />
            <span className="font-medium" style={{ color: text, fontSize: '13px' }}>1,240</span>
            <span style={{ color: muted, fontSize: '11px' }}>{t.points}</span>
          </div>
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card, border: `1px solid ${border}` }}>
            <ChevronRight className="w-5 h-5" style={{ color: text }} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8" dir="rtl">

          {/* Hero Card */}
          <div className="relative overflow-hidden mb-5 rounded-3xl p-6" style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#A78BFA 100%)' }}>
            <div className="absolute w-28 h-28 rounded-full opacity-10 bg-white" style={{ top: '-30px', right: '-20px' }} />
            <div className="absolute w-20 h-20 rounded-full opacity-10 bg-white" style={{ bottom: '10px', left: '-15px' }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs mb-1 text-white/90">{t.caloriesToday}</div>
                  <div className="font-black text-white" style={{ fontSize: '32px', lineHeight: 1.1 }}>{totalCalories.toLocaleString()}</div>
                </div>
                <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                  <div className="text-xs text-white/90">{t.dayScore}</div>
                  <div className="font-black text-white text-xl">
                    {getGrade(totalCalories).grade}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <MacroPill label={t.protein} value="78g" progress={78} />
                <MacroPill label={t.carbs} value="165g" progress={65} />
                <MacroPill label={t.fat} value="52g" progress={85} />
              </div>
            </div>
          </div>

          {/* Quick Add Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <QuickCard icon={<ClipboardList className="w-5 h-5" />} label="הזן ארוחה" highlighted border={border} text={text} onClick={() => { setEditingMeal(null); setActiveModal('addMeal'); }} />
            <QuickCard icon={<Camera className="w-5 h-5" />} label={t.photoPlate} border={border} text={text} card={card} onClick={handleCameraClick} />
            <QuickCard icon={<Book className="w-5 h-5" />} label={t.recipes} border={border} text={text} card={card} onClick={() => setActiveModal('recipes')} />
          </div>

          {/* Meal Log Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold" style={{ color: text }}>{t.mealLog}</div>
              <span className="text-xs" style={{ color: muted }}>{meals.length} ארוחות</span>
            </div>
            <div className="space-y-2">
              {meals.map((meal) => (
                <MealRow
                  key={meal.id}
                  meal={meal}
                  bg={card}
                  border={border}
                  text={text}
                  muted={muted}
                  onEdit={() => { setEditingMeal(meal); setActiveModal('addMeal'); }}
                />
              ))}
            </div>
          </div>

          {/* Add meal CTA */}
          <button
            onClick={() => { setEditingMeal(null); setActiveModal('addMeal'); }}
            className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}
          >
            <Plus className="w-5 h-5" />
            הוסף ארוחה
          </button>
        </div>

        {/* Modals */}
        {activeModal === 'addMeal' && (
          <MealModal
            onClose={() => { setActiveModal(null); setEditingMeal(null); }}
            darkMode={dk}
            onSave={handleSaveMeal}
            initial={editingMeal}
          />
        )}
        {activeModal === 'recipes' && <RecipesModal onClose={() => setActiveModal(null)} darkMode={dk} />}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────────
function MacroPill({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="flex-1 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
      <div className="text-xs mb-1 text-white/90">{label}</div>
      <div className="font-bold text-sm mb-2 text-white">{value}</div>
      <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
        <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function QuickCard({ icon, label, highlighted, border, text, card, onClick }: {
  icon: React.ReactNode; label: string; highlighted?: boolean;
  border: string; text: string; card?: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-all"
      style={{
        background: highlighted ? 'rgba(124,58,237,0.12)' : card ?? '#fff',
        border: highlighted ? '2px solid #7C3AED' : `1px solid ${border}`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: highlighted ? '#7C3AED' : 'rgba(124,58,237,0.1)', color: highlighted ? '#FFFFFF' : '#7C3AED' }}
      >
        {icon}
      </div>
      <div className="text-xs text-center font-medium" style={{ color: text }}>{label}</div>
    </button>
  );
}
