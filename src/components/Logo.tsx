import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center shadow-lg overflow-hidden`}>
        <img 
          src="/logo.png" 
          alt="DayTrack Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold text-white ${textSizeClasses[size]}`}>
          DayTrack
        </span>
      )}
    </div>
  );
};
