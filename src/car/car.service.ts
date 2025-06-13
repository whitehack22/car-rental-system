import db from "../Drizzle/db";
import { CarTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TICar } from "../Drizzle/schema";

//Getting all cars
export const getAllCars = async () => {
  const cars = await db.query.CarTable.findMany()
    return cars;
};

//Getting car by ID
export const getCarById = async (id: number) => {
   const car= await db.query.CarTable.findFirst({
        where: eq(CarTable.carID, id)
  })
  return car
};

//Create a new car
export const createCar = async (car: TICar) => {
    const [inserted] = await db.insert(CarTable).values(car).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update car details
export const updateCar = async (id: number, car: TICar) => {
  const updated = await db
    .update(CarTable)
    .set(car)
    .where(eq(CarTable.carID, id))
    .returning(); 

  if (!updated || updated.length === 0) {
    return null;
  }

  return updated[0]; 
};


//deleting car by ID
export const deleteCar = async (id: number) => {
  await db.delete(CarTable).where(eq(CarTable.carID, id))
  return "Car deleted successfully";
};

//Getting multiple cars by ID
export const getCarsById = async (id: number) => {
    const cars = await db.query.CarTable.findMany({
        where: eq(CarTable.carID, id)
    })
    return cars;
}


