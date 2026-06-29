import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const baseUrl = process.env.YOUBASE_URL?.trim()?.replace(/\/+$/, "");

  if (!baseUrl) {
    return NextResponse.json({ error: "Missing YOUBASE_URL" }, { status: 500 });
  }

  const videoApiUrl = `${baseUrl}/api/public/videos/play/${id}`;

  try {
    const upstream = await fetch(videoApiUrl, { redirect: "follow" });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("Content-Type") || "video/mp4");
    headers.set("Cache-Control", "public, max-age=86400, immutable");
    headers.set("Accept-Ranges", "bytes");

    const contentLength = upstream.headers.get("Content-Length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 502 });
  }
}
