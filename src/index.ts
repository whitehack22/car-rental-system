import { eq } from "drizzle-orm";
import db from "./Drizzle/db";
import { CustomerTable, TICustomer } from "./Drizzle/schema";

const getAllCustomers = async () => {
    return await db.query.CustomerTable.findMany();
}

const getCustomerById = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID)
    })
}

//get customers with reservations
const getCustomerWithReservations = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID),
        with: {
            reservations: true
        }
    })
}

// get customer with bookings
const getCustomerWithBookings = async (customerID: number) => {
    return await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.customerID, customerID),
        with: {
            bookings: {
                columns: {
                    carID: true,
                    rentalStartDate: true,
                    rentalEndDate: true,
                    totalAmount: true
                }
            }
        }
    })
}

//get Customer with selected details
const getCustomerWithSelectedDetails = async ( customerID: number ) => {
    return await db.select({
        firstName: CustomerTable.firstName,
        lastName: CustomerTable.lastName,
        email: CustomerTable.email,
        phoneNumber: CustomerTable.phoneNumber
    })
    .from(CustomerTable)
    .where(eq(CustomerTable.customerID, customerID ))
}

//Fetch location of all cars available
const getLocationWithCars = async () => {
        return await db.query.LocationTable.findMany({
            with: {
                cars: {
                    columns: {
                        carModel: true,
                        color: true,
                        rentalRate: true,
                        availability: true
                    }
                }
            }
        })
    }

//------Insert Customer
const newCustomer = {
    firstName: "Ryan",
    lastName: "Githaiga",
    email:"githaiga@gmail.com",
    phoneNumber: "0722467893",
    address: "South B"
}

const insertCustomer = async(customer:TICustomer) => {
    const insertedCustomer = await db.insert(CustomerTable).values(customer).returning()
    return insertedCustomer;
}

//update the user
const updateCustomer = async(email: string, updatedData: Partial<TICustomer>) => {
    const updatedCustomer = await db.update(CustomerTable)
    .set(updatedData)
    .where(eq(CustomerTable.email, email))
    .returning()
    return updateCustomer
}

//deleting the user
const deleteCustomer = async (customerID: number) => {
    const deletedCustomer = await db.delete(CustomerTable)
    .where(eq(CustomerTable.customerID, customerID))
    .returning()
    return deletedCustomer;
}

async function main() {
    //Fetching all customers
    // const customers = await getAllCustomers()
    // console.log("All Customers:", customers);

    //Fetching one customer
    // const customer = await getCustomerById(5)
    // if (customer) {
    //     console.log("Customer found: ", customer)
        
    // } else {
    //     console.log("Customer not found!");
    // }

    //Fetch customer with reservations
    // const customerWithReservations = await getCustomerWithReservations(3);
    // if(customerWithReservations){
    //     console.log("Customer with Reservation found:" , customerWithReservations);
    // } else {
    //     console.log("Customer with Reservations not found!");
    // }

    //Fetch customer with bookings
    // const customerWithBookings = await getCustomerWithBookings(2);
    // if (customerWithBookings) {
    //     console.log("Customer with bookings found: ", customerWithBookings)
    // } else{
    //     console.log("Customer with bookings not found!")
    // }

    // Fetch a customer with selected details
    // const customerWithSelectedDetails = await getCustomerWithSelectedDetails(4); 
    // if(customerWithSelectedDetails.length > 0){
    //     console.log("Customer with selected details found:", customerWithSelectedDetails[0]);
    // } else {
    //     console.log("Customer with selected details not found");
    // }

    //Fetching locations with all cars available at that location
    // const locationWithCars = await getLocationWithCars();
    // if (locationWithCars.length === 0) {
    //     console.log("No locations found with cars");
    //     return;
    // }
    // locationWithCars.forEach(location => {
    //     console.log(`Location: ${location.locationName}`);
    //     location.cars.forEach(car =>{
    //         console.log(`  -${car.carModel}, ${car.color}, ${car.rentalRate}, ${car.availability}`)
    //     })
    // })
    
    //insert
    // const insertedCustomer = await insertCustomer(newCustomer)
    // if(insertedCustomer.length > 0){
    //     console.log("New customer inserted successfully", insertedCustomer[0])
    // } else {
    //     console.log("Failed to insert new customer!");
    // }

    //update
    // const updatedCustomer = await updateCustomer("john@example.com", {
    //     firstName: "Austin",
    //     lastName: "Kibet",
    //     phoneNumber: "0712345678",
    //     address: "10 Nairobi"
    // })

    // if(updatedCustomer.length > 0) {
    //     console.log("Customer updated successfully:", updatedCustomer)
    // } else {
    //     console.log("Failed to update customer");
    // }

    // delete
    // const deletedCustomer = await deleteCustomer(22)
    // if(deletedCustomer.length > 0) {
    //     console.log("Customer deleted successfully", deletedCustomer[0]);
    // } else {
    //     console.log("Failed to delete customer");
    // }
    
}

//Execute the main function
main().catch((error) =>{
    console.error("Error in main function", error)
    process.exit(1); //Exit with error code
})