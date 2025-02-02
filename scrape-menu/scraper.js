const puppeteer = require("puppeteer");
const fs = require("fs"); // Import the fs module to write files

(async function scrapeMenu() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto("https://mister-noodle.com/menu/", { waitUntil: "domcontentloaded" });

        // Scroll to the bottom of the page to load all content
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

                // Find the description
                let descriptionElement = section.querySelector('.elementor-widget-text-editor p');
                let description = descriptionElement ? descriptionElement.innerText.trim() : '';

                // Prevent duplicate menu items
                const uniqueKey = title + description;
                if (!seenItems.has(uniqueKey)) {
                    menuItems.push({ name: title, description });
                    seenItems.add(uniqueKey);
                }
            });

            return menuItems;
        });

        console.log(data);

        fs.writeFileSync("menuData.json", JSON.stringify(data, null, 2)); // Save as JSON file

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
