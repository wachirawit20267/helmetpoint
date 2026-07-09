"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import HelmetLogo from "@/components/common/HelmetLogo";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, t, logout } = useApp();

  const menus = [
    {
      title: t("profile"),
      href: "/profile",
      icon: "👤",
    },
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: "🏠",
    },
    {
      title: t("history"),
      href: "/history",
      icon: "📜",
    },
    {
      title: t("ranking"),
      href: "/ranking",
      icon: "🏆",
    },
    {
      title: t("device"),
      href: "/device",
      icon: "🪖",
    },
    {
      title: t("settings"),
      href: "/settings",
      icon: "⚙️",
    },
  ];

  return (
    <aside className="w-64 h-full min-h-screen bg-slate-900 dark:bg-[#060A12] text-white p-6 flex flex-col justify-between border-r border-slate-800/60 transition-colors duration-300 overflow-y-auto">
      <div>
        {/* Brand Logo in Sidebar */}
        <div className="mb-8">
          <HelmetLogo size="sm" showText={true} showSubtitle={false} />
          <p className="mt-1 text-[10px] text-center text-slate-400 font-medium">
            AI & IoT Smart Helmet System
          </p>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-1"
                    : "hover:bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                <span>{menu.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User info + Logout */}
      <div className="space-y-3">
        {/* User compact info */}
        {user && (
          <div className="flex items-center gap-3 rounded-2xl bg-slate-800/60 p-3 border border-slate-700/40">
            <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden ring-2 ring-orange-500/30">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-orange-500 to-orange-400 text-xs font-black text-white">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => { logout(); onClose?.(); }}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
        >
          <span className="text-lg">🚪</span>
          <span>{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}