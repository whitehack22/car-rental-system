import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/index';
import db from '../../src/Drizzle/db';
import { CustomerTable } from '../../src/Drizzle/schema'
import { eq } from 'drizzle-orm';



let testCustomer = {
    firstName: "Customer",
    lastName: "Tester",
    email: "customer@mail.com",
    password: "testpass123"
};

beforeAll(async () => {
     // hash pass
    const hashedPassword = bcrypt.hashSync(testCustomer.password, 10)
    await db.insert(CustomerTable).values({
        ...testCustomer,
        password: hashedPassword
    })
})

afterAll(async () => {
    // Clean up the test customer and todo
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testCustomer.email));
    await db.$client.end();
});

describe("Post /api/customer/login", () => {
    it("should authenticate a customer and return a token", async () => {
        const res = await request(app)
            .post("/api/customer/login")
            .send({
                email: testCustomer.email,
                password: testCustomer.password
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("token")
        expect(res.body.customer).toEqual(
        expect.objectContaining({
            customer_id: expect.any(Number),
            first_name: testCustomer.firstName,
            last_name: testCustomer.lastName,
            email: testCustomer.email,
        })
    );
        expect(res.body.message).toBe("Login successfull");
    })

    it("should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/customer/login")
            .send({
                email: testCustomer.email,
                password: "wrongpassword"
            })

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({ message: "Invalid credentials" })
    })

    it("should fail with non-existent customer", async () => {
        const res = await request(app)
            .post("/api/customer/login")
            .send({
                email: "nouser@mail.com",
                password: "irrelevant"
            })

        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual({ message: "Customer not found" })
    })
})
