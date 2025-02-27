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
    const startIndex = (page - 1) * 9;
    const endIndex = startIndex + 9;
    const channels = allChannels.slice(startIndex, endIndex);
    
    // Create a dynamic image with the channels
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            backgroundColor: '#111827',
            padding: '40px 20px',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textAlign: 'center' }}>
            New Farcaster Channels
          </h1>
          <p style={{ fontSize: '24px', margin: '0 0 40px 0', color: '#9ca3af' }}>
            Page {page}
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            width: '100%',
            maxWidth: '1000px'
          }}>
            {channels.map((channel, index) => (
              <div key={index} style={{ 
                backgroundColor: '#1f2937',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '40px',
                  backgroundColor: '#374151',
                  marginBottom: '12px',
                  backgroundImage: channel.imageUrl ? `url(${channel.imageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <h2 style={{ 
                  fontSize: '20px', 
                  margin: '0 0 8px 0',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {channel.name}
                </h2>
                <p style={{ fontSize: '16px', margin: 0, color: '#9ca3af' }}>
                  {channel.memberCount} members
                </p>
              </div>
            ))}
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
    
    // Return a fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#111827',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
            Error Loading Channels
          </h1>
          <p style={{ fontSize: '24px', margin: 0, color: '#9ca3af' }}>
            Please try again later
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

// Set proper cache headers
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour 