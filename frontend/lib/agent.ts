import {
  type ColorKey,
  type Product,
  type Style,
  PRODUCTS,
  colorLabel,
  discountOf,
  fold,
  formatVnd,
  paletteOf,
  priceOf,
  savedOf,
  voucherFor,
} from "@/lib/catalog";

export type QuickReply = { label: string; message: string };

export type AgentAction = {
  type: "open-test" | "save-note" | "add" | "skip-tone" | "swap";
  label: string;
  slug?: string;
  note?: string;
};

export type AgentPending = {
  mode: "discover" | "note" | "tone";
  color: ColorKey | null;
  budgetMax: number | null;
  budgetMin: number | null;
  budgetReady: boolean;
  style: Style | "all" | null;
  kinds: Kind[];
  wantsSet: boolean;
  toneSlug?: string;
};

export type AgentTurn = {
  reply: string;
  products: Product[];
  quickReplies: QuickReply[];
  actions: AgentAction[];
  pending: AgentPending | null;
  voucher: string | null;
};

type Kind = "set" | "lip-gloss" | "lip" | "blush-cream" | "blush" | "eye" | "highlight";

const BUDGET_REPLIES: QuickReply[] = [
  { label: "Dưới 150k", message: "Ngân sách dưới 150k" },
  { label: "150–400k", message: "Ngân sách từ 150 đến 400k" },
  { label: "Trên 400k", message: "Ngân sách trên 400k" },
  { label: "Mọi tầm giá", message: "Mọi tầm giá" },
];

const STYLE_REPLIES: QuickReply[] = [
  { label: "Daily", message: "Phong cách Daily" },
  { label: "Tiệc", message: "Phong cách tiệc" },
  { label: "Soft", message: "Phong cách Soft" },
  { label: "Tất cả", message: "Tất cả phong cách" },
];

const COLOR_WORDS: { key: ColorKey; words: string[] }[] = [
  { key: "spring_warm", words: ["spring warm", "spring", "xuan am", "am tuoi"] },
  { key: "summer_cool", words: ["summer cool", "summer", "ha lanh", "lanh diu"] },
  { key: "autumn_warm", words: ["autumn warm", "autumn", "thu am", "am tram"] },
  { key: "winter_cool", words: ["winter cool", "winter", "dong lanh", "tuong phan"] },
];

function emptyPending(color: ColorKey | null): AgentPending {
  return { mode: "discover", color, budgetMax: null, budgetMin: null, budgetReady: false, style: null, kinds: [], wantsSet: false };
}

function parseBudget(text: string) {
  const folded = fold(text);
  if (folded.includes("moi tam gia") || folded.includes("tat ca gia")) {
    return { budgetMax: null, budgetMin: null, seen: true };
  }
  const under = folded.match(/duoi\s*(\d+)\s*k?/) ?? folded.match(/(\d+)\s*k/);
  if (folded.includes("duoi") && under) {
    const amount = Number(under[1]) < 10000 ? Number(under[1]) * 1000 : Number(under[1]);
    return { budgetMax: amount, budgetMin: null, seen: true };
  }
  if (folded.includes("tren") && under) {
    const amount = Number(under[1]) < 10000 ? Number(under[1]) * 1000 : Number(under[1]);
    return { budgetMax: null, budgetMin: amount, seen: true };
  }
  const range = folded.match(/(\d+)\s*(?:den|-)\s*(\d+)/);
  if (range) {
    const min = Number(range[1]) < 10000 ? Number(range[1]) * 1000 : Number(range[1]);
    const max = Number(range[2]) < 10000 ? Number(range[2]) * 1000 : Number(range[2]);
    return { budgetMax: max, budgetMin: min, seen: true };
  }
  if (folded.includes("150") && folded.includes("400")) {
    return { budgetMax: 400000, budgetMin: 150000, seen: true };
  }
  return { budgetMax: null, budgetMin: null, seen: false };
}

function parseStyle(text: string): { style: Style | "all" | null; seen: boolean } {
  const folded = fold(text);
  if (folded.includes("tat ca phong cach") || folded.includes("moi phong cach") || folded.includes("tat ca style")) {
    return { style: "all", seen: true };
  }
  if (folded.includes("daily") || folded.includes("di lam") || folded.includes("di hoc") || folded.includes("ngay thuong")) {
    return { style: "daily", seen: true };
  }
  if (folded.includes("tiec") || folded.includes("party") || folded.includes("du tiec")) {
    return { style: "party", seen: true };
  }
  if (folded.includes("soft") || folded.includes("trong treo") || folded.includes("nhe nhang")) {
    return { style: "soft", seen: true };
  }
  return { style: null, seen: false };
}

function parseColor(text: string): ColorKey | null {
  const folded = fold(text);
  for (const entry of COLOR_WORDS) {
    if (entry.words.some((word) => folded.includes(word))) return entry.key;
  }
  return null;
}

function parseKinds(text: string): Kind[] {
  const folded = fold(text);
  const kinds: Kind[] = [];
  if (folded.includes("ma hong") && folded.includes("kem")) kinds.push("blush-cream");
  else if (folded.includes("ma hong") || folded.includes("phan ma")) kinds.push("blush");
  if (folded.includes("son bong") || folded.includes("lip gloss") || folded.includes("glazed")) kinds.push("lip-gloss");
  else if (folded.includes("son") || folded.includes("lip")) kinds.push("lip");
  if (folded.includes("phan mat") || folded.includes("eyeshadow") || folded.includes("mascara") || folded.includes("ke mat")) {
    kinds.push("eye");
  }
  if (folded.includes("bat sang") || folded.includes("highlight")) kinds.push("highlight");
  if (folded.includes("set") || folded.includes("combo")) kinds.push("set");
  return kinds;
}

function matchKind(product: Product, kind: Kind) {
  if (kind === "set") return product.category === "set";
  if (kind === "lip-gloss") return product.needs.includes("son-bong") || fold(product.name).includes("bong");
  if (kind === "lip") return product.category === "lip" || product.category === "care";
  if (kind === "blush-cream") return product.needs.includes("ma-hong-kem");
  if (kind === "blush") return product.category === "blush";
  if (kind === "eye") return product.category === "eye";
  return product.category === "highlight";
}

function inBudget(product: Product, pending: AgentPending) {
  const price = priceOf(product);
  if (pending.budgetMax != null && price > pending.budgetMax) return false;
  if (pending.budgetMin != null && price < pending.budgetMin) return false;
  return true;
}

function toneDistance(a: string, b: string) {
  const parse = (hex: string) => {
    const value = hex.replace("#", "");
    return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16));
  };
  const left = parse(a);
  const right = parse(b);
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

function alternativeFor(product: Product, color: ColorKey | null) {
  return PRODUCTS.filter((item) => item.slug !== product.slug && item.stock > 0 && item.category === product.category)
    .sort((a, b) => {
      const colorScore = (item: Product) => (color && item.colors.includes(color) ? 0 : 1);
      return colorScore(a) - colorScore(b) || toneDistance(a.tone, product.tone) - toneDistance(b.tone, product.tone);
    })[0];
}

function namedProduct(text: string) {
  const folded = fold(text);
  return PRODUCTS.find((product) => {
    const name = fold(product.name);
    const code = fold(product.code);
    return folded.includes(code) || folded.includes(fold(product.slug).replace(/-/g, " ")) || name.split(" ").filter((word) => word.length > 3).filter((word) => folded.includes(word)).length >= 3;
  });
}

function missingThing(text: string) {
  const folded = fold(text);
  if (/(kem nen|cushion|foundation|phan phu|serum|nuoc hoa)/.test(folded)) {
    const label = folded.includes("kem nen") || folded.includes("foundation") || folded.includes("cushion")
      ? "kem nền"
      : "dòng sản phẩm này";
    return label;
  }
  return null;
}

function extractNote(text: string) {
  const match = text.match(/(?:lời nhắn|loi nhan|thiệp|thiep|thư tay|thu tay)\s*[:：-]?\s*(.+)/i);
  if (match?.[1] && match[1].trim().length > 1) return match[1].trim();
  return null;
}

function priceLine(product: Product) {
  const sale = formatVnd(priceOf(product));
  const off = discountOf(product);
  const save = savedOf(product);
  if (!off) return `${product.name} — ${sale}`;
  return `${product.name} — ${sale} (giá gốc ${formatVnd(product.price)}, tiết kiệm ${formatVnd(save)}, -${off}%)`;
}

function pickProducts(pending: AgentPending) {
  const pool = PRODUCTS.filter((product) => {
    if (pending.color && !product.colors.includes(pending.color)) return false;
    if (pending.style && pending.style !== "all" && !product.styles.includes(pending.style)) return false;
    if (!inBudget(product, pending)) return false;
    if (pending.kinds.length && !pending.kinds.some((kind) => matchKind(product, kind))) return false;
    if (!pending.kinds.length && pending.wantsSet && product.category !== "set") return false;
    return true;
  });
  const inStock = pool.filter((product) => product.stock > 0);
  const ranked = [...inStock].sort((a, b) => Number(b.best) - Number(a.best) || b.sold - a.sold);
  const chosen: Product[] = [];
  if (pending.kinds.length > 1) {
    for (const kind of pending.kinds) {
      const hit = ranked.find((product) => matchKind(product, kind) && !chosen.includes(product));
      if (hit) chosen.push(hit);
    }
  }
  for (const product of ranked) {
    if (chosen.length >= 4) break;
    if (!chosen.includes(product)) chosen.push(product);
  }
  const combos = PRODUCTS.filter((product) => product.combo && product.stock > 0 && (!pending.color || product.colors.includes(pending.color)));
  for (const combo of combos) {
    if (!chosen.includes(combo) && chosen.length < 6) chosen.push(combo);
  }
  return { chosen, soldOut: pool.filter((product) => product.stock <= 0) };
}

function describeBundle(products: Product[]) {
  if (!products.length) return { text: "", voucher: null as string | null };
  const focus = products.filter((product) => !product.combo).slice(0, 3);
  const subtotal = focus.reduce((sum, product) => sum + priceOf(product), 0);
  const deal = voucherFor(subtotal);
  const lines = focus.map((product) => `• ${priceLine(product)}`);
  let extra = `Tạm tính các món trên: ${formatVnd(subtotal)}.`;
  if (deal.code === "LITI20") {
    extra += ` Mình tự áp ${deal.code}: còn ${formatVnd(subtotal - deal.discount)} và freeship.`;
  } else if (deal.code === "FREESHIP389") {
    extra += " Đơn đã chạm mốc freeship 389k, phí ship 0đ.";
  } else if (deal.code === "LITI10") {
    extra += ` Mình áp ${deal.code}, giảm ${formatVnd(deal.discount)}. Còn thiếu ${formatVnd(389000 - subtotal)} để freeship.`;
  } else {
    extra += ` Còn thiếu ${formatVnd(389000 - subtotal)} để được freeship.`;
  }
  const combo = products.find((product) => product.combo);
  if (combo) extra += ` Combo gợi ý thêm: ${combo.name} (${formatVnd(priceOf(combo))}).`;
  return { text: `${lines.join("\n")}\n${extra}`, voucher: deal.code };
}

export function runAgent(message: string, profileColor: ColorKey | null, pending: AgentPending | null): AgentTurn {
  const text = message.trim();
  const folded = fold(text);
  const state: AgentPending = pending ? { ...pending, kinds: [...pending.kinds] } : emptyPending(profileColor);

  if (state.mode === "note") {
    const note = extractNote(text) ?? text;
    const gift = PRODUCTS.find((product) => product.gift);
    return {
      reply: gift
        ? `Mình đã lưu lời nhắn vào ghi chú của ${gift.name}: “${note}”. Thiệp viết tay sẽ theo đúng câu này khi đóng gói.`
        : `Mình ghi lại lời nhắn: “${note}”.`,
      products: gift ? [gift] : [],
      quickReplies: [],
      actions: gift ? [{ type: "save-note", label: "Xem trong giỏ", slug: gift.slug, note }] : [],
      pending: null,
      voucher: null,
    };
  }

  if (state.mode === "tone" && state.toneSlug) {
    const product = PRODUCTS.find((item) => item.slug === state.toneSlug);
    if (folded.includes("bo qua")) {
      return {
        reply: product
          ? `Mình giữ ${product.name} theo lựa chọn của bạn. Tone này chưa tối ưu cho ${colorLabel(state.color)}, bạn vẫn thêm vào giỏ được.`
          : "Mình giữ sản phẩm bạn chọn.",
        products: product ? [product] : [],
        quickReplies: [],
        actions: product ? [{ type: "add", label: "Thêm vào giỏ", slug: product.slug }] : [],
        pending: null,
        voucher: null,
      };
    }
    if (folded.includes("doi san pham") || folded.includes("doi mau")) {
      const alt = product ? alternativeFor(product, state.color) : undefined;
      return {
        reply: alt
          ? `Mình đổi sang ${alt.name}, sát tone hơn cho ${colorLabel(state.color)}.`
          : "Mình chưa thấy món thay thế sát tone hơn.",
        products: alt ? [alt] : [],
        quickReplies: [],
        actions: alt ? [{ type: "add", label: "Thêm món thay thế", slug: alt.slug }] : [],
        pending: null,
        voucher: null,
      };
    }
  }

  if (/(chua biet|khong biet).*(mau|tone)|thuoc mau nao|test personal|bai test/.test(folded) && !parseColor(text)) {
    return {
      reply: "Bạn chưa có personal color trong hồ sơ. Làm bài test 8 câu (khoảng 1 phút) hoặc tự điền trong mục Tài khoản. Mình vẫn lọc được theo giá và phong cách nếu bạn muốn xem trước.",
      products: [],
      quickReplies: [
        { label: "Làm bài test", message: "Mở bài test personal color" },
        ...BUDGET_REPLIES.slice(0, 2),
      ],
      actions: [{ type: "open-test", label: "Mở bài test" }],
      pending: emptyPending(null),
      voucher: null,
    };
  }

  if (folded.includes("mo bai test")) {
    return {
      reply: "Mình mở bài test personal color cho bạn. Kết quả mới sẽ được lưu, kết quả cũ vẫn còn trong hồ sơ.",
      products: [],
      quickReplies: [],
      actions: [{ type: "open-test", label: "Làm bài test" }],
      pending: null,
      voucher: null,
    };
  }

  const note = extractNote(text);
  if (note && (folded.includes("qua") || folded.includes("thiep") || folded.includes("nhan"))) {
    const gift = PRODUCTS.find((product) => product.gift)!;
    return {
      reply: `Set quà tặng kèm thiệp viết tay. Mình lưu câu “${note}” vào ghi chú của ${gift.name}.`,
      products: [gift],
      quickReplies: [],
      actions: [{ type: "save-note", label: "Lưu thiệp vào giỏ", slug: gift.slug, note }],
      pending: null,
      voucher: "FREESHIP389",
    };
  }

  if (/(qua tang|set qua|thiep|thu tay)/.test(folded) && !note) {
    const gift = PRODUCTS.find((product) => product.gift)!;
    return {
      reply: `${gift.name} có thiệp viết tay theo yêu cầu. Bạn gửi mình câu muốn viết (bắt đầu bằng “Lời nhắn:”) hoặc tự ghi vào ô ghi chú khi đặt hàng. Kèm theo là thẻ hướng dẫn phối màu.`,
      products: [gift],
      quickReplies: [{ label: "Gửi lời nhắn mẫu", message: "Lời nhắn: Chúc bạn luôn rạng rỡ như mùa của mình." }],
      actions: [],
      pending: { ...emptyPending(profileColor), mode: "note" },
      voucher: null,
    };
  }

  const absent = missingThing(text);
  if (absent) {
    const color = parseColor(text) ?? profileColor;
    const similar = PRODUCTS.find((product) => product.stock > 0 && product.category === "lip" && (!color || product.colors.includes(color)));
    return {
      reply: `Xin lỗi bạn, hiện tại Litibox chưa nhập ${absent} này. Bạn có thể tham khảo ${similar ? similar.name : "các set son – má"} bên mình nhé! Litibox không bán kem nền.`,
      products: similar ? [similar] : [],
      quickReplies: STYLE_REPLIES,
      actions: [],
      pending: null,
      voucher: null,
    };
  }

  const mentioned = namedProduct(text);
  if (mentioned && mentioned.stock <= 0) {
    const color = parseColor(text) ?? profileColor ?? mentioned.colors[0];
    const alt = alternativeFor(mentioned, color);
    return {
      reply: `Rất tiếc, mã ${mentioned.code} ${mentioned.name} chuẩn tone ${colorLabel(color)} hiện vừa hết hàng tại kho${alt ? `, bạn có thể tham khảo ${alt.code} ${alt.name}` : ""}.`,
      products: alt ? [alt] : [],
      quickReplies: [],
      actions: alt ? [{ type: "add", label: "Xem món thay thế", slug: alt.slug }] : [],
      pending: null,
      voucher: null,
    };
  }

  const askedSwap = /(doi|thay|mix|tron)/.test(folded) && /(son|ma|phan|set|mau)/.test(folded);
  if (mentioned && askedSwap) {
    const color = parseColor(text) ?? profileColor;
    if (color && !mentioned.colors.includes(color)) {
      const palette = paletteOf(color);
      return {
        reply: `Chưa tối ưu cho ${palette?.label ?? "personal color của bạn"}. ${mentioned.name} lệch khỏi nhóm ${palette?.group ?? ""}. Bạn muốn đổi món khác hay vẫn giữ?`,
        products: [mentioned],
        quickReplies: [
          { label: "Đổi sản phẩm khác", message: "Đổi sản phẩm khác" },
          { label: "Bỏ qua", message: "Bỏ qua cảnh báo lệch tone" },
        ],
        actions: [
          { type: "swap", label: "Đổi sản phẩm khác", slug: mentioned.slug },
          { type: "skip-tone", label: "Bỏ qua", slug: mentioned.slug },
        ],
        pending: { ...emptyPending(color), mode: "tone", toneSlug: mentioned.slug },
        voucher: null,
      };
    }
    if (mentioned) {
      return {
        reply: `Mình mix lại với ${mentioned.name}. Tone này nằm trong bảng ${color ? colorLabel(color) : "màu bạn đang xem"}.`,
        products: [mentioned, ...PRODUCTS.filter((product) => product.category === "set" && product.stock > 0).slice(0, 1)],
        quickReplies: [],
        actions: [{ type: "add", label: "Thêm món vừa mix", slug: mentioned.slug }],
        pending: null,
        voucher: null,
      };
    }
  }

  if (mentioned && folded.length < 80 && !parseKinds(text).includes("set")) {
    const color = profileColor;
    const off = color && !mentioned.colors.includes(color);
    if (off) {
      return {
        reply: `Chưa tối ưu cho ${colorLabel(color)}. ${mentioned.name} không nằm trong bảng màu này.`,
        products: [mentioned],
        quickReplies: [
          { label: "Đổi sản phẩm khác", message: "Đổi sản phẩm khác" },
          { label: "Bỏ qua", message: "Bỏ qua cảnh báo lệch tone" },
        ],
        actions: [],
        pending: { ...emptyPending(color), mode: "tone", toneSlug: mentioned.slug },
        voucher: null,
      };
    }
    return {
      reply: `${priceLine(mentioned)}. ${mentioned.short}`,
      products: [mentioned],
      quickReplies: [],
      actions: [{ type: "add", label: "Thêm vào giỏ", slug: mentioned.slug }],
      pending: null,
      voucher: null,
    };
  }

  const budget = parseBudget(text);
  const style = parseStyle(text);
  const color = parseColor(text) ?? state.color ?? profileColor;
  const kinds = parseKinds(text);
  state.color = color;
  if (budget.seen) {
    state.budgetMax = budget.budgetMax;
    state.budgetMin = budget.budgetMin;
    state.budgetReady = true;
  }
  if (style.seen) state.style = style.style;
  if (kinds.length) state.kinds = kinds;
  state.wantsSet = state.wantsSet || kinds.includes("set") || folded.includes("set");
  state.mode = "discover";

  const searching = /(tim|goi y|phu hop|set|combo|son|ma hong|duoi|ngan sach|personal color|phong cach)/.test(folded) || budget.seen || style.seen || kinds.length > 0;

  if (!searching) {
    return {
      reply: profileColor
        ? `Mình đang dùng hồ sơ ${colorLabel(profileColor)} của bạn. Bạn muốn tìm set, lọc ngân sách, hay mix lại một món trong set?`
        : "Mình là Liti. Bạn có thể tìm set theo personal color, ngân sách và phong cách — hoặc làm bài test nếu chưa biết tone của mình.",
      products: [],
      quickReplies: [
        { label: "Theo personal color của tôi", message: "Tìm sản phẩm theo personal color của tôi" },
        { label: "Tôi chưa biết màu của mình", message: "Tôi chưa biết mình thuộc màu nào" },
        { label: "Dưới 400k", message: "Tìm sản phẩm dưới 400k" },
        { label: "Set quà tặng", message: "Tôi muốn đặt set quà tặng kèm thiệp" },
      ],
      actions: profileColor ? [] : [{ type: "open-test", label: "Làm bài test" }],
      pending: null,
      voucher: null,
    };
  }

  if (!state.color) {
    return {
      reply: "Bạn chưa có personal color. Hãy làm bài test hoặc nói mình tone bạn muốn (Spring Warm, Summer Cool, Autumn Warm, Winter Cool). Mình sẽ giữ nguyên ngân sách và phong cách bạn vừa nói.",
      products: [],
      quickReplies: COLOR_WORDS.map((entry) => ({ label: colorLabel(entry.key), message: `Tìm cho ${colorLabel(entry.key)}` })),
      actions: [{ type: "open-test", label: "Làm bài test" }],
      pending: state,
      voucher: null,
    };
  }

  if (!state.budgetReady) {
    return {
      reply: `Mình sẽ tìm theo ${colorLabel(state.color)}. Bạn muốn phân khúc giá nào?`,
      products: [],
      quickReplies: BUDGET_REPLIES,
      actions: [],
      pending: state,
      voucher: null,
    };
  }

  if (!style.seen && !state.style) {
    return {
      reply: "Chọn phong cách để mình phối cho sát nhu cầu. Nút Tất cả sẽ hiện mọi style Litibox đang có.",
      products: [],
      quickReplies: STYLE_REPLIES,
      actions: [],
      pending: state,
      voucher: null,
    };
  }

  const { chosen, soldOut } = pickProducts(state);
  if (!chosen.length && !soldOut.length) {
    const similar = PRODUCTS.find((product) => product.stock > 0 && product.colors.includes(state.color!));
    return {
      reply: `Xin lỗi bạn, hiện tại Litibox chưa có món khớp toàn bộ yêu cầu này. Bạn có thể tham khảo ${similar ? similar.name : "các set chuẩn tone"} bên mình nhé!`,
      products: similar ? [similar] : [],
      quickReplies: [{ label: "Tất cả phong cách", message: "Tất cả phong cách" }],
      pending: { ...state, style: "all" },
      actions: [],
      voucher: null,
    };
  }

  const soldOutLine = soldOut
    .map((product) => {
      const alt = alternativeFor(product, state.color);
      return `Rất tiếc, mã ${product.code} ${product.name} chuẩn tone ${colorLabel(state.color)} hiện vừa hết hàng tại kho${alt ? `, bạn có thể tham khảo ${alt.code} ${alt.name}` : ""}.`;
    })
    .join("\n");
  const bundle = describeBundle(chosen);
  const styleLabel = state.style === "all" || !state.style ? "mọi phong cách" : state.style === "party" ? "tiệc" : state.style === "soft" ? "Soft" : "Daily";
  const reply = [
    `Mình đã tự lọc tone ${colorLabel(state.color)}, phong cách ${styleLabel}${state.budgetMax ? `, dưới ${formatVnd(state.budgetMax)}` : ""}.`,
    bundle.text,
    soldOutLine,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    reply,
    products: chosen,
    quickReplies: [
      { label: "Daily", message: "Phong cách Daily" },
      { label: "Tiệc", message: "Phong cách tiệc" },
      { label: "Soft", message: "Phong cách Soft" },
      { label: "Tất cả", message: "Tất cả phong cách" },
    ],
    actions: [],
    pending: state,
    voucher: bundle.voucher,
  };
}
