import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/index';
import db from '../../src/Drizzle/db';
import { CustomerTable } from '../../src/Drizzle/schema';
import { eq } from 'drizzle-orm';

const testCustomer = {
    firstName: "Reg",
    lastName: "Tester",
    email: "registercustomer@mail.com",
    password: "regpass123"
};


afterAll(async () => {
    // Clean up the test user

    await db.delete(CustomerTable).where(eq(CustomerTable.email, testCustomer.email));
    await db.$client.end();
})


describe("Post /auth/register", () => {
    it("should register a new customer successfully", async () => {
        const res = await request(app)
            .post("/api/customer")
            // hash the password
            .send({
                ...testCustomer,
                password: bcrypt.hashSync(testCustomer.password, 10)
            });
        // .send(testCustomer);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User created. Verification code sent to email.");
    }, 10000)

    it("should not register a customer with an existing email", async () => {
        // register the customer again
        await request(app)
            .post("/api/customer")
            .send({
                ...testCustomer,
                password: bcrypt.hashSync(testCustomer.password, 10)
            });

        // try to register the same customer again
        const res = await request(app)
            .post("/api/customer")
            .send({
                ...testCustomer,
                password: bcrypt.hashSync(testCustomer.password, 10)
            });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error")

    })

    it("should not register a customer with missing fields", async () => {
        const res = await request(app)
            .post("/api/customer")
            .send({
                firstName: testCustomer.firstName,
                lastName: testCustomer.lastName,
                email: testCustomer.email
                // missing password
            })

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error")
    })
})