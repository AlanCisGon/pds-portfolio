import { LAB_HEADERS, checkLabAuth, labManifest } from "@/utils/labAuth";
import { type NextRequest, NextResponse } from "next/server";

const LAB_HOST = "lab.alancisneros.design";
const SITE_ORIGIN = "https://alancisneros.design";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const onLabHost = request.headers.get("host") === LAB_HOST;
  const underLab = pathname === "/lab" || pathname.startsWith("/lab/");
  // On the lab subdomain, / and /<slug> (e.g. /afinador) map to /lab and /lab/<slug>.
  const slug = pathname.split("/")[1];
  const labPath = pathname === "/" || labManifest.some((entry) => entry.slug === slug);

  // The rest of the site (nav links like /work) lives on the main domain.
  if (onLabHost && !underLab && !labPath) {
    return NextResponse.redirect(`${SITE_ORIGIN}${pathname}${search}`, 308);
  }

  const denied = checkLabAuth(request.headers.get("authorization"));
  if (denied) return denied;

  const response =
    onLabHost && !underLab
      ? NextResponse.rewrite(
          new URL(`/lab${pathname === "/" ? "" : pathname}${search}`, request.url),
        )
      : NextResponse.next();

  // Lab app pages (index, /lab/ui) get the same no-index / no-cache headers as the artifacts.
  for (const [key, value] of Object.entries(LAB_HEADERS)) response.headers.set(key, value);
  return response;
}

export const config = {
  matcher: [
    "/lab",
    "/lab/:path*",
    // Everything on the lab subdomain except Next assets and the shared public files (fonts, images).
    {
      source: "/((?!_next/|api/|fonts/|images/|videos/|favicon.ico).*)",
      has: [{ type: "host", value: "lab.alancisneros.design" }],
    },
  ],
};
