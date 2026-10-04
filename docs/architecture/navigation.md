# Application Navigation & Sidebar Architecture

This document specifies the routing, navigation shell, sidebar active-state detection, and off-canvas mobile drawer architecture implemented in `src/components/dashboard/Sidebar.tsx`.

---

## 1. Top-Level Route Map

| Label                   | Target Route        | Route Match Pattern                                                                                                                                      |
| ----------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**           | `/dashboard`        | `pathname === "/" \|\| pathname === "/dashboard" \|\| pathname.startsWith("/dashboard/")`                                                                |
| **My Preparation Plan** | `/preparation-plan` | `pathname === "/preparation-plan" \|\| pathname.startsWith("/preparation-plan/")`                                                                        |
| **Practice**            | `/practice`         | `!isEvaluationRoute && !isMockInterviewRoute && (pathname === "/practice" \|\| pathname.startsWith("/practice/") \|\| pathname.startsWith("/session/"))` |
| **Mock Interview**      | `/mock-interview`   | `pathname === "/mock-interview" \|\| pathname.startsWith("/mock-interview/")`                                                                            |
| **Evaluation**          | `/evaluation`       | `!isMockInterviewRoute && (pathname === "/evaluation" \|\| pathname.startsWith("/evaluation/") \|\| pathname.includes("/evaluation"))`                   |
| **Revision**            | `/revision`         | `pathname === "/revision" \|\| pathname.startsWith("/revision/")`                                                                                        |

---

## 2. Route Isolation Invariants (Crucial for AI Agents)

To prevent simultaneous highlighting of multiple sidebar menu items:

```tsx
// src/components/dashboard/Sidebar.tsx
const isDashboardRoute =
  pathname === "/" ||
  pathname === "/dashboard" ||
  pathname.startsWith("/dashboard/");

const isPlanRoute =
  pathname === "/preparation-plan" || pathname.startsWith("/preparation-plan/");

const isMockInterviewRoute =
  pathname === "/mock-interview" || pathname.startsWith("/mock-interview/");

// IMPORTANT: Must exclude mock interview routes so sub-evaluations do not highlight Evaluation
const isEvaluationRoute =
  !isMockInterviewRoute &&
  (pathname === "/evaluation" ||
    pathname.startsWith("/evaluation/") ||
    pathname.includes("/evaluation"));

const isRevisionRoute =
  pathname === "/revision" || pathname.startsWith("/revision/");

// IMPORTANT: Must exclude evaluation and mock interview routes
const isPracticeRoute =
  !isEvaluationRoute &&
  !isMockInterviewRoute &&
  (pathname === "/practice" ||
    pathname.startsWith("/practice/") ||
    pathname.startsWith("/session/"));
```

> **Invariant**: When adding any new sub-route (e.g., `/mock-interview/system-design/evaluation`), verify that only one menu item in `navLinks` evaluates `active === true`.

---

## 3. Sidebar Bottom Widget Rules

The bottom section of the sidebar dynamically renders contextual support widgets depending on the active route:

```tsx
// src/components/dashboard/Sidebar.tsx
const isAnyEvaluationRoute =
  pathname === "/evaluation" ||
  pathname.startsWith("/evaluation/") ||
  pathname.includes("/evaluation");

{
  isDashboardRoute ? (
    // 1. Dashboard: "Your Prep Plan" onboarding checklist progress widget
    <YourPrepPlanWidget completed={completedRequired} total={4} />
  ) : isRevisionRoute ||
    isMockInterviewRoute ||
    isAnyEvaluationRoute ? // 2. Revision, Mock Interview & All Evaluation Routes:
  // Clean empty spacing — "Stay consistent!" card is explicitly removed
  null : (
    // 3. Default / Preparation Plan / Practice: "Stay consistent!" motivational widget
    <StayConsistentWidget />
  );
}
```

---

## 4. Mobile Drawer Behavior

On viewports `< 1024px` (`lg` breakpoint):

- The desktop sidebar is hidden (`hidden lg:flex`).
- A top navigation bar is rendered (`lg:hidden`) containing the brand logo and a hamburger menu button (`<Menu />`).
- Clicking the hamburger button triggers `setMobileOpen(true)`.
- When open:
  - An absolute backdrop (`bg-black/40`) is displayed with `onClick={() => setMobileOpen(false)}`.
  - Body scroll is locked via `document.body.style.overflow = "hidden"`.
  - An off-canvas drawer slides out from the left (`w-[85%] max-w-[300px] bg-white p-6 overflow-y-auto`).
  - Clicking any navigation link or the close button (`<X />`) restores normal scroll and closes the drawer.
