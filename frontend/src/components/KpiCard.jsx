import { cn } from "@/lib/utils";

function KpiCard({ className, children }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 ",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default KpiCard;