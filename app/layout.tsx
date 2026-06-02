import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppWrapper } from "../components/WhatsAppWrapper";
import { Toaster } from "sonner";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BPB Abogados",
  description: "Despacho legal especializado en derecho corporativo y monetización de infraestructura en Argentina.",
  icons: {
    icon: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png",
    apple: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Ocultar Navbar, Footer y WhatsApp en login y administración
  const isSharedLayout = !pathname.startsWith('/admin') && !pathname.startsWith('/login');

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        {isSharedLayout && <Navbar />}
        <Toaster position="bottom-right" />
        <div className="w-full flex-grow">
          {children}
        </div>
        {isSharedLayout && <WhatsAppWrapper />}
        {isSharedLayout && <Footer />}
      </body>
    </html>
  );
}
