import { createCustomer, customerLoginService, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../../src/customer/customer.service"
import db from "../../src/Drizzle/db"
import { CustomerTable, TICustomer } from "../../src/Drizzle/schema"

jest.mock("../../src/Drizzle/db", () => ({  // used to mock the database module
    insert: jest.fn(() => ({ // mock the insert method
        values: jest.fn().mockReturnThis()//mockReturnThis() is used to return the same object
    })),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        CustomerTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }
}))

describe("Customer Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("createCustomerService", () => {
        it('should insert a customer and return success message', async () => {
            const customer = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            };
            const result = await createCustomer(customer)
            expect(db.insert).toHaveBeenCalled()
            expect(result).toBe("Customer created successfully")
        })
    })


    describe('CustomerLoginService', () => {
        it("should return customer data if found", async () => {
            const mockCustomer = {
                customerID: 1,
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            };
            (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(mockCustomer)

            const result = await customerLoginService({ email: 'test@mail.com' } as TICustomer)

            expect(db.query.CustomerTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(mockCustomer)
        })

        it('should return null if customer not found', async () => {
            (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(null)

            const result = await customerLoginService({ email: 'test@mail.com' } as TICustomer)
            expect(db.query.CustomerTable.findFirst).toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

    describe("getAllCustomersService", () => {
        it("should return all customers", async () => {
            const customers = [
                { customerID: 1, firstName: 'Test', lastName: 'User', email: 'test@mail.com', password: 'hashed'},
                { customerID: 2, firstName: 'Test2', lastName: 'User2', email: 'test2@mail.com', password: 'hashed'}
            ];
            (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce(customers)

            const result = await getAllCustomers()
            expect(result).toEqual(customers)
        })

        it("should return empty array if no customers", async () => {
            (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllCustomers()
            expect(result).toEqual([])
        })
    })


    describe("getCustomerByIdService", () => {
        it("should return a customer if found", async () => {
            const customer = {
                customerID: 1,
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            };
            (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(customer)

            const result = await getCustomerById(1)
            expect(db.query.CustomerTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(customer)
        })

        it("should return undefined if not found", async () => {
            (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getCustomerById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateCustomerService", () => {
        it("should update a customer and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateCustomer(1, {
                customerID: 1,
                firstName: 'Test',
                lastName: 'User',
                email: 'test@mail.com',
                password: 'hashed'
            })

            expect(db.update).toHaveBeenCalledWith(CustomerTable)
            expect(result).toBe("Customer updated successfully")
        })
    })

    describe("deleteCustomerService", () => {
        it("should delete a customer and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteCustomer(1);
            expect(db.delete).toHaveBeenCalledWith(CustomerTable)
            expect(result).toBe("Customer deleted successfully");


        })
    })

})