/* ============================================================
   HAUS Training Cockpit — Seed data + localStorage persistence
   ------------------------------------------------------------
   Sản phẩm Kärcher giữ tên thật vì đây là thiết bị HAUS sử dụng
   trong thực tế đào tạo. UI khung là của HAUS.
   ============================================================ */

(function (global) {
  const STORAGE_KEY = "haus.training.v1";

  // ----- Gói dịch vụ -----
  const SEED_PACKAGES = [
    { id: "chuyen-sau", name: "Chuyên sâu", lucide: "Sparkles",
      desc: "Vệ sinh toàn diện. Sử dụng đầy đủ thiết bị, làm sạch kỹ mọi chi tiết." },
    { id: "dinh-ky", name: "Định kỳ", lucide: "CalendarCheck",
      desc: "Duy trì chuẩn sạch. Tần suất 1–3 tháng một lần tuỳ khu vực." },
    { id: "sau-xay-dung", name: "Sau xây dựng", lucide: "HardHat",
      desc: "Hoàn thiện công trình. Xử lý bụi mịn, vôi vữa, sơn bám sau thi công." },
    { id: "du-an-bien", name: "Dự án biển", lucide: "Waves",
      desc: "Giải pháp chuyên biệt cho resort và biệt thự ven biển. Chống ăn mòn." },
    { id: "ve-sinh-xanh", name: "Vệ sinh xanh", lucide: "Leaf",
      desc: "Vệ sinh và khử trùng không hoá chất. An toàn cho gia đình có trẻ nhỏ." },
    { id: "sau-tiec", name: "Sau tiệc", lucide: "Wine",
      desc: "Làm sạch, khử trùng và khử mùi nhanh sau sự kiện." },
    { id: "theo-gio", name: "Theo giờ", lucide: "Clock",
      desc: "Linh động thiết bị và nhân sự theo nhu cầu thực tế của Quý khách." }
  ];

  // ----- Khu vực -----
  const SEED_AREAS = [
    { id: "living",   name: "Phòng khách / Phòng ngủ", lucide: "Sofa" },
    { id: "kitchen",  name: "Khu vực bếp",             lucide: "ChefHat" },
    { id: "toilet",   name: "Toilet",                  lucide: "Bath" },
    { id: "balcony",  name: "Ban công / Phòng giặt",   lucide: "Sun" },
    { id: "stairs",   name: "Cầu thang",               lucide: "ArrowUpRight" },
    { id: "high",     name: "Khu vực trên cao",        lucide: "Maximize2" },
    { id: "glass",    name: "Khung cửa & kính",        lucide: "Square" },
    { id: "sofa",     name: "Thảm / Sofa",             lucide: "Armchair" },
    { id: "curtain",  name: "Nệm / Rèm",               lucide: "Bed" },
    { id: "outdoor",  name: "Sân vườn",                lucide: "Trees" },
    { id: "basement", name: "Hầm",                     lucide: "Layers" }
  ];

  // ----- Máy (Kärcher) -----
  const SEED_MACHINES = [
    { id: "t11-1",    name: "T 11/1",         type: "Máy hút bụi khô",            desc: "Hút bụi bề mặt, hộc tủ, sàn." },
    { id: "br30-4",   name: "BR 30/4 C ADV",  type: "Máy chà sàn liên hợp",       desc: "Phun hút và chà sàn diện tích lớn." },
    { id: "bd17-5",   name: "BD 17/5 C",      type: "Máy đánh sàn nhỏ",           desc: "Đánh bóng, chà vết bẩn góc hẹp." },
    { id: "bvl5-1",   name: "BVL 5/1 Bp",     type: "Máy hút bụi đeo vai",        desc: "Hút bụi cầu thang và trên cao." },
    { id: "sg4-2",    name: "SG 4/2 Classic", type: "Máy vệ sinh hơi nước nóng",  desc: "Diệt khuẩn, tẩy dầu mỡ." },
    { id: "sg4-4",    name: "SG 4/4 Classic", type: "Máy hơi nước chuyên sâu",    desc: "Diệt khuẩn mạnh, áp lực cao." },
    { id: "nt27-1",   name: "NT 27/1",        type: "Máy hút nước nhỏ",           desc: "Hút nước thải, chất lỏng." },
    { id: "nt40-1",   name: "NT 40/1 Ap L",   type: "Máy hút bụi mịn",            desc: "Hút bụi công nghiệp, bụi mịn." },
    { id: "puzzi",    name: "Puzzi 10/1",     type: "Máy giặt thảm",              desc: "Phun hút giặt thảm, sofa." },
    { id: "ab45",     name: "AB 45 Classic",  type: "Máy thổi",                   desc: "Thổi khô sàn, thảm nhanh." },
    { id: "km70-30",  name: "KM 70/30 C",     type: "Máy quét và hút rác",        desc: "Quét rác sân vườn, đường đi." },
    { id: "bds43",    name: "BDS 43/150",     type: "Máy đánh sàn đơn",           desc: "Đánh sàn cứng, tẩy vết sâu." },
    { id: "hd5-15",   name: "HD 5/15",        type: "Máy nước áp lực nhỏ",        desc: "Xịt rửa sân, tường rêu mốc." },
    { id: "hd10-25",  name: "HD 10/25 4S",    type: "Máy nước áp lực lớn",        desc: "Xịt rửa công nghiệp ba pha." }
  ];

  // ----- Hoá chất -----
  const SEED_CHEMICALS = [
    { id: "rm-760", name: "RM 760 Powder",     type: "Giặt thảm & sofa",          desc: "Bột làm sạch sâu sợi thảm, sofa, nệm vải. Khử mùi hiệu quả." },
    { id: "rm-752", name: "RM 752 Intense",    type: "Chà sàn chuyên sâu",        desc: "Tẩy rửa cặn xi măng, dầu mỡ nặng, vết bẩn công nghiệp cứng đầu." },
    { id: "rm-735", name: "RM 735 Disinfect",  type: "Khử trùng y tế",            desc: "Khử khuẩn, diệt vi rút và nấm mốc trên bề mặt không chịu nước." },
    { id: "rm-748", name: "RM 748 Defoamer",   type: "Phá bọt nước thải",         desc: "Phá bọt tức thì trong bình chứa nước thải của máy chà sàn liên hợp." },
    { id: "rm-500", name: "RM 500 Glass",      type: "Lau khung và kính",         desc: "Làm sạch khung kính không để vệt mờ. Chống tĩnh điện bám bụi." },
    { id: "rm-732", name: "RM 732 Neutral",    type: "Trung tính đa năng",        desc: "Vệ sinh lau sàn gỗ, đá tự nhiên và bề mặt nhạy cảm hàng ngày." }
  ];

  // ----- Dụng cụ / phụ kiện -----
  const SEED_TOOLS = [
    { id: "carpet-nozzle",     name: "Đầu chà thảm bản rộng",   type: "Phụ kiện máy giặt thảm", desc: "Phun hút và chà sạch vết bẩn diện rộng trên thảm trải sàn." },
    { id: "upholstery-nozzle", name: "Đầu hút sofa cầm tay",    type: "Phụ kiện máy giặt thảm", desc: "Đầu hút trong suốt bản nhỏ dẹt lau nệm, sofa và ghế văn phòng." },
    { id: "crevice-tool",      name: "Đầu hút khe hẹp",         type: "Phụ kiện máy hút bụi",   desc: "Hút bụi kẽ cửa sổ, góc hẹp cầu thang, gầm tủ." },
    { id: "pad-black",         name: "Pad chà sàn đen",         type: "Vật tư chà sàn đơn",     desc: "Nhám cao để bóc keo, tẩy sơn, tẩy xi măng sau xây dựng." },
    { id: "pad-red",           name: "Pad chà sàn đỏ",          type: "Vật tư chà sàn đơn",     desc: "Nhám vừa để chà sàn gỗ, đánh bóng sàn đá định kỳ." },
    { id: "pad-white",         name: "Pad chà sàn trắng",       type: "Vật tư chà sàn đơn",     desc: "Nhám nhẹ. Đánh bóng bảo dưỡng và làm mới mặt sàn đã chăm sóc." },
    { id: "window-kit",        name: "Bộ gạt kính chuyên dụng", type: "Dụng cụ lau kính",       desc: "Bông lau kính kết hợp gạt cao su thu hồi nước thừa khe kính." },
    { id: "mop-microfibre",    name: "Cây lau sợi microfibre",  type: "Dụng cụ lau tay",        desc: "Sợi mịn ôm bụi, dùng cho sàn gỗ và đá nhạy cảm." }
  ];

  // ----- Mối liên kết: Gói × Khu vực × Máy + (hoá chất[], dụng cụ[]) -----
  const SEED_MAPPINGS = [
    // PHÒNG KHÁCH / NGỦ — Chuyên sâu
    { id: "m1",  packageId: "chuyen-sau", areaId: "living",  machineId: "t11-1",   chemicalIds: [],              toolIds: ["crevice-tool"],        description: "Hút sạch bụi bẩn trên thảm, bề mặt hộc tủ và các góc tường hẹp." },
    { id: "m2",  packageId: "chuyen-sau", areaId: "living",  machineId: "br30-4",  chemicalIds: ["rm-732"],      toolIds: [],                      description: "Phun chà sàn đá hoặc gạch phòng khách. Hút khô tức thì." },
    { id: "m3",  packageId: "chuyen-sau", areaId: "living",  machineId: "bd17-5",  chemicalIds: ["rm-732"],      toolIds: ["pad-red"],             description: "Đánh chà các góc hẹp chân tường và mép gạch sâu." },
    // Định kỳ
    { id: "m4",  packageId: "dinh-ky",    areaId: "living",  machineId: "t11-1",   chemicalIds: [],              toolIds: ["crevice-tool"],        frequency: "Hàng tuần", description: "Hút bụi định kỳ sàn nhà và chân tủ hàng tuần." },
    { id: "m5",  packageId: "dinh-ky",    areaId: "living",  machineId: "br30-4",  chemicalIds: ["rm-732"],      toolIds: [],                      frequency: "Hàng tuần", description: "Chà sàn định kỳ hàng tuần giữ độ bóng sạch." },
    { id: "m6",  packageId: "dinh-ky",    areaId: "living",  machineId: "bd17-5",  chemicalIds: ["rm-732"],      toolIds: ["pad-red"],             frequency: "2–3 tháng/lần", description: "Chà góc hẹp định kỳ loại bỏ bụi ẩm mốc tích tụ." },

    // BẾP — Chuyên sâu
    { id: "m7",  packageId: "chuyen-sau", areaId: "kitchen", machineId: "t11-1",   chemicalIds: [],              toolIds: ["crevice-tool"],        description: "Hút bụi khe hẹp tủ bếp, chân kệ lò vi sóng." },
    { id: "m8",  packageId: "chuyen-sau", areaId: "kitchen", machineId: "br30-4",  chemicalIds: ["rm-732"],      toolIds: [],                      description: "Chà tẩy sàn bếp diện rộng loại bỏ dầu mỡ." },
    { id: "m9",  packageId: "chuyen-sau", areaId: "kitchen", machineId: "bd17-5",  chemicalIds: ["rm-752"],      toolIds: ["pad-black"],           description: "Dùng pad đen đánh bật mảng dầu bám chân tủ bếp." },
    { id: "m10", packageId: "chuyen-sau", areaId: "kitchen", machineId: "sg4-4",   chemicalIds: ["rm-735"],      toolIds: [],                      description: "Vệ sinh hơi nước nóng diệt khuẩn bàn đá và chậu rửa." },

    // TOILET — Chuyên sâu
    { id: "m14", packageId: "chuyen-sau", areaId: "toilet",  machineId: "sg4-2",   chemicalIds: ["rm-735"],      toolIds: [],                      description: "Khử khuẩn hơi nước nóng vách kính tắm, bồn cầu, vòi hoa sen." },
    { id: "m15", packageId: "chuyen-sau", areaId: "toilet",  machineId: "bd17-5",  chemicalIds: ["rm-752"],      toolIds: ["pad-red"],             description: "Chà đánh vết ố canxi trên sàn gạch nhám toilet." },
    { id: "m16", packageId: "chuyen-sau", areaId: "toilet",  machineId: "nt27-1",  chemicalIds: ["rm-748"],      toolIds: [],                      description: "Hút khô toàn bộ nước thải trên sàn sau khi chà rửa." },
    { id: "m17", packageId: "dinh-ky",    areaId: "toilet",  machineId: "sg4-2",   chemicalIds: ["rm-735"],      toolIds: [],                      frequency: "2–3 tháng/lần", description: "Khử trùng hơi nước nóng vòi tắm. Diệt mầm nấm mốc ẩn." },

    // SOFA / THẢM — Chuyên sâu
    { id: "m24", packageId: "chuyen-sau", areaId: "sofa",    machineId: "t11-1",   chemicalIds: [],              toolIds: ["crevice-tool"],        description: "Hút bụi khô bề mặt kẽ đệm trước khi tiến hành giặt ẩm." },
    { id: "m25", packageId: "chuyen-sau", areaId: "sofa",    machineId: "puzzi",   chemicalIds: ["rm-760", "rm-748"], toolIds: ["upholstery-nozzle"], description: "Phun hút giặt ẩm sâu, đánh tan vết ố trà cà phê trên sofa." },
    { id: "m26", packageId: "chuyen-sau", areaId: "sofa",    machineId: "ab45",    chemicalIds: [],              toolIds: [],                      description: "Thổi luồng gió mạnh đẩy nhanh thời gian khô tự nhiên." },

    // KÍNH — Chuyên sâu
    { id: "m27", packageId: "chuyen-sau", areaId: "glass",   machineId: "t11-1",   chemicalIds: ["rm-500"],      toolIds: ["window-kit"],          description: "Lau khung và kính trong, dùng bộ gạt thu hồi nước thừa." },

    // BAN CÔNG — Định kỳ
    { id: "m28", packageId: "dinh-ky",    areaId: "balcony", machineId: "hd5-15",  chemicalIds: [],              toolIds: [],                      frequency: "Hàng tháng", description: "Xịt rửa ban công và phòng giặt định kỳ." },

    // SÂN VƯỜN — Sau xây dựng
    { id: "m29", packageId: "sau-xay-dung", areaId: "outdoor", machineId: "km70-30", chemicalIds: [],            toolIds: [],                      description: "Quét gom rác xây dựng và đất cát sân vườn." },
    { id: "m30", packageId: "sau-xay-dung", areaId: "outdoor", machineId: "hd10-25", chemicalIds: ["rm-752"],    toolIds: [],                      description: "Xịt rửa công nghiệp ba pha tẩy vôi vữa bám lối đi." },

    // SAU XÂY DỰNG — Phòng khách
    { id: "m31", packageId: "sau-xay-dung", areaId: "living",  machineId: "nt40-1", chemicalIds: [],             toolIds: [],                      description: "Hút bụi mịn vôi vữa, bột sơn còn sót lại sau thi công." },
    { id: "m32", packageId: "sau-xay-dung", areaId: "living",  machineId: "bds43",  chemicalIds: ["rm-752"],     toolIds: ["pad-black"],           description: "Đánh sàn cứng bóc cặn keo và xi măng vương vãi." }
  ];

  // ===== Persistence =====
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seedState();
      const parsed = JSON.parse(raw);
      // Ensure all keys present
      return {
        packages:  parsed.packages  || SEED_PACKAGES,
        areas:     parsed.areas     || SEED_AREAS,
        machines:  parsed.machines  || SEED_MACHINES,
        chemicals: parsed.chemicals || SEED_CHEMICALS,
        tools:     parsed.tools     || SEED_TOOLS,
        mappings:  parsed.mappings  || SEED_MAPPINGS
      };
    } catch (e) {
      console.warn("[HAUS Training] localStorage parse failed, using seed:", e);
      return seedState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("[HAUS Training] localStorage save failed:", e);
    }
  }

  function seedState() {
    return {
      packages:  JSON.parse(JSON.stringify(SEED_PACKAGES)),
      areas:     JSON.parse(JSON.stringify(SEED_AREAS)),
      machines:  JSON.parse(JSON.stringify(SEED_MACHINES)),
      chemicals: JSON.parse(JSON.stringify(SEED_CHEMICALS)),
      tools:     JSON.parse(JSON.stringify(SEED_TOOLS)),
      mappings:  JSON.parse(JSON.stringify(SEED_MAPPINGS))
    };
  }

  function exportJSON(state) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `haus-training-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          resolve(parsed);
        } catch (err) { reject(err); }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  global.HAUS_TRAINING = {
    STORAGE_KEY,
    loadState, saveState, seedState,
    exportJSON, importJSON
  };
})(window);
