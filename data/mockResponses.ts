/**
 * Mock response data for the chat demo.
 * Used by lib/mockResponses.ts for context-aware response selection.
 */

export type ResponseCategory =
  | "greeting"
  | "help"
  | "acknowledge"
  | "summarize"
  | "code"
  | "explain"
  | "ui"
  | "api"
  | "general";

export const MOCK_RESPONSES: Record<ResponseCategory, string[]> = {
  greeting: [
    `Hi! I'm here to help. You can ask me to explain concepts, generate code, design APIs, summarize content, or brainstorm ideas. What would you like to work on?`,
    `Hey! I can help with coding, explanations, API design, UI components, summaries, and more. What's on your mind?`,
    `Hello! I'm ready to help. Try asking me to explain something, write code, design an API, or summarize text. What do you need?`,
  ],
  acknowledge: [
    `You're welcome! Let me know if you need anything else.`,
    `Glad I could help. Feel free to ask if you have more questions.`,
    `Happy to help! Reach out anytime.`,
  ],
  help: [
    `I can help with a few things:

- **Code** — Generate components, functions, schemas (TypeScript, React, Python, etc.)
- **Explanations** — Break down concepts in plain language
- **APIs** — Design REST/GraphQL schemas, endpoints, request/response shapes
- **UI** — Dashboard layouts, components, responsive design
- **Summaries** — Condense text, extract key points, TL;DRs

Just ask in plain language—e.g. "Explain WebSockets" or "Generate a React dashboard component." What would you like to try?`,
    `Here's what I can do:

| Area | Examples |
|------|----------|
| **Code** | Components, functions, API schemas |
| **Explain** | Concepts, how things work |
| **Design** | APIs, UI layouts, dashboards |
| **Summarize** | Text, key points, insights |

Ask naturally—"Create a task API" or "What is JWT?"—and I'll respond. What would you like to explore?`,
  ],
  summarize: [
    `Here's a concise summary:

**Key points:**
- Main idea distilled into a few bullets
- Supporting details that matter most
- Clear conclusion or next steps

I can go deeper on any section or shorten it further if you'd like.`,
    `**Summary:**

1. **Overview** — The core message in one sentence.
2. **Details** — Important supporting points.
3. **Takeaway** — What it means or what to do next.

Want me to expand on a specific part or make it shorter?`,
    `**TL;DR:** Condensed version of the main ideas, with the most important outcome highlighted.

I can break down any section in more detail or adjust the length.`,
  ],
  code: [
    `Here's what I'd suggest:

\`\`\`typescript
// Structured example based on your request
interface Example {
  id: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

function process(input: string): Example {
  return {
    id: crypto.randomUUID(),
    data: { raw: input },
    createdAt: new Date(),
  };
}
\`\`\`

Adapt this to your setup—I can switch to a different pattern or language if you'd like.`,
    `\`\`\`tsx
// React component sketch
export function ExampleComponent({ title }: { title: string }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">{title}</h2>
      {/* Add your logic here */}
    </div>
  );
}
\`\`\`

That's a solid starting point. I can add state, props, or styling if you need it.`,
    `\`\`\`json
{
  "openapi": "3.0.0",
  "paths": {
    "/resource": {
      "get": {
        "summary": "List resources",
        "responses": { "200": { "description": "Success" } }
      }
    }
  }
}
\`\`\`

Schema-style structure. I can extend it with more endpoints or validation.`,
  ],
  explain: [
    `**In simple terms:**

{subject} breaks down into a few parts:

1. **What it is** — A clear definition or description.
2. **How it works** — The main mechanism or flow.
3. **Why it matters** — Practical impact or use case.

If you share more context, I can tailor this explanation.`,
    `Here's a straightforward breakdown of {subject}:

- **Core concept** — The central idea in plain language.
- **Key components** — The main pieces and how they fit together.
- **Common use cases** — Where and when this is typically used.

Want to go deeper on any of these?`,
    `**Explanation of {subject}:**

Think of it as a mechanism that solves a specific problem. The main benefit is clarity and reusability, and it's often used when you need to avoid repetition or standardize behavior.

I can add examples or relate it to something specific if you'd like.`,
  ],
  ui: [
    `**UI approach:**

For a clean dashboard-style layout:

- **Layout** — Use a grid or flex container with clear sections.
- **Components** — Cards for metrics, a sidebar for navigation, and a main content area.
- **States** — Loading, empty, and error states for each section.

I can sketch a concrete component structure if you share your stack (e.g. React, Tailwind).`,
    `**Design considerations:**

1. **Hierarchy** — Clear headings and spacing.
2. **Feedback** — Loading and success/error states.
3. **Responsiveness** — Mobile-first breakpoints.

A typical structure: header → sidebar + main → footer. Want a code sketch for a specific framework?`,
    `\`\`\`tsx
// Dashboard layout sketch
<div className="grid grid-cols-[240px_1fr] min-h-screen">
  <aside className="border-r p-4">Sidebar</aside>
  <main className="p-6">
    <header className="mb-6">Metrics / Title</header>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Cards go here */}
    </div>
  </main>
</div>
\`\`\`

Adjust breakpoints and content as needed.`,
  ],
  api: [
    `**API design sketch:**

\`\`\`
GET  /resources      → List (paginated)
GET  /resources/:id  → Single resource
POST /resources      → Create
PUT  /resources/:id  → Update
DELETE /resources/:id → Remove
\`\`\`

Use standard status codes (200, 201, 400, 404) and consistent error shapes. I can add request/response examples if you'd like.`,
    `**REST-style structure:**

- **Resources** — Nouns in the URL (e.g. \`/users\`, \`/orders\`).
- **Methods** — GET (read), POST (create), PUT/PATCH (update), DELETE.
- **Responses** — JSON with \`data\`, \`meta\`, \`errors\` where useful.

Want a full OpenAPI or JSON Schema example?`,
    `\`\`\`typescript
// API client pattern
async function fetchResource(id: string) {
  const res = await fetch(\`/api/resources/\${id}\`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
\`\`\`

Add retries, caching, or error handling as needed for your setup.`,
  ],
  general: [
    `I'd approach it like this:

**1. Clarify** — Pin down the goal and constraints.
**2. Break it down** — Smaller steps, ordered by impact.
**3. Iterate** — Build, test, and refine.

I can go deeper on any step or adapt this to your specific case.`,
    `A few options to consider:

- **Option A** — Faster to implement, less flexible.
- **Option B** — More setup, better long-term.
- **Option C** — Balanced tradeoff.

Recommendation: Start with Option C unless you have strict constraints. Want to explore one in more detail?`,
    `**Next steps:**

1. Define the scope and success criteria.
2. List dependencies and assumptions.
3. Plan a minimal version first.
4. Get feedback and iterate.

Share more context and I can tailor this to your situation.`,
    `I can help with that. Here's a starting point:

| Step | Action | Notes |
|------|--------|-------|
| 1 | Define | Clarify requirements |
| 2 | Plan | Break into tasks |
| 3 | Execute | Build incrementally |

Want to focus on a particular step or add more detail?`,
  ],
};

export const PROMPT_SPECIFIC_RESPONSES: Array<{
  pattern: RegExp;
  responses: string[];
}> = [
  {
    pattern: /todo app|todo list|task management|projects.*tasks|tasks.*comments/i,
    responses: [
      `Here's a suggested REST API schema for your task/todo app:

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /projects | List all projects |
| POST | /projects | Create a project |
| GET | /projects/:id | Get project details |
| PATCH | /projects/:id | Update project |
| DELETE | /projects/:id | Delete project |
| GET | /projects/:id/tasks | List tasks in project |
| POST | /tasks | Create a task |
| GET | /tasks/:id | Get task details |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| GET | /tasks/:id/comments | List comments |
| POST | /comments | Add comment |

## Example Task Schema (JSON)

\`\`\`json
{
  "id": "task-uuid",
  "title": "Implement auth flow",
  "description": "Add JWT-based authentication",
  "status": "todo",
  "priority": "high",
  "projectId": "project-uuid",
  "assigneeId": "user-uuid",
  "dueDate": "2025-02-15",
  "createdAt": "2025-02-10T09:00:00Z"
}
\`\`\`

Would you like me to expand any of these endpoints with request/response examples?`,
      `For a simpler todo list API:

\`\`\`
GET    /todos       → List all todos (filter by completed, due date)
GET    /todos/:id   → Get single todo
POST   /todos       → Create todo
PATCH  /todos/:id   → Update todo (partial)
DELETE /todos/:id   → Delete todo
\`\`\`

\`\`\`json
{
  "id": "uuid",
  "title": "Buy groceries",
  "completed": false,
  "dueDate": "2025-02-15",
  "createdAt": "2025-02-10T09:00:00Z"
}
\`\`\`

Want pagination, sorting, or tags added?`,
    ],
  },
  {
    pattern: /websocket|web socket/i,
    responses: [
      `## WebSocket Handshake Explained

The WebSocket handshake is how a normal HTTP connection gets **upgraded** to a persistent, two-way WebSocket connection.

### Step 1: Client Request
The client sends a regular HTTP request with special headers:

\`\`\`
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: base64-random-string
Sec-WebSocket-Version: 13
\`\`\`

### Step 2: Server Response
If the server accepts, it responds with:

\`\`\`
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: derived-from-key
\`\`\`

### Step 3: Connection Upgraded
Once both sides agree, the TCP connection is **upgraded**. From then on, it's **binary frames** instead of HTTP—both sides can send data anytime without request/response.

**TL;DR:** Start with HTTP → client asks to upgrade → server says OK → connection becomes full-duplex WebSocket.`,
    ],
  },
  {
    pattern: /dashboard.*component|stats cards|chart placeholder/i,
    responses: [
      `Here's a clean dashboard component:

\`\`\`tsx
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {trend && (
        <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue" value="$45,231" trend={{ value: 20, isPositive: true }} />
        <StatCard title="Users" value="2,350" trend={{ value: 5, isPositive: true }} />
        <StatCard title="Orders" value="1,234" trend={{ value: 12, isPositive: false }} />
        <StatCard title="Conversion" value="3.2%" />
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 font-semibold">Analytics Overview</h3>
        <div className="h-75 flex items-center justify-center bg-muted/50 rounded">
          Chart placeholder
        </div>
      </div>
    </div>
  );
}
\`\`\`

Uses Tailwind for styling. Add your chart library (Recharts, Chart.js) in the placeholder.`,
    ],
  },
  {
    pattern: /react hooks|useState|useEffect|how.*hooks work/i,
    responses: [
      `**React Hooks Explained**

Hooks let you use state and other React features in function components, without classes.

### Core hooks

- **\`useState\`** — Holds a value and a setter. Re-renders when the value changes.
  \`\`\`ts
  const [count, setCount] = useState(0);
  \`\`\`

- **\`useEffect\`** — Runs side effects (fetch, subscriptions) after render. Use the dependency array to control when it runs.
  \`\`\`ts
  useEffect(() => { fetchData(); }, [id]);
  \`\`\`

- **\`useCallback\`** / **\`useMemo\`** — Memoize functions and values to avoid unnecessary re-renders.

### Rules
1. Only call hooks at the top level (not inside loops/conditions).
2. Only call hooks from React function components or custom hooks.

Want a concrete example for a specific use case?`,
    ],
  },
  {
    pattern: /state management|zustand|redux|recoil|context api/i,
    responses: [
      `**State Management Options**

| Approach | Best for | Pros | Cons |
|----------|----------|------|------|
| **useState + props** | Small apps, local UI state | Simple, no deps | Prop drilling |
| **Context API** | Theme, auth, moderate shared state | Built-in, no libs | Re-renders can be broad |
| **Zustand** | Medium apps, flexible needs | Tiny, minimal boilerplate | Less structure |
| **Redux Toolkit** | Large apps, complex flows | Predictable, devtools | More setup |
| **Jotai / Recoil** | Atomic state, granular updates | Fine-grained updates | Newer, smaller ecosystem |

**Recommendation:** Start with Context or Zustand. Add Redux only if you need time-travel debugging or very strict data flow.

Want a code example for a specific option?`,
    ],
  },
  {
    pattern: /jwt|json web token|authentication token/i,
    responses: [
      `**JWT (JSON Web Token) Explained**

A JWT is a compact, URL-safe way to represent claims between two parties. It's often used for authentication and authorization.

### Structure
A JWT has three parts, separated by dots:
- **Header** — Algorithm and token type (e.g. \`{"alg":"HS256","typ":"JWT"}\`)
- **Payload** — Claims (user id, roles, expiry, etc.)
- **Signature** — Verifies the token hasn't been tampered with

### Flow
1. User logs in → server validates credentials
2. Server creates JWT with user claims, signs it with a secret
3. Client stores the JWT (cookie or localStorage)
4. Client sends JWT in \`Authorization: Bearer <token>\` header
5. Server verifies signature and extracts claims

### Best practices
- Keep JWTs small; don't store sensitive data
- Use short expiry times; refresh with a refresh token
- Always use HTTPS

Want a code example for creating/verifying JWTs?`,
    ],
  },
  {
    pattern: /analytics|q4.*visitors|bounce rate|traffic sources/i,
    responses: [
      `## Key Analytics Insights

### Traffic & Engagement
- **2.3M visitors** — solid baseline for Q4
- **34% bounce rate** — acceptable; room to improve on landing pages
- **4.2 min avg session** — indicates decent engagement depth

### Traffic Sources
1. **Organic (45%)** — strongest channel; SEO investment is paying off
2. **Direct (28%)** — strong brand recall / repeat visits
3. **Referral (18%)** — partnership and content marketing driving traffic

### Recommendations
1. **Reduce bounce rate** — A/B test landing pages, improve load times
2. **Grow referral** — expand content partnerships, guest posts
3. **Direct traffic** — nurture email lists and push notifications to convert one-time visitors

Would you like a deeper breakdown by device or geography?`,
    ],
  },
];
