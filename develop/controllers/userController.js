import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/sendToken.js";
//import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
//import { Course } from "../models/Course.js";
// import cloudinary from "cloudinary";
// import getDataUri from "../utils/dataUri.js";
// import { Stats } from "../models/Stats.js";

export const register = catchAsyncError(async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;
    // const file = req.file;

    if (!firstName || !email || !password
       // || !file
     )
        return next(new ErrorHandler("Please enter all field", 400));

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 409));

    // const fileUri = getDataUri(file);
    // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        firstName,
        lastName,
        email,
        password,
        // avatar: {
        //     public_id: mycloud.public_id,
        //     url: mycloud.secure_url,
        // },
    });

    sendToken(res, user, "Registered Successfully", 201);
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
