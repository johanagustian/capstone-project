import { pool as dbPool } from "../config/database.js";

export const getAllRecomendation = () => {
    const SQLQuery = `SELECT * FROM plan_optimization_log
    ORDER BY plan_id DESC
    LIMIT 1;`

    return dbPool.execute(SQLQuery);
};