import { Skeleton } from "@/components/ui/skeleton";

const CARD_STYLE = {
  background:
    "radial-gradient(circle at 15% 10%, #143823 0%, #0a1a11 100%)",
  minHeight: "180px",
};

const DesktopWalletCardSkeleton = () => (
  <aside className="hidden md:flex flex-col gap-5 animate-pulse">
    {/* Header */}
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-3 w-28" />
    </div>

    {/* Credit card */}
    <div className="relative rounded-2xl p-5 overflow-hidden shadow-lg" style={CARD_STYLE}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28 bg-white/10" />
        <Skeleton className="h-5 w-5 rounded bg-white/10" />
      </div>
      <Skeleton className="mt-5 h-4 w-40 bg-white/10" />
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-7 w-36 bg-white/10" />
      </div>
      <Skeleton className="mt-4 h-3 w-32 bg-white/10" />
    </div>

    {/* Buttons */}
    <div className="flex gap-3">
      <Skeleton className="h-11 flex-1 rounded-xl" />
      <Skeleton className="h-11 flex-1 rounded-xl" />
    </div>

    {/* Wallet list */}
    <div className="flex flex-col gap-1">
      <Skeleton className="h-3 w-40 mb-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  </aside>
);

export default DesktopWalletCardSkeleton;
