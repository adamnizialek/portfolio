import { ImageResponse } from "next/og";

// Static social-preview card. Gives crawlers (LinkedIn, etc.) a flat image to
// embed instead of trying to render the heavy 3D homepage for a thumbnail.
export const alt = "Adam Niziałek — Full-Stack Developer & Creative Technologist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inter, split by subset so the Polish "ł" (latin-ext) and the basic alphabet
// (latin) are both covered at each weight.
const base = "https://cdn.jsdelivr.net/npm/@fontsource/inter@5/files";
const fontUrls = {
  latin400: `${base}/inter-latin-400-normal.woff`,
  latinExt400: `${base}/inter-latin-ext-400-normal.woff`,
  latin800: `${base}/inter-latin-800-normal.woff`,
  latinExt800: `${base}/inter-latin-ext-800-normal.woff`,
};

export default async function Image() {
  const [latin400, latinExt400, latin800, latinExt800] = await Promise.all(
    Object.values(fontUrls).map((u) => fetch(u).then((r) => r.arrayBuffer()))
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#06060e",
          backgroundImage:
            "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(6,182,212,0.12) 45%, rgba(6,6,14,0) 75%)",
          color: "#e8e6f0",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: 10,
            color: "#7a7890",
            marginBottom: 26,
          }}
        >
          PORTFOLIO
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 112,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          Adam Niziałek
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            width: 300,
            height: 12,
            borderRadius: 999,
            backgroundImage: "linear-gradient(90deg, #8b5cf6, #06b6d4, #ec4899)",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 42,
            fontSize: 42,
            fontWeight: 400,
            color: "#b9b7c8",
          }}
        >
          Full-Stack Developer &amp; Creative Technologist
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: latin400, weight: 400, style: "normal" },
        { name: "Inter", data: latinExt400, weight: 400, style: "normal" },
        { name: "Inter", data: latin800, weight: 800, style: "normal" },
        { name: "Inter", data: latinExt800, weight: 800, style: "normal" },
      ],
    }
  );
}
