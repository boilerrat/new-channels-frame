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
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app"}/api/image?page=1`,
    "fc:frame:post_url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://warpcast-new-channels.netlify.app"}/api/frame`,
    "fc:frame:button:1": "",
    "fc:frame:button:2": "Next ▶️",
    "fc:frame:button:3": "Channel 1",
    "fc:frame:button:4": "Channel 2",
    "fc:frame:state": "page:1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
