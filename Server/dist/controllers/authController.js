"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyOTP = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const JWT_SECRET = process.env.JWT_SECRET || "blogcmssecret";
// Configure Nodemailer
const transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email Config Error:", error);
    }
    else {
        console.log("✅ Email Server Ready");
    }
});
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const user = await User_1.default.create({
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
            await transporter.sendMail({
                from: `"Blog CMS" <${process.env.EMAIL_USER}>`,
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
        }
        catch (emailError) {
            console.error("❌ Email sending failed:", emailError);
        }
        return res.status(201).json({
            message: "User registered. Please verify OTP.",
            userId: user._id
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.register = register;
// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        return res.json({ message: "Account verified successfully." });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.verifyOTP = verifyOTP;
// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: "If account exists, reset link sent"
            });
        }
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: `"Blog CMS" <${process.env.EMAIL_USER}>`,
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            message: "Password reset successful",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid or expired token",
        });
    }
};
exports.resetPassword = resetPassword;
