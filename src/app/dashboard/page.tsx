"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { ChevronUp, LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full border-t border-gray-100">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Bienvenido, {user?.full_name}</h1>
          <div className="bg-white rounded-lg px-4 w-[85%]">
            <div className="w-full h-12 flex items-center justify-between ">
              <p className="font-semibold">Empezar</p>
              <ChevronUp />
            </div>
            <hr className="border-gray-200" />
            <div className="flex w-full items-center justify-between px-4">
              <div className="my-4">
                <p className="font-semibold">¡Comencemos!</p>
                <p className="font-semibold mt-2">Crea tu primer pedido</p>
                <p className="text-gray-500 mt-2">
                  Mira un video de 2 minutos para empezar. Tu primer pedido en
                  pocos pasos.
                </p>
                <Link
                  href="https://www.youtube.com/watch?v=tfFnNi1iro4"
                  target="_blank"
                >
                  <Button className="mt-4 cursor-pointer">Ver video</Button>
                </Link>
              </div>
              <Image
                src="/video_bg.jpeg"
                alt="video"
                width={200}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
