import { NextRequest, NextResponse } from "next/server";
import { checkLabAuth } from "@/utils/labAuth";

export function proxy(request: NextRequest) {
  const denied = checkLabAuth(request.headers.get("authorization"));
  return denied ?? NextResponse.next();
}

export const config = {
  matcher: ["/lab", "/lab/:path*"],
};
