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
    const paginatedChannels = allChannels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
    
    // Generate HTML to display
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Farcaster Channels - Page ${page} of ${totalPages}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #1e293b;
              color: white;
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 20px;
              text-align: center;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
            .card {
              background: white;
              border-radius: 8px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              color: #1e293b;
            }
            .card-header {
              height: 60px;
              background: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              padding: 0 16px;
              text-align: center;
              overflow: hidden;
            }
            .card-body {
              padding: 16px;
              flex: 1;
            }
            .card-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .card-text {
              font-size: 14px;
              color: #64748b;
              height: 40px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .card-footer {
              padding: 12px 16px;
              display: flex;
              justify-content: space-between;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #64748b;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #94a3b8;
            }
            .channel-number {
              position: absolute;
              top: 8px;
              right: 8px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              border-radius: 50%;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Farcaster Channels - Page ${page} of ${totalPages}</h1>
            <div class="grid">
              ${paginatedChannels.map((channel, index) => `
                <div class="card">
                  <div class="card-header">
                    ${index + 1}: ${channel.name}
                  </div>
                  <div class="card-body">
                    <div class="card-text">${channel.description || "No description available"}</div>
                  </div>
                  <div class="card-footer">
                    <span>by ${channel.host.displayName}</span>
                    <span>${channel.memberCount.toLocaleString()} members</span>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="footer">
              Press a numbered button to view channel details
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Return the HTML directly
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating HTML:", error);
    
    // Return a simple error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Error</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #dc2626;
              color: white;
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            h1 {
              font-size: 32px;
              margin-bottom: 16px;
            }
            p {
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <h1>Error Loading Channels</h1>
          <p>Please try again later</p>
        </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}

// Set dynamic behavior
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute