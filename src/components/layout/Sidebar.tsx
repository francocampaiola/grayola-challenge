"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Home,
  Logs,
  Grid2x2,
  LogOut,
  ChevronRight,
  StickyNote,
  ReceiptText,
  Database,
  Cog,
  EllipsisVertical,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "../ui/skeleton";
import { handleLogout } from "@/app/actions";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  const menuItems = [
    {
      icon: Home,
      text: "Panel de Control",
      disabled: false,
      hasArrow: false,
      href: "/dashboard",
    },
    {
      icon: Logs,
      text: "Pedidos",
      disabled: false,
      hasArrow: false,
      href: "/dashboard/pedidos",
    },
    { icon: Grid2x2, text: "Servicios", disabled: true, hasArrow: false },
    { icon: StickyNote, text: "Informes", disabled: true, hasArrow: true },
    { icon: ReceiptText, text: "Facturas", disabled: true, hasArrow: false },
    { icon: Database, text: "Almacenamiento", disabled: true, hasArrow: false },
    {
      icon: Cog,
      text: "Configuraciones",
      disabled: true,
      hasArrow: true,
    },
  ];

  const onLogout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      router.replace("/login");
    }
  };

  return (
    <div className="flex flex-col justify-between w-[220px] pl-2 pt-2 pr-2 border-r border-gray-300">
      <div className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link href={item?.href || ""} key={index}>
              <Button
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
            </Link>
          );
        })}
      </div>
      <div className="pl-2 pb-4 gap-2 flex flex-row items-center justify-between">
        <div className="w-full flex items-center gap-2 flex-row">
          {loading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : (
            <Avatar className="w-8 h-8 bg-secondary items-center justify-center">
              <AvatarFallback className="text-xs">
                {user?.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          {loading ? (
            <Skeleton className="w-20 h-4 rounded-full" />
          ) : (
            <p className="text-sm">{user?.full_name}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical size={15} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 cursor-pointer"
                onClick={onLogout}
              >
                <LogOut size={15} />
                Cerrar sesión
              </Button>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
