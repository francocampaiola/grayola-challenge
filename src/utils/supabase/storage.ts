import { createClient } from "./client";

export const uploadFile = async (file: File, path: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("pedidos")
    .upload(path, file);

  if (error) {
    throw error;
  }
  return data;
};

export const getFileUrl = async (path: string, signed: boolean = false) => {
  const supabase = createClient();
  if (signed) {
    const { data } = await supabase.storage
      .from("pedidos")
      .createSignedUrl(path, 3600);
    if (!data) {
      throw new Error("No se pudo generar la URL firmada");
    }
    return data.signedUrl;
  }
  const { data } = supabase.storage.from("pedidos").getPublicUrl(path);
  return data.publicUrl;
};

export const listFiles = async (path: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("pedidos").list(path);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteFile = async (path: string) => {
  const supabase = createClient();
  const { error } = await supabase.storage.from("pedidos").remove([path]);
  if (error) {
    throw error;
  }
};
