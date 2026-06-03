import { UploadCloud, CheckCircle, Shield, Lock } from "lucide-react";
import Link from "next/link";
import "../theme.css";

export default function TestDeViabilidad() {
  return (
    <div className="pt-32 pb-20 md:py-48 px-8 min-h-screen bg-background">
      <main className="max-w-screen-xl mx-auto">
        <div className="mb-16 md:mb-24 text-center">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6">Portal de Recepción Segura</p>
          <h1 className="font-headline text-5xl md:text-7xl text-white font-light mb-8 max-w-4xl mx-auto">
            Test de Viabilidad.
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

          {/* Tarjeta de Acceso Seguro */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container border border-secondary/20 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex p-4 rounded-full bg-secondary/10 border border-secondary/20 mb-2">
                  <Lock className="w-10 h-10 text-secondary animate-pulse" />
                </div>
                <h3 className="font-headline text-3xl text-white font-light">Acceso Seguro al Portal</h3>
                <div className="editorial-line max-w-xs mx-auto opacity-30 my-4"></div>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
                  Por motivos de estricta confidencialidad y secreto profesional, la carga de documentación sensible y el análisis técnico-legal se realizan de forma exclusiva dentro de nuestro **Portal de Cliente**.
                </p>
              </div>

              <div className="bg-surface-container-low/40 p-6 border border-white/5 rounded-xl text-left space-y-4 max-w-md mx-auto relative z-10">
                <h4 className="text-xs uppercase tracking-widest text-secondary font-semibold font-label">Pasos para iniciar el análisis:</h4>
                <ol className="text-xs text-white/70 font-body space-y-3 list-decimal list-inside">
                  <li><strong>Regístrese</strong> en el sistema con sus datos de contacto.</li>
                  <li>Inicie su expediente digital de <strong>Test de Viabilidad</strong> con un clic.</li>
                  <li>Suba los archivos solicitados de forma <strong>segura y encriptada</strong>.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto relative z-10">
                <Link
                  href="/registro"
                  className="w-full sm:w-auto flex-1 inline-flex h-12 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer shadow-lg font-label"
                >
                  Crear Cuenta de Cliente
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex-1 inline-flex h-12 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all duration-300 rounded-sm items-center justify-center gap-2 cursor-pointer font-label"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
