"use client";

import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

export function WhatsAppWrapper() {
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
