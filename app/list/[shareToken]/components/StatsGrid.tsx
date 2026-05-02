import type { ListStats } from "../types";

type Props = {
  stats: ListStats;
};

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {[
        { label: "Total", value: stats.total },
        { label: "Completed", value: stats.completed },
        { label: "Watching", value: stats.watching },
        { label: "Avg Score", value: stats.avgScore },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-white/4 border border-white/8 rounded-xl p-4 text-center"
        >
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="text-xs text-white/30 mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
