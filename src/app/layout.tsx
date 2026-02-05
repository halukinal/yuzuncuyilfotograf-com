
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
  title: "Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği | Fotoğraf Yarışması 2026",
  description: "Kütahya Dumlupınar Üniversitesi ve Yüzüncü Yıl Derneği iş birliğiyle düzenlenen ödüllü fotoğraf yarışması. Ramazan'ın manevi ruhunu ve Kütahya'nın kültürünü yansıtan karelerinizi bekliyoruz.",
  keywords: ["fotoğraf yarışması", "Kütahya", "DPÜ", "Dumlupınar Üniversitesi", "Ramazan", "yüzüncü yıl derneği", "Kütahya Ramazan", "sanat", "kültür", "yarışma", "ödüllü yarışma"],
  authors: [{ name: "Yüzüncü Yıl Derneği" }],
  creator: "Yüzüncü Yıl Derneği",
  publisher: "Yüzüncü Yıl Derneği",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yuzuncuyilfotograf.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği | Fotoğraf Yarışması 2026",
    description: "Ramazan'ın manevi ruhunu Kütahya'nın köşe bucağında senin gözünden görmek istiyoruz. Ödüllü fotoğraf yarışmasına hemen başvur!",
    url: 'https://yuzuncuyilfotograf.com',
    siteName: 'Yüzüncü Yıl Fotoğraf Yarışması',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Kütahya’da Ramazan Fotoğraf Yarışması',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Yüzüncü Yıl Tarih Kültür Sanat ve Fotoğraf Derneği | Fotoğraf Yarışması 2026",
    description: "Ramazan'ın manevi ruhunu Kütahya'nın köşe bucağında senin gözünden görmek istiyoruz. Ödüllü fotoğraf yarışmasına hemen başvur!",
    images: ['/hero-bg.png'],
  },
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
