// models/DietChart.js
const mongoose = require("mongoose");

const dietChartSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  meals: {
    morning: {
      ingredients: [String],
      instructions: String
    },
    evening: {
      ingredients: [String],
      instructions: String
    },
    night: {
      ingredients: [String],
      instructions: String
    }
  }
}, { timestamps: true });

const DietChart = mongoose.model("DietChart", dietChartSchema);
module.exports = DietChart;
