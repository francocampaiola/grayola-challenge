"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "../action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleRequest } from "@/utils/functions";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const PasswordSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(PasswordSchema),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    const { email, password } = data;
    startTransition(async () => {
      const request = await handleRequest(() => login({ email, password }));
      if (!request.success) {
        methods.setError("root", {
          type: "manual",
          message: request.errorMessage || "Error al iniciar sesión",
        });
      } else {
        router.push("/");
      }
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-center min-h-screen w-full bg-[#FFF8EE]">
          <div className="bg-[#FFFFFF] px-14 py-16 rounded-lg shadow-xl">
            <div className="flex justify-center mb-8">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={200} 
                height={100}
                priority
              />
            </div>
            <div className="text-center mt-8">
              <h1 className="text-4xl font-bold">Log In</h1>
              <h1 className="text-md mt-2">Continue to your account</h1>
            </div>
            <div className="mt-4">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...methods.register("email")}
                disabled={isPending}
              />
              {methods.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                {...methods.register("password")}
                disabled={isPending}
              />
              {methods.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {methods.formState.errors.password.message}
                </p>
              )}
            </div>
            {methods.formState.errors.root && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {methods.formState.errors.root.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full mt-4 bg-[#90FE3D] text-black font-bold cursor-pointer hover:bg-[#720eec] hover:text-white"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"} <ArrowRight />
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Login;
