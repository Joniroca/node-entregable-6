const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Image = require("../models/Image");
const Cart = require("../models/Cart");

// solo get y create de controlladores y endpoints

const getAll = catchError(async (req, res) => {
  //userId = req.user.id -> verifyJWT
  const userId = req.user.id;
  const results = await Purchase.findAll({
    where: { userId },
    include: { model: Product, include: [Image] },
  });
  console.log(res.body);
  return res.json(results);
});

const create = catchError(async (req, res) => {
  // const cart = await Cart.findAll({where: {}})
  const userId = req.user.id;
  const preOrderCart = await Cart.findAll({
    where: { userId },
    attributes: ["userId", "productId", "quantity"],
    // include: { model: Product, include: [Image] },
    raw: true,
  });

  // const createPurchase = await Purchase.bulkCreate(
  //   preOrderCart.product.map((product) => {
  //     const { quantity, productId, userId } = product;
  //     const purchaseInfoInstance = { quantity, productId, userId };
  //     // return newObjArray.push(purchaseInfoInstance);
  //     return purchaseInfoInstance;
  //   })
  // );

  // const createPurchase  = catchError(async(req,res)=>{
  // })

  const order = await Purchase.bulkCreate(preOrderCart);
  await Cart.destroy({ where: { userId } });

  // const result = await Purchase.create(req.body);
  return res.status(201).json(order);
});

module.exports = {
  getAll,
  create,
};
