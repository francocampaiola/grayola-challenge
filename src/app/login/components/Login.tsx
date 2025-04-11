import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#FFF8EE]">
      <div className="bg-[#FFFFFF] px-14 py-16 rounded-lg shadow-xl">
        <Image
          src={"/logo.png"}
          width={200}
          height={100}
          alt="Logo"
          className="mx-auto"
        />
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold">Log In</h1>
          <h1 className="text-md mt-2">Continue to your account</h1>
        </div>
        <div className="mt-4">
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input type="email" id="email" />
        </div>
        <div className="mt-4">
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input type="password" id="email" />
        </div>
        <Button className="default w-full mt-4 bg-[#90FE3D] text-black font-bold cursor-pointer">
          Sign In <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Login;
