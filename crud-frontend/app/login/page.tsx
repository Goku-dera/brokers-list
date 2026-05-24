"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AtSign } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import PasswordInput from "@/app/components/PasswordInput";
import { useGuestOnly } from "@/lib/useGuestOnly";

type LoginForm = {
  email: string;
  password: string;
};

const labelClass =
  "block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-2";
const inputClass =
  "w-full bg-[#0d1528] border border-blue-500/30 rounded-lg py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

export default function LoginPage() {
  const router = useRouter();
  const ready = useGuestOnly("/dashboard");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMessage("");
      const response = await axios.post(
        "http://localhost:3001/api/login",
        data
      );
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#050c1c] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050c1c] flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #050c1c 0%, rgba(5,12,28,0.7) 50%, #050c1c 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="auth-card rounded-2xl w-full max-w-md p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl text-sky-100 mb-1">Woxa</h1>
              <p className="text-[10px] tracking-[0.25em] text-slate-500 uppercase">
                Institutional Terminal
              </p>
            </div>

            <h2 className="font-serif text-2xl text-white mb-2">
              Secure Verification
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Access your broker dashboard with verified credentials.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-300 border border-red-500/30">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Institutional Email
                </label>
                <div className="relative">
                  <AtSign
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@institution.com"
                    className={`${inputClass} pl-10`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Security Password
                </label>
                <PasswordInput
                  id="password"
                  registration={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full auth-gradient-btn font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? "Verifying..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-sky-400 hover:text-sky-300 transition"
              >
                Register
              </Link>
            </p>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
