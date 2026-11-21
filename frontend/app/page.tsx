import Link from "next/link";
import { Star } from "lucide-react";

import { HomePersonal } from "@/components/shop/home-personal";
import { ProductCard } from "@/components/shop/product-card";
import { PALETTES, REVIEWS, colorLabel, productBySlug } from "@/lib/catalog";
import { fetchProducts, fetchReviews } from "@/lib/catalog-api";

export default async function HomePage() {
  const apiSets = await fetchProducts({ limit: 100 });
  const allSets = apiSets ?? ["set-daily-glow", "set-party-muse", "set-soft-bloom"]
    .map((slug) => productBySlug(slug))
    .filter((product) => product !== null);
  const sets = allSets.filter((product) => product.category === "set").slice(0, 3);
  const apiReviews = await fetchReviews();
  const reviews = apiReviews ?? REVIEWS;
  return (
    <div>
      <section className="grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#9a3e49] uppercase">Chúng tôi là Litibox</p>
          <h1 className="mt-3 max-w-xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-[#241c18] sm:text-6xl">
            Màu của bạn.
            <span className="block text-[#9a3e49]">Set của bạn.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#5c4b44]">
            Chúng tôi là Litibox — cửa hàng set makeup phối sẵn theo personal color. Son, má hồng, phấn mắt và bắt sáng được mix trong một hộp. Không kem nền.
          </p>
          <p className="mt-3 text-sm text-[#8a7368]">
            Ứng dụng seminar: Generative AI & AI-Generated Content trong TMĐT
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/test-mau" className="rounded-full bg-[#9a3e49] px-5 py-3 text-sm text-white">
              Test personal color
            </Link>
            <Link href="/kham-pha" className="rounded-full border border-[#e4cfc3] bg-white px-5 py-3 text-sm">
              Khám phá theo màu
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PALETTES.map((palette) => (
            <Link
              key={palette.key}
              href={`/danh-muc/${palette.key}`}
              className="rounded-[1.4rem] border border-white/70 p-4 shadow-[0_12px_30px_rgba(80,40,30,.06)]"
              style={{ background: `linear-gradient(160deg, #fff, ${palette.best[0]?.hex})` }}
            >
              <p className="text-[11px] tracking-[0.14em] uppercase">{palette.group.split("–")[1]?.trim() ?? palette.group}</p>
              <p className="mt-6 text-xl font-semibold tracking-[-0.03em]">{palette.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-5">
          <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Litibox có gì hot?</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Best seller — set tiêu chuẩn</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <HomePersonal />

      <section className="mt-16">
        <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Góc feedback</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-[-0.03em]">Bestie nhà Liti</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="rounded-[1.4rem] border border-[#eadfd4] bg-white p-5">
              <div className="flex gap-0.5 text-[#c9893a]">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-[#3d312c]">{review.content}</blockquote>
              <figcaption className="mt-4 text-xs text-[#7d6c63]">
                {review.name} · {colorLabel(review.color)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
