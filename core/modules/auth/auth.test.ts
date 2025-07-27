import request from "supertest";
import app from "../../../server";
import { generateEmailAndPassword } from "../../../utils/testUtils";

describe("Testing authentication flow for user", () => {
  const email = generateEmailAndPassword().email;
  const password = generateEmailAndPassword().password;
  it("should register user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email,
      password,
    });
    expect(response.status).toEqual(201);
  });

  it("should login user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email,
      password,
    });
    expect(response.status).toEqual(200)
  });

  it("Should not login with invalid email or password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email,
      password: "WrongPass_101",
    });
    expect(res.body.message).toContain("Invalid email or password");
  });

  test("Should not login with invalid email or password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "jokanola@qa.team",
      password,
    });
    expect(res.body.message).toContain("Invalid email or password");
  });
});
