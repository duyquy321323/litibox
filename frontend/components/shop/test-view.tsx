"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { QUESTIONS, paletteOf, resolveColor, scoreAnswers, type ColorKey } from "@/lib/catalog";
import { useShop } from "@/lib/shop";

export function TestView() {
  const router = useRouter();
  const { saveTest } = useShop();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ColorKey | null>(null);
  const question = QUESTIONS[step];
  const palette = paletteOf(result);

  if (palette && result) {
    return (
      <div className="mx-auto max-w-xl rounded-[1.6rem] bg-white p-6">
        <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Kết quả đã lưu vào hồ sơ</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{palette.label}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5c4b44]">{palette.description}</p>
        <p className="mt-3 text-sm">{palette.makeup}</p>
        <div className="mt-4 flex gap-2">
          {palette.best.map((color) => (
            <span key={color.name} className="h-10 flex-1 rounded-xl" style={{ background: color.hex }} title={color.name} />
          ))}
        </div>
        <button onClick={() => router.push("/kham-pha")} className="mt-6 rounded-full bg-[#9a3e49] px-5 py-2.5 text-sm text-white">
          Xem set hợp tone
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs tracking-[0.16em] text-[#9a3e49] uppercase">Câu {step + 1} / {QUESTIONS.length}</p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#eadfd4]">
        <div className="h-full bg-[#9a3e49]" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{question.question}</h2>
      {question.hint ? <p className="mt-1 text-sm text-[#7d6c63]">{question.hint}</p> : null}
      <div className="mt-5 space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              const next = { ...answers, [question.id]: option.id };
              setAnswers(next);
              if (step + 1 >= QUESTIONS.length) {
                const scores = scoreAnswers(next);
                const color = resolveColor(scores);
                saveTest(color, scores);
                setResult(color);
              } else {
                setStep((value) => value + 1);
              }
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#eadfd4] bg-white px-3 py-3 text-left text-sm hover:border-[#c96b78]"
          >
            <span className="size-8 shrink-0 rounded-full border border-black/5" style={{ background: option.swatch }} />
            {option.label}
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button onClick={() => setStep((value) => value - 1)} className="mt-4 text-sm text-[#7d6c63]">Quay lại</button>
      ) : null}
    </div>
  );
}
