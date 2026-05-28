import type { Package } from '../types';

export const defaultPackages: Package[] = [
  { id: 'chuyen-sau', name: 'Gói Chuyên Sâu', color: '#FACC15', icon: 'Sparkles', desc: 'Vệ sinh toàn diện: Sử dụng đầy đủ thiết bị, làm sạch kỹ mọi chi tiết.' },
  { id: 'dinh-ky', name: 'Gói Định Kỳ', color: '#3B82F6', icon: 'Briefcase', desc: 'Duy trì chuẩn sạch: Tần suất 1-3 tháng/lần tùy khu vực.' },
  { id: 'sau-xay-dung', name: 'Sau Xây Dựng', color: '#EF4444', icon: 'HardHat', desc: 'Hoàn thiện công trình: Xử lý bụi mịn, vôi vữa, sơn bám sau thi công.' },
  { id: 'du-an-bien', name: 'Dự Án Biển', color: '#0EA5E9', icon: 'Waves', desc: 'Giải pháp chuyên biệt cho Resort/Biệt thự biển (chống ăn mòn).' },
  { id: 've-sinh-xanh', name: 'Vệ Sinh Xanh', color: '#10B981', icon: 'Leaf', desc: 'Vệ sinh và khử trùng không hóa chất, an toàn tuyệt đối.' },
  { id: 'sau-tiec', name: 'Sau Tiệc', color: '#EC4899', icon: 'PartyPopper', desc: 'Làm sạch và khử trùng, khử mùi nhanh sau sự kiện.' },
  { id: 'theo-gio', name: 'Theo Giờ', color: '#8B5CF6', icon: 'Clock', desc: 'Linh động thiết bị và nhân sự theo nhu cầu thực tế.' }
];
