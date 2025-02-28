import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farcaster Channels Frame",
  description: "Discover popular Farcaster channels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app";
  const imageUrl = `${baseUrl}/api/image?page=1`;

  return (
    <html lang="en">
      <head>
        {/* Farcaster Frame meta tags - added directly to ensure proper format */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={imageUrl} />
        <meta property="fc:frame:post_url" content={`${baseUrl}/api/frame`} />
        <meta property="fc:frame:button:1" content="" />
        <meta property="fc:frame:button:2" content="Next ▶️" />
        <meta property="fc:frame:button:3" content="Channel 1" />
        <meta property="fc:frame:button:4" content="Channel 2" />
        <meta property="fc:frame:state" content="page:1" />
      </head>
      <body className={inter.className}>
        <NuqsAdapter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
