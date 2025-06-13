// __tests__/integration/car.controller.test.ts

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CarTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let createdCarId: number;

const testCar = {
  carModel: "Toyota Corolla", 
  year: "2020-01-01", 
  color: "Red", 
  rentalRate: "50.00", 
  availability: true, 
  locationID: 1
};

afterAll(async () => {
  if (createdCarId) {
    await db.delete(CarTable).where(eq(CarTable.carID, createdCarId));
  }
  await db.$client.end();
});

describe("Car API Integration Tests", () => {
  it("should create a car", async () => {
    const res = await request(app).post("/api/car").send(testCar);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Car created successfully");
    expect(res.body.car).toHaveProperty("carID");

    createdCarId = res.body.car.carID;
  });

  it("should get all cars", async () => {
    const res = await request(app).get("/api/cars");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get car by ID", async () => {
    const res = await request(app).get(`/api/car/${createdCarId}`);

    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      carID: createdCarId,
      carModel: testCar.carModel,
    });
    console.log("CAR DATA", res.body.data);
  });

  it("should update a car", async () => {
    const updatedCar = {
        carModel: "Mazda CX5", 
        year: "2020-02-03",
    };

    const res = await request(app)
      .put(`/api/car/${createdCarId}`)
      .send(updatedCar);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Car updated successfully");
  });

  it("should delete a car", async () => {
    const res = await request(app).delete(`/api/car/${createdCarId}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  // ----------------------------
  // 🔴 EDGE CASES BELOW
  // ----------------------------

  it("should return 400 for invalid car ID format", async () => {
    const res = await request(app).get("/api/car/not-a-number");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should return 404 for non-existent car ID", async () => {
    const res = await request(app).get("/api/car/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Car not found");
  });

  it("should not create a car with missing required fields", async () => {
    const res = await request(app)
      .post("/api/car")
      .send({
        carModel: "Missing Name",
        year: 2023,
      });

    expect(res.statusCode).toBe(500); // Or 400, depending on how validation is handled
    expect(res.body).toHaveProperty("error");
  });

  it("should not update a car with invalid ID", async () => {
    const res = await request(app)
      .put("/api/car/invalid-id")
      .send({ color: "Green" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not delete a car with invalid ID", async () => {
    const res = await request(app).delete("/api/car/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not update a non-existent car", async () => {
    const res = await request(app)
      .put("/api/car/999999")
      .send({ color: "Silver" });

    expect(res.statusCode).toBe(404); // This could be adjusted to 404 if handled
    expect(res.body).toHaveProperty("message", "Car not found");
  });

  it("should not delete a non-existent car", async () => {
    const res = await request(app).delete("/api/car/999999");

    expect(res.statusCode).toBe(204); // You might want to change this to 404 in the controller
  });
});
