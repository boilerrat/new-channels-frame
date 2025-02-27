import { NextRequest, NextResponse } from "next/server";
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
    
    // Use a simple, reliable image with text
    // Get the top 3 channel names to display in the image
    const topChannelNames = paginatedChannels.slice(0, 3).map(c => c.name).join(", ");
    
    // Create a simple image URL with the page number and some channel names
    const imageUrl = `https://placehold.co/1200x630/111827/FFFFFF/png?text=New+Farcaster+Channels+-+Page+${page}%0AChannels:+${encodeURIComponent(topChannelNames)}`;
    
    // Redirect to the generated image
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a fallback image on error
    return NextResponse.redirect("https://placehold.co/1200x630/111827/FFFFFF/png?text=Error+Loading+Channels");
  }
}

// Set proper cache headers
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour 