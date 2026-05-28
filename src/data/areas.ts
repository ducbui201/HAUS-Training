import type { Area } from '../types';

export const defaultAreas: Area[] = [
  { id: 'living', name: 'Phòng Khách / Ngủ', icon: 'Home', bg: 'bg-orange-500/10' },
  { id: 'kitchen', name: 'Khu Vực Bếp', icon: 'Utensils', bg: 'bg-red-500/10' },
  { id: 'toilet', name: 'Toilet', icon: 'Bath', bg: 'bg-cyan-500/10' },
  { id: 'balcony', name: 'Ban công / P.Giặt', icon: 'Sun', bg: 'bg-gray-500/10' },
  { id: 'stairs', name: 'Cầu thang', icon: 'TrendingUp', bg: 'bg-blue-500/10' },
  { id: 'high', name: 'Khu vực trên cao', icon: 'Maximize', bg: 'bg-indigo-500/10' },
  { id: 'glass', name: 'Khung cửa & Kính', icon: 'Maximize', bg: 'bg-sky-500/10' },
  { id: 'sofa', name: 'Thảm / Sofa', icon: 'Layers', bg: 'bg-purple-500/10' },
  { id: 'curtain', name: 'Nệm / Rèm', icon: 'Layers', bg: 'bg-pink-500/10' },
  { id: 'outdoor', name: 'Sân vườn / Ngoài sân', icon: 'Sun', bg: 'bg-green-500/10' },
  { id: 'basement', name: 'Hầm', icon: 'HardHat', bg: 'bg-slate-500/10' }
];
