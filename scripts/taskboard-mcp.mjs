#!/usr/bin/env node

import { execFile, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { WebSocket } from "ws";

process.env.TASKBOARD_MCP_EMBEDDED = "1";
const { main: taskctlMain } = await import("../cli/taskctl.mjs");

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDirectory, "..");
const bridgeScript = path.join(scriptDirectory, "server.mjs");
const defaultPort = 47823;
const MCP_PROTOCOL_VERSION = "2025-06-18";
const execFileAsync = promisify(execFile);

const TOOLS = [
  ["context_current", "Read the current Taskboard project context."],
  ["project_list", "List Taskboard projects."],
  ["project_map", "Map a Taskboard project to a local workspace directory."],
  ["project_readme_get", "Read a project's README."],
  ["project_readme_set", "Write a project's README."],
  ["issue_list", "List Taskboard issues."],
  ["issue_get", "Read one Taskboard issue."],
  ["issue_create", "Create a Taskboard issue."],
  ["issue_update", "Update a Taskboard issue."],
  ["issue_move", "Move a Taskboard issue to another status."],
  ["issue_tree", "Read a Taskboard issue tree."],
  ["issue_relation_add", "Add a relation to a Taskboard issue."],
  ["issue_relation_remove", "Remove a relation from a Taskboard issue."],
  ["comment_list", "List comments for a Taskboard issue."],
  ["comment_add", "Add a comment to a Taskboard issue."],
  ["comment_update", "Update a Taskboard comment."],
  ["comment_delete", "Delete a Taskboard comment."],
  ["attachment_list", "List Taskboard attachments."],
  ["attachment_upload", "Upload a Taskboard attachment."],
  ["attachment_download", "Download a Taskboard attachment."],
  ["cloud_status", "Read local Taskboard cloud connection status."],
  ["cloud_login", "Open the local Taskboard cloud login flow."],
  ["cloud_logout", "Clear the local Taskboard cloud connection."],
];

function dataDirectory(environment = process.env) {
  if (environment.CODEX_TASKBOARD_DATA_DIR) return path.resolve(environment.CODEX_TASKBOARD_DATA_DIR);
  if (process.platform === "win32") {
    return path.join(
      environment.LOCALAPPDATA || environment.APPDATA || path.join(os.homedir(), "AppData", "Local"),
      "Codex Taskboard",
    );
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Codex Taskboard");
  }
  return path.join(environment.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"), "codex-taskboard");
}

function bridgeBaseUrl(environment = process.env) {
  const value = environment.CODEX_TASKBOARD_COMPANION_URL
    || environment.CODEX_TASKBOARD_URL
    || `http://127.0.0.1:${environment.CODEX_TASKBOARD_PORT || defaultPort}`;
  const url = new URL(value);
  if ((url.protocol !== "http:" && url.protocol !== "https:")
    || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
    || url.username || url.password || url.search || url.hash) {
    throw new Error("Taskboard MCP requires a loopback HTTP bridge URL");
  }
  url.pathname = url.pathname.replace(/\/$/, "");
  return url;
}

function wsLeaseUrl(baseUrl) {
  const url = new URL(baseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/$/, "")}/api/local/lease`;
  return url;
}

async function health(baseUrl) {
  try {
    const response = await fetch(new URL("health", `${baseUrl.href.replace(/\/$/, "")}/`), {
      signal: AbortSignal.timeout(750),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth(baseUrl, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await health(baseUrl)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Taskboard bridge did not become ready at ${baseUrl.origin}`);
}

async function startBridge(baseUrl, environment) {
  if (await health(baseUrl)) return null;
  const port = Number(baseUrl.port || defaultPort);
  const child = spawn(await compatibleNode(environment), [bridgeScript], {
    cwd: skillRoot,
    env: {
      ...environment,
      CODEX_TASKBOARD_HOST: "127.0.0.1",
      CODEX_TASKBOARD_PORT: String(port),
      CODEX_TASKBOARD_DATA_DIR: environment.CODEX_TASKBOARD_DATA_DIR || dataDirectory(environment),
      CODEX_TASKBOARD_SKILL_PATH: environment.CODEX_TASKBOARD_SKILL_PATH || path.join(skillRoot, "SKILL.md"),
      CODEX_TASKBOARD_LEASE_MANAGED: "1",
    },
    stdio: "ignore",
    windowsHide: true,
  });
  await waitForHealth(baseUrl);
  return child;
}

function supportedNode(version) {
  const parts = String(version).replace(/^v/i, "").split(".").map((part) => Number(part));
  return parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])
    && (parts[0] > 22 || (parts[0] === 22 && parts[1] >= 5));
}

async function compatibleNode(environment) {
  if (supportedNode(process.versions.node)) return process.execPath;
  const candidates = [];
  if (environment.TASKBOARD_NODE_PATH) candidates.push(environment.TASKBOARD_NODE_PATH);
  try {
    const command = process.platform === "win32" ? "where.exe" : "which";
    const { stdout } = await execFileAsync(command, ["node"], { encoding: "utf8", env: environment });
    candidates.push(...stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
  } catch {}
  for (const candidate of [...new Set(candidates)]) {
    try {
      const { stdout } = await execFileAsync(candidate, ["--version"], { encoding: "utf8", env: environment });
      if (supportedNode(stdout.trim())) return candidate;
    } catch {}
  }
  throw new Error("Node.js 22.5 or newer is required for the local Taskboard bridge");
}

function openLease(baseUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsLeaseUrl(baseUrl), { origin: "http://127.0.0.1" });
    const onError = (error) => {
      socket.removeAllListeners();
      reject(error);
    };
    socket.once("open", () => {
      socket.off("error", onError);
      resolve(socket);
    });
    socket.once("error", onError);
  });
}

function option(args, name, value) {
  if (value === undefined || value === null) return;
  args.push(`--${name}`, Array.isArray(value) ? value.join(",") : String(value));
}

function threadBindingOptions(args, input = {}) {
  const binding = input.threadBinding;
  option(args, "thread-id", input.threadId);
  if (!binding) return;
  option(args, "binding-thread-id", binding.threadId);
  option(args, "binding-codex-project-id", binding.codexProjectId);
  option(args, "binding-codex-project-kind", binding.codexProjectKind);
  option(args, "binding-codex-host-id", binding.codexHostId);
  option(args, "binding-workspace-path", binding.workspacePath);
}

function toolArgs(name, input = {}) {
  const args = [];
  switch (name) {
    case "context_current":
      args.push("context", "current");
      option(args, "cwd", input.cwd);
      break;
    case "project_list":
      args.push("project", "list");
      break;
    case "project_map":
      args.push("project", "map", String(input.projectId ?? ""));
      option(args, "workspace-path", input.workspacePath);
      break;
    case "project_readme_get":
      args.push("project", "readme", "get", ...(input.projectId ? [String(input.projectId)] : []));
      break;
    case "project_readme_set":
      args.push("project", "readme", "set", ...(input.projectId ? [String(input.projectId)] : []));
      option(args, "content", input.content);
      option(args, "if-version", input.version);
      break;
    case "issue_list":
      args.push("issue", "list");
      option(args, "project", input.projectId);
      option(args, "status", input.status);
      option(args, "archived", input.archived);
      break;
    case "issue_get":
      args.push("issue", "get", String(input.issueId ?? ""));
      break;
    case "issue_create":
      args.push("issue", "create");
      option(args, "project", input.projectId);
      option(args, "title", input.title);
      option(args, "description", input.description);
      option(args, "status", input.status);
      option(args, "priority", input.priority);
      option(args, "labels", input.labels);
      option(args, "assignee", input.assignee);
      option(args, "git-branch", input.gitBranch);
      option(args, "worktree-path", input.worktreePath);
      option(args, "worktree-branch", input.worktreeBranch);
      option(args, "start-date", input.startDate);
      option(args, "due-date", input.dueDate);
      option(args, "recurrence-interval", input.recurrenceInterval);
      option(args, "recurrence-unit", input.recurrenceUnit);
      option(args, "thread-id", input.threadId);
      break;
    case "issue_update":
      args.push("issue", "update", String(input.issueId ?? ""));
      option(args, "project", input.projectId);
      option(args, "title", input.title);
      option(args, "description", input.description);
      option(args, "status", input.status);
      option(args, "priority", input.priority);
      option(args, "labels", input.labels);
      option(args, "assignee", input.assignee);
      option(args, "git-branch", input.gitBranch);
      option(args, "worktree-path", input.worktreePath);
      option(args, "worktree-branch", input.worktreeBranch);
      option(args, "start-date", input.startDate);
      option(args, "due-date", input.dueDate);
      option(args, "recurrence-interval", input.recurrenceInterval);
      option(args, "recurrence-unit", input.recurrenceUnit);
      option(args, "if-version", input.version);
      option(args, "thread-id", input.threadId);
      break;
    case "issue_move":
      args.push("issue", "move", String(input.issueId ?? ""));
      option(args, "status", input.status);
      option(args, "if-version", input.version);
      option(args, "thread-id", input.threadId);
      if (input.clearBindingThread) args.push("--clear-binding-thread");
      break;
    case "issue_tree":
      args.push("issue", "tree", String(input.issueId ?? ""));
      option(args, "direction", input.direction);
      option(args, "depth", input.depth);
      break;
    case "issue_relation_add":
    case "issue_relation_remove":
      args.push("issue", "relation", name.endsWith("_add") ? "add" : "remove", String(input.issueId ?? ""));
      option(args, "type", input.type);
      option(args, "issue", input.relatedIssueId);
      option(args, "if-version", input.version);
      option(args, "thread-id", input.threadId);
      break;
    case "comment_list":
      args.push("comment", "list", String(input.issueId ?? ""));
      option(args, "after", input.after);
      break;
    case "comment_add":
      args.push("comment", "add", String(input.issueId ?? ""));
      option(args, "body", input.body);
      threadBindingOptions(args, input);
      break;
    case "comment_update":
      args.push("comment", "update", String(input.commentId ?? ""));
      option(args, "body", input.body);
      option(args, "if-version", input.version);
      option(args, "thread-id", input.threadId);
      break;
    case "comment_delete":
      args.push("comment", "delete", String(input.commentId ?? ""));
      option(args, "if-version", input.version);
      option(args, "thread-id", input.threadId);
      break;
    case "attachment_list":
      args.push("attachment", "list");
      option(args, "task", input.issueId);
      option(args, "comment", input.commentId);
      option(args, "after", input.after);
      break;
    case "attachment_upload":
      args.push("attachment", "upload");
      option(args, "file", input.file);
      option(args, "task", input.issueId);
      option(args, "comment", input.commentId);
      option(args, "content-type", input.contentType);
      option(args, "kind", input.kind);
      break;
    case "attachment_download":
      args.push("attachment", "download", String(input.attachmentId ?? ""));
      option(args, "output", input.output);
      break;
    case "cloud_status":
      args.push("cloud", "status");
      break;
    case "cloud_logout":
      args.push("cloud", "logout");
      break;
    default:
      throw new Error(`Unsupported Taskboard MCP tool: ${name}`);
  }
  return args;
}

function captureStream() {
  let value = "";
  return {
    write(chunk) {
      value += String(chunk);
      return true;
    },
    get value() {
      return value;
    },
  };
}

function parseTaskctlOutput(stdout, stderr, exitCode) {
  const text = stdout.value.trim();
  if (exitCode !== 0) {
    let error;
    try { error = JSON.parse(stderr.value.trim()); } catch { error = null; }
    throw new Error(error?.error?.message || stderr.value.trim() || `taskctl exited with ${exitCode}`);
  }
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { text }; }
}

function openLoginPage(rawUrl) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return false;
  const url = new URL(rawUrl);
  const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new Error("Login page must use HTTPS (or loopback HTTP)");
  }
  const command = process.platform === "win32"
    ? "explorer.exe"
    : process.platform === "darwin" ? "open" : "xdg-open";
  const child = spawn(command, [url.href], { detached: true, stdio: "ignore", windowsHide: true });
  child.unref?.();
  return true;
}

function mcpToolDefinitions() {
  return TOOLS.map(([name, description]) => ({
    name,
    description,
    inputSchema: { type: "object", additionalProperties: true },
  }));
}

let leaseSocket = null;
let bridgeChild = null;
let bridgeUrl = null;
let cleanedUp = false;

async function ensureBridge() {
  if (leaseSocket && leaseSocket.readyState === WebSocket.OPEN) return;
  const environment = {
    ...process.env,
    CODEX_TASKBOARD_DATA_DIR: process.env.CODEX_TASKBOARD_DATA_DIR || dataDirectory(process.env),
    CODEX_TASKBOARD_SKILL_PATH: process.env.CODEX_TASKBOARD_SKILL_PATH || path.join(skillRoot, "SKILL.md"),
  };
  bridgeUrl = bridgeBaseUrl(environment);
  bridgeChild = await startBridge(bridgeUrl, environment);
  leaseSocket = await openLease(bridgeUrl);
  leaseSocket.on("close", () => { leaseSocket = null; });
}

async function callTaskctl(name, input) {
  await ensureBridge();
  if (name === "cloud_login") {
    const opened = openLoginPage(input.remoteUrl);
    return {
      mode: "login_required",
      url: input.remoteUrl || null,
      opened,
      message: "请在本机 Taskboard 页面完成登录，密码不会作为 MCP 工具参数传递给模型。",
    };
  }
  const stdout = captureStream();
  const stderr = captureStream();
  const agent = process.env.TASKBOARD_AGENT_KIND || "codex";
  const environment = {
    ...process.env,
    CODEX_TASKBOARD_COMPANION_URL: bridgeUrl.href.replace(/\/$/, ""),
    CODEX_TASKBOARD_DATA_DIR: process.env.CODEX_TASKBOARD_DATA_DIR || dataDirectory(process.env),
    CODEX_TASKBOARD_SKILL_PATH: process.env.CODEX_TASKBOARD_SKILL_PATH || path.join(skillRoot, "SKILL.md"),
    TASKBOARD_AGENT_KIND: agent,
  };
  const exitCode = await taskctlMain(["--agent", agent, ...toolArgs(name, input)], {
    env: environment,
    stdout,
    stderr,
  });
  return parseTaskctlOutput(stdout, stderr, exitCode);
}

async function cleanup() {
  if (cleanedUp) return;
  cleanedUp = true;
  leaseSocket?.close();
  leaseSocket = null;
  bridgeChild?.unref?.();
  bridgeChild = null;
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function resultFor(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value) }],
    structuredContent: value,
  };
}

async function handle(message) {
  if (!message || typeof message !== "object") return;
  if (message.method === "notifications/initialized" || message.method === "notifications/cancelled") return;
  if (message.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "taskboard-mcp", version: "1.0.0" },
      },
    });
    return;
  }
  if (message.method === "ping") {
    send({ jsonrpc: "2.0", id: message.id, result: {} });
    return;
  }
  if (message.method === "tools/list") {
    send({ jsonrpc: "2.0", id: message.id, result: { tools: mcpToolDefinitions() } });
    return;
  }
  if (message.method === "tools/call") {
    try {
      const name = message.params?.name;
      if (!TOOLS.some(([toolName]) => toolName === name)) throw new Error(`Unknown Taskboard MCP tool: ${name}`);
      const value = await callTaskctl(name, message.params?.arguments ?? {});
      send({ jsonrpc: "2.0", id: message.id, result: resultFor(value) });
    } catch (error) {
      send({
        jsonrpc: "2.0",
        id: message.id,
        result: {
          isError: true,
          content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
        },
      });
    }
    return;
  }
  if (message.id !== undefined) {
    send({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: `Method not found: ${message.method}` },
    });
  }
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
  let newline;
  while ((newline = input.indexOf("\n")) >= 0) {
    const line = input.slice(0, newline).trim();
    input = input.slice(newline + 1);
    if (!line) continue;
    let message;
    try { message = JSON.parse(line); } catch {
      send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Invalid JSON" } });
      continue;
    }
    handle(message).catch((error) => {
      if (message.id !== undefined) {
        send({ jsonrpc: "2.0", id: message.id, error: { code: -32603, message: String(error) } });
      }
    });
  }
});
process.stdin.on("end", async () => {
  await cleanup();
  process.exit(0);
});
process.once("SIGINT", async () => { await cleanup(); process.exit(0); });
process.once("SIGTERM", async () => { await cleanup(); process.exit(0); });
