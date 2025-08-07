import { Request, Response, NextFunction } from "express";

import {
  createMedicineService,
  findMedicine,
  getAllMedicines,
} from "../services/medicine.services";
import { ApiError } from "../utils/apiError";
import { AppDataSource } from "../config/data-source";
import { Medicine } from "../entities/medicine.entity";

const medicineRepo = AppDataSource.getRepository(Medicine);

export const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { medicine_id, medicine_name, description, cost, expire_date } =
      req.body;
    console.log(medicine_name);
    const existinMedicine = await findMedicine(medicine_id);
    if (existinMedicine) {
      throw new ApiError("Medicine already added", 409);
    }
    const newMedicineData = {
      medicine_name,
      description,
      cost,
      expire_date,
    };
    const savedMedicine = await createMedicineService(newMedicineData);

    res.status(201).json({
      message: "Medicine created successfully",
      data: savedMedicine,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getAllMedicines();
    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("Medicine ID is required", 400);
    }

    const response = await findMedicine(id);
    if (!response) {
      throw new ApiError("Medicine not found", 404);
    }

    await medicineRepo.remove(response);
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
