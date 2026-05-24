"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { getUser, isLoggedIn, logout } from "@/lib/auth";

const navLinks = [
  { label: "Brokers", href: "/brokers" }
];

export default function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(
    null
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      const ok = isLoggedIn();
      setLoggedIn(ok);
      setUser(ok ? getUser() : null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync);
    };
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  const isBrokersActive =
    pathname === "/brokers" || pathname.startsWith("/brokers/");

  return (
    <nav className="border-b border-white/10 px-6 md:px-8 py-4 sticky top-0 z-50 bg-[#050c1c]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/brokers" className="text-xl font-bold text-white tracking-wide shrink-0">
          Woxa
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const active = link.href === "/brokers" && isBrokersActive;
            if (link.href === "#") {
              return (
                <span
                  key={link.label}
                  className="text-slate-500 hover:text-white cursor-pointer transition"
                >
                  {link.label}
                </span>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition pb-0.5 ${
                  active
                    ? "text-white font-medium border-b-2 border-blue-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0" ref={menuRef}>
          {loggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm text-white transition max-w-[200px]"
              >
                <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="truncate hidden sm:inline">
                  {user?.fullName || "User"}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 shrink-0 transition ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#0d1528] shadow-xl py-1 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white transition"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
