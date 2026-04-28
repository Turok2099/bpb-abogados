import { UploadCloud, CheckCircle, Shield } from "lucide-react";
import "../theme.css";

export default function FastTrack() {
  return (
    <div className="pt-32 pb-20 md:py-48 px-8 min-h-screen bg-background">
      <main className="max-w-screen-xl mx-auto">
        <div className="mb-16 md:mb-24 text-center">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6">Portal de Recepción Segura</p>
          <h1 className="font-headline text-5xl md:text-7xl text-white font-light mb-8 max-w-4xl mx-auto">
            Evaluación Fast-Track.
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Inicie el análisis de viabilidad de su proyecto adjuntando la documentación básica. Nuestro equipo técnico-legal revisará los antecedentes con estricta confidencialidad en un plazo de 48 horas.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Instrucciones e Insumos */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-headline text-3xl text-white mb-6">Insumos Requeridos</h2>
              <p className="font-body text-on-surface-variant leading-relaxed mb-8">
                Para garantizar un diagnóstico preciso de la infraestructura eléctrica y determinar la viabilidad de recupero, necesitamos copias digitalizadas de la siguiente documentación:
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Documentación Base</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Contratos de Fideicomiso o Estatuto, acreditación de personería y facturas detalladas de la obra eléctrica.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1">Consorcios Conformados</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Si el consorcio ya está conformado, sume el Reglamento de Copropiedad, el Plano PH y el acta de asamblea.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-low p-8 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-secondary" />
                <h3 className="font-headline text-xl text-white">Confidencialidad Absoluta</h3>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Toda la información remitida está amparada por secreto profesional y será utilizada exclusivamente para el análisis de viabilidad técnica y legal contra las empresas distribuidoras.
              </p>
            </div>
          </div>

          {/* Formulario de Subida */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container border border-secondary/20 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full"></div>
              
              <form className="relative z-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-white/70">Nombre Completo</label>
                    <input className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-3 text-white outline-none" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-white/70">Cargo / Empresa</label>
                    <input className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-3 text-white outline-none" type="text" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-white/70">Email Corporativo</label>
                    <input className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-3 text-white outline-none" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-widest text-white/70">Teléfono / WhatsApp</label>
                    <input className="w-full bg-transparent border-b-2 border-white/20 focus:border-secondary transition-colors py-3 text-white outline-none" type="tel" />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <label className="text-xs font-label uppercase tracking-widest text-white/70">Carga de Documentación (PDF, JPG, PNG, ZIP)</label>
                  <label className="border-2 border-dashed border-white/20 hover:border-secondary/50 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer group bg-surface-container-low/50 block">
                    <UploadCloud className="w-12 h-12 text-secondary/50 group-hover:text-secondary mb-4 transition-colors" />
                    <p className="text-white font-medium mb-2">Haga clic o arrastre sus archivos aquí</p>
                    <p className="text-on-surface-variant text-sm">Tamaño máximo por archivo: 20MB</p>
                    <input type="file" multiple className="hidden" />
                  </label>
                </div>

                <div className="pt-8">
                  <button type="button" className="w-full bg-secondary text-surface-container font-bold text-sm tracking-[0.2em] uppercase py-5 rounded-sm hover:bg-white transition-colors duration-300">
                    ENVIAR DOCUMENTACIÓN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
