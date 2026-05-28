export interface QuizQuestion {
  id: number;
  question: string;
  targetAreaId: string;
  targetPackageId: string;
  correctMachineId: string;
  correctChemicalId: string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Để giặt ẩm sâu và làm sạch triệt để các vết ố bẩn chè/cà phê trên ghế Sofa nỉ (Gói Chuyên sâu), hãy nhấp chọn Thiết bị giặt phun hút và Hóa chất chuyên dụng tương thích tương ứng?",
    targetAreaId: "sofa",
    targetPackageId: "chuyen-sau",
    correctMachineId: "puzzi",
    correctChemicalId: "rm-760",
    explanation: "Chính xác! Máy phun hút giặt thảm/sofa Kärcher Puzzi kết hợp bột giặt sâu RM 760 Powder là giải pháp hàng đầu để đánh bay các vết bẩn hữu cơ bám sâu trong sợi vải, đồng thời hút khô nước bẩn hiệu quả."
  },
  {
    id: 2,
    question: "Để vệ sinh khử trùng y tế, diệt nấm mốc ẩn ở vách kính và thiết bị trong Toilet (Gói Chuyên sâu), hãy nhấp chọn Thiết bị làm sạch hơi nước nóng và Hóa chất diệt khuẩn y tế tương ứng?",
    targetAreaId: "toilet",
    targetPackageId: "chuyen-sau",
    correctMachineId: "sg4-2",
    correctChemicalId: "rm-735",
    explanation: "Tuyệt vời! Máy làm sạch hơi nước nóng SG 4/2 kết hợp hóa chất khử trùng y tế RM 735 mang lại khả năng diệt khuẩn 99.99% bằng hơi nhiệt độ cao, an toàn tuyệt đối cho vách kính tắm và sứ vệ sinh."
  },
  {
    id: 3,
    question: "Để cạo sạch mảng bám dầu mỡ tích tụ lâu ngày ở các góc hẹp chân tủ bếp (Gói Chuyên sâu), bạn cần chọn Thiết bị chà sàn cầm tay nhỏ gọn và Hóa chất tẩy nhờn kiềm mạnh nào?",
    targetAreaId: "kitchen",
    targetPackageId: "chuyen-sau",
    correctMachineId: "bd17-5",
    correctChemicalId: "rm-752",
    explanation: "Xuất sắc! Máy chà góc cầm tay BD 17/5 kết hợp hóa chất tẩy nặng kiềm mạnh RM 752 Intense cùng pad chà là tổ hợp tối ưu để phá vỡ liên kết mỡ cháy bám dính ở góc tủ bếp hiểm hóc."
  }
];
