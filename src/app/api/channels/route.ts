import { NextRequest, NextResponse } from "next/server";
import { fetchChannels } from "@/lib/api/channels";

const ITEMS_PER_PAGE = 9;

export async function GET(request: NextRequest) {
  try {
    // Get page from query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    
    // Fetch all channels
    const allChannels = await fetchChannels();
    
    // Paginate channels
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedChannels = allChannels.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalPages = Math.ceil(allChannels.length / ITEMS_PER_PAGE);
    
    return NextResponse.json({
      channels: paginatedChannels,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error("Error in channels API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
} 