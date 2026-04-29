export default function SkeletonCard({ isLargeRow = false }: { isLargeRow?: boolean }) {
  return (
    <div className={`relative w-full ${isLargeRow ? 'aspect-2/3' : 'aspect-video'} rounded-lg overflow-hidden bg-fp-elevated animate-pulse`}>
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}
