import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} from "../../src/payment/payment.service"
import db from "../../src/Drizzle/db"
import { PaymentTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        PaymentTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Payment Service", () => {
    describe("createPaymentService", () => {
        it("should insert a payment and return the inserted payment", async () => {
            const payment = {
                paymentID: 1,
                bookingID: 1, 
                paymentDate: "2024-06-05", 
                amount: "250.00", 
                paymentMethod: "Credit Card"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...payment };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createPayment(payment)
            expect(db.insert).toHaveBeenCalledWith(PaymentTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const payment = {
                paymentID: 1,
                bookingID: 1, 
                paymentDate: "2024-06-05", 
                amount: "250.00", 
                paymentMethod: "Credit Card"
            };

            const result = await createPayment(payment);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllPaymentsService", () => {
        it("should return all payments", async () => {
            const payments = [
                { paymentID: 1, bookingID: 1, paymentDate: "2024-06-05", amount: "250.00", paymentMethod: "Credit Card" },
                { paymentID: 2, bookingID: 2, paymentDate: "2024-06-05", amount: "250.00", paymentMethod: "Mpesa"  },
            ];
            (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce(payments)

            const result = await getAllPayments()
            expect(result).toEqual(payments)
        })

        it("should return empty array if no payments", async () => {
            (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllPayments()
            expect(result).toEqual([])
        })
    })


    describe("getPaymentByIdService", () => {
        it("should return a payment if found", async () => {
            const payment = {
                paymentID: 1,
                bookingID: 1, 
                paymentDate: "2024-06-05", 
                amount: "250.00", 
                paymentMethod: "Credit Card"
            };
            (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(payment)

            const result = await getPaymentById(1)
            expect(db.query.PaymentTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(payment)
        })

        it("should return undefined if not found", async () => {
            (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getPaymentById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updatePaymentService", () => {
        it("should update a payment and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updatePayment(1, {
                paymentID: 1,
                bookingID: 1, 
                paymentDate: "2024-06-05", 
                amount: "250.00", 
                paymentMethod: "Credit Card"
            })

            expect(db.update).toHaveBeenCalledWith(PaymentTable)
            expect(result).toBe("Payment updated successfully")
        })
    })

    describe("deletePaymentService", () => {
        it("should delete payment and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deletePayment(1);
            expect(db.delete).toHaveBeenCalledWith(PaymentTable)
            expect(result).toBe("Payment deleted successfully");


        })
    })


})