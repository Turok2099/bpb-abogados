import { createClient } from "@/lib/supabase/server";
import { getClientes, getTodosCasos } from "@/app/actions/cases";
import { getGestores } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { DashboardGestor } from "./DashboardGestor";

export const dynamic = "force-dynamic";

export default async function GestorDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Verificar rol de gestor o administrador
  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "gestor" && profile.role !== "admin")) {
    redirect("/login?error=unauthorized");
  }

  const clientesRes = await getClientes();
  const clientes = clientesRes.data || [];

  const casosRes = await getTodosCasos();
  const casos = casosRes.data || [];

  let gestores: any[] = [];
  if (profile.role === "admin") {
    const gestoresRes = await getGestores();
    gestores = gestoresRes.data || [];
  }

  return (
    <DashboardGestor
      user={{ id: user.id, email: user.email! }}
      profile={profile}
      initialCasos={casos as any}
      clientes={clientes as any}
      initialGestores={gestores as any}
    />
  );
}
