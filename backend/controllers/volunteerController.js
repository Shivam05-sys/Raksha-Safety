const Volunteer = require("../models/Volunteer");

exports.getVolunteers = async (req, res) => {
  const volunteers = await Volunteer.find()
    .populate("userId", "name email phone role")
    .sort({ createdAt: -1 });

  res.json(volunteers);
};

exports.upsertVolunteerProfile = async (req, res) => {
  const { available, lat, lng, verificationStatus } = req.body;

  const volunteer = await Volunteer.findOneAndUpdate(
    { userId: req.user.id },
    {
      userId: req.user.id,
      available,
      verificationStatus,
      currentLocation: {
        lat,
        lng
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(volunteer);
};

exports.verifyVolunteer = async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "verified" },
    { new: true }
  ).populate("userId", "name email phone role");

  if (!volunteer) {
    return res.status(404).json({ msg: "Volunteer not found" });
  }

  res.json(volunteer);
};
