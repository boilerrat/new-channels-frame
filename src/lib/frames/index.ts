// Import nothing from @farcaster/core since we're implementing our own validation
// No need for these: import { FrameRequest, Message } from '@farcaster/core';

export interface FrameData {
  buttonIndex?: number;
  inputText?: string;
  state?: string;
}

export interface ValidatedFrameMessage {
  isValid: boolean;
  message?: string;
  frameData: FrameData;
}

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
 * Simple Farcaster frame validation
 */
export async function validateFrameMessage(payload: any): Promise<ValidatedFrameMessage | null> {
  try {
    if (!payload) {
      console.error("No payload provided");
      return null;
    }
    
    // Extract trusted and untrusted data from the payload
    const { untrustedData } = payload;
    
    if (!untrustedData) {
      console.error("No untrustedData in payload");
      return null;
    }
    
    // Extract important fields
    const { buttonIndex, inputText, state } = untrustedData;
    
    // Create frame data object
    const frameData: FrameData = {
      buttonIndex: buttonIndex ? Number(buttonIndex) : undefined,
      inputText: inputText || undefined,
      state: state || undefined
    };
    
    return {
      isValid: true,
      frameData
    };
  } catch (error) {
    console.error("Error validating frame message:", error);
    return null;
  }
}