"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { AccountMenu, PREP_NAV } from "@/components/dashboard/room/StudyRoom";
import styles from "@/components/dashboard/room/StudyRoom.module.css";
import { AreaNav } from "@/components/prepare/AreaNav";
import { AreaNavMobile } from "@/components/prepare/AreaNavMobile";
import { useAreaDetail } from "@/hooks/useAreaDetail";
import { HIERARCHY_CACHE_PREFIX } from "@/hooks/useCurriculum";
import { backendApi } from "@/lib/api-client";

/**
 * App chrome for every page except the dashboard and the home page — the same
 * design as the area pages:
 * - top bar (scrolls with the page): logo, the main menu, signed-in user;
 * - while learning a topic (practice session pages): the area's own navigation
 *   on the left (Overview + categories + topics). The area comes from ?domain=,
 *   or is looked up from ?topic= when the link doesn't say;
 *   On smaller screens that navigation opens from a menu button before the logo;
 * - phones: the bottom tab bar.
 *
 * Pages render it as the first child of their row (`<Sidebar /><main>…`).
 * globals.css offsets the sibling content for the top bar and the phone tab bar.
 */
export function Sidebar() {
  return (
    <Suspense fallback={<Chrome />}>
      <ChromeForPage />
    </Suspense>
  );
}

/** Top bar, optional left column and phone tab bar. */
function Chrome({ menu, rail }: { menu?: ReactNode; rail?: ReactNode }) {
  const pathname = usePathname() ?? "";

  return (
    <>
      <header className={`${styles.dockWrap} ${styles.dockWrapFixed}`}>
        <div className={styles.dock}>
          <div className="flex min-w-0 items-center gap-2">
            {menu}
            <Link href="/" className={styles.brand} aria-label="PrepInMinutes home">
              <BrandMark className="size-8" />
              <span className={styles.brandName}>PrepInMinutes</span>
            </Link>
          </div>
          <nav aria-label="Main menu" className={styles.nav}>
            {PREP_NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${styles.navItem} ${active ? styles.navActive : ""}`}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <AccountMenu phase="prepare" showDashboardLink />
        </div>
      </header>

      {/* Left column: only while learning a topic. Empty (zero width) everywhere else. */}
      <aside data-app-rail="" className="sticky top-4 shrink-0 self-start">
        {rail}
      </aside>

      <nav aria-label="Main menu" className={styles.tabbar}>
        {PREP_NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span>{item.short}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

/** Practice workspace path → area, used only when neither the link nor the topic tells us. */
const WORKSPACE_AREA: Record<string, string> = {
  "system-design": "system-design",
  cloud: "cloud-devops",
  behavioral: "behavioral-leadership",
  behavioural: "behavioral-leadership",
  coding: "dsa",
};

/** Area whose cached curriculum contains this topic (instant, no request). */
function areaFromCache(topic: string): string | null {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(HIERARCHY_CACHE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (raw && raw.includes(`"slug":"${topic}"`)) return key.slice(HIERARCHY_CACHE_PREFIX.length);
    }
  } catch {}
  return null;
}

/** Chrome for the current page; on a practice session page, with the topic's area navigation. */
function ChromeForPage() {
  const pathname = usePathname() ?? "";
  const params = useSearchParams();
  const onSession = pathname.startsWith("/practice/session");
  const fromLink = onSession ? (params.get("domain") ?? "").trim().toLowerCase() : "";
  const topic = onSession ? (params.get("topic") ?? "").trim().toLowerCase() : "";
  const workspace = pathname.split("/")[3] ?? "";

  // Link without ?domain=: find the topic's area (cached curriculum, then the topic API,
  // then the workspace type as a last resort).
  const [lookedUp, setLookedUp] = useState<{ key: string; area: string } | null>(null);
  const lookupKey = `${workspace}|${topic}`;
  useEffect(() => {
    if (!onSession || fromLink || (!topic && !WORKSPACE_AREA[workspace])) return;
    let alive = true;
    const fallback = WORKSPACE_AREA[workspace] ?? "";
    Promise.resolve(topic ? areaFromCache(topic) : null)
      .then(async (cached) => {
        if (cached) return cached;
        if (!topic) return fallback;
        try {
          const res = await backendApi.getCurriculumTopicDetail(topic);
          return res?.domain?.slug || fallback;
        } catch {
          return fallback;
        }
      })
      .then((area) => alive && area && setLookedUp({ key: lookupKey, area }));
    return () => {
      alive = false;
    };
  }, [onSession, fromLink, topic, workspace, lookupKey]);

  const domain = fromLink || (lookedUp?.key === lookupKey ? lookedUp.area : "");
  if (!domain) return <Chrome />;
  return <TopicChrome domain={domain} topic={topic} />;
}

function TopicChrome({ domain, topic }: { domain: string; topic: string }) {
  const router = useRouter();
  const { detail } = useAreaDetail(domain);
  if (!detail) return <Chrome />;
  const nav = {
    detail,
    currentTopic: topic,
    overviewHref: `/prepare/${domain}`,
    onPickCategory: (cat: string) => router.push(`/prepare/${domain}#cat-${cat}`),
  };
  return (
    <Chrome
      // Below 1280px the left column is hidden, so the menu button opens it instead.
      menu={<AreaNavMobile {...nav} compact className="xl:hidden" />}
      rail={
        <div className="ml-5 mt-[92px] hidden w-[260px] xl:block">
          <AreaNav {...nav} />
        </div>
      }
    />
  );
}
