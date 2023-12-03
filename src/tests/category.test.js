const request = require("supertest");
const app = require("../app");

let token;
let id;

beforeAll(async () => {
  const user = {
    email: "test@gmail.com",
    password: "test1324",
  };
  const res = await request(app).post("/users/login").send(user);
  //   console.log(res.body);
  token = res.body.token;
});

test("GET /categories", async () => {
  const res = await request(app).get("/categories");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /categories", async () => {
  const categoryBody = {
    name: "Category.test",
  };
  const res = await request(app)
    .post("/categories")
    .send(categoryBody)
    .set(`Authorization`, `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
});

test("DELETE /categories/:id Debe eliminar una categoria", async () => {
  // const {id} = req.params;
  const res = await request(app)
    .delete(`/categories/${id}`)
    .set(`Authorization`, `Bearer ${token}`);
  console.log(res.body);
  expect(res.status).toBe(204);
});
