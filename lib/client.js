/* workspace-files-explorer client half: header toggle button + floating file explorer panel.
 * Loaded through the client module loader (CJS wrapper). The loader id MUST
 * equal the package name: client-modules verifies the boot graph row id
 * (the package name) against the id registered via __ModuleLoader__.load. */
window.__ModuleLoader__.load({
  id: 'workspace-files-explorer',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    var React = require('react')

    const CSS = `
.wsf-viewport{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:30;}
.wsf-panel{position:absolute;display:flex;flex-direction:column;pointer-events:auto;border-radius:12px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.14));background:var(--dsw-alias-bg-overlay,#fff);color:var(--dsw-alias-label-primary,#1f2328);box-shadow:0 16px 40px rgba(0,0,0,.25),0 2px 10px rgba(0,0,0,.14);overflow:hidden;font-family:system-ui,-apple-system,sans-serif;font-size:12.5px;}
.wsf-panel-default{right:16px;top:72px;}
.wsf-titlebar{display:flex;align-items:center;gap:8px;padding:7px 8px 7px 12px;cursor:grab;user-select:none;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));background:var(--dsw-alias-bg-layer-1,#f6f8fa);}
.wsf-titlebar:active{cursor:grabbing;}
.wsf-title{font-weight:600;}
.wsf-rootname{color:var(--dsw-alias-label-secondary,#656d76);font-size:11.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:40%;}
.wsf-spacer{flex:1;}
.wsf-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:none;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary,#656d76);cursor:pointer;}
.wsf-iconbtn:hover{background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.07));color:var(--dsw-alias-label-primary,#1f2328);}
.wsf-body{flex:1;display:flex;min-height:0;}
.wsf-tree{width:44%;min-width:180px;max-width:62%;overflow:auto;border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));padding:6px 4px;background:var(--dsw-alias-bg-layer-1,#fbfcfd);}
.wsf-item{display:flex;align-items:center;gap:5px;padding:2.5px 6px 2.5px 4px;border-radius:6px;cursor:pointer;white-space:nowrap;color:var(--dsw-alias-label-primary,#1f2328);}
.wsf-item:hover{background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.06));}
.wsf-item-sel{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#3b82f6) 16%,transparent);color:var(--dsw-alias-brand-primary,#1d4ed8);}
.wsf-item-sel:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary,#3b82f6) 16%,transparent);}
.wsf-item-hidden{opacity:.55;}
.wsf-item-note{padding:3px 8px;color:var(--dsw-alias-label-secondary,#656d76);font-size:11.5px;cursor:default;white-space:nowrap;}
.wsf-chev{display:inline-flex;width:13px;height:13px;flex:none;color:var(--dsw-alias-label-secondary,#656d76);transition:transform .12s ease;}
.wsf-chev-open{transform:rotate(90deg);}
.wsf-ico{display:inline-flex;flex:none;}
.wsf-ico-dir{color:#d29922;}
.wsf-ico-file{color:var(--dsw-alias-label-secondary,#8b949e);}
.wsf-name{overflow:hidden;text-overflow:ellipsis;}
.wsf-psize{color:var(--dsw-alias-label-secondary,#656d76);font-size:10.5px;flex:none;margin-left:auto;}
.wsf-err{margin:10px 12px;padding:10px 12px;border-radius:8px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#dc2626) 35%,transparent);background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#dc2626) 8%,transparent);color:var(--dsw-alias-state-error-primary,#b91c1c);font-size:12px;line-height:1.6;}
.wsf-empty{padding:28px 16px;text-align:center;color:var(--dsw-alias-label-secondary,#656d76);}
.wsf-loading{padding:16px;color:var(--dsw-alias-label-secondary,#656d76);}
.wsf-preview-column{flex:1;min-width:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,#fff);}
.wsf-phead{display:flex;align-items:center;gap:8px;padding:7px 12px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));background:var(--dsw-alias-bg-layer-1,#fbfcfd);flex:none;}
.wsf-pname{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.wsf-badge{padding:1px 8px;border-radius:999px;font-size:10.5px;font-weight:600;background:color-mix(in srgb,var(--dsw-alias-brand-primary,#3b82f6) 14%,transparent);color:var(--dsw-alias-brand-primary,#1d4ed8);flex:none;}
.wsf-scroll{flex:1;overflow:auto;min-height:0;}
.wsf-code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.6;padding:8px 0 12px;}
.wsf-cl{display:grid;grid-template-columns:auto minmax(0,1fr);}
.wsf-cl:hover{background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,rgba(0,0,0,.05)) 60%,transparent);}
.wsf-ln{padding:0 10px;text-align:right;color:var(--dsw-alias-label-secondary,#9aa1a9);user-select:none;border-right:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.06));}
.wsf-lc{padding:0 14px;white-space:pre;}
.wsf-trunc{padding:8px 14px;color:var(--dsw-alias-state-warn-primary,#b45309);font-size:11.5px;font-family:ui-monospace,monospace;}
.wsf-root{--wsf-tok-c:#6a737d;--wsf-tok-s:#0a3069;--wsf-tok-k:#cf222e;--wsf-tok-n:#0550ae;}
@media (prefers-color-scheme:dark){.wsf-root{--wsf-tok-c:#8b949e;--wsf-tok-s:#a5d6ff;--wsf-tok-k:#ff7b72;--wsf-tok-n:#79c0ff;}}
.tok-c{color:var(--wsf-tok-c);font-style:italic;}
.tok-s{color:var(--wsf-tok-s);}
.tok-k{color:var(--wsf-tok-k);font-weight:600;}
.tok-n{color:var(--wsf-tok-n);}
.wsf-md{padding:14px 18px 24px;font-size:13.5px;line-height:1.75;word-wrap:break-word;}
.wsf-md h1{font-size:1.5em;margin:14px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));}
.wsf-md h2{font-size:1.3em;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));}
.wsf-md h3{font-size:1.15em;margin:12px 0 6px;}
.wsf-md h4{font-size:1.02em;margin:10px 0 5px;}
.wsf-md h5,.wsf-md h6{font-size:.92em;margin:8px 0 4px;color:var(--dsw-alias-label-secondary,#656d76);}
.wsf-md p{margin:8px 0;}
.wsf-md ul,.wsf-md ol{margin:8px 0;padding-left:22px;}
.wsf-md li{margin:3px 0;}
.wsf-md code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.9em;background:var(--dsw-alias-bg-layer-1,#f0f2f5);padding:1.5px 5px;border-radius:5px;}
.wsf-md pre{background:var(--dsw-alias-bg-layer-1,#f0f2f5);border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.08));border-radius:8px;padding:10px 12px;overflow-x:auto;margin:10px 0;}
.wsf-md pre code{background:none;padding:0;font-size:12px;line-height:1.55;}
.wsf-md blockquote{margin:8px 0;padding:2px 14px;border-left:3px solid var(--dsw-alias-border-l2,rgba(0,0,0,.22));color:var(--dsw-alias-label-secondary,#656d76);}
.wsf-md hr{border:none;border-top:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1));margin:14px 0;}
.wsf-md a{color:var(--dsw-alias-brand-primary,#1d4ed8);text-decoration:none;}
.wsf-md a:hover{text-decoration:underline;}
.wsf-md table{border-collapse:collapse;margin:10px 0;display:block;overflow-x:auto;max-width:100%;}
.wsf-md th,.wsf-md td{border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.12));padding:4px 10px;}
.wsf-md th{background:var(--dsw-alias-bg-layer-1,#f0f2f5);font-weight:600;}
.wsf-md del{opacity:.7;}
.wsf-hbtn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1,rgba(0,0,0,.12));border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary,#656d76);cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;}
.wsf-hbtn:hover{background:var(--dsw-alias-bg-layer-2,rgba(0,0,0,.06));color:var(--dsw-alias-label-primary,#1f2328);}
.wsf-hbtn-on{color:var(--dsw-alias-brand-primary,#1d4ed8);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary,#3b82f6) 45%,transparent);background:color-mix(in srgb,var(--dsw-alias-brand-primary,#3b82f6) 10%,transparent);}
.wsf-resize{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;touch-action:none;}
.wsf-resize::after{content:"";position:absolute;right:4px;bottom:4px;width:8px;height:8px;border-right:2px solid var(--dsw-alias-border-l2,rgba(0,0,0,.28));border-bottom:2px solid var(--dsw-alias-border-l2,rgba(0,0,0,.28));}
`

    function apiPost(url, body) {
      return fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body === null || body === undefined ? {} : body),
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
    }

    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin="workspace-files-explorer"]') === null) {
      var styleTag = document.createElement('style')
      styleTag.dataset.plugin = 'workspace-files-explorer'
      styleTag.textContent = CSS
      document.head.appendChild(styleTag)
    }

    const EXT_LANG = {
      js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
      ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript',
      py: 'python', pyw: 'python', rb: 'ruby', go: 'go', rs: 'rust', java: 'java',
      c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', hh: 'cpp',
      cs: 'csharp', php: 'php', sh: 'bash', bash: 'bash', zsh: 'bash', ps1: 'powershell', psm1: 'powershell',
      sql: 'sql', json: 'json', jsonc: 'json', yaml: 'yaml', yml: 'yaml', toml: 'toml', ini: 'ini', conf: 'ini',
      css: 'css', scss: 'scss', less: 'scss',
      html: 'html', htm: 'html', xml: 'xml', svg: 'xml', vue: 'html', svelte: 'html',
      kt: 'kotlin', kts: 'kotlin', swift: 'swift', dart: 'dart', lua: 'lua', r: 'r', pl: 'perl', pm: 'perl',
      txt: 'text', log: 'text',
    }

    const JS_KW = 'const let var function return if else for while do switch case break continue new class extends super this import export default from async await try catch finally throw typeof instanceof in of delete void yield static get set null undefined true false'.split(' ')
    const TS_KW = JS_KW.concat('type interface enum implements readonly namespace declare as satisfies keyof infer never unknown any string number boolean symbol object public private protected abstract override'.split(' '))

    function makeSpec(kind, keywords, backtick) {
      return { kind, keywordSet: new Set(keywords || []), backtick: !!backtick }
    }

    const SPECS = {
      javascript: makeSpec('slash', JS_KW, true),
      typescript: makeSpec('slash', TS_KW, true),
      python: makeSpec('hash', 'def class return if elif else for while in not and or import from as with try except finally raise lambda pass break continue global nonlocal yield async await None True False self is del assert'.split(' ')),
      ruby: makeSpec('hash', 'def class module end if elsif else unless while until for do return yield require begin rescue ensure nil true false self'.split(' ')),
      go: makeSpec('slash', 'func package import var const type struct interface map chan go defer select range return if else for switch case break continue fallthrough default nil true false make new len cap append copy panic recover'.split(' '), true),
      rust: makeSpec('slash', 'fn let mut pub use mod struct enum impl trait match if else for while loop return self Self crate super const static ref move async await where dyn in true false None Some Ok Err String Vec Option Result Box'.split(' ')),
      java: makeSpec('slash', 'public private protected class interface extends implements package import static final void int new return if else for while do switch case break continue try catch finally throw throws this super null true false instanceof abstract synchronized volatile transient native enum record var'.split(' ')),
      c: makeSpec('slash', 'include define ifdef ifndef endif pragma return int char void float double long short unsigned signed const static struct union enum typedef sizeof auto bool'.split(' ')),
      cpp: makeSpec('slash', 'include define ifdef ifndef endif pragma return int char void float double long short unsigned signed const static struct union enum typedef sizeof new delete class namespace template typename public private protected virtual override friend nullptr true false auto using'.split(' ')),
      csharp: makeSpec('slash', 'public private protected internal class interface struct enum namespace using return if else for foreach while do switch case break continue try catch finally throw new var const readonly static async await virtual override sealed abstract partial get set null true false int string void'.split(' ')),
      php: makeSpec('slash', 'function return if else elseif for foreach while do switch case break continue new class extends implements public private protected static echo print require include use namespace const array null true false this self parent try catch finally throw fn match'.split(' '), true),
      bash: makeSpec('hash', 'if then else elif fi for while until do done case esac function return echo export local readonly source exit set unset shift trap in'.split(' '), true),
      docker: makeSpec('hash', 'from run cmd entrypoint copy add workdir env arg expose volume user label maintainer onbuild stopsignal healthcheck shell'.split(' ')),
      make: makeSpec('hash', 'ifeq ifneq else endif define endef include export override'.split(' ')),
      powershell: makeSpec('hash', 'function param if else elseif foreach while switch try catch finally return echo write-host new-object null true false'.split(' ')),
      sql: makeSpec('dash', 'select from where group by order having join left right inner outer full on as and or not in is null insert into values update set delete create table index view drop alter add primary key foreign references distinct limit offset count sum avg min max union all case when then else end'.split(' ')),
      json: makeSpec('slash', 'true false null'.split(' ')),
      yaml: makeSpec('hash', 'true false null'.split(' ')),
      toml: makeSpec('hash', 'true false null'.split(' ')),
      ini: makeSpec('hash', []),
      css: makeSpec('slash', 'important media keyframes var calc not and only'.split(' ')),
      scss: makeSpec('slash', 'mixin include extend important media keyframes var calc not and only function return'.split(' ')),
      html: makeSpec('html', []),
      xml: makeSpec('html', []),
      kotlin: makeSpec('slash', 'fun val var class interface object package import return if else when for while do try catch finally throw null true false this super is in as data sealed'.split(' ')),
      swift: makeSpec('slash', 'func var let class struct enum protocol extension import return if else guard for while repeat switch case break continue try catch throw nil true false self super static private public internal'.split(' ')),
      dart: makeSpec('slash', 'void var final const class extends implements import return if else for while do switch case break continue try catch finally throw null true false this super async await'.split(' ')),
      lua: makeSpec('dash', 'function return if then elseif else end for while do repeat until local nil true false and or not in'.split(' ')),
      r: makeSpec('hash', 'function return if else for while repeat library require null true false'.split(' ')),
      perl: makeSpec('hash', 'sub return if else elsif for foreach while my our use strict warnings null true false'.split(' ')),
      text: makeSpec(null, []),
    }

    function escapeHtml(text) {
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }

    function isWord(ch) {
      return /[A-Za-z0-9_$]/.test(ch)
    }

    function makeScanner(spec) {
      const kw = spec.keywordSet
      const slash = spec.kind === 'slash'
      const hash = spec.kind === 'hash'
      const dash = spec.kind === 'dash'
      const backtick = spec.backtick
      return function scan(line, state) {
        let out = ''
        let i = 0
        const n = line.length
        while (i < n) {
          if (state.inBlock) {
            const end = line.indexOf('*/', i)
            if (end === -1) { out += '<span class="tok-c">' + escapeHtml(line.slice(i)) + '</span>'; i = n }
            else { out += '<span class="tok-c">' + escapeHtml(line.slice(i, end + 2)) + '</span>'; state.inBlock = false; i = end + 2 }
            continue
          }
          const ch = line[i]
          const nx = line[i + 1]
          if (slash && ch === '/' && nx === '/') { out += '<span class="tok-c">' + escapeHtml(line.slice(i)) + '</span>'; i = n; continue }
          if (slash && ch === '/' && nx === '*') {
            const end = line.indexOf('*/', i + 2)
            if (end === -1) { out += '<span class="tok-c">' + escapeHtml(line.slice(i)) + '</span>'; state.inBlock = true; i = n }
            else { out += '<span class="tok-c">' + escapeHtml(line.slice(i, end + 2)) + '</span>'; i = end + 2 }
            continue
          }
          if (hash && ch === '#') { out += '<span class="tok-c">' + escapeHtml(line.slice(i)) + '</span>'; i = n; continue }
          if (dash && ch === '-' && nx === '-') { out += '<span class="tok-c">' + escapeHtml(line.slice(i)) + '</span>'; i = n; continue }
          if (ch === '"' || ch === "'" || (backtick && ch === '`')) {
            const q = ch
            let j = i + 1
            while (j < n) {
              if (line[j] === '\\') { j += 2; continue }
              if (line[j] === q) { j++; break }
              j++
            }
            out += '<span class="tok-s">' + escapeHtml(line.slice(i, j)) + '</span>'
            i = j
            continue
          }
          if ((ch >= '0' && ch <= '9') || (ch === '.' && nx >= '0' && nx <= '9')) {
            let j = i + 1
            while (j < n && /[\w.]/.test(line[j])) j++
            out += '<span class="tok-n">' + escapeHtml(line.slice(i, j)) + '</span>'
            i = j
            continue
          }
          if (isWord(ch)) {
            let j = i + 1
            while (j < n && isWord(line[j])) j++
            const word = line.slice(i, j)
            out += kw.has(word) ? '<span class="tok-k">' + escapeHtml(word) + '</span>' : escapeHtml(word)
            i = j
            continue
          }
          out += escapeHtml(ch)
          i++
        }
        return out
      }
    }

    function makeHtmlScanner() {
      return function scan(line, state) {
        const s = escapeHtml(line)
        let out = ''
        let i = 0
        const n = s.length
        while (i < n) {
          if (state.inBlock) {
            const end = s.indexOf('--&gt;', i)
            if (end === -1) { out += '<span class="tok-c">' + s.slice(i) + '</span>'; i = n }
            else { out += '<span class="tok-c">' + s.slice(i, end + 6) + '</span>'; state.inBlock = false; i = end + 6 }
            continue
          }
          if (s.startsWith('&lt;!--', i)) {
            const end = s.indexOf('--&gt;', i + 7)
            if (end === -1) { out += '<span class="tok-c">' + s.slice(i) + '</span>'; state.inBlock = true; i = n }
            else { out += '<span class="tok-c">' + s.slice(i, end + 6) + '</span>'; i = end + 6 }
            continue
          }
          if (s[i] === '&' && s.startsWith('&lt;', i)) {
            const end = s.indexOf('&gt;', i + 4)
            if (end !== -1) { out += '<span class="tok-k">' + s.slice(i, end + 4) + '</span>'; i = end + 4; continue }
          }
          if (s[i] === '"' || s[i] === "'") {
            const q = s[i]
            let j = i + 1
            while (j < n && s[j] !== q) j++
            if (j < n) j++
            out += '<span class="tok-s">' + s.slice(i, j) + '</span>'
            i = j
            continue
          }
          out += s[i]
          i++
        }
        return out
      }
    }

    function scannerFor(lang) {
      const spec = SPECS[lang]
      if (!spec || !spec.kind) return null
      if (spec.kind === 'html') return makeHtmlScanner()
      return makeScanner(spec)
    }

    function codeToHtml(text, lang) {
      const scanner = scannerFor(lang)
      const MAX_LINES = 2000
      const lines = text.replace(/\r\n?/g, '\n').split('\n')
      let shown = lines
      let truncated = false
      if (lines.length > MAX_LINES) { shown = lines.slice(0, MAX_LINES); truncated = true }
      const digits = String(shown.length).length
      const state = { inBlock: false }
      const parts = []
      for (let i = 0; i < shown.length; i++) {
        const num = String(i + 1).padStart(digits, ' ')
        const body = scanner ? scanner(shown[i], state) : escapeHtml(shown[i])
        parts.push('<div class="wsf-cl"><span class="wsf-ln">' + num + '</span><span class="wsf-lc">' + body + '</span></div>')
      }
      if (truncated) parts.push('<div class="wsf-trunc">⚠ 文件过长，仅预览前 ' + MAX_LINES + ' 行</div>')
      return parts.join('')
    }

    function highlightCodeBlock(code, lang) {
      const scanner = scannerFor(lang)
      const lines = code.split('\n')
      const state = { inBlock: false }
      const parts = []
      for (let i = 0; i < lines.length; i++) {
        parts.push(scanner ? scanner(lines[i], state) : escapeHtml(lines[i]))
      }
      return parts.join('\n')
    }

    function inlineMd(text) {
      let s = escapeHtml(text)
      const codes = []
      s = s.replace(/`([^`\n]+)`/g, function (m, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000' })
      s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt) { return '🖼 ' + (alt || '图片') })
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
        if (/^https?:\/\//i.test(url)) return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>'
        return label + ' (' + url + ')'
      })
      s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>')
      s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>')
      s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>')
      s = s.replace(/(^|[^A-Za-z0-9])_([^_\n]+)_(?![A-Za-z0-9])/g, '$1<em>$2</em>')
      s = s.replace(/\u0000(\d+)\u0000/g, function (m, idx) { return '<code>' + codes[Number(idx)] + '</code>' })
      return s
    }

    function splitRow(line) {
      let s = line.trim()
      if (s.startsWith('|')) s = s.slice(1)
      if (s.endsWith('|')) s = s.slice(0, -1)
      return s.split('|').map(function (c) { return c.trim() })
    }

    function isTableStart(lines, i) {
      const line = lines[i]
      if (!line.includes('|')) return false
      const next = lines[i + 1]
      if (next === undefined || !next.includes('|')) return false
      const hcells = splitRow(line).filter(function (c) { return c !== '' })
      const scells = splitRow(next).filter(function (c) { return c !== '' })
      if (!scells.length || hcells.length !== scells.length) return false
      return scells.every(function (c) { return /^:?-{1,}:?$/.test(c) })
    }

    function isStructural(lines, i) {
      const line = lines[i]
      if (/^\s*$/.test(line)) return true
      if (/^(#{1,6})\s+/.test(line)) return true
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) return true
      if (/^\s*>\s?/.test(line)) return true
      if (/^\s*[-*+]\s+/.test(line)) return true
      if (/^\s*\d+[.)]\s+/.test(line)) return true
      if (isTableStart(lines, i)) return true
      if (/^\s*(`{3,}|~{3,})/.test(line)) return true
      return false
    }

    function renderTable(rows) {
      if (rows.length < 2) return ''
      const header = splitRow(rows[0])
      const body = rows.slice(2).map(splitRow)
      const th = header.map(function (c) { return '<th>' + inlineMd(c) + '</th>' }).join('')
      const trs = body.map(function (cells) {
        return '<tr>' + cells.map(function (c) { return '<td>' + inlineMd(c) + '</td>' }).join('') + '</tr>'
      }).join('')
      return '<table><thead><tr>' + th + '</tr></thead><tbody>' + trs + '</tbody></table>'
    }

    function renderMdChunk(lines) {
      const out = []
      let i = 0
      while (i < lines.length) {
        const line = lines[i]
        if (isTableStart(lines, i)) {
          const rows = []
          while (i < lines.length && lines[i].includes('|')) { rows.push(lines[i]); i++ }
          out.push(renderTable(rows))
          continue
        }
        const h = /^(#{1,6})\s+(.*)$/.exec(line)
        if (h) {
          const lvl = h[1].length
          out.push('<h' + lvl + '>' + inlineMd(h[2]) + '</h' + lvl + '>')
          i++
          continue
        }
        if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue }
        if (/^\s*>\s?/.test(line)) {
          const inner = []
          while (i < lines.length && /^\s*>\s?/.test(lines[i])) { inner.push(lines[i].replace(/^\s*>\s?/, '')); i++ }
          out.push('<blockquote>' + renderMdChunk(inner) + '</blockquote>')
          continue
        }
        if (/^\s*[-*+]\s+/.test(line)) {
          const items = []
          while (i < lines.length) {
            const m = /^\s*[-*+]\s+(.*)$/.exec(lines[i])
            if (!m) break
            items.push(inlineMd(m[1]))
            i++
          }
          out.push('<ul><li>' + items.join('</li><li>') + '</li></ul>')
          continue
        }
        if (/^\s*\d+[.)]\s+/.test(line)) {
          const items = []
          while (i < lines.length) {
            const m = /^\s*\d+[.)]\s+(.*)$/.exec(lines[i])
            if (!m) break
            items.push(inlineMd(m[1]))
            i++
          }
          out.push('<ol><li>' + items.join('</li><li>') + '</li></ol>')
          continue
        }
        const para = []
        while (i < lines.length && !isStructural(lines, i)) { para.push(lines[i]); i++ }
        if (para.length) {
          const joined = para.join('')
          const text = para.join(/([\u4e00-\u9fff])/.test(joined) ? '' : ' ')
          out.push('<p>' + inlineMd(text) + '</p>')
        } else {
          i++
        }
      }
      return out.join('\n')
    }

    function renderMdBlocks(lines) {
      const html = []
      let i = 0
      while (i < lines.length) {
        const raw = lines[i]
        const fence = /^\s*(`{3,}|~{3,})/.exec(raw)
        if (fence) {
          const marker = fence[1]
          const lang = (raw.slice(raw.indexOf(marker) + marker.length).trim().split(/\s+/)[0] || '').toLowerCase()
          const code = []
          i++
          while (i < lines.length) {
            if (lines[i].trim().startsWith(marker)) { i++; break }
            code.push(lines[i])
            i++
          }
          html.push('<pre><code>' + highlightCodeBlock(code.join('\n'), lang) + '</code></pre>')
          continue
        }
        const chunk = []
        while (i < lines.length) {
          if (/^\s*$/.test(lines[i])) break
          if (/^\s*(`{3,}|~{3,})/.test(lines[i])) break
          chunk.push(lines[i])
          i++
        }
        if (chunk.length) html.push(renderMdChunk(chunk))
        else i++
      }
      return html.join('\n')
    }

    function renderMarkdown(text) {
      const lines = text.replace(/\r\n?/g, '\n').split('\n')
      if (lines.length > 4000) {
        const head = lines.slice(0, 4000)
        head.push('')
        head.push('> ⚠ 文件过长，仅预览前 4000 行')
        return renderMdBlocks(head)
      }
      return renderMdBlocks(lines)
    }

    function formatSize(n) {
      if (n === null || n === undefined) return ''
      if (n < 1024) return n + ' B'
      if (n < 1048576) return (n / 1024).toFixed(1) + ' KB'
      return (n / 1048576).toFixed(1) + ' MB'
    }

    function isMarkdown(name) {
      const lower = String(name).toLowerCase()
      const dot = lower.lastIndexOf('.')
      if (dot === -1) return false
      const ext = lower.slice(dot + 1)
      return ext === 'md' || ext === 'markdown' || ext === 'mdown' || ext === 'mkdn' || ext === 'mkd'
    }

    function languageOf(name) {
      const lower = String(name).toLowerCase()
      if (lower === 'dockerfile') return 'docker'
      if (lower === 'makefile' || lower === 'gnumakefile') return 'make'
      const dot = lower.lastIndexOf('.')
      if (dot === -1 || dot === lower.length - 1) return null
      return EXT_LANG[lower.slice(dot + 1)] || null
    }

    function clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v))
    }

    function rootName(path) {
      const trimmed = String(path).replace(/[\\/]+$/, '')
      const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'))
      return idx === -1 ? trimmed : trimmed.slice(idx + 1)
    }

    const FolderIcon = React.createElement('svg', { viewBox: '0 0 16 16', width: 14, height: 14, fill: 'currentColor', 'aria-hidden': true },
      React.createElement('path', { d: 'M1.75 2.5A1.75 1.75 0 0 0 0 4.25v7.5C0 12.716.784 13.5 1.75 13.5h12.5c.966 0 1.75-.784 1.75-1.75v-6A1.75 1.75 0 0 0 14.25 4H7.8L6.3 2.54a.25.25 0 0 0-.18-.04H1.75Z' }))

    const FileIcon = React.createElement('svg', { viewBox: '0 0 16 16', width: 13, height: 13, fill: 'currentColor', 'aria-hidden': true },
      React.createElement('path', { d: 'M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z' }))

    const ChevronIcon = React.createElement('svg', { viewBox: '0 0 16 16', width: 12, height: 12, fill: 'currentColor', 'aria-hidden': true },
      React.createElement('path', { d: 'M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z' }))

    const RefreshIcon = React.createElement('svg', { viewBox: '0 0 16 16', width: 13, height: 13, fill: 'currentColor', 'aria-hidden': true },
      React.createElement('path', { d: 'M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1Z' }),
      React.createElement('path', { d: 'M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466Z' }))

    const CloseIcon = React.createElement('svg', { viewBox: '0 0 16 16', width: 13, height: 13, fill: 'currentColor', 'aria-hidden': true },
      React.createElement('path', { d: 'M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z' }))

    function TreeItem(props) {
      const entry = props.entry
      const isDir = entry.isDir
      const [expanded, setExpanded] = React.useState(!!props.startExpanded)
      const [data, setData] = React.useState({ loaded: false, loading: false, entries: null, error: null, truncated: false })

      function load() {
        setData(function (d) { return { loaded: d.loaded, loading: true, entries: d.entries, error: null, truncated: d.truncated } })
        apiPost('/api/wsf-explorer/list', { cwd: props.cwd, path: entry.path }).then(function (res) {
          if (!res || !res.ok) setData({ loaded: true, loading: false, entries: null, error: (res && res.error) || '读取目录失败', truncated: false })
          else setData({ loaded: true, loading: false, entries: res.entries || [], error: null, truncated: !!res.truncated })
        }).catch(function (err) {
          setData({ loaded: true, loading: false, entries: null, error: String((err && err.message) || err), truncated: false })
        })
      }

      React.useEffect(function () {
        if (isDir && expanded && (!data.loaded || props.refreshKey)) load()
      }, [expanded, props.refreshKey])

      function onClick() {
        if (isDir) {
          if (data.loading) return
          if (data.error) { load(); return }
          setExpanded(!expanded)
        } else {
          props.onSelect(entry.path, entry.name)
        }
      }

      const selected = !isDir && props.selectedPath === entry.path
      const cls = 'wsf-item' + (selected ? ' wsf-item-sel' : '') + (String(entry.name).startsWith('.') ? ' wsf-item-hidden' : '')
      const indent = { paddingLeft: 6 + props.depth * 14 }
      const chevCls = 'wsf-chev' + (expanded ? ' wsf-chev-open' : '')
      const children = []
      if (isDir && expanded) {
        if (data.loading) children.push(React.createElement('div', { key: 'loading', className: 'wsf-item-note', style: { paddingLeft: 30 + props.depth * 14 } }, '加载中…'))
        else if (data.error) children.push(React.createElement('div', { key: 'error', className: 'wsf-item-note', style: { paddingLeft: 30 + props.depth * 14 } }, '⚠ ' + data.error + '（点击重试）'))
        else if (data.entries && data.entries.length === 0) children.push(React.createElement('div', { key: 'empty', className: 'wsf-item-note', style: { paddingLeft: 30 + props.depth * 14 } }, '（空目录）'))
        else if (data.entries) {
          children.push(data.entries.map(function (e) {
            return React.createElement(TreeItem, { key: e.path, entry: e, depth: props.depth + 1, selectedPath: props.selectedPath, onSelect: props.onSelect, refreshKey: props.refreshKey, cwd: props.cwd })
          }))
          if (data.truncated) children.push(React.createElement('div', { key: 'trunc', className: 'wsf-item-note', style: { paddingLeft: 30 + props.depth * 14 } }, '… 目录过大，仅显示前 500 项'))
        }
      }

      return React.createElement('div', null,
        React.createElement('div', { className: cls, style: indent, onClick: onClick, title: entry.name },
          isDir
            ? React.createElement('span', { className: chevCls }, ChevronIcon)
            : React.createElement('span', { className: 'wsf-chev' }),
          isDir
            ? React.createElement('span', { className: 'wsf-ico wsf-ico-dir' }, FolderIcon)
            : React.createElement('span', { className: 'wsf-ico wsf-ico-file' }, FileIcon),
          React.createElement('span', { className: 'wsf-name' }, String(entry.name)),
          !isDir && typeof entry.size === 'number' ? React.createElement('span', { className: 'wsf-psize', style: { marginLeft: 'auto', paddingLeft: 8 } }, formatSize(entry.size)) : null
        ),
        children
      )
    }

    function PreviewBody(props) {
      const preview = props.preview
      const selected = props.selected
      if (!selected) {
        return React.createElement('div', { className: 'wsf-preview-column' },
          React.createElement('div', { className: 'wsf-empty' }, '← 在左侧文件树中选择一个文件进行预览'))
      }
      const badgeLabel = preview && preview.status === 'ready' ? (preview.md ? 'Markdown' : (preview.lang && preview.lang !== 'text' ? preview.lang : '文本')) : null
      const head = React.createElement('div', { className: 'wsf-phead' },
        React.createElement('span', { className: 'wsf-pname' }, selected.name),
        badgeLabel ? React.createElement('span', { className: 'wsf-badge' }, badgeLabel) : null,
        React.createElement('span', { className: 'wsf-spacer' }),
        preview && typeof preview.size === 'number' ? React.createElement('span', { className: 'wsf-psize' }, formatSize(preview.size)) : null)
      let body = null
      if (!preview || preview.status === 'loading') body = React.createElement('div', { className: 'wsf-loading' }, '正在加载…')
      else if (preview.status === 'error') {
        const icon = preview.binary ? '📦' : '⚠️'
        body = React.createElement('div', { className: 'wsf-err' }, icon + ' ' + preview.error)
      } else if (preview.status === 'ready') {
        if (!preview.content) body = React.createElement('div', { className: 'wsf-empty' }, '（空文件）')
        else if (preview.md) body = React.createElement('div', { className: 'wsf-md', dangerouslySetInnerHTML: { __html: renderMarkdown(preview.content) } })
        else body = React.createElement('div', { className: 'wsf-code', dangerouslySetInnerHTML: { __html: codeToHtml(preview.content, preview.lang) } })
      }
      return React.createElement('div', { className: 'wsf-preview-column' },
        head,
        React.createElement('div', { className: 'wsf-scroll' }, body))
    }

    function PanelInner(props) {
      const sessions = props.useSessions ? props.useSessions(function (s) { return s }) : null
      const currentRow = sessions && sessions.current && sessions.byId ? sessions.byId[sessions.current] : null
      const cwd = currentRow && typeof currentRow.cwd === 'string' && currentRow.cwd ? currentRow.cwd : null

      const [rootInfo, setRootInfo] = React.useState(null)
      const [rootError, setRootError] = React.useState(null)
      const [selected, setSelected] = React.useState(null)
      const [preview, setPreview] = React.useState(null)
      const [pos, setPos] = React.useState(null)
      const [size, setSize] = React.useState({ w: 560, h: 480 })
      const [refreshKey, setRefreshKey] = React.useState(0)
      const [drag, setDrag] = React.useState(null)
      const [resize, setResize] = React.useState(null)

      React.useEffect(function () {
        let alive = true
        setRootInfo(null)
        setRootError(null)
        setSelected(null)
        setPreview(null)
        apiPost('/api/wsf-explorer/root', { cwd }).then(function (res) {
          if (!alive) return
          if (res && res.ok) setRootInfo({ path: res.path })
          else setRootError((res && res.error) || '无法确定工作区根目录')
        }).catch(function (err) {
          if (alive) setRootError(String((err && err.message) || err))
        })
        return function () { alive = false }
      }, [cwd])

      function openPreview(path, name) {
        latestPath = path
        setSelected({ path, name })
        setPreview({ status: 'loading' })
        apiPost('/api/wsf-explorer/read', { cwd, path }).then(function (res) {
          if (latestPath !== path) return
          if (!res) { setPreview({ status: 'error', error: '读取失败' }); return }
          if (!res.ok) { setPreview({ status: 'error', error: res.error || '读取失败', binary: !!res.binary, size: res.size }); return }
          setPreview({ status: 'ready', content: res.content || '', md: isMarkdown(name), lang: languageOf(name), size: res.size })
        }).catch(function (err) {
          if (latestPath === path) setPreview({ status: 'error', error: String((err && err.message) || err) })
        })
      }

      function startDrag(e) {
        const panel = e.currentTarget.parentElement
        const rect = panel.getBoundingClientRect()
        e.currentTarget.setPointerCapture(e.pointerId)
        setDrag({ startX: e.clientX, startY: e.clientY, baseLeft: rect.left, baseTop: rect.top })
      }
      function moveDrag(e) {
        if (!drag) return
        setPos({ left: Math.round(drag.baseLeft + e.clientX - drag.startX), top: Math.round(drag.baseTop + e.clientY - drag.startY) })
      }
      function endDrag() { setDrag(null) }

      function startResize(e) {
        const panel = e.currentTarget.parentElement
        const rect = panel.getBoundingClientRect()
        e.currentTarget.setPointerCapture(e.pointerId)
        setResize({ startX: e.clientX, startY: e.clientY, baseW: rect.width, baseH: rect.height })
      }
      function moveResize(e) {
        if (!resize) return
        setSize({ w: clamp(resize.baseW + e.clientX - resize.startX, 400, 1400), h: clamp(resize.baseH + e.clientY - resize.startY, 280, 900) })
      }
      function endResize() { setResize(null) }
      function stopProp(e) { e.stopPropagation() }

      const panelStyle = { width: size.w, height: size.h }
      if (pos) { panelStyle.left = pos.left; panelStyle.top = pos.top }
      const panelCls = 'wsf-panel' + (pos ? '' : ' wsf-panel-default')

      const tree = rootError
        ? React.createElement('div', { className: 'wsf-err' }, rootError)
        : rootInfo
          ? React.createElement(TreeItem, {
              key: rootInfo.path,
              entry: { name: rootName(rootInfo.path), path: rootInfo.path, isDir: true, size: null },
              depth: 0,
              selectedPath: selected ? selected.path : null,
              onSelect: openPreview,
              refreshKey,
              cwd,
              startExpanded: true,
            })
          : React.createElement('div', { className: 'wsf-loading' }, '正在读取工作区…')

      return React.createElement('div', { className: 'wsf-root wsf-viewport' },
        React.createElement('div', { className: panelCls, style: panelStyle },
          React.createElement('div', {
            className: 'wsf-titlebar',
            onPointerDown: startDrag,
            onPointerMove: moveDrag,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
          },
            React.createElement('span', { className: 'wsf-ico wsf-ico-dir' }, FolderIcon),
            React.createElement('span', { className: 'wsf-title' }, '工作区文件'),
            rootInfo ? React.createElement('span', { className: 'wsf-rootname', title: rootInfo.path }, rootInfo.path) : null,
            React.createElement('span', { className: 'wsf-spacer' }),
            React.createElement('button', { type: 'button', className: 'wsf-iconbtn', title: '刷新', onPointerDown: stopProp, onClick: function () { setRefreshKey(function (k) { return k + 1 }) } }, RefreshIcon),
            React.createElement('button', { type: 'button', className: 'wsf-iconbtn', title: '关闭', onPointerDown: stopProp, onClick: props.onClose }, CloseIcon)),
          React.createElement('div', { className: 'wsf-body' },
            React.createElement('div', { className: 'wsf-tree' }, tree),
            React.createElement(PreviewBody, { preview, selected })),
          React.createElement('div', {
            className: 'wsf-resize',
            onPointerDown: startResize,
            onPointerMove: moveResize,
            onPointerUp: endResize,
            onPointerCancel: endResize,
          })
        )
      )
    }

    function FilePanel(props) {
      const store = props.store
      const [, force] = React.useState(0)
      React.useEffect(function () {
        return store.subscribe(function () { force(function (v) { return v + 1 }) })
      }, [store])
      if (!store.open) return null
      return React.createElement(PanelInner, { onClose: function () { store.toggle() }, useSessions: props.useSessions })
    }

    function ToggleButton(props) {
      const store = props.store
      const [, force] = React.useState(0)
      React.useEffect(function () {
        return store.subscribe(function () { force(function (v) { return v + 1 }) })
      }, [store])
      const cls = 'wsf-hbtn' + (store.open ? ' wsf-hbtn-on' : '')
      return React.createElement('button', { type: 'button', className: cls, title: '显示/隐藏工作区文件面板', 'aria-pressed': store.open, onClick: function () { store.toggle() } },
        FolderIcon,
        React.createElement('span', null, '工作区文件'))
    }

    let latestPath = null

    var inject = ['slots']

    function apply(ctx) {
      const listeners = new Set()
      const store = {
        open: true,
        toggle() {
          store.open = !store.open
          listeners.forEach(function (fn) { try { fn() } catch (e) {} })
        },
        subscribe(fn) {
          listeners.add(fn)
          return function () { listeners.delete(fn) }
        },
      }

      ctx.slots.inject('shell.overlay', function () {
        return ctx.slots.register(
          { name: 'shell.overlay', id: 'wsf-explorer-panel', order: 20, label: function () { return '工作区文件' } },
          function (props) { return React.createElement(FilePanel, { store, useSessions: props ? props.useSessions : null }) }
        )
      })

      ctx.slots.inject('conversation.session.header.actions', function () {
        return ctx.slots.register(
          { name: 'conversation.session.header.actions', id: 'wsf-explorer-toggle', order: 10, label: function () { return '工作区文件' } },
          function () { return React.createElement(ToggleButton, { store }) }
        )
      })
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
