"use server";
import { createClient } from "@/utils/supabase/server";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "@/types";

export async function getProjects(userId?: string): Promise<Project[]> {
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

  const { data: projects, error: projectsError } = await query;
  if (projectsError) throw projectsError;

  return projects || [];
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
    .update({ project_status: "deleted" })
    .eq("id", projectId);

  if (error) throw error;
}

export async function assignDesignersToProject(
  projectId: number,
  designerIds: string[]
): Promise<void> {
  const supabase = await createClient();

  try {
    // Verificar si el usuario es PM
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("Error de autenticación:", authError);
      throw new Error("Usuario no autenticado");
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role_id")
      .eq("id", authUser.id)
      .single();

    if (userError || !user || user.role_id !== 2) {
      console.error("Error de permisos:", { userError, user });
      throw new Error("No tienes permisos para asignar diseñadores");
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("Error al buscar proyecto:", projectError);
      throw new Error("Proyecto no encontrado");
    }

    const { error: deleteError } = await supabase
      .from("project_designers")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) {
      throw new Error("Error al eliminar asignaciones existentes");
    }

    if (designerIds.length > 0) {
      const newAssignments = designerIds.map((designerId) => ({
        project_id: projectId,
        designer_id: designerId,
        assigned_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("project_designers")
        .insert(newAssignments);

      if (insertError) {
        console.error("Error al insertar asignaciones:", insertError);
        throw new Error("Error al asignar diseñadores");
      }
    }
  } catch (error) {
    console.error("Error en assignDesignersToProject:", error);
    throw error;
  }
}
