import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "100px",
              padding: "8px 24px",
              fontSize: "20px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <span>🎬</span>
            <span>500+ prompts · Updated daily</span>
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Awesome Seedance 2.5
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Prompts
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.5,
              marginTop: "8px",
            }}
          >
            The largest community-curated AI video prompt library with playable previews
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              fontSize: "22px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span>Powered by</span>
            <span style={{ color: "#ffffff", fontWeight: 700 }}>Renoise</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
