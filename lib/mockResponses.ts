const MOCK_RESPONSES = [
  `Here's a structured approach to that:

**1. Define the scope**
- Clarify requirements
- Identify constraints
- Set success criteria

**2. Break it down**
- Create substeps
- Prioritize by impact
- Estimate effort

**3. Execute & iterate**
- Build incrementally
- Gather feedback
- Adjust as needed

Would you like me to go deeper on any of these steps?`,
  `I can help with that. Here's a quick example:

\`\`\`typescript
// Example structure
interface Response {
  id: string;
  data: unknown;
  timestamp: Date;
}
\`\`\`

Let me know if you need more detail or a different approach.`,
  `Based on your input, here are the key points:

| Item | Status | Notes |
|------|--------|-------|
| First | Done | Looks good |
| Second | In progress | Needs review |
| Third | Pending | Blocked |

I can expand on any of these if useful.`,
  `Sure. Here’s a concise version:

- **Option A:** Fast but less flexible
- **Option B:** More setup, better long-term
- **Option C:** Hybrid — good balance

Recommendation: Start with Option C unless you have specific constraints. Want to dive into implementation?`,
];

export function getMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]!;
}
