"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { registrarDocumento, crearCasoCliente } from "@/app/actions/cases";
import { logout } from "@/app/actions/auth";
import { 
  FileText, UploadCloud, CheckCircle2, AlertTriangle, 
  Clock, LogOut, Loader2, Phone, Briefcase, FileCheck, ArrowUpRight 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Documento {
  id: string;
  nombre_archivo: string;
  url_archivo: string;
  estado: "pendiente" | "validado" | "rechazado";
  comentarios: string | null;
  created_at: string;
}

interface Caso {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: "en revision" | "en proceso" | "se requiere más informacion" | "completado";
  documentos_casos: Documento[];
}

interface DashboardClienteProps {
  user: { id: string; email: string };
  profile: { nombre: string; telefono: string } | null;
  initialCasos: Caso[];
}

export function DashboardCliente({ user, profile, initialCasos }: DashboardClienteProps) {
  const router = useRouter();
  const casos = initialCasos;
  const [uploadingCasoId, setUploadingCasoId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  const handleIniciarTest = async () => {
    setIsCreatingTest(true);
    try {
      const res = await crearCasoCliente();
      if (res.error) {
        toast.error(res.error, {
          style: { background: "var(--color-surface)", borderColor: "var(--color-error)", color: "var(--color-on-surface)" }
        });
      } else {
        toast.success("Test de Viabilidad iniciado correctamente.", {
          style: { background: "var(--color-surface)", borderColor: "var(--color-secondary)", color: "var(--color-on-surface)" }
        });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado al iniciar el test.");
    } finally {
      setIsCreatingTest(false);
    }
  };

  const handleFileUpload = async (casoId: string, file: File) => {
    if (!file) return;

    // Validación de tipo / tamaño (ej. máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo excede el tamaño máximo de 10MB.", {
        style: { background: "var(--color-surface)", borderColor: "var(--color-error)", color: "var(--color-on-surface)" }
      });
      return;
    }

    setUploadingCasoId(casoId);
    setUploadProgress(10);

    try {
      const supabase = createClient();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${user.id}/${casoId}/${Date.now()}_${sanitizedName}`;

      setUploadProgress(30);

      // Subir archivo al storage de Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documentos_casos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadProgress(70);

      // Registrar en la base de datos
      const res = await registrarDocumento({
        casoId,
        nombreArchivo: file.name,
        urlArchivo: uploadData.path
      });

      if (res.error) {
        throw new Error(res.error);
      }

      setUploadProgress(100);
      toast.success("Documento subido correctamente.", {
        style: { background: "var(--color-surface)", borderColor: "var(--color-secondary)", color: "var(--color-on-surface)" }
      });

      // Refrescar página para obtener el documento actualizado
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al subir el documento.");
    } finally {
      setUploadingCasoId(null);
      setUploadProgress(0);
    }
  };

  const getEstadoCasoStyles = (estado: Caso["estado"]) => {
    switch (estado) {
      case "en revision":
        return { text: "En Revisión", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", icon: Clock };
      case "en proceso":
        return { text: "En Proceso", color: "text-blue-400 border-blue-500/20 bg-blue-500/5", icon: Briefcase };
      case "se requiere más informacion":
        return { text: "Acción Requerida", color: "text-error border-error/20 bg-error/5", icon: AlertTriangle };
      case "completado":
        return { text: "Completado", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: CheckCircle2 };
    }
  };

  const getEstadoDocStyles = (estado: Documento["estado"]) => {
    switch (estado) {
      case "pendiente":
        return { text: "Pendiente", color: "text-amber-400/90 bg-amber-500/10" };
      case "validado":
        return { text: "Validado", color: "text-emerald-400 bg-emerald-500/10" };
      case "rechazado":
        return { text: "Rechazado", color: "text-error bg-error/10" };
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-outline-variant/20 py-4 px-6 md:px-8">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center shrink-0">
              <img 
                src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1779560163/BPB_Logo_Web_kqsqhh.png" 
                alt="BPB Abogados Logo" 
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="h-6 w-[1px] bg-outline-variant/35 hidden sm:block"></div>
            <div className="hidden sm:block text-xs uppercase tracking-widest text-secondary font-semibold">
              Portal del Cliente
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs text-white/60">
              Sesión iniciada como: <strong className="text-white">{profile?.nombre || user.email}</strong>
            </span>
            <form action={logout}>
              <button 
                type="submit" 
                className="h-9 px-4 border border-outline-variant/30 hover:border-error hover:text-error text-white/70 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer font-label"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="border-b border-outline-variant/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl text-white font-light">Hola, {profile?.nombre || 'Bienvenido'}</h1>
            <p className="text-sm text-white/50 mt-1 font-body">Sigue el estado de tu caso y gestiona tu documentación adjunta.</p>
          </div>
          {profile?.telefono && (
            <div className="flex items-center gap-2.5 bg-surface-container border border-outline-variant/20 px-4 py-2.5 rounded-sm text-xs text-white/70">
              <Phone className="w-4 h-4 text-secondary" />
              <span>Teléfono registrado: <strong>{profile.telefono}</strong></span>
            </div>
          )}
        </div>

        {casos.length === 0 ? (
          <div className="bg-surface-container border border-outline-variant/20 p-8 md:p-12 text-center rounded-sm space-y-8 max-w-2xl mx-auto mt-8 relative overflow-hidden">
            {/* Glow decorativo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-3xl rounded-full"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex p-4 rounded-full bg-secondary/10 border border-secondary/20 mb-2">
                <Briefcase className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-headline text-3xl text-white font-light">Iniciar Test de Viabilidad</h2>
              <div className="editorial-line max-w-xs mx-auto opacity-30 my-4"></div>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-lg mx-auto">
                Comience el análisis técnico-legal para evaluar la viabilidad de recupero de los costos de su infraestructura eléctrica. Para iniciar, debe habilitar su expediente digital de viabilidad.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-sm border border-outline-variant/15 text-left space-y-4 max-w-lg mx-auto relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-secondary font-semibold font-label">Insumos sugeridos para la carga posterior:</h3>
              <ul className="text-xs text-white/70 font-body space-y-2 list-disc list-inside">
                <li>Facturas de la obra eléctrica (distribuidora o contratista).</li>
                <li>Contrato de Fideicomiso, Reglamento de Copropiedad o Acta de Personería.</li>
                <li>Plano PH y planos de la instalación eléctrica.</li>
              </ul>
            </div>

            <div className="pt-4 relative z-10">
              <button
                onClick={handleIniciarTest}
                disabled={isCreatingTest}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer font-label"
              >
                {isCreatingTest ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Habilitando Expediente...
                  </>
                ) : (
                  <>
                    Comenzar Análisis de Viabilidad
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {casos.map((caso) => {
              const est = getEstadoCasoStyles(caso.estado);
              const EstIcon = est.icon;
              return (
                <div key={caso.id} className="bg-surface-container border border-outline-variant/20 rounded-sm overflow-hidden shadow-xl">
                  {/* Titulo & Estado */}
                  <div className="p-6 md:p-8 border-b border-outline-variant/20 bg-surface/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="text-[10px] text-secondary font-label uppercase tracking-widest mb-1.5">Expediente Activo</div>
                      <h2 className="font-headline text-2xl md:text-3xl text-white font-light">{caso.titulo}</h2>
                      {caso.descripcion && (
                        <p className="text-sm text-white/60 font-body mt-2 max-w-2xl">{caso.descripcion}</p>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm text-xs font-semibold uppercase tracking-wider ${est.color}`}>
                      <EstIcon className="w-4 h-4" />
                      <span>{est.text}</span>
                    </div>
                  </div>

                  {/* Detalle y Documentos */}
                  <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                    {/* Sección Subida */}
                    <div className="space-y-6">
                      <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-semibold">Subir Documentación</h3>
                      <p className="text-xs text-white/50 font-body leading-relaxed">
                        Selecciona o arrastra el archivo solicitado por tu gestor para validarlo (Formatos admitidos: PDF, JPG, PNG. Máx: 10MB).
                      </p>

                      <div className="relative">
                        <label 
                          className={`flex flex-col items-center justify-center border border-dashed rounded-sm p-8 text-center cursor-pointer transition-all hover:bg-white/[0.02]
                            ${uploadingCasoId === caso.id ? 'border-secondary/40 bg-secondary/5 pointer-events-none' : 'border-outline-variant/50 hover:border-secondary/50'}`}
                        >
                          <input 
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(caso.id, file);
                            }}
                            disabled={uploadingCasoId !== null}
                          />

                          {uploadingCasoId === caso.id ? (
                            <div className="space-y-4">
                              <Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" />
                              <div className="text-sm text-white font-medium">Subiendo archivo ({uploadProgress}%)</div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <UploadCloud className="w-8 h-8 text-white/40 mx-auto" />
                              <div className="text-sm text-white font-medium">Haga clic o arrastre un documento</div>
                              <div className="text-[10px] text-white/40 uppercase tracking-wider">PDF, PNG, JPG hasta 10MB</div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Lista Documentos */}
                    <div className="space-y-6">
                      <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-semibold">Documentos Adjuntos ({caso.documentos_casos.length})</h3>

                      {caso.documentos_casos.length === 0 ? (
                        <div className="border border-outline-variant/20 rounded-sm p-6 text-center text-white/45 text-xs font-body">
                          Aún no has subido ningún documento para este caso.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                          {caso.documentos_casos.map((doc) => {
                            const docEst = getEstadoDocStyles(doc.estado);
                            const downloadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/documentos_casos/${doc.url_archivo}`;
                            return (
                              <div key={doc.id} className="border border-outline-variant/20 bg-surface/20 rounded-sm p-4 space-y-3 shadow-inner">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex items-start gap-2.5">
                                    <FileText className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                                    <div>
                                      <div className="text-sm font-medium text-white break-all max-w-[200px] md:max-w-[250px]">{doc.nombre_archivo}</div>
                                      <div className="text-[10px] text-white/40 font-body mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                  <span className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-sm shrink-0 ${docEst.color}`}>
                                    {docEst.text}
                                  </span>
                                </div>

                                {doc.comentarios && (
                                  <div className="bg-surface border-l-2 border-secondary/35 p-3 rounded-sm text-xs font-body text-white/80">
                                    <strong className="text-secondary block mb-1">Comentario del gestor:</strong>
                                    {doc.comentarios}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
