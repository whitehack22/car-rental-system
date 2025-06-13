import {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation
} from "../../src/reservation/reservation.service"
import db from "../../src/Drizzle/db"
import { ReservationTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        ReservationTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Reservation Service", () => {
    describe("createReservationService", () => {
        it("should insert a reservation and return the inserted reservation", async () => {
            const reservation = {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01", 
                pickupDate: "2024-06-05", 
                returnDate: "2024-06-10"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...reservation };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createReservation(reservation)
            expect(db.insert).toHaveBeenCalledWith(ReservationTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const reservation = {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01", 
                pickupDate: "2024-06-05", 
                returnDate: "2024-06-10"
            };

            const result = await createReservation(reservation);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllReservationsService", () => {
        it("should return all reservations", async () => {
            const reservations = [
                { reservationID: 1, customerID: 1, carID: 1, reservationDate: "2024-06-01", pickupDate: "2024-06-05", returnDate: "2024-06-10" },
                { reservationID: 2, customerID: 2, carID: 2, reservationDate: "2024-06-01", pickupDate: "2024-06-05", returnDate: "2024-06-10" },
            ];
            (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce(reservations)

            const result = await getAllReservations()
            expect(result).toEqual(reservations)
        })

        it("should return empty array if no reservations", async () => {
            (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllReservations()
            expect(result).toEqual([])
        })
    })


    describe("getReservationByIdService", () => {
        it("should return a reservation if found", async () => {
            const reservation = {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01", 
                pickupDate: "2024-06-05", 
                returnDate: "2024-06-10"
            };
            (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(reservation)

            const result = await getReservationById(1)
            expect(db.query.ReservationTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(reservation)
        })

        it("should return undefined if not found", async () => {
            (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getReservationById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateReservationService", () => {
        it("should update a reservation and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateReservation(1, {
                reservationID: 1,
                customerID: 1,
                carID: 1,
                reservationDate: "2024-06-01", 
                pickupDate: "2024-06-05", 
                returnDate: "2024-06-10"
            })

            expect(db.update).toHaveBeenCalledWith(ReservationTable)
            expect(result).toBe("Reservation updated successfully")
        })
    })

    describe("deleteReservationService", () => {
        it("should delete reservation and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteReservation(1);
            expect(db.delete).toHaveBeenCalledWith(ReservationTable)
            expect(result).toBe("Reservation deleted successfully");


        })
    })


})