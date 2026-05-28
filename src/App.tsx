import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/panels/Header';
import AIChat from './components/panels/AIChat';
import InfoPanel from './components/panels/InfoPanel';
import LoginModal from './components/panels/LoginModal';
import ConfigPanel from './components/panels/ConfigPanel';
import CompareModal from './components/panels/CompareModal';
import AreaCard from './components/diagram/AreaCard';
import MachineCard from './components/diagram/MachineCard';
import ChemicalCard from './components/diagram/ChemicalCard';
import ToolCard from './components/diagram/ToolCard';
import ConnectionLayer, { type ConnectionLine } from './components/diagram/ConnectionLayer';
import LucideIcon from './components/ui/LucideIcon';
import SimulatorControls from './components/panels/SimulatorControls';

export const App: React.FC = () => {
  const {
    packages,
    areas,
    machines,
    chemicals,
    tools,
    mappings,
    loading,
    activePackage,
    setActivePackage,
    hoveredArea,
    setHoveredArea,
    selectedMachineId,
    setSelectedMachineId,
    selectedChemicalId,
    setSelectedChemicalId,
    selectedToolId,
    setSelectedToolId,
    setIsSimulating
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  
  // Modals visibility state
  const [showLogin, setShowLogin] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // 1. Highlight special machines based on selected package (from original HTML)
  const specialHighlights = useMemo(() => {
    if (!activePackage) return [];
    if (activePackage === 'chuyen-sau') return ['sg4-4', 'puzzi', 'bds43', 'hd5-15'];
    if (activePackage === 'dinh-ky') return ['t11-1', 'br30-4'];
    if (activePackage === 'sau-xay-dung') return ['nt40-1'];
    if (activePackage === 've-sink-xanh') return ['sg4-2', 'sg4-4'];
    if (activePackage === 'sau-tiec') return ['br30-4', 'sg4-2', 'bds43', 'hd5-15'];
    if (activePackage === 'du-an-bien') return ['hd10-25', 'km70-30', 'bds43', 'sg4-2'];
    return [];
  }, [activePackage]);

  // 2. Identify which items are active in the current package flow
  const flowActiveEntities = useMemo(() => {
    const activeMachineIds = new Set<string>();
    const activeChemicalIds = new Set<string>();
    const activeToolIds = new Set<string>();

    if (activePackage) {
      if (activePackage === 'theo-gio') {
        // "Theo gio" has no default mappings, all are connected
        machines.forEach(m => activeMachineIds.add(m.id));
        chemicals.forEach(c => activeChemicalIds.add(c.id));
        tools.forEach(t => activeToolIds.add(t.id));
      } else {
        // Filter mappings matching the active package
        const activeMappings = mappings.filter(m => m.packageId === activePackage);
        
        // If hovered area is specified, filter further down to that area only
        const targetMappings = hoveredArea 
          ? activeMappings.filter(m => m.areaId === hoveredArea)
          : activeMappings;

        targetMappings.forEach((m) => {
          activeMachineIds.add(m.machineId);
          m.chemicalIds?.forEach(cid => activeChemicalIds.add(cid));
          m.toolIds?.forEach(tid => activeToolIds.add(tid));
        });
      }
    } else if (selectedMachineId) {
      // If no package but a machine is selected
      activeMachineIds.add(selectedMachineId);
      const activeMappings = mappings.filter(m => m.machineId === selectedMachineId);
      activeMappings.forEach((m) => {
        m.chemicalIds?.forEach(cid => activeChemicalIds.add(cid));
        m.toolIds?.forEach(tid => activeToolIds.add(tid));
      });
    } else if (selectedChemicalId) {
      // If a chemical is selected
      activeChemicalIds.add(selectedChemicalId);
      const activeMappings = mappings.filter(m => m.chemicalIds?.includes(selectedChemicalId));
      activeMappings.forEach((m) => {
        activeMachineIds.add(m.machineId);
        m.toolIds?.forEach(tid => activeToolIds.add(tid));
      });
    } else if (selectedToolId) {
      // If a tool is selected
      activeToolIds.add(selectedToolId);
      const activeMappings = mappings.filter(m => m.toolIds?.includes(selectedToolId));
      activeMappings.forEach((m) => {
        activeMachineIds.add(m.machineId);
        m.chemicalIds?.forEach(cid => activeChemicalIds.add(cid));
      });
    }

    return {
      machineIds: activeMachineIds,
      chemicalIds: activeChemicalIds,
      toolIds: activeToolIds
    };
  }, [activePackage, hoveredArea, selectedMachineId, selectedChemicalId, selectedToolId, mappings, machines, chemicals, tools]);

  // 3. Dynamic Curved Connection Lines Calculation
  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: ConnectionLine[] = [];

    const getElCoords = (elId: string, edge: 'left' | 'right') => {
      const el = document.getElementById(elId);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: edge === 'left' ? rect.left - containerRect.left : rect.right - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    };

    // Calculate lines only when there's an active context (package or selected item)
    if (!activePackage && !selectedMachineId && !selectedChemicalId && !selectedToolId) {
      setLines([]);
      return;
    }

    // 3.1 Draw lines matching current package + area
    if (activePackage && activePackage !== 'theo-gio') {
      const activeMappings = mappings.filter(m => m.packageId === activePackage);
      
      areas.forEach((area) => {
        const areaCoords = getElCoords(`area-${area.id}`, 'right');
        if (!areaCoords) return;

        const areaMappings = activeMappings.filter(m => m.areaId === area.id);
        const isAreaFocused = hoveredArea === area.id;
        const isSomeAreaFocused = !!hoveredArea;

        areaMappings.forEach((m) => {
          const machineCoords = getElCoords(`machine-${m.machineId}`, 'left');
          if (!machineCoords) return;

          // Determine line styling
          const isFlowing = isAreaFocused;
          const pkgColor = packages.find(p => p.id === activePackage)?.color || '#3B82F6';
          
          let opacity = 0;
          let width = 0;

          if (isAreaFocused) {
            opacity = 0.95;
            width = 2.5;
          } else if (isSomeAreaFocused) {
            opacity = 0.03; // Dimmed out completely when hovering other areas
            width = 0.5;
          } else {
            opacity = 0.2;  // Standard packages preview
            width = 1.2;
          }

          // A. Draw: Area -> Machine
          newLines.push({
            id: `a-m-${m.id}`,
            startX: areaCoords.x,
            startY: areaCoords.y,
            endX: machineCoords.x,
            endY: machineCoords.y,
            stroke: pkgColor,
            width,
            opacity,
            isFlowing
          });

          // If this area is focused, we also flow forward from Machine -> Chemical -> Tool
          const machineRightCoords = getElCoords(`machine-${m.machineId}`, 'right');
          if (machineRightCoords) {
            // B. Draw: Machine -> Chemicals
            m.chemicalIds?.forEach((cid) => {
              const chemCoords = getElCoords(`chemical-${cid}`, 'left');
              if (!chemCoords) return;

              newLines.push({
                id: `m-c-${m.id}-${cid}`,
                startX: machineRightCoords.x,
                startY: machineRightCoords.y,
                endX: chemCoords.x,
                endY: chemCoords.y,
                stroke: pkgColor,
                width,
                opacity,
                isFlowing
              });

              // C. Draw: Chemical -> Tools
              const chemRightCoords = getElCoords(`chemical-${cid}`, 'right');
              if (chemRightCoords) {
                m.toolIds?.forEach((tid) => {
                  const toolCoords = getElCoords(`tool-${tid}`, 'left');
                  if (!toolCoords) return;

                  newLines.push({
                    id: `c-t-${m.id}-${cid}-${tid}`,
                    startX: chemRightCoords.x,
                    startY: chemRightCoords.y,
                    endX: toolCoords.x,
                    endY: toolCoords.y,
                    stroke: pkgColor,
                    width,
                    opacity,
                    isFlowing
                  });
                });
              }
            });
          }
        });
      });
    }

    // 3.2 Draw lines matching isolated Machine Selection
    if (!activePackage && selectedMachineId) {
      const activeMappings = mappings.filter(m => m.machineId === selectedMachineId);
      const machineLeft = getElCoords(`machine-${selectedMachineId}`, 'left');
      const machineRight = getElCoords(`machine-${selectedMachineId}`, 'right');

      activeMappings.forEach((m) => {
        // A. Draw: Areas -> Machine
        const areaCoords = getElCoords(`area-${m.areaId}`, 'right');
        if (areaCoords && machineLeft) {
          newLines.push({
            id: `sel-a-m-${m.id}`,
            startX: areaCoords.x,
            startY: areaCoords.y,
            endX: machineLeft.x,
            endY: machineLeft.y,
            stroke: '#FFED00',
            width: 2.2,
            opacity: 0.9,
            isFlowing: true
          });
        }

        // B. Draw: Machine -> Chemicals
        if (machineRight) {
          m.chemicalIds?.forEach((cid) => {
            const chemCoords = getElCoords(`chemical-${cid}`, 'left');
            if (!chemCoords) return;

            newLines.push({
              id: `sel-m-c-${m.id}-${cid}`,
              startX: machineRight.x,
              startY: machineRight.y,
              endX: chemCoords.x,
              endY: chemCoords.y,
              stroke: '#FFED00',
              width: 2.2,
              opacity: 0.9,
              isFlowing: true
            });

            // C. Draw: Chemical -> Tools
            const chemRight = getElCoords(`chemical-${cid}`, 'right');
            if (chemRight) {
              m.toolIds?.forEach((tid) => {
                const toolCoords = getElCoords(`tool-${tid}`, 'left');
                if (!toolCoords) return;

                newLines.push({
                  id: `sel-c-t-${m.id}-${cid}-${tid}`,
                  startX: chemRight.x,
                  startY: chemRight.y,
                  endX: toolCoords.x,
                  endY: toolCoords.y,
                  stroke: '#FFED00',
                  width: 2.2,
                  opacity: 0.9,
                  isFlowing: true
                });
              });
            }
          });
        }
      });
    }

    // 3.3 Draw lines matching Chemical Selection
    if (!activePackage && selectedChemicalId) {
      const activeMappings = mappings.filter(m => m.chemicalIds?.includes(selectedChemicalId));
      
      activeMappings.forEach((m) => {
        const machineRight = getElCoords(`machine-${m.machineId}`, 'right');
        const chemLeft = getElCoords(`chemical-${selectedChemicalId}`, 'left');
        const chemRight = getElCoords(`chemical-${selectedChemicalId}`, 'right');

        // Draw: Machine -> Chemical
        if (machineRight && chemLeft) {
          newLines.push({
            id: `sel-chem-m-c-${m.id}`,
            startX: machineRight.x,
            startY: machineRight.y,
            endX: chemLeft.x,
            endY: chemLeft.y,
            stroke: '#FFED00',
            width: 2.2,
            opacity: 0.9,
            isFlowing: true
          });
        }

        // Draw: Chemical -> Tools
        if (chemRight) {
          m.toolIds?.forEach((tid) => {
            const toolCoords = getElCoords(`tool-${tid}`, 'left');
            if (!toolCoords) return;

            newLines.push({
              id: `sel-chem-c-t-${m.id}-${tid}`,
              startX: chemRight.x,
              startY: chemRight.y,
              endX: toolCoords.x,
              endY: toolCoords.y,
              stroke: '#FFED00',
              width: 2.2,
              opacity: 0.9,
              isFlowing: true
            });
          });
        }
      });
    }

    // 3.4 Draw lines matching Tool Selection
    if (!activePackage && selectedToolId) {
      const activeMappings = mappings.filter(m => m.toolIds?.includes(selectedToolId));
      
      activeMappings.forEach((m) => {
        m.chemicalIds?.forEach((cid) => {
          const chemRight = getElCoords(`chemical-${cid}`, 'right');
          const toolLeft = getElCoords(`tool-${selectedToolId}`, 'left');

          // Draw: Chemical -> Tool
          if (chemRight && toolLeft) {
            newLines.push({
              id: `sel-tool-c-t-${m.id}-${cid}`,
              startX: chemRight.x,
              startY: chemRight.y,
              endX: toolLeft.x,
              endY: toolLeft.y,
              stroke: '#FFED00',
              width: 2.2,
              opacity: 0.9,
              isFlowing: true
            });
          }
        });
      });
    }

    setLines(newLines);
  };

  // Re-calculate lines on various state triggers
  useEffect(() => {
    const timer = setTimeout(calculateLines, 150);
    window.addEventListener('resize', calculateLines);
    return () => {
      window.removeEventListener('resize', calculateLines);
      clearTimeout(timer);
    };
  }, [
    activePackage, 
    hoveredArea, 
    selectedMachineId, 
    selectedChemicalId, 
    selectedToolId, 
    mappings, 
    machines, 
    chemicals, 
    tools
  ]);

  // Global reset click out
  const handleGlobalClick = () => {
    setSelectedMachineId(null);
    setSelectedChemicalId(null);
    setSelectedToolId(null);
    setHoveredArea(null);
    setIsSimulating(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#000428] gap-4 select-none">
        <div className="karcher-logo-box text-xl animate-pulse">
          <span>KÄRCHER</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
          <span className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
          Đang nạp dữ liệu vận hành HAUS...
        </div>
      </div>
    );
  }

  // Helper to resolve specific mapping frequency if Package + Area are active
  const getContextualFrequency = (machineId: string) => {
    if (activePackage !== 'dinh-ky' || !hoveredArea) return null;
    const match = mappings.find(m => m.packageId === activePackage && m.areaId === hoveredArea && m.machineId === machineId);
    return match ? (match.frequency || null) : null;
  };

  return (
    <div 
      onClick={handleGlobalClick} 
      className="text-slate-200 h-screen w-screen flex flex-col overflow-hidden relative select-none bg-gradient-to-br from-[#000428] to-[#004e92]"
    >
      {/* Dynamic Animated Blur Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
      </div>

      {/* Header Panel */}
      <Header 
        onLoginClick={() => setShowLogin(true)} 
        onConfigToggle={() => setShowConfig(!showConfig)}
        showConfig={showConfig}
      />

      {/* Package Description Bar */}
      <div 
        className={`
          flex-none desc-bar py-1.5 px-6 text-center h-[4.5vh] flex items-center justify-center border-b border-white/5 relative z-10
          ${activePackage ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <span className="text-xs md:text-sm font-semibold text-accent-yellow drop-shadow-md">
          {activePackage && packages.find(p => p.id === activePackage)?.desc}
        </span>
      </div>

      {/* Main Column Grid */}
      <main 
        className="flex-1 relative flex overflow-hidden main-content px-6 py-3 gap-6 z-10"
        ref={containerRef}
      >
        {/* Connection Layer (Particle flow paths) */}
        <ConnectionLayer lines={lines} />

        {/* ========================================================
            COL 1: AREAS (Khu vực) - w-1/5
           ======================================================== */}
        <div className="w-[18%] flex flex-col justify-center gap-[0.8vh] z-10 custom-scroll overflow-y-auto pr-1" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-2 text-blue-300 mb-1 border-b border-white/5 pb-1 flex-none">
            <LucideIcon name="MapPin" size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Khu vực</h3>
          </div>

          {areas.map((area) => {
            const isTarget = hoveredArea === area.id;
            const hasMappings = activePackage && activePackage !== 'theo-gio' && mappings.some(m => m.packageId === activePackage && m.areaId === area.id);
            
            let isDimmed = false;
            if (activePackage) {
              if (activePackage !== 'theo-gio') {
                if (!hasMappings) isDimmed = true;
                else if (hoveredArea && hoveredArea !== area.id) isDimmed = true;
              }
            }

            return (
              <AreaCard
                key={area.id}
                area={area}
                isActive={isTarget}
                isDimmed={isDimmed}
                onMouseEnter={() => {
                  if (activePackage && activePackage !== 'theo-gio') setHoveredArea(area.id);
                }}
                onMouseLeave={() => {
                  if (activePackage) setHoveredArea(null);
                }}
                onClick={() => {
                  // Allow locking hover state
                  if (activePackage && activePackage !== 'theo-gio') {
                    setHoveredArea(prev => prev === area.id ? null : area.id);
                  }
                }}
              />
            );
          })}
        </div>

        {/* ========================================================
            COL 2: MACHINES (Thiết bị) - w-1/4
           ======================================================== */}
        <div className="w-[27%] flex flex-col z-10 pl-2 pr-1 h-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-2 text-blue-300 mb-2 border-b border-white/5 pb-1 flex-none">
            <LucideIcon name="Wrench" size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Thiết bị tương ứng</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {machines.map((machine) => {
                const isSelected = selectedMachineId === machine.id;
                const isConnected = flowActiveEntities.machineIds.has(machine.id);
                const isSpecialHighlight = activePackage !== null && specialHighlights.includes(machine.id);
                
                // Dim logic
                const hasFilters = !!(activePackage || selectedMachineId || selectedChemicalId || selectedToolId);
                const isFaded = hasFilters && !isConnected;

                return (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    isConnected={isConnected}
                    isFaded={isFaded}
                    isSelected={isSelected}
                    isSpecialHighlight={isSpecialHighlight}
                    frequency={getContextualFrequency(machine.id)}
                    onClick={() => {
                      // Toggle selection
                      setSelectedMachineId(prev => prev === machine.id ? null : machine.id);
                      setActivePackage(null);
                      setHoveredArea(null);
                      setSelectedChemicalId(null);
                      setSelectedToolId(null);
                      setIsSimulating(false);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            COL 3: CHEMICALS (Hóa chất) - w-1/4
           ======================================================== */}
        <div className="w-[27%] flex flex-col z-10 pl-2 pr-1 h-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-2 text-blue-300 mb-2 border-b border-white/5 pb-1 flex-none">
            <LucideIcon name="Droplet" size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Hóa chất tương ứng</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {chemicals.map((chemical) => {
                const isSelected = selectedChemicalId === chemical.id;
                const isConnected = flowActiveEntities.chemicalIds.has(chemical.id);
                
                const hasFilters = !!(activePackage || selectedMachineId || selectedChemicalId || selectedToolId);
                const isFaded = hasFilters && !isConnected;

                return (
                  <ChemicalCard
                    key={chemical.id}
                    chemical={chemical}
                    isFaded={isFaded}
                    isSelected={isSelected}
                    onClick={() => {
                      setSelectedChemicalId(prev => prev === chemical.id ? null : chemical.id);
                      setActivePackage(null);
                      setHoveredArea(null);
                      setSelectedMachineId(null);
                      setSelectedToolId(null);
                      setIsSimulating(false);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            COL 4: TOOLS (Dụng cụ / Phụ kiện) - w-1/4
           ======================================================== */}
        <div className="w-[28%] flex flex-col z-10 pl-2 pr-1 h-full" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-2 text-blue-300 mb-2 border-b border-white/5 pb-1 flex-none">
            <LucideIcon name="Hammer" size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Dụng cụ / Phụ kiện đi kèm</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {tools.map((tool) => {
                const isSelected = selectedToolId === tool.id;
                const isConnected = flowActiveEntities.toolIds.has(tool.id);
                
                const hasFilters = !!(activePackage || selectedMachineId || selectedChemicalId || selectedToolId);
                const isFaded = hasFilters && !isConnected;

                return (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFaded={isFaded}
                    isSelected={isSelected}
                    onClick={() => {
                      setSelectedToolId(prev => prev === tool.id ? null : tool.id);
                      setActivePackage(null);
                      setHoveredArea(null);
                      setSelectedMachineId(null);
                      setSelectedChemicalId(null);
                      setIsSimulating(false);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </main>

      {/* Interactive Floating / Modal Components */}
      <InfoPanel onClose={() => handleGlobalClick()} />
      <CompareModal />
      <SimulatorControls />
      <AIChat />
      
      {/* Admin Control Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      {showConfig && <ConfigPanel onClose={() => setShowConfig(false)} />}
    </div>
  );
};

export default App;
