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
    
    // Get top channel names for display
    const channelsList = paginatedChannels
      .slice(0, 5)
      .map(c => c.name)
      .join(", ");
    
    // Generate a placeholder image with proper dimensions for Farcaster frames
    // Use reliable placehold.co which works well with Netlify
    const title = `New Farcaster Channels - Page ${page} of ${totalPages}`;
    const description = `Featured: ${channelsList}`;
    
    // Create text for the placeholder that includes title and channels
    const placeholderText = encodeURIComponent(`${title}\n\n${description}`);
    
    // Use a simple placeholder service with text overlay
    const imageUrl = `https://placehold.co/1200x630/1e293b/ffffff?text=${placeholderText}`;
    
    // Redirect to the image URL
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Create a fallback image URL for error state
    const fallbackUrl = `https://placehold.co/1200x630/dc2626/ffffff?text=Error+Loading+Channels`;
    
    // Redirect to the fallback image
    return NextResponse.redirect(fallbackUrl);
  }
}

// Set dynamic behavior for revalidation
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute