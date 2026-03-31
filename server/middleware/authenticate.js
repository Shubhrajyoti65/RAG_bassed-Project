const { verifyToken, getUserById } = require("../services/authService");

// Middleware to verify JWT token and attach user object to the request
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res
      .status(401)
      .json({ error: "Invalid or expired authentication token." });
  }
}

module.exports = authenticate;
