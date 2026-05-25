import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const distDir = resolve(root, 'dist')
const indexFile = join(distDir, 'index.html')
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 5173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function resolveAsset(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const normalizedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const requestedFile = resolve(distDir, `.${normalizedPath}`)

  if (!requestedFile.startsWith(distDir)) {
    return null
  }

  if (existsSync(requestedFile) && statSync(requestedFile).isFile()) {
    return requestedFile
  }

  return indexFile
}

const server = createServer((req, res) => {
  const file = resolveAsset(req.url || '/')

  if (!file || !existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
    return
  }

  res.writeHead(200, {
    'Cache-Control': file === indexFile ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': contentTypes[extname(file)] || 'application/octet-stream',
  })

  createReadStream(file).pipe(res)
})

server.listen(port, host, () => {
  console.log(`Calculator serving ${distDir} at http://${host}:${port}`)
})
