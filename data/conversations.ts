import type { Conversation } from "@/lib/types";

export const mockConversations: Conversation[] = [
  {
    id: "698dd98f-87ec-83a8-9d26-3015b92875ba",
    title: "API Schema Design",
    isFavorite: true,
    createdAt: new Date("2025-02-10T09:00:00Z"),
    updatedAt: new Date("2025-02-10T09:15:00Z"),
    messages: [
      {
        id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
        role: "user",
        content:
          "Generate a REST API schema for a task management app with projects, tasks, and comments.",
        timestamp: new Date("2025-02-10T09:00:00Z"),
      },
      {
        id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
        role: "assistant",
        content: `Here's a suggested REST API schema for your task management app:

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
        timestamp: new Date("2025-02-10T09:02:00Z"),
      },
    ],
  },
  {
    id: "7a9e0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c",
    title: "Dashboard UI Component",
    isFavorite: true,
    createdAt: new Date("2025-02-11T14:30:00Z"),
    updatedAt: new Date("2025-02-11T14:45:00Z"),
    messages: [
      {
        id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
        role: "user",
        content:
          "Generate a React dashboard UI component with stats cards and a chart placeholder.",
        timestamp: new Date("2025-02-11T14:30:00Z"),
      },
      {
        id: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
        role: "assistant",
        content: `Here's a clean dashboard component:

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
        timestamp: new Date("2025-02-11T14:33:00Z"),
      },
    ],
  },
  {
    id: "8b0c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e",
    title: "Summarize Analytics Insights",
    createdAt: new Date("2025-02-12T08:15:00Z"),
    updatedAt: new Date("2025-02-12T08:20:00Z"),
    messages: [
      {
        id: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
        role: "user",
        content:
          "Our Q4 analytics show: 2.3M visitors, 34% bounce rate, 4.2 min avg session. Top traffic: organic 45%, direct 28%, referral 18%. What are the key insights?",
        timestamp: new Date("2025-02-12T08:15:00Z"),
      },
      {
        id: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
        role: "assistant",
        content: `## Key Analytics Insights

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
        timestamp: new Date("2025-02-12T08:17:00Z"),
      },
    ],
  },
  {
    id: "9c1d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f",
    title: "Explain WebSocket Handshake",
    createdAt: new Date("2025-02-12T10:00:00Z"),
    updatedAt: new Date("2025-02-12T10:00:00Z"),
    messages: [
      {
        id: "a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d",
        role: "user",
        content: "Explain how WebSocket handshake works in simple terms.",
        timestamp: new Date("2025-02-12T10:00:00Z"),
      },
      {
        id: "b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e",
        role: "assistant",
        content: `## WebSocket Handshake Explained

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
Once both sides agree, the TCP connection is **upgraded**. From then on, it's **binary frames** instead of HTTP — both sides can send data anytime without request/response.

**TL;DR:** Start with HTTP → client asks to upgrade → server says OK → connection becomes full-duplex WebSocket.`,
        timestamp: new Date("2025-02-12T10:01:00Z"),
      },
    ],
  },
];
