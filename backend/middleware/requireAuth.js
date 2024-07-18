const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function requireAuth(req, res, next) {
  try {
    //read token off the cookies
    const token = req.cookies.Authorization;

    //decode the token
    const decoded = jwt.verify(token, process.env.SECRET);

    //check expiration
    if (Date.now() > decoded.exp) return res.sendStatus(401);

    //find user using decoded sub
    const user = await User.findById(decoded.sub);
    if (!user) return res.sendStatus(401);

    //attach user to req
    req.user = user;

    //continue on
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

module.exports = requireAuth;
