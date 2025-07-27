"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../../server"));
const testUtils_1 = require("../../../utils/testUtils");
describe("Testing authentication flow for user", () => {
    const email = (0, testUtils_1.generateEmailAndPassword)().email;
    const password = (0, testUtils_1.generateEmailAndPassword)().password;
    it("should register user", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/v1/auth/register").send({
            email,
            password,
        });
        expect(response.status).toEqual(201);
    });
    it("should login user", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/v1/auth/login").send({
            email,
            password,
        });
        expect(response.status).toEqual(200);
    });
    it("Should not login with invalid email or password", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/api/v1/auth/login").send({
            email,
            password: "WrongPass_101",
        });
        expect(res.body.message).toContain("Invalid email or password");
    });
    test("Should not login with invalid email or password", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/api/v1/auth/login").send({
            email: "jokanola@qa.team",
            password,
        });
        expect(res.body.message).toContain("Invalid email or password");
    });
});
