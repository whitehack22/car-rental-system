import db from "../Drizzle/db";
import { PaymentTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIPayment } from "../Drizzle/schema";

//Getting all payments
export const getAllPayments = async () => {
  const payments = await db.query.PaymentTable.findMany()
    return payments;
};

//Getting payment by ID
export const getPaymentById = async (id: number) => {
   const payment = await db.query.PaymentTable.findFirst({
        where: eq(PaymentTable.paymentID, id)
  })
  return payment
};

//Create a new payment
export const createPayment = async (payment: TIPayment) => {
    const [inserted] = await db.insert(PaymentTable).values(payment).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update payment details
export const updatePayment =  async (id: number, payment: TIPayment) => {
    await db.update(PaymentTable).set(payment).where(eq(PaymentTable.paymentID, id))
    return "Payment updated successfully";
};

//deleting payment by ID
export const deletePayment = async (id: number) => {
  await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, id))
  return "Payment deleted successfully";
};

//Getting multiple payments by ID
export const getPaymentsById = async (id: number) => {
    const payments = await db.query.PaymentTable.findMany({
        where: eq(PaymentTable.paymentID, id)
    })
    return payments;
}


