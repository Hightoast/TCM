import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const FILE_PATH = "subscribers.json";

// Endpoint to save email
app.post("/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email is required");

  // Read current subscribers
  let subscribers = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

  // Prevent duplicates
  if (subscribers.includes(email)) {
    return res.status(200).send("Already subscribed");
  }

  // Add new email
  subscribers.push(email);
  fs.writeFileSync(FILE_PATH, JSON.stringify(subscribers, null, 2));

  res.status(200).send("Subscribed successfully");
});

app.listen(3000, () => console.log("Server running on port 3000"));
