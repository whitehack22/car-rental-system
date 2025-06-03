import { Express } from "express";
import { createLocationController, deleteLocationController, getAllLocationsController, 
    getLocationByIdController, getLocationsByIdController, updateLocationController } from "./location.controller";



const location = (app: Express) => {
    // create location
    app.route("/api/location").post(
        async (req, res, next) => {
            try {
                await createLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all locations
    app.route("/api/locations").get(
        async (req, res, next) => {
            try {
                await getAllLocationsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get location by ID
    app.route("/api/location/:id").get(
        async (req, res, next) => {
            try {
                await getLocationByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update locations
    app.route("/api/location/:id").put(
        async (req, res, next) => {
            try {
                await updateLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete locations
    app.route("/api/location/:id").delete(
        async (req, res, next) => {
            try {
                await deleteLocationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple customers by ID
    app.route("/api/locations/:id").get(
        async (req, res, next) => {
            try {
                await getLocationsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default location;


