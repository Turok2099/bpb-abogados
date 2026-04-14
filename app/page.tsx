import { Gavel, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header / Brand */}
        <div className="flex flex-col items-center mb-16 space-y-4 text-center">
          <Gavel className="text-4xl text-[#ffad34]" />
          <h1 className="text-3xl md:text-5xl font-newsreader font-extralight tracking-widest text-white uppercase italic">
            BPB Abogados
          </h1>
          <div className="h-[1px] w-24 bg-[#ffad34]/40 mt-4"></div>
          <p className="text-[#a0a0a0] font-manrope text-xs tracking-[0.3em] uppercase mt-6">
            Centro de Revisión de Propuestas Visuales
          </p>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link href="/propuesta-1" className="group block h-full">
            <div className="bg-[#111] border border-white/10 rounded-xl p-8 hover:border-[#ffad34]/50 hover:bg-[#1a1a1a] transition-all duration-500 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#001b44] border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[#ffad34] font-bold">P1</span>
                </div>
                <h3 className="text-xl font-newsreader text-white mb-2">Clásica &amp; Autoridad</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  Basada en tonos Navy y Ámbar. Transmite solidez institucional y liderazgo corporativo tradicional.
                </p>
              </div>
              <div className="mt-8 flex items-center text-[#ffad34] text-sm uppercase tracking-widest font-bold">
                <span className="mr-2">Ver Diseño</span>
                <ArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/propuesta-2" className="group block h-full">
            <div className="bg-[#111] border border-white/10 rounded-xl p-8 hover:border-[#d6620f]/50 hover:bg-[#1a1a1a] transition-all duration-500 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#0e1c2b] border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[#d6620f] font-bold">P2</span>
                </div>
                <h3 className="text-xl font-newsreader text-white mb-2">Agilidad &amp; Startups</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  Tonos Slate Oscuro y Mandarina. Orientada a la toma de decisiones rápidas y el mundo dinámico.
                </p>
              </div>
              <div className="mt-8 flex items-center text-[#d6620f] text-sm uppercase tracking-widest font-bold">
                <span className="mr-2">Ver Diseño</span>
                <ArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/propuesta-3" className="group block h-full">
            <div className="bg-[#111] border border-white/10 rounded-xl p-8 hover:border-[#a38245]/50 hover:bg-[#1a1a1a] transition-all duration-500 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-[#0b3b24] border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-[#a38245] font-bold">P3</span>
                </div>
                <h3 className="text-xl font-newsreader text-white mb-2">Boutique Financiera</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  Esmeralda Profundo y Champaña. Diseñada para Wealth Management y asesoramiento de alto patrimonio.
                </p>
              </div>
              <div className="mt-8 flex items-center text-[#a38245] text-sm uppercase tracking-widest font-bold">
                <span className="mr-2">Ver Diseño</span>
                <ArrowRight className="text-sm group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
