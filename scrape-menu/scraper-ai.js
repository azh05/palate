// Does not work

const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

// const HF_API_KEY = 'YOUR-HUGGING-FACE-API-KEY'; // Replace with your Hugging Face API Key
// const model = 'distilgpt2'; // Try using a more appropriate model like distilgpt2

(async function scrapeMenu() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://mister-noodle.com/menu/", { waitUntil: "domcontentloaded" });

    // Use the custom autoScroll function to load all dynamic content
    await autoScroll(page);

    // Wait for the menu container to load
    await page.waitForSelector('.elementor-widget-wrap');

    const data = await page.evaluate(() => {
      const menuItems = [];
      const seenItems = new Set(); // To prevent duplicates

      // Get all menu item containers
      const sections = document.querySelectorAll('.elementor-widget-wrap');

      sections.forEach(section => {
        // Find the menu item name (title)
        const titleElement = section.querySelector('.elementor-widget-heading .elementor-heading-title');
        if (!titleElement) return;

        const title = titleElement.innerText.trim();
        if (!title || title.startsWith('(')) return; // Ignore price-only or empty titles

        // Prevent duplicate menu items
        const uniqueKey = title;
        if (!seenItems.has(uniqueKey)) {
          menuItems.push({ name: title, description: "" });
          seenItems.add(uniqueKey);
        }
      });

      return menuItems;
    });

    // Generate descriptions for all menu items using Hugging Face API
    for (let item of data) {
      const dishName = item.name;
      item.description = await generateDescription(dishName);
    }

    // Save data to JSON file
    fs.writeFileSync("menu_with_descriptions.json", JSON.stringify(data, null, 2));
    console.log("Data saved to menu_with_descriptions.json");

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();

// Function to scroll through the page and load all dynamic content
async function autoScroll(page) {
    await page.evaluate(async () => {
      const distance = 100; // Distance to scroll by each time
      const delay = 200; // Delay between each scroll action (in milliseconds)
      const waitAfterScroll = 1000; // Time to wait after reaching the bottom (in milliseconds)
      let lastHeight = document.body.scrollHeight;
  
      while (true) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait for new content to load
  
        // Check if the page height is still the same, meaning we've reached the bottom
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
          // Wait a bit longer after scrolling to the bottom
          await new Promise(resolve => setTimeout(resolve, waitAfterScroll));
          break;
        }
        lastHeight = newHeight;
      }
    });
  }

// Function to generate a description using Hugging Face API
async function generateDescription(dishName) {
  const prompt = `A description for the dish: ${dishName}`;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    // Log the full response for debugging
    console.log(response.status); // Logs status code to check if it's 200 (OK)
    console.log(response.data);   // Logs response for debugging

    // Check if the response contains generated text
    const description = response.data[0]?.generated_text || `A delicious dish called ${dishName}.`; // Default description if not found
    return description;
  } catch (error) {
    console.error("Error generating description:", error);
    return "No description available"; // Default description if error occurs
  }
}
