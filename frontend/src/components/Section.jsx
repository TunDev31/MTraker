import { cn } from "@/lib/utils";

const SectionComponent = ({ icon: Icon, title, subtitle, children, className }) => (
  <div className={cn("flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm", className)}>
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f4ff]">
        <Icon size={18} className="text-[#2563eb]" />
      </div>
      <div>
        <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);
export default SectionComponent;