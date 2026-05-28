import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  addMachine, updateMachine, deleteMachine,
  addChemical, updateChemical, deleteChemical,
  addTool, updateTool, deleteTool,
  addMapping, updateMapping, deleteMapping,
  addArea, updateArea, deleteArea,
  addPackage, updatePackage, deletePackage
} from '../../services/db';
import Button from '../ui/Button';
import LucideIcon from '../ui/LucideIcon';
import type { MappingRecord } from '../../types';

interface ConfigPanelProps {
  onClose: () => void;
}

type TabType = 'packages' | 'areas' | 'machines' | 'chemicals' | 'tools' | 'mappings';

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onClose }) => {
  const {
    packages,
    areas,
    machines,
    chemicals,
    tools,
    mappings,
    useStaticFallback
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('machines');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form States for Machine/Chemical/Tool/Package/Area
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [customId, setCustomId] = useState('');

  // Form States for Package
  const [pkgColor, setPkgColor] = useState('#FACC15');
  const [pkgIcon, setPkgIcon] = useState('Sparkles');

  // Form States for Area
  const [areaIcon, setAreaIcon] = useState('Home');
  const [areaBg, setAreaBg] = useState('bg-orange-500/10');

  // Form States for Mappings
  const [mapPackageId, setMapPackageId] = useState('');
  const [mapAreaId, setMapAreaId] = useState('');
  const [mapMachineId, setMapMachineId] = useState('');
  const [mapChemicalIds, setMapChemicalIds] = useState<string[]>([]);
  const [mapToolIds, setMapToolIds] = useState<string[]>([]);
  const [mapFrequency, setMapFrequency] = useState('');
  const [mapDesc, setMapDesc] = useState('');

  const clearForm = () => {
    setName('');
    setType('');
    setImage('');
    setDesc('');
    setCustomId('');
    setPkgColor('#FACC15');
    setPkgIcon('Sparkles');
    setAreaIcon('Home');
    setAreaBg('bg-orange-500/10');
    setMapPackageId(packages[0]?.id || '');
    setMapAreaId(areas[0]?.id || '');
    setMapMachineId(machines[0]?.id || '');
    setMapChemicalIds([]);
    setMapToolIds([]);
    setMapFrequency('');
    setMapDesc('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setShowAddForm(true);

    if (activeTab === 'mappings') {
      const mapping = item as MappingRecord;
      setMapPackageId(mapping.packageId);
      setMapAreaId(mapping.areaId);
      setMapMachineId(mapping.machineId);
      setMapChemicalIds(mapping.chemicalIds || []);
      setMapToolIds(mapping.toolIds || []);
      setMapFrequency(mapping.frequency || '');
      setMapDesc(mapping.description || '');
    } else if (activeTab === 'packages') {
      setName(item.name);
      setPkgColor(item.color || '#FACC15');
      setPkgIcon(item.icon || 'Sparkles');
      setDesc(item.desc || '');
    } else if (activeTab === 'areas') {
      setName(item.name);
      setAreaIcon(item.icon || 'Home');
      setAreaBg(item.bg || 'bg-orange-500/10');
    } else {
      setName(item.name);
      setType(item.type);
      setImage(item.image);
      setDesc(item.desc);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
    try {
      if (activeTab === 'machines') await deleteMachine(id);
      else if (activeTab === 'chemicals') await deleteChemical(id);
      else if (activeTab === 'tools') await deleteTool(id);
      else if (activeTab === 'packages') await deletePackage(id);
      else if (activeTab === 'areas') await deleteArea(id);
      else if (activeTab === 'mappings') await deleteMapping(id);
      console.log('Deleted successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'mappings') {
        const mappingData = {
          packageId: mapPackageId,
          areaId: mapAreaId,
          machineId: mapMachineId,
          chemicalIds: mapChemicalIds,
          toolIds: mapToolIds,
          frequency: mapFrequency,
          description: mapDesc
        };

        if (editingId) {
          await updateMapping(editingId, mappingData);
        } else {
          await addMapping(mappingData);
        }
      } else if (activeTab === 'packages') {
        const generatedId = editingId || customId || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const pkgData = { id: generatedId, name, color: pkgColor, icon: pkgIcon, desc };
        
        if (editingId) await updatePackage(editingId, pkgData);
        else await addPackage(pkgData);
      } else if (activeTab === 'areas') {
        const generatedId = editingId || customId || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const areaData = { id: generatedId, name, icon: areaIcon, bg: areaBg };
        
        if (editingId) await updateArea(editingId, areaData);
        else await addArea(areaData);
      } else {
        const itemData = { name, type, image, desc };

        if (activeTab === 'machines') {
          if (editingId) await updateMachine(editingId, itemData);
          else await addMachine(itemData);
        } else if (activeTab === 'chemicals') {
          if (editingId) await updateChemical(editingId, itemData);
          else await addChemical(itemData);
        } else if (activeTab === 'tools') {
          if (editingId) await updateTool(editingId, itemData);
          else await addTool(itemData);
        }
      }
      clearForm();
      console.log('Saved successfully!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleChemicalCheckbox = (cid: string) => {
    setMapChemicalIds((prev) => 
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleToolCheckbox = (tid: string) => {
    setMapToolIds((prev) => 
      prev.includes(tid) ? prev.filter((id) => id !== tid) : [...prev, tid]
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[50vw] bg-slate-950/95 border-l border-white/10 shadow-2xl z-[80] backdrop-blur-xl flex flex-col p-6 animate-slide-in-right">
      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 flex-none">
        <div className="flex items-center gap-2">
          <LucideIcon name="Settings" size={22} className="text-yellow-400" />
          <h2 className="text-lg font-black uppercase text-white tracking-wider">
            Bảng Điều Khiển Cấu Hình (Admin)
          </h2>
        </div>
        
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <LucideIcon name="X" size={24} />
        </button>
      </div>

      {/* Connection Notice */}
      {useStaticFallback && (
        <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-[10px] flex gap-2 items-center flex-none leading-normal">
          <LucideIcon name="AlertTriangle" size={14} className="shrink-0" />
          <span>Hệ thống đang chạy chế độ ngoại tuyến (Static Backup). Mọi thay đổi dữ liệu sẽ chỉ cập nhật trên RAM tạm thời và không lưu lại Firestore.</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex gap-1 mb-4 border-b border-white/5 pb-2 flex-none overflow-x-auto custom-scroll max-w-full">
        {(['packages', 'areas', 'machines', 'chemicals', 'tools', 'mappings'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); clearForm(); }}
            className={`
              px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-yellow-400 text-black font-extrabold shadow-md' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {tab === 'packages' ? 'Gói dịch vụ' : tab === 'areas' ? 'Khu vực' : tab === 'machines' ? 'Thiết bị' : tab === 'chemicals' ? 'Hóa chất' : tab === 'tools' ? 'Dụng cụ' : 'Quy trình'}
          </button>
        ))}
      </div>

      {/* main scroll content */}
      <div className="flex-1 overflow-y-auto custom-scroll pr-1">
        {/* CRUD List Grid */}
        {!showAddForm ? (
          <div className="space-y-4">
            {/* Header List control */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Tổng số lượng: {
                  activeTab === 'machines' ? machines.length : 
                  activeTab === 'chemicals' ? chemicals.length : 
                  activeTab === 'tools' ? tools.length : 
                  activeTab === 'packages' ? packages.length :
                  activeTab === 'areas' ? areas.length :
                  mappings.length
                } mục
              </span>
              <Button 
                variant="primary" 
                className="py-1.5 px-3 text-xs"
                onClick={() => {
                  clearForm();
                  setShowAddForm(true);
                }}
              >
                <LucideIcon name="Plus" size={14} /> Thêm mới
              </Button>
            </div>

            {/* Render Items */}
            <div className="space-y-2">
              {activeTab === 'mappings' ? (
                // Render Mappings Items
                mappings.map((m) => {
                  const pkg = packages.find(p => p.id === m.packageId);
                  const area = areas.find(a => a.id === m.areaId);
                  const mach = machines.find(mac => mac.id === m.machineId);
                  
                  return (
                    <div key={m.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center gap-4 hover:border-slate-700 transition-colors">
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ color: pkg?.color, borderColor: pkg?.color }}>
                            {pkg?.name}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {area?.name}
                          </span>
                          <LucideIcon name="ChevronRight" size={10} className="text-slate-500" />
                          <span className="text-[10px] font-bold text-yellow-300">
                            {mach?.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1.5 truncate max-w-[30vw]">
                          {m.description}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleEdit(m)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer">
                          <LucideIcon name="Edit" size={14} />
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded hover:bg-red-950/40 transition-colors cursor-pointer">
                          <LucideIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Render Machine/Chemical/Tool/Package/Area list
                (
                  activeTab === 'machines' ? machines : 
                  activeTab === 'chemicals' ? chemicals : 
                  activeTab === 'tools' ? tools : 
                  activeTab === 'packages' ? packages : 
                  areas
                ).map((item: any) => {
                  const isPkg = activeTab === 'packages';
                  const isArea = activeTab === 'areas';

                  return (
                    <div key={item.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center gap-4 hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {isPkg || isArea ? (
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                            style={{ 
                              backgroundColor: isPkg ? item.color + '20' : 'rgba(255, 255, 255, 0.05)',
                              color: isPkg ? item.color : '#94a3b8'
                            }}
                          >
                            <LucideIcon name={item.icon} size={18} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-white rounded-lg p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-200 text-xs truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {isPkg ? item.desc : isArea ? `Background: ${item.bg}` : item.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleEdit(item)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer">
                          <LucideIcon name="Edit" size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded hover:bg-red-950/40 transition-colors cursor-pointer">
                          <LucideIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          // Add/Edit Form
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-yellow-300 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
              <LucideIcon name={editingId ? 'Edit' : 'Plus'} size={16} />
              {editingId ? 'Chỉnh sửa thông tin' : 'Thêm mới danh mục'}
            </h3>

            {activeTab === 'mappings' ? (
              // FORM FOR MAPPINGS (Quy trình liên kết)
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Gói dịch vụ</label>
                    <select
                      value={mapPackageId}
                      onChange={(e) => setMapPackageId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Khu vực</label>
                    <select
                      value={mapAreaId}
                      onChange={(e) => setMapAreaId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Thiết bị vận hành chính</label>
                  <select
                    value={mapMachineId}
                    onChange={(e) => setMapMachineId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  >
                    {machines.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type})</option>)}
                  </select>
                </div>

                {/* Chemicals checkbox array */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Hóa chất đi kèm (Chọn nhiều)</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 max-h-32 overflow-y-auto custom-scroll">
                    {chemicals.map(c => (
                      <label key={c.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={mapChemicalIds.includes(c.id)}
                          onChange={() => handleChemicalCheckbox(c.id)}
                          className="accent-yellow-400"
                        />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tools checkbox array */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Dụng cụ phụ trợ (Chọn nhiều)</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 max-h-32 overflow-y-auto custom-scroll">
                    {tools.map(t => (
                      <label key={t.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={mapToolIds.includes(t.id)}
                          onChange={() => handleToolCheckbox(t.id)}
                          className="accent-yellow-400"
                        />
                        <span>{t.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tần suất làm sạch (Linh động)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Hàng tuần, 2-3 tháng/lần"
                      value={mapFrequency}
                      onChange={(e) => setMapFrequency(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mã ID bản ghi (Mặc định tự sinh)</label>
                    <input
                      type="text"
                      disabled
                      className="w-full bg-slate-800/20 border border-slate-800/80 rounded-lg px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                      value={editingId || 'Tự động tạo'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Hướng dẫn / Quy trình chi tiết</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 custom-scroll"
                    placeholder="Mô tả cụ thể từng bước chà, tẩy hay khử trùng..."
                    value={mapDesc}
                    onChange={(e) => setMapDesc(e.target.value)}
                  />
                </div>
              </>
            ) : activeTab === 'packages' ? (
              // FORM FOR PACKAGES (Gói dịch vụ)
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tên gói dịch vụ</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Gói Chuyên Sâu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mã ID gói (Tên định danh)</label>
                    <input
                      type="text"
                      disabled={!!editingId}
                      className="w-full bg-slate-950 disabled:bg-slate-800/20 disabled:text-slate-500 disabled:cursor-not-allowed border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: goi-chuyen-sau (tự động nếu để trống)"
                      value={editingId || customId}
                      onChange={(e) => setCustomId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mã màu (Hex Code)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                        placeholder="#FACC15"
                        value={pkgColor}
                        onChange={(e) => setPkgColor(e.target.value)}
                      />
                      <input 
                        type="color"
                        className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer overflow-hidden shrink-0 mt-0.5"
                        value={pkgColor.startsWith('#') && pkgColor.length === 7 ? pkgColor : '#FACC15'}
                        onChange={(e) => setPkgColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Lucide Icon name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Sparkles, Leaf, Gift"
                      value={pkgIcon}
                      onChange={(e) => setPkgIcon(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mô tả tóm tắt gói</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 custom-scroll"
                    placeholder="Mô tả công dụng chính..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </>
            ) : activeTab === 'areas' ? (
              // FORM FOR AREAS (Khu vực)
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tên khu vực</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Khu vực bếp"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mã ID khu vực (Tên định danh)</label>
                    <input
                      type="text"
                      disabled={!!editingId}
                      className="w-full bg-slate-950 disabled:bg-slate-800/20 disabled:text-slate-500 disabled:cursor-not-allowed border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: khu-vuc-bep (tự động nếu để trống)"
                      value={editingId || customId}
                      onChange={(e) => setCustomId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Lucide Icon name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Home, Utensils, Bath, Sun"
                      value={areaIcon}
                      onChange={(e) => setAreaIcon(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tailwind background class</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: bg-orange-500/10, bg-red-500/10"
                      value={areaBg}
                      onChange={(e) => setAreaBg(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              // FORM FOR MACHINE / CHEMICAL / TOOL
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tên gọi</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Tên cụ thể..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Phân loại</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                      placeholder="Ví dụ: Máy hút bụi khô, bột giặt thảm..."
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Đường dẫn hình ảnh (Media URL)</label>
                  <input
                    type="url"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mô tả đặc tính chính</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400 custom-scroll"
                    placeholder="Mô tả công dụng cốt lõi của mục..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Form actions */}
            <div className="flex gap-2 pt-2 justify-end border-t border-white/5">
              <Button variant="ghost" onClick={clearForm} className="py-2 px-4">Hủy</Button>
              <Button type="submit" variant="primary" className="py-2 px-5">Lưu lại</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;
