import { Router } from "express";
import { getSummary } from "../controllers/planOptimizationController.js";

const router = Router();

// GET: Ambil summary_json terbaru
router.get("/ai_summary", getSummary);

export default router;
