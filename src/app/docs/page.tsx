import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation - Farcaster Channels Frame",
  description: "Documentation for using the Farcaster Channels Frame",
};

export default function DocsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Documentation</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Getting Started</h2>
          <p className="mb-4">
            To use the Farcaster Channels Frame in your own projects, you can either:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Embed the frame in your Farcaster posts</li>
            <li>Fork this project and customize it for your needs</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Embedding the Frame</h2>
          <p className="mb-4">
            To embed this frame in your Farcaster posts, add the following HTML metadata to your post:
          </p>
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <code className="text-sm break-all">
              {`<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-deployed-url.com/api/image?page=1" />
<meta property="fc:frame:post_url" content="https://your-deployed-url.com/api/frame" />`}
            </code>
          </div>
          <p className="mb-4">
            Replace <code>your-deployed-url.com</code> with the URL where your frame is hosted.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">API Reference</h2>
          <h3 className="text-xl font-semibold mt-6 mb-2">GET /api/channels</h3>
          <p className="mb-2">Fetches a paginated list of Farcaster channels.</p>
          <p className="mb-4"><strong>Query Parameters:</strong></p>
          <ul className="list-disc pl-6 mb-4">
            <li><code>page</code> (optional): Page number, defaults to 1</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">GET /api/image</h3>
          <p className="mb-2">Generates an image for the frame.</p>
          <p className="mb-4"><strong>Query Parameters:</strong></p>
          <ul className="list-disc pl-6 mb-4">
            <li><code>page</code> (optional): Page number, defaults to 1</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">POST /api/frame</h3>
          <p className="mb-2">Handles frame actions and returns the next frame state.</p>
          <p className="mb-4"><strong>Request Body:</strong></p>
          <p className="mb-4">
            The request body should follow the Farcaster Frame message format as specified in the 
            <a href="https://docs.farcaster.xyz/reference/frames/spec" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Farcaster Frames specification</a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Development</h2>
          <p className="mb-4">
            To run this project locally:
          </p>
          <ol className="list-decimal pl-6 mb-6">
            <li>Clone the repository</li>
            <li>Install dependencies with <code>npm install</code></li>
            <li>Run the development server with <code>npm run dev</code></li>
            <li>Open <a href="http://localhost:3000" className="text-blue-600 hover:underline">http://localhost:3000</a> in your browser</li>
          </ol>
          
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