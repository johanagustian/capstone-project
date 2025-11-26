import { pool as dbPool } from "../config/database.js";

export const getAllPits = () => {
    const SQLQuery = `SELECT * FROM tb_pit`

    return dbPool.execute(SQLQuery)
};

export const getPitById = (idPit) => {
  const SQLQuery = `SELECT * FROM tb_pit WHERE id = ?`;
  return dbPool.execute(SQLQuery, [idPit]);
};

export const createPit = (body) => {
    const SQLQuery = `
        INSERT INTO tb_pit
            (pit_name, geotech_status, current_elevasi, bench_readiness, hauling_route)
        VALUE (?, ?, ?, ?, ?)
    `

    return dbPool.execute(SQLQuery, [
        body.pit_name,
        body.geotech_status,
        body.current_elevasi,
        body.bench_readiness,
        body.hauling_route
    ])
}

export const updatePit = (body, idPit) => {
  const SQLQuery = `
        UPDATE tb_pit
        SET pit_name = ?, geotech_status = ?, current_elevasi = ?, bench_readiness = ?, hauling_route = ?
        WHERE id = ?
    `;

  return dbPool.execute(SQLQuery, [
    body.pit_name,
    body.geotech_status,
    body.current_elevasi,
    body.bench_readiness,
    body.hauling_route,
    idPit
  ]);
};

export const deletePit = (idPit) => {
    const SQLQuery = `
        DELETE FROM tb_pit WHERE id = ?
    `
    return dbPool.execute(SQLQuery, [idPit])
};