const path = require("path");
const killPort = require("kill-port");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
  override: true,
});

async function freeConfiguredPort() {
  const rawPort = process.env.PORT || "3001";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    console.warn(`Skipping port cleanup. Invalid PORT value: ${rawPort}`);
    return;
  }

  try {
    await killPort(port, "tcp");
    console.log(`Port ${port} cleaned before dev start.`);
  } catch (error) {
    const message = String(error?.message || "");
    if (
      message.toLowerCase().includes("no process") ||
      message.toLowerCase().includes("not found")
    ) {
      console.log(`Port ${port} is already free.`);
      return;
    }

    // Do not block startup if cleanup fails for a non-critical reason.
    console.warn(`Port cleanup warning for ${port}: ${message}`);
  }
}

freeConfiguredPort().catch((error) => {
  console.warn("Port cleanup failed:", error?.message || error);
});
