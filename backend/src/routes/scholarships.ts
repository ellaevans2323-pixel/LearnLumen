import { Router, Response, Request } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /scholarships/fund
router.post("/fund", requireAuth, async (req: AuthRequest, res: Response) => {
  const { amountXlm } = req.body as { amountXlm: number };
  const donor = req.walletAddress as string;
  const contractId = process.env.SCHOLARSHIP_CONTRACT_ID ?? "";
  const fund = await prisma.scholarshipFund.create({
    data: { contractId, donor, amountXlm, remaining: amountXlm },
  });
  res.json(fund);
});

// GET /scholarships
router.get("/", async (_req: Request, res: Response) => {
  const funds = await prisma.scholarshipFund.findMany({
    include: { disbursements: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(funds);
});

// POST /scholarships/:fundId/disburse
router.post("/:fundId/disburse", requireAuth, async (req: AuthRequest, res: Response) => {
  const { student, amount, txHash } = req.body as {
    student: string;
    amount: number;
    txHash: string;
  };
  const fund = await prisma.scholarshipFund.findUnique({
    where: { id: req.params.fundId },
  });
  if (!fund) {
    res.status(404).json({ error: "Fund not found" });
    return;
  }
  if (fund.remaining < amount) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }
  const [disbursement] = await prisma.$transaction([
    prisma.disbursement.create({
      data: { fundId: fund.id, student, amount, txHash },
    }),
    prisma.scholarshipFund.update({
      where: { id: fund.id },
      data: { remaining: fund.remaining - amount },
    }),
  ]);
  res.json(disbursement);
});

export default router;
