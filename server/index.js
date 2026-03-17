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
const vectorStoreInstance = require("./vectorStore/instance");
const { loadCaseDataset } = require("./services/caseDatasetService");
const { connectMongo } = require("./services/mongoService");

if (!config.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

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

async function start() {
  await connectMongo();
  const caseDataset = loadCaseDataset();

  console.log("Initializing vector store...");

  await vectorStoreInstance.initialize(caseDataset);

  console.log("Vector store initialized");
  console.log("Embedding model:", config.EMBEDDING_MODEL);

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
