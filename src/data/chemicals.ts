import type { Chemical } from '../types';

export const defaultChemicals: Chemical[] = [
  { 
    id: 'rm-760', 
    name: 'RM 760 Powder', 
    type: 'Hóa chất giặt thảm & sofa', 
    image: 'https://s1.kaercher-media.com/products/62901750/main/1/d0.jpg', 
    desc: 'Bột làm sạch sâu sợi thảm, sofa, nệm vải, khử mùi hiệu quả.',
    pH: 8,
    dilutionRatio: '1:100',
    safetyMsds: ['gloves', 'mask']
  },
  { 
    id: 'rm-752', 
    name: 'RM 752 Intense', 
    type: 'Hóa chất chà sàn chuyên sâu', 
    image: 'https://s1.kaercher-media.com/products/62958110/main/1/d0.jpg', 
    desc: 'Tẩy rửa cặn xi măng, dầu mỡ nặng và các vết bẩn công nghiệp cứng đầu.',
    pH: 13,
    dilutionRatio: '1:10',
    safetyMsds: ['gloves', 'goggles', 'mask']
  },
  { 
    id: 'rm-735', 
    name: 'RM 735 Disinfectant', 
    type: 'Hóa chất khử trùng y tế', 
    image: 'https://s1.kaercher-media.com/products/62955970/main/1/d0.jpg', 
    desc: 'Khử khuẩn, diệt vi rút và nấm mốc trên mọi bề mặt không chịu nước.',
    pH: 7.5,
    dilutionRatio: '1:50',
    safetyMsds: ['gloves', 'goggles']
  },
  { 
    id: 'rm-748', 
    name: 'RM 748 Defoamer', 
    type: 'Chất phá bọt nước thải', 
    image: 'https://s1.kaercher-media.com/products/62960620/main/1/d0.jpg', 
    desc: 'Phá bọt tức thì trong bình chứa nước thải của máy chà sàn liên hợp, máy giặt thảm.',
    pH: 7,
    dilutionRatio: '1:200',
    safetyMsds: ['gloves']
  },
  { 
    id: 'rm-500', 
    name: 'RM 500 Glass', 
    type: 'Nước lau khung & kính', 
    image: 'https://s1.kaercher-media.com/products/62953020/main/1/d0.jpg', 
    desc: 'Làm sạch khung kính, cửa kính không để lại vệt mờ, chống tĩnh điện bám bụi.',
    pH: 6.5,
    dilutionRatio: '1:10',
    safetyMsds: []
  },
  { 
    id: 'rm-732', 
    name: 'RM 732 Neutral', 
    type: 'Hóa chất trung tính đa năng', 
    image: 'https://s1.kaercher-media.com/products/62955940/main/1/d0.jpg', 
    desc: 'Vệ sinh lau sàn gỗ, đá tự nhiên và bề mặt nhạy cảm hàng ngày.',
    pH: 7.2,
    dilutionRatio: '1:80',
    safetyMsds: ['gloves']
  }
];
