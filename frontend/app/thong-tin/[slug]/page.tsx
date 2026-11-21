import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { infoPages } from "@/lib/catalog";

type Params = { slug: string };

export function generateStaticParams() {
  return infoPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: infoPages().find((page) => page.slug === slug)?.title ?? "Litibox" };
}

export default async function InfoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = infoPages().find((item) => item.slug === slug);
  if (!page) notFound();
  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Litibox</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{page.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-[#3d312c]">{page.body}</p>
      {slug === "lien-he" ? (
        <p className="mt-6 text-sm">Điện thoại 1900 6868 · hello@litibox.vn · 9:00–21:00 mỗi ngày</p>
      ) : null}
    </article>
  );
}
