const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getVolunteers,
  upsertVolunteerProfile,
  verifyVolunteer
} = require("../controllers/volunteerController");

const router = express.Router();

router.get("/", auth, getVolunteers);
router.post("/me", auth, upsertVolunteerProfile);
router.patch("/:id/verify", auth, verifyVolunteer);

module.exports = router;
