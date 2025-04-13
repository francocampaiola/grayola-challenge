"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { BellDot } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "../ui/skeleton";
import logo from "@/../public/logo.png";

const Navbar = () => {
  const { user, loading } = useUser();
  return (
    <div className="w-full h-14 justify-between p-4 flex items-center">
      <Image
        src={logo}
        alt="logo"
        width={150}
        height={100}
        priority
        quality={100}
        className="object-contain"
      />
      <div className="flex items-center gap-4">
        {loading ? (
          <Skeleton className="w-20 h-4 rounded-full" />
        ) : user && user.role_id === 1 ? (
          <Link href="/dashboard/pedidos/crear">
            <Button className="cursor-pointer">Crear pedido</Button>
          </Link>
        ) : (
          <Button className="cursor-not-allowed opacity-50 hover:opacity-50">
            Crear pedido
          </Button>
        )}
        <BellDot className="cursor-not-allowed" size={20} />
      </div>
    </div>
  );
};

export default Navbar;
