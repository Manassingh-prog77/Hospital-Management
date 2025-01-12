// models/MealTask.js
const mongoose = require("mongoose");

const mealTaskSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  dietChartId: { type: mongoose.Schema.Types.ObjectId, ref: "DietChart", required: true },
  pantryStaffId: { type: mongoose.Schema.Types.ObjectId, ref: "PantryStaff", required: true },
  deliveryPersonnelId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPersonnel", required: true },
  // Track status for each meal type
  preparationStatus: {
    morning: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    evening: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    night: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
  },
  deliveryStatus: {
    morning: { type: String, enum: ["Pending", "Out for Delivery", "Delivered"], default: "Pending" },
    evening: { type: String, enum: ["Pending", "Out for Delivery", "Delivered"], default: "Pending" },
    night: { type: String, enum: ["Pending", "Out for Delivery", "Delivered"], default: "Pending" }
  },
  deliveryNotes: String
}, { timestamps: true });

const MealTask = mongoose.model("MealTask", mealTaskSchema);
module.exports = MealTask;
