const express = require('express');  
const cors = require('cors');  
const bodyParser = require('body-parser');  
require('dotenv').config();  
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();  
const PORT = process.env.PORT || 9000;  
const vision = require('@google-cloud/vision');

// Middleware  
app.use(cors());  
app.use(bodyParser.json({ limit: '100mb' }));  
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); 

// Start server  
app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);
});

// Load Google Cloud credentials
const keyPath = "/Users/anyachen/Downloads/palate-449700-6fef05174476.json";
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyCOlLSmUikgai4jl5zRQFj3lsblAuMg4oc"; 

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
async function refineDishNamesWithGemini(dishes) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Extract **only dish names** from the following list:\n\n${JSON.stringify(dishes)}\n\n` +
                                      `### **Your Task:**\n` +
                                      `- Remove section headers (e.g., "Side Dishes", "Dessert").\n` +
                                      `- Correct any **misspellings**.\n` +
                                      `- Remove the **restaurant name** unless it's part of a dish.\n` +
                                      `- **Do NOT merge multiple dish names together**.\n\n` +
                                      `### **Description Rules:**\n` +
                                      `- If a dish is **well-known** (e.g., "Fried Rice"), return it **without a description**.\n` +
                                      `- If a dish is **not well-known** (e.g., "Mixian"), provide a **detailed** description including its ingredients, cooking style, and origin.\n` +
                                      `- Keep descriptions **concise (max 2 sentences).**\n\n` +
                                      `### **Format the response as a JSON array of objects like this:**\n` +
                                      "```json\n" +
                                      `[ { "name": "Dish Name", "description": "Brief or detailed description" } ]\n` +
                                      "```"
                            }
                        ]
                    }
                ]
            }
        );

        // Extract AI response text
        let aiResponse = response.data.candidates[0].content.parts[0].text.trim();

        // 🔥 **Fix: Strip possible markdown formatting (` ```json ... ``` `)**
        aiResponse = aiResponse.replace(/^```json\n/, "").replace(/\n```$/, "").trim();

        return JSON.parse(aiResponse); // Convert AI response to JSON
    } catch (error) {
        console.error("Gemini API Error:", error);
        return dishes.map(dish => ({ name: dish, description: "" })); // Return names with empty descriptions as fallback
    }
}

// OCR Route
app.post('/extract-text', async (req, res) => {
    try {
        const { imageBase64 } = req.body;  
        if (!imageBase64) {
            return res.status(400).json({ error: "No image provided" });
        }

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

        console.log("Raw Extracted Text:", extractedText); // Debugging

        // Process extracted text with Python script
        let filteredDishes = await filterDishesWithPython(extractedText);
        console.log("Dishes Before AI Filtering:", filteredDishes); // Debugging

        // Refine dish names with Gemini AI
        filteredDishes = await refineDishNamesWithGemini(filteredDishes);
        console.log("Final AI-Filtered Dishes:", filteredDishes); // Debugging

        // Delete the temporary file
        fs.unlinkSync(tempImagePath);

        // Return cleaned dishes
        res.json({ dishes: filteredDishes });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Failed to extract text" });
    }
});
