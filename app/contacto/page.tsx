import { MapPin, Mail } from "lucide-react";
import "../theme.css";

export default function Contacto() {
  return (
    <div className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6">Contacto Directo</p>
          <h1 className="font-headline text-5xl md:text-7xl text-white font-light mb-8">
            Inicie una consulta discreta.
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Analizamos cada caso bajo los más estrictos estándares de confidencialidad y rigor analítico. Permítanos ser su socio estratégico en la toma de decisiones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-surface-container border border-secondary/20 text-white p-10 md:p-16 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full"></div>
            <form className="space-y-12 relative z-10">
              <div className="relative">
                <input aria-label="Nombre Completo" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="NOMBRE COMPLETO" type="text" />
              </div>
              <div className="relative">
                <input aria-label="Empresa" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="EMPRESA / ORGANIZACIÓN" type="text" />
              </div>
              <div className="relative">
                <input aria-label="WhatsApp o Teléfono" className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label uppercase tracking-widest outline-none focus:ring-0 text-white placeholder-white/40" placeholder="WHATSAPP / TELÉFONO" type="tel" />
              </div>
              <div className="relative">
                <textarea aria-label="Asunto" rows={3} className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-4 px-0 text-sm font-label tracking-wide outline-none focus:ring-0 text-white placeholder-white/40 resize-none" placeholder="Breve descripción del caso o consulta..."></textarea>
              </div>
              <button aria-label="Solicitar Reunión" className="w-full bg-secondary text-primary py-6 text-sm font-bold tracking-[0.3em] hover:bg-white transition-all duration-300 rounded-sm mt-8" type="submit">SOLICITAR REUNIÓN</button>
            </form>
          </div>

          {/* Map and Info */}
          <div className="flex flex-col gap-10">
            <div className="bg-surface-container rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-full border border-white/5 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713578103!2d-58.38381532425986!3d-34.60373887295435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf11603ba5%3A0x8f2d5f0e34c0e628!2sBuenos%20Aires%2C%20CABA!5e0!3m2!1sen!2sar!4v1700000000000!5m2!1sen!2sar" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "grayscale(100%) invert(90%) hue-rotate(180deg) contrast(1.2)" }} 
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
                    Buenos Aires<br/>
                    Argentina
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-secondary w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-white font-headline text-xl mb-2">Email Directo</h3>
                  <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                    contacto@bpbabogados.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
