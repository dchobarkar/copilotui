/**
 * Context-aware mock responses. No LLM—uses keyword matching and prompt
 * extraction to pick relevant, natural-sounding responses. Follows chatbot
 * UX best practices: conversational tone, contextual awareness, clear structure.
 */

import {
  MOCK_RESPONSES,
  PROMPT_SPECIFIC_RESPONSES,
  type ResponseCategory,
} from "@/data/mockResponses";

const detectCategory = (prompt: string): ResponseCategory => {
  const lower = prompt.toLowerCase().trim();

  // Greeting / casual (only when prompt is just a greeting)
  if (
    /^(hi|hey|hello|howdy|yo|sup|what'?s up|good morning|good afternoon|good evening)[\s!?.]*$/i.test(
      lower,
    )
  ) {
    return "greeting";
  }

  // Help / capabilities
  if (
    /what can you do|what can you help|how can you help|help me|capabilities|what are you|who are you|get started|what do you do/i.test(
      lower,
    )
  ) {
    return "help";
  }

  // Thanks / acknowledgment
  if (/^(thanks|thank you|thx|ty|got it|perfect|great)[\s!?.]*$/i.test(lower)) {
    return "acknowledge";
  }

  // Attachments / summarize
  if (
    /attached|attachment|file\(s\)|\.pdf|\.png|\.jpg|\.txt|\.md|\.json|\.csv/i.test(
      lower,
    )
  ) {
    return "summarize";
  }
  if (
    /summarize|summary|summarise|tl;?dr|brief|overview|recap|key points|insights/i.test(
      lower,
    )
  ) {
    return "summarize";
  }

  // Code / implementation
  if (
    /code|component|function|implement|typescript|javascript|react|python|write.*schema|generate.*code|create.*component/i.test(
      lower,
    )
  ) {
    return "code";
  }

  // Explain / conceptual
  if (
    /explain|what is|how does|why does|meaning of|understand|describe|how.*work/i.test(
      lower,
    )
  ) {
    return "explain";
  }

  // UI / design
  if (
    /dashboard|ui|interface|design|layout|button|modal|component|responsive|tailwind/i.test(
      lower,
    )
  ) {
    return "ui";
  }

  // API
  if (/api|endpoint|rest|graphql|request|response|schema/i.test(lower)) {
    return "api";
  }

  return "general";
}

/** Extract main subject/topic from prompt for contextual responses */
const extractSubject = (prompt: string): string => {
  const lower = prompt.toLowerCase().trim();
  const cleaned = lower
    .replace(
      /^(explain|what is|how does|why does|describe|tell me about|generate|create|write|build|design|make)\s+/i,
      "",
    )
    .replace(/\?+\.*$/, "")
    .trim();
  const match = cleaned.match(/^[\w\s\-]+/);
  const phrase = match ? match[0].trim() : cleaned.slice(0, 40);
  return phrase || "that";
}

const truncateForEcho = (text: string, maxLen = 50): string => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen).trim() + "…";
}

const withSubject = (template: string, subject: string): string => {
  return template.replace(/\{subject\}/g, subject);
}

export const getMockResponse = (userPrompt: string): string => {
  const trimmed = userPrompt.replace(/\n\n\[Attached:[\s\S]*\]\s*$/, "").trim();
  if (!trimmed) {
    return "I'd be happy to help. What would you like to know or work on?";
  }

  for (const { pattern, responses } of PROMPT_SPECIFIC_RESPONSES) {
    if (pattern.test(trimmed)) {
      return responses[Math.floor(Math.random() * responses.length)]!;
    }
  }

  const category = detectCategory(trimmed);
  const options = MOCK_RESPONSES[category];
  const response = options[Math.floor(Math.random() * options.length)]!;
  const subject = extractSubject(trimmed);

  const interpolated =
    category === "explain" ? withSubject(response, subject) : response;

  const shouldEcho = Math.random() < 0.2 && trimmed.length < 100;
  if (shouldEcho) {
    const echo = truncateForEcho(trimmed);
    return `Regarding "${echo}" — ${interpolated}`;
  }

  return interpolated;
}
