import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductView } from "@/components/shop/product-view";
import { PRODUCTS, productBySlug } from "@/lib/catalog";
import { fetchProductBySlug, fetchProducts } from "@/lib/catalog-api";

type Params = { slug: string };

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = (await fetchProductBySlug(slug)) ?? productBySlug(slug);
  return { title: product?.name ?? "Sản phẩm" };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = (await fetchProductBySlug(slug)) ?? productBySlug(slug);
  if (!product) notFound();
  const apiRelated = await fetchProducts({ category: product.category, limit: 10 });
  const pool = apiRelated ?? PRODUCTS;
  const related = pool.filter(
    (item) => item.slug !== product.slug && item.colors.some((color) => product.colors.includes(color)),
  ).slice(0, 4);
  return <ProductView product={product} related={related} />;
}
