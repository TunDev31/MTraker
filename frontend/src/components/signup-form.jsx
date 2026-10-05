import logo from "../assets/logo.svg";
import bg from "../assets/bg.svg";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import { useState } from "react";

const zodSchema = z.object({
  firstName: z.string().min(1, "Ho la bat buoc phai co!"),
  lastName: z.string().min(1, "Ten la bat buoc phai co!"),
  userName: z.string().min(3, "Ten dang nhap phai co it nhat 3 ki tu!"),
  email: z.email("Email khong hop le!"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ki tu!"),
});
const defaultSignUpValues = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
};
export function SignupForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultSignUpValues,
  });
  const { signUp } = userStore();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const { userName, password, email, firstName, lastName } = data;
    await signUp(userName, password, email, firstName, lastName);
    navigate("/signin");
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={cn("flex flex-col gap-3 ", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-8">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 items-center text-center">
                <a href="/" className="mx-auto w-fit block text-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-auto object-contain"
                  />
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản MTracker</h1>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="block text-sm">
                    Họ
                  </Label>

                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Nguyen"
                    className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className="text-[11px] text-red-500 font-medium">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="firstName" className="block text-sm">
                    Tên
                  </Label>
                  <Input
                    type="text"
                    placeholder="Van A"
                    id="firstName"
                    className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 ">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="block text-sm">
                  Tên đăng nhập
                </Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Tên đăng nhập"
                  icon={<User color="black" />}
                  className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                  {...register("userName")}
                />

                {errors.userName && (
                  <p className="text-sm text-red-500 ">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  placeholder="example@gmail.com"
                  icon={<Mail color="black" />}
                  className="p-2 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-sm text-red-500 ">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Mật khẩu"
                    icon={<LockKeyhole color="black" />}
                    className="p-2 pr-10 bg-(--bg-primary) focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-red-500 ">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                className=" w-full mx-auto px-5 py-3 rounded-xl bg-linear-to-r from-[#007A33] via-[#009E47] to-[#12B756] text-white font-bold text-xl"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </button>
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a
                  href="/signin"
                  className=" text-green-700 font-bold underline underline-offset-4"
                >
                 Đăng nhập
                </a>
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
