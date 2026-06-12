import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "blogcmssecret";

// Define the structural shape of your signed JWT payload
interface TokenPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Extend the native Express Request interface to include the user object safely
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * Middleware: protect
 * Verifies the incoming Bearer JWT token and attaches the decoded payload to req.user
 */
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from the Authorization header (Format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    // Verify the token using your environment secret key
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Attach decoded user data (id, role) to the request object
    req.user = decoded;
    
    return next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      message: "Token is not valid or has expired",
    });
  }
};

/**
 * Middleware: authorize
 * Restricts access to specific user roles (e.g., 'admin'). 
 * Note: Must be placed AFTER the 'protect' middleware in your routes.
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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