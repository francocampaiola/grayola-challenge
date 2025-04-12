"use server";

import { createClient } from "@/utils/supabase/server";
import { IResponse } from "../types";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<IResponse<{ success: boolean }>> => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error de autenticación:", error);
      return { errorMessage: error.message };
    }

    return { data: { success: true } };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { errorMessage: "Ocurrió un error inesperado" };
  }
};
