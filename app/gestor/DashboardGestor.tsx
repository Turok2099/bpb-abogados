"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  crearCaso, 
  actualizarEstadoCaso, 
  validarDocumento,
  asignarGestorCaso,
  archivarCaso,
  registrarDocumentoGestor
} from "@/app/actions/cases";
import { logout, crearGestor, reenviarInvitacion, resendConfirmation } from "@/app/actions/auth";
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, LogOut, 
  Loader2, Phone, Briefcase, Plus, Users, Search, 
  X, ExternalLink, MessageSquare, ChevronRight, UserPlus,
  FileUp, Mail, Archive, UserCheck, Check, UploadCloud
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { SidebarAdmin } from "@/components/admin/SidebarAdmin";

interface Documento {
  id: string;
  nombre_archivo: string;
  url_archivo: string;
  estado: "pendiente" | "validado" | "rechazado";
  comentarios: string | null;
  created_at: string;
}

interface Cliente {
  id: string;
  nombre: string;
  role: string;
  telefono: string | null;
  created_at: string;
  email?: string;
}

interface Caso {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: "en revision" | "en proceso" | "se requiere más informacion" | "completado" | "archivado";
  cliente_id: string;
  gestor_id: string | null;
  cliente: {
    nombre: string;
    telefono: string | null;
    email?: string;
  } | null;
  documentos_casos: Documento[];
  created_at: string;
}

interface DashboardGestorProps {
  user: { id: string; email: string };
  profile: { nombre: string; role: string } | null;
  initialCasos: Caso[];
  clientes: Cliente[];
  initialGestores?: Cliente[];
}

export function DashboardGestor({ user, profile, initialCasos, clientes, initialGestores = [] }: DashboardGestorProps) {
  const router = useRouter();
  const [casos, setCasos] = useState<Caso[]>(initialCasos);
  const [gestores, setGestores] = useState<Cliente[]>(initialGestores);
  const [activeTab, setActiveTab] = useState<"casos_nuevos" | "casos_activos" | "clientes" | "gestores">("casos_nuevos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCasos(initialCasos);
  }, [initialCasos]);

  useEffect(() => {
    setGestores(initialGestores);
  }, [initialGestores]);

  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);

  // Subir Documento a Caso State
  const [uploadingCasoId, setUploadingCasoId] = useState<string | null>(null);
  
  // Crear Caso Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCasoClienteId, setNewCasoClienteId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Crear Gestor State
  const [isGestorModalOpen, setIsGestorModalOpen] = useState(false);
  const [newGestorNombre, setNewGestorNombre] = useState("");
  const [newGestorEmail, setNewGestorEmail] = useState("");
  const [newGestorTelefono, setNewGestorTelefono] = useState("");
  const [isCreatingGestor, setIsCreatingGestor] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendingConfirmationEmail, setResendingConfirmationEmail] = useState<string | null>(null);

  // Validación de documentos
  const [validatingDocId, setValidatingDocId] = useState<string | null>(null);
  const [docComentarios, setDocComentarios] = useState("");
  const [isSubmittingValidation, setIsSubmittingValidation] = useState(false);

  // Filtros derivados
  const casosNuevos = casos.filter(c => !c.gestor_id && c.estado !== "archivado");
  const casosActivos = casos.filter(c => c.gestor_id === user.id && c.estado !== "archivado");
  
  // Handlers Documentos
  const handleOpenDocument = async (urlPath: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("documentos_casos")
        .createSignedUrl(urlPath, 300); // Válido por 5 minutos

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo obtener el archivo de forma segura.");
    }
  };

  const handleValidarDocumento = async (docId: string, casoId: string, estado: "validado" | "rechazado") => {
    setIsSubmittingValidation(true);
    try {
      const res = await validarDocumento({ docId, casoId, estado, comentarios: docComentarios });
      if (res.error) throw new Error(res.error);

      toast.success(`Documento ${estado} correctamente.`);
      setValidatingDocId(null);
      setDocComentarios("");
      
      const updatedCasos = casos.map(c => {
        if (c.id === casoId) {
          return {
            ...c,
            documentos_casos: c.documentos_casos.map(d => d.id === docId ? { ...d, estado, comentarios: docComentarios } : d)
          };
        }
        return c;
      });
      setCasos(updatedCasos);
      if (selectedCaso?.id === casoId) {
        setSelectedCaso(updatedCasos.find(c => c.id === casoId) || null);
      }
      
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al validar el documento.");
    } finally {
      setIsSubmittingValidation(false);
    }
  };

  const handleUploadGestorDoc = async (casoId: string, clienteId: string, file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo excede 10MB.");
      return;
    }

    setUploadingCasoId(casoId);
    try {
      const supabase = createClient();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${clienteId}/${casoId}/${Date.now()}_${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documentos_casos")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const res = await registrarDocumentoGestor({
        casoId,
        clienteId,
        nombreArchivo: file.name,
        urlArchivo: uploadData.path
      });

      if (res.error) throw new Error(res.error);

      toast.success("Documento subido correctamente.");
      router.refresh();
      window.location.reload(); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al subir el documento.");
    } finally {
      setUploadingCasoId(null);
    }
  };

  // Handlers Casos
  const handleAsignarGestor = async (casoId: string) => {
    try {
      const res = await asignarGestorCaso(casoId);
      if (res.error) throw new Error(res.error);
      toast.success("Te has asignado el caso exitosamente.");
      
      const updatedCasos = casos.map(c => c.id === casoId ? { ...c, gestor_id: user.id } : c);
      setCasos(updatedCasos);
      setSelectedCaso(null); // Clear detail view
      setActiveTab("casos_activos"); // Switch to active tab
    } catch (err: any) {
      toast.error(err.message || "No se pudo asignar el caso.");
    }
  };

  const handleArchivarCaso = async (casoId: string) => {
    if (!confirm("¿Estás seguro de que quieres archivar este caso?")) return;
    try {
      const res = await archivarCaso(casoId);
      if (res.error) throw new Error(res.error);
      toast.success("Caso archivado.");
      
      const updatedCasos = casos.map(c => c.id === casoId ? { ...c, estado: "archivado" as const } : c);
      setCasos(updatedCasos);
      setSelectedCaso(null);
    } catch (err: any) {
      toast.error(err.message || "Error al archivar el caso.");
    }
  };

  const handleChangeEstadoCaso = async (casoId: string, estado: Caso["estado"]) => {
    if (estado === "archivado") return;
    try {
      const res = await actualizarEstadoCaso(casoId, estado);
      if (res.error) throw new Error(res.error);
      toast.success(`Estado actualizado a: ${estado}`);
      
      const updatedCasos = casos.map(c => c.id === casoId ? { ...c, estado } : c);
      setCasos(updatedCasos);
      if (selectedCaso?.id === casoId) {
        setSelectedCaso(updatedCasos.find(c => c.id === casoId) || null);
      }
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar estado.");
    }
  };

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCasoClienteId) {
      toast.error("Por favor selecciona un cliente.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await crearCaso({
        clienteId: newCasoClienteId,
        titulo: "Test de Viabilidad",
        descripcion: "Análisis técnico y legal de infraestructura eléctrica e historial de facturación para evaluar viabilidad de recupero."
      });

      if (res.error) throw new Error(res.error);

      toast.success("Caso de Test de Viabilidad creado y asignado correctamente.");
      setIsCreateModalOpen(false);
      setNewCasoClienteId("");
      window.location.reload(); 
    } catch (err: any) {
      toast.error(err.message || "Error al crear el caso.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGestor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGestorNombre || !newGestorEmail || !newGestorTelefono) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    setIsCreatingGestor(true);
    try {
      const res = await crearGestor({
        nombre: newGestorNombre,
        email: newGestorEmail,
        telefono: newGestorTelefono
      });

      if (res.error) throw new Error(res.error);

      toast.success("Gestor invitado correctamente.");
      setIsGestorModalOpen(false);
      setNewGestorNombre("");
      setNewGestorEmail("");
      setNewGestorTelefono("");
      window.location.reload(); 
    } catch (err: any) {
      toast.error(err.message || "Error al invitar al gestor.");
    } finally {
      setIsCreatingGestor(false);
    }
  };

  const handleReenviarInvitacion = async (gestor: Cliente) => {
    setResendingId(gestor.id);
    try {
      const res = await reenviarInvitacion({
        email: gestor.email || "",
        nombre: gestor.nombre,
        telefono: gestor.telefono || ""
      });

      if (res.error) throw new Error(res.error);

      toast.success("Invitación reenviada correctamente.");
    } catch (err: any) {
      toast.error(err.message || "Error al reenviar la invitación.");
    } finally {
      setResendingId(null);
    }
  };

  const handleReenviarConfirmacionCliente = async (email: string, nombre: string) => {
    setResendingConfirmationEmail(email);
    try {
      const res = await resendConfirmation(email);
      if (res.error) throw new Error(res.error);
      toast.success(`Enlace de verificación enviado a ${nombre} correctamente.`);
    } catch (err: any) {
      toast.error(err.message || "Error al reenviar la verificación.");
    } finally {
      setResendingConfirmationEmail(null);
    }
  };

  const getEstadoCasoStyles = (estado: Caso["estado"]) => {
    switch (estado) {
      case "en revision": return { text: "En Revisión", color: "text-amber-400 border-amber-500/20 bg-amber-500/5", icon: Clock };
      case "en proceso": return { text: "En Proceso", color: "text-blue-400 border-blue-500/20 bg-blue-500/5", icon: Briefcase };
      case "se requiere más informacion": return { text: "Acción Requerida", color: "text-error border-error/20 bg-error/5", icon: AlertTriangle };
      case "completado": return { text: "Completado", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: CheckCircle2 };
      case "archivado": return { text: "Archivado", color: "text-white/40 border-outline-variant/20 bg-surface/50", icon: Archive };
      default: return { text: estado, color: "text-white/50", icon: FileText };
    }
  };

  const getEstadoDocStyles = (estado: Documento["estado"]) => {
    switch (estado) {
      case "pendiente": return { text: "Pendiente Revisión", color: "text-amber-400/90 bg-amber-500/10" };
      case "validado": return { text: "Validado", color: "text-emerald-400 bg-emerald-500/10" };
      case "rechazado": return { text: "Rechazado", color: "text-error bg-error/10" };
    }
  };

  const renderCasoDetail = () => {
    if (!selectedCaso) return null;
    const est = getEstadoCasoStyles(selectedCaso.estado);
    const isActivo = activeTab === "casos_activos";
    const isNuevo = activeTab === "casos_nuevos";

    return (
      <div className="bg-surface-container border border-outline-variant/20 rounded-sm overflow-hidden sticky top-6 max-h-[calc(100vh-48px)] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-outline-variant/20 bg-surface/30 flex justify-between items-start">
          <div>
            <div className="text-[10px] text-secondary font-label uppercase tracking-widest mb-1.5">Expediente ID: {selectedCaso.id.slice(0, 8)}</div>
            <h2 className="font-headline text-2xl text-white font-light">{selectedCaso.titulo}</h2>
            <div className="text-sm text-white/60 font-body mt-1">Cliente: <strong className="text-white/80">{selectedCaso.cliente?.nombre}</strong></div>
            {selectedCaso.cliente?.email && <div className="text-xs text-white/50">{selectedCaso.cliente.email}</div>}
          </div>
          <button onClick={() => setSelectedCaso(null)} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {isNuevo && (
            <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-sm flex items-center justify-between">
              <div>
                <h4 className="text-secondary font-semibold text-sm">Este caso no tiene gestor.</h4>
                <p className="text-xs text-white/60">Asígnatelo para empezar a procesar la documentación.</p>
              </div>
              <button 
                onClick={() => handleAsignarGestor(selectedCaso.id)}
                className="px-4 py-2 bg-secondary text-primary font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
              >
                Asignarme el Caso
              </button>
            </div>
          )}

          {isActivo && (
            <div className="space-y-4">
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-xs text-white/50 uppercase tracking-widest font-label mr-2">Cambiar Estado:</span>
                {(["en revision", "en proceso", "se requiere más informacion", "completado"] as const).map(e => (
                  <button
                    key={e}
                    onClick={() => handleChangeEstadoCaso(selectedCaso.id, e)}
                    className={`px-3 py-1.5 border rounded-sm text-xs font-semibold uppercase tracking-wider transition-all
                      ${selectedCaso.estado === e 
                        ? 'border-secondary bg-secondary/10 text-secondary' 
                        : 'border-outline-variant/30 text-white/40 hover:border-white/30 hover:text-white'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-outline-variant/20">
                 <button 
                  onClick={() => handleArchivarCaso(selectedCaso.id)}
                  className="px-3 py-1.5 bg-surface border border-outline-variant/30 text-white/50 hover:text-error hover:border-error/50 rounded-sm text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                 >
                   <Archive className="w-3.5 h-3.5" /> Archivar Expediente
                 </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-semibold border-b border-outline-variant/20 pb-2">Documentos Adjuntos ({selectedCaso.documentos_casos.length})</h3>
            
            {selectedCaso.documentos_casos.length === 0 ? (
              <div className="text-xs text-white/40 italic">No hay documentos cargados.</div>
            ) : (
              <div className="space-y-4">
                {selectedCaso.documentos_casos.map(doc => {
                  const docEst = getEstadoDocStyles(doc.estado);
                  const isPending = doc.estado === "pendiente";
                  
                  return (
                    <div key={doc.id} className="bg-surface/50 border border-outline-variant/20 rounded-sm p-4 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <FileText className="w-6 h-6 text-secondary shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-white break-all">{doc.nombre_archivo}</div>
                            <div className="text-[10px] text-white/40 mt-1">{new Date(doc.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm whitespace-nowrap ${docEst.color}`}>
                          {docEst.text}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenDocument(doc.url_archivo)}
                          className="px-3 py-1.5 bg-surface border border-outline-variant/30 hover:border-secondary hover:text-secondary rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-all text-white/70"
                        >
                          <ExternalLink className="w-3 h-3" /> Ver Archivo
                        </button>
                        
                        {isPending && isActivo && validatingDocId !== doc.id && (
                          <button 
                            onClick={() => setValidatingDocId(doc.id)}
                            className="px-3 py-1.5 bg-surface border border-amber-500/30 hover:bg-amber-500/10 text-amber-400 rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-all"
                          >
                            <Check className="w-3 h-3" /> Auditar
                          </button>
                        )}
                      </div>

                      {doc.comentarios && (
                         <div className="bg-surface border-l-2 border-secondary/35 p-3 rounded-sm text-xs font-body text-white/80 mt-2">
                           <strong className="text-secondary block mb-1">Feedback:</strong>
                           {doc.comentarios}
                         </div>
                      )}

                      {validatingDocId === doc.id && (
                        <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-3 bg-surface p-4 rounded-sm">
                          <label className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Comentarios de auditoría (opcional)</label>
                          <textarea 
                            value={docComentarios}
                            onChange={(e) => setDocComentarios(e.target.value)}
                            placeholder="Ej. El documento no es legible..."
                            className="w-full bg-surface-container border border-outline-variant/30 rounded-sm p-3 text-sm text-white focus:border-secondary focus:outline-none min-h-[80px]"
                          />
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={() => handleValidarDocumento(doc.id, selectedCaso.id, "validado")}
                              disabled={isSubmittingValidation}
                              className="flex-1 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest"
                            >
                              Aprobar
                            </button>
                            <button 
                              onClick={() => handleValidarDocumento(doc.id, selectedCaso.id, "rechazado")}
                              disabled={isSubmittingValidation}
                              className="flex-1 bg-error/10 border border-error/30 hover:bg-error/20 text-error py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest"
                            >
                              Rechazar
                            </button>
                            <button 
                              onClick={() => setValidatingDocId(null)}
                              className="px-4 bg-surface border border-outline-variant/30 hover:bg-white/5 text-white/50 py-2 rounded-sm text-[10px] uppercase font-bold tracking-widest"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isActivo && (
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <h3 className="font-label text-xs uppercase tracking-widest text-secondary font-semibold mb-4">Añadir Archivos al Expediente</h3>
              <div className="relative">
                <label className={`flex flex-col items-center justify-center border border-dashed rounded-sm p-6 text-center cursor-pointer transition-all hover:bg-white/[0.02] ${uploadingCasoId === selectedCaso.id ? 'border-secondary/40 bg-secondary/5 pointer-events-none' : 'border-outline-variant/50 hover:border-secondary/50'}`}>
                  <input 
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadGestorDoc(selectedCaso.id, selectedCaso.cliente_id, file);
                    }}
                    disabled={uploadingCasoId !== null}
                  />
                  {uploadingCasoId === selectedCaso.id ? (
                    <div className="space-y-4">
                      <Loader2 className="w-6 h-6 text-secondary animate-spin mx-auto" />
                      <div className="text-xs text-white font-medium">Subiendo archivo...</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-6 h-6 text-white/40 mx-auto" />
                      <div className="text-xs text-white font-medium">Haga clic o arrastre un documento</div>
                      <div className="text-[9px] text-white/40 uppercase tracking-wider">PDF, DOC, PNG, JPG hasta 10MB</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentList = activeTab === "casos_nuevos" ? casosNuevos : activeTab === "casos_activos" ? casosActivos : [];
  const filteredList = currentList.filter(c => 
    c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.cliente?.nombre && c.cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-white flex">
      <SidebarAdmin user={user} profile={profile} />
      
      <div className="flex-1 md:pl-64 flex flex-col">
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
                Workspace Gestor
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:block text-xs text-white/60">
                Operador: <strong className="text-white">{profile?.nombre || user.email}</strong>
              </span>
              <form action={logout}>
                <button type="submit" className="h-9 px-4 border border-outline-variant/30 hover:border-error hover:text-error text-white/70 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 cursor-pointer font-label">
                  <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto space-y-8">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl text-white font-light">Panel Operativo</h1>
              <p className="text-sm text-white/50 mt-1 font-body">Gestión de expedientes y atención a clientes.</p>
            </div>

            {/* Nav Tabs */}
            <div className="border-b border-outline-variant/20 flex gap-6 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => { setActiveTab("casos_nuevos"); setSelectedCaso(null); }}
                className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-colors border-b-2 
                  ${activeTab === "casos_nuevos" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
              >
                Casos Nuevos
                {casosNuevos.length > 0 && (
                  <span className="ml-2 bg-error text-white px-1.5 py-0.5 rounded-sm text-[10px]">{casosNuevos.length}</span>
                )}
              </button>
              <button 
                onClick={() => { setActiveTab("casos_activos"); setSelectedCaso(null); }}
                className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-colors border-b-2 
                  ${activeTab === "casos_activos" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
              >
                Mis Casos Activos
              </button>
              <button 
                onClick={() => { setActiveTab("clientes"); setSelectedCaso(null); }}
                className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-colors border-b-2 
                  ${activeTab === "clientes" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
              >
                Clientes
              </button>
              {profile?.role === "admin" && (
                <button 
                  onClick={() => { setActiveTab("gestores"); setSelectedCaso(null); }}
                  className={`pb-3 text-xs uppercase tracking-widest font-bold whitespace-nowrap transition-colors border-b-2 
                    ${activeTab === "gestores" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
                >
                  Gestores (Admin)
                </button>
              )}
            </div>

            {/* Tab Contents */}
            {activeTab === "casos_nuevos" || activeTab === "casos_activos" ? (
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className={`md:col-span-2 space-y-6 ${selectedCaso ? 'hidden md:block' : ''}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        placeholder="Buscar por caso o cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 bg-surface border border-outline-variant/30 focus:border-secondary focus:outline-none pl-10 pr-4 text-sm text-white rounded-sm"
                      />
                    </div>
                    {activeTab === "casos_activos" && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full sm:w-auto h-10 px-5 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Nuevo Expediente
                      </button>
                    )}
                  </div>

                  {filteredList.length === 0 ? (
                    <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-12 text-center text-white/50 text-sm font-body">
                      No se encontraron expedientes en esta bandeja.
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredList.map((caso) => {
                        const est = getEstadoCasoStyles(caso.estado);
                        const docsPendientes = caso.documentos_casos.filter(d => d.estado === "pendiente").length;

                        return (
                          <div 
                            key={caso.id}
                            onClick={() => setSelectedCaso(caso)}
                            className={`bg-surface-container border p-5 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all hover:bg-surface-container-high
                              ${selectedCaso?.id === caso.id ? 'border-secondary' : 'border-outline-variant/20'}`}
                          >
                            <div className="space-y-1.5 w-full sm:max-w-md">
                              <div className="flex items-center gap-2 text-[10px] text-white/40 font-body uppercase tracking-wider">
                                <span>ID: {caso.id.slice(0, 8)}</span>
                                <span>•</span>
                                <span>{new Date(caso.created_at).toLocaleDateString()}</span>
                              </div>
                              <h3 className="font-headline text-xl text-white group-hover:text-secondary transition-colors font-light leading-snug">{caso.titulo}</h3>
                              <div className="text-xs text-secondary font-medium">
                                Cliente: <span className="text-white/80 font-normal">{caso.cliente?.nombre || "No asignado"}</span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto">
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-sm text-[10px] font-semibold uppercase tracking-wider ${est.color}`}>
                                <est.icon className="w-3.5 h-3.5" />
                                <span>{est.text}</span>
                              </div>
                              
                              {docsPendientes > 0 && activeTab === "casos_activos" && (
                                <span className="text-[9px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm">
                                  {docsPendientes} pendiente{docsPendientes > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={`md:block ${!selectedCaso ? 'hidden' : ''}`}>
                  {renderCasoDetail()}
                </div>
              </div>
            ) : activeTab === "clientes" ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clientes.map(cliente => {
                    const clientCasos = casos.filter(c => c.cliente_id === cliente.id);
                    const archivedCasos = clientCasos.filter(c => c.estado === "archivado");
                    return (
                      <div key={cliente.id} className="bg-surface-container border border-outline-variant/20 p-6 rounded-sm">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-headline text-xl mb-4">
                          {cliente.nombre.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-headline text-lg text-white font-medium mb-2">{cliente.nombre}</h3>
                        <div className="space-y-2 text-xs text-white/60 font-body">
                          {cliente.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {cliente.email}</div>}
                          {cliente.telefono && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {cliente.telefono}</div>}
                          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Registro: {new Date(cliente.created_at).toLocaleDateString()}</div>
                          
                          <div className="pt-3 mt-3 border-t border-outline-variant/20">
                            <span className="font-bold text-white/80">{clientCasos.length}</span> Expedientes Totales
                            {archivedCasos.length > 0 && (
                              <div className="text-white/40 mt-1">{archivedCasos.length} Archivados</div>
                            )}
                          </div>

                          {cliente.email && (
                            <button
                              onClick={() => handleReenviarConfirmacionCliente(cliente.email!, cliente.nombre)}
                              disabled={resendingConfirmationEmail === cliente.email}
                              className="mt-4 w-full h-9 px-3 bg-surface border border-outline-variant/30 hover:border-secondary hover:text-secondary rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 transition-all text-white/70 disabled:opacity-50 cursor-pointer"
                            >
                              {resendingConfirmationEmail === cliente.email ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Reenviando...
                                </>
                              ) : (
                                <>
                                  <Mail className="w-3.5 h-3.5" />
                                  Reenviar Verificación
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : activeTab === "gestores" && profile?.role === "admin" ? (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsGestorModalOpen(true)}
                    className="h-10 px-5 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Nuevo Gestor
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gestores.map(g => (
                    <div key={g.id} className="bg-surface-container border border-outline-variant/20 p-6 rounded-sm">
                      <h3 className="font-headline text-lg text-white mb-2">{g.nombre}</h3>
                      <div className="space-y-2 text-xs text-white/60">
                        {g.email && <div>Email: {g.email}</div>}
                        {g.telefono && <div>Tel: {g.telefono}</div>}
                        <button 
                           onClick={() => handleReenviarInvitacion(g)}
                           disabled={resendingId === g.id}
                           className="mt-3 px-3 py-1.5 bg-surface border border-outline-variant/30 hover:border-secondary hover:text-secondary rounded-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-all text-white/70"
                        >
                          <Mail className="w-3 h-3" /> Re-enviar Invitación
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>

      {/* CREAR CASO MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant/20 rounded-sm w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="font-headline text-2xl text-white mb-6">Crear Nuevo Expediente</h2>
            
            <form onSubmit={handleCreateCaso} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-white/70">Seleccionar Cliente</label>
                <select
                  value={newCasoClienteId}
                  onChange={(e) => setNewCasoClienteId(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 px-3 text-sm text-white rounded-sm focus:border-secondary focus:outline-none"
                  required
                >
                  <option value="">Seleccione un cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.email ? `(${c.email})` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="bg-surface-container-low/60 p-4 border border-outline-variant/15 rounded-sm space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold font-label">Tipo de Expediente</span>
                  <div className="text-sm text-white font-medium">Test de Viabilidad</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold font-label">Descripción</span>
                  <div className="text-xs text-white/60 leading-relaxed font-body">
                    Análisis técnico y legal de infraestructura eléctrica e historial de facturación para evaluar viabilidad de recupero.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 h-11 border border-outline-variant/30 text-white/70 hover:text-white hover:bg-white/5 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 h-11 bg-secondary text-primary rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear y Asignarme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREAR GESTOR MODAL */}
      {isGestorModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant/20 rounded-sm w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button onClick={() => setIsGestorModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="font-headline text-2xl text-white mb-6">Nuevo Gestor</h2>
            <form onSubmit={handleCreateGestor} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-white/70">Nombre Completo</label>
                <input type="text" value={newGestorNombre} onChange={(e) => setNewGestorNombre(e.target.value)} className="w-full h-11 bg-surface border border-outline-variant/30 px-3 text-sm text-white rounded-sm focus:border-secondary focus:outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-white/70">Correo Electrónico</label>
                <input type="email" value={newGestorEmail} onChange={(e) => setNewGestorEmail(e.target.value)} className="w-full h-11 bg-surface border border-outline-variant/30 px-3 text-sm text-white rounded-sm focus:border-secondary focus:outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-white/70">Teléfono</label>
                <input type="text" value={newGestorTelefono} onChange={(e) => setNewGestorTelefono(e.target.value)} className="w-full h-11 bg-surface border border-outline-variant/30 px-3 text-sm text-white rounded-sm focus:border-secondary focus:outline-none" required />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={isCreatingGestor} className="w-full h-11 bg-secondary text-primary rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isCreatingGestor ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Invitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
