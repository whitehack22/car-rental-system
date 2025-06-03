import { Request, Response } from "express";
import * as maintenanceService from "./maintenance.service";

// get all maintenances
export const getAllMaintenancesController = async (_req: Request, res: Response) => {
  try {
    const maintenances = await maintenanceService.getAllMaintenances()
    res.status(200).json({ data: maintenances })
    return;
  } catch (error: any) {
    console.error("Error fetching maintenances:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get maintenance by ID controller
export const getMaintenanceByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const maintenance = await maintenanceService.getMaintenanceById(id);

    if (!maintenance) {
      res.status(404).json({ message: "Maintenance not found" });
      return; 
    }

    res.status(200).json({ data: maintenance });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a maintenance controller
export const createMaintenanceController = async (req: Request, res: Response) => {
  try {
    const maintenance = await maintenanceService.createMaintenance(req.body);

    if (!maintenance) {
      res.status(400).json({ message: "Maintenance not created" });
      return;
    }
    res.status(201).json({ message: "Maintenance created successfully", maintenance });
    return;
  } catch (error: any) {
    console.error("Error creating maintenance:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update maintenance controller
export const updateMaintenanceController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await maintenanceService.updateMaintenance(id, req.body);
    res.status(200).json({ message: "Maintenance updated successfully", maintenance: updated });
    return;
  } catch (error: any) {
    console.error("Error updating maintenance:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete maintenance controller
export const deleteMaintenanceController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await maintenanceService.deleteMaintenance(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting maintenance:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple maintenance by ID controller
export const getMaintenancesByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const maintenances = await maintenanceService.getMaintenancesById(id);

    if (!maintenances || maintenances.length === 0) {
      res.status(404).json({ message: "No maintenances found" });
      return;
    }
    res.status(200).json({ data: maintenances });
    return;
  } catch (error: any) {
    console.error("Error fetching maintenances:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};