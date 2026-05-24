// app/brokers/[slug]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  MapPin,
  Mail,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  ExternalLink,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { isLoggedIn } from "@/lib/auth";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

type Broker = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  website: string;
  broker_type: "cfd" | "bond" | "stock" | "crypto";
};

const typeBadgeColor: Record<string, string> = {
  cfd: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  bond: "bg-green-500/20 text-green-300 border-green-500/30",
  stock: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  crypto: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const typeLabel: Record<string, string> = {
  cfd: "CFD Broker",
  bond: "Bond Broker",
  stock: "Stock Broker",
  crypto: "Crypto Broker",
};

export default function BrokerDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    fetchBroker();
  }, [slug]);

  const fetchBroker = async () => {
    try {
      const response = await axiosInstance.get(`/api/brokers/${slug}`);
      setBroker(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 404) setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not Found
  if (notFound || !broker) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-6xl">🔍</p>
        <h2 className="text-2xl font-bold">Broker Not Found</h2>
        <p className="text-gray-400 text-sm">
          The broker you're looking for doesn't exist.
        </p>
        <Link
          href="/brokers"
          className="mt-4 text-blue-400 hover:underline text-sm flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to Brokers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050c1c] text-white flex flex-col">
      <SiteNav />
      {loggedIn && (
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 pt-4 flex justify-end">
          <Link
            href={`/brokers/${slug}/edit`}
            className="text-xs bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/50 text-white px-4 py-2 rounded-lg transition"
          >
            Edit Broker
          </Link>
        </div>
      )}

      {/* ===== Hero Section ===== */}
      <section className="relative h-[420px] overflow-hidden">

        {/* Background Image */}
        {broker.logo_url ? (
          <img
            src={broker.logo_url}
            alt={broker.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-[#0a0f1e]" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/80 to-transparent" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-12">

          {/* Back Link */}
          <Link
            href="/brokers"
            className="absolute top-8 left-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full">
              INSTITUTIONAL BROKER
            </span>
            <span
              className={`text-xs border px-3 py-1 rounded-full ${
                typeBadgeColor[broker.broker_type]
              }`}
            >
              {broker.broker_type.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
            {broker.name}
          </h1>

          {/* Short Description */}
          <p className="text-gray-300 text-base max-w-xl leading-relaxed mb-6">
            {broker.description?.slice(0, 120) ||
              "The definitive platform for institutional liquidity and execution."}
            {broker.description?.length > 120 ? "..." : ""}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={broker.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 text-sm font-semibold px-5 py-2.5 rounded-lg transition"
            >
              <Globe size={15} />
              Visit Website
            </a>
            <button className="flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 text-sm font-semibold px-5 py-2.5 rounded-lg transition">
              <Download size={15} />
              Download Prospectus
            </button>
          </div>
        </div>
      </section>

      {/* ===== Main Content ===== */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== Left Column (2/3) ===== */}
          <div className="lg:col-span-2 space-y-10">

            {/* About Section */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">
                The Sovereign Mandate
              </h2>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  {broker.description ||
                    `${broker.name} has consistently redefined the boundaries of institutional brokerage. With a singular focus on performance and professional management, we provide our clients with the tools necessary to navigate the complexities of global liquidity.`}
                </p>
                <p>
                  Our infrastructure is built on low-latency fiber arrays connecting
                  directly to the world's primary exchanges. We offer an unparalleled
                  suite of assets, including synthetic instruments designed for modern portfolios.
                </p>
              </div>
            </section>

            {/* Features Grid */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Shield,
                    title: "SEC & FCA Regulated",
                    desc: "Fully compliant with international financial regulatory requirements.",
                  },
                  {
                    icon: Zap,
                    title: "12ms Execution",
                    desc: "Industry-leading throughput direct to primary listing exchanges.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Global Markets",
                    desc: `Access to ${typeLabel[broker.broker_type]} across major global exchanges.`,
                  },
                  {
                    icon: BarChart3,
                    title: "Advanced Analytics",
                    desc: "Real-time data, charts, and portfolio analytics built for institutions.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                      <feature.icon size={18} className="text-blue-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Available Markets */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6">
                Available Markets
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: "Instruments", value: "80+" },
                  { label: "Assets", value: "25" },
                  { label: "Currencies", value: "18" },
                  { label: "Daily Trades", value: "4,000+" },
                  { label: "Exchanges", value: "12" },
                  { label: "Crypto Pairs", value: "5" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition"
                  >
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ===== Right Column (1/3) ===== */}
          <div className="space-y-5">

            {/* Performance Metrics Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-5">
                Performance Metrics
              </h3>
              <div className="space-y-5">

                {/* AUM */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-500">AUM GROWTH (YOY)</p>
                    <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                      <ArrowUpRight size={12} />
                      UP
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-green-400">+26.8%</p>
                </div>

                <div className="border-t border-white/10" />

                {/* AUM Total */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">TOTAL AUM</p>
                  <p className="text-2xl font-bold text-white">$12.4B</p>
                  <p className="text-xs text-gray-500 mt-0.5">Daily Average</p>
                </div>

                <div className="border-t border-white/10" />

                {/* Client Retention */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">CLIENT RETENTION</p>
                    <p className="text-xs text-gray-500">FY2024</p>
                  </div>
                  <p className="text-2xl font-bold text-white">98.2%</p>
                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "98.2%" }}
                    />
                  </div>
                </div>

              </div>

              <button className="w-full mt-5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 py-2.5 rounded-lg transition">
                View Full Audit Report
              </button>
            </div>

            {/* Contact & Details Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                Contact & Details
              </h3>
              <div className="space-y-3">

                {/* Type */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm text-white font-medium">
                      {typeLabel[broker.broker_type]}
                    </p>
                  </div>
                </div>

                {/* Slug */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Slug</p>
                    <p className="text-sm text-white font-medium">
                      {broker.slug}
                    </p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe size={13} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Website</p>
                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 truncate flex items-center gap-1 transition"
                    >
                      {broker.website?.replace("https://", "") || "N/A"}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Admin Edit Button — แสดงเฉพาะ Login แล้ว */}
            {loggedIn && (
              <Link
                href={`/brokers/${broker.slug}/edit`}
                className="block w-full text-center border border-white/20 hover:bg-white/10 text-white text-sm font-semibold py-3 rounded-xl transition"
              >
                ✏️ Edit This Broker
              </Link>
            )}

          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}