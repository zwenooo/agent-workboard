import { cp, copyFile, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(projectRoot, "skills", "manage-taskboard");
const scriptsDirectory = path.join(skillRoot, "scripts");
const packagedWebDirectory = path.join(skillRoot, "dist", "web");
const builtWebDirectory = path.join(projectRoot, "dist", "web");

await stat(path.join(builtWebDirectory, "index.html"));
await Promise.all([
  rm(scriptsDirectory, { recursive: true, force: true }),
  rm(path.join(skillRoot, "dist"), { recursive: true, force: true }),
]);
await mkdir(scriptsDirectory, { recursive: true });

const bundleOptions = {
  bundle: true,
  format: "esm",
  legalComments: "none",
  platform: "node",
  target: "node22",
};

await Promise.all([
  build({
    ...bundleOptions,
    entryPoints: [path.join(projectRoot, "cli", "taskctl.mjs")],
    outfile: path.join(scriptsDirectory, "taskctl.mjs"),
  }),
  build({
    ...bundleOptions,
    banner: {
      js: 'import { createRequire as __taskboardCreateRequire } from "node:module"; const require = __taskboardCreateRequire(import.meta.url);',
    },
    entryPoints: [path.join(projectRoot, "server", "index.mjs")],
    outfile: path.join(scriptsDirectory, "server.mjs"),
  }),
]);

await Promise.all([
  copyFile(
    path.join(projectRoot, "server", "ai-turn-owner.mjs"),
    path.join(scriptsDirectory, "ai-turn-owner.mjs"),
  ),
  copyFile(
    path.join(projectRoot, "server", "codex-slash-commands-0.139.0.json"),
    path.join(scriptsDirectory, "codex-slash-commands-0.139.0.json"),
  ),
  cp(builtWebDirectory, packagedWebDirectory, { recursive: true }),
]);
