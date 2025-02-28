import { NextRequest } from "next/server";
import { fetchChannels } from "@/lib/api/channels";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Get channel ID from query params
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("id");
    
    if (!channelId) {
      throw new Error("Channel ID is required");
    }
    
    // Fetch all channels
    const allChannels = await fetchChannels();
    
    // Find the requested channel
    const channel = allChannels.find(c => c.id === channelId);
    
    if (!channel) {
      throw new Error(`Channel not found: ${channelId}`);
    }
    
    // Generate image using @vercel/og
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#1e293b",
            color: "white",
            padding: "40px",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            color: "#1e293b",
            width: "100%",
            maxWidth: "800px",
          }}>
            <div style={{
              padding: "24px",
              background: "#f1f5f9",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
              borderBottom: "1px solid #e2e8f0",
            }}>
              {channel.name}
            </div>
            <div style={{
              padding: "32px",
              fontSize: "18px",
              color: "#64748b",
              lineHeight: 1.6,
            }}>
              <p>{channel.description || "No description available"}</p>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "24px",
              }}>
                <div style={{
                  textAlign: "center",
                  flex: 1,
                }}>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                  }}>
                    Members
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}>
                    {channel.memberCount.toLocaleString()}
                  </div>
                </div>
                <div style={{
                  textAlign: "center",
                  flex: 1,
                }}>
                  <div style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    marginBottom: "8px",
                  }}>
                    Created by
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}>
                    {channel.host.displayName}
                  </div>
                </div>
              </div>
              <div style={{
                background: "#3b82f6",
                color: "white",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: "bold",
                marginTop: "20px",
                display: "inline-block",
                textAlign: "center",
                width: "200px",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                Join Channel
              </div>
            </div>
          </div>
          <div style={{
            marginTop: "24px",
            fontSize: "16px",
            color: "#94a3b8",
          }}>
            Press "Back to List" to return to all channels
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating channel detail:", error);
    
    // Return a simple error image
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#dc2626",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
            Channel Not Found
          </h1>
          <p style={{ fontSize: "18px" }}>The requested channel could not be found</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

// Set dynamic behavior
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute