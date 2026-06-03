import { createClient } from "@/lib/supabase/server";
import { getMisCasos } from "@/app/actions/cases";
import { redirect } from "next/navigation";
import { DashboardCliente } from "./DashboardCliente";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, telefono")
    .eq("id", user.id)
    .maybeSingle();

  const casosRes = await getMisCasos();
  if (casosRes.error) {
    console.error("Error al obtener casos del cliente:", casosRes.error);
  }
  const casos = casosRes.data || [];

  return (
    <DashboardCliente
      user={{ id: user.id, email: user.email! }}
      profile={profile}
      initialCasos={casos}
    />
  );
}
