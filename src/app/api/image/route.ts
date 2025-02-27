import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";

export async function GET(request: NextRequest) {
  try {
    // Get page from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    
    // Fetch channels for the current page (only needed for counting total pages)
    const allChannels = await fetchChannels();
    
    // Use a service like Satori or Vercel OG Image Generation API
    // For now, we'll use a simple placeholder with the page number
    const imageUrl = `https://placehold.co/1200x630/111827/FFFFFF/png?text=New+Farcaster+Channels+-+Page+${page}`;
    
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