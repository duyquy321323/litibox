import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import { type ColorKey, PALETTES, forColor } from "@/lib/catalog";

export const metadata: Metadata = { title: "Khám phá" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ mau?: string }>;
}) {
  const { mau } = await searchParams;
  const focus = PALETTES.find((palette) => palette.key === mau);
  const palettes = focus ? [focus] : PALETTES;

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Khám phá</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Theo personal color</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#6d5c54]">
        Bốn nhóm màu của Litibox. Chọn nhóm gần với da bạn, hoặc làm bài test nếu chưa chắc.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/kham-pha" className={`rounded-full px-3 py-1.5 text-sm ${focus ? "bg-white" : "bg-[#241c18] text-white"}`}>
          Tất cả
        </Link>
        {PALETTES.map((palette) => (
          <Link
            key={palette.key}
            href={`/kham-pha?mau=${palette.key}`}
            className={`rounded-full px-3 py-1.5 text-sm ${focus?.key === palette.key ? "bg-[#241c18] text-white" : "bg-white"}`}
          >
            {palette.label}
          </Link>
        ))}
      </div>
      {palettes.map((palette) => (
        <section key={palette.key} className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">{palette.label}</h2>
              <p className="mt-1 text-sm text-[#6d5c54]">{palette.description}</p>
            </div>
            <div className="flex gap-1">
              {palette.best.map((color) => (
                <span key={color.hex} className="size-6 rounded-full" style={{ background: color.hex }} />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {forColor(palette.key as ColorKey).slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
