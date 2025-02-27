import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Font
    const interSemiBold = await fetch(
      new URL("https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap", request.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            backgroundImage: "linear-gradient(to bottom right, #f0f4f8, #d1e0ed)",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#1a202c",
                marginBottom: "20px",
              }}
            >
              New Channels on Farcaster
            </h1>
            <p
              style={{
                fontSize: "30px",
                color: "#4a5568",
                marginTop: "0",
                marginBottom: "40px",
              }}
            >
              Discover channels created in the last 24 hours
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#805ad5",
                color: "white",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Explore Now
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: interSemiBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
} 