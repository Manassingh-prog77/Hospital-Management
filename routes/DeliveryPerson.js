const express = require("express");
const DeliveryPersonnel = require("../models/DeliveryPersonnel");
const MealTask = require("../models/MealTask");
const router = express.Router();

// Get all delivery personnel
router.get("/", async (req, res) => {
  try {
    const deliveryPersonnel = await DeliveryPersonnel.find();
    res.status(200).json(deliveryPersonnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new delivery personnel
router.post("/", async (req, res) => {
  const { name, contactInfo, otherDetails } = req.body;
  try {
    const deliveryPersonnel = new DeliveryPersonnel({ name, contactInfo, otherDetails });
    await deliveryPersonnel.save();
    res.status(201).json(deliveryPersonnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign meal boxes to delivery personnel
router.patch("/tasks/:taskId/assign", async (req, res) => {
  const { deliveryPersonnelId } = req.body;
  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.taskId,
      { deliveryPersonnelId },
      { new: true }
    );
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View assigned meal preparation tasks
router.get("/tasks/:staffId", async (req, res) => {
  try {
    const mealTasks = await MealTask.find({ deliveryPersonnelId: req.params.staffId }).populate("patientId dietChartId");
    res.status(200).json(mealTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track meal deliveries and mark delivery as "Delivered"
router.patch("/tasks/:taskId/deliveryStatus", async (req, res) => {
  const { deliveryStatus, deliveryNotes } = req.body;
  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.taskId,
      { deliveryStatus, deliveryNotes, deliveryTimestamp: new Date() },
      { new: true }
    );
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
