import { NextRequest } from "next/server";
import { fetchChannels } from "@/lib/api/channels";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Get page from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    
    // Fetch channels for the current page
    const allChannels = await fetchChannels();
    const ITEMS_PER_PAGE = 9;
    
    // Calculate pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedChannels = allChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
    
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
          <h1 style={{ fontSize: "32px", marginBottom: "20px", textAlign: "center" }}>
            New Farcaster Channels - Page {page} of {totalPages}
          </h1>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "16px",
            width: "100%",
            maxWidth: "1200px"
          }}>
            {paginatedChannels.map((channel, index) => (
              <div key={channel.id} style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                color: "#1e293b",
                position: "relative"
              }}>
                <div style={{
                  height: "60px",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  padding: "0 16px",
                  textAlign: "center",
                  overflow: "hidden"
                }}>
                  {index + 1}: {channel.name}
                </div>
                <div style={{ padding: "16px", flex: 1 }}>
                  <div style={{
                    fontSize: "14px",
                    color: "#64748b",
                    height: "40px",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {channel.description || "No description available"}
                  </div>
                </div>
                <div style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #eee",
                  fontSize: "12px",
                  color: "#64748b"
                }}>
                  <span>by {channel.host.displayName}</span>
                  <span>{channel.memberCount.toLocaleString()} members</span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            textAlign: "center", 
            marginTop: "20px", 
            fontSize: "14px", 
            color: "#94a3b8" 
          }}>
            Press a numbered button to view channel details
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    
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
            Error Loading Channels
          </h1>
          <p style={{ fontSize: "18px" }}>Please try again later</p>
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