import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/src/i18n/request';
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import { MusicProvider } from "@/context/music-context";
import '../globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.endfieldlab.info'),
  alternates: {
    canonical: './',
    languages: {
      'en': '/en',
      'zh-CN': '/zh-CN',
      'ja': '/ja',
      'ko': '/ko',
      'zh-TW': '/zh-TW',
      'ru': '/ru',
      'th': '/th',
      'vi': '/vi'
    }
  },
  title: {
    default: "Endfield Lab | All-in-One Arknights: Endfield Tool & Wiki",
    template: "%s | Endfield Lab - Community Blueprints & Tools",
  },
  description: "The ultimate toolkit for Arknights: Endfield. Share and discover automation blueprints, interactive map, production calculator, squad builds, and guides for Global Server players.",
  keywords: ["Arknights Endfield", "Endfield Lab", "Endfield Tools", "Blueprints", "Map", "Calculator", "Squads", "Team Builds", "Guides", "Wiki"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.endfieldlab.info",
    siteName: "Endfield Lab",
    title: "Endfield Lab | All-in-One Arknights: Endfield Tool & Wiki",
    description: "The ultimate toolkit for Arknights: Endfield. Share and discover automation blueprints, interactive map, production calculator, squad builds, and guides for Global Server players.",
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
    title: "Endfield Lab | All-in-One Arknights: Endfield Tool & Wiki",
    description: "The ultimate toolkit for Arknights: Endfield. Share and discover automation blueprints, interactive map, production calculator, squad builds, and guides for Global Server players.",
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

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) { // eslint-disable-line @typescript-eslint/no-explicit-any
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-zinc-900`}>
        <NextIntlClientProvider messages={messages}>
          <MusicProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
          </MusicProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}