import Link from "next/link";
import { STATUS_LABEL, STATUS_OPTIONS } from "../constants";
import type { Entry } from "../types";

type Props = {
  canEdit: boolean;
  entries: Entry[];
  filterStatus: string;
  setFilterStatus: (status: string) => void;
};

export default function FilterBar({
  canEdit,
  entries,
  filterStatus,
  setFilterStatus,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <div className="flex gap-1 bg-white/5 p-1 rounded-lg overflow-x-auto">
        {["ALL", ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium transition-all ${
              filterStatus === status
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {status === "ALL" ? "All" : STATUS_LABEL[status]}
            {status !== "ALL" && (
              <span className="ml-1.5 text-white/20">
                {entries.filter((entry) => entry.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>
      {canEdit && (
        <Link
          href="/discover"
          className="w-fit text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add anime
        </Link>
      )}
    </div>
  );
}
