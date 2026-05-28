import React, { useState, useEffect } from 'react';
import type { Tool } from '../../types';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

interface ToolCardProps {
  tool: Tool;
  isFaded: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFaded,
  isSelected,
  onClick
}) => {
  const [imgError, setImgError] = useState(false);
  const { showImages } = useApp();

  useEffect(() => {
    setImgError(false);
  }, [tool.id]);

  return (
    <div
      id={`tool-${tool.id}`}
      onClick={onClick}
      className={`
        machine-card-glass relative flex flex-col items-center text-center p-2 rounded-xl cursor-pointer select-none transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-1 ring-yellow-400 scale-105 z-10 bg-yellow-400/10' 
          : 'border-slate-800 hover:border-slate-500 hover:scale-102'}
        ${isFaded ? 'opacity-20 blur-[0.5px] scale-98 hover:opacity-30' : 'opacity-100 scale-100'}
      `}
      style={{ minHeight: '11vh' }}
    >
      {/* Image Thumbnail */}
      {showImages ? (
        <div className="w-10 h-10 bg-white rounded-lg p-0.5 flex items-center justify-center shadow-md shrink-0 relative overflow-hidden">
          {imgError ? (
            <span className="text-[9px] font-bold text-slate-400 uppercase select-none">Dụng Cụ</span>
          ) : (
            <img
              src={tool.image}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain"
              alt={tool.name}
              loading="lazy"
            />
          )}
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shrink-0">
          <LucideIcon name="Hammer" size={16} />
        </div>
      )}

      {/* Code Name */}
      <h4 
        className={`
          text-[1.3vmin] font-black leading-tight mt-1.5 truncate w-full px-1 transition-colors duration-300
          ${isSelected ? 'text-yellow-300' : 'text-slate-100'}
        `}
      >
        {tool.name}
      </h4>
      
      {/* Category Type */}
      <span className="text-[1vmin] truncate w-full px-1 text-slate-400 mt-0.5 leading-none">
        {tool.type}
      </span>
    </div>
  );
};

export default ToolCard;
