// components/AnimeGridSkeleton.tsx
export default function AnimeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-2/3 rounded-xl bg-white/5 mb-2" />
          <div className="h-3 bg-white/5 rounded mb-1" />
          <div className="h-2 bg-white/5 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
