const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } =
    req.body;

  const existing = await User.findOne({ email });

  if (existing)
    return res.status(409).json({
      msg: "Email already registered"
    });

  const hash = await bcrypt.hash(
    password,
    10
  );

  const user = await User.create({
    name,
    email,
    password: hash,
    role
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

exports.login = async (req, res) => {
  const { email, password } =
    req.body;

  const user =
    await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      msg: "User not found"
    });

  const match =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!match)
    return res.status(400).json({
      msg: "Invalid Password"
    });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: "7d"
    }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
