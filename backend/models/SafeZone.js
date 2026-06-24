const mongoose = require("mongoose");

const safeZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["police", "hospital", "shelter", "public"],
      default: "public"
    },
    location: {
      lat: Number,
      lng: Number
    },
    phone: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("SafeZone", safeZoneSchema);
