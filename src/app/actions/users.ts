"use server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/app/types";

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select(`*, roles (*)`);
  if (error) throw error;
  return data;
}

export async function getUserById(userId: string) {
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
