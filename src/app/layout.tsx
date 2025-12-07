import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import AnalyticsClient from "@/components/AnalyticsClient";
import PWAClient from "@/components/PWAClient";
import WhatsAppButton from "@/components/WhatsAppButton";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RRnagar.com — Hyperlocal Supply Platform",
  description: "Buy local in RR Nagar: products & services from trusted suppliers",
  metadataBase: new URL("https://rrnagar.com"),
  openGraph: {
    title: "RRnagar.com",
    description: "Buy local in RR Nagar: products & services from trusted suppliers",
    url: "https://rrnagar.com",
    siteName: "RRnagar.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "RRnagar.com — local shopping and services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RRnagar.com",
    description: "Buy local in RR Nagar: products & services from trusted suppliers",
    images: ["https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1200&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${kannada.variable} antialiased`}>
        <AnalyticsClient />
        <PWAClient />
        <NavBar />
        <WhatsAppButton />
        {children}
        <Footer />
      </body>
    </html>
  );
}
