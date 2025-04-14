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

const textPrompt = `
As a Senior Full-Stack Developer with expertise across frontend, backend, and security:

Please review the following code thoroughly. Your tasks are:

1. Check for syntax errors, deprecated patterns, or outdated libraries.
2. Suggest improvements in terms of performance, readability, structure, and best practices.
3. Identify potential bugs that may arise during execution.
4. Highlight any security vulnerabilities (e.g., XSS, injection risks, unsafe code patterns).
5. If the code is clean, confirm that as well.

📦 Respond strictly in the following **JSON format**:

{
  "updatedCode": "/* Provide the improved version of the code here */",
  "improvements": ["List of suggestions for improving code quality and performance."],
  "potentialBugs": ["List of any bugs or runtime issues that could occur."],
  "securityRisks": ["List any security vulnerabilities found, or state 'None' if there are none."],
  "syntaxErrors": [],
  "deprecatedPatterns": [],
  "outdatedLibraries": [],
}
Do not provide any backticks and all, simple JSON Object
`;

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
      console.log("File received for review", req.body.criteria);

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

      const customCriteria = JSON.parse(req.body.criteria);
      console.log(customCriteria);

      const customCriteriaPrompt = `
         Below is the my criteria to review the code make this into Consideration as well
         Code Language is ${customCriteria.language} and below are my criterias
         ${customCriteria.criteria}
      `;
      console.log(customCriteriaPrompt);

      const prompt = `${textPrompt}\n\n ${customCriteriaPrompt} \n\n ${code}`;

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

      const reviewText = response.candidates[0].content.parts[0].text;
      console.log(reviewText, "raw Gemini response");

      const jsonMatch = reviewText.match(/{[\s\S]*}/);
      if (!jsonMatch) {
         throw new Error("No valid JSON block found in Gemini response");
      }

      let jsonString = jsonMatch[0];

      // Replace backtick-enclosed updatedCode with a properly escaped JSON string
      jsonString = jsonString.replace(/"updatedCode":\s*`([\s\S]*?)`/, (_, codeBlock) => {
         const escapedCode = codeBlock
            .replace(/\\/g, "\\\\") // Escape backslashes
            .replace(/"/g, '\\"') // Escape double quotes
            .replace(/\n/g, "\\n"); // Escape newlines
         return `"updatedCode": "${escapedCode}"`;
      });

      const parsedJSON = JSON.parse(jsonString);

      console.log("Code review completed.", parsedJSON);
      res.json({ success: true, review: parsedJSON });
   } catch (error) {
      console.error("Error reviewing code:", error);
      res.status(500).json({ success: false, message: "Internal server error during code review" });
   }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
