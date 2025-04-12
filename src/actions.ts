import { redirect } from "next/navigation";
import { createClient } from "./utils/supabase/server";

export const handleLogout = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
};
