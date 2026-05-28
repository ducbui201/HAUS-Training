export interface Machine {
  id: string;
  name: string;
  type: string;
  image: string;
  desc: string;
}

export interface Chemical {
  id: string;
  name: string;
  type: string;
  image: string;
  desc: string;
  pH?: number;
  dilutionRatio?: string;
  safetyMsds?: string[];
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  image: string;
  desc: string;
}

export interface Area {
  id: string;
  name: string;
  icon: string; // Tên của Lucide Icon (ví dụ: 'Home', 'Utensils')
  bg: string;   // Lớp Tailwind background (ví dụ: 'bg-orange-500/10')
}

export interface Package {
  id: string;
  name: string;
  color: string; // Mã màu hex (ví dụ: '#FACC15')
  icon: string;  // Tên của Lucide Icon
  desc: string;
}

export interface MappingRecord {
  id: string;
  packageId: string;
  areaId: string;
  machineId: string;
  chemicalIds: string[]; // Danh sách ID hóa chất tương ứng
  toolIds: string[];     // Danh sách ID dụng cụ tương ứng
  frequency?: string;    // Tần suất định kỳ (nếu có)
  description?: string;  // Mô tả cụ thể cho quy trình
}
