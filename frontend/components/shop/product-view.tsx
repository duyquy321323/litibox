"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { ProductArt } from "@/components/shop/product-art";
import { ProductCard } from "@/components/shop/product-card";
import {
  type Product,
  CATEGORY_LABEL,
  SEGMENT_LABEL,
  colorLabel,
  discountOf,
  formatVnd,
  priceOf,
  savedOf,
} from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart } = useShop();
  const [frame, setFrame] = useState(0);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  const off = discountOf(product);

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <ProductArt product={product} variant={frame} className="aspect-[4/5] rounded-[1.8rem]" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <button key={index} onClick={() => setFrame(index)} className={frame === index ? "rounded-2xl ring-2 ring-[#9a3e49]" : "rounded-2xl"}>
                <ProductArt product={product} variant={index} className="aspect-square rounded-2xl" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">
            {product.brand} · {SEGMENT_LABEL[product.segment]} · {CATEGORY_LABEL[product.category]}
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.03em]">{product.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-[#6d5c54]">
            <Star className="size-4 fill-[#c9893a] text-[#c9893a]" />
            {product.rating} · Đã bán {new Intl.NumberFormat("vi-VN").format(product.sold)} · {product.code}
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-semibold text-[#9a3e49]">{formatVnd(priceOf(product))}</span>
            {off > 0 ? <span className="text-lg text-[#9a857b] line-through">{formatVnd(product.price)}</span> : null}
            {off > 0 ? <span className="rounded-full bg-[#9a3e49] px-2 py-1 text-xs text-white">-{off}%</span> : null}
          </div>
          {off > 0 ? <p className="mt-2 text-sm text-[#6d5348]">Tiết kiệm {formatVnd(savedOf(product))}</p> : null}
          <p className="mt-4 text-sm leading-relaxed text-[#4d3f39]">{product.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span key={color} className="rounded-full bg-white px-3 py-1 text-xs">{colorLabel(color)}</span>
            ))}
          </div>
          <ul className="mt-4 space-y-1 text-sm text-[#5c4b44]">
            {product.details.map((detail) => (
              <li key={detail}>· {detail}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm">{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}</p>
          {product.gift ? (
            <label className="mt-4 block text-sm">
              Lời nhắn viết tay trên thiệp
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Chúc mẹ luôn rạng rỡ..."
                className="mt-1 w-full rounded-2xl border border-[#eadfd4] bg-white px-3 py-2 outline-none focus:border-[#c96b78]"
              />
            </label>
          ) : (
            <label className="mt-4 block text-sm">
              Ghi chú
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] bg-white px-3 outline-none focus:border-[#c96b78]"
              />
            </label>
          )}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-[#eadfd4] bg-white">
              <button className="px-3 py-2" onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button className="px-3 py-2" onClick={() => setQty((value) => Math.min(99, value + 1))}>+</button>
            </div>
            <button
              disabled={product.stock <= 0}
              onClick={() => {
                addToCart(product.slug, qty, note);
                setAdded(true);
              }}
              className="rounded-full bg-[#241c18] px-6 py-3 text-sm text-white disabled:opacity-40"
            >
              {product.stock <= 0 ? "Hết hàng" : added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Phối cùng tone</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
