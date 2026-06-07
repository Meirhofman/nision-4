import React from 'react';
import { useApp } from '../context/AppContext';

export const MobileContainer = ({ 
  children, 
  className = '', 
  style, 
  noScroll = false 
}: { 
  children: React.ReactNode; 
  className?: string; 
  style?: React.CSSProperties; 
  noScroll?: boolean;
}) => {
  const { isRTL, darkMode } = useApp();

  const outerClasses = [
    'w-full', 'max-w-md', 'mx-auto', 'h-[100dvh]', 'relative', 'shadow-xl', 'flex', 'flex-col', 'pt-safe', 'pb-safe',
    className.includes('bg-') ? '' : (darkMode ? 'bg-slate-900' : 'bg-[#fff5f7]'),
    className
  ].filter(Boolean).join(' ');

  const innerClasses = [
    'flex-1', 'flex', 'flex-col', 'w-full', 'overflow-x-hidden', noScroll ? 'overflow-hidden' : 'overflow-y-auto'
  ].filter(Boolean).join(' ');

  return (
    <div className={outerClasses} style={style}>
      <div className={innerClasses}>
        {children}
      </div>
    </div>
  );
};
