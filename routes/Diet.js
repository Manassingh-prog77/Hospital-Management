// routes/dietChartRoutes.js
const express = require("express");
const DietChart = require("../models/DietChart");
const router = express.Router();

// Create a new diet chart
router.post("/", async (req, res) => {
  const { patientId, meals } = req.body;
  try {
    const dietChart = new DietChart({ patientId, meals });
    await dietChart.save();
    res.status(201).json(dietChart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all diet charts
router.get("/", async (req, res) => {
  try {
    const dietCharts = await DietChart.find().populate("patientId");
    res.status(200).json(dietCharts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch diet chart by patient ID
router.get("/:patientId", async (req, res) => {
  try {
    // Find diet chart based on patient ID
    const dietChart = await DietChart.findOne({ patientId: req.params.patientId }).populate("patientId");
    
    // If no diet chart is found, return a 404 response
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found for the given patient ID" });
    }

    // Return the diet chart
    res.status(200).json(dietChart);
  } catch (error) {
    // Handle errors and return a 500 response
    res.status(500).json({ error: error.message });
  }
});

// Update a diet chart by ID
router.put("/:id", async (req, res) => {
  const { meals } = req.body;
  try {
    const dietChart = await DietChart.findByIdAndUpdate(
      req.params.id, 
      { meals },
      { new: true }
    );
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found" });
    }
    res.status(200).json(dietChart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a diet chart by ID
router.delete("/:id", async (req, res) => {
  try {
    const dietChart = await DietChart.findByIdAndDelete(req.params.id);
    if (!dietChart) {
      return res.status(404).json({ message: "Diet chart not found" });
    }
    res.status(200).json({ message: "Diet chart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
