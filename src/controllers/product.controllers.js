const catchError = require("../utils/catchError");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Image = require("../models/Image");

// /products
const getAll = catchError(async (req, res) => {
  const result = await Product.findAll({ include: [Image, Category] });
  return res.json(result);
});
const create = catchError(async (req, res) => {
  const result = await Product.create(req.body); //(...req.body)
  return res.json(result).status(201);
});

// /products/:id
const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByPk(id, { include: [Image, Category] });
  if (!result)
    return res
      .status(404)
      .json({ message: "No se encontró lo que buscas.... creo XD" });
  return res.json(result);
});

//put
const update = catchError(async (req, res) => {
  const { id } = req.params;
  const { categoryId } = req.body;
  const result = await Product.update(
    { categoryId },
    { where: { id }, returning: true }
  );
  return res.json(result);
});

// deleetee
const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Product.destroy({ where: { id } });
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  getOne,
  update,
  remove,
};
