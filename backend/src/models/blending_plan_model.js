import { pool as dbPool } from "../config/database.js";

export const getAllBlendingPlans = () => {
  const SQLQuery = `SELECT * FROM tb_blending_plan`;
  return dbPool.execute(SQLQuery);
};

export const getBlendingPlanById = (idPlan) => {
  const SQLQuery = `SELECT * FROM tb_blending_plan WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idPlan]);
};

export const createBlendingPlan = (body) => {
  const SQLQuery = `
        INSERT INTO tb_blending_plan
        (plan_week, plan_year, target_tonnage_weekly, target_calori, target_ash_max, initial_ash_draft, final_ash_result, is_approved_mine, is_approved_shipping)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  return dbPool.execute(SQLQuery, [
    body.plan_week,
    body.plan_year,
    body.target_tonnage_weekly,
    body.target_calori,
    body.target_ash_max,
    body.initial_ash_draft,
    body.final_ash_result,
    body.is_approved_mine ?? 0,
    body.is_approved_shipping ?? 0,
  ]);
};

export const updateBlendingPlan = (body, idPlan) => {
  const SQLQuery = `
        UPDATE tb_blending_plan
        SET plan_week = ?, plan_year = ?, target_tonnage_weekly = ?, target_calori = ?, target_ash_max = ?, initial_ash_draft = ?, final_ash_result = ?, is_approved_mine = ?, is_approved_shipping = ?
        WHERE id = ?
    `;

  return dbPool.execute(SQLQuery, [
    body.plan_week,
    body.plan_year,
    body.target_tonnage_weekly,
    body.target_calori,
    body.target_ash_max,
    body.initial_ash_draft,
    body.final_ash_result,
    body.is_approved_mine,
    body.is_approved_shipping,
    idPlan,
  ]);
};

export const deleteBlendingPlan = (idPlan) => {
  const SQLQuery = `DELETE FROM tb_blending_plan WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idPlan]);
};
