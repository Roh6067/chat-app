import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHanders.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

//signup controller
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // before Create
    // await newUser.save(); 
    // generateToken(newUser._id, res); 

    // after Create
    if(newUser) {
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res);
    
        res.status(201).json({
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });

        try {
          await sendWelcomeEmail( savedUser.email, savedUser.fullName, ENV.CLIENT_URL );
          
        } catch (error) {
          console.error("Failed to send welcome email: ", error.message);
        }

    }else {
        res.status(400).json({ message: "Invalid user data" }); 
    }

  } catch (error) {
    console.error("Signup Error ", error.message);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({message: "email and password are required"});
  }

  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message: "Invalid Credentials"}); // never ever tell which one is incorrect userID or Password
    const isPasswordCorrect =await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

    generateToken(user._id, res)

    res.status(200).json({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
        });

  } catch (error) {
    console.error("Error in login controller");
     return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }

};

// logout controller
export const logout = async (_, res) => {
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"logged out successfully"})

};

// update profile controller
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};