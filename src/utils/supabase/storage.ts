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

export const getFileUrl = (path: string) => {
  const supabase = createClient();
  return supabase.storage.from("pedidos").getPublicUrl(path);
};
