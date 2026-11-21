import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[#eadfd4] bg-[#241c18] text-[#f6efe8]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-2xl font-semibold tracking-[-0.04em]">
            liti<span className="text-[#e7b4b8]">box</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#d9cdc4]">
            100% mỹ phẩm chính hãng. Hoàn tiền 200% nếu phát hiện hàng giả.
          </p>
          <div className="mt-4 flex gap-2">
            <a className="rounded-full border border-white/15 px-3 py-1.5 text-xs" href="https://shopee.vn" target="_blank" rel="noreferrer">
              Shopee
            </a>
            <a className="rounded-full border border-white/15 px-3 py-1.5 text-xs" href="https://www.tiktok.com" target="_blank" rel="noreferrer">
              TikTok Shop
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.16em] text-[#e7b4b8] uppercase">Chăm sóc khách hàng</p>
          <ul className="mt-3 space-y-2 text-sm text-[#d9cdc4]">
            <li><Link href="/thong-tin/doi-tra">Chính sách đổi trả</Link></li>
            <li><Link href="/thong-tin/bao-mat">Bảo mật</Link></li>
            <li><Link href="/thong-tin/thanh-toan">Thanh toán</Link></li>
            <li><Link href="/thong-tin/dieu-khoan">Điều khoản dịch vụ</Link></li>
            <li><Link href="/thong-tin/huong-dan">Hướng dẫn mua hàng</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.16em] text-[#e7b4b8] uppercase">Về Litibox</p>
          <ul className="mt-3 space-y-2 text-sm text-[#d9cdc4]">
            <li><Link href="/thong-tin/gioi-thieu">Giới thiệu</Link></li>
            <li><Link href="/thong-tin/lien-he">Liên hệ góp ý</Link></li>
            <li><Link href="/thong-tin/hop-tac">Liên hệ hợp tác</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.16em] text-[#e7b4b8] uppercase">Giờ hoạt động</p>
          <p className="mt-3 text-sm text-[#d9cdc4]">9:00 – 21:00 mỗi ngày</p>
          <p className="mt-4 text-xs tracking-[0.16em] text-[#e7b4b8] uppercase">Góp ý khiếu nại</p>
          <p className="mt-3 text-sm text-[#d9cdc4]">1900 6868</p>
          <p className="text-sm text-[#d9cdc4]">hello@litibox.vn</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-[#b7a79c]">
        Litibox · Generative AI & AI-Generated Content trong TMĐT
      </div>
    </footer>
  );
}
