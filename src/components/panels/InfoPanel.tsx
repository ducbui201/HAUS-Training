import React from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

interface InfoPanelProps {
  onClose: () => void;
}

// Helper to render pH Scale
const renderPHScale = (pH: number) => {
  const clampedPH = Math.max(0, Math.min(14, pH));
  const percent = (clampedPH / 14) * 100;
  
  let typeText = 'Trung tính';
  let textColor = 'text-green-400';
  if (clampedPH < 6.5) {
    typeText = clampedPH < 3 ? 'Axit mạnh' : 'Axit nhẹ';
    textColor = 'text-red-400';
  } else if (clampedPH > 7.5) {
    typeText = clampedPH > 11 ? 'Kiềm mạnh' : 'Kiềm nhẹ';
    textColor = 'text-purple-400';
  }

  return (
    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
      <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <LucideIcon name="Activity" size={11} className="text-yellow-400" />
          Độ pH Hóa chất
        </span>
        <span className={`font-black text-xs ${textColor}`}>pH {pH} - {typeText}</span>
      </h4>
      <div className="relative h-2.5 w-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-500 via-cyan-400 via-blue-500 to-purple-600 shadow-inner">
        <div 
          className="absolute -top-1 w-2.5 h-4.5 bg-white border border-black/40 rounded-sm shadow-md transition-all duration-500 ease-out transform -translate-x-1/2 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{ left: `${percent}%` }}
        >
          <div className="w-full h-1/2 bg-yellow-400 rounded-t-sm"></div>
        </div>
      </div>
      <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-bold">
        <span>0 (Axit)</span>
        <span>7 (Trung tính)</span>
        <span>14 (Kiềm)</span>
      </div>
    </div>
  );
};

// Helper to render Dilution Ratio
const renderDilutionRatio = (ratio: string) => {
  const parts = ratio.split(':');
  let divisor = 100;
  if (parts.length === 2) {
    const parsed = parseFloat(parts[1]);
    if (!isNaN(parsed) && parsed > 0) divisor = parsed;
  }

  const chemVol = 1000 / (divisor + 1);
  const waterVol = 1000 - chemVol;

  const visualChemHeight = Math.max(8, Math.min(45, (1 / (divisor + 1)) * 100 * 3));

  return (
    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
      <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
        <LucideIcon name="Droplets" size={11} className="text-yellow-400" />
        <span>Tỷ lệ pha loãng khuyên dùng ({ratio})</span>
      </h4>
      <div className="flex items-center gap-4">
        <div className="w-10 h-16 bg-white/5 border-2 border-white/20 rounded-b-xl rounded-t-sm relative overflow-hidden flex flex-col justify-end shadow-inner shrink-0">
          <div className="absolute left-0 right-0 top-1/4 border-t border-white/10 text-[6px] pl-1 text-white/30">750ml</div>
          <div className="absolute left-0 right-0 top-2/4 border-t border-white/10 text-[6px] pl-1 text-white/30">500ml</div>
          <div className="absolute left-0 right-0 top-3/4 border-t border-white/10 text-[6px] pl-1 text-white/30">250ml</div>

          <div className="w-full bg-blue-500/40 relative flex-1 transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400/60"></div>
          </div>

          <div 
            className="w-full bg-yellow-400/70 border-t border-yellow-300 relative transition-all duration-500 shrink-0" 
            style={{ height: `${visualChemHeight}%` }}
          >
            <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-yellow-200"></div>
          </div>
        </div>

        <div className="flex-1 space-y-1 text-[11px] leading-tight">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Dung dịch tiêu chuẩn:</span>
            <span className="font-bold text-white">1 Lít (1000ml)</span>
          </div>
          <div className="flex items-center justify-between text-blue-300 font-medium">
            <span>💧 Nước sạch:</span>
            <span>{waterVol.toFixed(0)} ml</span>
          </div>
          <div className="flex items-center justify-between text-yellow-300 font-semibold">
            <span>🧪 Hóa chất:</span>
            <span>{chemVol.toFixed(1)} ml</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to render Safety guidelines
const renderSafetyMsds = (items: string[]) => {
  const safetyMap: Record<string, { label: string; icon: string; bg: string; border: string; text: string }> = {
    gloves: {
      label: 'Găng tay',
      icon: 'Shield',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400'
    },
    goggles: {
      label: 'Kính bảo hộ',
      icon: 'Eye',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400'
    },
    mask: {
      label: 'Khẩu trang',
      icon: 'Wind',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400'
    }
  };

  return (
    <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
      <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
        <LucideIcon name="ShieldAlert" size={11} className="text-yellow-400" />
        <span>Bảo hộ bắt buộc (MSDS)</span>
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const cfg = safetyMap[item.toLowerCase().trim()] || {
            label: item,
            icon: 'AlertTriangle',
            bg: 'bg-slate-800',
            border: 'border-slate-700',
            text: 'text-slate-300'
          };

          return (
            <div 
              key={item} 
              className={`flex flex-col items-center justify-center p-2 rounded-xl border ${cfg.bg} ${cfg.border} text-center space-y-1 transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              <LucideIcon name={cfg.icon} size={16} className={cfg.text} />
              <span className={`text-[8px] font-black uppercase tracking-wider ${cfg.text}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  const {
    selectedMachineId,
    selectedChemicalId,
    selectedToolId,
    machines,
    chemicals,
    tools,
    areas,
    packages,
    mappings,
    activePackage,
    hoveredArea
  } = useApp();

  // Find the selected entity
  const activeMachine = machines.find((m) => m.id === selectedMachineId);
  const activeChemical = chemicals.find((c) => c.id === selectedChemicalId);
  const activeTool = tools.find((t) => t.id === selectedToolId);

  const activeItem = activeMachine || activeChemical || activeTool;
  if (!activeItem) return null;

  const itemType = activeMachine ? 'machine' : activeChemical ? 'chemical' : 'tool';

  // Gather linked items from mappings
  const getLinks = () => {
    let linkedAreaIds = new Set<string>();
    let linkedPackageIds = new Set<string>();
    let linkedMachineIds = new Set<string>();
    let linkedChemicalIds = new Set<string>();
    let linkedToolIds = new Set<string>();

    mappings.forEach((m) => {
      let isMatch = false;

      if (itemType === 'machine' && m.machineId === selectedMachineId) {
        isMatch = true;
        m.chemicalIds?.forEach(cid => linkedChemicalIds.add(cid));
        m.toolIds?.forEach(tid => linkedToolIds.add(tid));
      } else if (itemType === 'chemical' && m.chemicalIds?.includes(selectedChemicalId || '')) {
        isMatch = true;
        linkedMachineIds.add(m.machineId);
        m.toolIds?.forEach(tid => linkedToolIds.add(tid));
      } else if (itemType === 'tool' && m.toolIds?.includes(selectedToolId || '')) {
        isMatch = true;
        linkedMachineIds.add(m.machineId);
        m.chemicalIds?.forEach(cid => linkedChemicalIds.add(cid));
      }

      if (isMatch) {
        linkedAreaIds.add(m.areaId);
        linkedPackageIds.add(m.packageId);
      }
    });

    return {
      areasList: areas.filter((a) => linkedAreaIds.has(a.id)),
      packagesList: packages.filter((p) => linkedPackageIds.has(p.id)),
      machinesList: machines.filter((m) => linkedMachineIds.has(m.id)),
      chemicalsList: chemicals.filter((c) => linkedChemicalIds.has(c.id)),
      toolsList: tools.filter((t) => linkedToolIds.has(t.id))
    };
  };

  const { areasList, packagesList, machinesList, chemicalsList, toolsList } = getLinks();

  // Determine specific description based on hover context if any
  let itemDescription = activeItem.desc;
  let itemFrequency = null;

  if (itemType === 'machine' && activePackage && hoveredArea) {
    const matchingMapping = mappings.find(
      (m) => m.packageId === activePackage && m.areaId === hoveredArea && m.machineId === selectedMachineId
    );
    if (matchingMapping) {
      if (matchingMapping.description) itemDescription = matchingMapping.description;
      if (matchingMapping.frequency) itemFrequency = matchingMapping.frequency;
    }
  }

  return (
    <div className="fixed bottom-4 right-24 bg-slate-900/95 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md z-40 w-85 animate-slide-in-right max-h-[50vh] overflow-y-auto custom-scroll flex flex-col gap-4">
      {/* Header section with thumbnail */}
      <div className="flex items-center gap-4 border-b border-slate-700 pb-3">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-lg border-2 border-yellow-400 overflow-hidden">
          <img src={activeItem.image} className="w-full h-full object-contain" alt={activeItem.name} />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-base text-accent-yellow leading-tight truncate">{activeItem.name}</h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold truncate">{activeItem.type}</p>
        </div>
      </div>

      {/* Main Body info */}
      <div className="space-y-3.5 text-xs">
        {/* Core Description */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <h4 className="text-accent-yellow font-bold mb-1.5 text-[10px] uppercase flex items-center gap-1.5">
            <LucideIcon name="Info" size={12} />
            <span>Mô tả chức năng</span>
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs">{itemDescription}</p>
        </div>

        {/* Advanced Chemical Indicators */}
        {itemType === 'chemical' && activeChemical && (
          <>
            {activeChemical.pH !== undefined && renderPHScale(activeChemical.pH)}
            {activeChemical.dilutionRatio && renderDilutionRatio(activeChemical.dilutionRatio)}
            {activeChemical.safetyMsds && activeChemical.safetyMsds.length > 0 && renderSafetyMsds(activeChemical.safetyMsds)}
          </>
        )}

        {/* Dynamic Contextual Frequency */}
        {itemFrequency && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-2.5 flex gap-2 items-center">
            <LucideIcon name="Clock" size={14} className="text-blue-400" />
            <div>
              <span className="text-[9px] font-bold text-blue-300 uppercase block leading-none mb-0.5">Tần suất làm sạch</span>
              <span className="text-xs font-semibold text-white">{itemFrequency}</span>
            </div>
          </div>
        )}

        {/* Links section */}
        <div className="space-y-2.5 pt-1">
          {/* Linked Areas */}
          {areasList.length > 0 && (
            <div>
              <h4 className="text-slate-500 font-bold text-[9px] uppercase mb-1.5 flex items-center gap-1">
                <LucideIcon name="MapPin" size={10} />
                <span>Khu vực sử dụng</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {areasList.map((a) => (
                  <span key={a.id} className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 border border-slate-700">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Packages */}
          {packagesList.length > 0 && (
            <div>
              <h4 className="text-slate-500 font-bold text-[9px] uppercase mb-1.5 flex items-center gap-1">
                <LucideIcon name="Briefcase" size={10} />
                <span>Gói quy trình phù hợp</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {packagesList.map((p) => (
                  <span 
                    key={p.id} 
                    className="text-[9px] px-2 py-0.5 rounded-full font-bold border"
                    style={{ color: p.color, borderColor: p.color, backgroundColor: 'transparent' }}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Machines (For Chemicals & Tools) */}
          {machinesList.length > 0 && (
            <div>
              <h4 className="text-slate-500 font-bold text-[9px] uppercase mb-1.5 flex items-center gap-1">
                <LucideIcon name="Wrench" size={10} />
                <span>Thiết bị tương thích</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {machinesList.map((m) => (
                  <span key={m.id} className="text-[9px] bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/20">
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Chemicals (For Machines & Tools) */}
          {chemicalsList.length > 0 && (
            <div>
              <h4 className="text-slate-500 font-bold text-[9px] uppercase mb-1.5 flex items-center gap-1">
                <LucideIcon name="Droplets" size={10} />
                <span>Hóa chất đi kèm</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {chemicalsList.map((c) => (
                  <span key={c.id} className="text-[9px] bg-cyan-400/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/20">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Linked Tools (For Machines & Chemicals) */}
          {toolsList.length > 0 && (
            <div>
              <h4 className="text-slate-500 font-bold text-[9px] uppercase mb-1.5 flex items-center gap-1">
                <LucideIcon name="Hammer" size={10} />
                <span>Dụng cụ phụ trợ</span>
              </h4>
              <div className="flex flex-wrap gap-1">
                {toolsList.map((t) => (
                  <span key={t.id} className="text-[9px] bg-purple-400/10 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/20">
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* QR Code AR Generator */}
          {(itemType === 'machine' || itemType === 'chemical') && (
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 flex flex-col items-center text-center gap-2 mt-2">
              <h4 className="text-[9px] uppercase font-bold text-slate-400 w-full text-left flex items-center gap-1">
                <LucideIcon name="QrCode" size={10} className="text-yellow-400" />
                <span>Liên kết QR Code vật lý</span>
              </h4>
              <div className="w-24 h-24 bg-white rounded-lg p-1 flex items-center justify-center shadow-lg border border-white/20 overflow-hidden shrink-0 mt-1">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?${itemType === 'machine' ? 'selectMachine' : 'selectChemical'}=${activeItem.id}` : '')}`} 
                  className="w-full h-full object-contain" 
                  alt="QR Code" 
                />
              </div>
              <p className="text-[9px] text-slate-400 leading-tight">
                Dán mã QR lên thân máy hoặc chai hóa chất thực tế để thắp sáng quy trình ảo này lập tức.
              </p>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?${itemType === 'machine' ? 'selectMachine' : 'selectChemical'}=${activeItem.id}` : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer block text-center"
              >
                Mở ảnh QR để in nhãn
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer Close instruction */}
      <button 
        onClick={onClose}
        className="w-full text-center text-[10px] text-slate-500 hover:text-white transition-colors pt-2 border-t border-slate-800 cursor-pointer"
      >
        Đóng bảng chi tiết
      </button>
    </div>
  );
};

export default InfoPanel;
