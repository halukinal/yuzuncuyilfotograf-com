
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği",
  description: "Kütahya Dumlupınar Üniversitesi ve Yüzüncü Yıl Derneği iş birliğiyle düzenlenen ödüllü fotoğraf yarışması. Ramazan'ın manevi ruhunu ve Kütahya'nın kültürünü yansıtan karelerinizi bekliyoruz.",
  icons: {
    icon: [
      { url: "/dernek-logo.jpeg" },
      { url: "/dernek-logo.jpeg", sizes: "32x32", type: "image/jpeg" },
    ],
    shortcut: "/dernek-logo.jpeg",
    apple: "/dernek-logo.jpeg",
  }
};

import { CacheClearer } from "@/components/CacheClearer";
import { CountdownGuard } from "@/components/CountdownGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-neutral-950 text-neutral-100`}
      >
        <CacheClearer />
        <CountdownGuard>
          {children}
        </CountdownGuard>
        <Toaster />
      </body>
    </html>
  );
}
