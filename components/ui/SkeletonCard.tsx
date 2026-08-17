export default function SkeletonCard({ isLargeRow = false }: { isLargeRow?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full aspect-2/3 rounded-xl overflow-hidden bg-fp-elevated border border-white/8 ${isLargeRow ? 'shadow-[0_12px_30px_rgba(0,0,0,0.2)]' : ''}`}
    >
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="absolute inset-x-3 bottom-3 h-2 rounded-full bg-white/8" />
    </div>
  );
}
