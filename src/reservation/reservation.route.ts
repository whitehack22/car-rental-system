import { Express } from "express";
import { createReservationController, deleteReservationController, getAllReservationsController, 
    getReservationByIdController, getReservationsDetailsController, updateReservationController } from "./reservation.controller";





const reservation = (app: Express) => {
    // create reservation
    app.route("/api/reservation").post(
        async (req, res, next) => {
            try {
                await createReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all reservations
    app.route("/api/reservations").get(
        async (req, res, next) => {
            try {
                await getAllReservationsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get reservation by ID
    app.route("/api/reservation/:id").get(
        async (req, res, next) => {
            try {
                await getReservationByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update reservation
    app.route("/api/reservation/:id").put(
        async (req, res, next) => {
            try {
                await updateReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete reservation
    app.route("/api/reservation/:id").delete(
        async (req, res, next) => {
            try {
                await deleteReservationController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple reservations by ID
    app.route("/api/reservations/:id").get(
        async (req, res, next) => {
            try {
                await getReservationByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get reservations with car and customer
    app.route("/api/reservations-details").get(
        async (req, res, next) => {
            try {
                await getReservationsDetailsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

}


export default reservation;


