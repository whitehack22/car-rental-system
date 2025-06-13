import db from "../Drizzle/db";
import { CustomerTable } from "../Drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TICustomer } from "../Drizzle/schema";

//Getting all customers
export const getAllCustomers = async () => {
  const customers = await db.query.CustomerTable.findMany()
    return customers;
};

//Getting customer by ID
export const getCustomerById = async (id: number) => {
   const customer = await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, id)
  })
  return customer
};

//Create a new customer
export const createCustomer = async (customer: TICustomer) => {
    await db.insert(CustomerTable).values(customer)
    return "Customer created successfully";
}

//Get user by email service
export const getCustomerByEmailService = async (email: string) => {
   return await db.query.CustomerTable.findFirst({
        where: sql`${CustomerTable.email} = ${email}`
    });
};

// Verify user service
export const verifyCustomerService = async(email: string) => {
  await db.update(CustomerTable)
        .set({ isVerified: true, verificationCode: null })
        .where(sql`${CustomerTable.email} = ${email}`);
}

//Update customer details
export const updateCustomer =  async (id: number, customer: TICustomer) => {
    await db.update(CustomerTable).set(customer).where(eq(CustomerTable.customerID, id))
    return "Customer updated successfully";
};

//deleting customer by ID
export const deleteCustomer = async (id: number) => {
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, id))
  return "Customer deleted successfully";
};

//Getting multiple customers by ID
export const getCustomersById = async (id: number) => {
    const customers = await db.query.CustomerTable.findMany({
        where: eq(CustomerTable.customerID, id)
    })
    return customers;
}

// login a customer
export const customerLoginService = async (customer:TICustomer) => {
    //email and password
    const {email} = customer;
    return await db.query.CustomerTable.findFirst({
        columns: {
            customerID: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            phoneNumber: true,
            address: true,
            role: true
        }, where: sql`${CustomerTable.email} = ${email}`
    })

}

// Get all customers with their bookings
export const getCustomersWithBookings = async () => {
  return await db.query.CustomerTable.findMany({
    with: {
      bookings: true,
    },
  });
};

// get customers with bookings, car and location details
export const getCustomersWithBookingsAndCarDetails = async (CustomerID: number) => {
  const custID =  await db.query.CustomerTable.findFirst({
    where: eq(CustomerTable.customerID, CustomerID),
    with: {
      bookings: {
        with: {
          car: {
            with: {
              location: true
            }
          }
        }
      }
    }
  });
  return custID;
};