"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

import { PALETTES, PRODUCTS, SET_GROUPS, searchProducts } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

const LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/kham-pha", label: "Khám phá" },
  { href: "/deal", label: "Deal hot" },
  { href: "/goc-phoi-mau", label: "Góc phối màu" },
  { href: "/tra-cuu", label: "Tra cứu đơn hàng" },
];

export function SiteHeader() {
  const router = useRouter();
  const { cartCount } = useShop();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [catalog, setCatalog] = useState(false);
  const suggestions = query.trim().length > 1 ? searchProducts(query).slice(0, 5) : [];

  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfd4]/80 bg-[#f6f1ea]/90 backdrop-blur-md">
      <div className="overflow-hidden bg-[#241c18] text-[#f6efe8]">
        <div className="flex animate-[marquee_28s_linear_infinite] gap-10 py-2 text-[12px] tracking-wide whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, copy) => (
            <div key={copy} className="flex gap-10 px-6">
              <span>Thiệp viết tay theo yêu cầu khi mua set quà tặng</span>
              <span>Freeship cho đơn từ 389k</span>
              <span>Tặng thẻ hướng dẫn phối màu khi mua hàng</span>
              <span>100% mỹ phẩm chính hãng · không kem nền</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:gap-6">
        <button className="rounded-full p-2 md:hidden" onClick={() => setMenu((value) => !value)} aria-label="Mở menu">
          {menu ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link href="/" className="shrink-0">
          <span className="block text-[1.55rem] leading-none font-semibold tracking-[-0.04em] text-[#241c18]">
            liti<span className="text-[#9a3e49]">box</span>
          </span>
          <span className="hidden text-[10px] tracking-[0.18em] text-[#9a857b] uppercase sm:block">Personal color sets</span>
        </Link>
        <form onSubmit={submit} className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9a857b]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Tìm set, personal color, nhu cầu… ví dụ set makeup daily"
            className="h-11 w-full rounded-full border border-[#eadfd4] bg-white pr-4 pl-10 text-sm outline-none placeholder:text-[#b3a49b] focus:border-[#c96b78]"
          />
          {open && suggestions.length > 0 ? (
            <div className="absolute top-12 right-0 left-0 z-20 overflow-hidden rounded-2xl border border-[#eadfd4] bg-white shadow-xl">
              {suggestions.map((product) => (
                <Link
                  key={product.slug}
                  href={`/san-pham/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:bg-[#fbf6f1]"
                >
                  <span className="text-[#9a3e49]">{product.brand}</span> · {product.name}
                </Link>
              ))}
              <button type="submit" className="w-full px-4 py-2.5 text-left text-sm text-[#7d6c63] hover:bg-[#fbf6f1]">
                Xem tất cả kết quả cho “{query}”
              </button>
            </div>
          ) : null}
        </form>
        <div className="flex items-center gap-1">
          <Link href="/tai-khoan" className="flex items-center gap-1.5 rounded-full px-2 py-2 text-sm hover:bg-white">
            <UserRound className="size-5" />
            <span className="hidden lg:inline">Tài khoản</span>
          </Link>
          <Link href="/gio-hang" className="relative flex items-center gap-1.5 rounded-full px-2 py-2 text-sm hover:bg-white">
            <ShoppingBag className="size-5" />
            <span className="hidden lg:inline">Giỏ hàng</span>
            {cartCount > 0 ? (
              <span className="absolute -top-0.5 left-4 grid size-4 place-items-center rounded-full bg-[#9a3e49] text-[10px] text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav className={`${menu ? "block" : "hidden"} border-t border-[#eadfd4] md:block`}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-2 text-sm md:flex-row md:items-center md:gap-1">
          {LINKS.slice(0, 3).map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 hover:bg-white" onClick={() => setMenu(false)}>
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className="rounded-full px-3 py-2 text-left hover:bg-white"
              aria-expanded={catalog}
              onClick={() => setCatalog((value) => !value)}
            >
              Danh mục sản phẩm
            </button>
            {catalog ? (
              <>
              <button
                type="button"
                aria-label="Đóng danh mục"
                className="fixed inset-0 z-20 cursor-default bg-transparent"
                onClick={() => setCatalog(false)}
              />
              <div className="relative z-30 md:absolute md:top-full md:left-0 md:pt-2">
              <div className="grid gap-1 rounded-2xl border border-[#eadfd4] bg-white p-3 shadow-xl md:w-[28rem] md:grid-cols-2">
                <div>
                  <p className="px-2 py-1 text-[11px] tracking-[0.14em] text-[#9a857b] uppercase">3 set makeup</p>
                  {SET_GROUPS.map((group) => (
                    <Link
                      key={group.slug}
                      href={`/danh-muc/${group.slug}`}
                      onClick={() => { setCatalog(false); setMenu(false); }}
                      className="block rounded-xl px-2 py-2 hover:bg-[#fbf6f1]"
                    >
                      <span className="font-medium">{group.label}</span>
                      <span className="block text-xs text-[#7d6c63]">{group.hint}</span>
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="px-2 py-1 text-[11px] tracking-[0.14em] text-[#9a857b] uppercase">Personal color</p>
                  {PALETTES.map((palette) => (
                    <Link
                      key={palette.key}
                      href={`/danh-muc/${palette.key}`}
                      onClick={() => { setCatalog(false); setMenu(false); }}
                      className="flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[#fbf6f1]"
                    >
                      <span className="size-3 rounded-full" style={{ background: palette.best[0]?.hex }} />
                      {palette.label}
                    </Link>
                  ))}
                </div>
              </div>
              </div>
              </>
            ) : null}
          </div>
          {LINKS.slice(3).map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 hover:bg-white" onClick={() => setMenu(false)}>
              {link.label}
            </Link>
          ))}
          <span className="px-3 text-[11px] tracking-wide text-[#9a857b] md:ml-auto">Agentic Commerce · tìm theo set, màu, nhu cầu</span>
        </div>
      </nav>
      <p className="sr-only">{PRODUCTS.length} sản phẩm</p>
    </header>
  );
}
