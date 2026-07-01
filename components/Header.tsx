import Link from "next/link";
import { Crosshair, ShieldCheck } from "lucide-react";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-signal/20 bg-shell/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md border border-signal/60 bg-black/40 text-signal shadow-glow">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-black uppercase text-magenta">Ark Tactical Console</span>
              <span className="block truncate text-xl font-black text-white">니케의 모든 것</span>
            </span>
          </Link>
          <div className="hidden items-center gap-2 rounded-md border border-amber/35 bg-black/35 px-3 py-2 text-xs font-bold text-amber md:flex">
            <Crosshair className="h-4 w-4" aria-hidden />
            SQUAD ASSIST · 비공식 MVP
          </div>
        </div>
        <Navigation />
      </div>
    </header>
  );
}
