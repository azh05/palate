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
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100; // Scroll distance
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200); // Adjust interval as needed
        });
    });
}