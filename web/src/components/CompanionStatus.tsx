import type { ReactNode } from "react";

interface CompanionStatusProps {
  mode: "local" | "cloud" | undefined;
  available: boolean;
  href: string;
  workspace?: {
    linked: boolean;
    pending: boolean;
    projectName: string;
    onSelect: () => void;
  };
  text: (chinese: string, english: string) => string;
}

export function CompanionStatus({ mode, available, href, workspace, text }: CompanionStatusProps) {
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
  ) : mode === "cloud" && available && workspace ? (
    <button
      className="companion-status-action"
      type="button"
      disabled={workspace.pending}
      onClick={workspace.onSelect}
      title={text(
        `${workspace.linked ? "更换" : "关联"}“${workspace.projectName}”的本机目录`,
        `${workspace.linked ? "Change" : "Link"} the local folder for “${workspace.projectName}”`,
      )}
    >
      {workspace.pending
        ? text("选择中…", "Selecting…")
        : workspace.linked
          ? text("更换目录", "Change folder")
          : text("关联目录", "Link folder")}
    </button>
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
