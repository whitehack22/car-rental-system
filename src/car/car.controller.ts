import { Request, Response } from "express";
import * as carService from "./car.service";

// get all cars
export const getAllCarsController = async (_req: Request, res: Response) => {
  try {
    const cars = await carService.getAllCars()
    res.status(200).json({ data: cars })
    return;
  } catch (error: any) {
    console.error("Error fetching cars:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get car by ID controller
export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const car = await carService.getCarById(id);

    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return; 
    }

    res.status(200).json({ data: car });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a car controller
export const createCarController = async (req: Request, res: Response) => {
  try {
    const car = await carService.createCar(req.body);

    if (!car) {
      res.status(400).json({ message: "Car not created" });
      return;
    }
    res.status(201).json({ message: "Car created successfully", car });
    return;
  } catch (error: any) {
    console.error("Error creating car:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update car controller
export const updateCarController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await carService.updateCar(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car updated successfully", car: updated });
    return;
  } catch (error: any) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete car controller
export const deleteCarController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await carService.deleteCar(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple cars by ID controller
export const getCarsByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const cars = await carService.getCarsById(id);

    if (!cars || cars.length === 0) {
      res.status(404).json({ message: "No cars found" });
      return;
    }
    res.status(200).json({ data: cars });
    return;
  } catch (error: any) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};