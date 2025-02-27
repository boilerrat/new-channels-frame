# Farcaster Channels Frame

A Next.js application that showcases popular Farcaster channels using Farcaster Frames v2. This project allows users to browse and discover channels directly within Farcaster clients that support Frames.

## Features

- Browse popular Farcaster channels
- Paginated navigation through channel listings
- Responsive design for all device sizes
- Server-side rendering for optimal performance
- Farcaster Frame integration for in-client browsing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: Shadcn UI
- **Animation**: Framer Motion
- **Data Fetching**: Server Components + API Routes
- **State Management**: React Hooks + nuqs for URL state
- **API Integration**: Neynar API for Farcaster data

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/channels-frame.git
cd channels-frame
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

In production, set this to your deployed URL.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Frame Integration

To integrate this frame into your Farcaster posts, add the following HTML to your post:

```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://your-deployed-url.com/api/image?page=1" />
<meta property="fc:frame:post_url" content="https://your-deployed-url.com/api/frame" />
```

## Deployment

This project can be deployed on any platform that supports Next.js, such as Vercel, Netlify, or a custom server.

For Vercel deployment:

```bash
npm run build
# or
vercel
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Farcaster](https://www.farcaster.xyz/) for the protocol
- [Neynar](https://neynar.com/) for the API access
- [Warpcast](https://warpcast.com/) for the client reference
