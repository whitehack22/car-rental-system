import db from "../Drizzle/db";
import { LocationTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TILocation } from "../Drizzle/schema";

//Getting all locations
export const getAllLocations = async () => {
  const locations = await db.query.LocationTable.findMany()
    return locations;
};

//Getting location by ID
export const getLocationById = async (id: number) => {
   const location = await db.query.LocationTable.findFirst({
        where: eq(LocationTable.locationID, id)
  })
  return location
};

//Create a new location
export const createLocation = async (location: TILocation) => {
    const [inserted] = await db.insert(LocationTable).values(location).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update location details
export const updateLocation =  async (id: number, location: TILocation) => {
    const updated = await db
    .update(LocationTable)
    .set(location)
    .where(eq(LocationTable.locationID, id))
    .returning(); 

  if (!updated || updated.length === 0) {
    return null;
  }

  return updated[0];
};

//deleting location by ID
export const deleteLocation = async (id: number) => {
  await db.delete(LocationTable).where(eq(LocationTable.locationID, id))
  return "Location deleted successfully";
};

//Getting multiple locations by ID
export const getLocationsById = async (id: number) => {
    const locations = await db.query.LocationTable.findMany({
        where: eq(LocationTable.locationID, id)
    })
    return locations;
}


