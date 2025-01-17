const request = require("supertest");
const app = require("./index");

const bad_uuid ="00000000-0000-4000-8000-000000000000"

describe("Reservation API Tests", () => {
  let appointmentID = ""
  describe("GET /appointments with emtpy list", () => {
    it("should return empty array if no appointments are available", async () => {
      const res = await request(app).get("/appointments");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]); // Expect an empty list
    });
  })
  describe("POST /availability", () => {
    it("should create a new availability block with valid data", async () => {
      const payload = {
        start: "2027-01-02T20:00:00+08:00",
        end: "2027-01-02T20:15:00+08:00",
        providerName: "Dr. Le",
      };
      const res = await request(app).post("/availability").send(payload);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /appointments", () => {
    it("should return a list of appointments", async () => {
      const res = await request(app).get("/appointments");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array); // Expect an array of appointments
      appointmentID = res.body[0].id
    });
  });

  describe("POST /appointments/:appointmentId/reserve", () =>{
    it("should reserve an appointment with valid data", async()=>{
      res = await request(app).post(`/appointments/${appointmentID}/reserve`);
      expect(res.statusCode).toBe(200);
    })

    it("should return error for confirming unknown appointment", async () => {
      const res = await request(app).post(`/appointments/${bad_uuid}/reserve`);
      expect(res.statusCode).toBe(400);
    });
  })

  describe("POST /appointments/:appointmentId/confirm", () => {
    it("should confirm an appointment reservation", async () => {
      res = await request(app).post(`/appointments/${appointmentID}/confirm`);
      expect(res.statusCode).toBe(200);
    });

    it("should return error for confirming unknown appointment", async () => {
      const res = await request(app).post(`/appointments/${bad_uuid}/confirm`);
      expect(res.statusCode).toBe(400);
    });
  });
  afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    app.closeServer();
  });
});


