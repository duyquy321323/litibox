"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ORDER_STATUS, formatVnd } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export function TrackView() {
  const params = useSearchParams();
  const { profile } = useShop();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(Boolean(params.get("code")));

  const order = useMemo(() => {
    if (!searched) return null;
    return (
      profile.orders.find((item) => {
        const sameCode = item.code.toLowerCase() === code.trim().toLowerCase();
        const samePhone = !phone.trim() || item.receiverPhone === phone.trim();
        return sameCode && samePhone;
      }) ?? null
    );
  }, [searched, profile.orders, code, phone]);

  const step = ORDER_STATUS.findIndex((status) => status.id === order?.status);

  return (
    <div className="mx-auto max-w-xl">
      <form
        className="grid gap-3 rounded-[1.4rem] bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSearched(true);
        }}
      >
        <label className="text-sm">Mã đơn
          <input value={code} onChange={(event) => setCode(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" placeholder="LT…" />
        </label>
        <label className="text-sm">Số điện thoại
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3" />
        </label>
        <button className="h-10 rounded-full bg-[#9a3e49] text-sm text-white">Tra cứu</button>
      </form>
      {searched && !order ? <p className="mt-4 text-sm">Không thấy đơn khớp mã và số điện thoại trên trình duyệt này.</p> : null}
      {order ? (
        <article className="mt-4 rounded-[1.4rem] bg-white p-5">
          <p className="text-sm text-[#7d6c63]">{order.code}</p>
          <h2 className="text-xl font-semibold">{ORDER_STATUS.find((status) => status.id === order.status)?.label}</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {ORDER_STATUS.filter((status) => status.id !== "returned" && status.id !== "cancelled").map((status, index) => (
              <li key={status.id} className={index <= step ? "font-medium text-[#9a3e49]" : "text-[#9a857b]"}>
                {index <= step ? "●" : "○"} {status.label}
              </li>
            ))}
          </ol>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.slug}>
                {item.name} × {item.quantity}
                {item.note ? ` · Thiệp: ${item.note}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold">{formatVnd(order.total)}</p>
          <p className="text-sm text-[#6d5c54]">{order.receiverName} · {order.receiverPhone} · {order.receiverAddress}</p>
        </article>
      ) : null}
    </div>
  );
}
