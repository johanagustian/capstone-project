import { pool as dbPool } from "../config/database.js";

export const getAllEquipments = () => {
  const SQLQuery = "SELECT * FROM tb_equipment";

  return dbPool.execute(SQLQuery);
};

export const getEquipmentById = (idEquipment) => {
  const SQLQuery = `SELECT * FROM tb_equipment WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idEquipment]);
};

export const createNewEquipment = (body) => {
  const SQLQuery = `  
        INSERT INTO tb_equipment
            (unit_id, type, location, status, is_available, productivity_rate)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  return dbPool.execute(SQLQuery, [
    body.unit_id,
    body.type,
    body.location,
    body.status,
    body.is_available,
    body.productivity_rate,
  ]);
};

export const updateEquipment = (body, idEquipment) => {

    const SQLQuery = `
            UPDATE tb_equipment
            SET unit_id = ?, type = ?, location = ?, status = ?, is_available = ?, productivity_rate = ?
            WHERE id = ?
        `;

    return dbPool.execute(SQLQuery, [
            body.unit_id,
            body.type,
            body.location,
            body.status,
            body.is_available,
            body.productivity_rate,
            idEquipment,
    ]);
};

export const deleteEquipment = (idEquipment) => {
  const SQLQuery = `DELETE FROM tb_equipment WHERE id= ?`;

  return dbPool.execute(SQLQuery, [idEquipment]);
};
