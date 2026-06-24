const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    verificationStatus: {
      type: String,
      default: "pending"
    },

    available: {
      type: Boolean,
      default: true
    },

    currentLocation: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Volunteer",
  volunteerSchema
);