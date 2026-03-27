// ============================================================
// What is this file?
//   Middleware is a function that runs between a request arriving
//   and the controller handling it.a security guard at the door.
//   Every protected route passes through here.
//
// How it works:
//   1. Client sends request
//   2. This middleware extracts the token, verifies it
//   3. If valid  → attaches decoded user info to req.user, calls next()
//   4. If invalid → sends 401 immediately, controller never runs
// ============================================================

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Header must exist and start with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 3. Extract the token (everything after "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify if the token is using the same secret it was signed with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded payload to req so controllers can use it
    //    decoded contains: { userId, status, (issued at) }
    req.user = decoded;

    // 6. Hand off to the next function (the controller)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;