// components/PageHeader.tsx
type Props = {
  userGenres: string[];
};

export default function PageHeader({ userGenres }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Discover Anime</h1>
      {userGenres.length > 0 && (
        <p className="text-white/40 text-sm mt-1">
          Personalised for your taste — {userGenres.slice(0, 3).join(", ")}
          {userGenres.length > 3 ? ` +${userGenres.length - 3} more` : ""}
        </p>
      )}
    </div>
  );
}