/**
 * Context-aware mock responses. No LLM—uses keyword matching to pick
 * relevant responses. Improves demo feel without backend integration.
 */

type ResponseCategory =
  | "summarize"
  | "code"
  | "explain"
  | "ui"
  | "api"
  | "general";

function detectCategory(prompt: string): ResponseCategory {
  const lower = prompt.toLowerCase();
  if (
    /summarize|summary|summarise|tl;?dr|brief|overview|recap/i.test(lower)
  ) {
    return "summarize";
  }
  if (
    /code|component|function|implement|typescript|javascript|react|python|api schema|write.*schema/i.test(
      lower,
    )
  ) {
    return "code";
  }
  if (
    /explain|what is|how does|why|meaning|understand|describe/i.test(lower)
  ) {
    return "explain";
  }
  if (
    /dashboard|ui|interface|design|layout|button|modal|component/i.test(lower)
  ) {
    return "ui";
  }
  if (/api|endpoint|rest|graphql|request|response/i.test(lower)) {
    return "api";
  }
  return "general";
}

function truncateForEcho(text: string, maxLen = 40): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen) + "…";
}

const RESPONSES: Record<ResponseCategory, string[]> = {
  summarize: [
    `Here's a concise summary:

**Key points:**
- Main idea captured in a few bullets
- Supporting details distilled
- Conclusion or next steps

The core takeaway is that this can be refined further if you share the full text.`,
    `**Summary:**

1. **Overview** — The essential message in one sentence.
2. **Details** — Important supporting points.
3. **Implication** — What it means or what to do next.

Want me to expand on any section or make it shorter?`,
    `**TL;DR:** Condensed version of the main ideas, with the most important outcome highlighted.

I can go deeper on specific parts or adjust the length if you’d like.`,
  ],
  code: [
    `Here's an approach you could use:

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

You can adapt this to your exact needs. Need a different pattern or language?`,
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

This gives you a starting structure. I can add state, props, or styling if you specify.`,
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

The idea breaks down into a few parts:

1. **What it is** — A clear definition or description.
2. **How it works** — The main mechanism or flow.
3. **Why it matters** — Practical impact or use case.

If you share more context, I can tailor this explanation.`,
    `Here’s a straightforward breakdown:

- **Core concept** — The central idea in plain language.
- **Key components** — The main pieces and how they fit together.
- **Common use cases** — Where and when this is typically used.

Want to go deeper on any of these?`,
    `**Explanation:**

Think of it as [X] that does [Y]. The main benefit is [Z], and it’s often used when you need to [use case].

I can add examples or relate it to something specific if you’d like.`,
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

Use standard status codes (200, 201, 400, 404) and consistent error shapes. I can add request/response examples if you’d like.`,
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
    `Here’s a structured approach:

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
    `I can help with that. Here’s a starting point:

| Step | Action | Notes |
|------|--------|-------|
| 1 | Define | Clarify requirements |
| 2 | Plan | Break into tasks |
| 3 | Execute | Build incrementally |

Want to focus on a particular step or add more detail?`,
  ],
};

export function getMockResponse(userPrompt: string): string {
  const category = detectCategory(userPrompt);
  const options = RESPONSES[category];
  const response = options[Math.floor(Math.random() * options.length)]!;

  // Occasionally echo the prompt subtly for a more "aware" feel (25% chance)
  const shouldEcho = Math.random() < 0.25 && userPrompt.length < 80;
  if (shouldEcho) {
    const echo = truncateForEcho(userPrompt);
    return `Regarding "${echo}" — ${response}`;
  }

  return response;
}
