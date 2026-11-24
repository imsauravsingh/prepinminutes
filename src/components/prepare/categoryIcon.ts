import {
  Boxes,
  Brain,
  Cloud,
  Code2,
  Database,
  Gauge,
  GitBranch,
  MessageSquare,
  Network,
  Server,
  ShieldCheck,
  Users,
  Zap,
  Layers,
  type LucideIcon,
} from "lucide-react";

/** Category name → icon (keyword match), so every group gets a fitting icon. */
const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/cach|memory|redis/i, Zap],
  [/database|storage|sql|data/i, Database],
  [/scal|perform|latency/i, Gauge],
  [/network|traffic|gateway|protocol|api/i, Network],
  [/messag|event|stream|queue|kafka|communication/i, MessageSquare],
  [/secur|auth/i, ShieldCheck],
  [/cloud|devops|infra|kubernetes|container/i, Cloud],
  [/distributed|coordination|consensus/i, GitBranch],
  [/graph|tree|array|string|linked|stack|heap|trie|search|dynamic|recursion/i, Code2],
  [/leader|team|behavio|collaborat|mentor|ownership|customer|story/i, Users],
  [/\bai\b|llm|model|vector|generative/i, Brain],
  [/server|runtime|node|java|python|golang|php|backend/i, Server],
  [/pattern|design|architecture|oop|clean/i, Boxes],
];
export function categoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS.find(([re]) => re.test(name))?.[1] ?? Layers;
}
