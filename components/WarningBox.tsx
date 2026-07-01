import { AlertTriangle } from "lucide-react";

type WarningBoxProps = {
  title?: string;
  children: React.ReactNode;
};

export function WarningBox({ title = "확인 필요", children }: WarningBoxProps) {
  return (
    <div className="rounded-md border border-amber/40 bg-black/35 p-4 text-sm text-amber shadow-alert">
      <div className="mb-1 flex items-center gap-2 font-black uppercase">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        {title}
      </div>
      <div className="leading-6 text-amber/90">{children}</div>
    </div>
  );
}
