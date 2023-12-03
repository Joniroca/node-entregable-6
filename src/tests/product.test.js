const request = require("supertest");
const app = require("../app");
require("../models");

let id;
let token;

beforeAll(async () => {
  const bodyUser = {
    email: "test@gmail.com",
    password: "test1324",
  };
  const res = await request(app).post("/users/login").send(bodyUser);
  token = res.body.token;
});

test("GET /products Debe tareme todos los productos", async () => {
  const res = await request(app).get("/products");
  console.log(res.body);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});
test("POST", async () => {});
test("PUT", async () => {});
test("GET-one", async () => {});
test("DELETE", async () => {});
