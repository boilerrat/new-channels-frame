import { Suspense } from "react";
import { Metadata } from "next";
import { fetchChannels } from "@/lib/api/channels";
import { ChannelGrid } from "@/components/channel-grid";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app";
  
  // Fetch channels for the first page
  const allChannels = await fetchChannels();
  const topChannels = allChannels.slice(0, 3);
  const topChannelNames = topChannels.map(c => c.name).join(", ");
  
  // Create a simple image URL with the page number and some channel names
  const imageUrl = `https://placehold.co/1200x630/111827/FFFFFF/png?text=New+Farcaster+Channels+-+Page+1%0AChannels:+${encodeURIComponent(topChannelNames)}`;
  
  return {
    title: "Farcaster Channels Frame",
    description: "Discover popular Farcaster channels",
    openGraph: {
      title: "Farcaster Channels Frame",
      description: "Discover popular Farcaster channels",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Farcaster Channels Frame",
        },
      ],
    },
    other: {
      // Frame metadata
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": `${baseUrl}/api/frame`,
      "fc:frame:button:1": "",
      "fc:frame:button:2": "Next",
      "fc:frame:state": "page:1",
    },
  };
}

export default async function Home() {
  // Fetch channels on the server
  const channels = await fetchChannels();
  
  // Generate frame metadata
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app";
  const topChannels = channels.slice(0, 3);
  const topChannelNames = topChannels.map(c => c.name).join(", ");
  const imageUrl = `https://placehold.co/1200x630/111827/FFFFFF/png?text=New+Farcaster+Channels+-+Page+1%0AChannels:+${encodeURIComponent(topChannelNames)}`;
  
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Farcaster Channel Explorer
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover new channels on Farcaster. Browse, explore, and find your next favorite community.
          </p>
        </div>
      </header>
      
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">New Channels</h2>
            <p className="text-gray-500">
              Channels created in the last 24 hours. Explore the newest communities on Farcaster.
            </p>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            }>
              <ChannelGrid initialChannels={channels.slice(0, 9)} />
            </Suspense>
          </div>
        </div>
      </section>
      
      <section className="mb-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">About This Frame</h2>
        <p className="mb-4">
          This is a Farcaster Frame that showcases popular channels on the Farcaster network.
          You can embed this frame in your Farcaster posts to let users browse channels directly from their feed.
        </p>
        <div className="bg-gray-100 p-4 rounded-md">
          <code className="text-sm break-all">
            {`<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="${imageUrl}" />
<meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />`}
          </code>
        </div>
      </section>
    </main>
  );
}
