// components/EmptyForYou.tsx
import Link from "next/link";

export default function EmptyForYou() {
  return (
    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl mb-6">
      <p className="text-white/40 text-sm">
        You haven&apos;t picked any genres yet.
      </p>
      <Link
        href="/onboarding"
        className="text-purple-400 text-sm hover:underline mt-2 inline-block"
      >
        Pick your genres →
      </Link>
    </div>
  );
}
