import { Router } from "express";
import { getRecomendation } from "../controllers/planOptimizationController.js";

const router = Router();

// GET: Ambil summary_json terbaru
router.get("/ai_recomendation", getRecomendation);

export default router;
