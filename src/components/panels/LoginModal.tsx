import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import LucideIcon from '../ui/LucideIcon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setIsAdmin, useStaticFallback } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Try real Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase login success!');
      onClose();
    } catch (err: any) {
      console.warn('Firebase login failed, checking fallback credentials:', err.message);
      
      // 2. Fallback bypass check for local development / mock project environment
      const isMockEnv = import.meta.env.VITE_FIREBASE_API_KEY === 'mock-api-key-karcher-haus-12345';
      if (isMockEnv || useStaticFallback) {
        if (email.trim() === 'admin@haus.vn' && password === 'haus12345') {
          setIsAdmin(true);
          console.log('Static fallback bypass login success!');
          onClose();
          setLoading(false);
          return;
        }
      }
      
      setError(
        err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Email hoặc mật khẩu không chính xác.'
          : 'Lỗi đăng nhập: ' + err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] px-4 backdrop-blur-sm">
      <div 
        className="w-full max-w-md glass-modal rounded-2xl border border-white/10 p-6 flex flex-col relative animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <LucideIcon name="X" size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-yellow-400/20 text-yellow-400 rounded-lg">
            <LucideIcon name="Lock" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Đăng nhập Admin</h2>
            <p className="text-xs text-slate-400">Chỉ dành cho quản trị viên HAUS</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-2.5 items-start">
          <LucideIcon name="Info" size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-normal">
            <span className="font-bold text-blue-300 block mb-0.5">Tài khoản chạy thử local:</span>
            Email: <code className="bg-slate-900/60 px-1 py-0.5 rounded text-yellow-300">admin@haus.vn</code><br/>
            Mật khẩu: <code className="bg-slate-900/60 px-1 py-0.5 rounded text-yellow-300">haus12345</code>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex gap-2 items-center">
            <LucideIcon name="AlertTriangle" size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
              Email đăng nhập
            </label>
            <input 
              type="email"
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              placeholder="example@haus.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
              Mật khẩu
            </label>
            <input 
              type="password"
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-2.5 mt-2 text-center flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Đang kiểm tra...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
