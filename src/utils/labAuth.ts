import { timingSafeEqual } from "node:crypto";
import labEntries from "../../private/lab/lab.json";

export type LabEntry = {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  /** Internal Lab page (e.g. "/lab/ui"). Without it, the entry is a single-file HTML artifact. */
  href?: string;
};

export const labManifest: LabEntry[] = labEntries;

// Headers for every /lab response: never index, never cache on the CDN.
export const LAB_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "private, no-store",
};

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/**
 * Checks HTTP Basic Auth against LAB_USER / LAB_PASSWORD.
 * Returns a Response to send back when access is denied, or null when allowed.
 * Fails closed (503) when the credentials are not configured.
 */
export function checkLabAuth(authorization: string | null): Response | null {
  const user = process.env.LAB_USER;
  const password = process.env.LAB_PASSWORD;

  if (!user || !password) {
    return new Response("Lab is not configured", {
      status: 503,
      headers: LAB_HEADERS,
    });
  }

  if (authorization?.startsWith("Basic ")) {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString();
    const separator = decoded.indexOf(":");
    if (separator !== -1) {
      const userOk = safeEqual(decoded.slice(0, separator), user);
      const passwordOk = safeEqual(decoded.slice(separator + 1), password);
      if (userOk && passwordOk) return null;
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      ...LAB_HEADERS,
      "WWW-Authenticate": 'Basic realm="Lab", charset="UTF-8"',
    },
  });
}
