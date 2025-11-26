import express from "express";
import {
  createBlendingPlan,
  deleteBlendingPlan,
  getAllBlendingPlan,
  getBlendingPlanDetail,
  updateBlendingPlan,
} from "../controllers/blending_plan_controller.js";

const router = express.Router();

router.post("/", createBlendingPlan);
router.get("/", getAllBlendingPlan);
router.get("/:idPlan", getBlendingPlanDetail );
router.patch("/:idPlan", updateBlendingPlan);
router.delete("/:idPlan", deleteBlendingPlan);

export default router;
