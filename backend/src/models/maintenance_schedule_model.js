import { pool as dbPool } from "../config/database.js";

export const getAllMaintenanceSchedules = () => {
    const SQLQuery = `SELECT * FROM tb_maintenance_schedule`

    return dbPool.execute(SQLQuery);
};

export const getMaintenanceScheduleById = (idMaintenanceSchedule) => {
  const SQLQuery = `SELECT * FROM tb_maintenance_schedule WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idMaintenanceSchedule]);
};

export const createNewMaintenanceShcedule = (body) => {
    const SQLQuery = `
        INSERT INTO tb_maintenance_schedule
            (unit_id, type, scheduled_date, duration_hours, status)
        VALUES (?, ?, ?, ?, ?)
    `

    return dbPool.execute(SQLQuery, [
        body.unit_id,
        body.type,
        body.scheduled_date,
        body.duration_hours,
        body.status
    ])
}

export const updateMaintenanceSchedule = (body, idMaintenanceSchedule) => {
  const SQLQuery = `
            UPDATE tb_maintenance_schedule
            SET unit_id = ?, type = ?, scheduled_date = ?, duration_hours = ?, status = ?
            WHERE id = ?
        `;

  console.log({
    unit: body.unit_id,
    type: body.type,
    date: body.scheduled_date,
    duration: body.duration_hours,
    status: body.status,
    id: idMaintenanceSchedule,
  });

  return dbPool.execute(SQLQuery, [
    body.unit_id,
    body.type,
    body.scheduled_date,
    body.duration_hours,
    body.status,
    idMaintenanceSchedule,
  ]);
};

export const deleteMaintenanceSchedule = (idMaintenanceSchedule) => {
    const SQLQuery = `DELETE FROM tb_maintenance_schedule WHERE id = ?`

    return dbPool.execute(SQLQuery, [idMaintenanceSchedule])
}