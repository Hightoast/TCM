import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool, initDB } from "./db.js";
initDB()
  .then(() => console.log("Database ready"))
  .catch(err => {
    console.error("DB init failed", err);
    process.exit(1);
  });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());


// Serve frontend
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required", type: "error" });
  }

  try {
    await pool.query(
      "INSERT INTO subscribers (email) VALUES ($1)",
      [email]
    );

    res.json({ message: "Subscribed successfully!", type: "success" });

  } catch (err) {
    if (err.code === "23505") {
      return res.json({ message: "Already subscribed", type: "info" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error", type: "error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
