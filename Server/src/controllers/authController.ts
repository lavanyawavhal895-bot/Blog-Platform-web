import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const JWT_SECRET = process.env.JWT_SECRET || "blogcmssecret";
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // ISOLATED EMAIL LOGIC: 
    // If this fails, the user is still created, and we log the error instead of crashing.
    try {
      console.log("📧 Sending OTP:", otp);
      console.log("📧 Sending to:", email);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify Your Blog CMS Account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Blog CMS 🚀</h2>
            <p>Your verification code is:</p>
            <h1 style="color:#7c3aed; letter-spacing:4px;">
              ${otp}
            </h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });

      console.log("✅ Email sent successfully");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
    }

    return res.status(201).json({ 
      message: "User registered. Please verify OTP.", 
      userId: user._id 
    });
    
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({ message: "Account verified successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If account exists, reset link sent"
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below link:</p>
        <a href="${resetLink}">
          Reset Password
        </a>
      `,
    });

    return res.status(200).json({
      message: "Reset link sent"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};