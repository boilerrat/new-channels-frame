import { getFrameMessage, FrameRequest, FrameValidationData } from '@farcaster/core';

/**
 * Creates a valid Farcaster Frame HTML response
 * @param imageUrl URL of the image to display in the frame
 * @param postUrl URL to post frame actions to
 * @param buttons Array of button text (up to 4 buttons)
 * @param state Optional state to pass to the next frame
 * @returns HTML string for the frame
 */
export function createFrameHtml({
  imageUrl,
  postUrl,
  buttons = [],
  state = "",
  imageAspectRatio = "1.91:1"
}: {
  imageUrl: string;
  postUrl: string;
  buttons?: string[];
  state?: string;
  imageAspectRatio?: "1.91:1" | "1:1";
}): string {
  // Validate inputs
  if (buttons.length > 4) {
    throw new Error("Frames can have at most 4 buttons");
  }

  // Generate frame HTML
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="${imageAspectRatio}" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
        ${buttons.map((text, i) => 
          text ? `<meta property="fc:frame:button:${i + 1}" content="${text}" />` : ''
        ).filter(Boolean).join('\n        ')}
        ${state ? `<meta property="fc:frame:state" content="${state}" />` : ''}
        <title>Farcaster Frame</title>
      </head>
      <body>
        <h1>This is a Farcaster frame. View it on a Farcaster client.</h1>
      </body>
    </html>
  `;
}

/**
 * Validates a Farcaster frame message
 * @param payload The raw request body
 * @returns Validated frame message or null if validation fails
 */
export async function validateFrameMessage(payload: any): Promise<FrameValidationData | null> {
  try {
    // Validate the frame message
    const result = await getFrameMessage(payload);
    
    // If validation succeeded, return the result
    if (result.isValid) {
      return result;
    }
    
    console.error("Invalid frame message:", result.message);
    return null;
  } catch (error) {
    console.error("Error validating frame message:", error);
    return null;
  }
}