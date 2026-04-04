const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});
const express = require("express");
const cors = require("cors");
const config = require("./config");
const healthRoute = require("./routes/healthRoute");
const analyzeRoute = require("./routes/analyzeRoute");
const authRoute = require("./routes/authRoute");
const historyRoute = require("./routes/historyRoute");
const errorHandler = require("./middleware/errorHandler");
const { connectMongo } = require("./services/mongoService");

if (config.JWT_SECRET === "change-this-in-production") {
  console.warn(
    "JWT_SECRET is using default value. Set JWT_SECRET in .env for production."
  );
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api", healthRoute);
app.use("/api", authRoute);
app.use("/api", analyzeRoute);
app.use("/api", historyRoute);

app.use(errorHandler);

// Function to connect to database and start the Express server
async function start() {
  await connectMongo();

  const server = app.listen(config.PORT, () => {
    console.log(`NyayaSahayak server running on port ${config.PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${config.PORT} is already in use. Stop the existing process or set a different PORT in .env.`
      );
      process.exit(1);
    }
    throw err;
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
