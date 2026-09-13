type AreaCard = {
  title: string;
  remaining: string;
  readiness: number;
  barColor: string;
  isHighlighted?: boolean;
};

const areas: AreaCard[] = [
  {
    title: "System Design",
    remaining: "8 topics remaining",
    readiness: 32,
    barColor: "bg-[#ef4444]", // red
    isHighlighted: true,
  },
  {
    title: "Behavioral",
    remaining: "4 topics remaining",
    readiness: 55,
    barColor: "bg-[#f59e0b]", // amber
  },
  {
    title: "Coding Patterns",
    remaining: "2 topics remaining",
    readiness: 78,
    barColor: "bg-[#10b981]", // green
  },
];

export function ReadinessByArea() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
        Readiness by Area
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {areas.map((area) => (
          <div
            key={area.title}
            className={`flex flex-col justify-between gap-4 rounded-2xl p-5 ${
              area.isHighlighted
                ? "border border-brand bg-[#fff0ec]"
                : "border border-line bg-white"
            }`}
          >
            <p className="font-display text-base font-extrabold text-ink">
              {area.title}
            </p>

            <div className="flex flex-col gap-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#fbf9f4]">
                <div
                  className={`h-full rounded-full ${area.barColor}`}
                  style={{ width: `${area.readiness}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">{area.remaining}</span>
                <span className="font-bold text-ink">
                  {area.readiness}% Ready
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
