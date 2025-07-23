const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

// Load or initialize click data
const clicksFile = "./clicks.json";
if (!fs.existsSync(clicksFile)) {
  fs.writeFileSync(clicksFile, JSON.stringify([]));
}

// POST /clicks — Save a click
app.post("/clicks", (req, res) => {
  const click = {
    id: req.body.id,
    timestamp: new Date().toISOString()
  };

  const clicks = JSON.parse(fs.readFileSync(clicksFile));
  clicks.push(click);
  fs.writeFileSync(clicksFile, JSON.stringify(clicks, null, 2));

  res.status(201).json({ message: "Click saved!" });
});

// GET /clicks — See all clicks
app.get("/clicks", (req, res) => {
  const clicks = JSON.parse(fs.readFileSync(clicksFile));
  res.json(clicks);
});

// Load or initialize search data
const searchFile = "./searches.json";
if (!fs.existsSync(searchFile)) {
  fs.writeFileSync(searchFile, JSON.stringify([]));
}

// POST /searches — Save a search
app.post("/searches", (req, res) => {
  const search = req.body;

  if (!search || !search.query) {
      return res.status(400).send("Missing search data");
  }

  fs.readFile("searches.json", "utf8", (err, data) => {
      const searches = err ? [] : JSON.parse(data);
      searches.push({
      ...search,
      timestamp: new Date().toISOString(),
      });

    fs.writeFile("searches.json", JSON.stringify(searches, null, 2), (err) => {
      if (err) {
        console.error("Failed to save search:", err);
        return res.status(500).send("Failed to save");
      }
      res.status(200).send("Search saved");
    });
  });
});

// GET /searches — See all searches
app.get("/searches", (req, res) => {
  const data = fs.readFileSync("searches.json", "utf8");
  const searches = JSON.parse(data);
  res.json(searches);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});