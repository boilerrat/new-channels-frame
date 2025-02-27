import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

// Define Channel type directly in this file
interface Channel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  host: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  memberCount: number;
  warpcastUrl: string;
}

// Mock fetchChannels if the import is failing
async function fetchChannels(): Promise<Channel[]> {
  try {
    const response = await fetch(
      "https://data.hubs.neynar.com/api/queries/1049/results.json?api_key=PiIHNfmLRf8rEhvFWkqqZHtW95GgSrQse7MPMmix",
      { next: { revalidate: 3600 } }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the API response to our Channel type
    return data.query_result.data.rows.map((row: any) => ({
      id: row["Channel ID"],
      name: row["Channel ID"],
      description: row["Description"] || "",
      imageUrl: row["Image URL"],
      host: {
        fid: 0, // We don't have this info
        username: row["Channel Creator"],
        displayName: row["Channel Creator"],
        pfpUrl: "",
      },
      memberCount: row["Member Count"],
      warpcastUrl: row["Channel URL"],
    }));
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
}

export const runtime = 'edge';

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
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedChannels = allChannels.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
    
    // Generate the image
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
            padding: '40px 20px',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>
            New Farcaster Channels - Page {page}
          </h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px',
            width: '100%',
            maxWidth: '1000px'
          }}>
            {paginatedChannels.map((channel) => (
              <div key={channel.id} style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <img 
                  src={channel.imageUrl || 'https://placehold.co/100x100/374151/FFFFFF/png?text=No+Image'} 
                  width="80" 
                  height="80" 
                  style={{ borderRadius: '50%', marginBottom: '10px' }}
                  alt={channel.name}
                />
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}>
                  {channel.name}
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  {channel.memberCount} members
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            marginTop: '30px', 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>Page {page} of {totalPages}</span>
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
    // Return a fallback image on error
    return NextResponse.redirect("https://placehold.co/1200x630/111827/FFFFFF/png?text=Error+Loading+Channels");
  }
}

// Set proper cache headers
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour 