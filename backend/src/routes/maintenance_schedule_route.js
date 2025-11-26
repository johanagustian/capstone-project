import express from "express";

import { 
    getAllMaintenanceShedule,
    createMaintenanceSchedule,
    updateMaintenanceSchedule,
    deleteMaintenanceSchedule,  
    getMaintenanceScheduleDetail
} from "../controllers/maintenance_schedule_controller.js";

const router = express.Router();

router.post("/", createMaintenanceSchedule);

router.get("/", getAllMaintenanceShedule);

router.get("/:idMaintenanceSchedule", getMaintenanceScheduleDetail);

router.patch("/:idMaintenanceSchedule", updateMaintenanceSchedule);

router.delete("/:idMaintenanceSchedule", deleteMaintenanceSchedule);

export default router;