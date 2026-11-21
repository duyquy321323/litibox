"use client";

import Link from "next/link";
import { useState } from "react";

import { Assistant } from "@/components/shop/assistant";
import { SiteFooter } from "@/components/shop/site-footer";
import { SiteHeader } from "@/components/shop/site-header";
import { PALETTES } from "@/lib/catalog";
import { ShopProvider, useShop } from "@/lib/shop";

function IntroGate() {
  const { ready, profile, skipTest } = useShop();
  const [closed, setClosed] = useState(false);
  const visible = ready && !closed && !profile.personalColor && !profile.skippedTest;
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#241c18]/45 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-[1.8rem] bg-[#fffdfb] shadow-2xl">
        <div className="grid grid-cols-4">
          {PALETTES.map((palette) => (
            <div key={palette.key} className="h-16" style={{ background: palette.best[0]?.hex }} />
          ))}
        </div>
        <div className="space-y-4 px-6 py-6">
          <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Chào bạn mới</p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Tìm personal color của bạn</h2>
          <p className="text-sm leading-relaxed text-[#5c4b44]">
            Bài test 8 câu hiện ra lần đầu bạn vào Litibox. Kết quả được lưu vào hồ sơ. Bạn có thể làm lại bất cứ lúc nào trong Tài khoản — kết quả cũ vẫn được giữ.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/test-mau" onClick={skipTest} className="rounded-full bg-[#9a3e49] px-5 py-2.5 text-sm text-white">
              Test
            </Link>
            <button onClick={() => { skipTest(); setClosed(true); }} className="rounded-full border border-[#eadfd4] px-5 py-2.5 text-sm">
              Bỏ qua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <SiteFooter />
      <IntroGate />
      <Assistant />
    </>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <Frame>{children}</Frame>
    </ShopProvider>
  );
}
