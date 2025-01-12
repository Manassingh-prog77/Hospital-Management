// routes/mealTaskRoutes.js
const express = require("express");
const MealTask = require("../models/MealTask");
const router = express.Router();

// CRUD routes for meal tasks

// Create a new meal task
router.post("/", async (req, res) => {
  const { patientId, dietChartId, pantryStaffId, deliveryPersonnelId } = req.body;
  try {
    const mealTask = new MealTask({ patientId, dietChartId, pantryStaffId, deliveryPersonnelId });
    await mealTask.save();
    res.status(201).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all meal tasks
router.get("/", async (req, res) => {
  try {
    const mealTasks = await MealTask.find().populate("patientId dietChartId pantryStaffId deliveryPersonnelId");
    res.status(200).json(mealTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific meal task by ID
router.get("/:id", async (req, res) => {
  try {
    const mealTask = await MealTask.findById(req.params.id).populate("patientId dietChartId pantryStaffId deliveryPersonnelId");
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meal task preparation status
router.patch("/:id/preparationStatus", async (req, res) => {
  const { preparationStatus } = req.body;
  try {
    const mealTask = await MealTask.findByIdAndUpdate(req.params.id, { preparationStatus }, { new: true });
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meal task delivery status
router.patch("/:id/deliveryStatus", async (req, res) => {
  const { deliveryStatus } = req.body;
  try {
    const mealTask = await MealTask.findByIdAndUpdate(req.params.id, { deliveryStatus }, { new: true });
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meal task preparation and delivery status together
router.patch("/:id/status", async (req, res) => {
  const { preparationStatus, deliveryStatus } = req.body;
  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.id, 
      { preparationStatus, deliveryStatus }, 
      { new: true }
    );
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a meal task by ID
router.delete("/:id", async (req, res) => {
  try {
    const mealTask = await MealTask.findByIdAndDelete(req.params.id);
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json({ message: "Meal task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update preparation status for a specific meal (morning, evening, night)
router.patch("/:id/preparationStatus/:mealType", async (req, res) => {
  const { mealType } = req.params;
  const { preparationStatus } = req.body;

  if (!["morning", "evening", "night"].includes(mealType)) {
    return res.status(400).json({ message: "Invalid meal type" });
  }

  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.id,
      { [`preparationStatus.${mealType}`]: preparationStatus },
      { new: true }
    );
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery status for a specific meal (morning, evening, night)
router.patch("/:id/deliveryStatus/:mealType", async (req, res) => {
  const { mealType } = req.params;
  const { deliveryStatus } = req.body;

  if (!["morning", "evening", "night"].includes(mealType)) {
    return res.status(400).json({ message: "Invalid meal type" });
  }

  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.id,
      { [`deliveryStatus.${mealType}`]: deliveryStatus },
      { new: true }
    );
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update both preparation and delivery statuses for all meals at once
router.patch("/:id/status", async (req, res) => {
  const { preparationStatus, deliveryStatus } = req.body;
  
  const updatedData = {};
  
  if (preparationStatus) updatedData.preparationStatus = preparationStatus;
  if (deliveryStatus) updatedData.deliveryStatus = deliveryStatus;

  try {
    const mealTask = await MealTask.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    if (!mealTask) {
      return res.status(404).json({ message: "Meal task not found" });
    }
    res.status(200).json(mealTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update only the preparation status of a meal task
router.patch('/update-status', async (req, res) => {
  try {
      const { pantryStaffId, patientId, mealType, status } = req.body;

      // Validate inputs
      if (!pantryStaffId || !patientId || !mealType || !status) {
          return res.status(400).json({ message: 'All fields (pantryStaffId, patientId, mealType, status) are required' });
      }

      // Find the MealTask based on pantryStaffId and patientId
      const mealTask = await MealTask.findOne({ pantryStaffId, patientId });

      if (!mealTask) {
          return res.status(404).json({ message: 'Meal task not found' });
      }

      // Check if the mealType is valid
      if (!['morning', 'evening', 'night'].includes(mealType)) {
          return res.status(400).json({ message: 'Invalid meal type. It should be "morning", "evening", or "night"' });
      }

      // Check if the status is valid for preparation
      if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status. It should be one of "Pending", "In Progress", or "Completed"' });
      }

      // Update the preparation status for the specified mealType
      mealTask.preparationStatus[mealType] = status;

      // Save the updated MealTask document
      await mealTask.save();

      res.status(200).json({ message: 'Meal task preparation status updated successfully', mealTask });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating meal task status' });
  }
});

// Route to update only the preparation status of a meal task
router.patch('/update-status-delivery', async (req, res) => {
  try {
      const { deliveryPersonnelId, patientId, mealType, status } = req.body;

      // Validate inputs
      if (!deliveryPersonnelId || !patientId || !mealType || !status) {
          return res.status(400).json({ message: 'All fields (deliveryPersonnelId, patientId, mealType, status) are required' });
      }

      // Find the MealTask based on deliveryPersonnelId and patientId
      const mealTask = await MealTask.findOne({ deliveryPersonnelId, patientId });

      if (!mealTask) {
          return res.status(404).json({ message: 'Meal task not found' });
      }

      // Check if the mealType is valid
      if (!['morning', 'evening', 'night'].includes(mealType)) {
          return res.status(400).json({ message: 'Invalid meal type. It should be "morning", "evening", or "night"' });
      }

      // Check if the status is valid for preparation
      if (!['Pending', 'Out for Delivery', 'Delivered'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status. It should be one of "Pending" "Out for Delivery" or "Delivered"' });
      }

      // Update the preparation status for the specified mealType
      mealTask.deliveryStatus[mealType] = status;

      // Save the updated MealTask document
      await mealTask.save();

      res.status(200).json({ message: 'Meal task delivery Status updated successfully', mealTask });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating meal task status' });
  }
});


module.exports = router;
