import request from "supertest";
import { server } from "../src/index";
const app = server.expressApp.app;

const mockdata = {
  register: {
    errorNull: {},
    errorMailFormat: {
      email: "test.ext",
      password: "12345678",
    },
    errorPasswordLength: {
      email: "example@test.ext",
      password: "1234567",
    },
    success: {
      email: "example@test.ext",
      password: "12345678",
    },
    existEmail: {
      email: "example@test.ext",
      password: "789456123",
    },
  },
  login: {
    errorNull: {},
    errorMailFormat: {
      email: "test.ext",
      password: "12345678",
    },
    errorPassword: {
      email: "example@test.ext",
      password: "1234567",
    },
    success: {
      email: "example@test.ext",
      password: "12345678",
    },
  },
};

describe("User Service", () => {
  describe("Register", () => {
    it("should return error if email is null", async () => {
      const response = await request(app).post("/register").send(mockdata.register.errorNull);
      expect(response.status).toBe(400);
    });

    it("should return error if email is not valid", async () => {
      const response = await request(app).post("/register").send(mockdata.register.errorMailFormat);
      expect(response.status).toBe(400);
    });

    it("should return error if password is less than 8 characters", async () => {
      const response = await request(app).post("/register").send(mockdata.register.errorPasswordLength);
      expect(response.status).toBe(400);
    });

    it("should return success if email and password is valid", async () => {
      const response = await request(app).post("/register").send(mockdata.register.success);
      expect(response.status).toBe(200);
    });

    it("should return error if email already exist", async () => {
      const response = await request(app).post("/register").send(mockdata.register.existEmail);
      expect(response.status).toBe(409);
    });
  });

  describe("Login", () => {
    it("should return error if email is null", async () => {
      const response = await request(app).post("/login").send(mockdata.login.errorNull);
      expect(response.status).toBe(400);
    });
    it("should return error if email is not valid", async () => {
      const response = await request(app).post("/login").send(mockdata.login.errorMailFormat);
      expect(response.status).toBe(400);
    });
    it("should return error if password is not valid", async () => {
      const response = await request(app).post("/login").send(mockdata.login.errorPassword);
      expect(response.status).toBe(400);
    });
    it("should return success if email and password is valid", async () => {
      const response = await request(app).post("/login").send(mockdata.login.success);
      expect(response.status).toBe(200);
      expect(response.body.data.access_token).toBeDefined();
    });
  });
});
