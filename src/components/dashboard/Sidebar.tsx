"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { AccountMenu, PREP_NAV } from "@/components/dashboard/room/StudyRoom";
import styles from "@/components/dashboard/room/StudyRoom.module.css";

/**
 * App menu for every page except the dashboard and the home page.
 *
 * Same glass look and menu items as the dashboard dock, laid out differently:
 * - top row (no bar, scrolls with the page): brand on the left, signed-in user on the right;
 * - left rail (desktop): the learning menus, stacked vertically;
 * - phones: the same bottom tab bar as the dashboard.
 *
 * Pages render it as the first child of their row (`<Sidebar /><main>…`).
 * globals.css offsets the sibling content for the top bar and the phone tab bar.
 */
export function Sidebar() {
  const pathname = usePathname() ?? "";

  return (
    <>
      <header className={`${styles.dockWrap} ${styles.dockWrapFixed}`}>
        {/* No bar behind it: just the logo and the account menu, like the home page at the top. */}
        <div className={`${styles.dock} ${styles.dockBare}`}>
          <Link href="/" className={styles.brand} aria-label="PrepInMinutes home">
            <BrandMark className="size-8" />
            <span className={styles.brandName}>PrepInMinutes</span>
          </Link>
          <AccountMenu phase="prepare" showDashboardLink />
        </div>
      </header>

      <aside className={styles.rail} data-app-rail="">
        <nav aria-label="Study menu" className={styles.railNav}>
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
      </aside>

      <nav aria-label="Study menu" className={styles.tabbar}>
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
