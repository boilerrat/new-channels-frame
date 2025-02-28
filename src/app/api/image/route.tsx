import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";

// Simple HTML template generator for the channels frame
function generateHtmlTemplate(channels: any[], page: number, totalPages: number) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Farcaster Channels - Page ${page} of ${totalPages}</title>
        <style>
          body {
            margin: 0;
            padding: 40px;
            background-color: #1e293b;
            font-family: Arial, sans-serif;
            width: 1200px;
            height: 630px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
          }
          h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 32px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            flex: 1;
          }
          .card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
          }
          .card-image {
            height: 100px;
            background: #f1f5f9;
            position: relative;
          }
          .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .card-content {
            padding: 12px;
          }
          .card-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .card-description {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <h1>New Farcaster Channels - Page ${page} of ${totalPages}</h1>
        <div class="grid">
          ${channels.map(channel => `
            <div class="card">
              <div class="card-image">
                ${channel.imageUrl ? `<img src="${channel.imageUrl}" alt="${channel.name}" />` : ''}
              </div>
              <div class="card-content">
                <h3 class="card-title">${channel.name}</h3>
                <p class="card-description">${channel.description || "No description available"}</p>
                <div class="card-footer">
                  <span>by ${channel.host.displayName}</span>
                  <span>${channel.memberCount.toLocaleString()} members</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
  return html;
}

// Error HTML template
function generateErrorHtml() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Error</title>
        <style>
          body {
            margin: 0;
            padding: 40px;
            background-color: #1e293b;
            font-family: Arial, sans-serif;
            width: 1200px;
            height: 630px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
          }
          h1 {
            color: white;
            text-align: center;
            font-size: 32px;
          }
          p {
            color: #94a3b8;
            font-size: 18px;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <h1>Error Loading Channels</h1>
        <p>Please try again later</p>
      </body>
    </html>
  `;
}

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
    
    // Generate HTML for the screenshot
    const html = generateHtmlTemplate(paginatedChannels, page, totalPages);
    
    // Create URL for the Cloudinary API (using the URLify HTML approach)
    const cloudinaryUrl = `https://res.cloudinary.com/demo/image/url/w_1200,h_630,c_fit,q_auto,f_auto/https://api.screenshotone.com/take?url=data:text/html;charset=utf-8,${encodeURIComponent(html)}&viewport_width=1200&viewport_height=630&format=png&access_key=TzXZSNTOJlYHRZDH5rraNTDSe5o2`;
    
    // Redirect to the Cloudinary URL
    return NextResponse.redirect(cloudinaryUrl);
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Generate error HTML
    const errorHtml = generateErrorHtml();
    
    // Create URL for the Cloudinary API with error HTML
    const fallbackUrl = `https://res.cloudinary.com/demo/image/url/w_1200,h_630,c_fit,q_auto,f_auto/https://api.screenshotone.com/take?url=data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}&viewport_width=1200&viewport_height=630&format=png&access_key=TzXZSNTOJlYHRZDH5rraNTDSe5o2`;
    
    // Redirect to the fallback Cloudinary URL
    return NextResponse.redirect(fallbackUrl);
  }
}

// Set dynamic behavior for revalidation
export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes