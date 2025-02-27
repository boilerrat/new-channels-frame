import { Channel } from "@/types/channel";

const CHANNELS_API_URL = "https://data.hubs.neynar.com/api/queries/1049/results.json?api_key=PiIHNfmLRf8rEhvFWkqqZHtW95GgSrQse7MPMmix";

/**
 * Fetches channels data from the Neynar API
 * @returns Promise<Channel[]> - A promise that resolves to an array of channels
 */
export async function fetchChannels(): Promise<Channel[]> {
  try {
    const response = await fetch(CHANNELS_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we have the expected data structure
    if (!data.query_result?.data?.rows) {
      console.error("Unexpected API response structure:", data);
      return [];
    }
    
    // Log raw data for debugging
    console.log("Raw API response first row:", data.query_result.data.rows[0]);
    
    // Transform the API response to match our Channel interface
    const channels: Channel[] = data.query_result.data.rows.map((row: Record<string, unknown>) => {
      // Generate a unique ID if channel has duplicate entries
      const uniqueId = `${row["Channel ID"]}-${Math.random().toString(36).substring(2, 6)}`;
      
      return {
        id: row["Channel ID"] as string || uniqueId,
        name: row["Channel ID"] as string || "Unnamed Channel", // Using Channel ID as name if not available
        description: row["Description"] as string || "",
        imageUrl: row["Image URL"] as string || "",
        host: {
          fid: 0, // Not provided in this API response
          username: row["Channel Creator"] as string || "",
          displayName: row["Channel Creator"] as string || "Unknown",
          pfpUrl: "", // Not provided in this API response
        },
        memberCount: (row["Member Count"] as number) || (row["Follower Count"] as number) || 0,
        warpcastUrl: row["Channel URL"] as string || `https://warpcast.com/~/channel/${row["Channel ID"]}`,
      };
    });

    // Remove duplicate channels (same Channel ID)
    const uniqueChannels = channels.reduce((acc: Channel[], current: Channel) => {
      const isDuplicate = acc.find(item => item.id === current.id);
      if (!isDuplicate) {
        return [...acc, current];
      }
      return acc;
    }, []);

    // Log the first channel to help with debugging
    if (uniqueChannels.length > 0) {
      console.log("First channel after mapping:", uniqueChannels[0]);
    } else {
      console.log("No channels returned from API");
    }

    return uniqueChannels;
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
} 