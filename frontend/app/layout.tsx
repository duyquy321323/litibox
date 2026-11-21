import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { SiteShell } from "@/components/shop/site-shell";

import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: {
    default: "Litibox — set makeup theo personal color",
    template: "%s | Litibox",
  },
  description: "Cửa hàng set makeup phối sẵn theo personal color. Không kem nền.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={sans.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
