"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Trophy,
  Shield,
  User,
  Settings,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Ranking",
    href: "/ranking",
    icon: Trophy,
  },
  {
    name: "Device",
    href: "/device",
    icon: Shield,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1E3A5F] text-white h-screen flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <h1 className="text-2xl font-bold text-orange-400">
          HelmetPoint
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                pathname === item.href
                  ? "bg-orange-500"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}