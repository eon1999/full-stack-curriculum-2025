// Importing Firebase Admin SDK to interact with Firebase services
const admin = require("firebase-admin");
require("dotenv").config();

let creds;

// Robust parsing to catch Vercel env var errors
try {
  if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error(
      "FIREBASE_CREDENTIALS is missing from environment variables."
    );
  }

  // try to parse the json
  creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (error) {
  console.error("CRITICAL ERROR: Failed to parse FIREBASE_CREDENTIALS.");
  console.error("Original Error:", error.message);
  // We throw again to stop execution, but now we have a log in Vercel
  throw error;
}

// initialize firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(creds),
    databaseURL: "https://tpeo-todo-app-f2036.firebaseio.com",
  });
}

const db = admin.firestore();

module.exports = db;
