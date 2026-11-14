/**
 * PrepInMinutes — Frontend Curriculum & Knowledge Graph Types
 * Mirrors backend edge contracts defined in src/server/graph/types.ts
 */

export type PriorityLevel = "P0" | "P1";
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type TrendDirection = "SURGING" | "HOT" | "STABLE" | "COOLING";

export interface DomainCatalogItem {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  version: string;
  sortOrder: number;
  categoriesCount: number;
  topicsCount: number;
  questionsCount: number;
  icon: string;
  colorTheme: string;
}

export interface CurriculumTopicSummary {
  slug: string;
  topicId: string;
  title: string;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  durationMin: number;
  frequency: number;
  trend: TrendDirection;
  rubricAtomsCount: number;
  questionsCount: number;
  practiceHref: string;
  // Candidate-specific dynamic overlay
  readiness?: number;
  status?: "Needs Practice" | "Not Practiced" | "Practiced" | "In Progress";
  isStarred?: boolean;
}

export interface CurriculumCategoryHierarchy {
  slug: string;
  name: string;
  pillar: string;
  sortOrder: number;
  topicsCount: number;
  topics: CurriculumTopicSummary[];
}

export interface CurriculumHierarchyResponse {
  domainSlug: string;
  domainName: string;
  description: string;
  version: string;
  totalCategories: number;
  totalTopics: number;
  totalQuestions: number;
  categories: CurriculumCategoryHierarchy[];
}

export interface CurriculumDomainsResponse {
  success: boolean;
  domains: DomainCatalogItem[];
  meta: {
    curriculumVersion: string;
    totalDomains: number;
    totalCategories: number;
    totalTopics: number;
    totalQuestions: number;
    dataSource: string;
  };
}

export interface TopicGraphReference {
  slug: string;
  title?: string;
  topicId?: string;
  name?: string;
}

export interface BaseTopicNode {
  slug: string;
  topicId: string;
  title: string;
  pillar?: string;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  durationMin: number;
  frequency: number;
  weight: number;
  trend: TrendDirection;
  description: string;
  rubricAtoms: string[];
  updatedAt?: string;
}

export interface BaseQuestionNode {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  learningLevel: string;
  archetype: string;
  prompt: string;
  scaleAnchor?: string;
  rubricGuide: string;
  rubricAtoms: string[];
  hints: string[];
  followUpProbes: string[];
  expectedKeywords: string[];
  antiPatterns?: string[];
  updatedAt?: string;
}

export interface TopicDetailResponse {
  success?: boolean;
  domain: {
    slug: string;
    name: string;
  };
  category: {
    slug: string;
    name: string;
    pillar?: string;
  };
  topic: BaseTopicNode;
  graphRelationships: {
    prerequisites: TopicGraphReference[];
    dependents: TopicGraphReference[];
    usedComponents: TopicGraphReference[];
    foundedOn: TopicGraphReference[];
    algorithmPatterns?: TopicGraphReference[];
  };
  questions: BaseQuestionNode[];
}

export interface TopicQuestionsResponse {
  success?: boolean;
  topicSlug: string;
  topicTitle: string;
  domainSlug: string;
  totalQuestions: number;
  questions: BaseQuestionNode[];
}
