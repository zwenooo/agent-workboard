export const TASK_STATUSES = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
  "canceled",
];
export const TASK_PRIORITIES = ["none", "urgent", "high", "medium", "low"];

export const DEFAULT_PROJECT_ID = "local";
export const JIRA_PROJECT_ID = "jira-my-tasks";
export const DEFAULT_AGENT_KIND = "codex";
export const GENERIC_AGENT_KIND = "agent";
export const DEFAULT_LABEL_NAMES = [
  "缺陷",
  "特性",
  "for-claude",
  "hold",
  "改进",
  "phase-1",
  "phase-2",
  "phase-3",
  "phase-4",
  "phase-5",
  "phase-6",
];

const AGENT_KIND_ALIASES = new Map([
  ["claude", "claude-code"],
  ["open-claw", "openclaw"],
]);

const AGENT_KIND_LABELS = new Map([
  ["codex", "Codex"],
  ["claude-code", "Claude Code"],
  ["openclaw", "OpenClaw"],
  ["hermes", "Hermes"],
  ["pi", "Pi"],
  [GENERIC_AGENT_KIND, ""],
]);

export function normalizeAgentKind(value, fallback = DEFAULT_AGENT_KIND) {
  const raw = value === undefined || value === null || value === "" ? fallback : value;
  if (typeof raw !== "string") throw new TypeError("Agent kind must be a string");
  const normalized = raw.trim().toLowerCase().replace(/[\s_]+/g, "-");
  const canonical = AGENT_KIND_ALIASES.get(normalized) ?? normalized;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/.test(canonical)) {
    throw new TypeError("Agent kind must be a lowercase slug of 1 to 40 characters");
  }
  return canonical;
}

export function agentKindLabel(kind) {
  const normalized = normalizeAgentKind(kind);
  return AGENT_KIND_LABELS.get(normalized)
    ?? normalized.split("-").map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join(" ");
}

export function agentActorId(kind, ownerId = null) {
  const normalized = normalizeAgentKind(kind);
  const id = normalized === GENERIC_AGENT_KIND ? "agent" : `${normalized}-agent`;
  return ownerId ? `${ownerId}:${id}` : id;
}

export function agentActorName(kind, ownerName = null) {
  const label = agentKindLabel(kind);
  const name = label ? `${label} Agent` : "Agent";
  return ownerName ? `${name} (${ownerName})` : name;
}

export function isTaskStatus(value) {
  return TASK_STATUSES.includes(value);
}

export function isTaskPriority(value) {
  return TASK_PRIORITIES.includes(value);
}
