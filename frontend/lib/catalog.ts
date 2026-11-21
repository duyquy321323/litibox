export type Style = "daily" | "party" | "soft";
export type Category = "set" | "lip" | "blush" | "eye" | "care" | "highlight";
export type Segment = "low" | "mid" | "high";
export type ColorKey = "spring_warm" | "summer_cool" | "autumn_warm" | "winter_cool";

export type Product = {
  code: string;
  slug: string;
  name: string;
  brand: string;
  segment: Segment;
  category: Category;
  styles: Style[];
  colors: ColorKey[];
  needs: string[];
  price: number;
  salePrice: number | null;
  stock: number;
  tone: string;
  short: string;
  description: string;
  details: string[];
  rating: number;
  sold: number;
  best: boolean;
  gift: boolean;
  combo: boolean;
};

export type Review = {
  name: string;
  color: ColorKey;
  rating: number;
  content: string;
};

export type Palette = {
  key: ColorKey;
  label: string;
  group: string;
  description: string;
  makeup: string;
  best: { name: string; hex: string }[];
  avoid: { name: string; hex: string }[];
};

export type QuizOption = {
  id: string;
  label: string;
  swatch: string;
  scores: Partial<Record<ColorKey, number>>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  hint?: string;
  options: QuizOption[];
};

const ALL: ColorKey[] = ["spring_warm", "summer_cool", "autumn_warm", "winter_cool"];

function item(
  code: string,
  slug: string,
  name: string,
  brand: string,
  segment: Segment,
  category: Category,
  price: number,
  salePrice: number | null,
  extra: Partial<Product> & Pick<Product, "styles" | "colors" | "needs" | "tone" | "short" | "description" | "details">,
): Product {
  return {
    code,
    slug,
    name,
    brand,
    segment,
    category,
    price,
    salePrice,
    stock: extra.stock ?? 30,
    rating: extra.rating ?? 4.8,
    sold: extra.sold ?? 320,
    best: extra.best ?? false,
    gift: extra.gift ?? false,
    combo: extra.combo ?? false,
    styles: extra.styles,
    colors: extra.colors,
    needs: extra.needs,
    tone: extra.tone,
    short: extra.short,
    description: extra.description,
    details: extra.details,
  };
}

export const PRODUCTS: Product[] = [
  item("SET-DG01", "set-daily-glow", "Set Daily Glow – 5 món cho ngày thường", "Litibox", "mid", "set", 389000, 311000, {
    styles: ["daily"], colors: ["spring_warm", "summer_cool"], needs: ["daily", "co-ban", "tiet-kiem", "set"],
    tone: "#F2A48D", best: true, rating: 4.9, sold: 1240,
    short: "Combo 5 món đủ cho lớp makeup mỗi ngày: son tint, má hồng kem, phấn mắt, kẻ mắt và gương mini.",
    description: "Set Daily Glow được Liti mix sẵn cho buổi sáng vội: chỉ 10 phút là có gương mặt tươi tắn. Toàn bộ tone màu nằm trong dải ấm – lạnh nhẹ, phù hợp Spring Warm và Summer Cool.",
    details: ["Son tint bóng 3.5g tone đào hồng", "Má hồng dạng kem 4g", "Phấn mắt 4 ô tông đất nhẹ", "Kẻ mắt nước mảnh 0.5ml", "Gương mini + hướng dẫn phối màu"],
  }),
  item("SET-PM02", "set-party-muse", "Set Party Muse – 6 món cho buổi tiệc", "Litibox", "mid", "set", 520000, 390000, {
    styles: ["party"], colors: ["winter_cool", "autumn_warm"], needs: ["party", "du-tiec", "set"],
    tone: "#8E1F3F", rating: 4.8, sold: 860,
    short: "Set tiệc 6 món với phấn mắt tông mận, son đỏ rượu và highlight bắt sáng.",
    description: "Dành cho những buổi tối cần nổi bật: tông mận – đỏ rượu tôn da Winter Cool và Autumn Warm.",
    details: ["Son kem lì đỏ rượu", "Phấn mắt 9 ô tông mận", "Eyeliner nhũ", "Má hồng tán mịn", "Highlight lỏng", "Mi giả mini"],
  }),
  item("SET-SB03", "set-soft-bloom", "Set Soft Bloom – 5 món phong cách trong trẻo", "Litibox", "mid", "set", 450000, 360000, {
    styles: ["soft", "daily"], colors: ["summer_cool", "spring_warm"], needs: ["soft", "daily", "set"],
    tone: "#F0C4D4", rating: 4.9, sold: 740,
    short: "Set mềm mại với má hồng kem, son bóng và phấn mắt pastel cho vẻ ngoài trong trẻo.",
    description: "Lớp má hồng tán loang và son bóng giúp gương mặt mềm và tươi. Hợp nhất với Summer Cool và Spring Warm.",
    details: ["Son bóng 3ml", "Má hồng kem 4g", "Phấn mắt pastel 4 ô", "Kẻ mắt nâu", "Chổi tán mini"],
  }),
  item("SET-GF04", "set-gift-signature", "Set Quà Tặng Liti Signature (kèm thiệp viết tay)", "Litibox", "mid", "set", 690000, 552000, {
    styles: ["daily", "party", "soft"], colors: ALL, needs: ["qua-tang", "gift", "thi-thiep", "set"],
    tone: "#D9A06B", stock: 15, rating: 5, sold: 410, gift: true, best: true,
    short: "Hộp quà 7 món, kèm thiệp viết tay theo yêu cầu và thẻ hướng dẫn phối màu.",
    description: "Set quà tặng cao cấp: hộp cứng, ruy băng lụa, 7 sản phẩm chọn lọc theo personal color và một tấm thiệp viết tay đúng lời nhắn bạn gửi cho người nhận.",
    details: ["Hộp quà cứng + ruy băng lụa", "7 sản phẩm chọn theo personal color", "Thiệp viết tay theo yêu cầu", "Thẻ hướng dẫn phối màu"],
  }),
  item("JD-GLG02", "judydoll-glazed-g02", "Son bóng Judydoll Glazed Lip Gloss & Matte Lip Mud G02 – Ổi hồng", "Judydoll", "mid", "lip", 129000, 103000, {
    styles: ["daily"], colors: ["spring_warm", "summer_cool"], needs: ["daily", "son-bong", "son"],
    tone: "#D9553F", stock: 0, rating: 4.7, sold: 2130, best: true,
    short: "Son bóng lai kem lì, tone ổi hồng trong trẻo, lên môi căng mọng.",
    description: "Chất son 2 lớp: lớp bóng căng mọng phủ lên lớp kem lì mịn, giữ màu 6–8 giờ.",
    details: ["Dung tích 2.5g", "Tone ổi hồng G02", "Không chì, an toàn cho môi"],
  }),
  item("RM-JLT23", "romand-juicy-tint-23", "Son tint Rom&nd Juicy Lasting Tint #23 Nucadamia", "Rom&nd", "high", "lip", 289000, 231000, {
    styles: ["daily", "soft"], colors: ["winter_cool", "autumn_warm"], needs: ["daily", "son-tint", "son"],
    tone: "#A5395B", rating: 4.8, sold: 1890, best: true,
    short: "Tint bóng lì nhẹ, tone berry trầm, giữ màu lâu và không khô môi.",
    description: "Công thức tint nước với dầu jojoba, lên màu chuẩn berry cho da lạnh.",
    details: ["Dung tích 4g", "Tone #23 Nucadamia", "Chống trôi 8 giờ"],
  }),
  item("CS-VLM02", "carslan-velvet-lip-mud-m02", "Son kem lì Carslan Velvet Lip Mud M02 – Đỏ gạch", "Carslan", "mid", "lip", 219000, 175000, {
    styles: ["party", "daily"], colors: ["autumn_warm"], needs: ["daily", "son-kem", "son"],
    tone: "#A6473A", rating: 4.6, sold: 980,
    short: "Son kem lì mịn như nhung, tone đỏ gạch tôn da ấm.",
    description: "Kết cấu kem mịn, tán đều, không lộ vân môi. Tone đỏ gạch chuẩn Autumn Warm.",
    details: ["Dung tích 3g", "Màu M02 đỏ gạch", "Lì mịn, không khô"],
  }),
  item("VC-LG03", "veecci-cream-lip-gloss-l03", "Son kem Veecci Creamy Lip Gloss L03 – Hồng tro", "Veecci", "low", "lip", 89000, 71000, {
    styles: ["soft", "daily"], colors: ["summer_cool"], needs: ["daily", "gia-re", "son-bong", "son"],
    tone: "#C97C8F", rating: 4.5, sold: 3210,
    short: "Son kem giá tốt, tone hồng tro nhẹ nhàng, phù hợp makeup đi học.",
    description: "Son kem mỏng nhẹ, che khuyết điểm môi tốt trong tầm giá sinh viên.",
    details: ["Dung tích 3g", "Màu L03 hồng tro", "Kết cấu mỏng nhẹ"],
  }),
  item("MK-BALM01", "moekiss-tint-balm", "Son dưỡng có màu Moekiss – Dưỡng ẩm 12h", "Moekiss", "low", "care", 65000, 59000, {
    styles: ["daily", "soft"], colors: ALL, needs: ["duong-moi", "gia-re"],
    tone: "#E4A79B", rating: 4.7, sold: 4210,
    short: "Son dưỡng có màu nhẹ, dưỡng ẩm suốt 12 giờ, dùng được cho mọi tone da.",
    description: "Sáp dưỡng từ bơ hạt mỡ và vitamin E, thêm chút màu hồng tự nhiên.",
    details: ["Dung tích 3.5g", "Dưỡng ẩm 12h", "Hương vanilla nhẹ"],
  }),
  item("RM-GMB06", "romand-glasting-balm-06", "Son dưỡng bóng Rom&nd Glasting Melting Balm #06", "Rom&nd", "high", "lip", 265000, 212000, {
    styles: ["soft"], colors: ["autumn_warm", "spring_warm"], needs: ["duong-moi", "son-bong", "son"],
    tone: "#B4705A", rating: 4.8, sold: 1320,
    short: "Balm bóng tan chảy, tone nâu trầm ấm, căng mọng tự nhiên.",
    description: "Chất balm tan chảy khi chạm môi, cho hiệu ứng bóng như dầu mà không dính.",
    details: ["Dung tích 3.5g", "Màu #06 Kaya Fig", "Bóng nhẹ, không dính"],
  }),
  item("VC-CB02", "veecci-cream-blush-c02", "Má hồng kem Veecci Cream Blush C02 – Hồng đào", "Veecci", "low", "blush", 95000, 76000, {
    styles: ["soft", "daily"], colors: ["summer_cool", "spring_warm"], needs: ["daily", "ma-hong-kem", "ma-hong"],
    tone: "#E59C93", rating: 4.6, sold: 2760,
    short: "Má hồng dạng kem tán mịn, lên má tự nhiên như da thật.",
    description: "Kem mềm, tán bằng đầu ngón tay, phù hợp cả môi và má.",
    details: ["Trọng lượng 4g", "Dùng được cho môi & má", "Tone C02 hồng đào"],
  }),
  item("JD-CB04", "judydoll-cream-blush-04", "Má hồng kem Judydoll Cream Blush #04 – San hô", "Judydoll", "mid", "blush", 139000, 111000, {
    styles: ["daily", "soft"], colors: ["spring_warm"], needs: ["daily", "ma-hong-kem", "ma-hong"],
    tone: "#F08A6B", rating: 4.7, sold: 1540,
    short: "Má kem tone san hô, tán mịn và giữ màu 8 giờ.",
    description: "Công thức kem chuyển phấn, giúp má hồng bám lâu mà vẫn tự nhiên.",
    details: ["Trọng lượng 3.5g", "Tone #04 san hô", "Kem chuyển phấn"],
  }),
  item("RM-BTC03", "romand-better-cheek-03", "Má hồng Rom&nd Better Than Cheek #03 – Blueberry Chip", "Rom&nd", "high", "blush", 235000, 188000, {
    styles: ["soft"], colors: ["summer_cool", "winter_cool"], needs: ["daily", "ma-hong"],
    tone: "#C9A0C0", rating: 4.9, sold: 1120,
    short: "Phấn má tone tím thanh mát, tạo hiệu ứng má ửng lạnh.",
    description: "Phấn má mịn, hạt phấn nhỏ, tán đều và không bột.",
    details: ["Trọng lượng 5g", "Tone #03 Blueberry Chip", "Hạt phấn siêu mịn"],
  }),
  item("CS-BP01", "carslan-blush-powder-a01", "Phấn má Carslan Blush Powder A01 – Đất nung", "Carslan", "mid", "blush", 175000, 140000, {
    styles: ["party"], colors: ["autumn_warm"], needs: ["daily", "ma-hong"],
    tone: "#B45F4C", rating: 4.6, sold: 610,
    short: "Phấn má tông đất nung, tán mịn cho gương mặt ấm áp.",
    description: "Sắc đỏ gạch pha nâu, phù hợp phong cách tiệc tối với da ấm.",
    details: ["Trọng lượng 5g", "Tone A01 đất nung", "Kèm cọ mini"],
  }),
  item("CL-PEP11", "clio-pro-eye-palette-11", "Phấn mắt Clio Pro Eye Palette #11 – Walking on Cosy Alley", "Clio", "high", "eye", 420000, 336000, {
    styles: ["party", "daily"], colors: ["winter_cool", "autumn_warm"], needs: ["daily", "phan-mat"],
    tone: "#6C4A4A", rating: 4.9, sold: 730, best: true,
    short: "Bảng mắt 10 ô tông trầm – nhũ mịn, dễ phối từ daily đến tiệc.",
    description: "Bảng phấn mắt 10 ô với 3 chất liệu: lì, nhũ mịn và bắt sáng.",
    details: ["10 ô màu", "3 chất liệu", "Kèm cọ 2 đầu"],
  }),
  item("CS-EYE09", "carslan-eyeshadow-9-pan", "Bảng mắt Carslan 9 ô – Tông đất ấm", "Carslan", "mid", "eye", 199000, 159000, {
    styles: ["daily", "party"], colors: ["autumn_warm"], needs: ["phan-mat"],
    tone: "#8E5A3C", rating: 4.5, sold: 880,
    short: "Bảng mắt 9 ô tông đất, hạt phấn mịn, giá tầm trung.",
    description: "Bảng mắt 9 ô dễ dùng cho người mới, phối sẵn 3 tông mắt cơ bản.",
    details: ["9 ô màu", "Hạt phấn mịn", "Hướng dẫn phối màu kèm theo"],
  }),
  item("CL-KLM", "clio-kill-lash-mascara", "Mascara Clio Kill Lash – Siêu bền nước", "Clio", "high", "eye", 285000, 228000, {
    styles: ["daily", "party"], colors: ALL, needs: ["mi", "daily"],
    tone: "#2F2F33", rating: 4.8, sold: 1420,
    short: "Mascara chống nước, giữ mi cong 12 giờ, không lem.",
    description: "Công thức chống nước và dầu, đầu cọ mảnh giúp tách mi rõ nét.",
    details: ["Dung tích 7g", "Chống nước 12h", "Đầu cọ mảnh"],
  }),
  item("JD-SEL", "judydoll-slim-eyeliner", "Kẻ mắt nước Judydoll Slim Eyeliner – Nâu đen", "Judydoll", "mid", "eye", 99000, 79000, {
    styles: ["daily", "soft"], colors: ALL, needs: ["ke-mat", "daily"],
    tone: "#4A3A32", rating: 4.7, sold: 2650,
    short: "Kẻ mắt đầu mảnh 0.01mm, chống lem, dễ vẽ cho người mới.",
    description: "Đầu bút siêu mảnh giúp kiểm soát đường kẻ, khô nhanh và bền màu.",
    details: ["0.5ml", "Đầu 0.01mm", "Chống lem"],
  }),
  item("MK-HL01", "moekiss-liquid-highlighter", "Bắt sáng lỏng Moekiss – Ánh ngọc trai", "Moekiss", "low", "highlight", 79000, 63000, {
    styles: ["daily", "party"], colors: ["spring_warm", "winter_cool"], needs: ["highlight", "gia-re"],
    tone: "#F0D6B4", rating: 4.5, sold: 1720,
    short: "Highlight lỏng ánh ngọc trai, tán đều trên gò má và sống mũi.",
    description: "Hạt nhũ siêu mịn, tạo hiệu ứng ướt tự nhiên.",
    details: ["15ml", "Ánh ngọc trai", "Dùng cho mặt & vai"],
  }),
  item("CL-PRM", "clio-prism-highlighter", "Bắt sáng Clio Prism Highlighter #02 – Gold Sheer", "Clio", "high", "highlight", 315000, 252000, {
    styles: ["party"], colors: ["summer_cool", "spring_warm"], needs: ["highlight"],
    tone: "#E9C9A8", rating: 4.8, sold: 520,
    short: "Phấn bắt sáng nhũ vàng nhẹ, tạo hiệu ứng da căng bóng.",
    description: "Phấn nén mịn, nhũ vàng sheer, không lộ lỗ chân lông.",
    details: ["Trọng lượng 6g", "Tone Gold Sheer", "Nhũ siêu mịn"],
  }),
  item("SET-LF05", "combo-trend-lip-focus", "Combo Trend: Lip Focus – 3 món son hot trend", "Litibox", "mid", "set", 350000, 280000, {
    styles: ["daily", "party"], colors: ["spring_warm", "winter_cool"], needs: ["trend", "combo", "tiet-kiem", "set", "son"],
    tone: "#D2455A", rating: 4.7, sold: 930, combo: true,
    short: "Combo 3 món son đang trend: 1 tint bóng, 1 kem lì, 1 dưỡng có màu.",
    description: "Bộ ba son được Liti chọn theo bảng màu đang lên, tiết kiệm 20% so với mua lẻ.",
    details: ["Son tint bóng", "Son kem lì mini", "Son dưỡng có màu", "Túi đựng mini"],
  }),
  item("SET-SV06", "combo-tiet-kiem-3-mon", "Combo Tiết kiệm: 3 món must-have", "Litibox", "mid", "set", 299000, 239000, {
    styles: ["daily"], colors: ALL, needs: ["combo", "tiet-kiem", "daily", "set"],
    tone: "#E0A38F", rating: 4.8, sold: 1450, combo: true,
    short: "3 món must-have: má hồng kem, kẻ mắt và mascara – tiết kiệm 60k.",
    description: "Bộ 3 món cơ bản ai cũng cần, chọn được tone theo personal color khi đặt hàng.",
    details: ["Má hồng kem", "Kẻ mắt nước", "Mascara mini"],
  }),
];

export const REVIEWS: Review[] = [
  { name: "Minh Thư", color: "spring_warm", rating: 5, content: "Set Daily Glow đúng tone da mình luôn, son lên màu y hình. Đóng gói xinh, có thiệp viết tay nữa!" },
  { name: "Hà Linh", color: "summer_cool", rating: 5, content: "Mình test personal color trên web ra Summer Cool, được gợi ý đúng set Soft Bloom." },
  { name: "Ngọc Anh", color: "winter_cool", rating: 4, content: "Set Party Muse hợp đi tiệc, chỉ tiếc tone mận hơi trầm với mình. Nhân viên tư vấn đổi tone nhanh." },
  { name: "Trâm Anh", color: "autumn_warm", rating: 5, content: "Đặt set quà tặng cho mẹ, thiệp viết tay đẹp hơn mong đợi. Sẽ ủng hộ Liti dài dài." },
  { name: "Bảo Yến", color: "spring_warm", rating: 5, content: "Trợ lý AI tìm giúp mình set dưới 400k cho da ấm, đúng nhu cầu trong một nốt nhạc." },
  { name: "Khánh Vy", color: "summer_cool", rating: 4, content: "Giao hàng nhanh, freeship từ 389k nên mình gom đơn luôn. Mascara Clio không lem thật sự." },
];

export const PALETTES: Palette[] = [
  {
    key: "spring_warm",
    label: "Spring Warm",
    group: "Nhóm màu ấm – tươi sáng",
    description: "Da ấm, tươi sáng. Hợp tông cam đào, san hô, vàng mật ong và các màu trong trẻo.",
    makeup: "Son đào hoặc san hô, má hồng kem ấm, phấn mắt vàng đồng nhạt. Tránh đỏ rượu và xám bạc.",
    best: [
      { name: "Peach", hex: "#FFB7A5" },
      { name: "Coral", hex: "#FF7F5F" },
      { name: "Golden", hex: "#F2C14E" },
      { name: "Cream", hex: "#FBEAD9" },
    ],
    avoid: [
      { name: "Deep Navy", hex: "#23395B" },
      { name: "Icy Silver", hex: "#C7D0DA" },
    ],
  },
  {
    key: "summer_cool",
    label: "Summer Cool",
    group: "Nhóm màu lạnh – dịu nhẹ",
    description: "Da lạnh, dịu nhẹ. Hợp hồng tro, tím lilac, xanh phấn và các gam pastel.",
    makeup: "Son hồng tro, má kem hồng phấn, phấn mắt lilac. Tránh cam cháy và vàng mù tạt.",
    best: [
      { name: "Rose", hex: "#F3B7C6" },
      { name: "Lilac", hex: "#C4A7D9" },
      { name: "Powder", hex: "#A9C8E8" },
      { name: "Mauve", hex: "#D9BCD1" },
    ],
    avoid: [
      { name: "Orange", hex: "#FF7A2F" },
      { name: "Mustard", hex: "#D4A017" },
    ],
  },
  {
    key: "autumn_warm",
    label: "Autumn Warm",
    group: "Nhóm màu ấm – trầm ấm",
    description: "Da ấm, trầm. Hợp đỏ gạch, nâu camel, olive và các tông đất.",
    makeup: "Son đỏ gạch, má đất nung, phấn mắt nâu ấm. Tránh hồng fuchsia và xanh băng.",
    best: [
      { name: "Terracotta", hex: "#C86B4A" },
      { name: "Camel", hex: "#A9815A" },
      { name: "Olive", hex: "#8A8B4B" },
      { name: "Brick", hex: "#9E3B32" },
    ],
    avoid: [
      { name: "Fuchsia", hex: "#E0218A" },
      { name: "Ice Blue", hex: "#BFE3F0" },
    ],
  },
  {
    key: "winter_cool",
    label: "Winter Cool",
    group: "Nhóm màu lạnh – tương phản cao",
    description: "Da lạnh, tương phản cao. Hợp berry, đỏ tươi, navy và tím mận.",
    makeup: "Son berry hoặc đỏ rượu, má tím thanh, phấn mắt khói. Tránh đào nhạt và be.",
    best: [
      { name: "Berry", hex: "#A31D4E" },
      { name: "True Red", hex: "#D21F3C" },
      { name: "Navy", hex: "#2E4057" },
      { name: "Plum", hex: "#6C2C67" },
    ],
    avoid: [
      { name: "Peach", hex: "#FFB08A" },
      { name: "Beige", hex: "#E6D3B3" },
    ],
  },
];

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "undertone",
    question: "Màu nền da của bạn nghiêng về?",
    hint: "Nhìn vào gân tay dưới ánh sáng tự nhiên",
    options: [
      { id: "warm", label: "Vàng ấm / gân tay xanh lá", swatch: "#E8B26A", scores: { spring_warm: 2, autumn_warm: 2 } },
      { id: "cool", label: "Hồng lạnh / gân tay xanh tím", swatch: "#D08C9B", scores: { summer_cool: 2, winter_cool: 2 } },
      { id: "neutral", label: "Trung tính, khó phân biệt", swatch: "#D8BFA8", scores: { spring_warm: 1, summer_cool: 1, autumn_warm: 1, winter_cool: 1 } },
    ],
  },
  {
    id: "contrast",
    question: "Độ tương phản giữa da – tóc – mắt của bạn?",
    options: [
      { id: "high", label: "Rất tương phản (da sáng, tóc/mắt đen)", swatch: "#2B2B2B", scores: { winter_cool: 3 } },
      { id: "medium", label: "Tương phản vừa", swatch: "#8C6A4F", scores: { autumn_warm: 2, summer_cool: 1 } },
      { id: "low", label: "Mềm, ít tương phản", swatch: "#E3C9B6", scores: { spring_warm: 2, summer_cool: 2 } },
    ],
  },
  {
    id: "jewelry",
    question: "Trang sức nào làm da bạn sáng nhất?",
    options: [
      { id: "gold", label: "Vàng / vàng hồng", swatch: "#E5B556", scores: { spring_warm: 2, autumn_warm: 2 } },
      { id: "silver", label: "Bạc / bạch kim", swatch: "#C9CFD6", scores: { summer_cool: 2, winter_cool: 2 } },
      { id: "both", label: "Cả hai đều hợp", swatch: "#D9C2A1", scores: { spring_warm: 1, summer_cool: 1, autumn_warm: 1, winter_cool: 1 } },
    ],
  },
  {
    id: "lip_tone",
    question: "Tông son khiến bạn tự tin nhất?",
    options: [
      { id: "peach", label: "Cam đào, san hô", swatch: "#F07A5A", scores: { spring_warm: 3 } },
      { id: "rosy", label: "Hồng tro, hồng phấn", swatch: "#E39AA8", scores: { summer_cool: 3 } },
      { id: "brick", label: "Đỏ gạch, nâu đất", swatch: "#A5473B", scores: { autumn_warm: 3 } },
      { id: "berry", label: "Berry, đỏ rượu", swatch: "#8E1F3F", scores: { winter_cool: 3 } },
    ],
  },
  {
    id: "white_shirt",
    question: "Chiếc áo trắng nào bạn mặc đẹp nhất?",
    options: [
      { id: "ivory", label: "Trắng ngà, trắng kem", swatch: "#FBEFD9", scores: { spring_warm: 2, autumn_warm: 1 } },
      { id: "pure", label: "Trắng tinh, sắc nét", swatch: "#FFFFFF", scores: { winter_cool: 2 } },
      { id: "coolgrey", label: "Trắng xám, trắng tro", swatch: "#E7E9EC", scores: { summer_cool: 2 } },
    ],
  },
  {
    id: "hair",
    question: "Màu tóc nhuộm hợp với bạn?",
    options: [
      { id: "honey", label: "Nâu mật ong, nâu vàng", swatch: "#B0763C", scores: { spring_warm: 2, autumn_warm: 1 } },
      { id: "ash", label: "Nâu lạnh, ash grey", swatch: "#8B8C90", scores: { summer_cool: 2, winter_cool: 1 } },
      { id: "redbrown", label: "Nâu đỏ, đỏ rượu", swatch: "#7C3B2E", scores: { autumn_warm: 2, winter_cool: 1 } },
      { id: "black", label: "Đen tự nhiên", swatch: "#1E1E1E", scores: { winter_cool: 2 } },
    ],
  },
  {
    id: "sun",
    question: "Khi ra nắng, da bạn thế nào?",
    options: [
      { id: "burn", label: "Dễ cháy nắng, đỏ rồi bong tróc", swatch: "#E8A198", scores: { summer_cool: 1, winter_cool: 2 } },
      { id: "tan", label: "Rám nắng nhanh thành màu mật ong", swatch: "#C48A55", scores: { spring_warm: 1, autumn_warm: 2 } },
      { id: "rarely", label: "Hầu như không đổi màu", swatch: "#D9BE9E", scores: { spring_warm: 1, summer_cool: 1 } },
    ],
  },
  {
    id: "style",
    question: "Phong cách makeup bạn thích nhất?",
    options: [
      { id: "fresh", label: "Tươi sáng, căng tràn sức sống", swatch: "#FF9E7A", scores: { spring_warm: 3 } },
      { id: "soft", label: "Mềm mại, trong trẻo", swatch: "#F0C4D4", scores: { summer_cool: 3 } },
      { id: "warm", label: "Trầm ấm, sang trọng", swatch: "#9C6B4E", scores: { autumn_warm: 3 } },
      { id: "sharp", label: "Sắc nét, cá tính", swatch: "#9E1B32", scores: { winter_cool: 3 } },
    ],
  },
];

export const COLOR_ORDER: ColorKey[] = ALL;

export const STYLE_LABEL: Record<Style, string> = {
  daily: "Daily",
  party: "Tiệc",
  soft: "Soft",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  set: "Set makeup",
  lip: "Son môi",
  blush: "Má hồng",
  eye: "Mắt",
  care: "Dưỡng",
  highlight: "Bắt sáng",
};

export const SEGMENT_LABEL: Record<Segment, string> = {
  low: "Phân khúc phổ thông",
  mid: "Phân khúc trung bình",
  high: "Phân khúc cao cấp",
};

export const ORDER_STATUS = [
  { id: "pending", label: "Chờ xác nhận" },
  { id: "packing", label: "Đang đóng gói" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "returned", label: "Đổi trả" },
  { id: "cancelled", label: "Đã huỷ" },
] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number]["id"];

export const SET_GROUPS = [
  { slug: "daily", label: "Set Daily", hint: "Đi làm, đi học, mỗi ngày" },
  { slug: "party", label: "Set Tiệc", hint: "Buổi tối cần nổi bật" },
  { slug: "soft", label: "Set Soft", hint: "Trong trẻo, nhẹ nhàng" },
] as const;

export const FREE_SHIP = 389000;
export const SHIP_FEE = 30000;

export function paletteOf(key: ColorKey | null | undefined) {
  return PALETTES.find((item) => item.key === key) ?? null;
}

export function colorLabel(key: ColorKey | null | undefined) {
  return paletteOf(key)?.label ?? "Chưa rõ";
}

export function priceOf(product: Product) {
  return product.salePrice ?? product.price;
}

export function discountOf(product: Product) {
  if (!product.salePrice || product.salePrice >= product.price) return 0;
  return Math.round((1 - product.salePrice / product.price) * 100);
}

export function savedOf(product: Product) {
  return Math.max(product.price - priceOf(product), 0);
}

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
}

export function productBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug) ?? null;
}

export function bestSellers() {
  return PRODUCTS.filter((product) => product.best && product.category === "set");
}

export function deals() {
  return [...PRODUCTS].filter((product) => discountOf(product) > 0).sort((a, b) => discountOf(b) - discountOf(a));
}

export function forColor(color: ColorKey) {
  return PRODUCTS.filter((product) => product.colors.includes(color) && product.stock > 0);
}

export function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

const STOP = new Set([
  "cho", "toi", "minh", "cua", "va", "theo", "phu", "hop", "mot", "cai", "giup", "tim", "san", "pham",
  "makeup", "my", "set", "voi", "nhe", "nha", "ban", "oi", "lam", "on", "muon", "can", "duoc", "cac",
  "nhung", "nay", "kia", "la", "co", "khong", "nao", "gi", "de", "tren", "duoi",
]);

export function searchProducts(query: string) {
  const tokens = fold(query)
    .split(/[^a-z0-9&]+/)
    .filter((token) => token.length > 1 && !STOP.has(token));
  if (!tokens.length) return PRODUCTS;
  return PRODUCTS.filter((product) => {
    const blob = fold(
      [
        product.name,
        product.brand,
        product.code,
        product.category,
        product.short,
        product.description,
        ...product.styles,
        ...product.colors.map((color) => colorLabel(color)),
        ...product.needs,
        product.gift ? "qua tang thiep" : "",
        product.combo ? "combo trend tiet kiem" : "",
      ].join(" "),
    );
    return tokens.every((token) => blob.includes(token));
  });
}

export function scoreAnswers(answers: Record<string, string>) {
  const scores: Record<ColorKey, number> = {
    spring_warm: 0,
    summer_cool: 0,
    autumn_warm: 0,
    winter_cool: 0,
  };
  for (const question of QUESTIONS) {
    const option = question.options.find((item) => item.id === answers[question.id]);
    if (!option) continue;
    for (const key of COLOR_ORDER) {
      scores[key] += option.scores[key] ?? 0;
    }
  }
  return scores;
}

export function resolveColor(scores: Record<ColorKey, number>): ColorKey {
  return [...COLOR_ORDER].sort((a, b) => scores[b] - scores[a] || COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b))[0];
}

export function voucherFor(subtotal: number) {
  if (subtotal >= 500000) {
    return { code: "LITI20", label: "Giảm 20% đơn từ 500k", discount: Math.round(subtotal * 0.2), ship: 0 };
  }
  if (subtotal >= FREE_SHIP) {
    return { code: "FREESHIP389", label: "Freeship đơn từ 389k", discount: 0, ship: 0 };
  }
  if (subtotal >= 200000) {
    return { code: "LITI10", label: "Giảm 10% đơn từ 200k", discount: Math.round(subtotal * 0.1), ship: SHIP_FEE };
  }
  return { code: null as string | null, label: "Chưa đủ điều kiện mã giảm", discount: 0, ship: SHIP_FEE };
}

export function infoPages() {
  return [
    { slug: "doi-tra", title: "Chính sách đổi trả", body: "Đổi size hoặc tone trong 7 ngày nếu sản phẩm còn nguyên seal. Set quà đã viết thiệp đổi khi chưa khui hộp. Hoàn tiền trong 3–5 ngày làm việc." },
    { slug: "bao-mat", title: "Bảo mật", body: "Litibox chỉ dùng tên, số điện thoại, địa chỉ và hồ sơ màu để giao hàng và gợi ý set. Không bán dữ liệu. Bạn có thể xoá hồ sơ ngay trên trang Tài khoản." },
    { slug: "thanh-toan", title: "Thanh toán", body: "Nhận hàng trả tiền (COD), chuyển khoản Vietcombank, Techcombank, MoMo. Đơn từ 389k được freeship nội thành." },
    { slug: "dieu-khoan", title: "Điều khoản dịch vụ", body: "Giá hiển thị đã gồm VAT. Tồn kho cập nhật theo thời gian thực. Ảnh minh hoạ tone màu, màu thực tế có thể lệch nhẹ dưới ánh sáng khác nhau." },
    { slug: "huong-dan", title: "Hướng dẫn mua hàng", body: "Chọn set hoặc nhờ trợ lý Liti phối hộ. Thêm vào giỏ, ghi lời nhắn thiệp nếu là set quà, rồi đặt hàng. Tra cứu mã đơn ở mục Tra cứu đơn hàng." },
    { slug: "gioi-thieu", title: "Về Litibox", body: "Chúng tôi là Litibox — cửa hàng set makeup phối sẵn theo personal color. Mỗi hộp là một bảng màu cho làn da của bạn: son, má, mắt, bắt sáng. Không kem nền." },
    { slug: "lien-he", title: "Liên hệ góp ý", body: "Góp ý và khiếu nại: 1900 6868 hoặc hello@litibox.vn. Giờ làm việc 9:00–21:00 mỗi ngày, kể cả cuối tuần." },
    { slug: "hop-tac", title: "Liên hệ hợp tác", body: "Hợp tác phân phối, KOL và set quà doanh nghiệp: hop-tac@litibox.vn. Chúng tôi nhận mix set theo personal color cho sự kiện." },
  ];
}
