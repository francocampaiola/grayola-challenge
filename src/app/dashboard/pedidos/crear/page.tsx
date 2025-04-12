"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { uploadFile } from "@/utils/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CircleCheck, CircleDot, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const CrearPedido = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const oversizedFiles = droppedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        `Los siguientes archivos exceden el límite de 50MB: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    setFiles([...files, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        `Los siguientes archivos exceden el límite de 50MB: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    setFiles([...files, ...selectedFiles]);

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
    if (files.length === 0) {
      toast.error("Por favor, seleccioná al menos un archivo");
      return;
    }

    setUploading(true);

    // FUNCIÓN DE PRUEBA PARA SUBIR ARCHIVOS
    // TODO: Quitar esta función y usar la de arriba
    try {
      const pedidoId = `pedido_${Date.now()}_${Math.random().toString(36)}`;
      for (const file of files) {
        await uploadFile(file, `${pedidoId}/${file.name}`);
      }
      toast.success("Archivos subidos correctamente");
      setFiles([]);
    } catch (error) {
      console.error("Error al subir los archivos:", error);
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
          <Input />
        </div>
        <div className="mt-8">
          <div className="flex flex-row items-center gap-1 mb-2">
            <p className="font-bold">Descripción del contenido</p>
            <p className="text-sm text-gray-500">(Requerido)</p>
          </div>
          <Textarea
            style={{
              height: "100px",
            }}
          />
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
                  <p className="text-xs text-gray-500">
                    Tamaño máximo por archivo: 50MB
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
                            <p className="text-xs text-gray-500">{file.name}</p>
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
          {/* <Button
            variant={"outline"}
            className="cursor-pointer"
          >
            Crear pedido
          </Button> */}
          {/* Temporal para probar la subida de archivos */}
          {/* TODO: Quitar esta función y usar la de arriba */}
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Subiendo archivos..." : "Probar subida"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrearPedido;
