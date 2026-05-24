// app/brokers/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useDebounce } from "@/lib/useDebounce";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
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

const filterTabs = ["All Partners", "CFD", "Bond", "Stock", "Crypto"];

const filterToType: Record<string, string | undefined> = {
  "All Partners": undefined,
  CFD: "cfd",
  Bond: "bond",
  Stock: "stock",
  Crypto: "crypto",
};

const typeBadgeColor: Record<string, string> = {
  cfd: "bg-blue-500/20 text-blue-300",
  bond: "bg-green-500/20 text-green-300",
  stock: "bg-yellow-500/20 text-yellow-300",
  crypto: "bg-purple-500/20 text-purple-300",
};

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Partners");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 1000);
  const typeFilter = filterToType[activeFilter];

  const fetchBrokers = useCallback(async (searchTerm: string, type?: string) => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (type) params.type = type;

      const response = await axiosInstance.get("/api/brokers", { params });
      setBrokers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch brokers:", error);
      setBrokers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers(debouncedSearch, typeFilter);
  }, [debouncedSearch, typeFilter, fetchBrokers]);

  const hasFilters = debouncedSearch.trim() !== "" || typeFilter !== undefined;

  return (
    <div className="min-h-screen bg-[#050c1c] text-white flex flex-col">
      <SiteNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Institutional Brokers
          </h1>
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            Access global liquidity through our curated network of elite
            financial institutions and market makers.
          </p>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Find brokers by name, region, or asset class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-xs text-gray-500 mr-2 uppercase tracking-wider">
            Asset Focus
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeFilter === tab
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokers.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}

            <PartnerCard />

            {brokers.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                <p className="text-4xl mb-3">🔍</p>
                <p>
                  No brokers found
                  {hasFilters && (
                    <>
                      {" "}
                      for &quot;{debouncedSearch || activeFilter}&quot;
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function BrokerCard({ broker }: { broker: Broker }) {
  const cardGradient: Record<string, string> = {
    cfd: "from-blue-900/40 to-[#0d1628]",
    bond: "from-green-900/40 to-[#0d1628]",
    stock: "from-yellow-900/40 to-[#0d1628]",
    crypto: "from-purple-900/40 to-[#0d1628]",
  };

  return (
    <Link href={`/brokers/${broker.slug}`}>
      <div className="group relative bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer">
        <div
          className={`h-44 bg-gradient-to-br ${
            cardGradient[broker.broker_type]
          } relative overflow-hidden`}
        >
          {broker.logo_url ? (
            <img
              src={broker.logo_url}
              alt={broker.name}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-black text-white/10 select-none">
                {broker.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                typeBadgeColor[broker.broker_type]
              }`}
            >
              {broker.broker_type.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold text-white mb-1.5">
            {broker.name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
            {broker.description || "No description available."}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {broker.broker_type}
              </span>
            </div>
            <span className="text-xs text-blue-400 group-hover:text-blue-300 flex items-center gap-1 transition">
              View Details
              <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PartnerCard() {
  return (
    <div className="border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/5 transition">
      <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl">🤝</span>
      </div>

      <h3 className="text-base font-bold text-white mb-2">Partner with Us</h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-5">
        Are you an institutional broker? Join our exclusive network of partners.
      </p>

      <Link
        href="/login"
        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition"
      >
        Inquire More
      </Link>
    </div>
  );
}
