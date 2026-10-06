# Hermes Runner & Execution Guide — PrepInMinutes

This guide details how to operate Hermes Agent to develop, test, and verify features across PrepInMinutes autonomously.

---

## 1. Environment Setup

Ensure your Hermes environment variables are set in `~/.hermes/.env`:

```bash
# Model selection (Zero-cost safe tier)
DEFAULT_MODEL="gemini/gemini-2.0-flash"
GEMINI_API_KEY="AIzaSy..."
GROQ_API_KEY="gsk_..."

# Dashboard Credentials
HERMES_DASHBOARD_BASIC_AUTH_USERNAME=admin
HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=your_secure_password
```

---

## 2. Populating the Kanban Board

Run the auto-populate script to push all 28 tasks into Hermes:

```bash
chmod +x ./hermes/populate-kanban.sh
./hermes/populate-kanban.sh prepinminutes
```

To verify the tasks in CLI:
```bash
hermes kanban list --board prepinminutes
```

---

## 3. Running the Dashboard (24/7 Background Service)

To prevent connection drops (`Lost connection to the Hermes dashboard server`):

```bash
# Using PM2
npm install -g pm2
pm2 start "hermes dashboard --host 0.0.0.0 --port 9119" --name hermes-dashboard
pm2 save

# Or in a tmux session:
tmux new -s hermes
hermes dashboard --host 0.0.0.0 --port 9119
```

---

## 4. Running the Dispatcher

To start autonomous task execution with Hermes workers:

```bash
hermes kanban dispatch --board prepinminutes
```

The dispatcher will:
1. Scan for dispatchable tasks in the `In Progress` or unblocked `Backlog` columns.
2. Spawn worker agents with the assigned profile (`database-architect`, `backend-developer`, `math-engineer`, etc.).
3. Execute coding, run validation commands, and update task status automatically upon clearance.

---

## 5. Real-Time Task Lifecycle & Active Status Protocol

> ⚡ **Mandatory Agent Operating Rule**: Whenever an agent begins work on a task, it **must immediately update the task status to `IN PROGRESS`** (or claim the card in Hermes so it displays as `running` on the Kanban board). The board must always reflect the live execution state so the user can verify real-time progress.

### Task Status Progression:

```text
📋 READY / TODO
       │  (Agent picks up task or starts execution)
       ▼
🔄 IN PROGRESS / RUNNING    <--- MUST update status immediately upon starting
       │  (Implementation finished, automated suites executing)
       ▼
🧪 TESTING & VERIFICATION  <--- Log verification runs / add comments
       │  (All unit tests, integration tests & static checks pass)
       ▼
✅ DONE                    <--- Mark completed; unblocks dependent tasks
```

### CLI Commands for Status Updates:
```bash
# Claim/start work on a task (sets status to 'running' / 'in-progress')
hermes kanban claim <task_id>

# Post a progress comment while working
hermes kanban comment <task_id> "Implementing relational models for candidate profiles..."

# Mark task complete after all quality gates pass
hermes kanban complete <task_id>
```

---

## 6. Git Branching & Cloudflare Trigger Rules for Hermes Agents

> ⚠️ **Zero Cloudflare Deployments on `develop`**: The `develop` branch is strictly an internal integration branch. It has **no Cloudflare Worker trigger dependency**. Only the `main` branch triggers live Cloudflare Worker deployments.

### Agent Workflow:
1. **Develop on `develop`**: Hermes agents execute tasks and commit changes to `origin/develop`.
2. **No Cloudflare Builds**: Pushing to `develop` will **never** trigger a Cloudflare Worker deployment (preview builds disabled in Cloudflare Settings).
3. **Optional Commit Tag**: Agents may optionally append `[skip ci]` to commits on `develop` for additional safety.
4. **Promotion to Production**: Once an entire phase is completed and verified on `develop`, human review promotes the changes to `main` via Pull Request, which triggers the live Cloudflare Worker deployment.

