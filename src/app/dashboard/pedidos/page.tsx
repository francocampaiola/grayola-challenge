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

const Pedidos = () => {
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
          <TableRow className="bg-white hover:bg-white">
            <TableCell>
              <div className="flex flex-col">
                <div className="flex items-center gap-0 -ml-2">
                  <Dot style={{ transform: "scale(1)", marginRight: "-4px" }} />
                  <p className="font-bold">Carrousel de piezas gráficas</p>
                </div>
                <p className="text-xs text-gray-400">
                  Diseño para redes sociales
                </p>
              </div>
            </TableCell>
            <TableCell className="font-medium">#1</TableCell>
            <TableCell>
              <Badge className="bg-[#F9DFE2] text-[#502e2e] font-bold">
                Anulado
              </Badge>
            </TableCell>
            <TableCell>
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  style={{
                    fontSize: "12px",
                  }}
                >
                  CN
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              <Badge className="bg-[#DFFAE6] text-[#257643] font-bold">
                <Dot style={{ transform: "scale(2)" }} />
                Baja
              </Badge>
            </TableCell>
            <TableCell>12/04/2025</TableCell>
            <TableCell>12/04/2025</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="rounded-b-lg bg-gray-100 hover:bg-gray-100">
          <TableRow className="h-10 flex items-center  rounded-lg">
            <TableCell>
              <p className="text-xs">Mostrando 10 de 100</p>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Pedidos;
