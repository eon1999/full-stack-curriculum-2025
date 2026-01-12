// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Your API routes will go here...

// --- DEBUGGING SETUP ---
let db;
let dbError = null;

try {
  // Try to load firebase, but don't crash the server if it fails
  db = require("./firebase");
} catch (error) {
  dbError = error.message;
  console.error("Failed to initialize Firebase:", error);
}

// 1. Root Route (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "Server is running",
    environment: process.env.NODE_ENV || "development",
    firebaseStatus: db ? "Connected" : "Failed",
    firebaseError: dbError // This will show you exactly why it failed
  });
});

// week7 auth

const admin = require("firebase-admin");

// this is the middleware to verify firebase id tokens
const auth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) return res.status(401).send("No token given");

    const tokenId = authHeader.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// GET: Endpoint to retrieve all tasks
app.get("/tasks", auth, async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const userEmail = req.token.email;
    const snapshot = await db
      .collection("tasks")
      .where("user", "==", userEmail)
      .get();

    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id, // Document ID from Firestore
        ...doc.data(), // Document data
      });
    });

    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// POST: Endpoint to add a new task
// ...
app.post("/tasks", auth, async (req, res) => {
  try {
    const data = req.body;
    const addedTask = await db.collection("tasks").add(data);

    res.status(201).send({
      id: addedTask.id,
      ...data,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task
// ...
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection("tasks").doc(id).delete();

    res.status(200).send({
      id: id,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT: Endpoint to check off or update a task
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await db.collection("tasks").doc(id).update(data);

    res.status(200).send({
      id: id,
      ...data,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;