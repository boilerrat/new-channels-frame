interface Channel {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  host: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  };
  memberCount: number;
  warpcastUrl: string;
}

interface ChannelResponse {
  channels: Channel[];
  nextCursor?: string;
}

export type { Channel, ChannelResponse }; 