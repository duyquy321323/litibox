import type { Metadata } from "next";

import { ProductCard } from "@/components/shop/product-card";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tìm kiếm" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q.trim() ? searchProducts(q) : [];

  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Tìm kiếm</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
        {q ? `Kết quả cho “${q}”` : "Nhập từ khóa trên thanh tìm kiếm"}
      </h1>
      <p className="mt-2 text-sm text-[#6d5c54]">
        Tìm theo loại set, personal color hoặc nhu cầu — ví dụ “set makeup daily”, “Spring Warm”, “quà tặng”.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {q && products.length === 0 ? (
        <p className="mt-6 text-sm">Xin lỗi bạn, hiện tại Litibox chưa nhập món này. Bạn thử “son”, “má hồng kem” hoặc một personal color nhé.</p>
      ) : null}
    </div>
  );
}
