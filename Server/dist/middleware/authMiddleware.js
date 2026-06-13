"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "blogcmssecret";
/**
 * Middleware: protect
 * Verifies the incoming Bearer JWT token and attaches the decoded payload to req.user
 */
const protect = (req, res, next) => {
    // Extract token from the Authorization header (Format: Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "No token, authorization denied",
        });
    }
    try {
        // Verify the token using your environment secret key
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach decoded user data (id, role) to the request object
        req.user = decoded;
        return next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({
            message: "Token is not valid or has expired",
        });
    }
};
exports.protect = protect;
/**
 * Middleware: authorize
 * Restricts access to specific user roles (e.g., 'admin').
 * Note: Must be placed AFTER the 'protect' middleware in your routes.
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if req.user exists (fails if 'protect' was not run first)
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized. Access denied.",
            });
        }
        // Check if the user's role matches any of the allowed roles passed to the middleware
        if (!req.user.role || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden. Requires one of the following privileges: ${allowedRoles.join(", ")}`,
            });
        }
        return next();
    };
};
exports.authorize = authorize;
