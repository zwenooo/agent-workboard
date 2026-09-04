import type { ActorIdentity, AssigneeTarget, TaskboardMember } from "./types";

export const CODEX_AGENT_ACTOR: ActorIdentity = {
  type: "agent",
  id: "codex-agent",
  name: "Codex Agent",
  avatarUrl: null,
};

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
  if (target === "current-user") return currentUser;
  return members.find((member) => member.id === target) ?? currentUser;
}

export function assigneeTargetForActor(
  actor: ActorIdentity,
  currentUser: ActorIdentity,
): AssigneeTarget | undefined {
  if (actor.type === "agent") return "codex-agent";
  if (actor.id === currentUser.id) return "current-user";
  return actor.id.startsWith("member:") ? actor.id as `member:${string}` : undefined;
}
