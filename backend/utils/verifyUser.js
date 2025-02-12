import jwt from "jsonwebtoken";
import { errorHandler } from "./error";

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(errorHandler( 401, "You need to login"));
  }
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return next(errorHandler( 401, "You need to login"));
    }
    req.user = user;
    next();
  });
};
