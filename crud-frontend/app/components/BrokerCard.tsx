import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

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

const typeBadgeColorLight: Record<string, string> = {
  cfd: "bg-blue-100 text-blue-700",
  bond: "bg-green-100 text-green-700",
  stock: "bg-yellow-100 text-yellow-700",
  crypto: "bg-purple-100 text-purple-700",
};

type BrokerCardProps = {
  broker: Broker;
  variant?: "light" | "dark";
};

export default function BrokerCard({
  broker,
  variant = "dark",
}: BrokerCardProps) {
  const isDark = variant === "dark";
  const badgeClass = isDark
    ? typeBadgeColor[broker.broker_type]
    : typeBadgeColorLight[broker.broker_type];

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-3 transition ${
        isDark
          ? "bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07]"
          : "bg-white shadow-sm border border-gray-100 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {broker.logo_url ? (
            <img
              src={broker.logo_url}
              alt={broker.name}
              className={`w-10 h-10 rounded-full object-cover shrink-0 ${
                isDark ? "border border-white/20" : "border border-gray-200"
              }`}
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                isDark
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {broker.name.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3
              className={`text-sm font-semibold truncate ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {broker.name}
            </h3>
            <p className={`text-xs truncate ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              {broker.slug}
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${badgeClass}`}
        >
          {broker.broker_type.toUpperCase()}
        </span>
      </div>

      {broker.description && (
        <p
          className={`text-sm line-clamp-2 ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {broker.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <Link
          href={`/brokers/${broker.slug}`}
          className={`text-sm font-medium flex items-center gap-1 transition ${
            isDark
              ? "text-sky-400 hover:text-sky-300"
              : "text-blue-500 hover:underline"
          }`}
        >
          View Detail
          <ArrowRight size={14} />
        </Link>

        {broker.website && (
          <a
            href={broker.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-xs transition ${
              isDark
                ? "text-slate-500 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <ExternalLink size={12} />
            Website
          </a>
        )}
      </div>
    </div>
  );
}
