// This file is used to override the default Next.js server function
// It ensures that the Next.js app is properly initialized on Netlify

const { builder } = require('@netlify/functions');
const { NextRequest } = require('next/server');
const { NextServer } = require('next/dist/server/next-server');

// Initialize the Next.js server
const nextServer = new NextServer({
  hostname: 'localhost',
  port: 3000,
  dir: '.',
  dev: false,
  conf: {
    basePath: '',
    distDir: '.next',
  },
});

const requestHandler = nextServer.getRequestHandler();

async function handler(event) {
  try {
    // Create a Next.js request from the Netlify event
    const url = new URL(event.rawUrl);
    const nextReq = new NextRequest(url, {
      headers: new Headers(event.headers),
      method: event.httpMethod,
      body: event.body ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8') : null,
    });

    // Process the request with Next.js
    const response = await requestHandler(nextReq);
    
    // Convert the response to Netlify format
    const responseHeaders = Object.fromEntries(response.headers.entries());
    
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text(),
      isBase64Encoded: false,
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
}

exports.handler = builder(handler);