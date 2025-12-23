import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 使用 Google Font
import "./globals.css"; // 👈 关键：必须引入 CSS
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Endfield Tools | Unofficial Global Toolkit",
  description: "Blueprints, Interactive Map, and Calculators for Arknights: Endfield.",
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
      </body>
    </html>
  );
}