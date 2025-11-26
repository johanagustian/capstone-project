import {
  getAllCrews,
  getCrewById,
  createNewCrew as modelCreateCrew,
  updateCrew as modelUpdateCrew,
  deleteCrew as modelDeleteCrew,
} from "../models/crew_model.js";

export const getAllCrew = async (req, res) => {
  try {
    const [data] = await getAllCrews();
    res.json({ 
        message: "GET all crews success", 
        data 
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

export const getCrewDetail = async (req, res) => {
  const { idCrew } = req.params;

  try {
    const [data] = await getCrewById(idCrew);

    if (data.length === 0) {
      return res.status(404).json({
        message: "Crew tidak ditemukan",
        data: null,
      });
    }

    res.json({
      message: "GET detail crew success",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error,
    });
  }
};

export const createNewCrew = async (req, res) => {
  const { body } = req;

  if (!body.nama || !body.competency || !body.current_unit_id || !body.current_shift || !body.presence) {
    
    return res.status(400).json({
      message: "Anda mengirimkan data yang salah",
      data: null,
    });
  }

  try {
    await modelCreateCrew(body);
    res.status(201).json({ 
      message: "CREATE new crew success", 
      data: body 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error", 
      serverMessage: error 
    });
  }
};

export const updateCrew = async (req, res) => {
  const { idCrew } = req.params;
  const { body } = req;

  try {
    await modelUpdateCrew(body, idCrew);
    res.json({
      message: "UPDATE crew success",
      data: { 
        id: idCrew, 
        ...body },
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error", 
      serverMessage: error 
    });
  }
};

export const deleteCrew = async (req, res) => {
  const { idCrew } = req.params;

  try {
    await modelDeleteCrew(idCrew);
    res.json({ 
      message: "DELETE crew success", 
      data: null 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server Error", 
      serverMessage: error 
    });
  }
};
