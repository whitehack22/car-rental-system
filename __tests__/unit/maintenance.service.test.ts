import {
    createMaintenance,
    getAllMaintenances,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
} from "../../src/maintenance/maintenance.service"
import db from "../../src/Drizzle/db"
import { MaintenanceTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        MaintenanceTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Maintenance Service", () => {
    describe("createMaintenanceService", () => {
        it("should insert a maintenance and return the inserted maintenance", async () => {
            const maintenance = {
                maintenanceID: 1,
                carID: 1, 
                maintenanceDate: "2024-06-01", 
                description: "Oil change and tire rotation"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...maintenance };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createMaintenance(maintenance)
            expect(db.insert).toHaveBeenCalledWith(MaintenanceTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const maintenance = {
                maintenanceID: 1,
                carID: 1, 
                maintenanceDate: "2024-06-01", 
                description: "Oil change and tire rotation"
            };

            const result = await createMaintenance(maintenance);
            expect(result).toBeNull()

        })

        //
    })


    describe("getMaintenancesService", () => {
        it("should return all maintenances", async () => {
            const maintenances = [
                { maintenanceID: 1, carID: 2, maintenanceDate: "2024-06-01", description: "Oil change and tire rotation" },
                { maintenanceID: 2, carID: 2, maintenanceDate: "2024-06-01", description: "Oil change and tire rotation" }
            ];
            (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce(maintenances)

            const result = await getAllMaintenances()
            expect(result).toEqual(maintenances)
        })

        it("should return empty array if no maintenances", async () => {
            (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllMaintenances()
            expect(result).toEqual([])
        })
    })


    describe("getMaintenanceByIdService", () => {
        it("should return a maintenance if found", async () => {
            const maintenance = {
                maintenanceID: 1,
                carID: 1, 
                maintenanceDate: "2024-06-01", 
                description: "Oil change and tire rotation"
            };
            (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValueOnce(maintenance)

            const result = await getMaintenanceById(1)
            expect(db.query.MaintenanceTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(maintenance)
        })

        it("should return undefined if not found", async () => {
            (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getMaintenanceById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateMaintenanceService", () => {
        it("should update a maintenance and return success message", async () => {
            (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockResolvedValueOnce(undefined)
                })
            })

            const result = await updateMaintenance(1, {
                maintenanceID: 1,
                carID: 1, 
                maintenanceDate: "2024-06-01", 
                description: "Oil change and tire rotation"
            })

            expect(db.update).toHaveBeenCalledWith(MaintenanceTable)
            expect(result).toBe("Maintenance updated successfully")
        })
    })

    describe("deleteMaintenanceService", () => {
        it("should delete a maintenance and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteMaintenance(1);
            expect(db.delete).toHaveBeenCalledWith(MaintenanceTable)
            expect(result).toBe("Maintenance deleted successfully");


        })
    })


})