# workspace-files-explorer

[English](#english) · [中文](#中文)

> Workspace file explorer plugin for the DeepSeek Harness (dsh) Web GUI: browse the file tree of the current session's workspace (cwd) in a floating panel; click a file to preview it — code files with line numbers and syntax highlighting, Markdown files rendered as rich text.
>
> DeepSeek Harness（dsh）Web GUI 的工作区文件浏览器插件：在浮层面板中浏览当前会话工作区（cwd）的文件树，点击文件即可预览——代码文件带行号与语法高亮，Markdown 文件渲染为富文本。

![文件预览效果 1](./images/%E6%96%87%E4%BB%B6%E9%A2%84%E8%A7%88%E6%95%88%E6%9E%9C%E5%9B%BE_1.png)

![文件预览效果 2](./images/%E6%96%87%E4%BB%B6%E9%A2%84%E8%A7%88%E6%95%88%E6%9E%9C%E5%9B%BE_2.png)

## English

[中文](#中文) · [← Back to DeepSeekHarnessPlugins](../README.md)

### Features

- **Floating file panel**: registered on `shell.overlay`, additive registration — replaces no built-in UI; docks at the top right by default
- **File tree**: lazy-loaded expansion, directories first, hidden files (dot-prefixed) dimmed, file sizes shown, truncation notice at 500 items per directory, one-click refresh
- **Code preview**: line numbers + lightweight syntax highlighting (30+ languages by extension: JS/TS/Python/Go/Rust/Java/C#/PHP/Bash/SQL/JSON/YAML/CSS/HTML…), auto-adapts to light/dark themes, oversized files truncated
- **Markdown preview**: headings / lists / tables / quotes / links / code blocks rendered, embedded code blocks highlighted too; the whole HTML is escaped before rendering, links only allow http/https and enforce `rel="noopener noreferrer"`
- **Panel interaction**: drag the title bar to move, drag the bottom-right corner to resize (400–1400 × 280–900), close / refresh
- **Session header button**: a "Workspace Files" button in the title-bar action area (lit = panel open), toggles visibility on click
- **Follows the session**: the workspace root comes from the current session's `cwd` (standard `useSessions` hook); switching sessions resets the panel and loads the new workspace automatically

### Installation (dsh.bundle)

This repo is also an installable dsh plugin package (`package.json` declares `dsh.bundle` + `dsh.client`):

```sh
dsh plugin --profile web add github:YZz-S/dsh-workspace-files-explorer
```

After installation, the "Workspace Files" button appears in the session title-bar action area and the floating panel takes effect automatically. The dynamic usage (`cordis_define` loading `host.js` / `client.js`) is kept; pick either one.

### Files

| File | Description |
| --- | --- |
| `index.js` | Host half (installed form): `webServer` routes `/api/wsf-explorer/*`, read-only file browsing API |
| `lib/client.js` | Client half (installed form): `__ModuleLoader__` browser module, calls Host routes via `fetch` |
| `cordis.patch.yml` | Bundle patch: inserts the plugin row into the dsh composition |
| `host.js` | Host half (dynamic form): for `cordis_define`, package-private RPC via `harness.handle` |
| `client.js` | Client half (dynamic form): for `cordis_define`, calls Host via `host.call` |
| `README.md` | This document |
| `LICENSE` | MIT license |
| `package.json` | Package metadata + `dsh.bundle` / `dsh.client` declarations |

### Usage

#### Method 1: dynamic Cordis plugin (temporary)

Define and run in a dsh Web GUI session with the Cordis tools:

1. Call `cordis_define`: paste `host.js` content as `code.host` and `client.js` content as `code.client` (`plugin.kind: 'new'`, `idPrefix` of 3–6 lowercase letters)
2. Call `cordis_run` to activate and allow authorization in the UI
3. The panel opens by default; the "Workspace Files" button appears on the right of the title bar to toggle visibility

> Note: a dynamic plugin lives as long as the current dsh process. After restarting dsh you must define and run it again.

#### Method 2: installable plugin (persistent)

See "Installation (dsh.bundle)" above: `dsh plugin --profile web add github:YZz-S/dsh-workspace-files-explorer` — the plugin persists with the profile, no manual run needed each time.

### How It Works

- **Workspace root**: the Client reads the current session's `cwd` via the standard hook `useSessions((s) => s)` and passes it to the Host on every request; falls back to `sandboxPolicy.workspaceRoot` when there is no session
- **Host is read-only**: uses only `fs`'s `resolve` / `stat` / `listDir` / `readText` / `contains` / `processPath` — no writes at all; every path must pass `fs.contains` verification to stay inside the workspace
- **Preview safety**: code and Markdown content are HTML-escaped before rendering; Markdown links only allow `http/https` and enforce `rel="noopener noreferrer"`; raw HTML never passes through
- **Limits**: text preview 256 KB, code rendering 2000 lines, Markdown rendering 4000 lines, directory listing 500 items — friendly notices beyond the limits

### Privacy

- Only reads files and directory listings inside the current session's workspace — **no external network requests, no file writes, no telemetry, no persistent storage**
- Any path outside the workspace boundary is rejected (`path outside the workspace`)

### Known Limitations

- Binary files and text over 256 KB only show a notice, no preview
- Syntax highlighting is a built-in lightweight implementation (keywords / strings / comments / numbers), not full semantic highlighting
- The panel button is registered in the session header action area; blank new sessions (no title bar) do not show the button, but the panel still opens by default
- The dynamic plugin is process-level: after a restart you must run it again

### Pre-Release Checklist

- [x] No hard-coded keys / tokens / passwords (patterns like `api[_-]?key`, `secret`, `token`, `password`, private-key headers scanned)
- [x] No personal information (usernames, machine paths, internal IPs, emails); workspace paths come from runtime session state, not baked into the code
- [x] No external network requests, no telemetry, no third-party data collection
- [x] MIT license in place, README complete
- [x] Code uses only dsh plugin public interfaces (Services / webServer / slots / React); all side effects hang on the plugin Fiber and are cleaned up on stop
- [x] Inputs (file names / file contents) are HTML-escaped before rendering; link protocol whitelist + `noopener` — no injection surface

### License

[MIT](./LICENSE)

---

## 中文

[English](#english) · [← 返回 DeepSeekHarnessPlugins](../README.md)

DeepSeek Harness（dsh）Web GUI 的工作区文件浏览器插件：在浮层面板中浏览当前会话工作区（cwd）的文件树，点击文件即可预览——代码文件带行号与语法高亮，Markdown 文件渲染为富文本。

### 功能

- **浮层文件面板**：注册在 `shell.overlay`，加法式注册，不替换任何自带 UI；默认停靠右上角
- **文件树**：懒加载展开、目录优先排序、隐藏文件（点开头）淡化显示、文件大小标注、单目录最多 500 项截断提示、一键刷新
- **代码预览**：行号 + 轻量语法高亮（JS/TS/Python/Go/Rust/Java/C#/PHP/Bash/SQL/JSON/YAML/CSS/HTML 等 30+ 语言按扩展名识别），深浅色主题自适应，超长文件截断
- **Markdown 预览**：标题 / 列表 / 表格 / 引用 / 链接 / 代码块等渲染，内嵌代码块同样高亮；渲染前整体 HTML 转义，链接仅允许 http/https 且强制 `rel="noopener noreferrer"`
- **面板交互**：标题栏拖拽移动、右下角拖拽缩放（400–1400 × 280–900）、关闭 / 刷新
- **会话头部按钮**：标题栏动作区显示「工作区文件」按钮（点亮 = 面板已打开），点击切换显隐
- **跟随会话**：工作区根目录取自当前会话的 `cwd`（`useSessions` 标准 hook），切换会话时面板自动重置并加载新工作区

### 安装（dsh.bundle）

本仓库同时是可安装的 dsh 插件包（`package.json` 声明 `dsh.bundle` + `dsh.client`）：

```sh
dsh plugin --profile web add github:YZz-S/dsh-workspace-files-explorer
```

安装后「会话标题栏动作区」出现「工作区文件」按钮，浮层面板自动生效。
动态用法（`cordis_define` 加载 `host.js` / `client.js`）仍保留，两种方式二选一。

### 文件说明

| 文件 | 说明 |
| --- | --- |
| `index.js` | Host 半部分（安装版）：`webServer` 路由 `/api/wsf-explorer/*`，只读文件浏览 API |
| `lib/client.js` | Client 半部分（安装版）：`__ModuleLoader__` 浏览器模块，`fetch` 调用 Host 路由 |
| `cordis.patch.yml` | bundle 补丁：把插件行插入 dsh 组合 |
| `host.js` | Host 半部分（动态版）：供 `cordis_define` 使用，`harness.handle` 包私有 RPC |
| `client.js` | Client 半部分（动态版）：供 `cordis_define` 使用，`host.call` 调用 Host |
| `README.md` | 本说明 |
| `LICENSE` | MIT 许可证 |
| `package.json` | 包元信息 + `dsh.bundle` / `dsh.client` 声明 |

### 使用方法

#### 方式一：动态 Cordis 插件（临时运行）

在 dsh Web GUI 的会话中，用 Cordis 工具定义并运行：

1. 调用 `cordis_define`：`code.host` 粘贴 `host.js` 的内容，`code.client` 粘贴 `client.js` 的内容（`plugin.kind: 'new'`，`idPrefix` 取 3–6 个小写字母）
2. 调用 `cordis_run` 激活，在界面上允许授权
3. 面板默认打开；标题栏右侧出现「工作区文件」按钮用于切换显隐

> 注意：动态插件的生命周期与当前 dsh 进程相同。重启 dsh 后需重新定义运行。

#### 方式二：可安装插件（常驻）

见上文「安装（dsh.bundle）」：`dsh plugin --profile web add github:YZz-S/dsh-workspace-files-explorer`，插件随 profile 常驻，无需每次手动运行。

### 工作原理

- **工作区根**：Client 端通过标准 hook `useSessions((s) => s)` 读取当前会话的 `cwd`，随每次请求传给 Host；无会话时回退 `sandboxPolicy.workspaceRoot`
- **Host 只读**：仅使用 `fs` 的 `resolve` / `stat` / `listDir` / `readText` / `contains` / `processPath`，无任何写入；所有路径经 `fs.contains` 校验必须位于工作区内
- **预览安全**：代码与 Markdown 内容一律先做 HTML 转义再渲染；Markdown 链接仅允许 `http/https` 协议并强制 `rel="noopener noreferrer"`；原始 HTML 不直通
- **上限**：文本预览 256KB、代码渲染 2000 行、Markdown 渲染 4000 行、目录列表 500 项，超出部分友好提示

### 隐私说明

- 仅读取当前会话工作区内的文件与目录列表，**无外部网络请求、无文件写入、无遥测、无持久化存储**
- 工作区边界外的路径一律拒绝（`路径超出工作区范围`）

### 已知限制

- 二进制文件与超过 256KB 的文本只提示，不预览
- 语法高亮为内置轻量实现（关键字 / 字符串 / 注释 / 数字），非完整语义级高亮
- 面板按钮注册在会话头部动作区；空白新会话（无标题栏）时按钮不显示，面板仍默认打开
- 动态插件为进程级生命周期，重启后需重新运行

### 开源前检查

- [x] 无硬编码密钥 / Token / 密码（已扫描 `api[_-]?key`、`secret`、`token`、`password`、私钥头等模式）
- [x] 无个人信息（用户名、机器路径、内部 IP、邮箱）；工作区路径来自运行时会话状态，未写入代码
- [x] 无外部网络请求、无遥测、无第三方数据收集
- [x] MIT 许可证齐全，README 完整
- [x] 代码仅使用 dsh 插件公开接口（Services / webServer / slots / React），副作用全部挂在插件 Fiber 上，停止即清理
- [x] 输入内容（文件名 / 文件内容）均经 HTML 转义后渲染，链接协议白名单 + `noopener`，无注入面

### License

[MIT](./LICENSE)

---

[English](#english) · [中文](#中文)
