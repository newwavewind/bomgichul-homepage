export default function CommunityLoading() {
  return (
    <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-surface" />
      <div className="mb-4 h-12 w-full max-w-md animate-pulse rounded-[var(--radius-buttons)] bg-surface" />
      <div className="space-y-0 overflow-hidden rounded-[var(--radius-images)] bg-paper shadow-[var(--shadow-elevated)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-mist/60 px-6 py-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
