import { Channel } from "@/types/channel";

interface FrameMetadata {
  buttons?: string[];
  image: string;
  postUrl: string;
  textInput?: string;
  state?: string;
}

/**
 * Generates HTML metadata for a Farcaster Frame
 * @param metadata - The frame metadata
 * @returns HTML string with frame metadata
 */
export function generateFrameMetadata(metadata: FrameMetadata): string {
  const { buttons, image, postUrl, textInput, state } = metadata;
  
  let html = `
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
  `;

  if (buttons) {
    buttons.forEach((button, index) => {
      html += `<meta property="fc:frame:button:${index + 1}" content="${button}" />\n`;
    });
  }

  if (textInput) {
    html += `<meta property="fc:frame:input:text" content="${textInput}" />\n`;
  }

  if (state) {
    html += `<meta property="fc:frame:state" content="${state}" />\n`;
  }

  return html;
}

/**
 * Generates a channel grid image URL for the frame
 * @param channels - Array of channels to display
 * @param page - Current page number
 * @returns URL for the channel grid image
 */
export function generateChannelGridImageUrl(channels: Channel[], page: number = 1): string {
  // In a real implementation, this would generate or point to a dynamic image
  // For now, we'll use a placeholder URL that would be replaced with actual image generation
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/api/image?page=${page}`;
} 