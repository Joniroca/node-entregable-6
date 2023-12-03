const request = require("supertest");
const app = require("../app");

let id;
let token;

test("POST /users Debe crear un usuario", async () => {
  const tempUser = {
    firstName: "memo",
    lastName: "rodriguez",
    email: "ranmahito@gmail.com",
    password: "memo1234",
    phone: "3014766289",
  };
  const res = await request(app).post("/users").send(tempUser);
  id = res.body.id;
  expect(res.status).toBe(201); //201: created status
  expect(res.body.id).toBeDefined(); // if created OK... must have an ID defined in the body answer
  expect(res.body.name).toBe(tempUser.name); // Must match with tempUser's body
});

test("POST /users/login CORRECTO", async () => {
  const body = {
    email: "ranmahito@gmail.com",
    password: "memo1234",
  };
  const res = await request(app).post("/users/login").send(body);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test(`GET /users Debe traer todos los usuarios`, async () => {
  const res = await request(app)
    .get(`/users`)
    .set(`Authorization`, `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("PUT /users/:id Debe actualizar un usuario", async () => {
  const tempUser = {
    firstName: "memo UPDATED",
    lastName: "rodriguez UPDATED",
    phone: "3014766289",
  };
  const res = await request(app)
    .put(`/users/${id}`)
    .send(tempUser)
    .set(`Authorization`, `Bearer ${token}`); // añadimos /:id a la url
  expect(res.status).toBe(200); //200: OK status, acá cambia con respecto al POST
  expect(res.body.id).toBeDefined(); // if modified OK... must have an ID defined in the body answer
  expect(res.body.name).toBe(tempUser.name); // Must match with modelTempObj's body
});

test("POST /users/login INCORRECTO", async () => {
  const wrongBody = {
    email: "incorrecto@gmail.com",
    password: "**********",
  };
  const res = await request(app).post("/users/login").send(wrongBody);
  expect(res.status).toBe(401);
});

test("DELETE /users/:id Debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set(`Authorization`, `Bearer ${token}`);
  expect(res.status).toBe(204); //204: NO CONTENT if success DELETE
});
