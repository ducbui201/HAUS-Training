import React, { useState, useEffect } from 'react';
import type { Chemical } from '../../types';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

interface ChemicalCardProps {
  chemical: Chemical;
  isFaded: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const ChemicalCard: React.FC<ChemicalCardProps> = ({
  chemical,
  isFaded,
  isSelected,
  onClick
}) => {
  const [imgError, setImgError] = useState(false);
  const { 
    comparedChemicalIds, 
    setComparedChemicalIds,
    isQuizMode,
    quizSelectedChemicalId,
    setQuizSelectedChemicalId
  } = useApp();
  const isCompared = comparedChemicalIds.includes(chemical.id);
  const isQuizSelected = isQuizMode && quizSelectedChemicalId === chemical.id;

  useEffect(() => {
    setImgError(false);
  }, [chemical.id]);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComparedChemicalIds((prev) => {
      if (prev.includes(chemical.id)) {
        return prev.filter((id) => id !== chemical.id);
      }
      if (prev.length >= 2) {
        return [prev[0], chemical.id];
      }
      return [...prev, chemical.id];
    });
  };

  return (
    <div
      id={`chemical-${chemical.id}`}
      onClick={isQuizMode ? () => setQuizSelectedChemicalId(chemical.id) : onClick}
      className={`
        machine-card-glass relative flex flex-col items-center text-center p-2 rounded-xl cursor-pointer select-none transition-all duration-300
        ${isQuizSelected
          ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-1 ring-blue-400 scale-105 z-10 bg-blue-500/10'
          : isSelected 
            ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-1 ring-yellow-400 scale-105 z-10 bg-yellow-400/10' 
            : 'border-slate-800 hover:border-slate-500 hover:scale-102'}
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
        title="So sánh hóa chất này"
      >
        <LucideIcon name="GitCompare" size={10} />
      </button>
      {/* Image Thumbnail */}
      <div className="w-10 h-10 bg-white rounded-lg p-0.5 flex items-center justify-center shadow-md shrink-0 relative overflow-hidden">
        {imgError ? (
          <span className="text-[9px] font-bold text-slate-400 uppercase select-none">Hóa Chất</span>
        ) : (
          <img
            src={chemical.image}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
            alt={chemical.name}
            loading="lazy"
          />
        )}
      </div>

      {/* Code Name */}
      <h4 
        className={`
          text-[1.3vmin] font-black leading-tight mt-1.5 truncate w-full px-1 transition-colors duration-300
          ${isSelected ? 'text-yellow-300' : 'text-slate-100'}
        `}
      >
        {chemical.name}
      </h4>
      
      {/* Category Type */}
      <span className="text-[1vmin] truncate w-full px-1 text-slate-400 mt-0.5 leading-none">
        {chemical.type}
      </span>
    </div>
  );
};

export default ChemicalCard;
