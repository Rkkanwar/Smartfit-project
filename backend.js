const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const apiKey = "AIzaSyD9-86wViSxD00uBT44X6LsKEdTNn4wLMY"; // Replace with your actual API key

//cors
const cors = require("cors");
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5000");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Middleware
app.use(bodyParser.json());

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint to generate exercise suggestions
app.post("/get-exercises", async (req, res) => {
  const { age, weight, height, gender, goal } = req.body;

  // Prepare prompt for Gemini AI
  const prompt = `
    Suggest 10 exercises for a person with the following details:
    Age: ${age}
    Weight: ${weight}kg
    Height: ${height}cm
    Gender: ${gender}
    Goal: ${goal}.
    Format the response as a numbered list of exercises only.
  `;

  try {
    const result = await model.generateContent(prompt);
    const exercises = result.response.text().split("\n");

    // Send exercises back to frontend
    res.json({ suggestions: exercises });
  
  } catch (error) {
    console.error("Error with Gemini API:", error.message);
    res.status(500).json({ error: "Failed to generate exercise suggestions." });
  }
});

// Start the server on port 8000
app.listen(9000, () => {
  console.log("Backend is running on http://localhost:9000");
});