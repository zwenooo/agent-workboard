# Manage Taskboard Skill 与 stdio MCP 改造需求

文档状态：需求草案
更新时间：2026-09-06

## 1. 背景

当前 `$manage-taskboard` Skill 通过 `taskctl` 启动本机 companion，并由 companion 提供云端 Taskboard 代理、本机项目目录映射、Git/Codex 能力和网页环回接口。

现有实现已经能够在第一次调用 `taskctl` 时静默启动 companion，但 companion 使用 `detached` 和 `unref` 与调用进程解除关联。退出 Codex、Claude Code 或 Pi 后，本机服务仍会继续运行，需要用户手动结束。

本次改造将 Agent 集成入口调整为 stdio MCP。MCP 负责感知 Agent 生命周期，本机 HTTP bridge 继续承载网页环回和设备能力，但不再作为需要用户安装、启动或管理的独立产品。

## 2. 产品目标

用户只需要安装一个 `manage-taskboard` Skill，即可在支持的 Agent 中使用云端 Taskboard 和本机能力。

目标体验：

```text
安装 manage-taskboard Skill
→ 首次调用 Skill
→ 自动完成当前 Agent 的 MCP 配置
→ Agent 启动 Skill 内置的 stdio MCP
→ 第一次 Taskboard 工具调用时静默启动本机 HTTP bridge
→ 正常读取、领取、更新和评论任务
→ 退出最后一个正在使用 Taskboard 的 Agent
→ stdio MCP 连接关闭
→ 本机 HTTP bridge 自动退出
```

用户不得被要求执行以下操作：

- 安装全局 `taskctl`；
- 运行 `npm install`、`npm link` 或仓库构建命令；
- 单独下载或安装 companion；
- 手动启动本机服务；
- 手动配置端口；
- 为启动服务打开常驻终端窗口；
- 将本机项目路径上传到云端。

## 3. 非目标

本次改造不包括：

- 修改 Taskboard 云端业务数据模型；
- 重做云端任务板页面；
- 将设备目录、Git worktree 路径或本机 Agent 信息同步到 Cloudflare；
- 建设通用 MCP 网关；
- 强制移除 `taskctl`。`taskctl` 可继续作为调试、CI 和不支持 MCP 的 Agent 的兼容入口；
- 让普通浏览器在没有任何本机 Agent 运行时自行启动操作系统进程。

## 4. 术语与职责

### 4.1 Skill

`manage-taskboard` Skill 是用户安装和分发的唯一单元，负责：

- 描述任务领取、状态流转、评论、附件和验收工作流；
- 选择 Taskboard MCP 工具，而不是要求 Agent 猜测 HTTP API；
- 携带 MCP Server、本机 bridge、网页资源和首次配置脚本；
- 根据当前 Agent 选择对应的 MCP 配置适配器。

### 4.2 stdio MCP Server

`taskboard-mcp` 是由 Agent 作为子进程启动的 MCP Server，负责：

- 通过 stdin/stdout 与 Agent 交换 MCP JSON-RPC 消息；
- 暴露结构化的 Taskboard 工具；
- 第一次实际工具调用时确保本机 HTTP bridge 已启动；
- 在存活期间持有本机 bridge 的 Agent 租约；
- 在 stdin EOF、`SIGINT`、`SIGTERM` 或进程退出时释放租约；
- 将日志写入 stderr，绝不向 stdout 写入 MCP 协议之外的内容。

Agent 可以在自身启动阶段预热 MCP Server。产品要求的“按需启动”特指本机 HTTP bridge：在用户尚未调用 Taskboard 工具前，不监听本机端口、不启动完整 companion 能力。

### 4.3 本机 HTTP bridge

本机 HTTP bridge 是原 companion 的设备侧运行能力，负责：

- 监听 `127.0.0.1`，供 `dev.codezsy.com` 和本机 MCP 使用；
- 保存云端访问令牌和设备专属项目目录映射；
- 代理云端 Taskboard API；
- 提供文件夹选择、Git/worktree 扫描、Codex 打开和本机状态能力；
- 管理来自多个 stdio MCP 进程的存活租约；
- 最后一个 Agent 租约释放且没有进行中的请求后自动退出。

bridge 不是用户需要单独安装或管理的 companion 产品。界面和文档可以继续使用“本机服务”或“本机连接”，不向普通用户暴露进程、端口和运行命令。

### 4.4 taskctl

`taskctl` 与 MCP 共用同一套 Taskboard 客户端和本机服务代码。它保留用于：

- CI 和自动化脚本；
- MCP 不可用时的诊断；
- 无 MCP 支持的 Agent；
- 开发者显式选择的命令行工作流。

普通 Skill 路径优先调用 MCP，不再通过一次性 shell 命令直接管理 companion 生命周期。

## 5. 真实操作路径

### 5.1 首次安装

```text
用户复制或安装 manage-taskboard Skill
→ Skill 首次运行配置脚本
→ 识别 codex / claude-code / pi / 其他受支持 Agent
→ 将 Skill 内 taskboard-mcp 的绝对命令写入该 Agent 的用户级 MCP 配置
→ 若 Agent 支持热加载则立即连接，否则明确提示只需重启一次 Agent
→ 不安装任何全局包
```

首次配置必须可重复执行。已存在且指向同一 Skill 版本的配置不得重复添加；指向旧 Skill 路径的配置应更新为当前路径。

### 5.2 日常使用

```text
用户要求 Agent 查看或处理 Taskboard 任务
→ manage-taskboard Skill 被选择
→ Agent 调用 taskboard-mcp 工具
→ MCP 懒启动或复用本机 HTTP bridge
→ MCP 注册并保持当前 Agent 租约
→ bridge 访问云端 API或本机能力
→ MCP 返回结构化结果
→ 用户看到任务或操作结果
```

### 5.3 Agent 退出

```text
用户退出一个 Agent 客户端
→ Agent 关闭 stdio 或终止 taskboard-mcp
→ MCP 与 bridge 的租约连接断开
→ bridge 删除该 Agent 租约
→ 若仍有其他 Agent 租约，bridge 继续运行
→ 若租约为零，等待进行中的请求结束
→ bridge 关闭 127.0.0.1 监听并退出
```

关闭单个对话不等同于退出 Agent 客户端。若 Agent 在多个对话间共享同一个 MCP 进程，bridge 应继续运行，直到该 MCP 宿主进程退出。

## 6. 生命周期要求

### 6.1 启动

- MCP Server 必须由 Agent 以 stdio 子进程方式启动。
- MCP Server 不得使用 `detached` 或 `unref` 脱离 Agent。
- HTTP bridge 必须在第一次 Taskboard 工具调用时才启动。
- 启动过程不得显示终端窗口。
- 同一设备并发启动时只能有一个 bridge 获得监听权；其他 MCP 实例必须连接已有 bridge。
- MCP 工具调用必须等待 bridge 健康检查通过后再继续。

### 6.2 租约

- 每个 stdio MCP 进程持有一个独立、不可伪造的 Agent 租约。
- 租约必须通过持续连接维持，不能只依靠进程启动时写入 PID 文件。
- MCP 正常退出、异常终止或 Agent 被强制关闭时，操作系统关闭连接，bridge 必须识别租约失效。
- 网页连接不计为 Agent 租约。最后一个 Agent 退出后，网页的本机能力应变为断开状态，而不是让 bridge 永久驻留。
- 租约只用于本机生命周期，不上传云端。

### 6.3 退出

- 最后一个 Agent 租约释放后，bridge 不再接受新的业务请求。
- 已开始的文件写入、附件传输或云端变更请求完成后再退出。
- 无进行中请求时，bridge 应在 5 秒内关闭监听端口并退出进程。
- Agent 或 MCP 崩溃后不得留下永久 companion 进程。
- 下一次调用 Skill 时必须能够重新启动，并复用原有登录状态和目录映射。

## 7. 多 Agent 行为

Codex、Claude Code 和 Pi 可以同时连接同一台设备上的 bridge：

```text
Codex MCP ──────┐
Claude MCP ─────┼─ Agent leases ─→ local bridge :47823 ─→ dev.codezsy.com
Pi MCP ─────────┘
```

要求：

- 每个 Agent 使用自身真实的类型和会话标识；
- 一个 Agent 退出不得中断其他 Agent；
- bridge 不绑定到第一个启动它的 Agent；
- 最后一个租约释放后才退出；
- Agent 重新启动后创建新租约，不复用已经失效的租约；
- 并发首次启动必须使用端口绑定和本机锁避免生成多个 bridge。

## 8. MCP 工具范围

MCP 工具应覆盖当前 `taskctl` 的主要能力，并使用稳定的结构化输入输出：

- `context_current`
- `project_list`
- `project_map`
- `project_readme_get`
- `project_readme_set`
- `issue_list`
- `issue_get`
- `issue_create`
- `issue_update`
- `issue_move`
- `issue_tree`
- `issue_relation_add`
- `issue_relation_remove`
- `comment_list`
- `comment_add`
- `comment_update`
- `comment_delete`
- `attachment_list`
- `attachment_upload`
- `attachment_download`
- `cloud_status`
- `cloud_login`
- `cloud_logout`

所有工具返回可消费的 JSON 对象。议题标识符、乐观版本、Agent 类型、线程绑定和状态规则继续遵循现有 Skill。

登录密码不得作为普通 MCP 工具参数发送给模型。`cloud_login` 应打开受信任的本机或云端登录页面，让用户直接输入凭据；MCP 只接收登录成功状态和可撤销令牌。

## 9. 本机数据与安全边界

- 本机数据存放在当前用户的应用数据目录，不写入 Skill 安装目录。
- 云端访问令牌、项目目录映射和 bridge 实例密钥必须限制为当前用户可读。
- 不持久化账户密码。
- 不向模型输出访问令牌、密码或 bridge 实例密钥。
- bridge 仅绑定 loopback 地址，不监听局域网地址。
- 网页访问必须校验允许的来源、实例令牌和请求方法。
- 只有明确允许的 `dev.codezsy.com` 来源可以调用网页桥接能力。
- 云端 API 不得返回设备绝对路径。
- MCP stdout 只承载协议消息，诊断信息写入 stderr。

## 10. Skill 包结构

建议结构：

```text
manage-taskboard/
├─ SKILL.md
├─ agents/
├─ references/
├─ scripts/
│  ├─ bootstrap.mjs
│  ├─ taskboard-mcp.mjs
│  ├─ taskctl.mjs
│  └─ bridge.mjs
└─ dist/
   └─ web/
```

要求：

- Skill 目录包含运行所需代码和页面资源；
- 不依赖 Taskboard 仓库相对路径；
- 不在首次使用时执行包管理器安装；
- 优先使用当前 Agent 自带的兼容 Node.js 运行时；
- 构建流程必须从仓库源码重新生成 Skill 内的运行文件，避免手工复制导致版本漂移。

## 11. Agent 配置适配

首次配置脚本至少支持：

- Codex 用户级 MCP 配置；
- Claude Code 用户级 MCP 配置；
- Pi 可用的 MCP 扩展或配置入口。

适配器必须：

- 使用当前 Skill 内 `taskboard-mcp.mjs` 的绝对路径；
- 保留用户已有的其他 MCP 配置；
- 重复执行不生成重复条目；
- 配置失败时给出当前 Agent 对应的一条明确修复指令；
- 不把某一种 Agent 伪装成另一种 Agent。

Pi 的原生 MCP 能力、配置格式和热加载能力必须在实现前通过当前版本实际验证；如果 Pi 需要扩展适配，该扩展随 Skill 一起提供，不要求用户再寻找第三方组件。

## 12. 迁移方向

### 阶段一：MCP 与租约基础

- 增加 stdio `taskboard-mcp`；
- MCP 工具先复用现有 Taskboard 客户端逻辑；
- 为本机 bridge 增加持续租约接口和零租约退出；
- 保留现有 `taskctl` 作为兼容入口。

### 阶段二：Skill 首次配置

- 增加 Agent 检测和 MCP 配置适配器；
- 将 Skill 主路径改为优先调用 MCP；
- 对不支持热加载的 Agent 提示一次重启；
- 验证从独立复制的 Skill 目录运行，不引用仓库文件。

### 阶段三：移除永久 detached 路径

- 普通 Skill 使用不再通过 `taskctl` 启动永久 detached companion；
- bridge 仅接受由 MCP 租约管理的后台启动；
- 明确保留的开发和 CLI 模式可以前台运行或使用显式生命周期参数；
- 更新中英文安装和云端协作文档。

## 13. 验收标准

### 13.1 单 Agent

- 在一台没有全局 `taskctl`、没有 Taskboard 仓库依赖的机器上，只安装 Skill。
- 首次调用 Skill 后，当前 Agent 可以列出云端项目和任务。
- 本机服务静默启动，没有终端窗口闪现。
- 登录凭据和项目目录映射不写入 Skill 目录。
- 退出整个 Agent 客户端后，stdio MCP 退出。
- 没有进行中请求时，`127.0.0.1:47823` 在 5 秒内停止监听。
- 再次启动 Agent 并调用 Skill，服务能够重新启动并保留登录状态与目录映射。

### 13.2 多 Agent

- 同时启动两个不同 Agent 并分别调用 Taskboard 工具，只运行一个本机 bridge。
- 退出其中一个 Agent，另一个 Agent 的 MCP 调用和网页本机能力继续正常。
- 退出最后一个 Agent后，bridge 在 5 秒内退出。
- 强制终止某个 Agent 后，其租约能够自动释放。

### 13.3 云端网页

- Agent 和 bridge 运行时，`dev.codezsy.com` 能识别本机连接并使用本机目录映射。
- 最后一个 Agent 退出后，网页显示本机连接断开。
- 网页无法启动任意 shell 命令，只能调用 bridge 暴露的允许能力。
- 非允许来源不能访问本机 bridge。

### 13.4 兼容入口

- `taskctl` 主要命令继续可用。
- CI 和显式前台开发模式不依赖 Agent 租约。
- 旧的登录令牌和本机目录映射无需上传云端即可继续使用。

## 14. 实现前必须确认的客户端事实

开始跨 Agent 适配前，需要在目标版本上分别验证：

- Codex 的 MCP 用户配置位置、启动命令和热加载行为；
- Claude Code 的 MCP 用户配置位置、启动命令和退出行为；
- Pi 是否原生支持 MCP；若不支持，最小扩展适配方式；
- 三种 Agent 退出时是否都会关闭 stdio，还是需要额外处理终止信号；
- Windows、macOS 和 Linux 上隐藏子进程窗口与进程退出行为。

这些验证只决定适配实现，不改变已经确定的产品要求：用户只安装 Skill、本机服务按需启动、最后一个 Agent 退出后停止。
