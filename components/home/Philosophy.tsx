export function Philosophy() {
  return (
    <section className="py-20 md:py-32 px-8 bg-surface-bright flex justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <p className="font-label text-sm uppercase tracking-[0.3em] text-secondary font-semibold mb-6 block">Nuestra filosofía</p>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl font-light leading-snug text-white max-w-4xl mx-auto">
            Nuestros resultados son nuestra mejor credencial.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-on-surface-variant font-body text-base md:text-lg leading-relaxed">
          <div className="space-y-6 text-justify-custom md:text-left">
            <p>
              Durante 16 años, los socios fundadores de BPB Abogados eligieron operar bajo un estricto perfil bajo. Nuestro crecimiento no se basó en publicidad, sino en la confianza inquebrantable de los clientes que nos confiaron la estructuración de sus sociedades y la resolución de sus conflictos más críticos.
            </p>
          </div>
          <div className="space-y-6 text-justify-custom md:text-left">
            <p>
              Hoy, el mercado exige transparencia y una mayor cercanía. La inauguración de nuestras nuevas oficinas marca el inicio de una nueva etapa: consolidamos nuestra presencia para poner nuestra metodología, nuestra red de contactos y nuestro rigor técnico al servicio de un grupo selecto de empresas e inversores que buscan un aliado estratégico a largo plazo.
            </p>
            <p className="font-semibold text-white">
              En <strong className="text-secondary font-semibold">BPB Abogados</strong> priorizamos un modelo de trabajo enfocado, en el que cada caso es liderado y ejecutado directamente por nuestros socios, garantizando alineación y seguimiento en cada etapa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
