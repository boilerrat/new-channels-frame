// This file is used to override the default Next.js server function
// It ensures that the Next.js app is properly initialized on Netlify

// Use the Netlify adapter for Next.js
const { createNextFunction } = require('@netlify/next');

// Create a Next.js function handler
const nextFunction = createNextFunction({
  compression: true,
  distDir: '.next',
});

// Export the handler
exports.handler = nextFunction;