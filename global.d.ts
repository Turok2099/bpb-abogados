declare module 'react-whatsapp-widget' {
  import * as React from 'react';

  export interface WhatsAppWidgetProps {
    phoneNumber: string;
    companyName?: string;
    message?: string;
    replyTimeText?: string;
    sendButtonText?: string;
    [key: string]: any;
  }

  export const WhatsAppWidget: React.FC<WhatsAppWidgetProps>;
}
