import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

const FILE_PATH = path.join(__dirname, "subscribers.json");

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required", type: "error" });
  }

  const subscribers = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

  if (subscribers.includes(email)) {
    return res.json({ message: "Already subscribed", type: "info" });
  }

  subscribers.push(email);
  fs.writeFileSync(FILE_PATH, JSON.stringify(subscribers, null, 2));

  res.json({ message: "Subscribed successfully!", type: "success" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
