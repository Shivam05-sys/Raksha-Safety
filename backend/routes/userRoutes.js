const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getProfile,
  getUsers,
  updateProfile
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.get("/", auth, getUsers);

module.exports = router;
