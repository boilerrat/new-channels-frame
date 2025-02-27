// This file is used to override the default Next.js server function
// It ensures that the Next.js app is properly initialized on Netlify

// Use the standard server function from the Netlify Next.js plugin
module.exports = require('@netlify/plugin-nextjs/lib/templates/server-function');