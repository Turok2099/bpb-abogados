"use client";

import { useEffect, useState } from 'react';
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

export function WhatsAppWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Return null on the server to prevent hydration mismatch
  }

  return (
    <div style={{ zIndex: 9999, position: 'relative' }}>
      <WhatsAppWidget 
        phoneNumber="+541100000000" 
        companyName="BPB Abogados" 
        message="¡Hola! 👋 ¿En qué podemos asesorarte?" 
        replyTimeText="Normalmente respondemos en minutos"
        sendButtonText="Enviar mensaje"
      />
    </div>
  );
}
