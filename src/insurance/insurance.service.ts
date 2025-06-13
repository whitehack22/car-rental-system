import db from "../Drizzle/db";
import { InsuranceTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIInsurance } from "../Drizzle/schema";

//Getting all insurances
export const getAllInsurances = async () => {
  const insurances = await db.query.InsuranceTable.findMany()
    return insurances;
};

//Getting insurance by ID
export const getInsuranceById = async (id: number) => {
   const insurance = await db.query.InsuranceTable.findFirst({
        where: eq(InsuranceTable.insuranceID, id)
  })
  return insurance
};

//Create a new insurance
export const createInsurance = async (insurance: TIInsurance) => {
    const [inserted] = await db.insert(InsuranceTable).values(insurance).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update insurance details
export const updateInsurance =  async (id: number, insurance: TIInsurance) => {
    await db.update(InsuranceTable).set(insurance).where(eq(InsuranceTable.insuranceID, id))
    return "Insurance updated successfully";
};

//deleting insurance by ID
export const deleteInsurance = async (id: number) => {
  await db.delete(InsuranceTable).where(eq(InsuranceTable.insuranceID, id))
  return "Insurance deleted successfully";
};

//Getting multiple insurance by ID
export const getInsurancesById = async (id: number) => {
    const insurances = await db.query.InsuranceTable.findMany({
        where: eq(InsuranceTable.insuranceID, id)
    })
    return insurances;
}


