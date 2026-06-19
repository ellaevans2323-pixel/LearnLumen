import { Router, Response } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /rewards/award
router.post("/award", requireAuth, async (req: AuthRequest, res: Response) => {
  const { studentAddress, points } = req.body as {
    studentAddress: string;
    points: number;
  };
  await prisma.user.upsert({
    where: { walletAddress: studentAddress },
    update: {},
    create: { walletAddress: studentAddress, role: "STUDENT" },
  });
  const reward = await prisma.reward.create({
    data: { studentAddr: studentAddress, points },
  });
  res.json(reward);
});

// GET /rewards/:walletAddress
router.get("/:walletAddress", requireAuth, async (req: AuthRequest, res: Response) => {
  const rewards = await prisma.reward.findMany({
    where: { studentAddr: req.params.walletAddress },
    orderBy: { createdAt: "desc" },
  });
  const total = rewards.reduce((sum, r) => sum + r.points, 0);
  res.json({ total, rewards });
});

export default router;
