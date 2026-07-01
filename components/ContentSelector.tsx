import { contentDescriptions, contentLabels, contentTypes, type ContentType } from "@/types/content";

type ContentSelectorProps = {
  value: ContentType;
  onChange: (content: ContentType) => void;
};

export function ContentSelector({ value, onChange }: ContentSelectorProps) {
  return (
    <div className="grid gap-2 md:grid-cols-7">
      {contentTypes.map((content) => (
        <button
          key={content}
          type="button"
          onClick={() => onChange(content)}
          className={`hud-card min-h-20 px-3 py-3 text-left transition ${
            value === content ? "border-signal/70 bg-signal/15 text-signal shadow-glow" : "text-slate-300 hover:border-signal/40"
          }`}
          title={contentDescriptions[content]}
        >
          <span className="block text-[10px] font-black uppercase text-magenta">Operation</span>
          <span className="mt-1 block break-keep text-sm font-black">{contentLabels[content]}</span>
        </button>
      ))}
    </div>
  );
}
