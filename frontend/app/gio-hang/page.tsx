import type { Metadata } from "next";

import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Giỏ hàng</p>
      <h1 className="mt-1 mb-6 text-3xl font-semibold tracking-[-0.03em]">Giống một phiên checkout gọn</h1>
      <CartView />
    </div>
  );
}
