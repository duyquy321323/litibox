"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { HealthResponse } from "@/types/api";

type PingState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: HealthResponse }
  | { kind: "error"; message: string };

/**
 * Nút test API từ TRÌNH DUYỆT -> chứng minh CORS + NEXT_PUBLIC_API_URL đã đúng.
 */
export function ApiPing() {
  const [state, setState] = useState<PingState>({ kind: "idle" });

  async function handleClick() {
    setState({ kind: "loading" });
    try {
      const data = await apiFetch<HealthResponse>("/api/health");
      setState({ kind: "success", data });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "Không gọi được API",
      });
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleClick} disabled={state.kind === "loading"} variant="outline">
        <RefreshCw className={state.kind === "loading" ? "animate-spin" : undefined} />
        {state.kind === "loading" ? "Đang gọi API..." : "Test gọi API từ trình duyệt"}
      </Button>

      {state.kind === "success" && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ✔ Kết nối OK — {state.data.app} v{state.data.version} ({state.data.env})
        </p>
      )}

      {state.kind === "error" && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          ✖ {state.message}
        </p>
      )}
    </div>
  );
}
