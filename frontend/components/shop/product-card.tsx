import Link from "next/link";
import { Star } from "lucide-react";

import { ProductArt } from "@/components/shop/product-art";
import { type Product, discountOf, formatVnd, priceOf, savedOf } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const off = discountOf(product);
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-[#eadfd4] bg-white shadow-[0_10px_30px_rgba(80,40,30,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(80,40,30,.08)]"
    >
      <ProductArt product={product} className="aspect-[4/5]" />
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <p className="text-[11px] font-medium tracking-[0.14em] text-[#9a3e49] uppercase">
          {product.brand}
          {product.gift ? " · Quà tặng" : product.combo ? " · Combo" : ""}
        </p>
        <h3 className="line-clamp-2 min-h-11 text-[15px] leading-snug font-medium text-[#241c18]">{product.name}</h3>
        <div className="mt-auto flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className="text-lg font-semibold text-[#9a3e49]">{formatVnd(priceOf(product))}</span>
          {off > 0 ? (
            <span className="pb-0.5 text-xs text-[#9a857b] line-through">{formatVnd(product.price)}</span>
          ) : null}
        </div>
        {off > 0 ? (
          <p className="text-xs text-[#6d5348]">
            Tiết kiệm {formatVnd(savedOf(product))} · -{off}%
          </p>
        ) : null}
        <p className="flex items-center gap-1 text-xs text-[#7d6c63]">
          <Star className="size-3.5 fill-[#c9893a] text-[#c9893a]" />
          {product.rating} · Đã bán {new Intl.NumberFormat("vi-VN").format(product.sold)}
          {product.stock <= 0 ? " · Hết hàng" : ""}
        </p>
      </div>
    </Link>
  );
}
