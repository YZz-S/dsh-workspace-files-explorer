/**
 * workspace-files-explorer — Host 半边（可安装的 dsh.bundle 插件）
 *
 * 职责：以客户端传来的当前会话 cwd 为工作区根，提供只读文件浏览 API：
 *   POST /api/wsf-explorer/root  { cwd }        → 工作区根路径
 *   POST /api/wsf-explorer/list  { cwd, path }  → 目录条目（目录优先、500 项截断）
 *   POST /api/wsf-explorer/read  { cwd, path }  → 文本内容（256KB 上限，二进制友好报错）
 *
 * 所有路径经 fs.contains 校验必须位于工作区内；只读，无任何写入。
 * 安装版由 cordis.patch.yml 插入插件行（dsh plugin --profile web add github:…）。
 * 动态版（cordis_define 加载 host.js）使用 harness.handle，与本文件二选一。
 */

export const name = 'workspace-files-explorer'
export const inject = ['webServer']

const MAX_ENTRIES = 500
const MAX_BYTES = 262144

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function readBody(req, cap) {
  cap = cap || 8192
  return new Promise((resolve) => {
    let size = 0
    const parts = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size <= cap) parts.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(parts).toString('utf8') || '{}'))
      } catch (e) {
        resolve(null)
      }
    })
    req.on('error', () => resolve(null))
  })
}

export function apply(ctx) {
  const fs = ctx.get('fs')
  const policy = ctx.get('sandboxPolicy')
  if (fs === undefined) return

  const fallbackRoot = policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : ''
  const err = (message) => ({ ok: false, error: message })

  function cwdOf(args) {
    return args && typeof args.cwd === 'string' && args.cwd ? args.cwd : ''
  }

  async function rootTarget(cwd) {
    const base = cwd || fallbackRoot
    if (!base) return undefined
    try { return await fs.resolve(base) } catch (e) { return undefined }
  }

  async function checkedTarget(cwd, path) {
    const target = await fs.resolve(path)
    const root = await rootTarget(cwd)
    if (root !== undefined && !fs.contains(root, target)) {
      throw new Error('路径超出工作区范围')
    }
    return target
  }

  async function handleRoot(args) {
    try {
      const cwd = cwdOf(args)
      const root = await rootTarget(cwd)
      if (root === undefined) return err('无法确定工作区根目录')
      const info = await fs.stat(root)
      if (info !== undefined && info.type !== 'directory') return err('工作区根目录不是目录')
      return { ok: true, path: fs.processPath(root) }
    } catch (e) {
      return err(e && e.message ? String(e.message) : '无法确定工作区根目录')
    }
  }

  async function handleList(args) {
    try {
      const cwd = cwdOf(args)
      const path = args && typeof args.path === 'string' ? args.path : ''
      const target = path ? await checkedTarget(cwd, path) : await rootTarget(cwd)
      if (target === undefined) return err('无法解析目录')
      const info = await fs.stat(target)
      if (info === undefined) return err('目录不存在')
      if (info.type !== 'directory') return err('不是目录')
      const entries = await fs.listDir(target)
      const dirs = []
      const files = []
      let truncated = false
      for (const entry of entries) {
        if (dirs.length + files.length >= MAX_ENTRIES) { truncated = true; break }
        const item = {
          name: String(entry.name),
          path: fs.processPath(entry.target),
          isDir: entry.type === 'directory',
          size: typeof entry.size === 'number' ? entry.size : null,
        }
        if (item.isDir) dirs.push(item); else files.push(item)
      }
      const cmp = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
      dirs.sort(cmp); files.sort(cmp)
      return { ok: true, path: fs.processPath(target), entries: dirs.concat(files), truncated }
    } catch (e) {
      return err(e && e.message ? String(e.message) : '读取目录失败')
    }
  }

  async function handleRead(args) {
    try {
      const cwd = cwdOf(args)
      const path = args && typeof args.path === 'string' ? args.path : ''
      if (!path) return err('缺少路径')
      const target = await checkedTarget(cwd, path)
      const info = await fs.stat(target)
      if (info === undefined) return err('文件不存在')
      if (info.type === 'directory') return err('这是目录，无法预览')
      if (info.type !== 'file') return err('无法预览该类型的条目')
      if (typeof info.size === 'number' && info.size > MAX_BYTES) {
        return { ok: false, tooLarge: true, size: info.size, error: '文件过大（' + Math.round(info.size / 1024) + ' KB），仅预览 ' + (MAX_BYTES / 1024) + ' KB 以内的文本' }
      }
      try {
        const content = await fs.readText(target)
        return { ok: true, path: fs.processPath(target), content, size: info.size }
      } catch (readErr) {
        const code = readErr && readErr.code ? String(readErr.code) : ''
        if (code === 'FS_NOT_TEXT') return { ok: false, binary: true, size: info.size, error: '二进制文件，无法以文本方式预览' }
        if (code === 'FS_TOO_LARGE') return { ok: false, tooLarge: true, size: info.size, error: '文件过大，无法预览' }
        return err('读取失败：' + (readErr && readErr.message ? String(readErr.message) : code || '未知错误'))
      }
    } catch (e) {
      return err(e && e.message ? String(e.message) : '读取失败')
    }
  }

  ctx.effect(() => {
    const disposeRoot = ctx.webServer.register({
      kind: 'exact',
      path: '/api/wsf-explorer/root',
      handler: async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        const body = await readBody(req, 8192)
        return json(res, 200, await handleRoot(body || {}))
      },
    })
    const disposeList = ctx.webServer.register({
      kind: 'exact',
      path: '/api/wsf-explorer/list',
      handler: async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        const body = await readBody(req, 8192)
        return json(res, 200, await handleList(body || {}))
      },
    })
    const disposeRead = ctx.webServer.register({
      kind: 'exact',
      path: '/api/wsf-explorer/read',
      handler: async (req, res) => {
        if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method-not-allowed' })
        const body = await readBody(req, 8192)
        return json(res, 200, await handleRead(body || {}))
      },
    })

    return () => {
      disposeRoot()
      disposeList()
      disposeRead()
    }
  }, 'workspace-files-explorer: routes')
}
