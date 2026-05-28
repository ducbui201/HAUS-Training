import React, { useState, useEffect } from 'react';
import type { Machine } from '../../types';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

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
  const { 
    comparedMachineIds, 
    setComparedMachineIds,
    isQuizMode,
    quizSelectedMachineId,
    setQuizSelectedMachineId,
    showImages
  } = useApp();
  const isCompared = comparedMachineIds.includes(machine.id);
  const isQuizSelected = isQuizMode && quizSelectedMachineId === machine.id;

  useEffect(() => {
    setImgError(false);
  }, [machine.id]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComparedMachineIds((prev) => {
      if (prev.includes(machine.id)) {
        return prev.filter((id) => id !== machine.id);
      }
      if (prev.length >= 2) {
        return [prev[0], machine.id];
      }
      return [...prev, machine.id];
    });
  };

  return (
    <div
      id={`machine-${machine.id}`}
      onClick={isQuizMode ? () => setQuizSelectedMachineId(machine.id) : onClick}
      className={`
        machine-card-glass relative flex flex-col items-center text-center p-2 rounded-xl cursor-pointer select-none transition-all duration-300
        ${isQuizSelected
          ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-1 ring-blue-400 scale-105 z-10 bg-blue-500/10'
          : isSelected 
            ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-1 ring-yellow-400 scale-105 z-10 bg-yellow-400/10' 
            : 'border-slate-800 hover:border-slate-500 hover:scale-102'}
        ${isSpecialHighlight && !isSelected && !isQuizMode ? 'special-highlight' : ''}
        ${isFaded && !isQuizMode ? 'opacity-20 blur-[0.5px] scale-98 hover:opacity-30' : 'opacity-100 scale-100'}
      `}
      style={{ minHeight: '11vh' }}
    >
      {/* Compare Button */}
      <button
        onClick={handleCompareClick}
        className={`
          absolute top-1 right-1 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 border z-20 cursor-pointer
          ${isCompared 
            ? 'bg-yellow-400 border-yellow-300 text-black shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:bg-black/60 hover:scale-115'}
        `}
        title="So sánh thiết bị này"
      >
        <LucideIcon name="GitCompare" size={10} />
      </button>
      {/* Image Thumbnail Container */}
      {showImages ? (
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
      ) : (
        <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 border border-yellow-400/20 shrink-0">
          <LucideIcon name="Wrench" size={16} />
        </div>
      )}

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
