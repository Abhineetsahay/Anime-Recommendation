// components/TabBar.tsx
"use client";
import { TABS, Tab } from "../types";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  userGenresEmpty: boolean;
};

export default function TabBar({ activeTab, onTabChange, userGenresEmpty }: Props) {
  return (
    <div className="flex gap-1 mb-4 sm:mb-6 bg-white/5 p-1 rounded-lg sm:rounded-xl w-full overflow-x-auto pb-2 sm:pb-0\">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          disabled={tab === "For You" && userGenresEmpty}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:cursor-not-allowed whitespace-nowrap ${
            activeTab === tab
              ? "bg-purple-600 text-white"
              : tab === "For You" && userGenresEmpty
                ? "text-white/20"
                : "text-white/50 hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
