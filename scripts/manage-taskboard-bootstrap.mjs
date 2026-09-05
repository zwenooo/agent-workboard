#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const mcpCommand = path.resolve(scriptDirectory, "taskboard-mcp.mjs");

function homePath(...parts) {
  return path.join(os.homedir(), ...parts);
}

function agentKind(argv, environment = process.env) {
  const index = argv.indexOf("--agent");
  return (index >= 0 ? argv[index + 1] : environment.TASKBOARD_AGENT_KIND || "").trim().toLowerCase();
}

function tomlString(value) {
  return JSON.stringify(String(value));
}

function codexBlock() {
  return [
    "[mcp_servers.taskboard]",
    "type = \"stdio\"",
    `command = ${tomlString(process.execPath)}`,
    `args = [${tomlString(mcpCommand)}]`,
    "",
  ].join("\n");
}

function upsertCodex(text) {
  const block = codexBlock();
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "[mcp_servers.taskboard]");
  if (start >= 0) {
    let end = start + 1;
    while (end < lines.length && !/^\s*\[/.test(lines[end])) end += 1;
    lines.splice(start, end - start, ...block.trimEnd().split("\n"));
    return `${lines.join("\n").trimEnd()}\n`;
  }
  return `${text.trimEnd()}\n\n${block}`;
}

async function readJson(filePath) {
  try {
    const value = JSON.parse(await readFile(filePath, "utf8"));
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    throw error;
  }
}

async function upsertJson(filePath) {
  const value = await readJson(filePath);
  const mcpServers = value.mcpServers && typeof value.mcpServers === "object"
    && !Array.isArray(value.mcpServers) ? value.mcpServers : {};
  value.mcpServers = {
    ...mcpServers,
    taskboard: { type: "stdio", command: process.execPath, args: [mcpCommand] },
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

async function upsertCodexConfig(filePath) {
  let text = "";
  try { text = await readFile(filePath, "utf8"); } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, upsertCodex(text), { mode: 0o600 });
}

const kind = agentKind(process.argv.slice(2));
let configPath;
if (kind === "codex") {
  configPath = process.env.CODEX_HOME
    ? path.join(process.env.CODEX_HOME, "config.toml")
    : homePath(".codex", "config.toml");
  await upsertCodexConfig(configPath);
} else if (kind === "claude-code" || kind === "claude") {
  configPath = homePath(".claude.json");
  await upsertJson(configPath);
} else if (kind === "pi") {
  configPath = homePath(".pi", "mcp.json");
  await upsertJson(configPath);
} else {
  throw new Error("Use --agent codex, --agent claude-code, or --agent pi");
}

process.stdout.write(`${JSON.stringify({
  agent: kind === "claude" ? "claude-code" : kind,
  configPath,
  command: process.execPath,
  args: [mcpCommand],
  changed: true,
})}\n`);
