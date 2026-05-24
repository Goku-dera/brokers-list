// src/components/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, isLoggedIn, getUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";

// เมนูที่ทุกคนเห็น
const publicMenuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Brokers",
    href: "/brokers",
    icon: Building2,
  },
];

// เมนูเฉพาะคนที่ Login
const privateMenuItems = [
  {
    label: "Add Broker",
    href: "/brokers/add",
    icon: PlusCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ Mobile — เปิด/ปิด Sidebar
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loginStatus = isLoggedIn();
    setLoggedIn(loginStatus);
    if (loginStatus) setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // เมนูที่จะแสดง ตาม Login Status
  const menuItems = loggedIn
    ? [...publicMenuItems, ...privateMenuItems]
    : publicMenuItems;

  // ---- Sidebar Content (ใช้ซ้ำทั้ง Desktop + Mobile) ----
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-600">BrokerHub</h1>
          {loggedIn && (
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          )}
        </div>
        {/* ปุ่มปิด (Mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Login / User + Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        {loggedIn ? (
          // ✅ Login แล้ว → แสดง User + Logout
          <div className="space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          // ✅ ยังไม่ Login → แสดงปุ่ม Login
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-500 hover:bg-blue-50 transition w-full"
          >
            <LogIn size={18} />
            Login
          </Link>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

      {/* ===== Mobile — Hamburger Button ===== */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* ===== Mobile — Overlay ===== */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== Mobile — Drawer Sidebar ===== */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}