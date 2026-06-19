import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  walletAddress?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      walletAddress: string;
    };
    req.walletAddress = payload.walletAddress;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
