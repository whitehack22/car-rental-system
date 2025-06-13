import db from "../Drizzle/db";
import { MaintenanceTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIMaintenance } from "../Drizzle/schema";

//Getting all maintenances
export const getAllMaintenances = async () => {
  const maintenances = await db.query.MaintenanceTable.findMany()
    return maintenances;
};

//Getting maintenance by ID
export const getMaintenanceById = async (id: number) => {
   const maintenance = await db.query.MaintenanceTable.findFirst({
        where: eq(MaintenanceTable.maintenanceID, id)
  })
  return maintenance
};

//Create a new maintenance
export const createMaintenance = async (maintenance: TIMaintenance) => {
    const [inserted] = await db.insert(MaintenanceTable).values(maintenance).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update maintenance details
export const updateMaintenance =  async (id: number, maintenance: TIMaintenance) => {
    await db.update(MaintenanceTable).set(maintenance).where(eq(MaintenanceTable.maintenanceID, id))
    return "Maintenance updated successfully";
};

//deleting maintenance by ID
export const deleteMaintenance = async (id: number) => {
  await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceID, id))
  return "Maintenance deleted successfully";
};

//Getting multiple maintenances by ID
export const getMaintenancesById = async (id: number) => {
    const maintenances = await db.query.MaintenanceTable.findMany({
        where: eq(MaintenanceTable.maintenanceID, id)
    })
    return maintenances;
}


