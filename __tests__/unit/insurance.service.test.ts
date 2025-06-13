import {
    createInsurance,
    getAllInsurances,
    getInsuranceById,
    updateInsurance,
    deleteInsurance
} from "../../src/insurance/insurance.service"
import db from "../../src/Drizzle/db"
import { InsuranceTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        InsuranceTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Insurance Service", () => {
    describe("createInsuranceService", () => {
        it("should insert an insurance and return the inserted insurance", async () => {
            const insurance = {
                insuranceID: 1, 
                carID: 1, 
                insuranceProvider: "ABC Insurance", 
                policyNumber: "12345", 
                startDate: "2024-01-01", 
                endDate: "2024-12-31"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...insurance };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createInsurance(insurance)
            expect(db.insert).toHaveBeenCalledWith(InsuranceTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const insurance = {
                insuranceID: 1, 
                carID: 1, 
                insuranceProvider: "ABC Insurance", 
                policyNumber: "12345", 
                startDate: "2024-01-01", 
                endDate: "2024-12-31"
            };

            const result = await createInsurance(insurance);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllInsurancesService", () => {
        it("should return all insurances", async () => {
            const insurances = [
                { insuranceID: 1 , carID: 1, insuranceProvider: "ABC Insurance", policyNumber: "12345", startDate: "2024-01-01", endDate: "2024-12-31" },
                { insuranceID: 2 , carID: 2, insuranceProvider: "ABC Insurance", policyNumber: "12345", startDate: "2024-01-01", endDate: "2024-12-31" }
            ];
            (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce(insurances)

            const result = await getAllInsurances()
            expect(result).toEqual(insurances)
        })

        it("should return empty array if no insurances", async () => {
            (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllInsurances()
            expect(result).toEqual([])
        })
    })


    describe("getInsuranceByIdService", () => {
        it("should return an insurance if found", async () => {
            const insurance = {
                insuranceID: 1, 
                carID: 1, 
                insuranceProvider: "ABC Insurance", 
                policyNumber: "12345", 
                startDate: "2024-01-01", 
                endDate: "2024-12-31"
            };
            (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(insurance)

            const result = await getInsuranceById(1)
            expect(db.query.InsuranceTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(insurance)
        })

        it("should return undefined if not found", async () => {
            (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getInsuranceById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateInsuranceService", () => {
        it("should update an insurance and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateInsurance(1, {
                insuranceID: 1, 
                carID: 1, 
                insuranceProvider: "ABC Insurance", 
                policyNumber: "12345", 
                startDate: "2024-01-01", 
                endDate: "2024-12-31"
            })

            expect(db.update).toHaveBeenCalledWith(InsuranceTable)
            expect(result).toBe("Insurance updated successfully")
        })
    })

    describe("deleteInsuranceService", () => {
        it("should delete an insurance and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteInsurance(1);
            expect(db.delete).toHaveBeenCalledWith(InsuranceTable)
            expect(result).toBe("Insurance deleted successfully");


        })
    })


})