//userController.js
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { sendVerificationEmail, sendConfirmationEmail } from "../utils/sendEmail.js";

const FRONTEND_URL = process.env.NODE_ENV === "prod" ? process.env.PROD_FRONTEND_URL : process.env.DEV_FRONTEND_URL

export const register = catchAsyncError(async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName ||!email || !password  )
        return next(new ErrorHandler("Please enter all field", 400));

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 409));

    user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    sendToken(res, user, "Registered Successfully", 201);

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const verificationUrl = `${FRONTEND_URL}/VerifyEmail/${verificationToken}`;
    await sendVerificationEmail(user.email, verificationUrl);

});

//Verify Email
export const verifyEmail = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Invalid or expired token", 400));

  if (user.isVerified) {
    return next(new ErrorHandler("Email already verified", 400));
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save();

  // ✅ Send confirmation email
  await sendConfirmationEmail(user.email, user.firstName, user.lastName);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});



//Resend Verifiction Email
export const resendVerificationEmail = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found", 404));
  if (user.isVerified) return next(new ErrorHandler("Email already verified", 400));

  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  const verificationUrl = `${FRONTEND_URL}/VerifyEmail/${verificationToken}`;
  await sendVerificationEmail(user.email, verificationUrl);

  res.status(200).json({
    success: true,
    message: "Verification email resent successfully",
  });
});


export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please enter all field", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect Email or Password", 401));

  if (!user.isVerified) {
    return next(new ErrorHandler("Please verify your email before logging in", 403));
  }

  sendToken(res, user, `Welcome back, ${user.firstName} ${user.lastName}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    success: true,
    user,
  });
});


// API route to get all registered users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});


// update Mobile Number
export const addMobileNumber = catchAsyncError(async (req, res, next) => {
  // const user = await User.findById(req?.user?._id);
    const { id } = req.params;
    const { mobile } = req.body;
    const user = await User.findById(id);
    if (mobile) user.mobile = mobile;

    await user.save();
    res.status(200).json({
        success: true,
        message: "Mobile added Successfully",
    });
});

// add / update Adress
export const addAddress = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { addressLine1, addressLine2, zipCode } = req.body;

    const country = req.body.country || {};
    const state = req.body.state || {};
    const city = req.body.city || {};

    const { id: countryId,  name:countryName,  iso2:countryIso2,  iso3, phonecode,capital, currency, native, emoji } = country
    const { id: stateId,  name:stateName,  iso2:stateIso2, } = state
    const { id: cityId,  name:cityName,  latitude,  longitude} = city

    const user = await User.findById(id);
    if (!user){
       return next(new ErrorHandler("User not found", 404));
    }
    // if (!addressLine1 || !zipCode ){
    //     return next(new ErrorHandler("Please enter all required field", 400));
    // }

    user.address = {
      addressLine1, addressLine2,
      country:{
        id: countryId, name:countryName, iso2:countryIso2,  iso3, phonecode,capital, currency, native, emoji
      },
      state:{
        id: stateId, name:stateName, iso2:stateIso2
      },
      city:{
        id: cityId, name:cityName, latitude, longitude
      },
      zipCode
    }

    await user.save();
    res.status(200).json({
        success: true,
        message: "Address added Successfully",
    });
});
