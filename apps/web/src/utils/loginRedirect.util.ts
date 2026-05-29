/** 登录成功后的回跳路径（来自路由 query.redirect，由 Vue Router 解码） */
export function getPostLoginRedirectPath(redirectQuery: unknown): string {
  const raw = Array.isArray(redirectQuery) ? redirectQuery[0] : redirectQuery
  if (!raw || typeof raw !== 'string') return '/'
  if (raw.includes('%') && !raw.includes('//')) {
    try {
      const decoded = decodeURIComponent(raw)
      if (decoded.startsWith('/')) return decoded
    } catch {
      // ignore
    }
  }
  return raw.startsWith('/') ? raw : '/'
}
