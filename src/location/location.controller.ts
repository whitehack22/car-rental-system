import { Request, Response } from "express";
import * as locationService from "./location.service";

// get all locations
export const getAllLocationsController = async (_req: Request, res: Response) => {
  try {
    const locations = await locationService.getAllLocations()
    res.status(200).json({ data: locations })
    return;
  } catch (error: any) {
    console.error("Error fetching locations:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get location by ID controller
export const getLocationByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const location = await locationService.getLocationById(id);

    if (!location) {
      res.status(404).json({ message: "Location not found" });
      return; 
    }

    res.status(200).json({ data: location });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a location controller
export const createLocationController = async (req: Request, res: Response) => {
  try {
    const location = await locationService.createLocation(req.body);

    if (!location) {
      res.status(400).json({ message: "Location not created" });
      return;
    }
    res.status(201).json({ message: "Location created successfully", location });
    return;
  } catch (error: any) {
    console.error("Error creating location:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update location controller
export const updateLocationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await locationService.updateLocation(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ message: "Location updated successfully", location: updated });
    return;
  } catch (error: any) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete location controller
export const deleteLocationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await locationService.deleteLocation(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple locations by ID controller
export const getLocationsByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const locations = await locationService.getLocationsById(id);

    if (!locations || locations.length === 0) {
      res.status(404).json({ message: "No locations found" });
      return;
    }
    res.status(200).json({ data: locations });
    return;
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};