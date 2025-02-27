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
    
    // Create a dynamic image using Cloudinary's text overlay features
    // This is more reliable than the ImageResponse API on Netlify
    
    // Base URL for Cloudinary
    const cloudinaryBaseUrl = "https://res.cloudinary.com/demo/image/upload";
    
    // Create a background with text overlays for each channel
    let imageUrl = `${cloudinaryBaseUrl}/w_1200,h_630,c_fill,g_center,b_rgb:111827/l_text:Arial_64_bold:New%20Farcaster%20Channels%20-%20Page%20${page},co_white,c_fit,w_800/fl_layer_apply,g_north,y_80`;
    
    // Add channel names as text overlays
    paginatedChannels.forEach((channel, index) => {
      const row = Math.floor(index / 3); // 3 columns
      const col = index % 3;
      const x = -300 + (col * 300); // Adjust x position based on column
      const y = 50 + (row * 120);   // Adjust y position based on row
      
      // Add channel name
      imageUrl += `/l_text:Arial_24_bold:${encodeURIComponent(channel.name)},co_white,c_fit,w_250/fl_layer_apply,g_center,x_${x},y_${y}`;
      
      // Add member count below name
      imageUrl += `/l_text:Arial_18:${channel.memberCount}%20members,co_rgb:9ca3af,c_fit,w_250/fl_layer_apply,g_center,x_${x},y_${y + 30}`;
    });
    
    // Add pagination info at the bottom
    imageUrl += `/l_text:Arial_24:Page%20${page}%20of%20${totalPages},co_white,c_fit,w_300/fl_layer_apply,g_south,y_50`;
    
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