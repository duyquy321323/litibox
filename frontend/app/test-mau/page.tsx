import type { Metadata } from "next";

import { TestView } from "@/components/shop/test-view";

export const metadata: Metadata = { title: "Test personal color" };

export default function TestPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Trắc nghiệm</p>
      <h1 className="mt-1 mb-6 text-3xl font-semibold tracking-[-0.03em]">Personal color của bạn</h1>
      <TestView />
    </div>
  );
}
