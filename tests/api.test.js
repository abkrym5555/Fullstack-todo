const request = require("supertest");
const app = require("../index"); // ensure index.js exports app

describe("API Health Check", () => {
  it("should return a 200 OK for the base API route", async () => {
    const res = await request(app).get("/api");
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("ok");
  });
});
