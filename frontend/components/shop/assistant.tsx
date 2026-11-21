"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

import { ProductArt } from "@/components/shop/product-art";
import { runAgent, type AgentPending, type QuickReply } from "@/lib/agent";
import { formatVnd, priceOf } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: { slug: string; name: string; tone: string; price: number }[];
  quickReplies?: QuickReply[];
  voucher?: string | null;
};

const STARTERS: QuickReply[] = [
  { label: "Theo personal color của tôi", message: "Tìm sản phẩm theo personal color của tôi" },
  { label: "Tôi chưa biết màu của mình", message: "Tôi chưa biết mình thuộc màu nào" },
  { label: "Dưới 400k", message: "Tìm sản phẩm dưới 400k" },
  { label: "Set quà tặng", message: "Tôi muốn đặt set quà tặng kèm thiệp" },
];

export function Assistant() {
  const router = useRouter();
  const { profile, addToCart, logConsult } = useShop();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<AgentPending | null>(null);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "hello",
      role: "assistant",
      text: "Mình là Liti. Mình tự lấy personal color trong hồ sơ, hỏi tầm giá và phong cách, rồi lọc set, áp mã và giữ lời nhắn thiệp cho bạn.",
      quickReplies: STARTERS,
    },
  ]);

  function push(text: string) {
    const turn = runAgent(text, profile.personalColor, pending);
    setPending(turn.pending);
    logConsult(text, turn.reply);
    const productCards = turn.products.map((product) => ({
      slug: product.slug,
      name: product.name,
      tone: product.tone,
      price: priceOf(product),
    }));
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: turn.reply,
        products: productCards,
        quickReplies: turn.quickReplies,
        voucher: turn.voucher,
      },
    ]);
    if (turn.actions.some((action) => action.type === "open-test") && /mở bài test|làm bài test/i.test(text)) {
      router.push("/test-mau");
    }
    const noteAction = turn.actions.find((action) => action.type === "save-note" && action.slug && action.note);
    if (noteAction?.slug && noteAction.note) addToCart(noteAction.slug, 1, noteAction.note);
    const addAction = turn.actions.find((action) => action.type === "add" && action.slug);
    if (addAction?.slug && /bỏ qua|thêm món/i.test(text)) addToCart(addAction.slug, 1);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    push(text);
  }

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    drag.current = {
      dx: event.clientX - (window.innerWidth - pos.x - 56),
      dy: event.clientY - (window.innerHeight - pos.y - 56),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    drag.current.moved = true;
    const x = window.innerWidth - (event.clientX - drag.current.dx) - 56;
    const y = window.innerHeight - (event.clientY - drag.current.dy) - 56;
    setPos({
      x: Math.min(Math.max(x, 12), window.innerWidth - 72),
      y: Math.min(Math.max(y, 12), window.innerHeight - 72),
    });
  }

  return (
    <>
      {open ? (
        <section className="fixed right-3 bottom-3 z-50 flex h-[min(640px,calc(100dvh-1.5rem))] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.6rem] border border-[#eadfd4] bg-[#fffdfb] shadow-[0_24px_80px_rgba(50,20,20,.18)]">
          <header className="flex items-start justify-between gap-3 bg-[#241c18] px-4 py-3 text-[#f6efe8]">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-[#e7b4b8]" /> Liti · trợ lý phối màu
              </p>
              <p className="mt-1 text-[11px] text-[#d9cdc4]">Agentic: tự tìm tone, lọc giá, áp mã, lưu thiệp</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng chat" className="rounded-full p-1 hover:bg-white/10">
              <X className="size-4" />
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#9a3e49] px-3 py-2 text-sm text-white"
                      : "max-w-[95%] rounded-2xl rounded-bl-md bg-[#f6f1ea] px-3 py-2 text-sm whitespace-pre-line text-[#241c18]"
                  }
                >
                  {message.text}
                  {message.voucher ? (
                    <p className="mt-2 text-xs font-medium text-[#9a3e49]">Mã đang tính: {message.voucher}</p>
                  ) : null}
                  {message.products && message.products.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {message.products.map((product) => (
                        <div key={product.slug} className="flex items-center gap-2 rounded-xl bg-white p-1.5">
                          <ProductArt
                            product={{
                              ...product,
                              brand: "",
                              code: "",
                              segment: "mid",
                              category: "set",
                              styles: [],
                              colors: [],
                              needs: [],
                              salePrice: product.price,
                              stock: 1,
                              short: "",
                              description: "",
                              details: [],
                              rating: 5,
                              sold: 0,
                              best: false,
                              gift: false,
                              combo: false,
                            }}
                            className="size-12 shrink-0 rounded-lg"
                          />
                          <div className="min-w-0 flex-1">
                            <Link href={`/san-pham/${product.slug}`} className="line-clamp-2 text-xs font-medium">
                              {product.name}
                            </Link>
                            <p className="text-xs text-[#9a3e49]">{formatVnd(product.price)}</p>
                          </div>
                          <button
                            className="rounded-full bg-[#241c18] px-2 py-1 text-[11px] text-white"
                            onClick={() => addToCart(product.slug, 1)}
                          >
                            Thêm
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {message.quickReplies && message.quickReplies.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.quickReplies.map((reply) => (
                        <button
                          key={reply.label}
                          onClick={() => push(reply.message)}
                          className="rounded-full border border-[#e4cfc3] bg-white px-2.5 py-1 text-[11px] text-[#6d3d45]"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 border-t border-[#eadfd4] p-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Nhắn Liti: set daily dưới 400k..."
              className="h-10 min-w-0 flex-1 rounded-full border border-[#eadfd4] px-3 text-sm outline-none focus:border-[#c96b78]"
            />
            <button className="grid size-10 place-items-center rounded-full bg-[#9a3e49] text-white" aria-label="Gửi">
              <Send className="size-4" />
            </button>
          </form>
        </section>
      ) : (
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => {
            if (drag.current && !drag.current.moved) setOpen(true);
            drag.current = null;
          }}
          style={{ right: pos.x, bottom: pos.y }}
          className="fixed z-50 flex touch-none items-center gap-2 rounded-full bg-[#9a3e49] py-3 pr-4 pl-3 text-sm text-white shadow-[0_12px_30px_rgba(154,62,73,.35)]"
        >
          <MessageCircle className="size-5" />
          Liti
        </button>
      )}
    </>
  );
}
