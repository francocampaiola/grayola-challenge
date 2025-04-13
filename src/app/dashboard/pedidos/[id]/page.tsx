"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFileUrl, listFiles, uploadFile } from "@/utils/supabase/storage";
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useAssignDesigners,
} from "@/hooks/projects/useProjects";
import { useDesigners } from "@/hooks/users/useUsers";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  CircleCheck,
  Download,
  File,
  LoaderIcon,
  Save,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface File {
  name: string;
  url: string;
}

const PedidoId = () => {
  // HOOKS REACT
  const params = useParams();
  const router = useRouter();

  // ESTADOS
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([]);

  const id = Number(params.id);
  const { data, isLoading } = useProject(id);

  // CUSTOM HOOKS
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const assignDesigners = useAssignDesigners();
  const { user } = useUser();
  const { data: designers } = useDesigners(id);

  // Ref para el input de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efecto para setear los datos editados
  useEffect(() => {
    if (data) {
      setEditedData({
        title: data.title || "",
        description: data.description || "",
      });
    }
  }, [data]);

  // Efecto para setear los diseñadores seleccionados antes de guardar
  useEffect(() => {
    if (data?.project_designers) {
      const designerIds = data.project_designers
        .filter(
          (
            pd
          ): pd is {
            designer: { id: string; full_name: string | null; email: string };
          } => pd.designer !== null && pd.designer !== undefined
        )
        .map((pd) => pd.designer.id);
      setSelectedDesigners(designerIds);
    }
  }, [data]);

  // Efecto para cargar los archivos
  useEffect(() => {
    const loadFiles = async () => {
      if (!data?.storage_path) {
        setLoading(false);
        return;
      }
      try {
        const storageFiles = await listFiles(data.storage_path);
        if (!storageFiles || storageFiles.length === 0) {
          setFiles([]);
          setLoading(false);
          return;
        }
        const filesWithUrls = await Promise.all(
          storageFiles.map(async (file) => {
            const url = await getFileUrl(
              `${data.storage_path}/${file.name}`,
              true
            );
            return {
              name: file.name,
              url: url,
            };
          })
        );
        setFiles(filesWithUrls);
      } catch (error) {
        console.error(error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      loadFiles();
    }
  }, [data]);

  // Funcion para subir archivos
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (!data?.storage_path) {
      toast.error("No se puede subir archivos en este momento");
      return;
    }

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`El archivo ${file.name} excede el límite de 50MB`);
          continue;
        }

        const path = `${data.storage_path}/${file.name}`;
        await uploadFile(file, path);
        const url = await getFileUrl(path, true);
        setFiles((prev) => [...prev, { name: file.name, url }]);
      }
      toast.success("Archivos subidos correctamente");
    } catch (error) {
      console.error("Error al subir archivos:", error);
      toast.error("Error al subir los archivos");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Funcion para descargar archivos
  const downloadFile = (url: string) => {
    window.open(url, "_blank");
  };

  // Funcion para guardar los cambios
  const handleSave = async () => {
    try {
      await updateProject.mutateAsync({
        projectId: id,
        data: editedData,
      });
      await assignDesigners.mutateAsync({
        projectId: id,
        designerIds: selectedDesigners,
      });
      setIsEditing(false);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      toast.error("Error al guardar los cambios");
    }
  };

  // Funcion para eliminar el proyecto
  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Proyecto eliminado correctamente");
      router.push("/dashboard/pedidos");
    } catch (error) {
      console.error("Error al marcar el proyecto como eliminado:", error);
      toast.error("Error al marcar el proyecto como eliminado");
    }
  };

  // Funcion para seleccionar diseñadores
  const handleDesignerSelect = (designerId: string) => {
    const newSelectedDesigners = selectedDesigners.includes(designerId)
      ? selectedDesigners.filter((id) => id !== designerId)
      : [...selectedDesigners, designerId];

    setSelectedDesigners(newSelectedDesigners);
  };

  // Renderizado condicional si no se carga por algun motivo
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  const isPM = user?.role_id === 2;

  return (
    <div>
      <div className="mx-auto w-full flex items-center justify-center">
        <CircleCheck className="h-8 w-8 text-white bg-black rounded-full" />
      </div>

      <div className="w-[60%] mx-auto">
        <div>
          <div className="flex justify-between items-center">
            <p className="font-bold mb-2 mt-4">Titulo del pedido</p>
            {isPM && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            )}
          </div>
          <Input
            disabled={!isEditing}
            value={isEditing ? editedData.title : data?.title}
            onChange={(e) =>
              setEditedData({ ...editedData, title: e.target.value })
            }
          />
        </div>

        <div className="mt-8">
          <p className="font-bold mb-2">Descripción del contenido</p>
          <Textarea
            style={{ height: "100px" }}
            disabled={!isEditing}
            value={isEditing ? editedData.description : data?.description || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, description: e.target.value })
            }
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center">
            <p className="font-bold mb-2">Diseñadores asignados</p>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {designers?.map((designer) => (
                  <div
                    key={designer.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                      selectedDesigners.includes(designer.id)
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleDesignerSelect(designer.id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        style={{
                          fontSize: "12px",
                          backgroundColor: selectedDesigners.includes(
                            designer.id
                          )
                            ? "#4CAF50"
                            : "#9E9E9E",
                          color: "white",
                        }}
                      >
                        {designer.full_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {designer.full_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {designer.email}
                      </span>
                    </div>
                    {selectedDesigners.includes(designer.id) && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {(data?.project_designers?.length ?? 0) > 0 ? (
                data?.project_designers
                  ?.filter(
                    (
                      pd
                    ): pd is {
                      designer: {
                        id: string;
                        full_name: string | null;
                        email: string;
                      };
                    } => pd.designer !== null && pd.designer !== undefined
                  )
                  .map((pd) => (
                    <div
                      key={pd.designer.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-100"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                          }}
                        >
                          {pd.designer.full_name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {pd.designer.full_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {pd.designer.email}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">
                  No hay diseñadores asignados
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 mb-8">
          <div className="flex justify-between items-center">
            <p className="font-bold mb-2">
              Material audiovisual de apoyo y/o referentes
            </p>
            {isPM && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir archivos
              </Button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mt-4">
            {loading ? (
              <div className="flex justify-center items-center">
                <LoaderIcon className="animate-spin" />
              </div>
            ) : files.length === 0 ? (
              <p className="text-xs text-gray-500 text-center">
                No hay archivos disponibles
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name.length > 20
                          ? `${file.name.substring(0, 10)}...`
                          : file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file.url)}
                        className="h-8 w-8 p-0 hover:bg-gray-200 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="pb-12 flex justify-end gap-4">
          {isPM && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="text-white cursor-pointer"
                  disabled={deleteProject.isPending}
                >
                  {deleteProject.isPending ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando proyecto...
                    </>
                  ) : (
                    "Eliminar proyecto"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Estás a punto de eliminar el proyecto y no se mostrará más
                    en la lista de proyectos activos.
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
                    onClick={handleDeleteProject}
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
          {isEditing && (
            <Button onClick={handleSave} disabled={updateProject.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateProject.isPending ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoId;
