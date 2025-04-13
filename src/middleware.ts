import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si no hay sesión y no estamos en la página de login, redirigir a login
  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay sesión y estamos en la página de login, redirigir a dashboard
  if (session && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (session && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Verificar acceso a proyectos específicos
  if (session && request.nextUrl.pathname.startsWith("/dashboard/pedidos/")) {
    const projectId = request.nextUrl.pathname.split("/").pop();

    if (projectId === "crear") {
      return response;
    }

    if (projectId && !isNaN(Number(projectId))) {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("role_id")
        .eq("id", authUser.id)
        .single();

      if (userError || !user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      const isPM = user.role_id === 2;

      const { data: project, error } = await supabase
        .from("projects")
        .select(
          `
          client_id,
          project_status,
          project_designers (
            designer_id
          )
        `
        )
        .eq("id", projectId)
        .single();

      if (error || !project) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Si el proyecto está deleted, nadie puede verlo
      if (project.project_status === "deleted") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Si el proyecto está open, verificar permisos
      if (project.project_status === "open") {
        // PM puede ver todos los proyectos open
        if (isPM) {
          return response;
        }

        // Cliente solo puede ver sus propios proyectos
        const isClient = project.client_id === authUser.id;
        if (isClient) {
          return response;
        }

        // Diseñador puede ver proyectos asignados
        const isDesigner = project.project_designers?.some(
          (pd: { designer_id: string }) => pd.designer_id === authUser.id
        );
        if (isDesigner) {
          return response;
        }
      }

      // Si no cumple ninguna condición, redirigir al dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
