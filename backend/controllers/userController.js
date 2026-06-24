const User = require("../models/User");

const publicUserFields = "name email phone role safetyProfile emergencyContacts";

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select(publicUserFields);

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name, phone, safetyProfile, emergencyContacts } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      phone,
      safetyProfile,
      emergencyContacts
    },
    { new: true, runValidators: true }
  ).select(publicUserFields);

  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.find()
    .select(publicUserFields)
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(users);
};
