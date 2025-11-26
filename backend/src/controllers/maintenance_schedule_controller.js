import {
  getAllMaintenanceSchedules,
  getMaintenanceScheduleById,
  createNewMaintenanceShcedule as modelCreateMaintenanceSchedule,
  updateMaintenanceSchedule as modelUpdateMaintenanceSchedule,
  deleteMaintenanceSchedule as modelDeleteMaintenanceSchedule,
} from "../models/maintenance_schedule_model.js";

export const getAllMaintenanceShedule = async(req, res) => {
    try {
        const [data] = await getAllMaintenanceSchedules();
        res.status(200).json({
          message: 'GET all data is success',
          data
        })
    } catch (error) {
        res.status(500).json({
          message: 'Server Error',
          serverMessage: error.message
        })
    }
};


export const getMaintenanceScheduleDetail = async (req, res) => {
  const { idMaintenanceSchedule } = req.params;

  try {
    const [data] = await getMaintenanceScheduleById(idMaintenanceSchedule);

    if (data.length === 0) {
      return res.status(404).json({
        message: "Maintenance schedule tidak ditemukan",
        data: null,
      });
    }

    res.status(200).json({
      message: "GET detail maintenance schedule success",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

export const createMaintenanceSchedule = async(req, res) => {
  const { body } = req;

  if ( !body.unit_id || !body.type || !body.scheduled_date || !body.duration_hours || !body.status ) {
      return res.status(400).json({
        message: "Failed data requested",
        data: null,
      });
    }


  try {
    await modelCreateMaintenanceSchedule(body);
    res.status(201).json({
      message: 'CREATE maintenance schedule is success',
      data : body
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

export const updateMaintenanceSchedule = async(req, res) => {
  const { idMaintenanceSchedule } = req.params;
  const { body } = req;

  try {
    await modelUpdateMaintenanceSchedule(body, idMaintenanceSchedule);
    res.status(200).json({
      message: 'UPDATE maintenance schedule is success',
      data : {
        id : idMaintenanceSchedule,
        ...body
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      messageServer: error
    })
  }
};

export const deleteMaintenanceSchedule = async(req, res) => {
  const { idMaintenanceSchedule } = req.params;

  try {
    await modelDeleteMaintenanceSchedule(idMaintenanceSchedule);
    res.status(200).json({
      message: 'DELETE maintenance schedule success',
      data: null      
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message
    })
  }
};