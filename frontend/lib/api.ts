import { apiBaseUrl, apiInternalUrl } from "@/lib/config";

export type ApiFetchOptions = RequestInit & {
  /** true -> gọi bằng API_INTERNAL_URL (dùng trong server component) */
  server?: boolean;
};

/**
 * Wrapper fetch có type + xử lý lỗi thống nhất.
 * Luôn dùng hàm này thay vì gọi fetch trực tiếp rải rác trong component.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { server = false, headers, ...rest } = options;
  const baseUrl = server ? apiInternalUrl : apiBaseUrl;
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(server ? { cache: rest.cache ?? "no-store" } : {}),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `API ${response.status} ${response.statusText}${detail ? `: ${detail.slice(0, 300)}` : ""}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
