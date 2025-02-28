import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";

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
    
    // Generate a nice looking channel detail image
    // Use placehold.co for simplicity
    const title = encodeURIComponent(channel.name);
    const description = encodeURIComponent(channel.description || "No description");
    const memberText = encodeURIComponent(`${channel.memberCount.toLocaleString()} members`);
    const creatorText = encodeURIComponent(`Created by: ${channel.host.displayName}`);
    
    // Combine text for the image
    const imageText = encodeURIComponent(`${channel.name}\n\n${channel.description || "No description"}\n\nMembers: ${channel.memberCount.toLocaleString()}\nCreated by: ${channel.host.displayName}`);
    
    // Create image URL
    const imageUrl = `https://placehold.co/1200x630/1e293b/ffffff?text=${imageText}`;
    
    // Redirect to the image
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error("Error generating channel image:", error);
    
    // Return a fallback image on error
    const fallbackText = encodeURIComponent("Channel not found or error loading channel details");
    const fallbackUrl = `https://placehold.co/1200x630/dc2626/ffffff?text=${fallbackText}`;
    
    return NextResponse.redirect(fallbackUrl);
  }
}

// Set dynamic behavior
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute