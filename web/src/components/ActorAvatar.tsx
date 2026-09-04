import type { ActorIdentity } from "../types";
import { agentInitials, agentKindFromActorId, agentLogoPath } from "../actors";

export function ActorAvatar({
  actor,
  className = "",
}: {
  actor: ActorIdentity;
  className?: string;
}) {
  const agentKind = actor.type === "agent" ? agentKindFromActorId(actor.id) : null;
  const agentLogo = agentKind ? agentLogoPath(agentKind) : null;
  return (
    <span
      className={`actor-avatar actor-avatar-${actor.type}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      title={actor.name}
    >
      {agentLogo ? (
        <img
          className="actor-avatar-image actor-avatar-agent-image"
          src={agentLogo}
          alt=""
        />
      ) : agentKind ? (
        <span className="actor-avatar-agent-fallback">{agentInitials(agentKind)}</span>
      ) : actor.avatarUrl ? (
        <img
          className="actor-avatar-image"
          src={actor.avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
        />
      ) : actor.name.slice(0, 1)}
    </span>
  );
}
