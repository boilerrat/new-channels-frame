import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";
import { createFrameHtml, validateFrameMessage } from "@/lib/frames";
import { Channel } from "@/types/channel";

const ITEMS_PER_PAGE = 9;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the frame message
    const frameMessage = await validateFrameMessage(body);
    
    if (!frameMessage) {
      return NextResponse.json({ error: "Invalid frame message" }, { status: 400 });
    }
    
    // Extract button index, input text, and state from the frame message
    const { buttonIndex, inputText, state } = frameMessage.frameData;
    const stateParam = inputText || state || "";
    
    // Parse state (format: "page:1" or "channel:xyz")
    let page = 1;
    let selectedChannelId: string | null = null;
    
    if (stateParam) {
      // Check if we're viewing a specific channel
      const channelMatch = stateParam.match(/channel:(.+)/);
      if (channelMatch && channelMatch[1]) {
        selectedChannelId = channelMatch[1];
      } else {
        // Otherwise parse page number
        const pageMatch = stateParam.match(/page:(\d+)/);
        if (pageMatch && pageMatch[1]) {
          page = parseInt(pageMatch[1]);
        }
      }
    }
    
    // Use base URL for all routes
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app";
    
    // If a channel is selected, show that channel and provide a back button
    if (selectedChannelId) {
      const allChannels = await fetchChannels();
      const channel = allChannels.find(c => c.id === selectedChannelId);
      
      if (!channel) {
        // Channel not found, go back to main list
        return handleMainView(baseUrl, 1);
      }
      
      // If button 1 is pressed (back button), go back to main list
      if (buttonIndex === 1) {
        return handleMainView(baseUrl, page);
      }
      
      // Otherwise, show the channel detail frame
      return handleChannelDetailView(baseUrl, channel, page);
    }
    
    // If no channel is selected, handle the main grid view with pagination and channel selection
    if (buttonIndex !== undefined) {
      if (buttonIndex === 1 && page > 1) {
        // Previous page button
        page--;
      } else if (buttonIndex === 2) {
        // Next page button
        page++;
      } else if (buttonIndex >= 3 && buttonIndex <= 11) {
        // Channel selection buttons (3-11 correspond to channels 0-8)
        const channelIndex = buttonIndex - 3;
        
        // Fetch the channels to get the selected one
        const allChannels = await fetchChannels();
        const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
        
        // Ensure page is within valid range
        page = Math.max(1, Math.min(page, totalPages));
        
        // Calculate which channels are on the current page
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const paginatedChannels = allChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        
        // Get the selected channel
        const selectedChannel = paginatedChannels[channelIndex];
        if (selectedChannel) {
          // Show the channel detail view
          return handleChannelDetailView(baseUrl, selectedChannel, page);
        }
      }
    }
    
    // Handle the main grid view
    return handleMainView(baseUrl, page);
  } catch (error) {
    console.error("Error in frame API route:", error);
    return NextResponse.json(
      { error: "Failed to process frame request" },
      { status: 500 }
    );
  }
}

// Handle the main grid view
async function handleMainView(baseUrl: string, page: number) {
  // Fetch channels for the current page
  const allChannels = await fetchChannels();
  const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
  
  // Ensure page is within valid range
  page = Math.max(1, Math.min(page, totalPages));
  
  // Calculate which channels are on the current page
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedChannels = allChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Use our image API endpoint to generate the frame image
  const imageUrl = `${baseUrl}/api/image?page=${page}`;
  
  // Create navigation buttons
  const buttons = [];
  
  // Previous button
  if (page > 1) {
    buttons.push("◀️ Previous");
  } else {
    buttons.push(""); // Empty button for layout consistency
  }
  
  // Next button
  if (page < totalPages) {
    buttons.push("Next ▶️");
  } else {
    buttons.push(""); // Empty button for layout consistency
  }
  
  // Channel selection buttons - use only channels 1 and 2 to stay within the 4 button limit
  if (paginatedChannels.length > 0) buttons.push(`Channel 1`);
  if (paginatedChannels.length > 1) buttons.push(`Channel 2`);
  
  // Fill remaining buttons with empty strings up to 4 total
  while (buttons.length < 4) {
    buttons.push("");
  }
  
  // Generate frame HTML response
  const html = createFrameHtml({
    imageUrl,
    postUrl: `${baseUrl}/api/frame`,
    buttons: buttons.slice(0, 4), // Only use the first 4 buttons
    state: `page:${page}`
  });
  
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

// Handle the channel detail view
function handleChannelDetailView(baseUrl: string, channel: Channel, returnPage: number) {
  // Create a channel detail image
  const imageUrl = `${baseUrl}/api/channel-image?id=${channel.id}`;
  
  // Generate frame HTML response with a back button
  const html = createFrameHtml({
    imageUrl,
    postUrl: `${baseUrl}/api/frame`,
    buttons: ["◀️ Back to List", `Join ${channel.name}`, "", ""],
    state: `channel:${channel.id}`
  });
  
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}