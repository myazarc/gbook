import request from "supertest";
import { ExpressApp } from "../src/app";
const app = new ExpressApp().app;

describe("User Service", () => {
  test("should be main app status succesed", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});
