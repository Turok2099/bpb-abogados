"use client";
import { MapPin, Mail } from "lucide-react";
import { toast } from "sonner";
import { CalendlyWidget } from "../../components/CalendlyWidget";

import { useState } from "react";
import { submitContact } from "../actions/leads";

export default function Contacto() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitContact(null, formData);
    
    if (result.success) {
      toast.success("Hemos recibido sus datos y nos comunicaremos a la brevedad", {
        style: {
          background: 'var(--color-surface)',
          borderColor: 'var(--color-secondary)',
          color: 'var(--color-on-surface)'
        }
      });
      form.reset();
    } else {
      toast.error(result.error || "Hubo un error al enviar el formulario", {
        style: {
          background: 'var(--color-surface)',
          borderColor: 'red',
          color: 'var(--color-on-surface)'
        }
      });
    }
    
    setIsPending(false);
  };
  return (
    <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6">Contacto Directo</p>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl text-white font-light mb-8">
            Inicie una consulta.
          </h1>
          <p className="font-body text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Analizamos cada caso bajo los más estrictos estándares de confidencialidad y rigor analítico. Permítanos ser su socio estratégico en la toma de decisiones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-surface-container border border-secondary/20 text-white p-10 md:p-16 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full"></div>
            <form className="space-y-12 relative z-10" onSubmit={handleSubmit}>
              <div className="relative">
                <input aria-label="Nombre Completo" name="nombre" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-base font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="NOMBRE COMPLETO *" type="text" required disabled={isPending} />
              </div>
              <div className="relative">
                <input aria-label="Correo Electrónico" name="email" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-base font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="CORREO ELECTRÓNICO *" type="email" required disabled={isPending} />
              </div>
              <div className="relative">
                <input aria-label="Empresa" name="empresa" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-base font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="EMPRESA / ORGANIZACIÓN" type="text" disabled={isPending} />
              </div>
              <div className="relative">
                <input aria-label="WhatsApp o Teléfono" name="telefono" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-base font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="WHATSAPP / TELÉFONO *" type="tel" required disabled={isPending} />
              </div>
              <div className="relative">
                <textarea aria-label="Asunto" name="mensaje" rows={3} className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-base font-label tracking-wide outline-none focus:ring-0 text-white placeholder-white/40 resize-none" placeholder="Breve descripción del caso o consulta... *" required disabled={isPending}></textarea>
              </div>
              <button aria-label="Solicitar Reunión" className="w-full bg-secondary text-primary py-6 text-base font-bold tracking-[0.3em] hover:bg-white transition-all duration-300 rounded-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isPending}>
                {isPending ? "ENVIANDO..." : "SOLICITAR REUNIÓN"}
              </button>
            </form>
          </div>

          {/* Map and Info */}
          <div className="flex flex-col gap-10">
            <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-full border border-white/5 relative">
              <iframe
                src="https://maps.google.com/maps?q=Bertoia%20Tower,%20Polo%20Hudson,%20Buenos%20Aires&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
              <div className="absolute inset-0 bg-secondary/10 pointer-events-none mix-blend-overlay"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-surface-container p-10 border border-white/5 rounded-2xl">
              <div className="flex items-start gap-4">
                <MapPin className="text-secondary w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-white font-headline text-xl mb-2">Ubicación</h3>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                    Bertoia Tower, Polo Hudson<br />
                    Au. Buenos Aires - La Plata Km. 30<br />
                    Buenos Aires, Argentina
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-secondary w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-white font-headline text-xl mb-2">Email Directo</h3>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                    contacto@bpbabogados.com.ar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendly Section */}
        <div className="mt-20 md:mt-32 pt-20 border-t border-white/5">
          <div className="text-center mb-12">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">Agendar Sesión</p>
            <h2 className="font-headline text-4xl text-white font-light">
              O agende directamente una videollamada.
            </h2>
          </div>
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent opacity-100 blur-3xl pointer-events-none"></div>
            <CalendlyWidget url="https://calendly.com/bpbabogados/30min?locale=es" />
          </div>
        </div>
      </div>
    </div>
  );
}
