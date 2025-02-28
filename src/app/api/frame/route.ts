import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";
import { validateFrameMessage } from "@/lib/frame-validation";

const ITEMS_PER_PAGE = 9;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the frame message
    const body = await request.json();
    const frameMessage = validateFrameMessage(body);
    
    if (!frameMessage) {
      return NextResponse.json({ error: "Invalid frame message" }, { status: 400 });
    }
    
    // Extract button index and state from the frame message
    const { buttonIndex } = frameMessage.untrustedData;
    const stateParam = frameMessage.untrustedData.inputText || "";
    
    // Parse state (format: "page:1")
    let page = 1;
    if (stateParam) {
      const stateMatch = stateParam.match(/page:(\d+)/);
      if (stateMatch && stateMatch[1]) {
        page = parseInt(stateMatch[1]);
      }
    }
    
    // Handle button actions
    if (buttonIndex === 1 && page > 1) {
      // Previous page button
      page--;
    } else if (buttonIndex === 2) {
      // Next page button
      page++;
    }
    
    // Fetch channels for the current page
    const allChannels = await fetchChannels();
    const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
    
    // Ensure page is within valid range
    page = Math.max(1, Math.min(page, totalPages));
    
    // Use the proper base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app";
    
    // Use our image API endpoint to generate the frame image
    const imageUrl = `${baseUrl}/api/image?page=${page}`;
    
    // Determine button labels based on pagination
    const buttons = [];
    if (page > 1) {
      buttons.push("Previous");
    } else {
      buttons.push(""); // Empty button for layout consistency
    }
    
    if (page < totalPages) {
      buttons.push("Next");
    } else {
      buttons.push(""); // Empty button for layout consistency
    }
    
    // Generate frame HTML response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          ${buttons[0] ? `<meta property="fc:frame:button:1" content="${buttons[0]}" />` : ""}
          ${buttons[1] ? `<meta property="fc:frame:button:2" content="${buttons[1]}" />` : ""}
          <meta property="fc:frame:state" content="page:${page}" />
          <title>New Channels Frame</title>
          <meta property="og:title" content="New Channels on Farcaster" />
          <meta property="og:image" content="${imageUrl}" />
        </head>
        <body>
          <h1>New Channels Frame</h1>
          <p>This is a Farcaster Frame showing new channels. View this in a Farcaster client.</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error in frame API route:", error);
    return NextResponse.json(
      { error: "Failed to process frame request" },
      { status: 500 }
    );
  }
} 