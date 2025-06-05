import { Request, Response } from "express";
import * as reservationService from "./reservation.service";

// get all reservations
export const getAllReservationsController = async (_req: Request, res: Response) => {
  try {
    const reservations = await reservationService.getAllReservations()
    res.status(200).json({ data: reservations })
    return;
  } catch (error: any) {
    console.error("Error fetching reservations:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get reservation by ID controller
export const getReservationByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const reservation = await reservationService.getReservationById(id);

    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return; 
    }

    res.status(200).json({ data: reservation });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a reservation controller
export const createReservationController = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.createReservation(req.body);

    if (!reservation) {
      res.status(400).json({ message: "Reservation not created" });
      return;
    }
    res.status(201).json({ message: "Reservation created successfully", reservation });
    return;
  } catch (error: any) {
    console.error("Error creating reservation:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update reservation controller
export const updateReservationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await reservationService.updateReservation(id, req.body);
    res.status(200).json({ message: "Reservation updated successfully", reservation: updated });
    return;
  } catch (error: any) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete reservation controller
export const deleteReservationController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await reservationService.deleteReservation(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple reservations by ID controller
export const getReservationsByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const reservations = await reservationService.getReservationsById(id);

    if (!reservations || reservations.length === 0) {
      res.status(404).json({ message: "No reservations found" });
      return;
    }
    res.status(200).json({ data: reservations });
    return;
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//get reservations with car and customer
export const getReservationsDetailsController = async (req: Request, res: Response) => {
  try {
    const result = await reservationService.getReservationsWithCustomerAndCar();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching reservation details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};