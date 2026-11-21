"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type ColorKey,
  type OrderStatus,
  FREE_SHIP,
  SHIP_FEE,
  paletteOf,
  priceOf,
  productBySlug,
  voucherFor,
} from "@/lib/catalog";

export type TestRecord = {
  id: string;
  result: ColorKey;
  scores: Record<ColorKey, number>;
  at: string;
};

export type PaymentMethod = { id: string; label: string; value: string };

export type OrderLine = {
  slug: string;
  name: string;
  code: string;
  tone: string;
  price: number;
  quantity: number;
  note: string;
};

export type ShopOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  voucher: string | null;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note: string;
};

export type Consultation = {
  id: string;
  message: string;
  reply: string;
  at: string;
};

export type Profile = {
  name: string;
  code: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  personalColor: ColorKey | null;
  bestColors: string[];
  avoidColors: string[];
  colorSource: "test" | "manual" | null;
  tests: TestRecord[];
  payments: PaymentMethod[];
  orders: ShopOrder[];
  consultations: Consultation[];
  skippedTest: boolean;
};

export type CartLine = {
  slug: string;
  quantity: number;
  note: string;
  selected: boolean;
};

type ShopContextValue = {
  ready: boolean;
  profile: Profile;
  cart: CartLine[];
  updateProfile: (patch: Partial<Profile>) => void;
  saveManualColor: (color: ColorKey, best: string[], avoid: string[]) => void;
  saveTest: (result: ColorKey, scores: Record<ColorKey, number>) => void;
  skipTest: () => void;
  addPayment: (label: string, value: string) => void;
  removePayment: (id: string) => void;
  addToCart: (slug: string, quantity?: number, note?: string) => void;
  setQty: (slug: string, quantity: number) => void;
  setNote: (slug: string, note: string) => void;
  setSelected: (slug: string, selected: boolean) => void;
  setAllSelected: (selected: boolean) => void;
  removeFromCart: (slug: string) => void;
  checkout: (input: { name: string; phone: string; address: string; note: string; voucher: string | null }) => ShopOrder | null;
  logConsult: (message: string, reply: string) => void;
  cartCount: number;
  totals: ReturnType<typeof quoteCart>;
};

const STORAGE_KEY = "litibox.shop.v1";

function createCode() {
  const stamp = Math.floor(1000 + Math.random() * 9000);
  return `LTB-${stamp}`;
}

function blankProfile(): Profile {
  return {
    name: "Khách của Liti",
    code: createCode(),
    dob: "",
    email: "",
    phone: "",
    address: "",
    personalColor: null,
    bestColors: [],
    avoidColors: [],
    colorSource: null,
    tests: [],
    payments: [],
    orders: [],
    consultations: [],
    skippedTest: false,
  };
}

function quoteCart(cart: CartLine[], selectedOnly = true) {
  const lines = cart.filter((line) => (selectedOnly ? line.selected : true));
  const detailed = lines
    .map((line) => {
      const product = productBySlug(line.slug);
      if (!product) return null;
      return { line, product, amount: priceOf(product) * line.quantity };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotal = detailed.reduce((sum, item) => sum + item.amount, 0);
  const deal = voucherFor(subtotal);
  const total = Math.max(subtotal - deal.discount, 0) + deal.ship;
  return { detailed, subtotal, ...deal, total, freeShipGap: Math.max(FREE_SHIP - subtotal, 0), shipFee: SHIP_FEE };
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(blankProfile);
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { profile?: Profile; cart?: CartLine[] };
        if (parsed.profile) setProfile({ ...blankProfile(), ...parsed.profile });
        if (parsed.cart) setCart(parsed.cart);
      }
    } catch {
      /* giữ hồ sơ trống nếu dữ liệu cũ hỏng */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, cart }));
  }, [ready, profile, cart]);

  const value = useMemo<ShopContextValue>(() => {
    const updateProfile = (patch: Partial<Profile>) => setProfile((current) => ({ ...current, ...patch }));
    return {
      ready,
      profile,
      cart,
      updateProfile,
      saveManualColor: (color, best, avoid) =>
        setProfile((current) => ({
          ...current,
          personalColor: color,
          bestColors: best,
          avoidColors: avoid,
          colorSource: "manual",
        })),
      saveTest: (result, scores) =>
        setProfile((current) => ({
          ...current,
          personalColor: result,
          bestColors: paletteOf(result)?.best.map((color) => color.name) ?? [],
          avoidColors: paletteOf(result)?.avoid.map((color) => color.name) ?? [],
          colorSource: "test",
          skippedTest: true,
          tests: [{ id: crypto.randomUUID(), result, scores, at: new Date().toISOString() }, ...current.tests],
        })),
      skipTest: () => setProfile((current) => ({ ...current, skippedTest: true })),
      addPayment: (label, value) =>
        setProfile((current) => ({
          ...current,
          payments: [{ id: crypto.randomUUID(), label, value }, ...current.payments],
        })),
      removePayment: (id) =>
        setProfile((current) => ({ ...current, payments: current.payments.filter((item) => item.id !== id) })),
      addToCart: (slug, quantity = 1, note) =>
        setCart((current) => {
          const found = current.find((line) => line.slug === slug);
          if (found) {
            return current.map((line) =>
              line.slug === slug
                ? { ...line, quantity: Math.min(line.quantity + quantity, 99), note: note ?? line.note, selected: true }
                : line,
            );
          }
          return [{ slug, quantity, note: note ?? "", selected: true }, ...current];
        }),
      setQty: (slug, quantity) =>
        setCart((current) => current.map((line) => (line.slug === slug ? { ...line, quantity } : line))),
      setNote: (slug, note) =>
        setCart((current) => current.map((line) => (line.slug === slug ? { ...line, note } : line))),
      setSelected: (slug, selected) =>
        setCart((current) => current.map((line) => (line.slug === slug ? { ...line, selected } : line))),
      setAllSelected: (selected) => setCart((current) => current.map((line) => ({ ...line, selected }))),
      removeFromCart: (slug) => setCart((current) => current.filter((line) => line.slug !== slug)),
      checkout: ({ name, phone, address, note, voucher }) => {
        const quote = quoteCart(cart, true);
        if (!quote.detailed.length) return null;
        const order: ShopOrder = {
          id: crypto.randomUUID(),
          code: `LT${Date.now().toString().slice(-8)}`,
          status: "pending",
          createdAt: new Date().toISOString(),
          items: quote.detailed.map(({ line, product }) => ({
            slug: product.slug,
            name: product.name,
            code: product.code,
            tone: product.tone,
            price: priceOf(product),
            quantity: line.quantity,
            note: line.note,
          })),
          subtotal: quote.subtotal,
          discount: quote.discount,
          shipping: quote.ship,
          total: quote.total,
          voucher: voucher ?? quote.code,
          receiverName: name,
          receiverPhone: phone,
          receiverAddress: address,
          note,
        };
        const bought = new Set(quote.detailed.map((item) => item.product.slug));
        setCart((current) => current.filter((line) => !bought.has(line.slug)));
        setProfile((current) => ({
          ...current,
          name: name || current.name,
          phone: phone || current.phone,
          address: address || current.address,
          orders: [order, ...current.orders],
        }));
        return order;
      },
      logConsult: (message, reply) =>
        setProfile((current) => ({
          ...current,
          consultations: [
            { id: crypto.randomUUID(), message, reply, at: new Date().toISOString() },
            ...current.consultations,
          ].slice(0, 30),
        })),
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      totals: quoteCart(cart, true),
    };
  }, [ready, profile, cart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop phải nằm trong ShopProvider");
  return value;
}
