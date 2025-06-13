import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} from "../../src/booking/booking.service"
import db from "../../src/Drizzle/db"
import { BookingsTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        BookingsTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Bookings Service", () => {
    describe("createBookingService", () => {
        it("should insert a booking and return the inserted booking", async () => {
            const booking = {
                bookingID: 1, 
                carID: 1, 
                customerID: 1, 
                rentalStartDate: "2024-06-05", 
                rentalEndDate: "2024-06-10", 
                totalAmount: "250.00"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...booking };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createBooking(booking)
            expect(db.insert).toHaveBeenCalledWith(BookingsTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const booking = {
                bookingID: 1, 
                carID: 1, 
                customerID: 1, 
                rentalStartDate: "2024-06-05", 
                rentalEndDate: "2024-06-10", 
                totalAmount: "250.00"
            };

            const result = await createBooking(booking);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllBookingsService", () => {
        it("should return all bookings", async () => {
            const bookings = [
                { bookingID: 1, carID: 1, customerID: 1, rentalStartDate: "2024-06-05", rentalEndDate: "2024-06-10", totalAmount: "250.00" },
                { bookingID: 2, carID: 2, customerID: 2, rentalStartDate: "2024-06-05", rentalEndDate: "2024-06-10", totalAmount: "250.00" }
            ];
            (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce(bookings)

            const result = await getAllBookings()
            expect(result).toEqual(bookings)
        })

        it("should return empty array if no bookings", async () => {
            (db.query.BookingsTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllBookings()
            expect(result).toEqual([])
        })
    })


    describe("getBookingByIdService", () => {
        it("should return a booking if found", async () => {
            const booking = {
                bookingID: 1, 
                carID: 1, 
                customerID: 1, 
                rentalStartDate: "2024-06-05", 
                rentalEndDate: "2024-06-10", 
                totalAmount: "250.00"
            };
            (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(booking)

            const result = await getBookingById(1)
            expect(db.query.BookingsTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(booking)
        })

        it("should return undefined if not found", async () => {
            (db.query.BookingsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getBookingById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateBookingService", () => {
        it("should update a booking and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateBooking(1, {
                bookingID: 1, 
                carID: 1, 
                customerID: 1, 
                rentalStartDate: "2024-06-05", 
                rentalEndDate: "2024-06-10", 
                totalAmount: "250.00"
            })

            expect(db.update).toHaveBeenCalledWith(BookingsTable)
            expect(result).toBe("Booking updated successfully")
        })
    })

    describe("deleteBookingService", () => {
        it("should delete a booking and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteBooking(1);
            expect(db.delete).toHaveBeenCalledWith(BookingsTable)
            expect(result).toBe("Booking deleted successfully");


        })
    })


})