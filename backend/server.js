const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");

const { Server } =
  require("socket.io");

const connectDB =
  require("./config/db");

dotenv.config();

if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.warn("MONGO_URI is not set. API routes that use MongoDB will fail.");
}

const app = express();

app.use(cors());

app.use(express.json());

const requireDatabase = (req, res, next) => {
  if (require("mongoose").connection.readyState !== 1) {
    return res.status(503).json({
      msg: "Database is not connected. Add MONGO_URI to backend/.env and restart the server."
    });
  }

  next();
};

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

require("./socket/socket")(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(
  "/api/auth",
  requireDatabase,
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  requireDatabase,
  require("./routes/userRoutes")
);

app.use(
  "/api/alerts",
  requireDatabase,
  require("./routes/alertRoutes")
);

app.use(
  "/api/volunteers",
  requireDatabase,
  require("./routes/volunteerRoutes")
);

app.use(
  "/api/safe-zones",
  requireDatabase,
  require("./routes/safeZoneRoutes")
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    msg: "Server error"
  });
});

server.listen(
  process.env.PORT || 5000,
  () =>
    console.log(
      `Server running on port ${process.env.PORT || 5000}`
    )
);
