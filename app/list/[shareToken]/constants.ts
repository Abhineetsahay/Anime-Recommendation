export const STATUS_OPTIONS = [
  "WATCHING",
  "COMPLETED",
  "ON_HOLD",
  "DROPPED",
  "PLAN_TO_WATCH",
] as const;

export const STATUS_STYLES: Record<string, string> = {
  WATCHING: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-green-500/15 text-green-400 border-green-500/20",
  ON_HOLD: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  DROPPED: "bg-red-500/15 text-red-400 border-red-500/20",
  PLAN_TO_WATCH: "bg-white/10 text-white/50 border-white/10",
};

export const STATUS_LABEL: Record<string, string> = {
  WATCHING: "Watching",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  DROPPED: "Dropped",
  PLAN_TO_WATCH: "Plan to Watch",
};
