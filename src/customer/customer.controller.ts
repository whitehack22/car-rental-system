import { Request, Response } from "express";
import * as customerService from "./customer.service";
import bcrypt from "bcryptjs";
import "dotenv/config"
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";

// get all customers
export const getAllCustomersController = async (_req: Request, res: Response) => {
  try {
    const customers = await customerService.getAllCustomers()
    res.status(200).json({ data: customers })
    return;
  } catch (error: any) {
    console.error("Error fetching customers:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get customer by ID controller
export const getCustomerByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return; 
    }

    res.status(200).json({ data: customer });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a customer controller
export const createCustomerController = async (req: Request, res: Response) => {
  try {

    const customer = req.body;
    const password = customer.password;
    const hashedPassword = await bcrypt.hashSync(password, 10)
    customer.password = hashedPassword

// Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    customer.verificationCode = verificationCode;
    customer.isVerified = false;

    const createCustomer = await customerService.createCustomer(req.body);

    if (!createCustomer) {
      res.status(400).json({ message: "Customer not created" });
      return;
    }
    try {
       await sendEmail(
                customer.email,
                "Verify your account",
                `Hello ${customer.lastName}, your verification code is: ${verificationCode}`,
                `<div>
                <h2>Hello ${customer.lastName},</h2>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                 <p>Enter this code to verify your account.</p>
                </div>`
            );
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }
    res.status(201).json({ message: "User created. Verification code sent to email." });
    return;
  } catch (error: any) {
    console.error("Error creating customer:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Verify customer controller
export const verifyCustomerController = async (req: Request, res: Response) => {
   const { email, code } = req.body;
   try {
     const customer = await customerService.getCustomerByEmailService(email);
     if (!customer) {
          res.status(404).json({ message: "Customer not found" });
          return;
        }

        if (customer.verificationCode === code) {
            await customerService.verifyCustomerService(email);
          
           // Send verification success email
          try {
             await sendEmail(
                    customer.email,
                    "Account Verified Successfully",
                    `Hello ${customer.lastName}, your account has been verified. You can now log in and use all features.`,
                    `<div>
                    <h2>Hello ${customer.lastName},</h2>
                    <p>Your account has been <strong>successfully verified</strong>!</p>
                     <p>You can now log in and enjoy our services.</p>
                     </div>`
                )
          } catch ( error: any ) {
             console.error("Failed to send verification success email:", error);
          }
          res.status(200).json({ message: "User verified successfully" })
          return;
      } else {
          res.status(400).json({ message: "Invalid verification code" })
          return;
        }

   } catch (error: any) {
      res.status(500).json({ error: error.message })
      return;
   }
}



//Update customer controller
export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await customerService.updateCustomer(id, req.body);
    res.status(200).json({ message: "Customer updated successfully", customer: updated });
    return;
  } catch (error: any) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete customer controller
export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await customerService.deleteCustomer(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Get customers with their bookings, car and location details
export const getDetailedCustomerBookingsController = async (req: Request, res: Response) => {
  try {
    const custID = parseInt(req.params.custID, 10);

    if (isNaN(custID)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }
    const result = await customerService.getCustomersWithBookingsAndCarDetails(custID);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching detailed customer bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get multiple customers by ID controller
export const getCustomersByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const customers = await customerService.getCustomersById(id);

    if (!customers || customers.length === 0) {
      res.status(404).json({ message: "No customers found" });
      return;
    }
    res.status(200).json({ data: customers });
    return;
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// login customer controller
export const loginCustomerController = async (req: Request, res: Response) => {
  
  try {
       const customer = req.body;

        // check if the customer exist
        const customerExist = await customerService.customerLoginService(customer)
        if (!customerExist) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // verify the password - 1234donkey
        const customerMatch = await bcrypt.compareSync(customer.password, customerExist.password)
        if (!customerMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // create a payload
        const payload = {
            sub: customerExist.customerID,
            customer_id: customerExist.customerID,
            first_name: customerExist.firstName,
            last_name: customerExist.lastName,
            role: customerExist.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3
        }

        //generate the JWT token
        const secret = process.env.JWT_SECRET as string
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign(payload, secret)

         // return the token with customer info
        return res.status(200).json({
            message: "Login successfull",
            token,
            customer: {
                customer_id: customerExist.customerID,
                first_name: customerExist.firstName,
                last_name: customerExist.lastName,
                email: customerExist.email,
                phoneNumber: customerExist.phoneNumber,
                address: customerExist.address,
                role: customerExist.role
            }
        })
  }  catch (error: any) {
        return res.status(500).json({ error: error.message });
    
  }
}

// Get customers and their bookings
export const getCustomersAndBookingsController = async (req: Request, res: Response) => {
  try {
    const result = await customerService.getCustomersWithBookings();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching customers with bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

