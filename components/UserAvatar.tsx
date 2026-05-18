import React from 'react';
import { UserAvatar as UserAvatarType } from '../types';

interface UserAvatarProps {
  avatar: UserAvatarType;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, className = "w-8 h-8" }) => {
  const getAvatarSrc = () => {
    switch (avatar) {
      case 'avocado':
        return '/avatar-avocado-food-svgrepo-com.svg';
      case 'coffee':
        return '/avatar-coffee-cup-svgrepo-com.svg';
      case 'sloth':
        return '/avatar-lazybones-sloth-svgrepo-com.svg';
      case 'breaking':
        return '/avatar-bad-breaking-svgrepo-com.svg';
      default:
        return '/avatar-avocado-food-svgrepo-com.svg';
    }
  };

  return (
    <img 
      src={getAvatarSrc()} 
      alt={`${avatar} avatar`}
      className={className}
    />
  );
};

export default UserAvatar;
