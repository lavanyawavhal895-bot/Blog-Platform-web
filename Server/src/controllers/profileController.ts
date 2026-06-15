import { Request, Response } from "express";
import User from "../models/User";

// ==========================
// GET LOGGED-IN USER PROFILE
// ==========================
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpiry"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// UPDATE PROFILE
// ==========================
export const updateProfile = async (req: any, res: Response) => {
  try {
    const {
      username,
      bio,
      profileImage,
      coverImage,
      socialLinks,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Username Validation
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username,
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
          message:
            "Username must be between 3 and 30 characters",
        });
      }

      user.username = username;
    }

    // Bio Validation
    if (bio !== undefined) {
      if (bio.length > 300) {
        return res.status(400).json({
          message: "Bio cannot exceed 300 characters",
        });
      }

      user.bio = bio;
    }

    // Images
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (coverImage !== undefined) {
      user.coverImage = coverImage;
    }

    // Social Links
    if (socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks,
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -otp -otpExpiry"
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================
// PUBLIC PROFILE
// ==========================
export const getPublicProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -email -otp -otpExpiry -role"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Public Profile Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};