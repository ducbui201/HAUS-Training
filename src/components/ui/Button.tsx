import React, { type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'secondary',
  disabled = false,
  type = 'button'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]';
      case 'danger':
        return 'bg-red-600/80 text-white border-red-500 hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'ghost':
        return 'bg-transparent text-slate-300 border-transparent hover:bg-white/10 hover:text-white';
      case 'secondary':
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-500';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider
        border rounded-xl transition-all duration-300 backdrop-blur-sm cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed select-none
        ${getVariantStyles()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
