"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useAuthGuard } from "@/lib/useAuthGuard";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import BrokerFormFields, {
  type BrokerFormValues,
} from "@/app/components/BrokerFormFields";

export default function EditBrokerPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAuth = useAuthGuard();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrokerFormValues>();

  useEffect(() => {
    if (!isAuth) return;
    fetchBroker();
  }, [slug, isAuth]);

  const fetchBroker = async () => {
    try {
      const response = await axiosInstance.get(`/api/brokers/${slug}`);
      const broker = response.data.data;
      reset({
        name: broker.name,
        slug: broker.slug,
        description: broker.description ?? "",
        logo_url: broker.logo_url ?? "",
        website: broker.website ?? "",
        broker_type: broker.broker_type,
      });
    } catch {
      setErrorMessage("Failed to load broker data.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BrokerFormValues) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await axiosInstance.put(`/api/brokers/${slug}`, data);
      setSuccessMessage("Broker updated successfully.");
      if (data.slug !== slug) {
        setTimeout(() => {
          router.push(`/brokers/${data.slug}/edit`);
        }, 1000);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "Failed to update broker."
      );
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/api/brokers/${slug}`);
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(
        err.response?.data?.message || "Failed to delete broker."
      );
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[#050c1c] text-white flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 md:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href={`/brokers/${slug}`}
              className="text-sm text-slate-500 hover:text-slate-300 transition mb-3 inline-block"
            >
              ← Back to broker
            </Link>
            <h1 className="font-serif text-4xl text-white mb-2">Edit Broker</h1>
            <p className="text-slate-400 text-sm">
              Update broker information and save your changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 text-sm font-semibold px-4 py-2.5 rounded-lg transition shrink-0"
          >
            <Trash2 size={15} />
            Delete Broker
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <div className="auth-card rounded-2xl p-8 md:p-10">
            {successMessage && (
              <div className="mb-6 p-3 rounded-lg text-sm bg-green-500/10 text-green-300 border border-green-500/30">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg text-sm bg-red-500/10 text-red-300 border border-red-500/30">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <BrokerFormFields
                register={register}
                errors={errors}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/brokers/${slug}`}
                  className="flex-1 text-center border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 auth-gradient-btn font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <SiteFooter />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="auth-card rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Delete Broker?
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                This action cannot be undone. The broker will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border border-white/10 text-slate-400 hover:bg-white/5 text-sm font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
