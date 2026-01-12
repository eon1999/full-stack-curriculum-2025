const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- 1. SAFE FIREBASE INITIALIZATION ---
let db;
let initError = null;

try {
  // We check if it's already initialized to prevent hot-reload duplicates
  if (!admin.apps.length) {
    db = require("./firebase");
  } else {
    db = admin.firestore();
  }

  // OPTIONAL: Prevent crashes if you accidentally pass undefined
  if (db) {
    db.settings({ ignoreUndefinedProperties: true });
  }

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Critical Firebase Error:", error);
  initError = error.message;
}

// --- 2. ROBUST AUTH MIDDLEWARE ---
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attaching to req.user is standard
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

// --- 3. ROUTES ---

// HEALTH CHECK + DB TEST (Visit this in browser!)
app.get("/", async (req, res) => {
  let dbStatus = "Unknown";
  let dbReadTest = "Not Attempted";

  // Try to actually read from the database to verify credentials
  if (db) {
    try {
      // Just check if we can list collections (or any read op)
      await db.listCollections();
      dbStatus = "Connected & Verified";
      dbReadTest = "Success";
    } catch (e) {
      dbStatus = "Connected but Permission Denied";
      dbReadTest = `Failed: ${e.message}`;
    }
  }

  res.json({
    status: "online",
    firebaseInit: initError ? "Failed" : "Success",
    dbConnection: dbStatus,
    dbReadError: dbReadTest,
    projectId: process.env.FIREBASE_CREDENTIALS
      ? JSON.parse(process.env.FIREBASE_CREDENTIALS).project_id
      : "Unknown",
  });
});

// GET TASKS
app.get("/tasks", auth, async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });

  try {
    const userEmail = req.user.email;
    if (!userEmail)
      return res.status(400).json({ error: "User email not found in token" });

    // Note: Ensure your Firestore has a 'tasks' collection and documents have a 'user' field matching the email
    const snapshot = await db
      .collection("tasks")
      .where("user", "==", userEmail)
      .get();

    const tasks = [];
    snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() }));

    res.json(tasks);
  } catch (error) {
    console.error("GET /tasks Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST TASK
app.post("/tasks", auth, async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not initialized" });

  try {
    // LOGGING: See exactly what the frontend is sending
    console.log("POST /tasks received:", req.body);

    // ADAPTATION: Frontend sends 'task', Backend originally wanted 'description'
    // We'll accept either to be flexible.
    const taskDescription = req.body.task || req.body.description;

    // VALIDATION: Ensure we have something to save
    if (!taskDescription) {
      return res.status(400).json({
        error: "Missing 'task' or 'description' field in request body",
        received: req.body,
      });
    }

    const newTask = {
      // We save it as BOTH fields so it works no matter what the frontend expects on read
      description: taskDescription, // Legacy support
      task: taskDescription, // Frontend support

      // Handle 'done' vs 'finished' mismatch
      done: req.body.finished || req.body.done || false,

      user: req.user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("tasks").add(newTask);
    res.status(201).json({ id: docRef.id, ...newTask });
  } catch (error) {
    console.error("POST /tasks Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE TASK
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    await db.collection("tasks").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT TASK
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    await db.collection("tasks").doc(req.params.id).update(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
