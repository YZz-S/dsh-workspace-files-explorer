// workspace-files-explorer · Host 半部分
// 使用方式：把本文件内容整体作为 cordis_define 的 code.host 使用。
// ---------------------------------------------------------------------------
// 职责：
//   - 包私有 RPC：wsfiles.root / wsfiles.list / wsfiles.read（harness.handle）
//   - 工作区根：以客户端传来的当前会话 cwd 为准（无 cwd 时回退 sandboxPolicy.workspaceRoot）
//   - 安全：fs.contains 校验所有路径必须位于工作区内；只读，无任何写入
//   - 限制：目录最多 500 项、文本预览上限 256KB、二进制文件友好报错
// 依赖（全部可选，通过 ctx.get 读取）：fs、sandboxPolicy
// ---------------------------------------------------------------------------
return {
  apply(ctx) {
    const fs = ctx.get('fs')
    if (fs === undefined) return
    const policy = ctx.get('sandboxPolicy')
    const fallbackRoot = policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : ''
    const MAX_ENTRIES = 500
    const MAX_BYTES = 262144

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

    harness.handle('wsfiles.root', async (args) => {
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
    })

    harness.handle('wsfiles.list', async (args) => {
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
    })

    harness.handle('wsfiles.read', async (args) => {
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
    })
  },
}
