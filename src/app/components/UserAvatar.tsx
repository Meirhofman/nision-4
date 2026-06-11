import React from 'react';

export interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  size?: number;
  className?: string;
}

function getInitials(displayName?: string | null): string {
  if (!displayName?.trim()) return '?';
  return displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  displayName,
  size = 36,
  className = '',
}) => {
  const fontSize = Math.max(11, Math.round(size * 0.36));

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName || ''}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#F4F0FF',
        color: '#534AB7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {getInitials(displayName)}
    </div>
  );
};
