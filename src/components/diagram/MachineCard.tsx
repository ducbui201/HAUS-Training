import React, { useState, useEffect } from 'react';
import type { Machine } from '../../types';

interface MachineCardProps {
  machine: Machine;
  isConnected: boolean;
  isFaded: boolean;
  isSelected: boolean;
  isSpecialHighlight: boolean;
  frequency?: string | null;
  onClick: () => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  isConnected,
  isFaded,
  isSelected,
  isSpecialHighlight,
  frequency,
  onClick
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [machine.id]);

  return (
    <div
      id={`machine-${machine.id}`}
      onClick={onClick}
      className={`
        machine-card-glass relative flex flex-col items-center text-center p-2 rounded-xl cursor-pointer select-none transition-all duration-300
        ${isSelected 
          ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-1 ring-yellow-400 scale-105 z-10 bg-yellow-400/10' 
          : 'border-slate-800 hover:border-slate-500 hover:scale-102'}
        ${isSpecialHighlight && !isSelected ? 'special-highlight' : ''}
        ${isFaded ? 'opacity-20 blur-[0.5px] scale-98 hover:opacity-30' : 'opacity-100 scale-100'}
      `}
      style={{ minHeight: '11vh' }}
    >
      {/* Image Thumbnail Container */}
      <div className="w-10 h-10 bg-white rounded-lg p-0.5 flex items-center justify-center shadow-md shrink-0 relative overflow-hidden">
        {imgError ? (
          <span className="text-[9px] font-bold text-slate-400 uppercase select-none">Karcher</span>
        ) : (
          <img
            src={machine.image}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
            alt={machine.name}
            loading="lazy"
          />
        )}
      </div>

      {/* Code Name */}
      <h4 
        className={`
          text-[1.3vmin] font-black leading-tight mt-1.5 truncate w-full px-1 transition-colors duration-300
          ${isSelected || isSpecialHighlight ? 'text-yellow-300' : 'text-slate-100'}
        `}
      >
        {machine.name}
      </h4>
      
      {/* Category Type */}
      <span className="text-[1vmin] truncate w-full px-1 text-slate-400 mt-0.5 leading-none">
        {machine.type}
      </span>
      
      {/* Frequency Badge (If provided) */}
      {frequency && isConnected && (
        <div className="mt-1 text-[0.8vmin] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold border border-blue-500/30 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {frequency}
        </div>
      )}
    </div>
  );
};

export default MachineCard;
