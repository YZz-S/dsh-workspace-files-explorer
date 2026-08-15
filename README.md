# workspace-files-explorer

DeepSeek Harness（dsh）Web GUI 的工作区文件浏览器插件：在浮层面板中浏览当前会话工作区（cwd）的文件树，点击文件即可预览——代码文件带行号与语法高亮，Markdown 文件渲染为富文本。

![效果图 1](./images/%E6%96%87%E4%BB%B6%E9%A2%84%E8%A7%88%E6%95%88%E6%9E%9C_1.png)

![效果图 2](./images/%E6%96%87%E4%BB%B6%E9%A2%84%E8%A7%88%E6%95%88%E6%9E%9C_2.png)

## 功能

- **浮层文件面板**：注册在 `shell.overlay`，加法式注册，不替换任何自带 UI；默认停靠右上角
- **文件树**：懒加载展开、目录优先排序、隐藏文件（点开头）淡化显示、文件大小标注、单目录最多 500 项截断提示、一键刷新
- **代码预览**：行号 + 轻量语法高亮（JS/TS/Python/Go/Rust/Java/C#/PHP/Bash/SQL/JSON/YAML/CSS/HTML 等 30+ 语言按扩展名识别），深浅色主题自适应，超长文件截断
- **Markdown 预览**：标题 / 列表 / 表格 / 引用 / 链接 / 代码块等渲染，内嵌代码块同样高亮；渲染前整体 HTML 转义，链接仅允许 http/https 且强制 `rel="noopener noreferrer"`
- **面板交互**：标题栏拖拽移动、右下角拖拽缩放（400–1400 × 280–900）、关闭 / 刷新
- **会话头部按钮**：标题栏动作区显示「工作区文件」按钮（点亮 = 面板已打开），点击切换显隐
- **跟随会话**：工作区根目录取自当前会话的 `cwd`（`useSessions` 标准 hook），切换会话时面板自动重置并加载新工作区

## 安装（dsh.bundle）

本仓库同时是可安装的 dsh 插件包（`package.json` 声明 `dsh.bundle` + `dsh.client`）：

```sh
dsh plugin --profile web add github:YZz-S/workspace-files-explorer
```

安装后「会话标题栏动作区」出现「工作区文件」按钮，浮层面板自动生效。
动态用法（`cordis_define` 加载 `host.js` / `client.js`）仍保留，两种方式二选一。

## 文件说明

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

## 使用方法

### 方式一：动态 Cordis 插件（临时运行）

在 dsh Web GUI 的会话中，用 Cordis 工具定义并运行：

1. 调用 `cordis_define`：`code.host` 粘贴 `host.js` 的内容，`code.client` 粘贴 `client.js` 的内容（`plugin.kind: 'new'`，`idPrefix` 取 3–6 个小写字母）
2. 调用 `cordis_run` 激活，在界面上允许授权
3. 面板默认打开；标题栏右侧出现「工作区文件」按钮用于切换显隐

> 注意：动态插件的生命周期与当前 dsh 进程相同。重启 dsh 后需重新定义运行。

### 方式二：可安装插件（常驻）

见上文「安装（dsh.bundle）」：`dsh plugin --profile web add github:YZz-S/workspace-files-explorer`，插件随 profile 常驻，无需每次手动运行。

## 工作原理

- **工作区根**：Client 端通过标准 hook `useSessions((s) => s)` 读取当前会话的 `cwd`，随每次请求传给 Host；无会话时回退 `sandboxPolicy.workspaceRoot`
- **Host 只读**：仅使用 `fs` 的 `resolve` / `stat` / `listDir` / `readText` / `contains` / `processPath`，无任何写入；所有路径经 `fs.contains` 校验必须位于工作区内
- **预览安全**：代码与 Markdown 内容一律先做 HTML 转义再渲染；Markdown 链接仅允许 `http/https` 协议并强制 `rel="noopener noreferrer"`；原始 HTML 不直通
- **上限**：文本预览 256KB、代码渲染 2000 行、Markdown 渲染 4000 行、目录列表 500 项，超出部分友好提示

## 隐私说明

- 仅读取当前会话工作区内的文件与目录列表，**无外部网络请求、无文件写入、无遥测、无持久化存储**
- 工作区边界外的路径一律拒绝（`路径超出工作区范围`）

## 已知限制

- 二进制文件与超过 256KB 的文本只提示，不预览
- 语法高亮为内置轻量实现（关键字 / 字符串 / 注释 / 数字），非完整语义级高亮
- 面板按钮注册在会话头部动作区；空白新会话（无标题栏）时按钮不显示，面板仍默认打开
- 动态插件为进程级生命周期，重启后需重新运行

## 开源前检查

- [x] 无硬编码密钥 / Token / 密码（已扫描 `api[_-]?key`、`secret`、`token`、`password`、私钥头等模式）
- [x] 无个人信息（用户名、机器路径、内部 IP、邮箱）；工作区路径来自运行时会话状态，未写入代码
- [x] 无外部网络请求、无遥测、无第三方数据收集
- [x] MIT 许可证齐全，README 完整
- [x] 代码仅使用 dsh 插件公开接口（Services / webServer / slots / React），副作用全部挂在插件 Fiber 上，停止即清理
- [x] 输入内容（文件名 / 文件内容）均经 HTML 转义后渲染，链接协议白名单 + `noopener`，无注入面

## License

[MIT](./LICENSE)
