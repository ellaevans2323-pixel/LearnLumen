import { Router, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /credentials/issue
router.post("/issue", requireAuth, async (req: AuthRequest, res: Response) => {
  const { studentAddress, institution, course } = req.body as {
    studentAddress: string;
    institution: string;
    course: string;
  };
  const timestamp = Date.now().toString();
  const hash = crypto
    .createHash("sha256")
    .update(`${course}${studentAddress}${timestamp}`)
    .digest("hex");

  // Upsert student user if not present
  await prisma.user.upsert({
    where: { walletAddress: studentAddress },
    update: {},
    create: { walletAddress: studentAddress, role: "STUDENT" },
  });

  const contractId = process.env.CREDENTIAL_CONTRACT_ID ?? "";
  const credential = await prisma.credential.create({
    data: { hash, contractId, studentAddr: studentAddress, institution, courseHash: hash },
  });
  res.json(credential);
});

// GET /credentials/:id
router.get("/:id", async (req, res: Response) => {
  const credential = await prisma.credential.findUnique({
    where: { id: req.params.id },
  });
  if (!credential) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(credential);
});

// GET /credentials/verify/:hash
router.get("/verify/:hash", async (req, res: Response) => {
  const credential = await prisma.credential.findUnique({
    where: { hash: req.params.hash },
  });
  if (!credential) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ valid: !credential.revokedAt, credential });
});

// POST /credentials/revoke/:id
router.post("/revoke/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const credential = await prisma.credential.update({
    where: { id: req.params.id },
    data: { revokedAt: new Date() },
  });
  res.json(credential);
});

export default router;
