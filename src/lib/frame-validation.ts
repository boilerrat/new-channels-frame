import { z } from "zod";

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
  }),
  trustedData: z.object({
    messageBytes: z.string(),
  }).optional(),
});

// Type for the validated frame message
export type FrameMessage = z.infer<typeof FrameMessageSchema>;

/**
 * Validates a frame message using zod
 * @param body - The request body to validate
 * @returns The validated frame message or null if validation fails
 */
export function validateFrameMessage(body: unknown): FrameMessage | null {
  try {
    return FrameMessageSchema.parse(body);
  } catch (error) {
    console.error("Frame validation error:", error);
    return null;
  }
} 