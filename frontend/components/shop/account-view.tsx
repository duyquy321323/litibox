"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type ColorKey,
  ORDER_STATUS,
  PALETTES,
  colorLabel,
  formatVnd,
  paletteOf,
} from "@/lib/catalog";
import { useShop } from "@/lib/shop";

const TABS = [
  { id: "info", label: "Thông tin & liên hệ" },
  { id: "color", label: "Hồ sơ màu sắc" },
  { id: "pay", label: "Thanh toán" },
  { id: "orders", label: "Đơn hàng" },
  { id: "history", label: "Lịch sử" },
] as const;

export function AccountView() {
  const { profile, updateProfile, saveManualColor, addPayment, removePayment } = useShop();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("info");
  const [orderTab, setOrderTab] = useState<(typeof ORDER_STATUS)[number]["id"]>("pending");
  const [color, setColor] = useState<ColorKey>(profile.personalColor ?? "spring_warm");
  const [best, setBest] = useState(profile.bestColors.join(", "));
  const [avoid, setAvoid] = useState(profile.avoidColors.join(", "));
  const [bank, setBank] = useState("Vietcombank");
  const [account, setAccount] = useState("");
  const palette = paletteOf(profile.personalColor);

  useEffect(() => {
    setColor(profile.personalColor ?? "spring_warm");
    setBest(profile.bestColors.join(", "));
    setAvoid(profile.avoidColors.join(", "));
  }, [profile.personalColor, profile.bestColors, profile.avoidColors]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-[1.4rem] border border-[#eadfd4] bg-white p-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm ${tab === item.id ? "bg-[#241c18] text-white" : "hover:bg-[#f6f1ea]"}`}
          >
            {item.label}
          </button>
        ))}
      </aside>
      <section className="rounded-[1.4rem] border border-[#eadfd4] bg-white p-5">
        {tab === "info" ? (
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              updateProfile({
                name: String(data.get("name") ?? ""),
                dob: String(data.get("dob") ?? ""),
                email: String(data.get("email") ?? ""),
                phone: String(data.get("phone") ?? ""),
                address: String(data.get("address") ?? ""),
              });
            }}
          >
            <Field label="Tên" name="name" defaultValue={profile.name} />
            <label className="text-sm">ID
              <input value={profile.code} readOnly className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] bg-[#f6f1ea] px-3" />
            </label>
            <Field label="Ngày sinh" name="dob" type="date" defaultValue={profile.dob} />
            <Field label="Email" name="email" defaultValue={profile.email} />
            <Field label="Số điện thoại" name="phone" defaultValue={profile.phone} />
            <Field label="Địa chỉ" name="address" defaultValue={profile.address} />
            <button className="h-10 rounded-full bg-[#9a3e49] text-sm text-white sm:col-span-2">Lưu thông tin</button>
          </form>
        ) : null}

        {tab === "color" ? (
          <div>
            <p className="text-sm text-[#5c4b44]">
              Personal color hiện tại: <strong>{palette ? palette.label : "Chưa có"}</strong>
              {profile.colorSource === "test" ? " · từ bài test" : profile.colorSource === "manual" ? " · bạn tự điền" : ""}
            </p>
            {palette ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Swatches title="Best color" items={profile.bestColors.length ? profile.bestColors.map((name) => ({ name, hex: "#e7b4b8" })) : palette.best} />
                <Swatches title="Avoid color" items={profile.avoidColors.length ? profile.avoidColors.map((name) => ({ name, hex: "#d9cdc4" })) : palette.avoid} />
              </div>
            ) : null}
            <form
              className="mt-6 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                saveManualColor(
                  color,
                  best.split(",").map((item) => item.trim()).filter(Boolean),
                  avoid.split(",").map((item) => item.trim()).filter(Boolean),
                );
              }}
            >
              <label className="text-sm">Tự điền personal color, không cần test
                <select value={color} onChange={(event) => setColor(event.target.value as ColorKey)} className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3">
                  {PALETTES.map((item) => (
                    <option key={item.key} value={item.key}>{item.label}</option>
                  ))}
                </select>
              </label>
              <Field label="Best color (cách nhau bởi dấu phẩy)" name="best" value={best} onChange={setBest} />
              <Field label="Avoid color" name="avoid" value={avoid} onChange={setAvoid} />
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-[#241c18] px-4 py-2 text-sm text-white">Lưu hồ sơ màu</button>
                <Link href="/test-mau" className="rounded-full border border-[#eadfd4] px-4 py-2 text-sm">Làm lại bài test</Link>
              </div>
            </form>
            <div className="mt-6">
              <p className="text-sm font-medium">Các lần test đã lưu</p>
              {profile.tests.length === 0 ? <p className="mt-2 text-sm text-[#7d6c63]">Chưa có bài test nào.</p> : (
                <ul className="mt-2 space-y-2 text-sm">
                  {profile.tests.map((test) => (
                    <li key={test.id} className="rounded-xl bg-[#f6f1ea] px-3 py-2">
                      {colorLabel(test.result)} · {new Date(test.at).toLocaleString("vi-VN")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}

        {tab === "pay" ? (
          <div>
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!account.trim()) return;
                addPayment(bank, account.trim());
                setAccount("");
              }}
            >
              <input value={bank} onChange={(event) => setBank(event.target.value)} className="h-10 rounded-full border border-[#eadfd4] px-3 text-sm" placeholder="Ngân hàng" />
              <input value={account} onChange={(event) => setAccount(event.target.value)} className="h-10 flex-1 rounded-full border border-[#eadfd4] px-3 text-sm" placeholder="Số tài khoản / ví" />
              <button className="rounded-full bg-[#9a3e49] px-4 text-sm text-white">Thêm</button>
            </form>
            <ul className="mt-4 space-y-2">
              {profile.payments.map((method) => (
                <li key={method.id} className="flex items-center justify-between rounded-xl bg-[#f6f1ea] px-3 py-2 text-sm">
                  <span>{method.label} · {method.value}</span>
                  <button onClick={() => removePayment(method.id)} className="text-[#9a3e49]">Xóa</button>
                </li>
              ))}
              {profile.payments.length === 0 ? <li className="text-sm text-[#7d6c63]">Chưa liên kết ngân hàng. Có thể thanh toán COD khi đặt hàng.</li> : null}
            </ul>
          </div>
        ) : null}

        {tab === "orders" ? (
          <div>
            <div className="flex gap-2 overflow-x-auto">
              {ORDER_STATUS.map((status) => (
                <button key={status.id} onClick={() => setOrderTab(status.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${orderTab === status.id ? "bg-[#241c18] text-white" : "bg-[#f6f1ea]"}`}>
                  {status.label}
                </button>
              ))}
            </div>
            <ul className="mt-4 space-y-3">
              {profile.orders.filter((order) => order.status === orderTab).map((order) => (
                <li key={order.id} className="rounded-2xl border border-[#eadfd4] p-3 text-sm">
                  <p className="font-medium">{order.code} · {formatVnd(order.total)}</p>
                  <p className="text-[#7d6c63]">{order.items.map((item) => item.name).join(", ")}</p>
                </li>
              ))}
              {profile.orders.filter((order) => order.status === orderTab).length === 0 ? (
                <li className="text-sm text-[#7d6c63]">Không có đơn ở trạng thái này.</li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {tab === "history" ? (
          <div className="grid gap-6">
            <div>
              <p className="font-medium">Lịch sử mua hàng</p>
              <ul className="mt-2 space-y-2 text-sm">
                {profile.orders.map((order) => (
                  <li key={order.id}>{order.code} · {formatVnd(order.total)} · {new Date(order.createdAt).toLocaleDateString("vi-VN")}</li>
                ))}
                {profile.orders.length === 0 ? <li className="text-[#7d6c63]">Chưa có đơn nào.</li> : null}
              </ul>
            </div>
            <div>
              <p className="font-medium">Lịch sử tư vấn AI</p>
              <ul className="mt-2 space-y-2 text-sm">
                {profile.consultations.map((item) => (
                  <li key={item.id} className="rounded-xl bg-[#f6f1ea] px-3 py-2">
                    <p className="font-medium">{item.message}</p>
                    <p className="text-[#5c4b44]">{item.reply.slice(0, 180)}</p>
                  </li>
                ))}
                {profile.consultations.length === 0 ? <li className="text-[#7d6c63]">Chưa trò chuyện với Liti.</li> : null}
              </ul>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm sm:col-span-1">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="mt-1 h-10 w-full rounded-full border border-[#eadfd4] px-3 outline-none focus:border-[#c96b78]"
      />
    </label>
  );
}

function Swatches({ title, items }: { title: string; items: { name: string; hex: string }[] }) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item.name} className="inline-flex items-center gap-2 rounded-full border border-[#eadfd4] px-2 py-1 text-xs">
            <span className="size-3 rounded-full" style={{ background: item.hex }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
