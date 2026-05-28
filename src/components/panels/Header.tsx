import React from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

interface HeaderProps {
  onLoginClick: () => void;
  onConfigToggle: () => void;
  showConfig: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLoginClick,
  onConfigToggle,
  showConfig
}) => {
  const { 
    packages, 
    activePackage, 
    setActivePackage, 
    setSelectedMachineId, 
    setHoveredArea,
    setSelectedChemicalId,
    setSelectedToolId,
    selectedMachineId,
    mappings,
    isAdmin,
    isQuizMode,
    setIsQuizMode
  } = useApp();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handlePackageClick = (pkgId: string) => {
    if (activePackage === pkgId) {
      setActivePackage(null);
    } else {
      setActivePackage(pkgId);
      // Clear specific selections
      setSelectedMachineId(null);
      setHoveredArea(null);
      setSelectedChemicalId(null);
      setSelectedToolId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (showConfig) onConfigToggle();
      console.log('Logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Helper to check if a package uses the selected machine (for related highlight)
  const isPackageRelated = (pkgId: string) => {
    if (!selectedMachineId) return false;
    return mappings.some(
      (m) => m.packageId === pkgId && m.machineId === selectedMachineId
    );
  };

  return (
    <header className="flex-none px-6 py-2 flex justify-between items-center glass-panel z-50 border-b border-white/10 h-[8vh]">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="karcher-logo-box text-sm select-none">
          <span>KÄRCHER</span>
        </div>
        <h1 className="text-fluid-title font-black tracking-tight text-white uppercase hidden md:block ml-3">
          Hệ Thống Thiết Bị Làm Sạch
        </h1>
      </div>

      {/* Packages Navigation */}
      <div className="flex gap-2 overflow-x-auto custom-scroll mx-4 max-w-[60vw]">
        {packages.map((pkg) => {
          const isActive = activePackage === pkg.id;
          const isRelated = isPackageRelated(pkg.id);

          return (
            <button
              key={pkg.id}
              onClick={() => handlePackageClick(pkg.id)}
              className={`
                flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300
                whitespace-nowrap text-xs font-bold uppercase tracking-wider cursor-pointer select-none
                ${isActive 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-105' 
                  : isRelated
                    ? 'bg-slate-800/40 hover:border-slate-500' 
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700'}
              `}
              style={{
                color: isActive ? '#fff' : (isRelated ? pkg.color : '#94a3b8'),
                borderColor: isActive ? pkg.color : (isRelated ? pkg.color : '#334155'),
              }}
            >
              <LucideIcon name={pkg.icon} size={14} />
              <span>{pkg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Utilities Action Group */}
      <div className="flex items-center gap-3">
        {/* Admin Dashboard Control */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onConfigToggle}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300
                text-xs font-bold uppercase tracking-wider cursor-pointer
                ${showConfig 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-green-600/30 border-green-500/50 text-green-400 hover:bg-green-600/50'}
              `}
            >
              <LucideIcon name="Settings" size={14} />
              <span className="hidden sm:inline">Quản trị</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-800 border border-slate-700 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400 rounded-lg text-slate-400 transition-all duration-300 cursor-pointer"
              title="Đăng xuất Admin"
            >
              <LucideIcon name="LogOut" size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-yellow-400 rounded-lg text-slate-400 transition-all duration-300 cursor-pointer"
            title="Đăng nhập Admin"
          >
            <LucideIcon name="Lock" size={16} />
          </button>
        )}

        {/* Interactive Quiz Check Mode */}
        <button
          onClick={() => setIsQuizMode(!isQuizMode)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300
            text-xs font-bold uppercase tracking-wider cursor-pointer
            ${isQuizMode 
              ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-105' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}
          `}
          title="Bắt đầu kiểm tra trắc nghiệm"
        >
          <LucideIcon name="ShieldAlert" size={14} />
          <span className="hidden lg:inline">Kiểm tra</span>
        </button>

        {/* Fullscreen control */}
        <button
          onClick={toggleFullScreen}
          className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-400 transition-all duration-300 cursor-pointer"
          title="Toàn màn hình"
        >
          <LucideIcon name="Maximize" size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
