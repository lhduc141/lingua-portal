import { cn } from "@/lib";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
}

export function StatCard({ icon, iconBg, label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-black/10 bg-white p-2.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div
        className={cn(
          "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full",
          iconBg
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] text-[#738192]">{label}</p>
        <div className="mt-0.5 text-[20px] font-bold leading-tight text-gray-900">{value}</div>
      </div>
    </div>
  );
}
