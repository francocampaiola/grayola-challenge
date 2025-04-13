"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProject } from "@/hooks/projects/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CircleCheck, Download, File, LoaderIcon } from "lucide-react";
import { getFileUrl, listFiles } from "@/utils/supabase/storage";

interface File {
  name: string;
  url: string;
}

const PedidoId = () => {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading } = useProject(id);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

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

  const downloadFile = (url: string) => {
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-full flex items-center justify-center">
        <CircleCheck className="h-8 w-8 text-white bg-black rounded-full" />
      </div>

      <div className="w-[60%] mx-auto">
        <div>
          <p className="font-bold mb-2 mt-4">Titulo del pedido</p>
          <Input disabled value={data?.title} />
        </div>

        <div className="mt-8">
          <p className="font-bold mb-2">Descripción del contenido</p>
          <Textarea
            style={{ height: "100px" }}
            value={data?.description || ""}
            disabled
          />
        </div>

        <div className="mt-8 mb-8">
          <p className="font-bold mb-2">
            Material audiovisual de apoyo y/o referentes
          </p>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file.url)}
                      className="hover:bg-gray-200 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="pb-12 flex justify-end">
          <Button variant="destructive">Eliminar proyecto</Button>
        </div>
      </div>
    </div>
  );
};

export default PedidoId;
