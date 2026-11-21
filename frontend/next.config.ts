import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bắt buộc để chạy production trong Docker (image gọn, chỉ cần server.js)
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
