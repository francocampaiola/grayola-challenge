"use server";
import { createClient } from "@/utils/supabase/server";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "@/app/types";

export async function getProjects(userId?: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data: designers, error: designersError } = await supabase.from(
    "project_designers"
  ).select(`
      *,
      designer:designer_id (id, full_name, email)
    `);

  if (designersError) throw designersError;

  let query = supabase.from("projects").select(`
    *, 
    client:client_id (id, full_name, email)
  `);

  if (userId) {
    query = query.eq("client_id", userId);
  }

  const { data: projects, error: projectsError } = await query;
  if (projectsError) throw projectsError;

  return projects.map((project) => ({
    ...project,
    project_designers: designers.filter((d) => d.project_id === project.id),
  }));
}

export async function getProjectById(projectId: number): Promise<Project> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      client:client_id (id, full_name, email),
      project_designers (
        designer:designer_id (id, full_name, email)
      )
    `
    )
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(
  projectData: ProjectCreateInput
): Promise<Project> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert(projectData)
    .select(
      `
      *,
      client:client_id (id, full_name, email),
      project_designers (
        designer:designer_id (id, full_name, email)
      )
    `
    )
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(
  projectId: number,
  projectData: ProjectUpdateInput
): Promise<Project> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", projectId)
    .select(
      `
      *,
      client:client_id (id, full_name, email),
      project_designers (
        designer:designer_id (id, full_name, email)
      )
    `
    )
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function assignDesignersToProject(
  projectId: number,
  designerIds: string[]
): Promise<void> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("project_designers")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase
    .from("project_designers")
    .insert(
      designerIds.map((designerId) => ({
        project_id: projectId,
        designer_id: designerId,
      }))
    );

  if (insertError) throw insertError;
}
