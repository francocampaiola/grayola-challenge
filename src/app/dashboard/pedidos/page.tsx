"use client";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  Table,
} from "@/components/ui/table";
import React from "react";

const Pedidos = () => {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 uppercase text-xs hover:bg-gray-100">
            <TableHead className="w-[300px]">Titulo</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead>Fecha de vencimiento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={1}>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>2</TableCell>
            <TableCell>3</TableCell>
            <TableCell className="text-right">4</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter />
      </Table>
    </div>
  );
};

export default Pedidos;
