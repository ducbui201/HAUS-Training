import React from 'react';
import type { Area } from '../../types';
import LucideIcon from '../ui/LucideIcon';

interface AreaCardProps {
  area: Area;
  isActive: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const AreaCard: React.FC<AreaCardProps> = ({
  area,
  isActive,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <div
      id={`area-${area.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`
        group relative px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between select-none
        ${isActive 
          ? 'bg-blue-900/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] translate-x-1.5 area-selected' 
          : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-500 hover:translate-x-1'}
        ${isDimmed ? 'opacity-20 blur-[0.5px] scale-98' : 'opacity-100 scale-100'}
      `}
      style={{ height: '7vh' }}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Dynamic Icon */}
        <div 
          className={`
            p-1.5 rounded-lg transition-colors duration-300 shrink-0
            ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-400 group-hover:text-slate-300'}
          `}
        >
          <LucideIcon name={area.icon} size={18} />
        </div>
        
        {/* Name */}
        <span 
          className={`
            text-xs font-bold uppercase tracking-wide truncate transition-colors duration-300
            ${isActive ? 'text-yellow-300' : 'text-slate-200 group-hover:text-white'}
          `}
        >
          {area.name}
        </span>
      </div>
    </div>
  );
};

export default AreaCard;
