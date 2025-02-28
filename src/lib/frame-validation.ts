import { z } from "zod";
import { FrameData, ValidatedFrameMessage } from "./frames";

// Define the schema for frame message validation
export const FrameMessageSchema = z.object({
  untrustedData: z.object({
    fid: z.number(),
    url: z.string().url(),
    messageHash: z.string(),
    timestamp: z.number(),
    network: z.enum(["FARCASTER_NETWORK_MAINNET", "FARCASTER_NETWORK_TESTNET"]),
    buttonIndex: z.number().optional(),
    inputText: z.string().optional(),
    castId: z.object({
      fid: z.number(),
      hash: z.string(),
    }).optional(),
    state: z.string().optional(),
  }),
  trustedData: z.object({
    messageBytes: z.string(),
  }).optional(),
});

/**
 * Simple Farcaster frame validation using Zod
 */
export function validateFrameMessageWithZod(payload: unknown): ValidatedFrameMessage | null {
  try {
    const result = FrameMessageSchema.safeParse(payload);
    
    if (!result.success) {
      console.error("Frame validation error:", result.error);
      return null;
    }
    
    const { untrustedData } = result.data;
    
    // Create frame data object
    const frameData: FrameData = {
      buttonIndex: untrustedData.buttonIndex,
      inputText: untrustedData.inputText,
      state: untrustedData.state
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