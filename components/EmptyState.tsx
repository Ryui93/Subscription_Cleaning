import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CircleOff } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, actionHref, actionLabel, icon: Icon = CircleOff }: EmptyStateProps) {
  return (
    <section className="hud-card p-5 text-center">
      <Icon className="mx-auto h-8 w-8 text-signal" aria-hidden />
      <h2 className="mt-3 break-keep text-lg font-black text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary mt-4">
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
