const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    password: String,

    phone: String,

    safetyProfile: {
      age: Number,
      bloodGroup: String,
      address: String,
      medicalNotes: String,
      preferredLanguage: String
    },

    role: {
      type: String,
      enum: ["user", "volunteer", "admin"],
      default: "user"
    },

    emergencyContacts: [
      {
        name: String,
        relation: String,
        phone: String,
        priority: {
          type: Number,
          default: 1
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
