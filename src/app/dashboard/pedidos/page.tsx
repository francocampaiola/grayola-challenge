"use client";
import React from "react";
import Link from "next/link";
import { useProjects, useDeleteProject } from "@/hooks/projects/useProjects";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dot, EllipsisVertical, LoaderIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Pedidos = () => {
  const { data, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const { user } = useUser();

  const isPM = user?.role_id === 2;

  const handleDeleteProject = async (projectId: number) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Proyecto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      toast.error("Error al eliminar el proyecto");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 ">
      <Table className="bg-gray-100 overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-100 uppercase text-xs hover:bg-gray-100">
            <TableHead className="w-[400px]">Titulo</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead>Fecha de vencimiento</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            ?.filter((project) => project.project_status === "open")
            .map((project) => (
              <TableRow className="bg-white hover:bg-white" key={project.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="font-bold">{project?.title}</p>
                    <p className="text-xs text-gray-400">
                      {project?.description?.slice(0, 50)}
                      {project?.description && project.description.length > 50
                        ? "..."
                        : ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">#{project?.id}</TableCell>
                <TableCell>
                  <Badge className="bg-[#DFFAE6] text-[#257643] font-bold">
                    {project?.project_status === "open" && "Abierto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-4">
                    {project?.project_designers?.length ? (
                      <>
                        {project.project_designers
                          .filter(
                            (
                              pd
                            ): pd is {
                              designer: {
                                id: string;
                                full_name: string | null;
                                email: string;
                              };
                            } =>
                              pd.designer !== null && pd.designer !== undefined
                          )
                          .slice(0, 3)
                          .map((pd, index) => (
                            <Avatar
                              key={pd.designer.id}
                              className={`w-8 h-8 border-2 border-white ${
                                index === 0
                                  ? "z-10"
                                  : index === 1
                                  ? "z-5"
                                  : "z-0"
                              }`}
                            >
                              <AvatarFallback
                                style={{
                                  fontSize: "12px",
                                  backgroundColor:
                                    index === 0
                                      ? "#FF6B6B"
                                      : index === 1
                                      ? "#4ECDC4"
                                      : "#45B7D1",
                                  color: "white",
                                }}
                              >
                                {pd.designer.full_name
                                  ?.slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        {project.project_designers.filter(
                          (
                            pd
                          ): pd is {
                            designer: {
                              id: string;
                              full_name: string | null;
                              email: string;
                            };
                          } => pd.designer !== null && pd.designer !== undefined
                        ).length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              +
                              {project.project_designers.filter(
                                (
                                  pd
                                ): pd is {
                                  designer: {
                                    id: string;
                                    full_name: string | null;
                                    email: string;
                                  };
                                } =>
                                  pd.designer !== null &&
                                  pd.designer !== undefined
                              ).length - 3}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No hay diseñadores asignados
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#DFFAE6] text-[#257643] font-bold">
                    <Dot style={{ transform: "scale(2)" }} />
                    Baja
                  </Badge>
                </TableCell>
                <TableCell>
                  {project?.updated_at
                    ? new Date(project.updated_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin actualizar"}
                </TableCell>
                <TableCell>
                  {project?.created_at
                    ? new Date(
                        new Date(project.created_at).getTime() +
                          1000 * 60 * 60 * 24 * 5
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin fecha de vencimiento"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical size={15} className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuGroup>
                        <Link href={`/dashboard/pedidos/${project.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            Ver proyecto
                          </DropdownMenuItem>
                        </Link>
                        {isPM && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                Eliminar proyecto
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Estás a punto de eliminar el proyecto y no se
                                  mostrará más en la lista de proyectos activos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  disabled={deleteProject.isPending}
                                  className="cursor-pointer"
                                >
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProject(project.id)
                                  }
                                  className="text-white bg-destructive cursor-pointer hover:bg-destructive/90"
                                  disabled={deleteProject.isPending}
                                >
                                  {deleteProject.isPending ? (
                                    <>
                                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                                      Eliminando...
                                    </>
                                  ) : (
                                    "Eliminar proyecto"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter className="rounded-b-lg bg-gray-100 hover:bg-gray-100">
          <TableRow className="h-10 flex items-center  rounded-lg">
            <TableCell>
              {data &&
              data.filter((project) => project.project_status === "open")
                .length > 0 ? (
                <p className="text-xs">
                  Mostrando{" "}
                  {
                    data.filter((project) => project.project_status === "open")
                      .length
                  }{" "}
                  de{" "}
                  {
                    data.filter((project) => project.project_status === "open")
                      .length
                  }
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  No hay pedidos creados aún.
                </p>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Pedidos;
