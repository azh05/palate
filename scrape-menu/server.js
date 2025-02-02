const express = require("express");
const cors = require("cors");
const { scrapeMenu } = require("./scraper");

const app = express();
app.use(cors()); // Allow cross-origin requests
const PORT = process.env.PORT || 3000;

// Endpoint to fetch menu
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await scrapeMenu();
    res.json(menu);
  } catch (error) {
    console.error("Error scraping menu:", error);
    res.status(500).json({ error: "Failed to scrape menu" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
