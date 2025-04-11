"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Home,
  Logs,
  Grid2x2,
  FileText,
  BarChart,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, text: "Panel de Control", disabled: true, hasArrow: false },
    { icon: Logs, text: "Pedidos", disabled: false, hasArrow: false },
    { icon: Grid2x2, text: "Servicios", disabled: true, hasArrow: false },
    { icon: FileText, text: "Informes", disabled: true, hasArrow: true },
    { icon: BarChart, text: "Facturas", disabled: true, hasArrow: false },
    { icon: Calendar, text: "Almacenamiento", disabled: true, hasArrow: false },
    {
      icon: MessageSquare,
      text: "Configuraciones",
      disabled: true,
      hasArrow: true,
    },
  ];

  return (
    <div className="flex flex-col justify-between w-[220px] pl-2 pt-2 pr-2 border-r border-gray-300">
      <div className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className={`w-[200px] flex items-center justify-between hover:bg-transparent ${
                item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-2 text-left">
                <Icon size={20} />
                <span className="w-[120px] truncate text-left">
                  {item.text}
                </span>
              </div>
              <div className="flex-1 flex justify-end">
                {item.hasArrow && <ChevronRight size={20} />}
              </div>
            </Button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-gray-300"
        >
          <LogOut size={20} />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
