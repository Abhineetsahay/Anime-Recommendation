import { NAV_ITEMS } from "../constants";
import { Section } from "../types";

type Props = { active: Section; onChange: (s: Section) => void };

export function SettingsNav({ active, onChange }: Props) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left ${
            active === item.key
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
              : "text-white/40 hover:text-white hover:bg-white/5"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d={item.icon} />
          </svg>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
