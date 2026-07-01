"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Database, Home, Radio, Sparkles, TrendingUp, Users, Wrench } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/owned", label: "내 보유 니케", icon: Users },
  { href: "/account", label: "계정 성장", icon: Activity },
  { href: "/recommend", label: "조합 추천", icon: Sparkles },
  { href: "/growth", label: "육성 추천", icon: TrendingUp },
  { href: "/tools", label: "외부 도구", icon: Wrench },
  { href: "/meta", label: "메타 참고", icon: Radio },
  { href: "/admin", label: "관리자", icon: Database }
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto border-t border-white/10 px-4 pt-3 md:mx-0 md:flex-wrap md:px-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-bold transition ${
              isActive
                ? "border-signal/70 bg-signal/15 text-signal shadow-glow"
                : "border-line bg-black/30 text-slate-300 hover:border-signal/40 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
