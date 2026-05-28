import React from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';
import type { Machine, Chemical } from '../../types';

export const CompareModal: React.FC = () => {
  const {
    machines,
    chemicals,
    areas,
    packages,
    mappings,
    comparedMachineIds,
    setComparedMachineIds,
    comparedChemicalIds,
    setComparedChemicalIds
  } = useApp();

  const isMachineCompare = comparedMachineIds.length === 2;
  const isChemicalCompare = comparedChemicalIds.length === 2;

  if (!isMachineCompare && !isChemicalCompare) return null;

  const handleClose = () => {
    setComparedMachineIds([]);
    setComparedChemicalIds([]);
  };

  // 1. Resolve Items to Compare
  const machinesToCompare = isMachineCompare
    ? comparedMachineIds.map(id => machines.find(m => m.id === id)).filter(Boolean) as Machine[]
    : [];

  const chemicalsToCompare = isChemicalCompare
    ? comparedChemicalIds.map(id => chemicals.find(c => c.id === id)).filter(Boolean) as Chemical[]
    : [];

  // 2. Gather linked details helper
  const getLinkedEntities = (itemId: string, type: 'machine' | 'chemical') => {
    const linkedAreas = new Set<string>();
    const linkedPkgs = new Set<string>();
    const linkedChems = new Set<string>();
    const linkedTools = new Set<string>();
    const linkedMachines = new Set<string>();

    mappings.forEach(m => {
      let match = false;
      if (type === 'machine' && m.machineId === itemId) {
        match = true;
        m.chemicalIds?.forEach(cid => linkedChems.add(cid));
        m.toolIds?.forEach(tid => linkedTools.add(tid));
      } else if (type === 'chemical' && m.chemicalIds?.includes(itemId)) {
        match = true;
        linkedMachines.add(m.machineId);
        m.toolIds?.forEach(tid => linkedTools.add(tid));
      }

      if (match) {
        linkedAreas.add(m.areaId);
        linkedPkgs.add(m.packageId);
      }
    });

    return {
      areasList: areas.filter(a => linkedAreas.has(a.id)),
      packagesList: packages.filter(p => linkedPkgs.has(p.id)),
      chemicalsList: chemicals.filter(c => linkedChems.has(c.id)),
      machinesList: machines.filter(m => linkedMachines.has(m.id))
    };
  };

  // 3. Compact pH Visualizer
  const renderCompactPH = (pH: number) => {
    const percent = (Math.max(0, Math.min(14, pH)) / 14) * 100;
    let typeText = 'Trung tính';
    let textColor = 'text-green-400';
    if (pH < 6.5) {
      typeText = pH < 3 ? 'Axit mạnh' : 'Axit nhẹ';
      textColor = 'text-red-400';
    } else if (pH > 7.5) {
      typeText = pH > 11 ? 'Kiềm mạnh' : 'Kiềm nhẹ';
      textColor = 'text-purple-400';
    }

    return (
      <div className="space-y-1.5 w-full bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60 text-[11px]">
        <div className="flex justify-between font-bold">
          <span className="text-slate-400">Độ pH:</span>
          <span className={textColor}>pH {pH} ({typeText})</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-500 via-cyan-400 via-blue-500 to-purple-600">
          <div 
            className="absolute -top-0.5 w-2 h-2.5 bg-white border border-black/40 rounded-sm shadow-md"
            style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>
    );
  };

  // 4. Compact Dilution Visualizer
  const renderCompactRatio = (ratio: string) => {
    const parts = ratio.split(':');
    let divisor = 100;
    if (parts.length === 2) {
      const parsed = parseFloat(parts[1]);
      if (!isNaN(parsed) && parsed > 0) divisor = parsed;
    }
    const chemVol = 1000 / (divisor + 1);
    const waterVol = 1000 - chemVol;

    return (
      <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60 text-[11px] leading-tight space-y-1.5 w-full">
        <div className="flex justify-between font-bold text-slate-300">
          <span>Tỷ lệ pha loãng:</span>
          <span className="text-yellow-400">{ratio}</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>💧 Nước sạch: <strong className="text-blue-300">{waterVol.toFixed(0)} ml</strong></span>
          <span>🧪 Hóa chất: <strong className="text-yellow-300">{chemVol.toFixed(1)} ml</strong></span>
        </div>
      </div>
    );
  };

  // 5. Compact MSDS Badges
  const renderCompactSafety = (items: string[]) => {
    const safetyMap: Record<string, { label: string; icon: string; text: string }> = {
      gloves: { label: 'Găng tay', icon: 'Shield', text: 'text-orange-400' },
      goggles: { label: 'Kính mắt', icon: 'Eye', text: 'text-red-400' },
      mask: { label: 'Khẩu trang', icon: 'Wind', text: 'text-cyan-400' }
    };

    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {items.map(item => {
          const cfg = safetyMap[item.toLowerCase().trim()] || { label: item, icon: 'AlertTriangle', text: 'text-slate-300' };
          return (
            <span key={item} className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 ${cfg.text}`}>
              <LucideIcon name={cfg.icon} size={10} />
              {cfg.label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-slide-up select-none">
      <div className="w-full max-w-4xl glass-modal rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-850 py-4 px-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 border border-yellow-400/20">
              <LucideIcon name="GitCompare" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-200">
                {isMachineCompare ? 'So sánh Thiết bị chuyên dụng' : 'So sánh Hóa chất tẩy rửa'}
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Bảng đối chiếu thông số trực quan Kärcher</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <LucideIcon name="X" size={16} />
          </button>
        </div>

        {/* Main Body Side-by-Side Comparison Container */}
        <div className="flex-1 overflow-y-auto custom-scroll p-6 grid grid-cols-2 gap-6 bg-slate-950/20">
          
          {/* Loop over the 2 entities to compare */}
          {(isMachineCompare ? machinesToCompare : chemicalsToCompare).map((item, idx) => {
            const isFirst = idx === 0;
            const linkData = getLinkedEntities(item.id, isMachineCompare ? 'machine' : 'chemical');

            return (
              <div 
                key={item.id} 
                className={`
                  flex flex-col space-y-4 p-5 rounded-2xl border transition-all duration-300
                  ${isFirst 
                    ? 'bg-blue-950/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
                    : 'bg-yellow-950/10 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]'}
                `}
              >
                {/* Visual Header */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                  <div className="w-18 h-18 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 shadow-lg border-2 border-slate-700/60 overflow-hidden relative group">
                    <img src={item.image} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" alt={item.name} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white leading-tight">{item.name}</h3>
                    <span className="inline-block text-[9px] text-yellow-400 font-bold uppercase tracking-wider mt-1 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Core Specifications */}
                <div className="space-y-3.5 flex-1">
                  
                  {/* Functional Description */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                      <LucideIcon name="Info" size={10} />
                      Chức năng vận hành
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-300">{item.desc}</p>
                  </div>

                  {/* Chemical Specific specs */}
                  {!isMachineCompare && (
                    <>
                      {/* pH Indicator */}
                      {(item as Chemical).pH !== undefined && renderCompactPH((item as Chemical).pH!)}

                      {/* Dilution Ratio Indicator */}
                      {(item as Chemical).dilutionRatio && renderCompactRatio((item as Chemical).dilutionRatio!)}

                      {/* MSDS Indicator */}
                      {(item as Chemical).safetyMsds && (item as Chemical).safetyMsds!.length > 0 && (
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1">
                          <h4 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                            <LucideIcon name="ShieldAlert" size={10} />
                            An toàn MSDS bắt buộc
                          </h4>
                          {renderCompactSafety((item as Chemical).safetyMsds!)}
                        </div>
                      )}
                    </>
                  )}

                  {/* Linked Areas */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1.5">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                      <LucideIcon name="MapPin" size={10} />
                      Khu vực áp dụng ({linkData.areasList.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {linkData.areasList.map(a => (
                        <span key={a.id} className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700/60">
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compatibility Links */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-1.5">
                    <h4 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                      <LucideIcon name={isMachineCompare ? 'Droplets' : 'Wrench'} size={10} />
                      {isMachineCompare ? `Hóa chất tương ứng (${linkData.chemicalsList.length})` : `Thiết bị tương thích (${linkData.machinesList.length})`}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {isMachineCompare ? (
                        linkData.chemicalsList.map(c => (
                          <span key={c.id} className="text-[9px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                            {c.name}
                          </span>
                        ))
                      ) : (
                        linkData.machinesList.map(m => (
                          <span key={m.id} className="text-[9px] bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded border border-yellow-400/20">
                            {m.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Footer */}
        <div className="bg-slate-900 py-3 px-6 text-center border-t border-white/5 text-[10px] text-slate-500">
          Nhấp nút X ở góc trên bên phải hoặc nhấp chuột ra ngoài để đóng chế độ đối chiếu
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
