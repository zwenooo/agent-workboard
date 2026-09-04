import type { ReactNode } from "react";

interface CompanionStatusProps {
  mode: "local" | "cloud" | undefined;
  available: boolean;
  href: string;
  text: (chinese: string, english: string) => string;
}

export function CompanionStatus({ mode, available, href, text }: CompanionStatusProps) {
  const cloudBrowserOnly = mode === "cloud" && !available;
  const label = cloudBrowserOnly
    ? text("仅云端协作", "Cloud collaboration only")
    : available
      ? text("本机 Agent 已连接", "Local Agent connected")
      : text("本机服务", "Local service");
  const action: ReactNode = cloudBrowserOnly ? (
    <a
      className="companion-status-action"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {text("连接", "Connect")}
    </a>
  ) : null;

  return (
    <div
      className={`companion-status${cloudBrowserOnly ? " is-cloud-only" : ""}${available ? " is-available" : ""}`}
      title={cloudBrowserOnly
        ? text("打开本机 companion 使用 Agent、Skill 和 Git", "Open the local companion to use Agents, Skills, and Git")
        : label}
    >
      <span className="companion-status-dot" aria-hidden="true" />
      <span className="companion-status-label">{label}</span>
      {action}
    </div>
  );
}
