import { NextRequest, NextResponse } from "next/server";
import { checkLabAuth, LAB_HEADERS } from "@/utils/labAuth";

export function proxy(request: NextRequest) {
  const denied = checkLabAuth(request.headers.get("authorization"));
  if (denied) return denied;
  // Lab app pages (index, /lab/ui) get the same no-index / no-cache headers as the artifacts.
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(LAB_HEADERS)) response.headers.set(key, value);
  return response;
}

export const config = {
  matcher: ["/lab", "/lab/:path*"],
};
