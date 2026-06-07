import React from 'react';

export const AppleHeartIcon = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Heart Shape */}
    <path
      d="M50 88.5C48.5 88.5 47 87.8 29.5 70.3C12 52.8 5 40.5 5 28.5C5 17 14 8.5 25.5 8.5C31.5 8.5 37.5 11.5 41.5 16.5C45.5 11.5 51.5 8.5 57.5 8.5C69 8.5 78 17 78 28.5C78 40.5 71 52.8 53.5 70.3C52 71.8 50.5 72.5 50 72.5L50 88.5Z" // Simplified heart
      fill="#ffb6c1"
    />
    {/* Leaf inside */}
    <path
      d="M50 25C50 25 55 15 65 15C75 15 80 25 80 25C80 25 75 35 65 35C55 35 50 25 50 25Z" // Simplified leaf
      fill="#c1f5c1"
      transform="rotate(-15 65 25)"
    />
  </svg>
);

// Better SVG heart path for smoother look
export const HeartIcon = ({ className = '', size = 100, fill = "#ffb6c1" }: { className?: string; size?: number, fill?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={fill}
    />
  </svg>
);

export const LeafIcon = ({ className = '', size = 24, fill = "#c1f5c1" }: { className?: string; size?: number, fill?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M17 8C19 11 19 16 15 19C11 22 6 22 6 22C6 22 5 17 8 13C11 9 17 8 17 8Z" fill={fill} stroke="none" />
    <path d="M6 22C6 22 8.5 19.5 11 19.5" stroke={fill === '#c1f5c1' ? '#a0d5a0' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

import logoImg from 'figma:asset/22b250791f86920cebe2407c2aa817d46569fc3c.png';

export const Logo = ({ size = 100, className = '' }: { size?: number, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img
        src={logoImg}
        alt="Wellines Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
