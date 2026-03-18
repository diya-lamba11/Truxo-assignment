/**
 * @fileoverview Express server for the Student Search API.
 * Reads student data from a local JSON file and exposes RESTful endpoints
 * for searching and retrieving student records. No database required.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

/** @type {import('express').Express} Express application instance */
const app = express();

/** @type {number} Server port — uses PORT env variable or defaults to 5001 */
const PORT = process.env.PORT || 5001;

// Enable Cross-Origin Resource Sharing so the React dev server can call the API
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

/**
 * Resolve the absolute path to the student data JSON file.
 * The file sits one directory above /server (in the project root).
 * @type {string}
 */
const dataPath = path.join(__dirname, "..", "student_data.json");

/**
 * Load and parse the entire student dataset into memory at startup.
 * This avoids reading from disk on every request for better performance.
 * @type {Array<{name: string, class: number, rollNumber: number}>}
 */
const students = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

/**
 * GET /api/students/search?q=<query>
 *
 * Searches students by name using a case-insensitive substring match.
 * - Requires at least 3 characters in the query; returns [] otherwise.
 * - Returns a maximum of 5 matching student objects.
 *
 * @param {import('express').Request} req - Express request (expects `q` query param)
 * @param {import('express').Response} res - Express response (JSON array of students)
 * @returns {void}
 */
app.get("/api/students/search", (req, res) => {
  // Extract the search query, default to empty string, trim whitespace, and lowercase for comparison
  const query = (req.query.q || "").trim().toLowerCase();

  // Enforce minimum 3 character requirement for lazy loading
  if (query.length < 3) {
    return res.json([]);
  }

  // Filter students whose lowercase name contains the query substring, limit to 5 results
  const results = students
    .filter((student) => student.name.toLowerCase().includes(query))
    .slice(0, 5);

  res.json(results);
});

/**
 * GET /api/students/:rollNumber
 *
 * Retrieves a single student by their unique roll number.
 * Returns 404 if no student matches the given roll number.
 *
 * @param {import('express').Request} req - Express request (expects `rollNumber` route param)
 * @param {import('express').Response} res - Express response (single student object or error)
 * @returns {void}
 */
app.get("/api/students/:rollNumber", (req, res) => {
  // Parse the roll number from the URL parameter (base-10 integer)
  const rollNumber = parseInt(req.params.rollNumber, 10);

  // Find the student with the matching roll number
  const student = students.find((s) => s.rollNumber === rollNumber);

  // Return 404 if no student found
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(student);
});

/**
 * Start the Express server and listen on the configured port.
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
