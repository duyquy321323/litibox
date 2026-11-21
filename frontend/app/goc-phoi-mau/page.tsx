import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import { PALETTES, forColor } from "@/lib/catalog";

export const metadata: Metadata = { title: "Góc phối màu" };

export default function ColorGuidePage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Góc phối màu</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Hướng dẫn theo từng personal color</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#6d5c54]">
        Litibox không dùng kem nền. Phối son, má và mắt theo nhóm màu của da.
      </p>
      <div className="mt-8 space-y-10">
        {PALETTES.map((palette) => (
          <section key={palette.key} className="overflow-hidden rounded-[1.6rem] border border-[#eadfd4] bg-white">
            <div className="grid md:grid-cols-[220px_1fr]">
              <div className="grid grid-cols-2">
                {palette.best.map((color) => (
                  <div key={color.hex} className="flex min-h-24 items-end p-3 text-xs" style={{ background: color.hex }}>
                    {color.name}
                  </div>
                ))}
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{palette.label}</h2>
                <p className="mt-1 text-sm text-[#7d6c63]">{palette.group}</p>
                <p className="mt-3 text-sm leading-relaxed">{palette.makeup}</p>
                <p className="mt-3 text-xs tracking-[0.14em] text-[#9a857b] uppercase">Nên tránh</p>
                <div className="mt-2 flex gap-2">
                  {palette.avoid.map((color) => (
                    <span key={color.name} className="inline-flex items-center gap-2 rounded-full border border-[#eadfd4] px-2 py-1 text-xs">
                      <span className="size-3 rounded-full" style={{ background: color.hex }} />
                      {color.name}
                    </span>
                  ))}
                </div>
                <Link href={`/danh-muc/${palette.key}`} className="mt-4 inline-block text-sm underline underline-offset-4">
                  Xem sản phẩm {palette.label}
                </Link>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {forColor(palette.key).slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
