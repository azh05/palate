require('dotenv').config();
const GEMINI_API_KEY = process.env.API_KEY;

const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const RATE_LIMIT = 15; // Number of requests per minute
const INTERVAL = 60000 / RATE_LIMIT; // Time interval between requests in milliseconds

// Function to delay requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateDescriptionWithGemini(dishName) {
  try {
      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
              contents: [
                  {
                      role: "user",
                      parts: [
                          {
                              text: `Generate a brief description (1-2 sentences) for the dish: "${dishName}". Include information about its ingredients, possible allergens, cooking style, and origin if applicable.`
                          }
                      ]
                  }
              ]
          }
      );

      return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
      console.error("Gemini API Error:", error);
      return "";
  }
}

async function scrapeMenu() {
  try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto("https://mister-noodle.com/menu/", { waitUntil: "domcontentloaded" });

      await autoScroll(page);

      const data = await page.evaluate(() => {
        const menuItems = [];
        const seenItems = new Set();
        
        const sections = document.querySelectorAll('.elementor-widget-wrap');
  
        sections.forEach(section => {
          const titleElement = section.querySelector('.elementor-widget-heading .elementor-heading-title');
          if (!titleElement) return;
  
          const title = titleElement.innerText.trim();
          if (!title || title.startsWith('(')) return;
  
          if (!seenItems.has(title)) {
            menuItems.push({ name: title });
            seenItems.has(title);
          }
        });
  
        return menuItems;
      });

      console.log("Scraped menu items:", data);

      // Generate descriptions with rate limiting
      for (let i = 0; i < data.length; i++) {
          if (!data[i].description) {
              data[i].description = await generateDescriptionWithGemini(data[i].name);
              console.log(`Generated description for ${data[i].name}: ${data[i].description}`);

              // Wait for the rate limit interval before making the next request
              if (i < data.length - 1) {
                  await delay(INTERVAL); // delay before the next request
              }
          }
      }

      fs.writeFileSync("menuData.json", JSON.stringify(data, null, 2));

      await browser.close();
  } catch (error) {
      console.error('Error:', error);
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
      const distance = 100;
      const delay = 200;
      const waitAfterScroll = 1000;
      let lastHeight = document.body.scrollHeight;

      while (true) {
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(resolve => setTimeout(resolve, delay));

          const newHeight = document.body.scrollHeight;
          if (newHeight === lastHeight) {
              await new Promise(resolve => setTimeout(resolve, waitAfterScroll));
              break;
          }
          lastHeight = newHeight;
      }
  });
}

scrapeMenu();
