// models/DeliveryPersonnel.js
const mongoose = require("mongoose");

const deliveryPersonnelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: { type: String, required: true },
  otherDetails: String
}, { timestamps: true });

const DeliveryPersonnel = mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);
module.exports = DeliveryPersonnel;
