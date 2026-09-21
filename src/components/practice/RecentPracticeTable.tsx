type RecentItem = {
  tag: string;
  tagBg: string;
  tagColor: string;
  name: string;
  duration: string;
  score: string;
  scoreBg: string;
  scoreColor: string;
  date: string;
};

const recentPractices: RecentItem[] = [
  {
    tag: "Cloud",
    tagBg: "bg-[#eff6ff]",
    tagColor: "text-[#2563eb]",
    name: "Multi-Region VPC & High Availability",
    duration: "12 min",
    score: "76%",
    scoreBg: "bg-[#edf5ec]",
    scoreColor: "text-[#10b981]",
    date: "Today",
  },
  {
    tag: "System Design",
    tagBg: "bg-[#eff6ff]",
    tagColor: "text-[#3b82f6]",
    name: "CAP Theorem Fundamentals",
    duration: "10 min",
    score: "72%",
    scoreBg: "bg-[#f5f3ff]",
    scoreColor: "text-[#8b5cf6]",
    date: "Today",
  },
  {
    tag: "Behavioral",
    tagBg: "bg-[#f5f3ff]",
    tagColor: "text-[#8b5cf6]",
    name: "Tell me about a challenging project",
    duration: "8 min",
    score: "85%",
    scoreBg: "bg-[#edf5ec]",
    scoreColor: "text-[#10b981]",
    date: "Yesterday",
  },
  {
    tag: "Data Structures",
    tagBg: "bg-[#fff0ec]",
    tagColor: "text-[#ff6c47]",
    name: "Two Sum Variations",
    duration: "15 min",
    score: "90%",
    scoreBg: "bg-[#edf5ec]",
    scoreColor: "text-[#10b981]",
    date: "2 days ago",
  },
  {
    tag: "System Design",
    tagBg: "bg-[#eff6ff]",
    tagColor: "text-[#3b82f6]",
    name: "Design a Rate Limiter",
    duration: "12 min",
    score: "58%",
    scoreBg: "bg-[#f5f3ff]",
    scoreColor: "text-[#8b5cf6]",
    date: "3 days ago",
  },
];

export function RecentPracticeTable() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
        Recent Practice
      </h2>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-[#fbf9f4]">
                <th className="px-5 py-3 text-xs font-bold text-ink-muted">
                  PRACTICE NAME &amp; AREA
                </th>
                <th className="px-5 py-3 text-xs font-bold text-ink-muted">
                  DURATION
                </th>
                <th className="px-5 py-3 text-xs font-bold text-ink-muted">
                  SCORE
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold text-ink-muted">
                  DATE
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPractices.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-line last:border-b-0 hover:bg-[#faf8f5]/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${row.tagBg} ${row.tagColor}`}
                      >
                        {row.tag}
                      </span>
                      <span className="truncate text-sm font-semibold text-ink">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-ink-muted">
                    {row.duration}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${row.scoreBg} ${row.scoreColor}`}
                    >
                      {row.score}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-[#b0a898]">
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
