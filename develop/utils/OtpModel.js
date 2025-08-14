// OtpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    otpHash: String,
    expiresAt: Date,
});
export const OtpModel = mongoose.model("Otp", otpSchema);
