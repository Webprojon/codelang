import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AvatarProps {
  name?: string;
  userId?: number;
  imageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

export default function Avatar({
  name,
  imageUrl,
  size = 'md',
  className = '',
  userId,
}: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const initials = name ? name.slice(0, 1).toUpperCase() : '?';
  const [imageError, setImageError] = useState(false);

  const avatarContent = (
    <div
      className={`${sizeClass} rounded-full bg-blue-400 font-semibold text-blue-900 flex-center ${className}`}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={name || 'User avatar'}
          loading="lazy"
          className={`${sizeClass} rounded-full object-cover`}
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );

  if (userId) {
    return (
      <Link to={`/user/${userId}`} className="cursor-pointer">
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
}
