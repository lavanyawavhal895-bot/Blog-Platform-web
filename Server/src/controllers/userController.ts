import { Request, Response } from "express";
import User from "../models/User";

export const getPublicProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username bio profileImage coverImage socialLinks"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};