import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "BPB Abogados - Maquetas",
  description: "Propuestas de Diseño para el despacho legal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 text-white text-xs py-2 px-4 flex justify-center gap-6 items-center shadow-md hidden sm:flex">
          <span className="font-bold tracking-widest text-[#ffad34]">MAQUETADOR:</span>
          <Link href="/propuesta-1" className="hover:text-white transition-colors text-white/70 uppercase">Propuesta 1</Link>
          <Link href="/propuesta-2" className="hover:text-white transition-colors text-white/70 uppercase">Propuesta 2</Link>
          <Link href="/propuesta-3" className="hover:text-white transition-colors text-white/70 uppercase">Propuesta 3</Link>
        </nav>
        <div className="sm:mt-8">
          {children}
        </div>
      </body>
    </html>
  );
}
