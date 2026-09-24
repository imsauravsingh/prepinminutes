"use client";

import { Database, Cloud, CodeXml, Users, ArrowUpRight } from "lucide-react";

export function WeeklyProgressTable() {
  const tableData = [
    {
      id: "system-design",
      name: "System Design",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      w1: "32%",
      w2: "36%",
      w3: "38%",
      w4: "42%",
      thisWeek: "42%",
      change: "+10%",
    },
    {
      id: "aws-cloud",
      name: "AWS & Cloud",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      w1: "58%",
      w2: "64%",
      w3: "67%",
      w4: "68%",
      thisWeek: "71%",
      change: "+13%",
    },
    {
      id: "coding-patterns",
      name: "Coding Patterns",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      w1: "71%",
      w2: "74%",
      w3: "76%",
      w4: "78%",
      thisWeek: "78%",
      change: "+7%",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      w1: "86%",
      w2: "88%",
      w3: "89%",
      w4: "90%",
      thisWeek: "91%",
      change: "+5%",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
      {/* Title & Subtitle */}
      <div className="flex flex-col gap-0.5 pb-3">
        <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
          Weekly Progress by Area
        </h2>
        <p className="text-xs text-ink-muted">
          See how each area has improved week by week.
        </p>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-muted">
              <th className="pb-3 pt-1 font-semibold">Area</th>
              <th className="pb-3 pt-1 text-center font-semibold">
                <div>Week 1</div>
                <div className="text-[10px] font-normal text-ink-muted">
                  Aug 25 – Aug 31
                </div>
              </th>
              <th className="pb-3 pt-1 text-center font-semibold">
                <div>Week 2</div>
                <div className="text-[10px] font-normal text-ink-muted">
                  Sep 1 – Sep 7
                </div>
              </th>
              <th className="pb-3 pt-1 text-center font-semibold">
                <div>Week 3</div>
                <div className="text-[10px] font-normal text-ink-muted">
                  Sep 8 – Sep 14
                </div>
              </th>
              <th className="pb-3 pt-1 text-center font-semibold">
                <div>Week 4</div>
                <div className="text-[10px] font-normal text-ink-muted">
                  Sep 15 – Sep 21
                </div>
              </th>
              <th className="pb-3 pt-1 text-center font-semibold">
                <div>This Week</div>
                <div className="text-[10px] font-normal text-ink-muted">
                  Sep 22 – Today
                </div>
              </th>
              <th className="pb-3 pt-1 text-right font-semibold">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {tableData.map((row) => {
              const Icon = row.icon;

              return (
                <tr
                  key={row.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  {/* Area Name + Icon */}
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${row.iconBg}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="font-display font-bold text-xs sm:text-sm text-ink whitespace-nowrap">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Week 1 */}
                  <td className="py-3.5 text-center font-mono text-xs text-ink-muted">
                    {row.w1}
                  </td>

                  {/* Week 2 */}
                  <td className="py-3.5 text-center font-mono text-xs text-ink-muted">
                    {row.w2}
                  </td>

                  {/* Week 3 */}
                  <td className="py-3.5 text-center font-mono text-xs text-ink-muted">
                    {row.w3}
                  </td>

                  {/* Week 4 */}
                  <td className="py-3.5 text-center font-mono text-xs text-ink-muted">
                    {row.w4}
                  </td>

                  {/* This Week */}
                  <td className="py-3.5 text-center font-mono font-bold text-xs text-ink">
                    {row.thisWeek}
                  </td>

                  {/* Change */}
                  <td className="py-3.5 text-right font-mono font-bold text-xs text-[#10b981] whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5">
                      <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                      <span>{row.change}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
