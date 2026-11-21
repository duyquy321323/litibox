import type { Metadata } from "next";
import { Suspense } from "react";

import { TrackView } from "@/components/shop/track-view";

export const metadata: Metadata = { title: "Tra cứu đơn hàng" };

export default function TrackPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Đơn hàng</p>
      <h1 className="mt-1 mb-6 text-3xl font-semibold tracking-[-0.03em]">Tra cứu đơn hàng</h1>
      <Suspense>
        <TrackView />
      </Suspense>
    </div>
  );
}
