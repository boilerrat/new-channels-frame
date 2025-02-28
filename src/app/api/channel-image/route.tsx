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
    
    // Generate HTML for channel detail
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${channel.name}</title>
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
              align-items: center;
              justify-content: center;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              text-align: center;
            }
            .card {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
              color: #1e293b;
              width: 100%;
            }
            .card-header {
              padding: 24px;
              background: #f1f5f9;
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              border-bottom: 1px solid #e2e8f0;
            }
            .card-body {
              padding: 32px;
              font-size: 18px;
              color: #64748b;
              line-height: 1.6;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-top: 24px;
              border-top: 1px solid #e2e8f0;
              padding-top: 24px;
            }
            .info-item {
              text-align: center;
              flex: 1;
            }
            .info-label {
              font-size: 14px;
              color: #94a3b8;
              margin-bottom: 8px;
            }
            .info-value {
              font-size: 20px;
              font-weight: bold;
              color: #1e293b;
            }
            .footer {
              margin-top: 24px;
              font-size: 16px;
              color: #94a3b8;
            }
            .button {
              background: #3b82f6;
              color: white;
              border-radius: 8px;
              padding: 12px 24px;
              font-weight: bold;
              margin-top: 20px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="card-header">
                ${channel.name}
              </div>
              <div class="card-body">
                <p>${channel.description || "No description available"}</p>
                <div class="info-row">
                  <div class="info-item">
                    <div class="info-label">Members</div>
                    <div class="info-value">${channel.memberCount.toLocaleString()}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Created by</div>
                    <div class="info-value">${channel.host.displayName}</div>
                  </div>
                </div>
                <div class="button">
                  Join Channel
                </div>
              </div>
            </div>
            <div class="footer">
              Press "Back to List" to return to all channels
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
    console.error("Error generating channel detail:", error);
    
    // Generate a fallback HTML
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
          <h1>Channel Not Found</h1>
          <p>The requested channel could not be found</p>
        </body>
      </html>
    `;
    
    // Return the error HTML
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