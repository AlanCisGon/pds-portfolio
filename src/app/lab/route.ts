import { NextRequest } from "next/server";
import { checkLabAuth, LAB_HEADERS, labManifest } from "@/utils/labAuth";

export const dynamic = "force-dynamic";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET(request: NextRequest) {
  const denied = checkLabAuth(request.headers.get("authorization"));
  if (denied) return denied;

  const items = [...labManifest]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(
      (entry) => `
      <li>
        <a href="/lab/${encodeURIComponent(entry.slug)}">${escapeHtml(entry.title)}</a>
        <p>${escapeHtml(entry.description)}</p>
        <time datetime="${escapeHtml(entry.createdAt)}">${escapeHtml(entry.createdAt)}</time>
      </li>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow, noarchive"/>
<title>Lab</title>
<style>
  :root { color-scheme: light dark; --bg: #fafafa; --fg: #1a1a1a; --muted: #666; --line: #e2e2e2; --accent: #3b5bdb; }
  @media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #ededed; --muted: #9a9a9a; --line: #2a2a2a; --accent: #8ca3ff; } }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
  main { max-width: 720px; margin: 0 auto; padding: 48px 16px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  header p { color: var(--muted); margin: 0 0 32px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { border-top: 1px solid var(--line); padding: 16px 0; }
  a { color: var(--accent); font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
  li p { margin: 4px 0; }
  time { color: var(--muted); font-size: 14px; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Lab</h1>
    <p>Artefactos privados · ${labManifest.length}</p>
  </header>
  <ul>${items}</ul>
</main>
</body>
</html>`;

  return new Response(html, {
    headers: { ...LAB_HEADERS, "Content-Type": "text/html; charset=utf-8" },
  });
}
