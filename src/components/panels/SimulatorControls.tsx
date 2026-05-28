import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

export const SimulatorControls: React.FC = () => {
  const {
    activePackage,
    packages,
    areas,
    mappings,
    isSimulating,
    setIsSimulating,
    simStep,
    setSimStep,
    setHoveredArea,
    setSelectedMachineId,
    setSelectedChemicalId,
    setSelectedToolId
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5); // default 5 seconds per step

  // 1. Resolve mappings belonging to the active package
  const activeMappings = useMemo(() => {
    if (!activePackage || activePackage === 'theo-gio') return [];
    return mappings.filter(m => m.packageId === activePackage);
  }, [activePackage, mappings]);

  const totalSteps = activeMappings.length;

  // 2. Control active state of simulator controls
  const showControls = activePackage !== null && activePackage !== 'theo-gio' && totalSteps > 0;

  // Reset play states when package changes
  useEffect(() => {
    setIsPlaying(false);
    setIsSimulating(false);
    setSimStep(0);
  }, [activePackage]);

  // 3. Drive the step simulation tick
  useEffect(() => {
    if (!isSimulating || !isPlaying || totalSteps === 0) return;

    const interval = setInterval(() => {
      setSimStep((prevStep) => {
        const nextStep = prevStep + 1;
        if (nextStep >= totalSteps) {
          // Loop back to start or pause at end? Let's loop back!
          return 0;
        }
        return nextStep;
      });
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [isSimulating, isPlaying, totalSteps, speed]);

  // 4. Update UI states when simStep changes
  useEffect(() => {
    if (!isSimulating || totalSteps === 0) return;
    
    const currentMapping = activeMappings[simStep];
    if (currentMapping) {
      setHoveredArea(currentMapping.areaId);
      setSelectedMachineId(currentMapping.machineId);
      
      // Clear chemical/tool highlights so connection layer can render flow cleanly
      setSelectedChemicalId(null);
      setSelectedToolId(null);
    }
  }, [simStep, isSimulating, activeMappings]);

  if (!showControls) return null;

  const currentPkg = packages.find(p => p.id === activePackage);
  const currentMapping = activeMappings[simStep];
  const currentArea = currentMapping ? areas.find(a => a.id === currentMapping.areaId) : null;

  const handleStartSim = () => {
    setIsSimulating(true);
    setIsPlaying(true);
    setSimStep(0);
  };

  const handleStopSim = () => {
    setIsSimulating(false);
    setIsPlaying(false);
    setSimStep(0);
    setHoveredArea(null);
    setSelectedMachineId(null);
  };

  const handlePrev = () => {
    setSimStep(prev => (prev - 1 < 0 ? totalSteps - 1 : prev - 1));
  };

  const handleNext = () => {
    setSimStep(prev => (prev + 1 >= totalSteps ? 0 : prev + 1));
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 select-none flex flex-col items-center">
      
      {/* 1. Quick Launch Pill (when not simulating) */}
      {!isSimulating ? (
        <button
          onClick={handleStartSim}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400 text-black border border-yellow-300 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105 hover:shadow-[0_0_22px_rgba(250,204,21,0.6)] transition-all duration-300 cursor-pointer"
        >
          <LucideIcon name="Play" size={14} color="#000" />
          <span>Bắt đầu Quy trình ({currentPkg?.name})</span>
        </button>
      ) : (
        <div className="glass-panel border border-yellow-400/25 px-5 py-3 rounded-2xl shadow-2xl flex flex-col gap-2 min-w-[460px] animate-slide-up backdrop-blur-lg">
          {/* 2. Full Media Control Center (when simulating) */}
          
          {/* Top Row: Info & Counter */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0"></span>
              <span className="text-slate-400 font-medium uppercase tracking-wider">Mô phỏng Gói:</span>
              <span className="font-extrabold text-yellow-400 uppercase">{currentPkg?.name}</span>
            </div>
            
            <div className="flex items-center gap-1.5 font-bold text-slate-400 text-[10px]">
              <LucideIcon name="MapPin" size={10} className="text-yellow-400" />
              <span className="text-white bg-white/5 px-2 py-0.5 rounded font-black border border-white/5 uppercase">
                {currentArea?.name || 'Đang nạp...'}
              </span>
              <span className="text-slate-500 font-black pl-1.5">
                BƯỚC {simStep + 1} / {totalSteps}
              </span>
            </div>
          </div>

          {/* Bottom Row: Control Buttons & Speeds */}
          <div className="flex items-center justify-between pt-1 gap-6">
            
            {/* Playback Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrev}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Bước trước"
              >
                <LucideIcon name="SkipBack" size={12} />
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg border
                  ${isPlaying 
                    ? 'bg-yellow-400 border-yellow-300 text-black hover:scale-108 hover:shadow-[0_0_12px_rgba(250,204,21,0.4)]' 
                    : 'bg-white border-white text-black hover:scale-108'}
                `}
                title={isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
              >
                <LucideIcon name={isPlaying ? 'Pause' : 'Play'} size={16} color="#000" />
              </button>

              <button 
                onClick={handleNext}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Bước tiếp theo"
              >
                <LucideIcon name="SkipForward" size={12} />
              </button>

              <button 
                onClick={handleStopSim}
                className="w-7 h-7 rounded-lg bg-red-950/20 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all ml-1.5 cursor-pointer"
                title="Dừng mô phỏng"
              >
                <LucideIcon name="Square" size={10} />
              </button>
            </div>

            {/* Speed Options */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-0.5 rounded-lg text-[9px] font-black uppercase">
              <span className="text-[8px] text-slate-500 px-2 py-0.5 font-bold">Chu kỳ:</span>
              {[3, 5, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`
                    px-2 py-1 rounded cursor-pointer transition-all duration-200
                    ${speed === s 
                      ? 'bg-yellow-400 text-black font-black' 
                      : 'text-slate-400 hover:text-white'}
                  `}
                >
                  {s}s
                </button>
              ))}
            </div>

          </div>

          {/* Simple Animated Steps Progress Bar */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1 relative">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500"
              style={{ width: `${((simStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

        </div>
      )}

    </div>
  );
};

export default SimulatorControls;
