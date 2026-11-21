function trimTrailingSlash(value?: string): string {
  return value ? value.replace(/\/+$/, "") : "";
}

/**
 * URL dùng ở phía TRÌNH DUYỆT (client component).
 * NEXT_PUBLIC_* được nhúng vào bundle lúc build.
 */
export const apiBaseUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8000";

/**
 * URL dùng ở phía SERVER (server component / route handler).
 * Trong Docker, giá trị này là http://backend:8000 (mạng nội bộ compose).
 */
export const apiInternalUrl = trimTrailingSlash(process.env.API_INTERNAL_URL) || apiBaseUrl;

/** Link Swagger UI của backend */
export const apiDocsUrl = `${apiBaseUrl}/docs`;
