/**
 * Coding languages and role-relevant technologies for setup, and how the chosen
 * technologies focus the plan.
 *
 * Each technology may map to curriculum categories (by name). Technologies in an
 * "exclusive" group compete for the same slot (a backend candidate uses one or two
 * stacks, not all five), so once a candidate picks any of them, the group's other
 * categories drop out of Must do. Technologies without a category yet are still
 * saved, so we learn what to add next.
 */

export const CODING_LANGUAGES = ["Java", "Python", "NodeJs", "TypeScript", "Go", "C++"];

export type TechGroup = {
  key: string;
  title: string;
  /** Picking any tech here de-prioritises the group's other categories. */
  exclusive: boolean;
  techs: { name: string; categories?: RegExp }[];
};

export const TECH_GROUPS: Record<string, TechGroup> = {
  frontend: {
    key: "frontend",
    title: "Frontend",
    exclusive: true,
    techs: [
      { name: "React", categories: /^React\.js/i },
      { name: "Next.js", categories: /^Next\.js/i },
      { name: "Angular", categories: /Angular/i },
      { name: "Vue / Nuxt", categories: /Vue/i },
    ],
  },
  backend: {
    key: "backend",
    title: "Backend",
    exclusive: true,
    techs: [
      { name: "Spring Boot", categories: /Java & JVM/i },
      { name: "Node.js", categories: /Node\.js/i },
      { name: "Django / FastAPI", categories: /Python Ecosystem/i },
      { name: "Go", categories: /Go \(Golang\)/i },
      { name: "Laravel (PHP)", categories: /PHP/i },
      { name: ".NET" },
    ],
  },
  mobile: {
    key: "mobile",
    title: "Mobile",
    exclusive: true,
    techs: [
      { name: "Android (Kotlin)", categories: /^Android/i },
      { name: "iOS (Swift)", categories: /^iOS/i },
      { name: "Flutter", categories: /Flutter/i },
      { name: "React Native", categories: /React Native/i },
    ],
  },
  data: {
    key: "data",
    title: "Data",
    exclusive: false,
    techs: [
      { name: "Spark" },
      { name: "Kafka" },
      { name: "Flink" },
      { name: "Airflow / dbt" },
      { name: "Snowflake / BigQuery" },
      { name: "Power BI / Tableau" },
    ],
  },
  devops: {
    key: "devops",
    title: "Cloud & DevOps",
    exclusive: false,
    techs: [
      { name: "AWS" },
      { name: "GCP" },
      { name: "Azure" },
      { name: "Kubernetes" },
      { name: "Docker" },
      { name: "Terraform" },
    ],
  },
  aiml: {
    key: "aiml",
    title: "AI / ML",
    exclusive: false,
    techs: [{ name: "PyTorch" }, { name: "TensorFlow" }, { name: "LangChain" }, { name: "Hugging Face" }, { name: "scikit-learn" }],
  },
  qa: {
    key: "qa",
    title: "Testing",
    exclusive: false,
    techs: [{ name: "Selenium" }, { name: "Cypress" }, { name: "Playwright" }, { name: "Postman / API testing" }],
  },
};

/** Which technology groups to show for a role (matched on the role name). */
export function techGroupsForRole(role: string): TechGroup[] {
  const r = role.toLowerCase();
  // Backend stacks aren't asked; Frontend only for Frontend / Fullstack roles.
  const keys: string[] = [];
  if (/fullstack|full stack|frontend|front end|\bui\b/.test(r)) keys.push("frontend");
  else if (/mobile|ios|android/.test(r)) keys.push("mobile");
  else if (/data engineer|business intelligence|data analyst|analytics/.test(r)) keys.push("data");
  else if (/devops|sre|cloud|platform|infrastructure/.test(r)) keys.push("devops");
  else if (/machine learning|\bml\b|\bai\b|data scientist/.test(r)) keys.push("aiml");
  else if (/qa|test|automation/.test(r)) keys.push("qa");
  // SDE, Backend, architect and other roles: no technology question.
  return keys.map((k) => TECH_GROUPS[k]);
}

/** Sensible default coding language for a role (the candidate can change it). */
export function defaultCodingLanguage(role: string, technologies: string[] = []): string {
  const r = role.toLowerCase();
  const t = technologies.join(" ").toLowerCase();
  if (/spring|java/.test(t)) return "Java";
  if (/node|react|next|angular|vue/.test(t) || /frontend|fullstack/.test(r)) return /typescript|angular|next/.test(t) ? "TypeScript" : "NodeJs";
  if (/\bgo\b/.test(t)) return "Go";
  if (/data|machine learning|\bml\b|\bai\b|scientist|analyst/.test(r)) return "Python";
  return "Java";
}

/** Curriculum categories for the technologies the candidate picked (ranked first at equal priority). */
export function chosenStackCategory(technologies: string[]): (categoryName: string) => boolean {
  const chosen = new Set(technologies.map((t) => t.toLowerCase()));
  const keep = Object.values(TECH_GROUPS)
    .flatMap((g) => g.techs)
    .filter((t) => t.categories && chosen.has(t.name.toLowerCase()))
    .map((t) => t.categories!);
  return (name: string) => keep.some((re) => re.test(name));
}

/**
 * Curriculum categories to push out of Must do, given the technologies a candidate chose:
 * in each exclusive group where they picked something, every category of a tech they didn't pick.
 */
export function deprioritisedCategory(technologies: string[]): (categoryName: string) => boolean {
  const chosen = new Set(technologies.map((t) => t.toLowerCase()));
  const drop: RegExp[] = [];
  for (const g of Object.values(TECH_GROUPS)) {
    if (!g.exclusive) continue;
    const picked = g.techs.filter((t) => chosen.has(t.name.toLowerCase()));
    if (!picked.length) continue;
    // A pick with categories keeps them; picks without any (e.g. .NET) keep nothing extra.
    const keep = picked.map((t) => t.categories).filter((x): x is RegExp => Boolean(x));
    for (const t of g.techs) {
      if (t.categories && !keep.some((k) => k.source === t.categories!.source)) drop.push(t.categories);
    }
  }
  return (name: string) => drop.some((re) => re.test(name));
}
