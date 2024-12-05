const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

let browser;
let page;

// Function to keep the page alive using Puppeteer
async function keepPageAlive() {
  try {
    // Launch Puppeteer with headless browser
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // Open a new page
    page = await browser.newPage();

    // Visit your website
    await page.goto('https://xpressauth-c83s.onrender.com/');
    console.log('Page opened and kept alive: https://xpressauth-c83s.onrender.com/');

    // Simulate mouse movement to keep cursor moving
    setInterval(async () => {
      const { width, height } = await page.viewport();
      const randomX = Math.floor(Math.random() * width);
      const randomY = Math.floor(Math.random() * height);
      await page.mouse.move(randomX, randomY); // Move mouse randomly to simulate activity
      console.log('Mouse moved');
    }, 1000); // Move the mouse every second

    // Keep the browser session active by refreshing every 5 minutes
    setInterval(async () => {
      console.log('Refreshing page...');
      await page.reload();
    }, 5 * 60 * 1000); // 5 minutes (5 * 60 * 1000 milliseconds)

  } catch (error) {
    console.error('Error while keeping page alive:', error);
  }
}

// Start the Puppeteer process when the server starts
keepPageAlive();

// Serve an endpoint to show the status or iframe (or website content) in the browser
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Website Always Running</title>
      <script>
        // Refresh the page every 5 minutes on the client-side
        setInterval(() => {
          window.location.reload();
        }, 5 * 60 * 1000); // 5 minutes (5 * 60 * 1000 milliseconds)
      </script>
    </head>
    <body>
      <h1>Your Website is Always Running!</h1>
      <p>We are keeping the page <a href="https://xpressauth-c83s.onrender.com/" target="_blank">https://xpressauth-c83s.onrender.com/</a> always alive.</p>
      <p>The page is refreshed every 5 minutes to keep it active.</p>
    </body>
    </html>
  `);
});

// Optional: Stop the Puppeteer session
app.get('/stop', async (req, res) => {
  try {
    if (browser) {
      await browser.close(); // Close the browser session
      browser = null;
      page = null;
      console.log('Browser session closed.');
    }
    res.send('Browser session stopped.');
  } catch (error) {
    console.error('Error stopping the browser:', error);
    res.status(500).send('An error occurred while stopping the browser session.');
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
