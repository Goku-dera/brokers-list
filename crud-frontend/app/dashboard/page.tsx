"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import BrokerCard from "@/app/components/BrokerCard";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuthGuard } from "@/lib/useAuthGuard";

type Broker = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: "cfd" | "bond" | "stock" | "crypto";
};

export default function DashboardPage() {
  const isAuth = useAuthGuard();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ fullName?: string } | null>(null);

  useEffect(() => {
    if (!isAuth) return;
    setUser(getUser());
    fetchBrokers();
  }, [isAuth]);

  const fetchBrokers = async () => {
    try {
      const response = await axiosInstance.get("/api/brokers");
      setBrokers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch brokers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuth) return null;

  const stats = [
    { label: "Total Brokers", value: brokers.length },
    {
      label: "CFD",
      value: brokers.filter((b) => b.broker_type === "cfd").length,
    },
    {
      label: "Bond",
      value: brokers.filter((b) => b.broker_type === "bond").length,
    },
    {
      label: "Stock",
      value: brokers.filter((b) => b.broker_type === "stock").length,
    },
    {
      label: "Crypto",
      value: brokers.filter((b) => b.broker_type === "crypto").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050c1c] text-white flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl text-white mb-2">Dashboard</h1>
            <p className="text-slate-400 text-sm">
              Welcome back,{" "}
              <span className="text-sky-400 font-medium">
                {user?.fullName || "User"}
              </span>
            </p>
          </div>

          <Link
            href="/brokers/add"
            className="inline-flex items-center justify-center gap-2 auth-gradient-btn text-sm font-bold tracking-wide uppercase px-5 py-3 rounded-lg transition shrink-0"
          >
            <PlusCircle size={16} />
            Add Broker
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="auth-card rounded-xl p-5 border border-white/5"
            >
              <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-5">All Brokers</h2>

          {isLoading && (
            <div className="flex justify-center py-32">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && brokers.length === 0 && (
            <div className="auth-card rounded-2xl text-center py-20 px-6">
              <p className="text-slate-400 text-sm">No brokers yet</p>
              <Link
                href="/brokers/add"
                className="mt-4 inline-block text-sky-400 hover:text-sky-300 text-sm font-medium transition"
              >
                + Add your first broker
              </Link>
            </div>
          )}

          {!isLoading && brokers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} variant="dark" />
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
