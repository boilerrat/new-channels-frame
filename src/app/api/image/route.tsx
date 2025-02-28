import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";

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
    
    // Create channel info for display
    const channelInfo = paginatedChannels.map((channel, index) => {
      return `${index + 1}: ${channel.name}`;
    }).join('\n');
    
    // Create text for the image
    const titleText = `New Farcaster Channels - Page ${page} of ${totalPages}`;
    const instructionText = "Press a button to select a channel";
    const combinedText = encodeURIComponent(`${titleText}\n\n${channelInfo}\n\n${instructionText}`);
    
    // Generate an image with the grid of channels
    const imageUrl = `https://placehold.co/1200x630/1e293b/ffffff?text=${combinedText}`;
    
    // Redirect to the image
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Generate a fallback image on error
    const fallbackText = encodeURIComponent("Error Loading Channels\n\nPlease try again later");
    const fallbackUrl = `https://placehold.co/1200x630/dc2626/ffffff?text=${fallbackText}`;
    
    return NextResponse.redirect(fallbackUrl);
  }
}

// Set dynamic behavior
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute