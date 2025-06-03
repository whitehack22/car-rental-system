import { Request, Response } from "express";
import * as insuranceService from "./insurance.service";

// get all insurances
export const getAllInsurancesController = async (_req: Request, res: Response) => {
  try {
    const insurances = await insuranceService.getAllInsurances()
    res.status(200).json({ data: insurances })
    return;
  } catch (error: any) {
    console.error("Error fetching insurances:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get insurance by ID controller
export const getInsuranceByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const insurance = await insuranceService.getInsuranceById(id);

    if (!insurance) {
      res.status(404).json({ message: "Insurance not found" });
      return; 
    }

    res.status(200).json({ data: insurance });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create an insurance controller
export const createInsuranceController = async (req: Request, res: Response) => {
  try {
    const insurance = await insuranceService.createInsurance(req.body);

    if (!insurance) {
      res.status(400).json({ message: "Insurance not created" });
      return;
    }
    res.status(201).json({ message: "Insurance created successfully", insurance });
    return;
  } catch (error: any) {
    console.error("Error creating insurance:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update insurance controller
export const updateInsuranceController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await insuranceService.updateInsurance(id, req.body);
    res.status(200).json({ message: "Insurance updated successfully", insurance: updated });
    return;
  } catch (error: any) {
    console.error("Error updating insurance:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete insurance controller
export const deleteInsuranceController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await insuranceService.deleteInsurance(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting insurance:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple insurance by ID controller
export const getInsurancesByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const insurances = await insuranceService.getInsurancesById(id);

    if (!insurances || insurances.length === 0) {
      res.status(404).json({ message: "No insurances found" });
      return;
    }
    res.status(200).json({ data: insurances });
    return;
  } catch (error: any) {
    console.error("Error fetching insurances:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};