
require("dotenv").config();
const request = require("supertest");
const app = require("../index"); 
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/UserModels");
const jwt =require("jsonwebtoken");

jest.setTimeout(30000);

let authToken = "";
let testUserId = "";
const testUserEmail = "testuser@example.com";
const testUserPassword = "password123";

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ email: testUserEmail });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("User API Full Suite", () => {
  test("Should fail to register a user with missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Test",
      email: testUserEmail,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test for successful user registration
  test("Should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Test",
      lastName: "User",
      email: testUserEmail,
      password: testUserPassword,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // Test for user login
  test("Should log in an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: testUserPassword,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    authToken = res.body.token;
    testUserId = res.body.data._id;
  });

  // Test fetching a user profile
  test("Should get a user profile by ID", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUserEmail);
  });

  // Test updating a user profile
  test("Should update user profile information", async () => {
    const res = await request(app)
      .put("/api/auth/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ firstName: "Updated", lastName: "Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe("Updated");
  });

  // Test changing a user's password
  test("Should change the user password correctly", async () => {
    const res = await request(app)
      .put("/api/auth/profile/change-password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        currentPassword: testUserPassword,
        newPassword: "newpassword123",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password changed successfully.");
  });

  // Test sending a password reset email
  test("Should send a password reset email", async () => {
    const res = await request(app)
      .post("/api/auth/send-reset-link")
      .send({ email: testUserEmail });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Admin-specific tests
  describe("Admin Features", () => {
    // Before running admin tests, update the user to have an 'admin' role
    beforeAll(async () => {
      await User.findByIdAndUpdate(testUserId, { role: "admin" });
    });

    // Test fetching all users as an admin
    test("Should fetch all users as an admin", async () => {
      const res = await request(app)
        .get("/api/admin/user")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    // Test deleting a user by ID as an admin
    test("Should delete a user by ID as an admin", async () => {
      const res = await request(app)
        .delete(`/api/admin/user/${testUserId}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});