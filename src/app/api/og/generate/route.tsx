import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { person } from "@/resources";

export const runtime = "nodejs";

// next/og renders outside the CSS cascade, so tokens are literals here.
// Same values as --palette-* in src/styles/tokens.css.
const palette = {
  titanio: "#0E1114",
  grafito: "#171B20",
  aluminio: "#8C96A3",
  niebla: "#E8ECF1",
  cerezo: "#D2734E",
} as const;

const fontsDir = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts");
const readAsset = (...parts: string[]) => readFile(path.join(...parts));

/** Open Graph image (1200 × 630): /api/og/generate?title=… — proposal on brand tokens. */
export async function GET(request: Request) {
  const title = (new URL(request.url).searchParams.get("title") || person.name).slice(0, 120);

  const [regular, semibold, mono, avatar] = await Promise.all([
    readAsset(fontsDir, "geist-sans", "Geist-Regular.ttf"),
    readAsset(fontsDir, "geist-sans", "Geist-SemiBold.ttf"),
    readAsset(fontsDir, "geist-mono", "GeistMono-Regular.ttf"),
    readAsset(process.cwd(), "public", person.avatar),
  ]);
  const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: palette.titanio,
        borderTop: `8px solid ${palette.cerezo}`,
        fontFamily: "Geist",
      }}
    >
      <span
        style={{
          fontFamily: "Geist Mono",
          fontSize: 24,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: palette.aluminio,
        }}
      >
        alancisneros.design
      </span>

      <span
        style={{
          fontSize: 72,
          fontWeight: 600,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          color: palette.niebla,
          textWrap: "balance",
        }}
      >
        {title}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* biome-ignore lint/a11y/useAltText: decorative inside a raster image */}
        <img src={avatarSrc} width={88} height={88} style={{ borderRadius: 999, objectFit: "cover" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 600, color: palette.niebla }}>{person.name}</span>
          <span style={{ fontSize: 24, color: palette.aluminio }}>{person.role}</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    },
  );
}
