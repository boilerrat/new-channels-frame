// This file is used to override the default Next.js server function
// It ensures that the Next.js app is properly initialized on Netlify

const path = require('path');
const { builder } = require('@netlify/functions');

// Get the path to the Next.js standalone server
const nextServerPath = path.join(process.cwd(), '.next/standalone/server.js');

// Import the Next.js server
let nextServer;
try {
  // Dynamically import the Next.js server
  nextServer = require(nextServerPath);
} catch (error) {
  console.error('Error importing Next.js server:', error);
}

async function handler(event, context) {
  try {
    // If we couldn't import the Next.js server, return an error
    if (!nextServer) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to initialize Next.js server' }),
      };
    }

    // Process the request with the Next.js server
    const response = await nextServer(event, context);
    return response;
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
}

exports.handler = builder(handler);