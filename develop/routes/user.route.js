//user.route.js
import express from "express";
import {
     login, logout, register, getMyProfile, getAllUsers, addAddress, addMobileNumber, verifyEmail, resendVerificationEmail
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
//import singleUpload from '../middlewares/multer.js'

const router = express.Router();

// To register a new user
router.route("/register").post(register);

//Send Verificatio Email
router.get("/verify-email/:token", verifyEmail);

//ReSend Verificatio Email
router.post("/resend-verification", resendVerificationEmail);

// Login
router.route("/login").post(login);

// logout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

// Get my profile
router.route("/allUsers").get(getAllUsers);


//Add / update Mobile number
router.route("/:id/mobile").patch(addMobileNumber);

//Add / update Address for the user
router.route("/:id/address").patch(addAddress);

export default router;
