import type { MappingRecord } from '../types';

export const defaultMappings: MappingRecord[] = [
  // --- AREA: LIVING (Phòng Khách / Ngủ) ---
  {
    id: 'm1',
    packageId: 'chuyen-sau',
    areaId: 'living',
    machineId: 't11-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    description: 'Hút sạch bụi bẩn trên thảm, bề mặt hộc tủ và các góc tường hẹp.'
  },
  {
    id: 'm2',
    packageId: 'chuyen-sau',
    areaId: 'living',
    machineId: 'br30-4',
    chemicalIds: ['rm-732'],
    toolIds: [],
    description: 'Phun chà sàn đá/gạch phòng khách chuyên sâu, hút khô tức thì.'
  },
  {
    id: 'm3',
    packageId: 'chuyen-sau',
    areaId: 'living',
    machineId: 'bd17-5',
    chemicalIds: ['rm-732'],
    toolIds: ['pad-red'],
    description: 'Đánh chà bóng các góc hẹp chân tường và mép gạch sâu.'
  },
  {
    id: 'm4',
    packageId: 'dinh-ky',
    areaId: 'living',
    machineId: 't11-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    frequency: 'Hàng tuần',
    description: 'Hút bụi định kỳ sàn nhà và chân tủ hàng tuần.'
  },
  {
    id: 'm5',
    packageId: 'dinh-ky',
    areaId: 'living',
    machineId: 'br30-4',
    chemicalIds: ['rm-732'],
    toolIds: [],
    frequency: 'Hàng tuần',
    description: 'Chà sàn định kỳ hàng tuần giữ độ bóng sạch.'
  },
  {
    id: 'm6',
    packageId: 'dinh-ky',
    areaId: 'living',
    machineId: 'bd17-5',
    chemicalIds: ['rm-732'],
    toolIds: ['pad-red'],
    frequency: '2-3 tháng/lần',
    description: 'Chà góc hẹp định kỳ loại bỏ bụi ẩm mốc tích tụ.'
  },

  // --- AREA: KITCHEN (Khu Vực Bếp) ---
  {
    id: 'm7',
    packageId: 'chuyen-sau',
    areaId: 'kitchen',
    machineId: 't11-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    description: 'Hút bụi khe hẹp tủ bếp, chân kệ lò vi sóng.'
  },
  {
    id: 'm8',
    packageId: 'chuyen-sau',
    areaId: 'kitchen',
    machineId: 'br30-4',
    chemicalIds: ['rm-732'],
    toolIds: [],
    description: 'Chà tẩy sàn bếp diện rộng loại bỏ độ nhờn dầu mỡ.'
  },
  {
    id: 'm9',
    packageId: 'chuyen-sau',
    areaId: 'kitchen',
    machineId: 'bd17-5',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-black'],
    description: 'Dùng pad đen đánh bật mảng dầu bám chân tủ bếp.'
  },
  {
    id: 'm10',
    packageId: 'chuyen-sau',
    areaId: 'kitchen',
    machineId: 'sg4-4',
    chemicalIds: ['rm-735'],
    toolIds: [],
    description: 'Vệ sinh hơi nước nóng nhiệt độ cao diệt khuẩn toàn diện bàn đá và chậu rửa.'
  },
  {
    id: 'm11',
    packageId: 'dinh-ky',
    areaId: 'kitchen',
    machineId: 't11-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    frequency: 'Hàng tuần',
    description: 'Hút bụi khô bề mặt bếp hàng tuần.'
  },
  {
    id: 'm12',
    packageId: 'dinh-ky',
    areaId: 'kitchen',
    machineId: 'br30-4',
    chemicalIds: ['rm-732'],
    toolIds: [],
    frequency: 'Hàng tuần',
    description: 'Chà sàn bếp định kỳ hàng tuần khử mùi nhờn dính.'
  },
  {
    id: 'm13',
    packageId: 'dinh-ky',
    areaId: 'kitchen',
    machineId: 'bd17-5',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-red'],
    frequency: '2-3 tháng/lần',
    description: 'Vệ sinh góc hẹp bếp định kỳ xử lý dầu bám khó lau chùi.'
  },

  // --- AREA: TOILET ---
  {
    id: 'm14',
    packageId: 'chuyen-sau',
    areaId: 'toilet',
    machineId: 'sg4-2',
    chemicalIds: ['rm-735'],
    toolIds: [],
    description: 'Khử khuẩn hơi nước nóng vách kính tắm, bồn cầu và vòi hoa sen.'
  },
  {
    id: 'm15',
    packageId: 'chuyen-sau',
    areaId: 'toilet',
    machineId: 'bd17-5',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-red'],
    description: 'Chà đánh vết ố canxi trên sàn gạch nhám toilet.'
  },
  {
    id: 'm16',
    packageId: 'chuyen-sau',
    areaId: 'toilet',
    machineId: 'nt27-1',
    chemicalIds: ['rm-748'],
    toolIds: [],
    description: 'Hút khô toàn bộ nước thải trên sàn sau khi chà rửa.'
  },
  {
    id: 'm17',
    packageId: 'dinh-ky',
    areaId: 'toilet',
    machineId: 'sg4-2',
    chemicalIds: ['rm-735'],
    toolIds: [],
    frequency: '2-3 tháng/lần',
    description: 'Khử trùng hơi nước nóng vòi tắm, diệt mầm nấm mốc ẩn.'
  },

  // --- AREA: BALCONY (Ban Công) ---
  {
    id: 'm18',
    packageId: 'chuyen-sau',
    areaId: 'balcony',
    machineId: 'bd17-5',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-black'],
    description: 'Đánh bay rêu mốc bám bẩn lâu ngày ở khe ban công.'
  },

  // --- AREA: STAIRS (Cầu thang) ---
  {
    id: 'm19',
    packageId: 'chuyen-sau',
    areaId: 'stairs',
    machineId: 'bvl5-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    description: 'Đeo vai linh hoạt hút bụi khô dọc bậc cầu thang và khe hẹp.'
  },
  {
    id: 'm20',
    packageId: 'chuyen-sau',
    areaId: 'stairs',
    machineId: 'bd17-5',
    chemicalIds: ['rm-732'],
    toolIds: ['pad-red'],
    description: 'Đánh chà bóng từng góc mép và mặt đứng bậc cầu thang.'
  },

  // --- AREA: HIGH (Khu vực trên cao) ---
  {
    id: 'm21',
    packageId: 'chuyen-sau',
    areaId: 'high',
    machineId: 'bvl5-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    description: 'Đeo vai tiện lợi hút bụi trần, phào chỉ thạch cao trên cao.'
  },

  // --- AREA: GLASS (Kính & Cửa) ---
  {
    id: 'm22',
    packageId: 'chuyen-sau',
    areaId: 'glass',
    machineId: 'sg4-2',
    chemicalIds: ['rm-500'],
    toolIds: ['window-kit'],
    description: 'Vệ sinh hơi nước diệt khuẩn kết hợp bông gạt kính sáng loáng.'
  },
  {
    id: 'm23',
    packageId: 'chuyen-sau',
    areaId: 'glass',
    machineId: 'nt27-1',
    chemicalIds: ['rm-748'],
    toolIds: ['crevice-tool'],
    description: 'Hút sạch nước thải đọng ở ray khe cửa kính trượt.'
  },

  // --- AREA: SOFA (Thảm / Sofa) ---
  {
    id: 'm24',
    packageId: 'chuyen-sau',
    areaId: 'sofa',
    machineId: 't11-1',
    chemicalIds: [],
    toolIds: ['crevice-tool'],
    description: 'Hút bụi khô bề mặt kẽ đệm trước khi tiến hành giặt ẩm.'
  },
  {
    id: 'm25',
    packageId: 'chuyen-sau',
    areaId: 'sofa',
    machineId: 'puzzi',
    chemicalIds: ['rm-760', 'rm-748'],
    toolIds: ['upholstery-nozzle'],
    description: 'Phun hút giặt ẩm sâu sâu, đánh tan vết ố trà/cà phê trên sofa.'
  },
  {
    id: 'm26',
    packageId: 'chuyen-sau',
    areaId: 'sofa',
    machineId: 'ab45',
    chemicalIds: [],
    toolIds: [],
    description: 'Thổi luồng gió mạnh đẩy nhanh thời gian khô tự nhiên của sofa.'
  },

  // --- AREA: CURTAIN (Nệm / Rèm) ---
  {
    id: 'm27',
    packageId: 'chuyen-sau',
    areaId: 'curtain',
    machineId: 'sg4-2',
    chemicalIds: ['rm-735'],
    toolIds: [],
    description: 'Dùng hơi nước diệt khuẩn, làm mềm phẳng sợi vải rèm treo.'
  },

  // --- AREA: OUTDOOR (Sân vườn) ---
  {
    id: 'm28',
    packageId: 'chuyen-sau',
    areaId: 'outdoor',
    machineId: 'km70-30',
    chemicalIds: [],
    toolIds: [],
    description: 'Quét gom nhanh lá khô, đất cát ở lối đi sân vườn lớn.'
  },
  {
    id: 'm29',
    packageId: 'chuyen-sau',
    areaId: 'outdoor',
    machineId: 'bds43',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-black'],
    description: 'Chà sàn đá cứng ngoài trời tẩy vết ố đen rêu ẩm mốc nặng.'
  },
  {
    id: 'm30',
    packageId: 'chuyen-sau',
    areaId: 'outdoor',
    machineId: 'hd5-15',
    chemicalIds: [],
    toolIds: [],
    description: 'Xịt rửa áp lực cao cuốn trôi bùn đất bám sâu kẽ đá rải lối đi.'
  },

  // --- AREA: BASEMENT (Hầm) ---
  {
    id: 'm31',
    packageId: 'chuyen-sau',
    areaId: 'basement',
    machineId: 'bds43',
    chemicalIds: ['rm-752'],
    toolIds: ['pad-black'],
    description: 'Tẩy rửa sàn hầm bê tông dính dầu nhớt phương tiện và bụi xe.'
  },
  {
    id: 'm32',
    packageId: 'chuyen-sau',
    areaId: 'basement',
    machineId: 'hd5-15',
    chemicalIds: [],
    toolIds: [],
    description: 'Phun xịt áp lực rửa dọn bùn đất cặn đọng ở lối dốc hầm gửi xe.'
  }
];
