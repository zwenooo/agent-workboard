import {
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CloudMemberIdentity {
  id: string;
  username: string;
  displayName: string;
  role: "admin" | "member";
}

interface AuthStatus {
  mode: "member";
  setupRequired: boolean;
  authenticated: boolean;
  member: CloudMemberIdentity | null;
}

interface CloudAuthValue {
  member: CloudMemberIdentity;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const CloudAuthContext = createContext<CloudAuthValue | null>(null);

export function useCloudAuth() {
  return useContext(CloudAuthContext);
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  let body: (T & { error?: { message?: string } }) | null = null;
  try {
    body = await response.json() as T & { error?: { message?: string } };
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new Error(body?.error?.message ?? `Request failed (${response.status})`);
  }
  return body as T;
}

function AuthBrand() {
  return (
    <div className="auth-brand" aria-label="Codex Taskboard">
      <span className="auth-brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>CODEX TASKBOARD</span>
    </div>
  );
}

function AuthPage({
  setupRequired,
  onAuthenticated,
}: {
  setupRequired: boolean;
  onAuthenticated: (member: CloudMemberIdentity) => void;
}) {
  const chinese = navigator.language.toLowerCase().startsWith("zh");
  const text = (zh: string, en: string) => chinese ? zh : en;
  const [username, setUsername] = useState(setupRequired ? "admin" : "");
  const [displayName, setDisplayName] = useState(setupRequired ? text("管理员", "Administrator") : "");
  const [password, setPassword] = useState("");
  const [bootstrapSecret, setBootstrapSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const data = setupRequired
        ? await authRequest<{ member: CloudMemberIdentity }>("/api/auth/setup", {
            method: "POST",
            body: JSON.stringify({ username, displayName, password, bootstrapSecret }),
          })
        : await authRequest<{ member: CloudMemberIdentity }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
      onAuthenticated(data.member);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text("登录失败", "Sign in failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-narrative">
        <AuthBrand />
        <div className="auth-narrative-copy">
          <span className="auth-eyebrow">TEAM OPERATIONS · {new Date().getFullYear()}</span>
          <h1>{text("每项工作，\n都有明确的归属。", "Every task,\nwith a clear owner.")}</h1>
          <p>{text(
            "独立成员身份连接任务、评论与 Codex 执行记录。进度共享，凭据只属于你。",
            "Individual identities connect issues, comments, and Codex runs. Progress is shared; credentials stay personal.",
          )}</p>
        </div>
        <div className="auth-rail" aria-hidden="true">
          <span><i />01 <b>{text("身份", "IDENTITY")}</b></span>
          <span><i />02 <b>{text("协作", "COLLABORATION")}</b></span>
          <span><i />03 <b>{text("交付", "DELIVERY")}</b></span>
        </div>
      </section>

      <section className="auth-form-zone">
        <div className="auth-form-heading">
          <span>{setupRequired ? "INITIAL SETUP" : "MEMBER ACCESS"}</span>
          <strong>{setupRequired
            ? text("创建首位管理员", "Create the first administrator")
            : text("登录任务面板", "Sign in to Taskboard")}</strong>
          <p>{setupRequired
            ? text("仅首次部署需要。部署密钥验证成功后，共享密码登录将永久停用。", "Required once. Shared-password access is disabled after setup.")
            : text("使用管理员为你创建的独立账号。", "Use the individual account created for you by an administrator.")}</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label>
            <span>{text("账号", "Username")}</span>
            <input
              autoComplete="username"
              autoFocus={!setupRequired}
              maxLength={60}
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder={text("例如：zhangsan", "e.g. zhangsan")}
            />
          </label>
          {setupRequired && (
            <label>
              <span>{text("显示名称", "Display name")}</span>
              <input
                maxLength={80}
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={text("显示在任务动态中", "Shown in activity history")}
              />
            </label>
          )}
          <label>
            <span>{text("密码", "Password")}</span>
            <input
              autoComplete={setupRequired ? "new-password" : "current-password"}
              minLength={8}
              maxLength={128}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={text("至少 8 个字符", "At least 8 characters")}
            />
          </label>
          {setupRequired && (
            <label>
              <span>{text("部署密钥", "Deployment key")}</span>
              <input
                autoComplete="off"
                required
                type="password"
                value={bootstrapSecret}
                onChange={(event) => setBootstrapSecret(event.target.value)}
                placeholder="TASKBOARD_SHARED_SECRET"
              />
            </label>
          )}
          {error && <div className="auth-error" role="alert"><i />{error}</div>}
          <button className="auth-submit" type="submit" disabled={submitting}>
            <span>{submitting
              ? text("正在验证…", "Verifying…")
              : setupRequired
                ? text("创建并进入", "Create and continue")
                : text("进入工作区", "Enter workspace")}</span>
            <b aria-hidden="true">↗</b>
          </button>
        </form>

        <div className="auth-security-note">
          <i aria-hidden="true" />
          <span>{text("密码经独立加盐哈希后保存", "Passwords are stored as individually salted hashes")}</span>
        </div>
      </section>
    </main>
  );
}

export function AuthGateway({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "local" | "cloud">("loading");
  const [setupRequired, setSetupRequired] = useState(false);
  const [member, setMember] = useState<CloudMemberIdentity | null>(null);

  async function refresh() {
    try {
      const next = await authRequest<AuthStatus>("/api/auth/status");
      setStatus("cloud");
      setSetupRequired(next.setupRequired);
      setMember(next.authenticated ? next.member : null);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        setStatus("local");
        return;
      }
      throw error;
    }
  }

  useEffect(() => {
    void refresh().catch(() => setStatus("local"));
    const requireAuthentication = () => void refresh();
    window.addEventListener("taskboard:auth-required", requireAuthentication);
    return () => window.removeEventListener("taskboard:auth-required", requireAuthentication);
  }, []);

  const value = useMemo<CloudAuthValue | null>(() => member ? {
    member,
    refresh,
    logout: async () => {
      await authRequest("/api/auth/logout", { method: "POST" });
      setMember(null);
    },
  } : null, [member]);

  if (status === "loading") {
    return (
      <div className="auth-loading" aria-label="Loading Taskboard">
        <AuthBrand />
        <span><i /><i /><i /></span>
      </div>
    );
  }
  if (status === "local") return children;
  if (!member) {
    return (
      <AuthPage
        setupRequired={setupRequired}
        onAuthenticated={(nextMember) => {
          setSetupRequired(false);
          setMember(nextMember);
        }}
      />
    );
  }
  return <CloudAuthContext.Provider value={value}>{children}</CloudAuthContext.Provider>;
}
