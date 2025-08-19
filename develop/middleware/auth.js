import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { User } from "../models/user.model.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new ErrorHandler("Not Logged In", 401));

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) return next(new ErrorHandler("User not found", 404));
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});


export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return next(
            new ErrorHandler(
                `${req.user.role} is not allowed to access this resource`,
                403
            )
        );
    next();
};




// export const isAuthenticated = async (req, res, next) => {
//   const token = req.cookies.token;
//
//   if (!token) return next(new ErrorHandler("Please login first", 401));
//
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//
//   req.user = await User.findById(decoded._id);
//
//   next();
// };
