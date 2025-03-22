const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/territoryCreator", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a schema for territories
const territorySchema = new mongoose.Schema({
  id: Number,
  owner: String,
  terrainType: Number,
  coordinates: [{ x: Number, y: Number }]
});

// Define a schema for maps
const mapSchema = new mongoose.Schema({
  territories: [territorySchema]
});

const Map = mongoose.model("Map", mapSchema);

// API endpoint to save a map
app.post("/api/maps", async (req, res) => {
  try {
    const map = new Map({ territories: req.body });
    await map.save();
    res.status(201).send("Map saved!");
  } catch (err) {
    res.status(500).send("Error saving map: " + err.message);
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});