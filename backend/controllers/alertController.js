const Alert = require("../models/Alert");
const Volunteer = require("../models/Volunteer");

exports.getAlerts = async (
  req,
  res
) => {
  const query =
    req.user.role === "user"
      ? { userId: req.user.id }
      : {};

  const alerts = await Alert.find(query)
    .populate("userId", "name email phone emergencyContacts safetyProfile")
    .populate({
      path: "assignedVolunteer",
      populate: {
        path: "userId",
        select: "name email phone"
      }
    })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(alerts);
};

exports.createSOS = async (
  req,
  res
) => {
  const {
    lat,
    lng,
    notes
  } = req.body;

  const alert =
    await Alert.create({
      userId: req.user.id,

      location: {
        lat,
        lng
      },
      notes,
      timeline: [
        {
          status: "pending",
          message: "SOS alert created",
          actor: req.user.id
        }
      ]
    });

  req.io.emit("newSOS", alert);

  res.json(alert);
};

exports.updateAlertStatus = async (req, res) => {
  const { status } = req.body;
  const update = {
    status,
    $push: {
      timeline: {
        status,
        message: `Alert marked ${status}`,
        actor: req.user.id
      }
    }
  };

  if (status === "resolved" || status === "cancelled") {
    update.resolvedAt = new Date();
  }

  const alert = await Alert.findByIdAndUpdate(req.params.id, update, {
    new: true
  });

  if (!alert) {
    return res.status(404).json({ msg: "Alert not found" });
  }

  req.io.emit("alertUpdated", alert);
  res.json(alert);
};

exports.acceptAlert = async (req, res) => {
  const volunteer = await Volunteer.findOneAndUpdate(
    { userId: req.user.id },
    { userId: req.user.id, available: true },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    {
      status: "accepted",
      assignedVolunteer: volunteer._id,
      acceptedAt: new Date(),
      $push: {
        timeline: {
          status: "accepted",
          message: "Volunteer accepted the request",
          actor: req.user.id
        }
      }
    },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({ msg: "Pending alert not found" });
  }

  req.io.emit("alertUpdated", alert);
  res.json(alert);
};

exports.getAlertReport = async (req, res) => {
  const [
    totalAlerts,
    pendingAlerts,
    resolvedAlerts,
    volunteersAssigned
  ] = await Promise.all([
    Alert.countDocuments(),
    Alert.countDocuments({ status: "pending" }),
    Alert.countDocuments({ status: "resolved" }),
    Alert.countDocuments({ assignedVolunteer: { $ne: null } })
  ]);

  const resolved = await Alert.find({
    acceptedAt: { $ne: null },
    resolvedAt: { $ne: null }
  }).select("acceptedAt resolvedAt");

  const averageResponseMs = resolved.length
    ? resolved.reduce(
        (sum, alert) => sum + (alert.resolvedAt - alert.acceptedAt),
        0
      ) / resolved.length
    : 0;

  res.json({
    totalAlerts,
    pendingAlerts,
    resolvedAlerts,
    volunteersAssigned,
    successfulAssistanceRate: totalAlerts
      ? Math.round((resolvedAlerts / totalAlerts) * 100)
      : 0,
    volunteerResponseRate: totalAlerts
      ? Math.round((volunteersAssigned / totalAlerts) * 100)
      : 0,
    averageResponseMinutes: Math.round(averageResponseMs / 60000)
  });
};
