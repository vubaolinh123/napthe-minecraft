import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thống Kê Nạp Tiền | Minecraft Server Dashboard",
  description: "Dashboard thống kê nạp tiền game Minecraft - Theo dõi doanh thu, giao dịch và lợi nhuận theo thời gian thực. Hỗ trợ thẻ điện thoại, thẻ game và chuyển khoản ngân hàng.",
  keywords: ["minecraft", "nạp tiền", "thống kê", "dashboard", "game", "server", "doanh thu"],
  authors: [{ name: "Minecraft Server Admin" }],
  openGraph: {
    title: "Thống Kê Nạp Tiền | Minecraft Server",
    description: "Dashboard thống kê nạp tiền game Minecraft server",
    type: "website",
    locale: "vi_VN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
