import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

const router = Router();

// POST /auth/login  — sign a challenge with Freighter; here we just trust the wallet address
// In production, verify a signed transaction/message from Freighter.
router.post("/login", async (req: Request, res: Response) => {
  const { walletAddress, role } = req.body as {
    walletAddress: string;
    role?: string;
  };
  if (!walletAddress) {
    res.status(400).json({ error: "walletAddress required" });
    return;
  }
  const user = await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: { walletAddress, role: (role as "STUDENT" | "INSTITUTION" | "DONOR" | "ADMIN") ?? "STUDENT" },
  });
  const token = jwt.sign(
    { walletAddress: user.walletAddress },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  res.json({ token, user });
});

export default router;
