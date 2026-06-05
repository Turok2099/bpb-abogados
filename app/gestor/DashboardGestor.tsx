"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  crearCaso, 
  actualizarEstadoCaso, 
  validarDocumento 
} from "@/app/actions/cases";
import { 
  asignarGestorLead, 
  archivarLead, 
  uploadDocumentoLead, 
  convertirLeadEnCaso 
} from "@/app/actions/leads";
import { logout, crearGestor, reenviarInvitacion } from "@/app/actions/auth";
import { 
  FileText, CheckCircle2, AlertTriangle, Clock, LogOut, 
  Loader2, Phone, Briefcase, Plus, Users, Search, 
  X, ExternalLink, MessageSquare, ChevronRight, UserPlus,
  FileUp, Mail, Archive, UserCheck, Check
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

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  tipo_consulta: "test_viabilidad" | "contacto_general";
  archivo_url: string | null;
  leido: boolean;
  estado: "nuevo" | "en_seguimiento" | "convertido" | "archivado";
  gestor_asignado_id: string | null;
  motivo_descarte: string | null;
  created_at: string;
  gestor?: {
    nombre: string;
  } | null;
}

interface DashboardGestorProps {
  user: { id: string; email: string };
  profile: { nombre: string; role: string } | null;
  initialCasos: Caso[];
  clientes: Cliente[];
  initialGestores?: Cliente[];
  initialLeads?: Lead[];
}

export function DashboardGestor({ user, profile, initialCasos, clientes, initialGestores = [], initialLeads = [] }: DashboardGestorProps) {
  const router = useRouter();
  const [casos, setCasos] = useState<Caso[]>(initialCasos);
  const [gestores, setGestores] = useState<Cliente[]>(initialGestores);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeTab, setActiveTab] = useState<"casos" | "leads" | "clientes" | "gestores">("casos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCasos(initialCasos);
  }, [initialCasos]);

  useEffect(() => {
    setGestores(initialGestores);
  }, [initialGestores]);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Archivar Lead Modal State
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveMotivo, setArchiveMotivo] = useState("");
  const [isArchiving, setIsArchiving] = useState(false);

  // Subir Documento a Lead State
  const [isUploadLeadDocOpen, setIsUploadLeadDocOpen] = useState(false);
  const [isUploadingLeadDoc, setIsUploadingLeadDoc] = useState(false);
  
  // Convertir Lead Modal State
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertTipo, setConvertTipo] = useState<"new_client_new_case" | "existing_client_new_case" | "existing_client_existing_case">("new_client_new_case");
  const [convertClienteId, setConvertClienteId] = useState("");
  const [convertCasoId, setConvertCasoId] = useState("");
  const [convertTitulo, setConvertTitulo] = useState("Expediente Principal");
  const [convertDescripcion, setConvertDescripcion] = useState("");
  const [isConvertingLead, setIsConvertingLead] = useState(false);
  
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

  // HANDLERS PARA LEADS (TEST DE VIABILIDAD)

  const handleOpenViabilidadDocument = async (urlPath: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("documentos_viabilidad")
        .createSignedUrl(urlPath, 300); // 5 min

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo obtener el archivo de forma segura.");
    }
  };

  const handleAsignarGestor = async (leadId: string) => {
    try {
      const res = await asignarGestorLead(leadId);
      if (res.error) throw new Error(res.error);

      toast.success("Te has asignado este caso de viabilidad.");
      if (res.data) {
        const updatedLead = { 
          ...res.data, 
          gestor: { nombre: profile?.nombre || "Tú" } 
        } as any;
        setLeads(leads.map(l => l.id === leadId ? updatedLead : l));
        if (selectedLead?.id === leadId) {
          setSelectedLead(updatedLead);
        }
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al asignar gestor.");
    }
  };

  const handleArchivarLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    if (!archiveMotivo.trim()) {
      toast.error("Por favor completa el motivo de archivo.");
      return;
    }

    setIsArchiving(true);
    try {
      const res = await archivarLead(selectedLead.id, archiveMotivo);
      if (res.error) throw new Error(res.error);

      toast.success("Caso de viabilidad archivado/descartado.");
      setIsArchiveModalOpen(false);
      setArchiveMotivo("");
      
      if (res.data) {
        const updatedLead = { 
          ...res.data, 
          gestor: selectedLead.gestor 
        } as any;
        setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
        setSelectedLead(updatedLead);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al archivar el caso.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUploadLeadDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    const fileInput = document.getElementById("lead-files") as HTMLInputElement;
    const files = fileInput?.files;
    if (!files || files.length === 0) {
      toast.error("Por favor selecciona al menos un archivo.");
      return;
    }

    setIsUploadingLeadDoc(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("archivos", files[i]);
      }

      const res = await uploadDocumentoLead(selectedLead.id, formData);
      if (res.error) throw new Error(res.error);

      toast.success("Documento subido correctamente.");
      setIsUploadLeadDocOpen(false);
      
      router.refresh();
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      toast.error(err.message || "Error al subir el documento.");
    } finally {
      setIsUploadingLeadDoc(false);
    }
  };

  const handleConvertLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    if (convertTipo === "existing_client_new_case" && !convertClienteId) {
      toast.error("Por favor selecciona un cliente existente.");
      return;
    }
    if (convertTipo === "existing_client_existing_case" && (!convertClienteId || !convertCasoId)) {
      toast.error("Por favor selecciona el cliente y expediente a actualizar.");
      return;
    }
    if (convertTipo !== "existing_client_existing_case" && !convertTitulo.trim()) {
      toast.error("Por favor introduce un título para el expediente.");
      return;
    }

    setIsConvertingLead(true);
    try {
      const res = await convertirLeadEnCaso({
        leadId: selectedLead.id,
        tipoConversion: convertTipo,
        clienteId: convertClienteId || undefined,
        casoId: convertCasoId || undefined,
        tituloCaso: convertTitulo || undefined,
        descripcionCaso: convertDescripcion || undefined
      });

      if (res.error) throw new Error(res.error);

      toast.success("Conversión realizada con éxito.");
      setIsConvertModalOpen(false);
      
      const updatedLead = { 
        ...selectedLead, 
        estado: "convertido" as const
      };
      setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
      setSelectedLead(updatedLead);
      
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error al convertir el test de viabilidad.");
    } finally {
      setIsConvertingLead(false);
    }
  };

  const getEstadoLeadStyles = (estado: Lead["estado"]) => {
    switch (estado) {
      case "nuevo":
        return { text: "Nuevo", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Clock };
      case "en_seguimiento":
        return { text: "En Seguimiento", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Briefcase };
      case "convertido":
        return { text: "Convertido", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
      case "archivado":
        return { text: "Archivado", color: "text-error bg-error/10 border-error/20", icon: X };
    }
  };

  const filteredLeads = leads.filter(l => 
    l.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
              onClick={() => { setActiveTab("casos"); setSelectedCaso(null); setSelectedLead(null); }}
              className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                ${activeTab === "casos" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <Briefcase className="w-4 h-4" />
              Expedientes y Casos ({casos.length})
            </button>
            <button
              onClick={() => { setActiveTab("leads"); setSelectedCaso(null); setSelectedLead(null); }}
              className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                ${activeTab === "leads" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <FileText className="w-4 h-4" />
              Tests de Viabilidad ({leads.filter(l => l.estado !== 'archivado' && l.estado !== 'convertido').length} Activos)
            </button>
            <button
              onClick={() => { setActiveTab("clientes"); setSelectedCaso(null); setSelectedLead(null); }}
              className={`py-4 px-6 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer
                ${activeTab === "clientes" ? "border-secondary text-secondary" : "border-transparent text-white/50 hover:text-white"}`}
            >
              <Users className="w-4 h-4" />
              Clientes Registrados ({clientes.length})
            </button>
            {profile?.role === "admin" && (
              <button
                onClick={() => { setActiveTab("gestores"); setSelectedCaso(null); setSelectedLead(null); }}
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
        ) : activeTab === "leads" ? (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* LISTA LEADS */}
            <div className={`md:col-span-2 space-y-6 ${selectedLead ? 'hidden md:block' : ''}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente o correo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-surface border border-outline-variant/30 focus:border-secondary focus:outline-none pl-10 pr-4 text-sm text-white rounded-sm"
                  />
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-12 text-center text-white/50 text-sm font-body">
                  No se encontraron tests de viabilidad.
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredLeads.map((lead) => {
                    const est = getEstadoLeadStyles(lead.estado);
                    const EstIcon = est.icon;
                    let numDocs = 0;
                    if (lead.archivo_url) {
                      try {
                        const parsed = JSON.parse(lead.archivo_url);
                        numDocs = Array.isArray(parsed) ? parsed.length : 0;
                      } catch {}
                    }

                    return (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-surface-container border p-5 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-all hover:bg-surface-container-high
                          ${selectedLead?.id === lead.id ? 'border-secondary' : 'border-outline-variant/20'}`}
                      >
                        <div className="space-y-1.5 w-full sm:max-w-md">
                          <div className="flex items-center gap-2 text-[10px] text-white/40 font-body uppercase tracking-wider">
                            <span>ID: VIAB-${lead.id.slice(0, 6).toUpperCase()}</span>
                            <span>•</span>
                            <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                          </div>
                          <h3 className="font-headline text-xl text-white font-light leading-snug">{lead.nombre}</h3>
                          <div className="text-xs text-secondary font-medium flex flex-wrap gap-x-3 gap-y-1">
                            <span>Email: <span className="text-white/80 font-normal">{lead.email}</span></span>
                            {lead.telefono && (
                              <>
                                <span>•</span>
                                <span>Tel: <span className="text-white/80 font-normal">{lead.telefono}</span></span>
                              </>
                            )}
                          </div>
                          {lead.gestor && (
                            <div className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded-sm inline-block border border-emerald-500/10">
                              Asignado a: {lead.gestor.nombre}
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-end gap-3 justify-between w-full sm:w-auto">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-sm text-[10px] font-semibold uppercase tracking-wider ${est.color}`}>
                            <EstIcon className="w-3.5 h-3.5" />
                            <span>{est.text}</span>
                          </div>
                          
                          {numDocs > 0 && (
                            <span className="text-[9px] uppercase font-bold tracking-widest text-secondary bg-secondary/5 border border-secondary/20 px-2 py-0.5 rounded-sm">
                              {numDocs} archivo{numDocs > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DETALLE LEAD */}
            <div className={`md:col-span-1 bg-surface-container border border-outline-variant/30 rounded-sm overflow-hidden p-6 space-y-6 sticky top-8 shadow-2xl
              ${!selectedLead ? 'hidden md:block opacity-50' : 'block'}`}>
              
              {selectedLead ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] uppercase font-label tracking-widest text-secondary font-semibold">Detalle de Viabilidad</div>
                      <h2 className="font-headline text-2xl font-light text-white mt-1 break-words">{selectedLead.nombre}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedLead(null)}
                      className="md:hidden p-1.5 border border-outline-variant/20 rounded-sm hover:border-white transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Acciones principales */}
                  <div className="space-y-3 pt-2">
                    {selectedLead.estado === "nuevo" && (
                      <button
                        onClick={() => handleAsignarGestor(selectedLead.id)}
                        className="w-full h-10 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        Tomar Seguimiento
                      </button>
                    )}

                    {selectedLead.estado === "en_seguimiento" && selectedLead.gestor_asignado_id === user.id && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setConvertClienteId("");
                            setConvertCasoId("");
                            setConvertTitulo(`Expediente - ${selectedLead.nombre}`);
                            setConvertDescripcion(`Test de viabilidad convertido en expediente para ${selectedLead.nombre}`);
                            setConvertTipo("new_client_new_case");
                            setIsConvertModalOpen(true);
                          }}
                          className="col-span-2 h-10 bg-emerald-500 hover:bg-emerald-400 text-primary font-bold text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          Convertir a Expediente
                        </button>
                        
                        <button
                          onClick={() => setIsUploadLeadDocOpen(true)}
                          className="h-9 border border-outline-variant/30 hover:border-white text-white text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileUp className="w-3.5 h-3.5" />
                          Subir Archivo
                        </button>
                        
                        <button
                          onClick={() => {
                            setArchiveMotivo("");
                            setIsArchiveModalOpen(true);
                          }}
                          className="h-9 border border-outline-variant/30 hover:border-error hover:text-error text-white/80 text-[10px] uppercase font-bold tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          Archivar Caso
                        </button>
                      </div>
                    )}

                    {selectedLead.estado === "en_seguimiento" && selectedLead.gestor_asignado_id !== user.id && (
                      <div className="bg-surface/50 border border-outline-variant/15 p-4 rounded-sm text-center text-xs text-white/50">
                        Este caso de viabilidad está siendo atendido por otro gestor.
                      </div>
                    )}

                    {selectedLead.estado === "convertido" && (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-sm text-center text-xs text-emerald-400 font-medium">
                        ✓ Este test de viabilidad ya fue convertido en un expediente formal.
                      </div>
                    )}

                    {selectedLead.estado === "archivado" && (
                      <div className="bg-error/10 border border-error/25 p-4 rounded-sm text-xs text-error font-medium space-y-2">
                        <div>⚠ Este test de viabilidad fue descartado/archivado.</div>
                        {selectedLead.motivo_descarte && (
                          <div className="bg-surface/50 p-2.5 border-l-2 border-error rounded-sm text-white/80 font-body break-words">
                            <strong>Motivo:</strong> {selectedLead.motivo_descarte}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info de contacto */}
                  <div className="border-t border-outline-variant/20 py-4 space-y-3">
                    <div className="text-xs text-white/50 uppercase tracking-widest font-label">Información de Contacto</div>
                    <div className="space-y-2 text-xs font-body">
                      <div className="flex items-center gap-2.5 text-white/80">
                        <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <a href={`mailto:${selectedLead.email}`} className="hover:text-secondary transition-colors underline break-all">{selectedLead.email}</a>
                      </div>
                      {selectedLead.telefono && (
                        <div className="flex items-center gap-2.5 text-white/80">
                          <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <a href={`tel:${selectedLead.telefono}`} className="hover:text-secondary transition-colors underline">{selectedLead.telefono}</a>
                        </div>
                      )}
                      {selectedLead.mensaje && (
                        <div className="bg-surface/30 p-3 rounded-sm border border-outline-variant/10 text-white/70 whitespace-pre-wrap mt-2">
                          {selectedLead.mensaje}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documentación de Viabilidad */}
                  <div className="border-t border-outline-variant/20 py-4 space-y-4">
                    <div className="text-xs text-white/50 uppercase tracking-widest font-label">Documentación Adjunta</div>

                    {(() => {
                      let docsList: string[] = [];
                      if (selectedLead.archivo_url) {
                        try {
                          docsList = JSON.parse(selectedLead.archivo_url);
                        } catch {}
                      }

                      if (!Array.isArray(docsList) || docsList.length === 0) {
                        return (
                          <div className="border border-outline-variant/15 rounded-sm p-4 text-center text-xs text-white/40 font-body">
                            No hay documentos cargados en este test de viabilidad.
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                          {docsList.map((urlPath, index) => {
                            const fileName = urlPath.split("-").slice(1).join("-") || urlPath.split("/").pop() || "Documento";
                            return (
                              <div key={index} className="border border-outline-variant/20 bg-surface/20 rounded-sm p-3.5 flex justify-between items-center gap-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 text-secondary shrink-0" />
                                  <span className="text-xs font-semibold text-white truncate break-all max-w-[130px] sm:max-w-[160px]">{fileName}</span>
                                </div>
                                <button
                                  onClick={() => handleOpenViabilidadDocument(urlPath)}
                                  className="text-secondary hover:text-white transition-colors flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0"
                                >
                                  Ver
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-white/30 space-y-3">
                  <FileText className="w-10 h-10" />
                  <div className="text-sm font-label uppercase tracking-widest font-semibold">Sin selección</div>
                  <p className="text-xs font-body max-w-[200px]">Selecciona un test de viabilidad de la lista para ver su información y documentación.</p>
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

      {/* ARCHIVE LEAD MODAL */}
      {isArchiveModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 p-6 md:p-8 rounded-sm shadow-2xl relative">
            <button 
              onClick={() => setIsArchiveModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-2xl font-light text-white mb-3">Archivar Caso de Viabilidad</h3>
            <p className="text-xs text-white/60 mb-6">
              Por favor explica el motivo por el cual estás archivando o descartando este test de viabilidad de <strong className="text-white">{selectedLead.nombre}</strong>.
            </p>

            <form onSubmit={handleArchivarLeadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Motivo del Archivo / Descarte *</label>
                <textarea
                  required
                  placeholder="Ej: El cliente no cumple con los requisitos técnicos de facturación o ya no responde los contactos..."
                  value={archiveMotivo}
                  onChange={(e) => setArchiveMotivo(e.target.value)}
                  rows={4}
                  className="w-full bg-surface border border-outline-variant/30 text-sm text-white p-3 rounded-sm focus:outline-none focus:border-secondary font-body resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsArchiveModalOpen(false)}
                  className="px-5 h-10 border border-outline-variant/30 text-white hover:border-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isArchiving}
                  className="px-5 h-10 bg-error text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isArchiving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Archivando...
                    </>
                  ) : (
                    "Archivar Caso"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT TO LEAD MODAL */}
      {isUploadLeadDocOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 p-6 md:p-8 rounded-sm shadow-2xl relative">
            <button 
              onClick={() => setIsUploadLeadDocOpen(false)}
              className="absolute right-4 top-4 p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-2xl font-light text-white mb-3">Subir Documentación de Viabilidad</h3>
            <p className="text-xs text-white/60 mb-6">
              Sube archivos adicionales al test de viabilidad de <strong className="text-white">{selectedLead.nombre}</strong>.
            </p>

            <form onSubmit={handleUploadLeadDocSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Seleccionar archivos *</label>
                <input
                  type="file"
                  id="lead-files"
                  multiple
                  required
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  className="w-full bg-surface border border-outline-variant/30 text-white text-sm focus:outline-none p-3 rounded-sm font-body"
                />
                <p className="text-[10px] text-white/40">Soporta PDF, Word, Excel e imágenes de hasta 20MB.</p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadLeadDocOpen(false)}
                  className="px-5 h-10 border border-outline-variant/30 text-white hover:border-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploadingLeadDoc}
                  className="px-5 h-10 bg-secondary text-primary font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUploadingLeadDoc ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    "Subir Documentos"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT LEAD TO CASE MODAL */}
      {isConvertModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container border border-outline-variant/30 p-6 md:p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsConvertModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-2xl font-light text-white mb-2">Convertir Viabilidad a Expediente</h3>
            <p className="text-xs text-white/60 mb-6">
              Define cómo registrar el test de viabilidad de <strong className="text-white">{selectedLead.nombre}</strong> como un expediente formal.
            </p>

            <form onSubmit={handleConvertLeadSubmit} className="space-y-5">
              
              {/* Opción de tipo de conversión */}
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Tipo de Conversión *</label>
                <div className="grid grid-cols-1 gap-2.5">
                  <label className="flex items-start gap-3 p-3 bg-surface/30 border border-outline-variant/25 rounded-sm cursor-pointer hover:bg-surface/55 transition-colors">
                    <input 
                      type="radio" 
                      name="convertTipo" 
                      value="new_client_new_case"
                      checked={convertTipo === "new_client_new_case"}
                      onChange={(e) => {
                        setConvertTipo(e.target.value as any);
                        setConvertClienteId("");
                        setConvertCasoId("");
                      }}
                      className="mt-1"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">Crear Nuevo Cliente + Nuevo Expediente</div>
                      <div className="text-white/50">Crea una cuenta para el cliente en el portal, envía invitación y abre un caso nuevo.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface/30 border border-outline-variant/25 rounded-sm cursor-pointer hover:bg-surface/55 transition-colors">
                    <input 
                      type="radio" 
                      name="convertTipo" 
                      value="existing_client_new_case"
                      checked={convertTipo === "existing_client_new_case"}
                      onChange={(e) => {
                        setConvertTipo(e.target.value as any);
                        setConvertCasoId("");
                      }}
                      className="mt-1"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">Cliente Existente + Nuevo Expediente</div>
                      <div className="text-white/50">Selecciona un cliente ya registrado en el sistema y ábrele un nuevo caso.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface/30 border border-outline-variant/25 rounded-sm cursor-pointer hover:bg-surface/55 transition-colors">
                    <input 
                      type="radio" 
                      name="convertTipo" 
                      value="existing_client_existing_case"
                      checked={convertTipo === "existing_client_existing_case"}
                      onChange={(e) => {
                        setConvertTipo(e.target.value as any);
                      }}
                      className="mt-1"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">Cliente Existente + Expediente Existente</div>
                      <div className="text-white/50">Transfiere los documentos del test directamente a un expediente que el cliente ya tiene abierto.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Si es cliente existente */}
              {convertTipo !== "new_client_new_case" && (
                <div className="space-y-1.5">
                  <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Seleccionar Cliente Registrado *</label>
                  <select
                    required
                    value={convertClienteId}
                    onChange={(e) => {
                      setConvertClienteId(e.target.value);
                      setConvertCasoId("");
                    }}
                    className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body cursor-pointer"
                  >
                    <option value="">Selecciona un cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.email || 'Sin email'})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Si es caso existente */}
              {convertTipo === "existing_client_existing_case" && convertClienteId && (
                <div className="space-y-1.5">
                  <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Seleccionar Expediente Activo *</label>
                  <select
                    required
                    value={convertCasoId}
                    onChange={(e) => setConvertCasoId(e.target.value)}
                    className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body cursor-pointer"
                  >
                    <option value="">Selecciona un expediente...</option>
                    {casos
                      .filter((c) => c.cliente_id === convertClienteId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.titulo} (ID: {c.id.slice(0, 8)})</option>
                      ))}
                  </select>
                  {casos.filter((c) => c.cliente_id === convertClienteId).length === 0 && (
                    <p className="text-[10px] text-error">Este cliente no posee expedientes activos en el sistema.</p>
                  )}
                </div>
              )}

              {/* Si es nuevo caso (se requiere título y descripción) */}
              {convertTipo !== "existing_client_existing_case" && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Título del Nuevo Expediente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Recupero de Energía - Sucursal Alvear"
                      value={convertTitulo}
                      onChange={(e) => setConvertTitulo(e.target.value)}
                      className="w-full h-11 bg-surface border border-outline-variant/30 text-white text-sm focus:border-secondary focus:outline-none px-3 rounded-sm font-body"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label text-[10px] uppercase tracking-widest text-white/70 block">Descripción Breve</label>
                    <textarea
                      placeholder="Detalles sobre el caso legal, tarifas o comentarios iniciales..."
                      value={convertDescripcion}
                      onChange={(e) => setConvertDescripcion(e.target.value)}
                      rows={3}
                      className="w-full bg-surface border border-outline-variant/30 text-sm text-white p-3 rounded-sm focus:outline-none focus:border-secondary font-body resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant/15">
                <button
                  type="button"
                  onClick={() => setIsConvertModalOpen(false)}
                  className="px-5 h-11 border border-outline-variant/30 text-white hover:border-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isConvertingLead || (convertTipo === "existing_client_existing_case" && !convertCasoId)}
                  className="px-6 h-11 bg-emerald-500 text-primary font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isConvertingLead ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Conversión"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
