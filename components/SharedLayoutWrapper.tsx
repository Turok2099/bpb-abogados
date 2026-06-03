"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppWrapper } from './WhatsAppWrapper';

interface SharedLayoutWrapperProps {
  children: React.ReactNode;
}

export function SharedLayoutWrapper({ children }: SharedLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Hide Navbar, Footer, and WhatsAppWrapper in admin and login routes
  const isSharedLayout = pathname ? !pathname.startsWith('/admin') && !pathname.startsWith('/login') : true;

  return (
    <>
      {isSharedLayout && <Navbar />}
      <div className="w-full flex-grow">
        {children}
      </div>
      {isSharedLayout && <WhatsAppWrapper />}
      {isSharedLayout && <Footer />}
    </>
  );
}
