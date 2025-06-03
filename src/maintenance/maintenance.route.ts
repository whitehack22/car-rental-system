import { Express } from "express";
import { createMaintenanceController, deleteMaintenanceController, getAllMaintenancesController, getMaintenanceByIdController, getMaintenancesByIdController, updateMaintenanceController } from "./maintenance.controller";




const maintenance = (app: Express) => {
    // create maintenance
    app.route("/api/maintenance").post(
        async (req, res, next) => {
            try {
                await createMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all maintenances
    app.route("/api/maintenances").get(
        async (req, res, next) => {
            try {
                await getAllMaintenancesController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get maintenance by ID
    app.route("/api/maintenance/:id").get(
        async (req, res, next) => {
            try {
                await getMaintenanceByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update maintenance
    app.route("/api/maintenance/:id").put(
        async (req, res, next) => {
            try {
                await updateMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete maintenance
    app.route("/api/maintenance/:id").delete(
        async (req, res, next) => {
            try {
                await deleteMaintenanceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple maintenance by ID
    app.route("/api/maintenances/:id").get(
        async (req, res, next) => {
            try {
                await getMaintenancesByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default maintenance;


