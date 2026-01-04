import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://endfieldlab.info'),
  title: {
    default: "ENDFIELD LAB | Unofficial Global Toolkit",
    template: "%s | ENDFIELD LAB",
  },
  description: "The ultimate research lab for Arknights: Endfield. Featuring factory blueprints, interactive map, character builds, and efficiency tools.",
  keywords: ["Arknights Endfield", "Endfield Lab", "Endfield Tools", "Blueprints", "Interactive Map", "Tier List"],
  icons: {
    icon: [
      { url: '/Logo/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/Logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/Logo/favicon.ico',
    apple: '/Logo/logo-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-zinc-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
      </body>
    </html>
  );
}