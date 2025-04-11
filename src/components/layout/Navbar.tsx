import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { BellDot } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full h-14 justify-between p-4 flex items-center">
      <Image src="/logo.png" alt="logo" width={150} height={100} />
      <div className="flex items-center gap-4">
        <Button>Crear pedido</Button>
        <BellDot size={20} />
      </div>
    </div>
  );
};

export default Navbar;
