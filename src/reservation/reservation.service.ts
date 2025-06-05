import db from "../Drizzle/db";
import { ReservationTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIReservation } from "../Drizzle/schema";

//Getting all reservations
export const getAllReservations = async () => {
  const reservations = await db.query.ReservationTable.findMany()
    return reservations;
};

//Getting reservation by ID
export const getReservationById = async (id: number) => {
   const reservation = await db.query.ReservationTable.findFirst({
        where: eq(ReservationTable.reservationID, id)
  })
  return reservation
};

//Create a new reservation
export const createReservation = async (reservation: TIReservation) => {
    const [inserted] = await db.insert(ReservationTable).values(reservation).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update reservation details
export const updateReservation =  async (id: number, reservation: TIReservation) => {
    await db.update(ReservationTable).set(reservation).where(eq(ReservationTable.reservationID, id))
    return "Reservation updated successfully";
};

//deleting reservation by ID
export const deleteReservation = async (id: number) => {
  await db.delete(ReservationTable).where(eq(ReservationTable.reservationID, id)).returning()
  return "Reservation deleted successfully";
};

//Getting multiple reservations by ID
export const getReservationsById = async (id: number) => {
    const reservations = await db.query.ReservationTable.findMany({
        where: eq(ReservationTable.reservationID, id)
    })
    return reservations;
}

//get reservations with customer and car
export const getReservationsWithCustomerAndCar = async () => {
  return await db.query.ReservationTable.findMany({
    with: {
      customer: true,
      car: true,
    }
  });
};
