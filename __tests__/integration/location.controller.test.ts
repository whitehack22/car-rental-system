// __tests__/integration/location.controller.test.ts

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { LocationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

let createdLocationId: number;

const testLocation = {
  locationName: "Location", 
  address: "123 Nairobi", 
  contactNumber: "1234567890"
};

afterAll(async () => {
  if (createdLocationId) {
    await db.delete(LocationTable).where(eq(LocationTable.locationID, createdLocationId));
  }
  await db.$client.end();
});

describe("Location API Integration Tests", () => {
  it("should create a location", async () => {
    const res = await request(app).post("/api/location").send(testLocation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Location created successfully");
    expect(res.body.location).toHaveProperty("locationID");

    createdLocationId = res.body.location.locationID;
  });

  it("should get all locations", async () => {
    const res = await request(app).get("/api/locations");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get location by ID", async () => {
    const res = await request(app).get(`/api/location/${createdLocationId}`);

    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      locationID: createdLocationId,
      locationName: testLocation.locationName,
    });
    console.log("LOCATION DATA", res.body.data);
  });

  it("should update a location", async () => {
    const updatedLocation = {
        locationName: "Updated Location", 
        address: "123 Nyeri",
    };

    const res = await request(app)
      .put(`/api/location/${createdLocationId}`)
      .send(updatedLocation);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Location updated successfully");
  });

  it("should delete a location", async () => {
    const res = await request(app).delete(`/api/car/${createdLocationId}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  // ----------------------------
  // 🔴 EDGE CASES BELOW
  // ----------------------------

  it("should return 400 for invalid location ID format", async () => {
    const res = await request(app).get("/api/location/not-a-number");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should return 404 for non-existent location ID", async () => {
    const res = await request(app).get("/api/location/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Location not found");
  });

  it("should not create a location with missing required fields", async () => {
    const res = await request(app)
      .post("/api/location")
      .send({});

    expect(res.statusCode).toBe(500); // Or 400, depending on how validation is handled
    expect(res.body).toHaveProperty("error");
  });

  it("should not update a location with invalid ID", async () => {
    const res = await request(app)
      .put("/api/location/invalid-id")
      .send({ address: "123 Mombasa" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not delete a location with invalid ID", async () => {
    const res = await request(app).delete("/api/location/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not update a non-existent location", async () => {
    const res = await request(app)
      .put("/api/location/999999")
      .send({ address: "123 Kisumu" });

    expect(res.statusCode).toBe(404); // This could be adjusted to 404 if handled
    expect(res.body).toHaveProperty("message", "Location not found");
  });

  it("should not delete a non-existent location", async () => {
    const res = await request(app).delete("/api/location/999999");

    expect(res.statusCode).toBe(204); // You might want to change this to 404 in the controller
  });
});
