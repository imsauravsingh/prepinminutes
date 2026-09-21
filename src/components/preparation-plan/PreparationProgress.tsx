import { BookOpen, Clock, Calendar, Zap } from "lucide-react";

export function PreparationProgress() {
  const metrics = [
    {
      icon: BookOpen,
      iconBg: "bg-[#ecfdf5]",
      iconColor: "text-[#10b981]",
      value: "3 / 24",
      label: "Topics completed",
    },
    {
      icon: Clock,
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
      value: "21",
      label: "Topics remaining",
    },
    {
      icon: Calendar,
      iconBg: "bg-[#f5f3ff]",
      iconColor: "text-[#8b5cf6]",
      value: "12 days",
      label: "Until your interview",
    },
    {
      icon: Zap,
      iconBg: "bg-[#fffbeb]",
      iconColor: "text-[#f59e0b]",
      value: "28 hrs",
      label: "Estimated preparation time",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-[0_2px_8px_rgba(30,28,26,0.03)]"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
            >
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-extrabold text-ink leading-tight">
                {item.value}
              </span>
              <span className="text-xs text-ink-muted">{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
