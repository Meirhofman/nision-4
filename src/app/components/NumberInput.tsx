import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui';
import { clsx } from 'clsx';

interface NumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
  suffix?: string;
}

export const NumberInput = ({ value, onChange, min = 0, max = 200, label, suffix }: NumberInputProps) => {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {label && <label className="text-lg font-medium text-foreground dark:text-slate-100">{label}</label>}
      <div className="flex items-center space-x-4 bg-card rounded-xl shadow-sm p-2 border border-border w-full max-w-xs justify-between dark:bg-slate-800 dark:border-slate-600">
        <Button 
          variant="secondary" 
          onClick={decrement} 
          disabled={value <= min}
          className="h-12 w-12 rounded-lg p-0"
        >
          <ChevronDown size={24} />
        </Button>
        
        <div className="flex items-baseline space-x-1">
          <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-3xl font-bold text-center w-20 outline-none bg-transparent text-foreground dark:text-slate-100"
          />
          {suffix && <span className="text-muted-foreground font-medium dark:text-slate-400">{suffix}</span>}
        </div>

        <Button 
          variant="secondary" 
          onClick={increment} 
          disabled={value >= max}
          className="h-12 w-12 rounded-lg p-0"
        >
          <ChevronUp size={24} />
        </Button>
      </div>
    </div>
  );
};
