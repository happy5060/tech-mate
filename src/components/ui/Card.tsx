import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${
        hoverEffect
          ? 'transition-all duration-200 hover:shadow-card-hover hover:border-slate-300 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
