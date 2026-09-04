import type { ActorIdentity, AssigneeTarget, TaskboardMember } from "./types";

export const CODEX_AGENT_ACTOR: ActorIdentity = {
  type: "agent",
  id: "codex-agent",
  name: "Codex Agent",
  avatarUrl: null,
};

export function agentKindFromActorId(id: string): string {
  const suffix = id.split(":").at(-1) ?? id;
  if (suffix === "agent") return "agent";
  return suffix.endsWith("-agent") ? suffix.slice(0, -"-agent".length) : "agent";
}

export function agentInitials(kind: string): string {
  const known: Record<string, string> = {
    "claude-code": "CC",
    openclaw: "OC",
    hermes: "HE",
    pi: "PI",
    agent: "AI",
  };
  if (known[kind]) return known[kind];
  return kind.split("-").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AI";
}

export function agentLogoPath(kind: string): string | null {
  const logos: Record<string, string> = {
    codex: "agent-codex.svg",
    "claude-code": "agent-claude-code.svg",
    openclaw: "agent-openclaw.svg",
    pi: "agent-pi.svg",
  };
  return logos[kind] ?? null;
}

function agentName(kind: string): string {
  const known: Record<string, string> = {
    codex: "Codex Agent",
    "claude-code": "Claude Code Agent",
    openclaw: "OpenClaw Agent",
    hermes: "Hermes Agent",
    pi: "Pi Agent",
    agent: "Agent",
  };
  if (known[kind]) return known[kind];
  const label = kind.split("-").map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
  return `${label} Agent`;
}

export function actorKey(actor: ActorIdentity): string {
  return `${actor.type}:${actor.id}`;
}

export function actorForMember(member: TaskboardMember): ActorIdentity {
  return {
    type: "user",
    id: `member:${member.id}`,
    name: member.displayName,
    avatarUrl: null,
  };
}

export function actorForAssigneeTarget(
  target: AssigneeTarget,
  currentUser: ActorIdentity,
  members: ActorIdentity[] = [],
): ActorIdentity {
  if (target === "codex-agent") return CODEX_AGENT_ACTOR;
  if (target.startsWith("agent:")) {
    const kind = target.slice("agent:".length);
    return {
      type: "agent",
      id: `${kind}-agent`,
      name: agentName(kind),
      avatarUrl: null,
    };
  }
  if (target === "current-user") return currentUser;
  return members.find((member) => member.id === target) ?? currentUser;
}

export function assigneeTargetForActor(
  actor: ActorIdentity,
  currentUser: ActorIdentity,
): AssigneeTarget | undefined {
  if (actor.type === "agent") {
    const kind = agentKindFromActorId(actor.id);
    return kind === "codex" ? "codex-agent" : `agent:${kind}`;
  }
  if (actor.id === currentUser.id) return "current-user";
  return actor.id.startsWith("member:") ? actor.id as `member:${string}` : undefined;
}
