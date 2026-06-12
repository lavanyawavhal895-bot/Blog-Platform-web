import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "blogcmssecret";

// Define structured interface mapping directly onto the token signature payload schema
interface TokenPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Extend the native Express Request interface safely without resorting to any types
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from Bearer prefix assignment scheme
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    // Verify token using signature configuration key mapping
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Mutate custom authenticated request structure window with verification metadata
    req.user = decoded;
    
    return next();
  } catch (error) {
    console.error("JWT Verification Middleware Error:", error);
    return res.status(401).json({
      message: "Token is not valid or has expired",
    });
  }
};