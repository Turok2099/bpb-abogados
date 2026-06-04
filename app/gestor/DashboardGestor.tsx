"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  crearCaso, 
  actualizarEstadoCaso, 
  validarDocumento 
} from "@/app/actions/cases";
import { logout, crearGestor, reenviarInvitacion } from "@/app/actions/auth";
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, LogOut, 
  Loader2, Phone, Briefcase, Plus, Users, Search, 
  X, ExternalLink, MessageSquare, ChevronRight, UserPlus 
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
  email?: string; // Se añade de auth si está disponible
}

interface Caso {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: "en revision" | "en proceso" | "se requiere más informacion" | "completado";
  cliente_id: string;
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
  const [activeTab, setActiveTab] = useState<"casos" | "clientes" | "gestores">("casos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCasos(initialCasos);
  }, [initialCasos]);

  useEffect(() => {
    setGestores(initialGestores);
  }, [initialGestores]);
  
  // Detalle de caso seleccionado
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);

  // Crear Caso Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCasoClienteId, setNewCasoClienteId] = useState("");
  const [newCasoTitulo, setNewCasoTitulo] = useState("");
  const [newCasoDescripcion, setNewCasoDescripcion] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Crear Gestor State
  const [isGestorModalOpen, setIsGestorModalOpen] = useState(false);
  const [newGestorNombre, setNewGestorNombre] = useState("");
  const [newGestorEmail, setNewGestorEmail] = useState("");
  const [newGestorTelefono, setNewGestorTelefono] = useState("");
  const [isCreatingGestor, setIsCreatingGestor] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Validación de documentos
  const [validatingDocId, setValidatingDocId] = useState<string | null>(null);
  const [docComentarios, setDocComentarios] = useState("");
  const [isSubmittingValidation, setIsSubmittingValidation] = useState(false);

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

  const handleCreateGestor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGestorNombre || !newGestorEmail || !newGestorTelefono) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    setIsCreatingGestor(true);
    try {
      const res = await crearGestor({
        nombre: newGestorNombre,
        email: newGestorEmail,
        telefono: newGestorTelefono,
      });

      if (res.error) throw new Error(res.error);

      toast.success("Invitación enviada al gestor correctamente.");
      setIsGestorModalOpen(false);
      setNewGestorNombre("");
      setNewGestorEmail("");
      setNewGestorTelefono("");
      
      // Actualizar lista local temporalmente
      const nuevo: Cliente = {
        id: Math.random().toString(), // Temporal
        nombre: newGestorNombre,
        role: "gestor",
        telefono: newGestorTelefono,
        email: newGestorEmail,
        created_at: new Date().toISOString()
      };
      setGestores([nuevo, ...gestores]);
      
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al crear el gestor.");
    } finally {
      setIsCreatingGestor(false);
    }
  };

  const handleReenviarInvitacion = async (gestor: Cliente) => {
    if (!gestor.email) return;
    setResendingId(gestor.id);
    try {
      const res = await reenviarInvitacion({
        email: gestor.email,
        nombre: gestor.nombre,
        telefono: gestor.telefono || ""
      });

      if (res.error) throw new Error(res.error);

      toast.success("Invitación re-enviada correctamente por correo.");
    } catch (err: any) {
      toast.error(err.message || "Error al re-enviar la invitación.");
    } finally {
      setResendingId(null);
    }
  };

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCasoClienteId || !newCasoTitulo) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await crearCaso({
        clienteId: newCasoClienteId,
        titulo: newCasoTitulo,
        descripcion: newCasoDescripcion
      });

      if (res.error) throw new Error(res.error);

      toast.success("Caso creado correctamente.");
      setIsCreateModalOpen(false);
      setNewCasoClienteId("");
      setNewCasoTitulo("");
      setNewCasoDescripcion("");
      router.refresh();
      
      // Actualizar lista local temporalmente
      if (res.data) {
        const clienteObj = clientes.find(c => c.id === newCasoClienteId);
        const nuevo: Caso = {
          ...res.data,
          cliente: clienteObj ? { nombre: clienteObj.nombre, telefono: clienteObj.telefono } : null,
          documentos_casos: []
        } as any;
        setCasos([nuevo, ...casos]);
      }
    } catch (err: any) {
      toast.error(err.message || "Error al crear el caso.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateEstadoCaso = async (casoId: string, nuevoEstado: Caso["estado"]) => {
    try {
      const res = await actualizarEstadoCaso(casoId, nuevoEstado);
      if (res.error) throw new Error(res.error);

      toast.success("Estado del caso actualizado.");
      // Actualizar localmente
      setCasos(casos.map(c => c.id === casoId ? { ...c, estado: nuevoEstado } : c));
      if (selectedCaso?.id === casoId) {
        setSelectedCaso({ ...selectedCaso, estado: nuevoEstado });
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar estado.");
    }
  };

  const handleValidarDocumento = async (docId: string, casoId: string, estado: "validado" | "rechazado") => {
    if (estado === "rechazado" && !docComentarios.trim()) {
      toast.error("Por favor, introduce un comentario de rechazo para guiar al cliente.");
      return;
    }

    setIsSubmittingValidation(true);
    try {
      const res = await validarDocumento({
        docId,
        casoId,
        estado,
        comentarios: docComentarios
      });

      if (res.error) throw new Error(res.error);

      toast.success(estado === "validado" ? "Documento validado." : "Documento rechazado.");
      
      // Actualizar localmente
      const updateDocs = (docs: Documento[]) => 
        docs.map(d => d.id === docId ? { ...d, estado, comentarios: docComentarios || null } : d);

      setCasos(casos.map(c => c.id === casoId ? { ...c, documentos_casos: updateDocs(c.documentos_casos) } : c));
      
      if (selectedCaso?.id === casoId) {
        setSelectedCaso({
          ...selectedCaso,
          documentos_casos: updateDocs(selectedCaso.documentos_casos)
        });
      }

      setValidatingDocId(null);
      setDocComentarios("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar documento.");
    } finally {
      setIsSubmittingValidation(false);
    }
  };

  const getEstadoCasoStyles = (estado: Caso["estado"]) => {
    switch (estado) {
      case "en revision":
        return { text: "En Revisión", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Clock };
      case "en proceso":
        return { text: "En Proceso", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Briefcase };
      case "se requiere más informacion":
        return { text: "Req. Información", color: "text-error bg-error/10 border-error/20", icon: AlertTriangle };
      case "completado":
        return { text: "Completado", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
    }
  };

  const getEstadoDocStyles = (estado: Documento["estado"]) => {
    switch (estado) {
      case "pendiente":
        return { text: "Pendiente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      case "validado":
        return { text: "Validado", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case "rechazado":
        return { text: "Rechazado", color: "text-error bg-error/10 border-error/20" };
    }
  };

  const filteredCasos = casos.filter(c => 
    c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.cliente?.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row">
      {/* Sidebar Izquierdo Unificado */}
      <SidebarAdmin user={user} profile={profile} />

      {/* Contenedor Principal */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Tabs Layout */}
        <div className="bg-surface/50 border-b border-outline-variant/20 sticky top-0 z-35">
          <div className="px-6 md:px-8 flex">
            <button
              onClick={() => { setActiveTab("casos"); setSelectedCaso(null); }}
              className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                ${activeTab === "casos" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <Briefcase className="w-4 h-4" />
              Expedientes y Casos ({casos.length})
            </button>
            <button
              onClick={() => { setActiveTab("clientes"); setSelectedCaso(null); }}
              className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                ${activeTab === "clientes" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <Users className="w-4 h-4" />
              Clientes Registrados ({clientes.length})
            </button>
            {profile?.role === "admin" && (
              <button
                onClick={() => { setActiveTab("gestores"); setSelectedCaso(null); }}
                className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                  ${activeTab === "gestores" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
              >
                <UserPlus className="w-4 h-4" />
                Gestores Registrados ({gestores.length})
              </button>
            )}
          </div>
        </div>

        {/* Main Container */}
        <main className="flex-1 max-w-screen-2xl w-full mx-auto p-6 md:p-8">
        {activeTab === "casos" ? (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* LISTA CASOS */}
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

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full sm:w-auto h-10 px-5 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Expediente
                </button>
              </div>

              {filteredCasos.length === 0 ? (
                <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-12 text-center text-white/50 text-sm font-body">
                  No se encontraron expedientes.
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCasos.map((caso) => {
                    const est = getEstadoCasoStyles(caso.estado);
                    const EstIcon = est.icon;
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
                            <EstIcon className="w-3.5 h-3.5" />
                            <span>{est.text}</span>
                          </div>
                          
                          {docsPendientes > 0 && (
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

            {/* DETALLE CASO */}
            <div className={`md:col-span-1 bg-surface-container border border-outline-variant/30 rounded-sm overflow-hidden p-6 space-y-6 sticky top-8 shadow-2xl
              ${!selectedCaso ? 'hidden md:block opacity-50' : 'block'}`}>
              
              {selectedCaso ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase font-label tracking-widest text-secondary font-semibold">Detalle del Expediente</div>
                      <h2 className="font-headline text-2xl font-light text-white mt-1 break-words">{selectedCaso.titulo}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedCaso(null)}
                      className="md:hidden p-1.5 border border-outline-variant/20 rounded-sm hover:border-white transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Info Cliente */}
                  <div className="border-t border-b border-outline-variant/20 py-4 space-y-2">
                    <div className="text-xs text-white/50 uppercase tracking-widest font-label">Cliente Asociado</div>
                    <div className="text-sm font-semibold text-white">{selectedCaso.cliente?.nombre}</div>
                    {selectedCaso.cliente?.telefono && (
                      <div className="flex items-center gap-2 text-xs text-white/60 font-body">
                        <Phone className="w-3.5 h-3.5 text-secondary" />
                        <span>{selectedCaso.cliente?.telefono}</span>
                      </div>
                    )}
                  </div>

                  {/* Estado Expediente */}
                  <div className="space-y-2.5">
                    <label className="text-xs text-white/50 uppercase tracking-widest font-label block">Estado del Expediente</label>
                    <select
                      value={selectedCaso.estado}
                      onChange={(e) => handleUpdateEstadoCaso(selectedCaso.id, e.target.value as any)}
                      className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body cursor-pointer"
                    >
                      <option value="en revision">En Revisión</option>
                      <option value="en proceso">En Proceso</option>
                      <option value="se requiere más informacion">Se requiere más información</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>

                  {/* Documentación del Caso */}
                  <div className="space-y-4">
                    <div className="text-xs text-white/50 uppercase tracking-widest font-label">Documentos Cargados ({selectedCaso.documentos_casos.length})</div>

                    {selectedCaso.documentos_casos.length === 0 ? (
                      <div className="border border-outline-variant/15 rounded-sm p-4 text-center text-xs text-white/40 font-body">
                        No hay documentos subidos para este caso.
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                        {selectedCaso.documentos_casos.map((doc) => {
                          const docEst = getEstadoDocStyles(doc.estado);
                          return (
                            <div key={doc.id} className="border border-outline-variant/20 bg-surface/20 rounded-sm p-4.5 space-y-3.5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <FileText className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                                  <div className="text-xs">
                                    <div className="font-semibold text-white break-all max-w-[150px]">{doc.nombre_archivo}</div>
                                    <button 
                                      onClick={() => handleOpenDocument(doc.url_archivo)}
                                      className="text-secondary hover:text-white transition-colors flex items-center gap-1 mt-1 font-semibold"
                                    >
                                      Ver archivo
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm shrink-0 border ${docEst.color}`}>
                                  {docEst.text}
                                </span>
                              </div>

                              {validatingDocId === doc.id ? (
                                <div className="space-y-3 pt-2 border-t border-outline-variant/10">
                                  <textarea
                                    placeholder="Añade comentarios para el cliente (Ej: faltan firmas, documento borroso)..."
                                    value={docComentarios}
                                    onChange={(e) => setDocComentarios(e.target.value)}
                                    rows={2}
                                    className="w-full bg-surface border border-outline-variant/30 text-xs text-white p-2 rounded-sm focus:outline-none focus:border-secondary font-body resize-none"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => { setValidatingDocId(null); setDocComentarios(""); }}
                                      className="px-2.5 py-1 text-[10px] uppercase font-label tracking-wider border border-outline-variant/30 hover:border-white rounded-sm cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleValidarDocumento(doc.id, selectedCaso.id, "rechazado")}
                                      disabled={isSubmittingValidation}
                                      className="px-2.5 py-1 text-[10px] uppercase font-label tracking-wider bg-error/90 hover:bg-error rounded-sm flex items-center gap-1 cursor-pointer"
                                    >
                                      {isSubmittingValidation && <Loader2 className="w-3 h-3 animate-spin" />}
                                      Rechazar
                                    </button>
                                    <button
                                      onClick={() => handleValidarDocumento(doc.id, selectedCaso.id, "validado")}
                                      disabled={isSubmittingValidation}
                                      className="px-2.5 py-1 text-[10px] uppercase font-label tracking-wider bg-emerald-500 text-primary font-semibold hover:bg-emerald-400 rounded-sm flex items-center gap-1 cursor-pointer"
                                    >
                                      {isSubmittingValidation && <Loader2 className="w-3 h-3 animate-spin" />}
                                      Validar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-2 justify-end pt-1">
                                  {doc.estado !== "validado" && (
                                    <button
                                      onClick={() => { setValidatingDocId(doc.id); setDocComentarios(doc.comentarios || ""); }}
                                      className="px-3 py-1 bg-surface border border-outline-variant/30 hover:border-secondary hover:text-secondary text-[10px] uppercase font-label tracking-wider rounded-sm transition-colors cursor-pointer"
                                    >
                                      Evaluar Documento
                                    </button>
                                  )}
                                </div>
                              )}

                              {doc.comentarios && validatingDocId !== doc.id && (
                                <div className="bg-surface/50 border-l border-secondary/40 p-2.5 text-[11px] font-body text-white/70 rounded-sm">
                                  <strong className="text-secondary">Comentario: </strong>
                                  {doc.comentarios}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-white/30 space-y-3">
                  <Briefcase className="w-10 h-10" />
                  <div className="text-sm font-label uppercase tracking-widest font-semibold">Sin selección</div>
                  <p className="text-xs font-body max-w-[200px]">Selecciona un expediente de la lista para ver sus detalles y documentos.</p>
                </div>
              )}
            </div>

          </div>
        ) : activeTab === "clientes" ? (
          /* TABLA CLIENTES REGISTRADOS */
          <div className="space-y-6">
            <div className="text-xs text-white/50 uppercase tracking-widest font-label">Listado de Clientes en el Sistema</div>
            
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface/30 font-label text-[10px] uppercase tracking-widest text-secondary">
                    <th className="py-4 px-6">Nombre Completo</th>
                    <th className="py-4 px-6">Teléfono</th>
                    <th className="py-4 px-6">Registro</th>
                    <th className="py-4 px-6">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm font-body">
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 px-6 text-center text-white/40">
                        No hay clientes registrados en el sistema.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((c) => (
                      <tr key={c.id} className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{c.nombre}</td>
                        <td className="py-4 px-6 text-white/70">{c.telefono || "No registrado"}</td>
                        <td className="py-4 px-6 text-white/50 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => {
                              setNewCasoClienteId(c.id);
                              setIsCreateModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-secondary/35 text-secondary hover:border-secondary hover:bg-secondary/5 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Asignar Expediente
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* TABLA GESTORES REGISTRADOS (Solo para Admin) */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-xs text-white/50 uppercase tracking-widest font-label">Listado de Gestores en el Sistema</div>
              <button
                onClick={() => setIsGestorModalOpen(true)}
                className="w-full sm:w-auto h-10 px-5 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Nuevo Gestor
              </button>
            </div>

            <div className="bg-surface-container border border-outline-variant/20 rounded-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface/30 font-label text-[10px] uppercase tracking-widest text-secondary">
                    <th className="py-4 px-6">Nombre Completo</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Teléfono</th>
                    <th className="py-4 px-6">Registro</th>
                    <th className="py-4 px-6">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm font-body">
                  {gestores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 px-6 text-center text-white/40">
                        No hay gestores registrados en el sistema.
                      </td>
                    </tr>
                  ) : (
                    gestores.map((g) => (
                      <tr key={g.id} className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{g.nombre}</td>
                        <td className="py-4 px-6 text-white/70">{g.email || "No registrado"}</td>
                        <td className="py-4 px-6 text-white/70">{g.telefono || "No registrado"}</td>
                        <td className="py-4 px-6 text-white/50 text-xs">{new Date(g.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleReenviarInvitacion(g)}
                            disabled={resendingId === g.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-secondary/35 text-secondary hover:border-secondary hover:bg-secondary/5 text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-all cursor-pointer disabled:opacity-50"
                          >
                            {resendingId === g.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-3 h-3" />
                                Re-enviar
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      </div> {/* Cierre del Contenedor Principal */}

      {/* CREATE CASO MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 p-6 md:p-8 rounded-sm shadow-2xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-2xl font-light text-white mb-6">Crear Nuevo Expediente</h3>

            <form onSubmit={handleCreateCaso} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Cliente Asociado *</label>
                <select
                  required
                  value={newCasoClienteId}
                  onChange={(e) => setNewCasoClienteId(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body cursor-pointer"
                >
                  <option value="">Selecciona un cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.telefono || 'Sin tel.'})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Título del Expediente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sucesión Intestada - Familia Gómez"
                  value={newCasoTitulo}
                  onChange={(e) => setNewCasoTitulo(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Descripción Breve</label>
                <textarea
                  placeholder="Detalles sobre el alcance, documentos requeridos o notas iniciales..."
                  value={newCasoDescripcion}
                  onChange={(e) => setNewCasoDescripcion(e.target.value)}
                  rows={3}
                  className="w-full bg-surface border border-outline-variant/30 text-sm text-white p-3 rounded-sm focus:outline-none focus:border-secondary font-body resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-11 bg-secondary text-primary font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center pt-0.5 cursor-pointer"
              >
                {isCreating ? "CREANDO EXPEDIENTE..." : "CREAR EXPEDIENTE"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GESTOR MODAL */}
      {isGestorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 p-6 md:p-8 rounded-sm shadow-2xl relative">
            <button 
              onClick={() => setIsGestorModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-2xl font-light text-white mb-6">Crear Nuevo Gestor</h3>

            <form onSubmit={handleCreateGestor} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Pérez"
                  value={newGestorNombre}
                  onChange={(e) => setNewGestorNombre(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="carlos.perez@bpb.com"
                  value={newGestorEmail}
                  onChange={(e) => setNewGestorEmail(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Teléfono *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: +5491122334455"
                  value={newGestorTelefono}
                  onChange={(e) => setNewGestorTelefono(e.target.value)}
                  className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingGestor}
                className="w-full h-11 bg-secondary text-primary font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-primary transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center pt-0.5 cursor-pointer"
              >
                {isCreatingGestor ? "CREANDO E INVITANDO..." : "CREAR E INVITAR GESTOR"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
