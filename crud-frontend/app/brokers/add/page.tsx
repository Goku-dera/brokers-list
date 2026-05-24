"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useAuthGuard } from "@/lib/useAuthGuard";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import BrokerFormFields, {
  type BrokerFormValues,
} from "@/app/components/BrokerFormFields";

export default function AddBrokerPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const isAuth = useAuthGuard();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BrokerFormValues>({
    defaultValues: { broker_type: "" },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", slug);
  };

  const onSubmit = async (data: BrokerFormValues) => {
    try {
      setErrorMessage("");
      await axiosInstance.post("/api/brokers", data);
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "Failed to create broker."
      );
    }
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[#050c1c] text-white flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-white mb-3">Submit Broker</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Provide the required institutional details for your broker listing.
            All submissions are reviewed before publication.
          </p>
        </div>

        <div className="auth-card rounded-2xl p-8 md:p-10">
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg text-sm bg-red-500/10 text-red-300 border border-red-500/30">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <BrokerFormFields
              register={register}
              errors={errors}
              onNameChange={handleNameChange}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 text-center border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold py-3 rounded-lg transition"
              >
                Discard
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 auth-gradient-btn font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
