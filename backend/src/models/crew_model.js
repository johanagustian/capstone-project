// backend/src/models/crew_models.js
import { pool as dbPool } from "../config/database.js";

export const getAllCrews = () => {
  const SQLQuery = "SELECT * FROM tb_karyawan";

  return dbPool.execute(SQLQuery);
};

export const getCrewById = (idCrew) => {
  const SQLQuery = "SELECT * FROM tb_karyawan WHERE id = ?";
  return dbPool.execute(SQLQuery, [idCrew]);
};

export const createNewCrew = (body) => {
  const SQLQuery = `
    INSERT INTO tb_karyawan 
    (nama, user_id, competency, current_unit_id, current_shift, presence)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return dbPool.execute(SQLQuery, [
    body.nama,
    body.user_id,
    body.competency,
    body.current_unit_id,
    body.current_shift,
    body.presence,
  ]);
};

export const updateCrew = (body, idCrew) => {
  const SQLQuery = `
    UPDATE tb_karyawan
    SET nama = ?, user_id = ?, competency = ?, current_unit_id = ?, current_shift = ?, presence = ?
    WHERE id = ?
  `;

  return dbPool.execute(SQLQuery, [
    body.nama,
    body.user_id,
    body.competency,
    body.current_unit_id,
    body.current_shift,
    body.presence,
    idCrew,
  ]);
};

export const deleteCrew = (idCrew) => {
  const SQLQuery = `DELETE FROM tb_karyawan WHERE id = ?`;
  
  return dbPool.execute(SQLQuery, [idCrew]);
};
