import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LucideIcon from '../ui/LucideIcon';

export const TweaksPanel: React.FC = () => {
  const {
    tone,
    setTone,
    lineStyle,
    setLineStyle,
    density,
    setDensity,
    showImages,
    setShowImages,
    speaker,
    setSpeaker,
    packages,
    triggerSeed
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleResetData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu?')) {
      try {
        await triggerSeed();
        window.location.reload();
      } catch (err) {
        alert('Khôi phục thất bại: ' + err);
      }
    }
  };

  const handleExportJSON = () => {
    const backupState = {
      packages,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haus-training-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 left-5 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-108 transition-all duration-300 border-2 z-50
          ${tone === 'ivory'
            ? 'bg-slate-800 border-slate-700 text-white'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-white/20 text-black'}`}
        style={{
          boxShadow: tone === 'ivory' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 10px 25px rgba(229, 199, 143, 0.35)',
        }}
        title="Tùy biến giao diện (Tweaks)"
      >
        <LucideIcon name={isOpen ? 'X' : 'Sliders'} size={22} />
      </button>

      {/* Floating Tweaks Panel */}
      {isOpen && (
        <div className="tweaks-panel-float" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <h3 className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5" style={{ color: 'var(--haus-gold)' }}>
              <LucideIcon name="Settings" size={14} />
              Bảng tùy biến UI/UX
            </h3>
            <span className="text-[8px] bg-yellow-400/10 text-yellow-300 font-bold px-1.5 py-0.5 rounded border border-yellow-400/20">HAUS HUD</span>
          </div>

          <div className="space-y-4">
            {/* TONE */}
            <div>
              <div className="tweak-sec-head">Bề mặt</div>
              <div className="tweak-row">
                <span className="tweak-label">Tông màu nền</span>
                <div className="tweak-options">
                  <button
                    onClick={() => setTone('navy')}
                    className={`tweak-opt-btn ${tone === 'navy' ? 'is-active' : ''}`}
                  >
                    Navy
                  </button>
                  <button
                    onClick={() => setTone('ivory')}
                    className={`tweak-opt-btn ${tone === 'ivory' ? 'is-active' : ''}`}
                  >
                    Ngà (Ivory)
                  </button>
                </div>
              </div>

              {/* DENSITY */}
              <div className="tweak-row">
                <span className="tweak-label">Mật độ hiển thị</span>
                <div className="tweak-options">
                  <button
                    onClick={() => setDensity('compact')}
                    className={`tweak-opt-btn ${density === 'compact' ? 'is-active' : ''}`}
                  >
                    Hẹp
                  </button>
                  <button
                    onClick={() => setDensity('standard')}
                    className={`tweak-opt-btn ${density === 'standard' ? 'is-active' : ''}`}
                  >
                    Chuẩn
                  </button>
                  <button
                    onClick={() => setDensity('spacious')}
                    className={`tweak-opt-btn ${density === 'spacious' ? 'is-active' : ''}`}
                  >
                    Rộng
                  </button>
                </div>
              </div>
            </div>

            {/* CONNECTION LINES */}
            <div>
              <div className="tweak-sec-head">Đường nối dòng chảy</div>
              <div className="tweak-row">
                <span className="tweak-label">Phong cách nối</span>
                <div className="tweak-options">
                  <button
                    onClick={() => setLineStyle('bezier-star')}
                    className={`tweak-opt-btn ${lineStyle === 'bezier-star' ? 'is-active' : ''}`}
                  >
                    Hạt động
                  </button>
                  <button
                    onClick={() => setLineStyle('straight')}
                    className={`tweak-opt-btn ${lineStyle === 'straight' ? 'is-active' : ''}`}
                  >
                    Thẳng
                  </button>
                  <button
                    onClick={() => setLineStyle('static')}
                    className={`tweak-opt-btn ${lineStyle === 'static' ? 'is-active' : ''}`}
                  >
                    Tĩnh
                  </button>
                </div>
              </div>
            </div>

            {/* PRESENTATION OPT */}
            <div>
              <div className="tweak-sec-head">Trình bày</div>
              
              <div className="tweak-row">
                <span className="tweak-label">Chế độ giảng bài</span>
                <button
                  onClick={() => setSpeaker(!speaker)}
                  className={`tweak-toggle-switch ${speaker ? 'is-on' : ''}`}
                >
                  <div className="tweak-toggle-handle" />
                </button>
              </div>

              <div className="tweak-row">
                <span className="tweak-label">Ảnh sản phẩm</span>
                <button
                  onClick={() => setShowImages(!showImages)}
                  className={`tweak-toggle-switch ${showImages ? 'is-on' : ''}`}
                >
                  <div className="tweak-toggle-handle" />
                </button>
              </div>
            </div>

            {/* DATA MANAGEMENT */}
            <div>
              <div className="tweak-sec-head">Dữ liệu hệ thống</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleExportJSON}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-700/60 transition-all cursor-pointer text-center"
                >
                  Sao lưu JSON
                </button>
                <button
                  onClick={handleResetData}
                  className="flex-1 py-1.5 bg-red-950/20 hover:bg-red-900/40 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/20 transition-all cursor-pointer text-center"
                >
                  Khôi phục gốc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TweaksPanel;
