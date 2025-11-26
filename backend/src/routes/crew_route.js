// backend/src/routes/crew_route.js
import express from "express";
import {
  createNewCrew,
  getAllCrew,
  getCrewDetail,
  updateCrew,
  deleteCrew,
} from "../controllers/crew_controller.js";

const router = express.Router();

router.post("/", createNewCrew);

router.get("/", getAllCrew);

router.get("/:idCrew", getCrewDetail);

router.patch("/:idCrew", updateCrew);

router.delete("/:idCrew", deleteCrew);

export default router;
