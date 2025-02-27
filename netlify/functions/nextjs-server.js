// This file is used to override the default Next.js server function
// It ensures that the Next.js app is properly initialized on Netlify

try {
  console.log('Initializing Next.js server function...');
  const handler = require('@netlify/plugin-nextjs/lib/templates/server-function');
  
  // Add custom error handling
  const wrappedHandler = async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error('Error in Next.js server function:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'An error occurred while processing your request'
        })
      };
    }
  };
  
  module.exports = wrappedHandler;
} catch (error) {
  console.error('Failed to initialize Next.js server function:', error);
  
  // Provide a fallback handler
  module.exports = async () => ({
    statusCode: 500,
    body: JSON.stringify({
      error: 'Server Initialization Error',
      message: 'Failed to initialize the Next.js server'
    })
  });
}