import React, { useState } from 'react';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { NewTopBar } from '../components/NewTopBar';
import { Edit2, Check, Droplets, Flame, Footprints, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

export const DailyGoals = () => {
  const { dailyGoals, dailyProgress, updateDailyGoals } = useApp();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [tempGoals, setTempGoals] = useState({ ...dailyGoals });
  const navigate = useNavigate();

  const goals = [
    {
      id: 'water',
      name: 'מים',
      icon: Droplets,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      progress: dailyProgress.water,
      goal: dailyGoals.water,
      unit: 'כוסות',
      link: '/nutrition'
    },
    {
      id: 'calories',
      name: 'קלוריות',
      icon: Flame,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      progress: dailyProgress.calories,
      goal: dailyGoals.calories,
      unit: 'קלוריות',
      link: '/nutrition'
    },
    {
      id: 'steps',
      name: 'צעדים',
      icon: Footprints,
      color: '#10B981',
      bgColor: '#D1FAE5',
      progress: dailyProgress.steps,
      goal: dailyGoals.steps,
      unit: 'צעדים',
      link: '/social'
    },
    {
      id: 'workoutMinutes',
      name: 'אימון',
      icon: Clock,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      progress: dailyProgress.workoutMinutes,
      goal: dailyGoals.workoutMinutes,
      unit: 'דקות',
      link: '/workouts'
    }
  ];

  const getStatus = (progress: number, goal: number) => {
    if (progress >= goal) return { text: '✅ הושלם', color: '#10B981' };
    if (progress > 0) return { text: '🔄 בתהליך', color: '#F59E0B' };
    return { text: '⏳ טרם התחיל', color: '#9CA3AF' };
  };

  const handleSaveGoal = () => {
    updateDailyGoals(tempGoals);
    setEditingGoal(null);
  };

  return (
    <MobileContainer className="min-h-[100dvh] bg-white">
      <NewTopBar title="יעדי היום" />
      
      <div className="flex flex-col gap-4 px-5 pt-4 pb-8 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {editingGoal ? 'עריכת יעד' : 'יעדי היום'}
          </h2>
          {editingGoal && (
            <button
              onClick={handleSaveGoal}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F0FF] text-[#534AB7] font-medium"
            >
              <Check size={18} />
              <span>שמור</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const percent = Math.min((goal.progress / goal.goal) * 100, 100);
            const status = getStatus(goal.progress, goal.goal);
            const isEditingThisGoal = editingGoal === goal.id;

            return (
              <div
                key={goal.id}
                className={`w-full p-5 rounded-2xl relative transition-all duration-200 ${
                  isEditingThisGoal 
                    ? 'bg-[#F5F5F5] border-2 border-[#A78BFA]' 
                    : 'bg-[#F5F5F5] border-2 border-transparent hover:border-[#A78BFA]'
                }`}
              >
                {/* Edit Button */}
                {!isEditingThisGoal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGoal(goal.id);
                    }}
                    className="absolute top-5 left-5 opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    <Edit2 size={18} color="#A78BFA" />
                  </button>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: goal.bgColor }}>
                      <Icon className="w-5 h-5" style={{ color: goal.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{goal.name}</h3>
                      {!isEditingThisGoal && (
                        <p className="text-sm" style={{ color: status.color }}>
                          {status.text}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditingThisGoal ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempGoals({ ...tempGoals, [goal.id]: Math.max(1, tempGoals[goal.id] - (goal.id === 'steps' ? 500 : 1)) });
                        }}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold">{tempGoals[goal.id]}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempGoals({ ...tempGoals, [goal.id]: tempGoals[goal.id] + (goal.id === 'steps' ? 500 : 1) });
                        }}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="text-right" onClick={() => navigate(goal.link)}>
                      <p className="font-bold text-gray-800">
                        {goal.progress} / {goal.goal}
                      </p>
                      <p className="text-xs text-gray-500">{goal.unit}</p>
                    </div>
                  )}
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${percent}%`, backgroundColor: goal.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileContainer>
  );
};
