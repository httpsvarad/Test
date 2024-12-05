const express = require('express');
const helmet = require('helmet');

const app = express();

// Add security headers using Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],  // Allow content from the same origin
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],  // Allow scripts from same origin
      frameSrc: ["'self'", "https://xpressauth-c83s.onrender.com/"],  // Allow iframes from specific domains
    },
  })
);

// Serve an HTML page with an iframe
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Iframe Example</title>
    </head>
    <body>
      <h1>Website in an Iframe</h1>
      <iframe src="https://xpressauth-c83s.onrender.com/" width="100%" height="600" frameborder="0"></iframe>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
