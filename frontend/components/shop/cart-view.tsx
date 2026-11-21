"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductArt } from "@/components/shop/product-art";
import { formatVnd, priceOf, productBySlug } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export function CartView() {
  const { ready, cart, setQty, setNote, setSelected, setAllSelected, removeFromCart, checkout, profile, totals } = useShop();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const seeded = useRef(false);
  useEffect(() => {
    if (!ready || seeded.current) return;
    seeded.current = true;
    setName(profile.name === "Khách của Liti" ? "" : profile.name);
    setPhone(profile.phone);
    setAddress(profile.address);
  }, [ready, profile.name, profile.phone, profile.address]);
  const [note, setOrderNote] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const allChecked = cart.length > 0 && cart.every((line) => line.selected);
  const lines = useMemo(
    () =>
      cart
        .map((line) => ({ line, product: productBySlug(line.slug) }))
        .filter((item): item is { line: (typeof cart)[number]; product: NonNullable<ReturnType<typeof productBySlug>> } => item.product !== null),
    [cart],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
      <section className="overflow-hidden rounded-[1.4rem] border border-[#eadfd4] bg-white">
        <div className="flex items-center gap-3 border-b border-[#f1e6dc] px-4 py-3 text-sm">
          <input type="checkbox" checked={allChecked} onChange={(event) => setAllSelected(event.target.checked)} />
          <span className="font-medium">Litibox Official</span>
          <span className="text-[#7d6c63]">Gian hàng chính hãng</span>
        </div>
        {lines.length === 0 ? (
          <p className="px-4 py-10 text-sm text-[#7d6c63]">
            Giỏ đang trống. <Link href="/deal" className="underline">Xem deal hot</Link>
          </p>
        ) : (
          lines.map(({ line, product }) => (
            <article key={line.slug} className="grid grid-cols-[auto_72px_1fr] gap-3 border-b border-[#f6f1ea] px-4 py-4">
              <input
                type="checkbox"
                className="mt-6"
                checked={line.selected}
                onChange={(event) => setSelected(line.slug, event.target.checked)}
              />
              <ProductArt product={product} className="size-[72px] rounded-xl" />
              <div>
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/san-pham/${product.slug}`} className="text-sm font-medium">{product.name}</Link>
                  <button className="text-xs text-[#9a3e49]" onClick={() => removeFromCart(line.slug)}>Xóa</button>
                </div>
                <p className="mt-1 text-xs text-[#7d6c63]">{product.brand} · {product.code}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-semibold text-[#9a3e49]">{formatVnd(priceOf(product))}</span>
                  <div className="flex items-center rounded-full border border-[#eadfd4]">
                    <button className="px-3 py-1" onClick={() => setQty(line.slug, Math.max(1, line.quantity - 1))}>-</button>
                    <span className="w-6 text-center text-sm">{line.quantity}</span>
                    <button className="px-3 py-1" onClick={() => setQty(line.slug, Math.min(99, line.quantity + 1))}>+</button>
                  </div>
                  <span className="text-sm">{formatVnd(priceOf(product) * line.quantity)}</span>
                </div>
                <input
                  value={line.note}
                  onChange={(event) => setNote(line.slug, event.target.value)}
                  placeholder={product.gift ? "Lời nhắn viết tay trên thiệp" : "Ghi chú cho món này"}
                  className="mt-3 h-9 w-full rounded-full border border-[#eadfd4] px-3 text-sm outline-none"
                />
              </div>
            </article>
          ))
        )}
      </section>
      <aside className="h-fit rounded-[1.4rem] border border-[#eadfd4] bg-white p-5">
        <h1 className="text-xl font-semibold">Thanh toán</h1>
        <label className="mt-4 block text-sm">Người nhận
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" />
        </label>
        <label className="mt-3 block text-sm">Số điện thoại
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" />
        </label>
        <label className="mt-3 block text-sm">Địa chỉ
          <input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" />
        </label>
        <label className="mt-3 block text-sm">Ghi chú đơn
          <input value={note} onChange={(event) => setOrderNote(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" />
        </label>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatVnd(totals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Giảm giá {totals.code ? `(${totals.code})` : ""}</dt><dd>-{formatVnd(totals.discount)}</dd></div>
          <div className="flex justify-between"><dt>Phí ship</dt><dd>{formatVnd(totals.ship)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Tổng</dt><dd>{formatVnd(totals.total)}</dd></div>
        </dl>
        {totals.freeShipGap > 0 ? (
          <p className="mt-2 text-xs text-[#7d6c63]">Mua thêm {formatVnd(totals.freeShipGap)} để freeship từ 389k.</p>
        ) : (
          <p className="mt-2 text-xs text-[#2f7d4a]">Đơn đã được freeship.</p>
        )}
        <button
          className="mt-4 w-full rounded-full bg-[#9a3e49] py-3 text-sm text-white disabled:opacity-40"
          disabled={!lines.some((item) => item.line.selected) || !phone || !address}
          onClick={() => {
            const order = checkout({ name: name || profile.name, phone, address, note, voucher: totals.code });
            if (order) setDone(order.code);
          }}
        >
          Đặt hàng
        </button>
        {done ? <p className="mt-3 text-sm">Đã tạo đơn <Link className="underline" href={`/tra-cuu?code=${done}`}>{done}</Link>.</p> : null}
      </aside>
    </div>
  );
}
