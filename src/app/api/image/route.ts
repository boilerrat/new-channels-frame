import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";
// @ts-ignore - canvas module doesn't have TypeScript definitions
import { createCanvas, loadImage } from "canvas";

// Define constants for image generation
const WIDTH = 1200;
const HEIGHT = 630;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const PADDING = 20;
const ITEM_MARGIN = 10;

export async function GET(request: NextRequest) {
  try {
    // Get page from query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    
    // Fetch channels for the current page
    const allChannels = await fetchChannels();
    const startIndex = (page - 1) * (GRID_COLS * GRID_ROWS);
    const endIndex = startIndex + (GRID_COLS * GRID_ROWS);
    const channels = allChannels.slice(startIndex, endIndex);
    
    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");
    
    // Draw background
    ctx.fillStyle = "#111827"; // Dark background
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("New Farcaster Channels", WIDTH / 2, 60);
    
    // Draw page indicator
    ctx.font = "30px Arial";
    ctx.fillText(`Page ${page}`, WIDTH / 2, 100);
    
    // Calculate grid item dimensions
    const itemWidth = (WIDTH - (PADDING * 2) - ((GRID_COLS - 1) * ITEM_MARGIN)) / GRID_COLS;
    const itemHeight = (HEIGHT - 150 - (PADDING * 2) - ((GRID_ROWS - 1) * ITEM_MARGIN)) / GRID_ROWS;
    
    // Draw channel grid
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      const row = Math.floor(i / GRID_COLS);
      const col = i % GRID_COLS;
      
      const x = PADDING + (col * (itemWidth + ITEM_MARGIN));
      const y = 150 + (row * (itemHeight + ITEM_MARGIN));
      
      // Draw channel card background
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(x, y, itemWidth, itemHeight);
      
      try {
        // Try to load channel image
        const image = await loadImage(channel.imageUrl || "https://placekitten.com/200/200");
        
        // Draw channel image (square, centered at top of card)
        const imageSize = Math.min(itemWidth - 20, 100);
        const imageX = x + (itemWidth - imageSize) / 2;
        const imageY = y + 15;
        
        // Draw circular image
        ctx.save();
        ctx.beginPath();
        ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
        ctx.restore();
      } catch (error) {
        // Draw placeholder if image fails to load
        ctx.fillStyle = "#374151";
        ctx.fillRect(x + 10, y + 15, itemWidth - 20, 100);
      }
      
      // Draw channel name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        channel.name.length > 15 ? channel.name.substring(0, 15) + "..." : channel.name,
        x + itemWidth / 2,
        y + 140
      );
      
      // Draw member count
      ctx.fillStyle = "#9ca3af";
      ctx.font = "16px Arial";
      ctx.fillText(
        `${channel.memberCount} members`,
        x + itemWidth / 2,
        y + 165
      );
    }
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");
    
    // Return the image
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a fallback image on error
    return NextResponse.redirect("https://placekitten.com/1200/630");
  }
}

// Set proper cache headers
export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour 