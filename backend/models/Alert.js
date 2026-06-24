const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    location: {
      lat: Number,
      lng: Number,
      address: String
    },

    incidentType: {
      type: String,
      default: "sos"
    },

    notes: String,

    status: {
      type: String,
      enum: ["pending", "accepted", "responding", "resolved", "cancelled"],
      default: "pending"
    },

    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer"
    },

    acceptedAt: Date,
    resolvedAt: Date,

    timeline: [
      {
        status: String,
        message: String,
        actor: String,
        at: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Alert",
  alertSchema
);
