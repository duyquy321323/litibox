"use client";

import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import { forColor, paletteOf } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export function HomePersonal() {
  const { ready, profile } = useShop();
  if (!ready || !profile.personalColor) return null;
  const palette = paletteOf(profile.personalColor);
  const picks = forColor(profile.personalColor).slice(0, 4);
  const bought = new Set(profile.orders.flatMap((order) => order.items.map((item) => item.slug)));
  const again = picks.filter((product) => !bought.has(product.slug));
  return (
    <section className="mt-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Your color, your set</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Dành cho {palette?.label}</h2>
          <p className="mt-2 max-w-xl text-sm text-[#6d5c54]">{palette?.description}</p>
        </div>
        <Link href={`/kham-pha?mau=${profile.personalColor}`} className="text-sm underline underline-offset-4">
          Xem cả bảng màu
        </Link>
      </div>
      {profile.orders.length > 0 ? (
        <p className="mb-4 rounded-2xl bg-white px-4 py-3 text-sm text-[#5c4b44]">
          Bạn đã mua {profile.orders[0]?.items[0]?.name}. Mình giữ personal color và gợi ý tiếp những món chưa có trong đơn trước.
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(again.length ? again : picks).map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
