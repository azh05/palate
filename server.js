require('dotenv').config();
const express = require('express');  
const cors = require('cors');  
const bodyParser = require('body-parser');   
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const vision = require('@google-cloud/vision');
const { connectToMongoDB, getUser, addDefaultUser, updateUserFlavorProfile } = require('./palate-db');

const app = express();  
const PORT = process.env.PORT || 9000;  
const GEMINI_API_KEY = process.env.API_KEY;

// Middleware  
app.use(cors());  
app.use(bodyParser.json({ limit: '100mb' }));  
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); 

// Start server  
app.listen(PORT, async () => {  
  console.log(`Server is running on port ${PORT}`);
  await connectToMongoDB();
  await addDefaultUser(); // Ensure default user is added
});

// Load Google Cloud credentials
const keyPath = "./google_cloud_key.json";
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

// Function to process OCR text with Python script
async function filterDishesWithPython(rawText) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['filter_dishes.py']);

        pythonProcess.stdin.write(JSON.stringify({ text: rawText }));
        pythonProcess.stdin.end();

        let outputData = '';

        pythonProcess.stdout.on('data', (chunk) => {
            outputData += chunk.toString();
        });

        pythonProcess.stderr.on('data', (err) => {
            console.error("Python Error:", err.toString());
        });

        pythonProcess.on('close', () => {
            try {
                resolve(JSON.parse(outputData));
            } catch (err) {
                reject(err);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
}

// Function to refine dish names using **Google Gemini API**
async function getDishesWithAllergens(userName, dishes) {
    const user = await getUser(userName);
    allergens = user.allergens;
    console.log(allergens);

    try {
      aiText = `Extract **only dish names** from the following list:\n\n${JSON.stringify(dishes)}\n\n` +
      `Based on these allergens:\n\n${JSON.stringify(allergens)}\n\n` +
      `### **Your Task:**\n` +
      `- Given the list of dishes, identify all possible allergen containing foods BASED ON PROVIDED ALLERGENS ONLY ` +
      `### **Format the response as a JSON array of objects like this:**\n` +
      `- DO NOT ADD ANY WORDS TO THE RESPONSE BESIDES THE JSON FORMATTING` +
        "```json\n" +
        `[ { "name": "Dish Name", "allergens" : ["allergen1", "allergen2"] in the dish } ]\n` +
        "```";

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {   
                              text: aiText    
                            }
                        ]
                    }
                ]
            }
        );


        // Extract AI response text
        let aiResponse = response.data.candidates[0].content.parts[0].text.trim();

        // Fix: Strip possible markdown formatting (` ```json ... ``` `)**
        aiResponse = aiResponse.replace(/^```json\n/, "").replace(/\n```$/, "").trim();
        console.log(aiResponse);
        return JSON.parse(aiResponse); 
    } catch (error) {
        console.error("Gemini API Error:", error);
        return dishes.map(dish => ({ name: dish, description: "" })); // Return names with empty descriptions as fallback
    }
}


// Function to refine dish names using **Google Gemini API**
async function refineDishNamesWithGemini(dishes) {
    try {
        aiText = `Extract **only dish names** from the following list:\n\n${JSON.stringify(dishes)}\n\n` +
        `### **Your Task:**\n` +
        `- Remove section headers (e.g., "Side Dishes", "Dessert").\n` +
        `- Correct any **misspellings**.\n` +
        `- Remove the **restaurant name** unless it's part of a dish.\n` +
        `- **Do NOT merge multiple dish names together**.\n\n` +
        `### **Description Rules:**\n` +
        //`- If a dish is **well-known** (e.g., "Fried Rice"), return it **without a description**.\n` +
        `- Provide a detailed description of each dish with flavor profile, and ingredients to describe its qualities\n` +
        `- Keep descriptions about 2 sentences long and include new info not in name of dish.**\n\n` +
        `### **Format the response as a JSON array of objects like this:**\n` +
        `- Keep every thing in isRecommended as 0` +
        `- DO NOT ADD ANY WORDS TO THE RESPONSE BESIDES THE JSON FORMATTING` +
        "```json\n" +
        `[ { "name": "Dish Name", "description": "Brief or detailed description", "isRecommended": "0" } ]\n` +
        "```";

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {   
                              text: aiText    
                            }
                        ]
                    }
                ]
            }
        );


        // Extract AI response text
        let aiResponse = response.data.candidates[0].content.parts[0].text.trim();

        // Fix: Strip possible markdown formatting (` ```json ... ``` `)**
        aiResponse = aiResponse.replace(/^```json\n/, "").replace(/\n```$/, "").trim();
        // console.log(aiResponse);
        return JSON.parse(aiResponse); // Convert AI response to JSON
    } catch (error) {
        console.error("Gemini API Error:", error);
        return dishes.map(dish => ({ name: dish, description: "" })); // Return names with empty descriptions as fallback
    }
}

// OCR Route
async function extractText(imageBase64) {
    try {
        // if (!imageBase64) {
        //     return {};
        // }

        // Convert base64 to binary image buffer
        const buffer = Buffer.from(imageBase64, 'base64');

        // Save to a temporary file
        const tempImagePath = path.join(__dirname, 'temp_image.jpg');
        fs.writeFileSync(tempImagePath, buffer);

        // Initialize Vision client
        const client = new vision.ImageAnnotatorClient();

        // Perform OCR on the image
        const [result] = await client.textDetection(tempImagePath);
        const detections = result.textAnnotations;

        // Extract raw detected text
        let extractedText = detections.length > 0 ? detections[0].description : "";

        // console.log("Raw Extracted Text:", extractedText); // Debugging

        // Process extracted text with Python script
        let filteredDishes = await filterDishesWithPython(extractedText);
        // console.log("Dishes Before AI Filtering:", filteredDishes); // Debugging

        // Refine dish names with Gemini AI
        filteredDishes = await refineDishNamesWithGemini(filteredDishes);
        //console.log("Final AI-Filtered Dishes:", filteredDishes); // Debugging

        // Delete the temporary file
        fs.unlinkSync(tempImagePath);

        return filteredDishes;

    } catch (error) {
        // console.error("Error extracting text:", error);
        return false;
    }
  }

// Function to refine and recommend 3 dishes using Gemini AI
async function getGeminiRecommendations(userLikedFoods, menuDishes) {

  try {
    const prompt = `
    You are an AI-powered food recommendation system. A user has shared userLikedFoods, 
    and we have extracted menu items menuDishes from a restaurant. Make it a personalized message to the person with reasoning on why they would prefer one over the other given the provided user's favorite foods (userLikedFoods)
    
    ### **Your Task**:
    - Recommend **exactly 3 dishes** from the **provided menu items ONLY** based on the given user's favorite food.
    - Compare dishes based on **flavors, ingredients, regional influences, and cooking styles**.
    - Ensure **diversity** in recommendations (e.g., don’t recommend only noodle dishes unless the user only likes noodles).
    - **Do NOT make up new dishes**—you must select from the provided menu items.
    - DO NOT ADD ANY WORDS TO THE RESPONSE BESIDES THE JSON FORMATTING
    
    ### **User’s Favorite Foods**:
    ${JSON.stringify(userLikedFoods)}
    
    ### **Menu Items (You MUST pick from these)**:
    ${JSON.stringify(menuDishes)}
    
    ### **Return a JSON array in this format**:
    \`\`\`json
    [
      { "name": "Dish Name", "reason": "Why this dish was recommended" }
    ]
    \`\`\`
    `;

      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
          }
      );

      // Extract AI response
      let aiResponse = response.data.candidates[0].content.parts[0].text.trim();

      // Remove Markdown formatting (` ```json ... ``` `)
      aiResponse = aiResponse.replace(/^```json\n/, "").replace(/\n```$/, "").trim();

      console.log(aiResponse);

      return JSON.parse(aiResponse); // Convert AI response to JSON
  } catch (error) {
      console.error("Gemini API Error:", error);
      return []; // Return empty array if AI fails
  }
}

// **GET user’s liked foods**
app.get('/api/user/liked-foods', async (req, res) => {
  const { userName } = req.query;

  if (!userName) {
      return res.status(400).json({ error: 'User name is required' });
  }

  try {
      const user = await getUser(userName);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ success: true, likedFoods: user.likedFoods || [] });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// **POST: Compare menu items with user preferences**
app.post("/api/menu/compare-dishes", async (req, res) => {
  const { userName, dishes } = req.body;

  if (!userName || !dishes) {
      return res.status(400).json({ error: "User name and dishes are required" });
  }

  try {
      const user = await getUser(userName);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const likedFoods = user.likedFoods;
      const recommendations = dishes.map(dish => {
          const isLiked = likedFoods.some(likedFood => dish.name.toLowerCase().includes(likedFood.toLowerCase()));
          return { ...dish, isLiked };
      });

      res.json({ success: true, recommendations });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// **POST: Recommend 3 dishes based on user’s preferences**
app.post("/api/menu/recommend-dishes", async (req, res) => {
  const { userName, imageBase64 } = req.body;
  dishes = await extractText(imageBase64);

  if (!userName || !dishes) {
      return res.status(400).json({ error: "User name and dishes are required" });
  }

  try {
      const user = await getUser(userName);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const allergens = await getDishesWithAllergens(userName, dishes);

      for(i = 0; i < dishes.length; i++) {
        for(j = 0; j < allergens.length; j++) {
          if (dishes[i].name == allergens[j].name) {
            dishes[i].description = allergens[j].allergens;
            dishes[i].isRecommended = "-1";
          }
        }
      }

      const recommendations = await getGeminiRecommendations(user.likedFoods, dishes);
      

      for(i = 0; i < dishes.length; i++) {
        for(j = 0; j < recommendations.length; j++) {
          if (dishes[i].name == recommendations[j].name) {
            dishes[i].description = recommendations[j].reason;
            dishes[i].isRecommended = "1";
          }
        }
      }

      res.json({ success: true, dishes });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }

});

// **POST: User feedback on a dish**
app.post("/api/user/feedback", async (req, res) => {
  const { userName, dish, liked } = req.body;

  if (!userName || !dish || typeof liked !== "boolean") {
      return res.status(400).json({ error: "User name, dish, and feedback (true/false) are required." });
  }

  try {
      await updateUserFlavorProfile(userName, dish, liked);
      res.json({ success: true, message: liked ? `${dish} added to flavor profile!` : `${dish} was not liked.` });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// POST: Recommend dishes from saved menu data
app.post("/api/menu/recommend-from-saved", async (req, res) => {
  const { userName } = req.query;

  try {
    // Read menu data from JSON file
    const menuData = JSON.parse(fs.readFileSync('./scrape-menu/menuData.json', 'utf8'));

    if (!userName || !menuData) {
      return res.status(400).json({ error: "User name and menu data are required" });
    }

    const user = await getUser(userName);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recommendations = await getGeminiRecommendations(user.likedFoods, menuData);

    // Update isRecommended and description for recommended dishes
    const dishes = menuData.map(dish => {
      const recommendation = recommendations.find(rec => rec.name === dish.name);
      return {
        ...dish,
        description: recommendation ? recommendation.reason : dish.description,
        isRecommended: recommendation ? "1" : "0"
      };
    });

    res.json({ success: true, dishes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});
