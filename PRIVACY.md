# Privacy

Codex Taskboard is a Web application. It does not include advertising or a
project-maintainer analytics service.

## Local data

When run locally, the Node.js service stores its SQLite database and
attachments in `.data/` by default. The location can be changed with
`CODEX_TASKBOARD_DATA_DIR`.

## Cloud data

Cloud collaboration is optional. A Cloudflare deployment stores Taskboard data
in the D1 database and R2 bucket selected by the deployment owner. Browser
sessions and `taskctl` credentials are sent only to that configured deployment.

## Network activity

- The browser connects to the local service or Cloudflare Worker selected by
  the user.
- Optional Codex integration communicates with the user's local Codex runtime.
- The official Codex application and Codex CLI use OpenAI services under the
  user's existing OpenAI account and OpenAI's terms.

## Removing data

Delete the configured local data directory to remove local Taskboard data.
Cloud deployment owners can remove the configured D1 database and R2 bucket
through Cloudflare.
