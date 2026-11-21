"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Item } from "@/types/api";

const inputClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function ItemForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await apiFetch<Item>("/api/items", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: description || null,
          price,
          is_active: true,
        }),
      });
      setName("");
      setDescription("");
      setPrice("0");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo sản phẩm thất bại");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Giá (VD: 199000)"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          inputMode="decimal"
        />
      </div>
      <input
        className={inputClass}
        placeholder="Mô tả (không bắt buộc)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      {error && <p className="text-sm text-destructive">✖ {error}</p>}

      <Button type="submit" disabled={pending}>
        <Plus />
        {pending ? "Đang lưu..." : "Thêm sản phẩm"}
      </Button>
    </form>
  );
}
