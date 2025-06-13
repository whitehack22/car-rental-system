import {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation
} from "../../src/location/location.service"
import db from "../../src/Drizzle/db"
import { LocationTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        LocationTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Location Service", () => {
    describe("createLocationService", () => {
        it("should insert a location and return the inserted location", async () => {
            const location = {
                locationID: 1, 
                locationName: "Nairobi", 
                address: "123 Nairobi", 
                contactNumber: "1234567890"
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...location };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createLocation(location)
            expect(db.insert).toHaveBeenCalledWith(LocationTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const location = {
                locationID: 1, 
                locationName: "Nairobi", 
                address: "123 Nairobi", 
                contactNumber: "1234567890"
            };

            const result = await createLocation(location);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllLocationsService", () => {
        it("should return all locations", async () => {
            const locations = [
                { locationID: 1, locationName: "Nairobi", address: "123 Nairobi", contactNumber: "1234567890" },
                { locationID: 2, locationName: "Nyeri", address: "123 Nyeri", contactNumber: "1234567890" }
            ];
            (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce(locations)

            const result = await getAllLocations()
            expect(result).toEqual(locations)
        })

        it("should return empty array if no locations", async () => {
            (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllLocations()
            expect(result).toEqual([])
        })
    })


    describe("getLocationByIdService", () => {
        it("should return a location if found", async () => {
            const location = {
                locationID: 1, 
                locationName: "Nairobi", 
                address: "123 Nairobi", 
                contactNumber: "1234567890"
            };
            (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(location)

            const result = await getLocationById(1)
            expect(db.query.LocationTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(location)
        })

        it("should return undefined if not found", async () => {
            (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getLocationById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateLocationService", () => {
        it("should update a location and return success message", async () => {
            const mockUpdatedLocation = {
                locationID: 1, 
                locationName: "Nairobi", 
                address: "123 Nairobi", 
                contactNumber: "1234567890"
                };

                (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([mockUpdatedLocation]) 
                    })
                })
        });

    const result = await updateLocation(1, mockUpdatedLocation);

            expect(db.update).toHaveBeenCalledWith(LocationTable)
            expect(result).toEqual(mockUpdatedLocation);
        })
        
    })

    describe("deleteLocationService", () => {
        it("should delete a location and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteLocation(1);
            expect(db.delete).toHaveBeenCalledWith(LocationTable)
            expect(result).toBe("Location deleted successfully");


        })
    })


})