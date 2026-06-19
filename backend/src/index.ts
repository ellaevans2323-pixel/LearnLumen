import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import credentialsRouter from "./routes/credentials";
import rewardsRouter from "./routes/rewards";
import scholarshipsRouter from "./routes/scholarships";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/credentials", credentialsRouter);
app.use("/rewards", rewardsRouter);
app.use("/scholarships", scholarshipsRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));

export default app;
