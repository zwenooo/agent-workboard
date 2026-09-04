# Cloud collaboration

Codex Taskboard can run as a shared Cloudflare deployment for a small team:

- one Worker serves the built UI and the JSON API;
- D1 is the authoritative business database;
- a private R2 bucket stores attachments;
- browser access uses individual member accounts and secure HTTP-only sessions;
- `taskctl` and the local companion use the same individual username and password through HTTPS Basic Authentication;
- `/health`, the login page, and the authentication status route are public;
- one SQLite-backed Durable Object broadcasts revision changes over hibernating WebSockets;
- open boards refresh when a revision event arrives; reconnects perform one revision check and never poll periodically.

The production resource names are:

| Resource | Name |
| --- | --- |
| Worker | `codex-taskboard` |
| D1 database | `codex-taskboard-db` |
| R2 bucket | `codex-taskboard-attachments` |
| Durable Object class | `RealtimeHub` |

Members are stored in D1 with a unique username, display name, role, active state, and an individually salted PBKDF2-SHA256 password hash. Administrators can create accounts, reset passwords, change roles, and disable members. Disabling a member or resetting a password revokes that member's existing browser sessions. Taskboard currently has two roles: administrators manage members, while both administrators and members can read and write board data.

## What stays local

The cloud stores project, issue, comment, relation, and attachment data. It does not store a device's absolute project or worktree paths.

Each collaborator runs the **local companion**: a **device-local loopback service** (not a chat persona) for Codex, Git/worktree scanning, installed Skill/MCP discovery, and project path mapping. After password verification, the companion keeps the cloud URL, account username, a revocable access token, and device-specific project mappings in `.data/cloud-companion.json` with mode `0600`; it does not persist the member password. Ordinary Taskboard HTTP routes (tasks, comments, attachments) are the shared API; they are not a separate “companion API”.

When cloud mode is active, the cloud is the only business-data source. A failed cloud request fails visibly. The companion does not fall back to the local SQLite database and does not write to both databases. `taskctl cloud logout` returns that device to its separate local mode; it does not merge local and cloud data.

## Owner: validate locally

Install dependencies and build the frontend:

```bash
npm ci
npm run build:web
```

Create an ignored `.dev.vars` file containing a local-only bootstrap value for `TASKBOARD_SHARED_SECRET`, apply the D1 migration to Wrangler's local state, and start the Worker:

```bash
npm run cloud:migrate:local
npm run dev:cloud
```

Open the printed loopback URL. The first-run page asks for the bootstrap value from `.dev.vars`, then creates the first administrator account. After that account exists, the bootstrap value cannot be used to sign in.

Local Wrangler state lives under `.wrangler/` and is not committed.

## Owner: deploy

Authenticate Wrangler first:

```bash
npx wrangler login
npx wrangler whoami
```

Provision the production D1 database and private R2 bucket using the exact names above.

```bash
npx wrangler d1 create codex-taskboard-db
npx wrangler r2 bucket create codex-taskboard-attachments
```

`wrangler.jsonc` contains one production configuration and identifies the D1 binding by its resource name and `database_id`. A D1 database ID is public metadata and does not grant access, so it can be committed. Wrangler local development creates persistent local equivalents under `.wrangler/`; those are local simulations, not additional Cloudflare environments.

Apply the remote D1 migration and validate the deployment bundle:

```bash
npm run cloud:migrate
npm run cloud:deploy:dry-run
```

Set a one-time bootstrap secret through Wrangler's private interactive prompt after the database schema is ready. Do not put the value in `wrangler.jsonc`, a shell command, a log, or a committed file. Then deploy the production Worker:

```bash
npx wrangler secret put TASKBOARD_SHARED_SECRET
npm run cloud:deploy
```

These commands create or update Cloudflare resources. This repository contains the production D1 database ID for the binding, but it does not contain the bootstrap secret, member passwords, or any API or OAuth token. Keep those credentials out of Git; cloning the repository does not grant access or mean the Worker has already been deployed.

Open the deployed Worker URL and create the first administrator with the bootstrap secret. From **Members & account**, create a separate account for every collaborator and share each initial password through a trusted channel. Never publish member passwords in the repository, an issue, or logs.

Current Cloudflare references:

- [Workers Static Assets binding](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Durable Objects with WebSocket Hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [Create an R2 bucket](https://developers.cloudflare.com/r2/buckets/create-buckets/)
- [Workers secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## Member: connect an existing GitHub installation

The owner follows this device setup too, using the owner's own account and checkout path. A member does not need your local database or your filesystem paths. They update their existing clone and build the current UI:

```bash
git pull --ff-only
npm ci
npm run build:web
```

Configure cloud mode. The first bundled `taskctl` command silently starts the loopback companion when it is not already running, so there is no separate startup command. Use the deployed HTTPS Worker origin, pass the member's exact account username to `--actor-name`, and enter that member's password only at the private `Account password:` prompt:

```bash
npm run taskctl -- cloud login \
  --url https://YOUR-WORKER-ORIGIN \
  --actor-name "MEMBER-USERNAME"

npm run taskctl -- cloud status
npm run taskctl -- project list
```

The account password is validated against the Worker before the companion saves the configuration. It is not part of the command and is not echoed by the prompt.

Run `CODEX_TASKBOARD_HOST=127.0.0.1 npm start` only when foreground companion logs are needed.

For every cloud project used with an Agent, open the local companion, select that project, then use **Link folder** beside **Local Agent connected** and choose the checkout through the system folder selector. The owner follows the same steps on the owner's device. Mappings are intentionally different on each device and are never synchronized to D1.

`taskctl project map` remains available for headless machines and scripted setup, but members do not need it for normal desktop use.

Launch the injected Codex window:

```bash
CODEX_TASKBOARD_HOST=127.0.0.1 npm run codex
```

`npm run codex` reuses or starts the loopback companion. Keep it running while using the embedded board. The companion supplies local Codex/Git/Skill/MCP capabilities and sends its revocable access token to the Worker in the HTTPS `Authorization` header. The member password is used only for the initial token exchange and is not persisted, written to D1 or R2, returned to the browser UI, or printed in logs. Device paths also stay off Cloudflare.

Do not point `CODEX_TASKBOARD_URL` directly at the cloud origin for this workflow. `taskctl` talks to the loopback companion, which applies Basic Authentication and the device's local project mapping. If the companion uses a non-default loopback port, set `CODEX_TASKBOARD_COMPANION_URL` to that loopback origin.

## Browser-only access

Every member can open the deployed HTTPS Worker URL directly and sign in through the Taskboard login page with their own username and password. The browser receives a secure, HTTP-only, same-site session cookie; the password is not stored in browser-accessible storage.

The browser view supports the shared board and attachments. Device-only Codex, Git/worktree, Skill, and MCP capabilities still require the local companion.

## Reset or revoke member access

An administrator opens **Members & account** in the Taskboard sidebar. Resetting a password immediately revokes that member's existing browser sessions; the member then reruns `taskctl cloud login` with the new password. Disabling the member also revokes sessions and rejects browser and `taskctl` login until the account is enabled again.

Members can change their own password from the same panel after entering the current password. The final active administrator cannot be disabled or demoted.

## Advanced: one-time import of existing local data

The migration tool takes a consistent SQLite snapshot with `VACUUM INTO`, removes structured device-only paths, exports attachment hashes, and writes a private bundle. The default local paths are:

```bash
npm run cloud:data -- export \
  --database .data/taskboard.sqlite \
  --attachments .data/attachments \
  --output cloud-migration-exports/initial
```

The output directory contains issue content and attachment bytes. It is mode-restricted and ignored by Git, but it must still be handled as private data. This export is optional when starting with an empty cloud board.

Before importing, authenticate Wrangler, provision the named D1 and R2 resources, and run `npm run cloud:migrate` so the remote D1 schema exists. The target D1 must contain no projects, and none of the bundle's attachment keys may already exist in R2. Import refuses a non-empty target instead of merging or overwriting it.

Run the one-time Wrangler adapter with an explicit remote-operation acknowledgement:

```bash
TASKBOARD_MIGRATION_REMOTE=1 npm run cloud:data -- import \
  --bundle cloud-migration-exports/initial \
  --adapter ./scripts/wrangler-cloud-adapter.mjs

TASKBOARD_MIGRATION_REMOTE=1 npm run cloud:data -- verify \
  --bundle cloud-migration-exports/initial \
  --adapter ./scripts/wrangler-cloud-adapter.mjs
```

`TASKBOARD_MIGRATION_REMOTE=1` is a deliberate safety gate for these two commands. The adapter uses the current Wrangler login and the production resource names from `wrangler.jsonc`; it does not add a migration HTTP endpoint or store Cloudflare credentials. The commands are not run automatically by deployment, so having the repository does not mean data has already been imported.

The adapter has a local-persistence integration test that does not access remote Cloudflare resources:

```bash
node --test test/cloud-migration.test.mjs
```
