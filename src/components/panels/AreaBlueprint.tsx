import React from 'react';
import { useApp } from '../../context/AppContext';

export const AreaBlueprint: React.FC = () => {
  const { areas, hoveredArea } = useApp();

  const activeAreaId = hoveredArea;

  return (
    <div className="fixed bottom-4 left-6 bg-slate-900/85 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-60 h-48 flex flex-col justify-between shadow-2xl z-40 select-none animate-slide-in-left">
      {/* HUD Header */}
      <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
        <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">HUD: Bản Đồ Mặt Bằng Quy Trình</span>
      </div>

      {/* SVG Isometric Floor Map */}
      <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden">
        <svg viewBox="0 0 260 160" className="w-full h-full transform scale-105">
          {/* Defs for gradients & filters */}
          <defs>
            <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect x="0" y="0" width="260" height="160" fill="url(#grid-grad)" rx="12" />

          {/* Isometric Rooms */}
          
          {/* 1. STAIRS (Cầu thang) */}
          <polygon
            points="30,85 70,65 100,80 60,100"
            className={`transition-all duration-300 stroke-white/10 stroke-1 ${activeAreaId === 'stairs' ? 'fill-blue-500/30 stroke-blue-400/80 animate-pulse filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'fill-white/5 hover:fill-white/10'}`}
          />
          <text x="65" y="85" className="fill-white/20 text-[7px] font-black pointer-events-none uppercase tracking-wider select-none text-center">STAIRS</text>

          {/* 2. LIVING ROOM (Phòng khách) */}
          <polygon
            points="70,65 140,30 180,50 110,85"
            className={`transition-all duration-300 stroke-white/10 stroke-1 ${activeAreaId === 'living' ? 'fill-yellow-400/30 stroke-yellow-300/80 animate-pulse filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'fill-white/5 hover:fill-white/10'}`}
          />
          <text x="125" y="60" className="fill-white/20 text-[7px] font-black pointer-events-none uppercase tracking-wider select-none text-center">LIVING</text>

          {/* 3. KITCHEN (Nhà bếp) */}
          <polygon
            points="110,85 180,50 220,70 150,105"
            className={`transition-all duration-300 stroke-white/10 stroke-1 ${activeAreaId === 'kitchen' ? 'fill-red-500/30 stroke-red-400/80 animate-pulse filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'fill-white/5 hover:fill-white/10'}`}
          />
          <text x="165" y="80" className="fill-white/20 text-[7px] font-black pointer-events-none uppercase tracking-wider select-none text-center">KITCHEN</text>

          {/* 4. TOILET (Nhà vệ sinh) */}
          <polygon
            points="150,105 220,70 245,82.5 175,117.5"
            className={`transition-all duration-300 stroke-white/10 stroke-1 ${activeAreaId === 'toilet' ? 'fill-cyan-500/30 stroke-cyan-400/80 animate-pulse filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'fill-white/5 hover:fill-white/10'}`}
          />
          <text x="195" y="100" className="fill-white/20 text-[7px] font-black pointer-events-none uppercase tracking-wider select-none text-center">TOILET</text>

          {/* 5. BALCONY (Ban công) */}
          <polygon
            points="60,100 100,80 120,90 80,110"
            className={`transition-all duration-300 stroke-white/10 stroke-1 ${activeAreaId === 'balcony' ? 'fill-green-500/30 stroke-green-400/80 animate-pulse filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'fill-white/5 hover:fill-white/10'}`}
          />
          <text x="90" y="100" className="fill-white/20 text-[7px] font-black pointer-events-none uppercase tracking-wider select-none text-center">DECK</text>
        </svg>
      </div>

      {/* Active Area Info Label */}
      <div className="text-[10px] text-center font-bold text-slate-400 border-t border-white/5 pt-1.5 flex items-center justify-center gap-1">
        {activeAreaId ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block animate-ping"></span>
            <span>Khu vực: <strong className="text-white uppercase">{areas.find(a => a.id === activeAreaId)?.name || activeAreaId}</strong></span>
          </>
        ) : (
          <span className="text-slate-500 uppercase tracking-widest text-[8px] font-black">Chờ quy trình vận hành...</span>
        )}
      </div>
    </div>
  );
};

export default AreaBlueprint;
