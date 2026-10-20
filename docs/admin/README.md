# PrepInMinutes — Admin Documentation Index

Welcome to the **PrepInMinutes Admin & Platform Operations** documentation directory.

## Core Documents

1. [**TASK_STATUS.md**](./TASK_STATUS.md)  
   _Living execution tracker and milestone status board updated in real-time as tasks complete._
2. [**TASKS.md**](./TASKS.md)  
   _Step-by-step sequential implementation roadmap and task checklist across 6 phases._
3. [**ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md**](./ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md)  
   _Comprehensive architecture blueprint and specification for:_
   - **PostgreSQL RBAC & Admin Authentication:** Dual login (Google SSO & Password), Roles (`SUPER_ADMIN` / HOD, `CURRICULUM_MANAGER`, `STAFF_ENGINEER`, `CANDIDATE`), initial seed credentials (`imsauravsingh@gmail.com`), exclusive HOD user-approval gate, session issuance, and candidate isolation.
   - **Neo4j Knowledge Graph Operations:** Category, Topic, and Question CRUD across DSA, System Design, Behavioral, and Core Languages.
   - **Staging & Approval Gate:** Moving items through `DRAFT` $\rightarrow$ `IN_REVIEW` $\rightarrow$ `PUBLISHED` (`isLive = true`), ensuring candidate mock sessions only query approved content.
   - **Monetization & Usage Quotas:** Subscription tiers, dynamic voice minute limits, discount coupons, and customer support overrides.
   - **Information Architecture:** Frontend admin routes and backend `/api/admin/*` REST API endpoints.

---

## Directory Navigation

- **Knowledge Graph & Curriculum:** [ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md §3](./ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md#3-neo4j-knowledge-graph-operations--taxonomy)
- **Staging & Approval Workflow:** [ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md §4](./ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md#4-staging--approval-lifecycle-draft--live)
- **Subscriptions & Payments:** [ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md §5](./ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md#5-subscription-pricing--usage-quota-management)
- **API & Route Reference:** [ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md §6](./ADMIN_PANEL_AND_KNOWLEDGE_GRAPH_SPEC.md#6-information-architecture-admin-ui-pages--api-routes)
