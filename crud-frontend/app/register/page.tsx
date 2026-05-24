"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AtSign, ArrowRight } from "lucide-react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import PasswordInput from "@/app/components/PasswordInput";
import { useGuestOnly } from "@/lib/useGuestOnly";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const labelClass =
  "block text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-2";
const inputClass =
  "w-full bg-[#0d1528] border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

export default function RegisterPage() {
  const router = useRouter();
  const ready = useGuestOnly("/dashboard");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setMessage("");
      const response = await axios.post("http://localhost:3001/api/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setIsSuccess(false);
      setMessage(
        err.response?.data?.message || "Registration failed. Please try again."
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
      <SiteNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 py-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero */}
        <div className="hidden lg:block relative rounded-2xl overflow-hidden min-h-[520px] border border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(5,12,28,0.85), rgba(5,12,28,0.4)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80')",
            }}
          />
          <div className="relative z-10 p-10 flex flex-col justify-end h-full">
            <p className="text-[10px] tracking-widest text-sky-400 uppercase mb-3">
              Sovereign Ledger
            </p>
            <h1 className="font-serif text-4xl text-white leading-tight mb-4">
              Secure Your Entry into the Platform
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Register to manage institutional brokers, submit listings, and
              access your private dashboard.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="auth-card rounded-2xl p-8 md:p-10 w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
          <h2 className="font-serif text-2xl text-white mb-1">
            Institutional Onboarding
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Complete the form below to initialize your account.
          </p>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm border ${
                isSuccess
                  ? "bg-green-500/10 text-green-300 border-green-500/30"
                  : "bg-red-500/10 text-red-300 border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={inputClass}
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      message: "At least 6 characters",
                    },
                  })}
                  error={errors.password?.message}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  registration={register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) =>
                      v === password || "Passwords do not match",
                  })}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full auth-gradient-btn font-bold text-sm tracking-widest uppercase py-3.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Registering..." : "Initialize Registration"}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already verified?{" "}
            <Link
              href="/login"
              className="text-sky-400 hover:text-sky-300 transition"
            >
              Institutional Login
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
