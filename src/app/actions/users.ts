"use server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types";

export async function getUsers(): Promise<Tables<"users">[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select(`*, roles (*)`);
  if (error) throw error;
  return data;
}

export async function getUserById(userId: string): Promise<Tables<"users">> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select(`*, roles (*)`)
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getCurrentUser(): Promise<Tables<"users"> | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error("Error al obtener usuario autenticado:", authError);
    return null;
  }

  const { data: user, error: dbError } = await supabase
    .from("users")
    .select(
      `
      *,
      roles:role_id (
        name
      )
    `
    )
    .eq("id", authUser.id)
    .single();

  if (dbError) {
    console.error("Error al obtener datos del usuario:", dbError);
    return null;
  }

  return user;
}

export async function getDesigners(
  projectId?: number
): Promise<(Tables<"users"> & { is_assigned: boolean })[]> {
  const supabase = await createClient();
  console.log("Iniciando getDesigners con projectId:", projectId);

  // Obtener solo usuarios con rol de diseñador (role_id = 3)
  const { data: designers, error: designersError } = await supabase
    .from("users")
    .select("*")
    .eq("role_id", 3);

  if (designersError) {
    console.error("Error al obtener diseñadores:", designersError);
    return [];
  }

  if (!projectId) {
    console.log(
      "No hay projectId, retornando todos los diseñadores sin asignación"
    );
    return designers.map((designer) => ({ ...designer, is_assigned: false }));
  }

  // Obtener los IDs de los diseñadores asignados al proyecto
  const { data: assignedDesigners, error: assignedError } = await supabase
    .from("project_designers")
    .select("designer_id")
    .eq("project_id", projectId);

  if (assignedError) {
    console.error("Error al obtener diseñadores asignados:", assignedError);
    return designers.map((designer) => ({ ...designer, is_assigned: false }));
  }

  const assignedDesignerIds = assignedDesigners.map((d) => d.designer_id);

  // Marcar los diseñadores asignados
  return designers.map((designer) => ({
    ...designer,
    is_assigned: assignedDesignerIds.includes(designer.id),
  }));
}
