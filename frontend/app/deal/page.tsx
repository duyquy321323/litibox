import type { Metadata } from "next";

import { ProductCard } from "@/components/shop/product-card";
import { deals } from "@/lib/catalog";

export const metadata: Metadata = { title: "Deal hot" };

export default function DealPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Deal hot</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Giá sale, giá tiết kiệm</h1>
      <p className="mt-2 text-sm text-[#6d5c54]">Mỗi thẻ hiện giá đang bán, giá gốc gạch ngang và phần trăm giảm.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {deals().map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
