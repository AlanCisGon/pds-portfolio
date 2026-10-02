import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";
import { checkLabAuth, LAB_HEADERS, labManifest } from "@/utils/labAuth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const denied = checkLabAuth(request.headers.get("authorization"));
  if (denied) return denied;

  const { slug } = await params;
  // Only slugs listed in the manifest are served (also blocks path traversal).
  const entry = labManifest.find((item) => item.slug === slug);
  if (!entry) {
    return new Response("Not found", { status: 404, headers: LAB_HEADERS });
  }

  const filePath = path.join(process.cwd(), "private", "lab", `${entry.slug}.html`);
  const html = await readFile(filePath, "utf-8");

  return new Response(html, {
    headers: { ...LAB_HEADERS, "Content-Type": "text/html; charset=utf-8" },
  });
}
