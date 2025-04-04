require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI, GoogleGenAI } = require("@google/generative-ai");
const admin = require("firebase-admin");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Firebase setup
// const serviceAccount = require("./firebase-key.json");
// admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Multer setup (for file uploads)
const upload = multer({ dest: "uploads/" });

// Code Review Endpoint
app.post("/review", upload.single("file"), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      console.log("File received for review");

      const filePath = req.file.path;
      let code;
      try {
         code = await fs.readFile(filePath, "utf8");
      } catch (readError) {
         console.error("Error reading file:", readError);
         fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting temporary file:", unlinkErr);
         });
         return res.status(500).json({ success: false, message: "Error reading the uploaded file" });
      }

      fs.unlink(filePath, (unlinkErr) => {
         if (unlinkErr) console.error("Error deleting temporary file:", unlinkErr);
      });

      const prompt = `Review the following code and suggest improvements, identify potential bugs, and highlight areas for better readability and maintainability:\n\n${code}`;

      console.log("Sending code review request to Gemini...");

      const result = await model.generateContent({
         contents: [{ parts: [{ text: prompt }] }],
      });

      const response = result.response;

      if (
         !response ||
         !response.candidates ||
         response.candidates.length === 0 ||
         !response.candidates[0].content ||
         !response.candidates[0].content.parts ||
         response.candidates[0].content.parts.length === 0
      ) {
         console.warn("No review content found in Gemini response.");
         return res.status(500).json({ success: false, message: "No review result received from AI" });
      }

      const reviewResult = response.candidates[0].content.parts[0].text;
      console.log("Code review completed.", reviewResult);

      res.json({ success: true, review: reviewResult });
   } catch (error) {
      console.error("Error reviewing code:", error);
      res.status(500).json({ success: false, message: "Internal server error during code review" });
   }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
