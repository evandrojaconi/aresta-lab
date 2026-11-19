/** Prefixa URLs internas no subdiretório do GitHub Pages. */
export function localHref(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return base.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
}
