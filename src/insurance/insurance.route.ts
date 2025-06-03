import { Express } from "express";
import { createInsuranceController, deleteInsuranceController, getAllInsurancesController, 
    getInsuranceByIdController, getInsurancesByIdController, updateInsuranceController } from "./insurance.controller";





const insurance = (app: Express) => {
    // create insurance
    app.route("/api/insurance").post(
        async (req, res, next) => {
            try {
                await createInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all insurances
    app.route("/api/insurances").get(
        async (req, res, next) => {
            try {
                await getAllInsurancesController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get insurance by ID
    app.route("/api/insurance/:id").get(
        async (req, res, next) => {
            try {
                await getInsuranceByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update insurance
    app.route("/api/insurance/:id").put(
        async (req, res, next) => {
            try {
                await updateInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete insurance
    app.route("/api/insurance/:id").delete(
        async (req, res, next) => {
            try {
                await deleteInsuranceController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple insurance by ID
    app.route("/api/insurances/:id").get(
        async (req, res, next) => {
            try {
                await getInsurancesByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default insurance;


