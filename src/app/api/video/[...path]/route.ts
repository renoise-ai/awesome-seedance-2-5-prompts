import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Proxy for upstream media (videos and cover images) stored in our own R2.
 *
 * The path segments mirror the storage key, e.g. `seedance/videos/<id>.mp4`,
 * matching the upstream `/api/public/media/:path{.+}` route. Proxying rather
 * than linking keeps the API host server-side only, as DEPLOY.md requires.
 * Upstream answers with a 302 to a presigned URL, so the fetch must follow
 * redirects to reach the bytes.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const baseUrl = (process.env.PROMPTS_LIB_URL?.trim() || process.env.YOUBASE_URL?.trim())
    ?.replace(/\/+$/, "");

  if (!baseUrl) {
    return NextResponse.json({ error: "Missing PROMPTS_LIB_URL" }, { status: 500 });
  }

  const key = path.map(encodeURIComponent).join("/");
  const mediaUrl = `${baseUrl}/api/public/media/${key}`;

  try {
    const upstream = await fetch(mediaUrl, { redirect: "follow" });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      upstream.headers.get("Content-Type") || "application/octet-stream",
    );
    headers.set("Cache-Control", "public, max-age=86400, immutable");
    headers.set("Accept-Ranges", "bytes");

    const contentLength = upstream.headers.get("Content-Length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 502 });
  }
}
