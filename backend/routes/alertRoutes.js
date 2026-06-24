const express = require("express");

const router = express.Router();

const auth = require(
  "../middleware/authMiddleware"
);

const {
  acceptAlert,
  createSOS,
  getAlertReport,
  getAlerts,
  updateAlertStatus
} = require(
  "../controllers/alertController"
);

router.get(
  "/reports/summary",
  auth,
  getAlertReport
);

router.get(
  "/",
  auth,
  getAlerts
);

router.post(
  "/sos",
  auth,
  createSOS
);

router.patch(
  "/:id/status",
  auth,
  updateAlertStatus
);

router.post(
  "/:id/accept",
  auth,
  acceptAlert
);

module.exports = router;
