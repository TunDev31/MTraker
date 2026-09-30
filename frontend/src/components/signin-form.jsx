import React from 'react'
import logo from "../assets/logo.svg";
import bg from "../assets/bg.svg";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { LockKeyhole, Mail, User } from "lucide-react";
import {z} from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import { userStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
const zodSchema = z.object({
  userName: z.string().min(3,'Ten dang nhap phai co it nhat 3 ki tu!'),
  password: z.string().min(6,'Mat khau phai co it nhat 6 ki tu!')
})
const defaultSignUpValues = {
  userName: "",
  password: "",
};
export function SignInForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultSignUpValues,
  });
   const {signIn} =  userStore();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
      const {userName, password} = data;
      const success = await signIn(userName, password);
      if (success) navigate("/");
  }
  return (
    <div className={cn("flex flex-col gap-3 ", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form 
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 md:p-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 items-center text-center">
                <a href="/" className="mx-auto w-fit block text-center">
                  <img src={logo} alt="Logo" className="h-10 w-auto object-contain"/>
                </a>
                <h1 className="text-2xl font-bold">Đăng nhập tài khoản MTracker</h1>
                
              </div>
              <div className="grid grid-cols-2 gap-3"> 
                

                

                
              </div>
              <div className="flex flex-col gap-2">
                  <Label htmlFor="username" className="block text-sm">
              Tên đăng nhập
                  </Label>
                   <Input
                   type="text"
                   id="username"
                   placeholder="Nhap ten dang nhap cua ban"
                    icon={<User color="black" />}
                     className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                      {...register("userName")}/>
                
                  {errors.userName && (
                    <p className="text-sm text-red-500 ">
                      {errors.userName.message}
                    </p>
                   )}
                </div>


               

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="block text-sm">
              Mật khẩu
                  </Label>
                   <Input
                   type="password"
                   id="password"
                   placeholder="Nhap ten mat khau cua ban"
                   icon={<LockKeyhole   color="black" />}
                     className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                       {...register("password")}/>
                       {errors.password && (
                    <p className="text-sm text-red-500 " >
                      {errors.password.message}
                    </p>
                   )}
                    
                </div>
                <button className=" w-full mx-auto px-5 py-3 rounded-xl bg-linear-to-r from-[#007A33] via-[#009E47] to-[#12B756] text-white font-bold text-xl"
                disabled={isSubmitting}
                >Đăng nhập</button>
                <div className="text-center text-sm">
                  Chưa có tài khoản? {" "} <a href="/signup" className=" text-green-700 font-bold underline underline-offset-4">Đăng ký</a>
                </div>


            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={bg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      {/* <div className="px-6 text-center *:[a]:hover:text-green-700 *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
