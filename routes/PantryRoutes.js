const express = require("express");
const PantryStaff = require("../models/PantryStaff");
const MealTask = require("../models/MealTask");
const router = express.Router();

// Get all pantry staff members
router.get("/", async (req, res) => {
  try {
    const pantryStaff = await PantryStaff.find();
    res.status(200).json(pantryStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new pantry staff
router.post("/", async (req, res) => {
  const { name, contactInfo, location } = req.body;
  try {
    const pantryStaff = new PantryStaff({ name, contactInfo, location });
    await pantryStaff.save();
    res.status(201).json(pantryStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View assigned meal preparation tasks
router.get("/tasks/:staffId", async (req, res) => {
  try {
    const mealTasks = await MealTask.find({ pantryStaffId: req.params.staffId }).populate("patientId dietChartId");
    res.status(200).json(mealTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
