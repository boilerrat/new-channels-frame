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
    
    // Get channel names for the first 3 channels to display
    const topChannels = paginatedChannels.slice(0, 3).map(c => c.name).join(", ");
    
    // Use og.th.gl for reliable Open Graph image generation
    // Documentation: https://github.com/vercel-labs/og-image
    const ogImageUrl = new URL("https://og.th.gl");
    
    // Set parameters for the OG image
    ogImageUrl.searchParams.set("title", `New Farcaster Channels`);
    ogImageUrl.searchParams.set("subtitle", `Page ${page} of ${totalPages}`);
    ogImageUrl.searchParams.set("description", `Featured: ${topChannels}`);
    ogImageUrl.searchParams.set("theme", "dark");
    ogImageUrl.searchParams.set("bgColor", "1e293b");
    ogImageUrl.searchParams.set("authorName", "Farcaster Channels Explorer");
    
    // Add a timestamp to prevent caching issues
    ogImageUrl.searchParams.set("t", Date.now().toString());
    
    // Redirect to the generated image URL
    return NextResponse.redirect(ogImageUrl.toString());
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Create a fallback OG image URL for error state
    const fallbackUrl = new URL("https://og.th.gl");
    fallbackUrl.searchParams.set("title", "Error Loading Channels");
    fallbackUrl.searchParams.set("subtitle", "Please try again later");
    fallbackUrl.searchParams.set("theme", "dark");
    fallbackUrl.searchParams.set("bgColor", "dc2626");
    
    // Redirect to the fallback image
    return NextResponse.redirect(fallbackUrl.toString());
  }
}

// Set dynamic behavior for revalidation
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute