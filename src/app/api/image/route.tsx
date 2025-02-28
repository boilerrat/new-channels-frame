import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import { fetchChannels } from "@/lib/api/channels";
import path from "path";

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
    
    // Create a canvas for the image
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);
    
    // Draw title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`New Farcaster Channels - Page ${page} of ${totalPages}`, width / 2, 60);
    
    // Grid layout constants
    const gridCols = 3;
    const gridRows = 3;
    const cardWidth = 320;
    const cardHeight = 160;
    const marginX = 60;
    const marginY = 100;
    const gapX = (width - (cardWidth * gridCols) - (marginX * 2)) / (gridCols - 1);
    const gapY = 20;
    
    // Draw each channel card
    for (let i = 0; i < paginatedChannels.length; i++) {
      const channel = paginatedChannels[i];
      
      // Calculate grid position
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);
      const x = marginX + (col * (cardWidth + gapX));
      const y = marginY + (row * (cardHeight + gapY));
      
      // Draw card background
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, cardHeight, 8);
      ctx.fill();
      
      // Try to load channel image
      try {
        if (channel.imageUrl) {
          const img = await loadImage(channel.imageUrl);
          // Draw image at the top portion of the card
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x, y, cardWidth, 80, [8, 8, 0, 0]);
          ctx.clip();
          ctx.drawImage(img, x, y, cardWidth, 80);
          ctx.restore();
        } else {
          // Draw placeholder if no image
          ctx.fillStyle = "#f1f5f9";
          ctx.beginPath();
          ctx.roundRect(x, y, cardWidth, 80, [8, 8, 0, 0]);
          ctx.fill();
        }
      } catch (err) {
        // Fallback if image fails to load
        ctx.fillStyle = "#f1f5f9";
        ctx.beginPath();
        ctx.roundRect(x, y, cardWidth, 80, [8, 8, 0, 0]);
        ctx.fill();
      }
      
      // Channel name
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "left";
      const channelName = channel.name.length > 25 ? channel.name.substring(0, 22) + "..." : channel.name;
      ctx.fillText(channelName, x + 12, y + 100);
      
      // By creator
      ctx.fillStyle = "#64748b";
      ctx.font = "12px Arial";
      const creatorName = channel.host.displayName.length > 15 ? 
        channel.host.displayName.substring(0, 12) + "..." : 
        channel.host.displayName;
      ctx.fillText(`by ${creatorName}`, x + 12, y + 125);
      
      // Member count
      ctx.fillStyle = "#64748b";
      ctx.font = "12px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`${channel.memberCount.toLocaleString()} members`, x + cardWidth - 12, y + 125);
      
      // Optional description preview
      if (channel.description) {
        ctx.fillStyle = "#64748b";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        const descText = channel.description.length > 45 ? 
          channel.description.substring(0, 42) + "..." : 
          channel.description;
        ctx.fillText(descText, x + 12, y + 150);
      }
    }
    
    // Convert canvas to buffer and return as image
    const buffer = canvas.toBuffer("image/png");
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Create a fallback error image
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);
    
    // Draw error message
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Error Loading Channels", width / 2, height / 2);
    ctx.font = "18px Arial";
    ctx.fillText("Please try again later", width / 2, height / 2 + 40);
    
    // Convert canvas to buffer and return as image
    const buffer = canvas.toBuffer("image/png");
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=60, s-maxage=60",
      },
    });
  }
}

// Set dynamic behavior for revalidation
export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes