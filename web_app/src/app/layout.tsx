
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
  title: "Objektifimden Kütahya’da Ramazan Fotoğraf Yarışması 2026",
  description: "Kütahya Dumlupınar Üniversitesi ve Yüzüncü Yıl Derneği iş birliğiyle düzenlenen ödüllü fotoğraf yarışması. Ramazan'ın manevi ruhunu ve Kütahya'nın kültürünü yansıtan karelerinizi bekliyoruz.",
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
