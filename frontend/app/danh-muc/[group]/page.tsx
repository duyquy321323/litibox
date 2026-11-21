import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/shop/product-card";
import { type ColorKey, type Style, PALETTES, PRODUCTS, SET_GROUPS, forColor } from "@/lib/catalog";

type Params = { group: string };

export function generateStaticParams() {
  return [
    ...SET_GROUPS.map((group) => ({ group: group.slug })),
    ...PALETTES.map((palette) => ({ group: palette.key })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { group } = await params;
  const set = SET_GROUPS.find((item) => item.slug === group);
  const color = PALETTES.find((item) => item.key === group);
  return { title: set?.label ?? color?.label ?? "Danh mục" };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { group } = await params;
  const set = SET_GROUPS.find((item) => item.slug === group);
  const color = PALETTES.find((item) => item.key === group);
  if (!set && !color) notFound();

  const products = set
    ? PRODUCTS.filter((product) => product.styles.includes(set.slug as Style))
    : forColor(color!.key as ColorKey);

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">{set ? "Set makeup" : "Personal color"}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">{set?.label ?? color?.label}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#6d5c54]">{set?.hint ?? color?.description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
