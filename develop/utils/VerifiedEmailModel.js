// VerifiedEmailModel.js
import mongoose from "mongoose";

const verifiedSchema = new mongoose.Schema({
    email: String,
    verifiedAt: { type: Date, default: Date.now },
});
export const VerifiedEmailModel = mongoose.model("VerifiedEmail", verifiedSchema);
