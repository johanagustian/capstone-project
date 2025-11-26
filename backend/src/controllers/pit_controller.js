import { 
    getAllPits, 
    getPitById,
    createPit as modelCreatePit, 
    updatePit as modelUpdatePit, 
    deletePit as modelDeletePit
} from "../models/pit_model.js";

export const getAllPit = async(req, res) => {
    try {
        const [data] = await getAllPits();
        res.status(200).json({
            message : 'GET ALL pit is success',
            data
        })
    } catch (error) {
        res.status(500).json({
            message: 'SERVER ERROR',
            serverMessage: error.message
        })
    }
}

export const getPitDetail = async (req, res) => {
  const { idPit } = req.params;

  try {
    const [data] = await getPitById(idPit);

    if (data.length === 0) {
      return res.status(404).json({
        message: "Pit tidak ditemukan",
        data: null,
      });
    }

    res.status(200).json({
      message: "GET detail Pit success",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};

export const createPit = async(req, res) => {
    const { body } = req;

    if (
      !body.pit_name ||
      !body.geotech_status ||
      !body.current_elevasi ||
      !body.bench_readiness ||
      !body.hauling_route
    ) {
      return res.status(400).json({
        message: "Failed data requested",
        data: null,
      });
    }

    try {
        await modelCreatePit(body);
        res.status(201).json({
            message: 'CREATE Pit is success',
            data : body
        })
    } catch (error) {
        res.status(500).json({
          message: "SERVER ERROR",
          serverMessage: error.message,
        });
    }
}

export const updatePit = async(req, res) => {
    const {idPit } = req.params;
    const { body } = req;

    try {
      await modelUpdatePit(body, idPit);
      res.status(200).json({
        message: 'UPDATE data success',
        data: {
            id : idPit,
            ...body
        }
      })  
    } catch (error) {
        res.status(500).json({
          message: "SERVER ERROR",
          serverMessage: error.message,
        });
    }
}

export const deletePit = async(req, res) => {
    const { idPit } = req.params;

    try {
        await modelDeletePit(idPit);
        res.status(200).json({
            message: 'DELETE data success',
            data: null
        })
    } catch (error) {
        res.status(500).json({
          message: "SERVER ERROR",
          serverMessage: error.message,
        });
    }
}