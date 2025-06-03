import { Express } from "express";
import { createCustomerController, deleteCustomerController, getAllCustomersController, 
    getCustomerByIdController, getCustomersByIdController, loginCustomerController, updateCustomerController } from "./customer.controller";


const customer = (app: Express) => {
    // create customer
    app.route("/api/customer").post(
        async (req, res, next) => {
            try {
                await createCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all customers
    app.route("/api/customers").get(
        async (req, res, next) => {
            try {
                await getAllCustomersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get customer by ID
    app.route("/api/customer/:id").get(
        async (req, res, next) => {
            try {
                await getCustomerByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update customers
    app.route("/api/customer/:id").put(
        async (req, res, next) => {
            try {
                await updateCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete customers
    app.route("/api/customer/:id").delete(
        async (req, res, next) => {
            try {
                await deleteCustomerController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple customers by ID
    app.route("/api/customers/:id").get(
        async (req, res, next) => {
            try {
                await getCustomersByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // login route
    app.route("/api/customer/login").post(
        async (req, res, next) => {
            try {
                await loginCustomerController(req, res)
            } catch (error) {
                next()
            }
        }

    )
}


export default customer;


