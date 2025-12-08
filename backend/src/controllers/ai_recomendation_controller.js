import { getAllRecomendation } from "../models/plan_optimization_log.js";

export const getRecomendation = async (req, res) => {
    try {
        const [rows] = await getAllRecomendation();

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No summary data found",
                data: null,
            });
        }

        // Ambil hanya recomendation_json
        const scenarioJson = rows[0].scenario_json;

        return res.status(200).json({
            message: "Summary retrieved successfully",
            data: scenarioJson,
        });

    } catch (error) {
        console.error("Error fetching summary:", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
