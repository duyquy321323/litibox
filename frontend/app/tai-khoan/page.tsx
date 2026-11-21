import type { Metadata } from "next";

import { AccountView } from "@/components/shop/account-view";

export const metadata: Metadata = { title: "Tài khoản" };

export default function AccountPage() {
  return (
    <div>
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Hồ sơ của tôi</p>
      <h1 className="mt-1 mb-6 text-3xl font-semibold tracking-[-0.03em]">Tài khoản</h1>
      <AccountView />
    </div>
  );
}
