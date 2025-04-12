"use server";
import { createClient } from "@/utils/supabase/server";

export async function getProjects(userId?: string) {
  const supabase = await createClient();

  let query = supabase.from("projects").select(`
      *,
      client:client_id (id, full_name, email),
      project_designers (
        designer:designer_id (id, full_name, email)
      )
    `);

  if (userId) {
    query = query.eq("client_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createProject(projectData: {
  title: string;
  description: string;
  client_id: string;
  storage_path?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignDesignersToProject(
  projectId: number,
  designerIds: string[]
) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("project_designers")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw deleteError;

  const { data, error: insertError } = await supabase
    .from("project_designers")
    .insert(
      designerIds.map((designerId) => ({
        project_id: projectId,
        designer_id: designerId,
      }))
    );

  if (insertError) throw insertError;
  return data;
}
