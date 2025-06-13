import {
    createCar,
    getAllCars,
    updateCar,
    deleteCar,
    getCarById
} from "../../src/car/car.service"
import db from "../../src/Drizzle/db"
import { CarTable } from "../../src/Drizzle/schema"

// mock the modules
jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        CarTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
        }
    }

}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Car Service", () => {
    describe("createCarService", () => {
        it("should insert a car and return the inserted car", async () => {
            const car = {
                carID: 1, 
                carModel: "Toyota Corolla", 
                year: "2020-01-01", 
                color: "Red", 
                rentalRate: "50.00", 
                availability: true, 
                locationID: 1
            };  // Mock todo object to be inserted
            const inserted = { id: 1, ...car };
            // chaining
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([inserted])
                })
            });

            const result = await createCar(car)
            expect(db.insert).toHaveBeenCalledWith(CarTable)
            expect(result).toEqual(inserted)
        })


        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([null])
                })
            })

            const car = {
                carID: 1, 
                carModel: "Toyota Corolla", 
                year: "2020-01-01", 
                color: "Red", 
                rentalRate: "50.00", 
                availability: true, 
                locationID: 1
            };

            const result = await createCar(car);
            expect(result).toBeNull()

        })

        //
    })


    describe("getAllCarsService", () => {
        it("should return all cars", async () => {
            const cars = [
                { carID: 1, carModel: "Toyota Corolla", year: "2020-01-01", color: "Red", rentalRate: "50.00", availability: true, locationID: 1 },
                { carID: 2, carModel: "Toyota Corolla", year: "2020-01-01", color: "Red", rentalRate: "50.00", availability: true, locationID: 2 }
            ];
            (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce(cars)

            const result = await getAllCars()
            expect(result).toEqual(cars)
        })

        it("should return empty array if no cars", async () => {
            (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce([])
            const result = await getAllCars()
            expect(result).toEqual([])
        })
    })


    describe("getCarByIdService", () => {
        it("should return a car if found", async () => {
            const car = {
                carID: 1, 
                carModel: "Toyota Corolla", 
                year: "2020-01-01", 
                color: "Red", 
                rentalRate: "50.00", 
                availability: true, 
                locationID: 1
            };
            (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(car)

            const result = await getCarById(1)
            expect(db.query.CarTable.findFirst).toHaveBeenCalled()
            expect(result).toEqual(car)
        })

        it("should return undefined if not found", async () => {
            (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)
            const result = await getCarById(9999)
            expect(result).toBeUndefined()
        })


    })

    describe("updateCarService", () => {
        it("should update a car and return success message", async () => {
            
            const mockUpdatedCar = {
                carID: 1,
                carModel: "Toyota Corolla",
                year: "2020-01-01",
                color: "Red",
                rentalRate: "50.00",
                availability: true,
                locationID: 1,
                };

                (db.update as jest.Mock).mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([mockUpdatedCar]) 
                    })
                })
        });

    const result = await updateCar(1, mockUpdatedCar);

            expect(db.update).toHaveBeenCalledWith(CarTable)
            expect(result).toEqual(mockUpdatedCar);
        })
    })

    describe("deleteCarService", () => {
        it("should delete a car and return success message", async () => {
            (db.delete as jest.Mock).mockReturnValue({
                where: jest.fn().mockResolvedValueOnce(undefined)
            })

            const result = await deleteCar(1);
            expect(db.delete).toHaveBeenCalledWith(CarTable)
            expect(result).toBe("Car deleted successfully");


        })
    })


})