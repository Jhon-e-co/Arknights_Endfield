import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import { MusicProvider } from "@/context/music-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.endfieldlab.info'),
  alternates: {
    canonical: './',
  },
  title: {
    default: "Endfield Lab - The Best Arknights: Endfield Tools & Wiki",
    template: "%s | Endfield Lab - Community Blueprints & Tools",
  },
  description: "Share and discover automation blueprints, squad builds, and guides for Arknights: Endfield, enhancing your industrial empire.",
  keywords: ["Arknights Endfield", "Endfield Lab", "Endfield Tools", "Blueprints", "Squads", "Team Builds", "Guides", "Wiki"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.endfieldlab.info",
    siteName: "Endfield Lab",
    title: "Endfield Lab - The Best Arknights: Endfield Tools & Wiki",
    description: "Share and discover automation blueprints, squad builds, and guides for Arknights: Endfield, enhancing your industrial empire.",
    images: [
      {
        url: "/Logo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Endfield Lab - Arknights: Endfield Tools & Wiki",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Endfield Lab - The Best Arknights: Endfield Tools & Wiki",
    description: "Share and discover automation blueprints, squad builds, and guides for Arknights: Endfield, enhancing your industrial empire.",
    images: ["/Logo/og-image.png"],
    creator: "@endfieldlab",
  },
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
        <MusicProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
        </MusicProvider>
      </body>
    </html>
  );
}