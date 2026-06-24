const express = require("express");
const auth = require("../middleware/authMiddleware");
const SafeZone = require("../models/SafeZone");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const safeZones = await SafeZone.find().sort({ name: 1 });
  res.json(safeZones);
});

router.post("/", auth, async (req, res) => {
  const safeZone = await SafeZone.create(req.body);
  res.status(201).json(safeZone);
});

module.exports = router;
