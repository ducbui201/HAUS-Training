import React, { type ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  hoverable?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-md bg-opacity-20 border rounded-2xl shadow-xl transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${hoverable ? 'hover:bg-opacity-30 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'rgba(0, 78, 146, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
