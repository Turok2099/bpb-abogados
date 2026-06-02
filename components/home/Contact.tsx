"use client";
import { toast } from "sonner";

import { useState } from "react";
import { submitContact } from "../../app/actions/leads";

export function Contact() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContact(null, formData);
    
    if (result.success) {
      toast.success("Hemos recibido sus datos y nos comunicaremos a la brevedad", {
        style: {
          background: 'var(--color-surface)',
          borderColor: 'var(--color-secondary)',
          color: 'var(--color-on-surface)'
        }
      });
      e.currentTarget.reset();
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
    <section id="contacto" className="py-20 md:py-32 px-4 md:px-8">
      <div className="max-w-screen-xl mx-auto bg-surface-container border border-secondary/20 text-white p-8 md:p-24 relative overflow-hidden rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary opacity-5 -rotate-12 translate-x-12 translate-y-12"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h2 className="font-headline text-3xl sm:text-4xl mb-6">Inicie una consulta.</h2>
            <p className="font-body text-white/70 leading-relaxed">
              Analizamos cada caso bajo los más estrictos estándares de confidencialidad y rigor analítico. Permítanos ser su socio estratégico en la toma de decisiones.
            </p>
          </div>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="relative">
              <input aria-label="Nombre Completo" name="nombre" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="NOMBRE COMPLETO *" type="text" required disabled={isPending} />
            </div>
            <div className="relative">
              <input aria-label="Correo Electrónico" name="email" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="CORREO ELECTRÓNICO *" type="email" required disabled={isPending} />
            </div>
            <div className="relative">
              <input aria-label="Empresa" name="empresa" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="EMPRESA / ORGANIZACIÓN" type="text" disabled={isPending} />
            </div>
            <div className="relative">
              <input aria-label="WhatsApp o Teléfono" name="telefono" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="WHATSAPP / TELÉFONO *" type="tel" required disabled={isPending} />
            </div>
            <div className="relative">
              <textarea aria-label="Asunto" name="mensaje" rows={3} className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label tracking-wide outline-none focus:ring-0 text-white placeholder-white/40 resize-none" placeholder="Breve descripción del caso o consulta... *" required disabled={isPending}></textarea>
            </div>
            <button aria-label="Solicitar Reunión" className="w-full bg-secondary text-primary py-6 text-sm font-bold tracking-[0.3em] hover:bg-white hover:text-primary transition-all duration-300 rounded-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isPending}>
              {isPending ? "ENVIANDO..." : "SOLICITAR REUNIÓN"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
