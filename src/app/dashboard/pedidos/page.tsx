"use client";
import React from "react";
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
import { Dot } from "lucide-react";
import { useProjects } from "@/hooks/projects/useProjects";

const Pedidos = () => {
  const { data, isLoading } = useProjects();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Projects data:", data);

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((project) => (
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
                  Abierto
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-4">
                  {project?.project_designers?.length ? (
                    <>
                      {project.project_designers
                        .slice(0, 3)
                        .map((pd, index) => (
                          <Avatar
                            key={pd.designer.id}
                            className={`w-8 h-8 border-2 border-white ${
                              index === 0 ? "z-10" : index === 1 ? "z-5" : "z-0"
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
                              {pd.designer.full_name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {project.project_designers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{project.project_designers.length - 3}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Sin asignar</span>
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
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="rounded-b-lg bg-gray-100 hover:bg-gray-100">
          <TableRow className="h-10 flex items-center  rounded-lg">
            <TableCell>
              <p className="text-xs">
                Mostrando {data?.length} de {data?.length}
              </p>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Pedidos;
