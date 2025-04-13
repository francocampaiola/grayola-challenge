"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getFileUrl,
  listFiles,
  uploadFile,
  deleteFile,
} from "@/utils/supabase/storage";
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/projects/useProjects";
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
  X,
} from "lucide-react";
import { toast } from "sonner";

interface File {
  name: string;
  url: string;
}

const PedidoId = () => {
  const params = useParams();
  const router = useRouter();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const id = Number(params.id);
  const { user } = useUser();
  const { data, isLoading } = useProject(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setEditedData({
        title: data.title || "",
        description: data.description || "",
      });
    }
  }, [data]);

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

  const handleDeleteFile = async (fileName: string) => {
    try {
      await deleteFile(`${data?.storage_path}/${fileName}`);
      setFiles((prev) => prev.filter((f) => f.name !== fileName));
      toast.success("Archivo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      toast.error("Error al eliminar el archivo");
    }
  };

  const downloadFile = (url: string) => {
    window.open(url, "_blank");
  };

  const handleSave = async () => {
    try {
      await updateProject.mutateAsync({
        projectId: id,
        data: editedData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Proyecto marcado como eliminado correctamente");
      router.push("/dashboard/pedidos");
    } catch (error) {
      console.error("Error al marcar el proyecto como eliminado:", error);
      toast.error("Error al marcar el proyecto como eliminado");
    }
  };

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

        {isEditing && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={updateProject.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </Button>
          </div>
        )}

        <div className="mt-8">
          <p className="font-bold mb-2">Diseñadores asignados</p>
          <div className="flex flex-wrap gap-4">
            {data?.project_designers?.length ? (
              data.project_designers.map((pd, index) => (
                <div key={pd.designer.id} className="flex items-center gap-2">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      style={{
                        fontSize: "14px",
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
                  <span className="text-sm font-medium">
                    {pd.designer.full_name}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500">
                No hay diseñadores asignados
              </span>
            )}
          </div>
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
                    <div className="flex items-center gap-3">
                      <File className="h-2 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file.url)}
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {isPM && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.name)}
                          className="hover:bg-gray-200 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="pb-12 flex justify-end">
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
        </div>
      </div>
    </div>
  );
};

export default PedidoId;
