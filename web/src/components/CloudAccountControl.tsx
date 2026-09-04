import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCloudAuth } from "../AuthGateway";
import type { TaskboardMember } from "../types";

async function memberRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const body = await response.json() as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message ?? `Request failed (${response.status})`);
  return body;
}

function initials(value: string) {
  return [...value.trim()].slice(0, 2).join("").toUpperCase() || "TB";
}

function lastLoginLabel(value: string | null, chinese: boolean) {
  if (!value) return chinese ? "尚未登录" : "Never signed in";
  const dateTime = new Date(value).toLocaleString(chinese ? "zh-CN" : "en-US");
  return chinese ? `上次登录：${dateTime}` : `Last signed in: ${dateTime}`;
}

export function CloudAccountControl() {
  const auth = useCloudAuth();
  const chinese = navigator.language.toLowerCase().startsWith("zh");
  const text = (zh: string, en: string) => chinese ? zh : en;
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TaskboardMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "member">("member");
  const [resettingMemberId, setResettingMemberId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = auth?.member.role === "admin";
  const activeMembers = useMemo(() => members.filter((member) => member.active).length, [members]);

  async function loadMembers() {
    if (!isAdmin) return;
    setLoadingMembers(true);
    setError("");
    try {
      const data = await memberRequest<{ members: TaskboardMember[] }>("/api/members");
      setMembers(data.members);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text("成员读取失败", "Failed to load members"));
    } finally {
      setLoadingMembers(false);
    }
  }

  useEffect(() => {
    if (open) void loadMembers();
  }, [open, isAdmin]);

  if (!auth) return null;

  async function createMember(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await memberRequest<{ member: TaskboardMember }>("/api/members", {
        method: "POST",
        body: JSON.stringify({
          username: newUsername,
          displayName: newDisplayName,
          password: newPassword,
          role: newRole,
        }),
      });
      setMembers((current) => [...current, data.member]);
      setNewUsername("");
      setNewDisplayName("");
      setNewPassword("");
      setNewRole("member");
      setCreateOpen(false);
      setNotice(text(`已创建成员 ${data.member.displayName}`, `Created ${data.member.displayName}`));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text("创建失败", "Create failed"));
    } finally {
      setSaving(false);
    }
  }

  async function updateMember(memberId: string, changes: Record<string, unknown>) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await memberRequest<{ member: TaskboardMember }>(`/api/members/${encodeURIComponent(memberId)}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setMembers((current) => current.map((member) => member.id === memberId ? data.member : member));
      setNotice(text("成员信息已更新", "Member updated"));
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text("更新失败", "Update failed"));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function submitPasswordReset(event: FormEvent, memberId: string) {
    event.preventDefault();
    if (await updateMember(memberId, { password: resetPassword })) {
      setResettingMemberId(null);
      setResetPassword("");
      setNotice(text("密码已重置，该成员的现有会话已退出", "Password reset; existing sessions were signed out"));
    }
  }

  async function changeOwnPassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (nextPassword !== confirmPassword) {
      setError(text("两次输入的新密码不一致", "New passwords do not match"));
      return;
    }
    setSaving(true);
    try {
      await memberRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword: nextPassword }),
      });
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      setNotice(text(
        "密码已更新；如已连接 Codex，请重新运行 taskctl cloud login",
        "Password updated; rerun taskctl cloud login if Codex is connected",
      ));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text("密码修改失败", "Password change failed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button className="cloud-account-trigger" type="button" onClick={() => setOpen(true)}>
        <span className="cloud-account-avatar">{initials(auth.member.displayName)}</span>
        <span>
          <strong>{auth.member.displayName}</strong>
          <small>@{auth.member.username}</small>
        </span>
        <i aria-hidden="true">↗</i>
      </button>

      {open && createPortal((
        <div className="member-backdrop" onPointerDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="member-panel" role="dialog" aria-modal="true" aria-labelledby="member-panel-title">
            <header className="member-panel-header">
              <div>
                <span>ACCESS CONTROL</span>
                <h2 id="member-panel-title">{text("成员与账号", "Members & account")}</h2>
              </div>
              <button type="button" aria-label={text("关闭", "Close")} onClick={() => setOpen(false)}>×</button>
            </header>

            <div className="member-profile-strip">
              <span className="member-profile-avatar">{initials(auth.member.displayName)}</span>
              <div>
                <strong>{auth.member.displayName}</strong>
                <span>@{auth.member.username}</span>
              </div>
              <b>{auth.member.role === "admin" ? text("管理员", "Administrator") : text("成员", "Member")}</b>
            </div>

            {(error || notice) && (
              <div className={`member-message${error ? " is-error" : ""}`} role={error ? "alert" : "status"}>
                <i />{error || notice}
              </div>
            )}

            <div className="member-panel-scroll">
              {isAdmin && (
                <section className="member-section">
                  <div className="member-section-heading">
                    <div>
                      <span>{text("工作区成员", "Workspace members")}</span>
                      <small>{text(`${activeMembers} 位有效成员`, `${activeMembers} active members`)}</small>
                    </div>
                    <button className="member-add-button" type="button" onClick={() => setCreateOpen((current) => !current)}>
                      {createOpen ? text("取消", "Cancel") : text("＋ 新增成员", "+ Add member")}
                    </button>
                  </div>

                  {createOpen && (
                    <form className="member-create-form" onSubmit={createMember}>
                      <label><span>{text("账号", "Username")}</span><input required maxLength={60} value={newUsername} onChange={(event) => setNewUsername(event.target.value)} /></label>
                      <label><span>{text("显示名称", "Display name")}</span><input required maxLength={80} value={newDisplayName} onChange={(event) => setNewDisplayName(event.target.value)} /></label>
                      <label><span>{text("初始密码", "Initial password")}</span><input required minLength={8} maxLength={128} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
                      <label><span>{text("角色", "Role")}</span><select value={newRole} onChange={(event) => setNewRole(event.target.value as "admin" | "member")}><option value="member">{text("成员", "Member")}</option><option value="admin">{text("管理员", "Administrator")}</option></select></label>
                      <button type="submit" disabled={saving}>{saving ? text("创建中…", "Creating…") : text("创建账号", "Create account")}</button>
                    </form>
                  )}

                  <div className="member-list" aria-busy={loadingMembers}>
                    {loadingMembers && <div className="member-list-empty">{text("正在读取成员…", "Loading members…")}</div>}
                    {!loadingMembers && members.map((member) => (
                      <article className={`member-row${member.active ? "" : " is-disabled"}`} key={member.id}>
                        <span className="member-row-avatar">{initials(member.displayName)}</span>
                        <div className="member-row-identity">
                          <strong>{member.displayName}{member.id === auth.member.id && <em>{text("你", "You")}</em>}</strong>
                          <span>@{member.username} · {lastLoginLabel(member.lastLoginAt, chinese)}</span>
                        </div>
                        <select
                          aria-label={text(`${member.displayName}的角色`, `Role for ${member.displayName}`)}
                          disabled={saving}
                          value={member.role}
                          onChange={(event) => void updateMember(member.id, { role: event.target.value })}
                        >
                          <option value="member">{text("成员", "Member")}</option>
                          <option value="admin">{text("管理员", "Admin")}</option>
                        </select>
                        <button
                          className="member-row-action"
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            setResettingMemberId(member.id);
                            setResetPassword("");
                          }}
                        >{text("重置密码", "Reset password")}</button>
                        <button
                          className={`member-status-button${member.active ? "" : " is-reactivate"}`}
                          type="button"
                          disabled={saving || member.id === auth.member.id}
                          onClick={() => void updateMember(member.id, { active: !member.active })}
                        >{member.active ? text("停用", "Disable") : text("启用", "Enable")}</button>
                        {resettingMemberId === member.id && (
                          <form className="member-reset-form" onSubmit={(event) => void submitPasswordReset(event, member.id)}>
                            <label><span>{text("为该成员设置新密码", "Set a new password")}</span><input autoFocus required minLength={8} maxLength={128} type="password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} /></label>
                            <button type="button" onClick={() => setResettingMemberId(null)}>{text("取消", "Cancel")}</button>
                            <button type="submit" disabled={saving}>{text("确认重置", "Reset")}</button>
                          </form>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section className="member-section account-security-section">
                <div className="member-section-heading">
                  <div>
                    <span>{text("账号安全", "Account security")}</span>
                    <small>{text("修改你自己的登录密码", "Change your own sign-in password")}</small>
                  </div>
                </div>
                <form className="member-password-form" onSubmit={changeOwnPassword}>
                  <label><span>{text("当前密码", "Current password")}</span><input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
                  <label><span>{text("新密码", "New password")}</span><input required minLength={8} maxLength={128} type="password" autoComplete="new-password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} /></label>
                  <label><span>{text("确认新密码", "Confirm password")}</span><input required minLength={8} maxLength={128} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
                  <button type="submit" disabled={saving}>{text("更新密码", "Update password")}</button>
                </form>
              </section>
            </div>

            <footer className="member-panel-footer">
              <span>{text("账号凭据仅用于此 Taskboard", "Credentials are scoped to this Taskboard")}</span>
              <button type="button" onClick={() => void auth.logout()}>{text("退出登录", "Sign out")}</button>
            </footer>
          </section>
        </div>
      ), document.body)}
    </>
  );
}
