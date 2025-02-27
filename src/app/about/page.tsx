import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About - Farcaster Channels Frame",
  description: "Learn more about the Farcaster Channels Frame project",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Channels Frame</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-4">
            Channels Frame is a Next.js application that showcases popular Farcaster channels using Farcaster Frames v2. 
            This project allows users to browse and discover channels directly within Farcaster clients that support Frames.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What is Farcaster?</h2>
          <p className="mb-4">
            Farcaster is a sufficiently decentralized social network built on Ethereum. 
            It's designed to be open and composable, allowing developers to build applications on top of the network.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What are Frames?</h2>
          <p className="mb-4">
            Frames are interactive elements that can be embedded in Farcaster posts. 
            They allow users to interact with web applications directly from their Farcaster feed, 
            creating a more engaging and interactive experience.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Use This Frame</h2>
          <p className="mb-4">
            To use this frame in your Farcaster posts, simply copy the HTML metadata from the home page 
            and paste it into your post. When users view your post in a Farcaster client that supports frames, 
            they'll be able to browse channels directly from your post.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technologies Used</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Next.js 14 with App Router</li>
            <li>TypeScript</li>
            <li>TailwindCSS</li>
            <li>Shadcn UI</li>
            <li>Framer Motion</li>
            <li>Neynar API for Farcaster data</li>
          </ul>
          
          <div className="mt-8">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 