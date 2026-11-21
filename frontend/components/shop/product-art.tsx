import { type Product, discountOf } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function ProductArt({
  product,
  variant = 0,
  className,
}: {
  product: Product;
  variant?: number;
  className?: string;
}) {
  const tone = product.tone;
  const shift = ["12%", "28%", "8%", "22%"][variant % 4];
  return (
    <div
      className={cn("relative overflow-hidden bg-[#fffaf6]", className)}
      style={{
        backgroundImage: `radial-gradient(120% 80% at ${shift} 0%, #fff 0%, transparent 46%), linear-gradient(165deg, #fffdfb 0%, ${tone}33 48%, ${tone} 100%)`,
      }}
    >
      <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-medium tracking-[0.16em] text-[#241c18]/70 uppercase">
        <span>{product.brand}</span>
        <span>{product.code}</span>
      </div>
      <div
        className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-[46%] rounded-full shadow-[inset_0_8px_18px_rgba(255,255,255,.65),0_16px_30px_rgba(60,30,20,.12)]"
        style={{
          background: `radial-gradient(circle at 32% 28%, #fff 0%, ${tone} 46%, #4a2c28 130%)`,
          transform: `translate(-50%, -46%) rotate(${variant * 8}deg)`,
        }}
      />
      {variant % 2 === 1 ? (
        <div className="absolute bottom-5 left-5 flex gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <span key={color} className="size-3 rounded-full border border-white/80" style={{ background: tone }} />
          ))}
        </div>
      ) : null}
      {product.gift ? (
        <span className="absolute right-4 bottom-4 rounded-full bg-[#241c18] px-2.5 py-1 text-[10px] tracking-wide text-white uppercase">
          Kèm thiệp
        </span>
      ) : null}
      {discountOf(product) > 0 ? (
        <span className="absolute top-12 left-4 rounded-full bg-[#9a3e49] px-2 py-0.5 text-[11px] font-semibold text-white">
          -{discountOf(product)}%
        </span>
      ) : null}
    </div>
  );
}
