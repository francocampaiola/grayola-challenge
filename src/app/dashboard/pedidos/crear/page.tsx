"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { uploadFile } from "@/utils/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CircleCheck,
  CircleDot,
  Upload,
  X,
  LoaderIcon,
  File,
} from "lucide-react";
import { useCreateProject } from "@/hooks/projects/useProjects";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "audio/mpeg",
  "audio/wav",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const CrearPedido = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const createProject = useCreateProject();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    files: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      files: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (files.length === 0) {
      newErrors.files = "Debes subir al menos un archivo";
    } else {
      const invalidFiles = files.filter(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type)
      );
      if (invalidFiles.length > 0) {
        newErrors.files = `Los siguientes archivos no son permitidos: ${invalidFiles
          .map((f) => f.name)
          .join(
            ", "
          )}. Formatos permitidos: imágenes (JPEG, PNG, GIF, WEBP), videos (MP4, MOV, AVI), audio (MP3, WAV), documentos (PDF, DOC, DOCX)`;
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) =>
      ALLOWED_FILE_TYPES.includes(file.type)
    );
    if (validFiles.length !== droppedFiles.length) {
      const invalidFiles = droppedFiles.filter(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type)
      );
      toast.error(
        `Algunos archivos no son permitidos: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`
      );
    }
    setFiles([...files, ...validFiles]);
    setErrors((prev) => ({ ...prev, files: "" }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) =>
      ALLOWED_FILE_TYPES.includes(file.type)
    );
    if (validFiles.length !== selectedFiles.length) {
      const invalidFiles = selectedFiles.filter(
        (file) => !ALLOWED_FILE_TYPES.includes(file.type)
      );
      toast.error(
        `Algunos archivos no son permitidos: ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`
      );
    }
    setFiles([...files, ...validFiles]);
    setErrors((prev) => ({ ...prev, files: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (!validateForm() || !user) {
      console.log("Validación fallida o usuario no encontrado:", {
        user,
        formData,
        files,
      });
      return;
    }

    setUploading(true);
    try {
      // Generamos un ID único para el proyecto
      const projectId = `pedido_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      console.log("Creando proyecto con datos:", {
        title: formData.title,
        description: formData.description,
        client_id: user.id,
        storage_path: projectId,
      });

      // Primero creamos el proyecto
      const project = await createProject.mutateAsync({
        title: formData.title,
        description: formData.description,
        client_id: user.id,
        storage_path: projectId,
      });

      console.log("Proyecto creado:", project);

      // Luego subimos los archivos
      for (const file of files) {
        console.log("Subiendo archivo:", file.name);
        await uploadFile(file, `${projectId}/${file.name}`);
      }

      toast.success("Pedido creado correctamente");
      router.push("/dashboard/pedidos");
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      toast.error("Error al crear el pedido");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto w-full flex items-center justify-center">
        <div className="flex items-center">
          <CircleCheck className="h-8 w-8 text-white bg-black rounded-full" />
          <div className="h-[2px] w-50 bg-gray-300" />
          <CircleDot className="h-8 w-8 text-black" />
        </div>
      </div>
      <div className="w-[60%] mx-auto">
        <div>
          <div className="flex flex-row items-center gap-1 mb-2 mt-4">
            <p className="font-bold">Titulo del pedido</p>
            <p className="text-sm text-gray-500">(Requerido)</p>
          </div>
          <Input
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        <div className="mt-8">
          <div className="flex flex-row items-center gap-1 mb-2">
            <p className="font-bold">Descripción del contenido</p>
            <p className="text-sm text-gray-500">(Requerido)</p>
          </div>
          <Textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            style={{
              height: "100px",
            }}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 font-medium mt-2">
            Brindanos aquí el detalle de las indicaciones de lo que debe verse y
            los textos (COPIES) que debemos incluir en el contenido. Ten en
            cuenta que aproximadamente 400 palabras en letras Times New Roman
            tamaño 12 corresponden a 1 minuto de video, en caso de aplicar.
          </p>
        </div>
        <div className="mt-8 mb-8">
          <div className="flex flex-row items-center gap-1 mb-2">
            <p className="font-bold">
              Material audiovisual de apoyo y/o referentes
            </p>
            <p className="text-sm text-gray-500">(Requerido)</p>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 mt-4 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <div className="flex flex-col items-center justify-center gap-4">
              {files.length === 0 && (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    Arrastra y suelta tus archivos aquí, o haz clic para
                    seleccionarlos
                  </p>
                </>
              )}
              {files.length > 0 && (
                <>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="relative h-32 w-full rounded-lg overflow-hidden group"
                      >
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="flex items-center gap-3">
                              <File className="h-2 text-gray-500" />
                              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {errors.files && (
            <p className="text-red-500 text-sm mt-1">{errors.files}</p>
          )}
          <p className="text-xs text-gray-500 font-medium mt-2">
            Adjunta los archivos de REFERENTES que nos ayuden a comprender
            claramente tus ideas y expectativas respecto al contenido que
            crearemos para ti. También podras subir los CLIPS, ELEMENTOS
            GRÁFICOS y VOZ EN OFF que requieras que incluyamos en el contenido.
            Asegurate de nombrar de manera EFICIENTE a ambos tipos de archivos
            para poder diferenciarlos.
          </p>
        </div>
        <div className="pb-12 flex justify-end gap-4">
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Creando pedido..." : "Crear pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrearPedido;
