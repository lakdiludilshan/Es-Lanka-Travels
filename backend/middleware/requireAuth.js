const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.Authorization;
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    console.log("Token found in cookies", token);

    const decoded = jwt.verify(token, process.env.SECRET);
    if (Date.now() > decoded.exp * 1000) {
      console.log("Token expired");
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    console.log("User found from cookie", decoded.sub);

    const user = await User.findById(decoded.sub);
    if (!user) {
      console.log("user not found from cookie");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = requireAuth;
