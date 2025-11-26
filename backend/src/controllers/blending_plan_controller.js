import {
  getAllBlendingPlans,
  getBlendingPlanById,
  createBlendingPlan as modelCreateBlendingPlan,
  updateBlendingPlan as modelUpdateBlendingPlan,
  deleteBlendingPlan as modelDeleteBlendingPlan,
} from "../models/blending_plan_model.js";

export const getAllBlendingPlan = async (req, res) => {
  try {
    const [data] = await getAllBlendingPlans();
    res.status(200).json({
      message: "GET ALL blending plan success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};

export const getBlendingPlanDetail = async (req, res) => {
  const { idPlan } = req.params;

  try {
    const [data] = await getBlendingPlanById(idPlan);

    if (data.length === 0) {
      return res.status(404).json({
        message: "Blending plan tidak ditemukan",
        data: null,
      });
    }

    res.status(200).json({
      message: "GET detail blending plan success",
      data: data[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};

export const createBlendingPlan = async (req, res) => {
  const body = req.body;

  try {
    await modelCreateBlendingPlan(body);
    res.status(201).json({
      message: "CREATE blending plan success",
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};

export const updateBlendingPlan = async (req, res) => {
  const { idPlan } = req.params;
  const body = req.body;

  try {
    await modelUpdateBlendingPlan(body, idPlan);
    res.status(200).json({
      message: "UPDATE blending plan success",
      data: { id: idPlan, ...body },
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};

export const deleteBlendingPlan = async (req, res) => {
  const { idPlan } = req.params;

  try {
    await modelDeleteBlendingPlan(idPlan);
    res.status(200).json({
      message: "DELETE blending plan success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "SERVER ERROR",
      serverMessage: error.message,
    });
  }
};
