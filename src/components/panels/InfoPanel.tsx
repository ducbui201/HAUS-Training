import React from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

interface InfoPanelProps {
  onClose: () => void;
}

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
